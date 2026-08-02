const { join } = require('path');

/**
 * Keep the downloaded browser inside node_modules so it shares a lifetime with
 * the dependency tree. Vercel caches node_modules between builds; the default
 * (~/.cache/puppeteer) is not cached, so a restored node_modules would skip the
 * install hook and leave prerendering without a browser.
 */
module.exports = {
  cacheDirectory: join(__dirname, 'node_modules', '.cache', 'puppeteer'),
};
