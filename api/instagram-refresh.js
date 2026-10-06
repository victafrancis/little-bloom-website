import { refreshTokenIfDue, reportError } from './_instagram.js';

// Called daily by the Vercel cron in vercel.json; refreshes the token once a week
export default async function handler(req, res) {
  // eslint-disable-next-line no-undef
  const cronSecret = process.env.CRON_SECRET;
  // Vercel sends CRON_SECRET as a bearer token when it is set
  if (cronSecret && req.headers.authorization !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.setHeader('Cache-Control', 'no-store');
  try {
    const result = await refreshTokenIfDue();
    console.log('[api/instagram-refresh]', result);
    return res.status(200).json(result);
  } catch (error) {
    console.error('[api/instagram-refresh] Failed to refresh the Instagram token:', error);
    await reportError(error, 'instagram_token_refresh');
    return res.status(500).json({ error: 'Failed to refresh the Instagram token' });
  }
}
