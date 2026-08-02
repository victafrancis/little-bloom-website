import { readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// Slugs live in the source of truth for each feature, so the prerender list
// can't drift out of sync when a note or gallery is added.
function noteSlugs() {
  return readdirSync(resolve(root, 'src/data/notes'))
    .filter(name => name.endsWith('.html'))
    .map(name => name.replace(/\.html$/, ''));
}

function gallerySlugs() {
  const source = readFileSync(resolve(root, 'src/data/galleries.ts'), 'utf8');
  return [...source.matchAll(/slug:\s*'([^']+)'/g)].map(match => match[1]);
}

// /faq is intentionally absent: the route is commented out in router.tsx.
export function getRoutes() {
  return [
    '/',
    '/about',
    '/pricing',
    '/gallery',
    ...gallerySlugs().map(slug => `/gallery/${slug}`),
    '/notes',
    ...noteSlugs().map(slug => `/notes/${slug}`),
    '/contact',
  ];
}
