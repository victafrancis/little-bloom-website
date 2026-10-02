import { getInstagramPosts, InstagramNotConfiguredError, reportError } from './_instagram.js';

// Cache at Vercel's edge so Instagram is asked at most about once an hour
const SUCCESS_CACHE = 'public, s-maxage=3600, stale-while-revalidate=86400';
const FAILURE_CACHE = 'public, s-maxage=300';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const posts = await getInstagramPosts();
    res.setHeader('Cache-Control', SUCCESS_CACHE);
    return res.status(200).json({ posts });
  } catch (error) {
    // The site shows gallery photos instead, so a missing token is only logged
    if (error instanceof InstagramNotConfiguredError) {
      console.warn('[api/instagram] INSTAGRAM_ACCESS_TOKEN is not set; the site will show gallery photos instead.');
    } else {
      console.error('[api/instagram] Failed to load the Instagram feed:', error);
      await reportError(error, 'instagram_feed');
    }
    res.setHeader('Cache-Control', FAILURE_CACHE);
    return res.status(503).json({ posts: [] });
  }
}
