import { Buffer } from 'node:buffer';
import { isValidImageSignature } from './_instagram-image-signature.js';

const ALLOWED_HOST_PATTERN = /(^|\.)(cdninstagram\.com|fbcdn\.net)$/i;
const REQUEST_TIMEOUT_MS = 8000;
// A signed media URL always points at the same image, so the edge can keep it
// for a long time, even after Instagram's link expires
const SUCCESS_CACHE = 'public, max-age=86400, s-maxage=2592000, immutable';
const FAILURE_CACHE = 'public, s-maxage=60';

const parseImageUrl = (value) => {
  try {
    const url = new URL(String(value ?? ''));
    return url.protocol === 'https:' && ALLOWED_HOST_PATTERN.test(url.hostname) ? url : null;
  } catch {
    return null;
  }
};

// Serves Instagram images from our own domain, since Instagram's CDN can block
// them from loading directly on other sites
export default async function handler(req, res) {
  const { url, sig } = req.query;
  const imageUrl = parseImageUrl(url);
  if (req.method !== 'GET' || !imageUrl || !isValidImageSignature(String(url), sig)) {
    return res.status(400).json({ error: 'Invalid image request' });
  }

  try {
    const upstream = await fetch(imageUrl, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
    const contentType = upstream.headers.get('content-type') ?? '';
    // Expired links are expected now and then, so they are not reported to Sentry
    if (!upstream.ok || !contentType.startsWith('image/')) {
      console.warn(`[api/instagram-image] Instagram responded with ${upstream.status} (${contentType})`);
      res.setHeader('Cache-Control', FAILURE_CACHE);
      return res.status(502).json({ error: 'Image unavailable' });
    }

    const body = Buffer.from(await upstream.arrayBuffer());
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', SUCCESS_CACHE);
    return res.status(200).send(body);
  } catch (error) {
    console.warn('[api/instagram-image] Failed to fetch the image:', error);
    res.setHeader('Cache-Control', FAILURE_CACHE);
    return res.status(502).json({ error: 'Image unavailable' });
  }
}
