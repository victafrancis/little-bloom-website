/**
 * Post-build prerender step.
 *
 * Serves the freshly built `dist/`, loads every route in headless Chromium,
 * waits for React (and Helmet, and the page transition) to settle, then writes
 * the resulting markup back to disk as `dist/<route>/index.html`.
 *
 * Why a real browser rather than renderToString: `src/data/notes.ts` parses the
 * note HTML with `DOMParser` at module scope, so the app cannot be rendered in
 * bare Node without restructuring it. A browser also guarantees the static
 * output matches what a visitor actually sees.
 *
 * This step is fail-open by design. Any failure leaves the normal SPA build in
 * place and exits 0, so a prerender problem can never break a deploy.
 */
import { createServer } from 'node:http';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sirv from 'sirv';
import { getRoutes } from './routes.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');

// Long enough for the 0.5s framer-motion page transition plus slack.
const SETTLE_TIMEOUT_MS = 20_000;

// Telemetry and analytics have nothing to contribute to static markup, and
// their requests may never settle in a sandboxed build. Blocking them also
// stops the build from firing pageview hits at real analytics properties.
const BLOCKED_HOSTS = [
  'googletagmanager.com',
  'google-analytics.com',
  'vercel-insights.com',
  'vercel-scripts.com',
  'sentry.io',
];

function startServer() {
  // single: SPA fallback, so /pricing resolves before it has been written.
  const handler = sirv(dist, { dev: true, single: true });
  const server = createServer(handler);
  return new Promise((resolvePromise, reject) => {
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => resolvePromise(server));
  });
}

/**
 * Runs in the page. Resolves once the app has actually painted:
 * root has content, Helmet has written a title, and the page-transition
 * wrapper has finished animating up from opacity 0.
 */
function waitForAppReady() {
  const rootEl = document.getElementById('root');
  if (!rootEl || rootEl.children.length === 0) return false;
  if (!document.title) return false;

  const main = rootEl.querySelector('main');
  if (!main) return false;

  // framer-motion animates a wrapper from opacity 0 -> 1. Baking opacity 0
  // into the static HTML would hide the content from crawlers.
  const animated = rootEl.querySelectorAll('[style*="opacity"]');
  for (const el of animated) {
    if (parseFloat(getComputedStyle(el).opacity) < 0.99) return false;
  }
  return true;
}

/**
 * Runs in the page. framer-motion drives the page transition through the Web
 * Animations API, which updates the *computed* opacity while leaving the inline
 * `style="opacity: 0"` from the initial variant untouched. Serializing outerHTML
 * would then bake that stale 0 in and hide the whole page from crawlers.
 *
 * Where computed opacity says visible but the inline style says otherwise, sync
 * the inline value. Elements that are genuinely hidden (closed menus, the
 * lightbox) compute to 0 as well and are deliberately left alone.
 */
function settleInlineOpacity() {
  const rootEl = document.getElementById('root');
  if (!rootEl) return;
  for (const el of rootEl.querySelectorAll('[style*="opacity"]')) {
    const inline = parseFloat(el.style.opacity);
    if (Number.isNaN(inline) || inline >= 0.99) continue;
    if (parseFloat(getComputedStyle(el).opacity) >= 0.99) {
      el.style.opacity = '1';
    }
  }
}

/**
 * Runs in the page. index.html ships static SEO defaults; Helmet then injects
 * its own per-route versions (marked data-rh). Both survive into the snapshot,
 * which would leave two descriptions / canonicals on every page. Drop the
 * static one wherever Helmet has supplied a replacement.
 */
function dedupeHeadTags() {
  const keyOf = el => {
    if (el.tagName === 'TITLE') return 'title';
    if (el.tagName === 'LINK') return `link:${el.getAttribute('rel')}`;
    const name = el.getAttribute('name') || el.getAttribute('property');
    return name ? `meta:${name}` : null;
  };

  const managed = new Set();
  for (const el of document.head.querySelectorAll('[data-rh]')) {
    const key = keyOf(el);
    if (key) managed.add(key);
  }

  for (const el of [...document.head.children]) {
    if (el.hasAttribute('data-rh')) continue;
    const key = keyOf(el);
    if (key && managed.has(key)) el.remove();
  }
}

async function main() {
  const routes = getRoutes();
  const server = await startServer();
  const { port } = server.address();
  const origin = `http://127.0.0.1:${port}`;

  const { default: puppeteer } = await import('puppeteer');
  const browser = await puppeteer.launch({
    // PUPPETEER_EXECUTABLE_PATH lets a machine with its own Chromium skip the
    // bundled download; unset (CI, Vercel) falls back to puppeteer's browser.
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });

  let written = 0;
  const failed = [];

  try {
    for (const route of routes) {
      const page = await browser.newPage();
      // Desktop viewport: Hero picks its background image from window width.
      await page.setViewport({ width: 1280, height: 900 });
      await page.setRequestInterception(true);
      page.on('request', request => {
        const blocked = BLOCKED_HOSTS.some(host => request.url().includes(host));
        return blocked ? request.abort() : request.continue();
      });
      try {
        // Readiness is decided by waitForAppReady below, not by network idle:
        // remote images (Supabase galleries) must not gate the snapshot.
        await page.goto(`${origin}${route}`, {
          waitUntil: 'domcontentloaded',
          timeout: SETTLE_TIMEOUT_MS,
        });
        await page.waitForFunction(waitForAppReady, { timeout: SETTLE_TIMEOUT_MS });
        await page.evaluate(settleInlineOpacity);
        await page.evaluate(dedupeHeadTags);

        const html = await page.evaluate(() => `<!doctype html>\n${document.documentElement.outerHTML}`);

        const outDir = route === '/' ? dist : resolve(dist, `.${route}`);
        mkdirSync(outDir, { recursive: true });
        writeFileSync(resolve(outDir, 'index.html'), html, 'utf8');
        written += 1;
        console.log(`  prerendered ${route}`);
      } catch (error) {
        failed.push(route);
        console.warn(`  skipped ${route}: ${error.message.split('\n')[0]}`);
      } finally {
        await page.close();
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log(`\nPrerendered ${written}/${routes.length} routes.`);
  if (failed.length) {
    console.warn(`Left as client-rendered: ${failed.join(', ')}`);
  }
}

main().catch(error => {
  // Never fail the build: dist/ already holds a working SPA.
  console.warn('\nPrerendering skipped entirely:', error.message);
  console.warn('The build output is still a valid client-rendered site.');
});
