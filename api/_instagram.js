// Shared helpers; Vercel doesn't deploy "_" files in api/ as functions
import { createClient } from '@supabase/supabase-js';
import * as Sentry from '@sentry/node';
import { signImageUrl } from './_instagram-image-signature.js';

Sentry.init({
  // eslint-disable-next-line no-undef
  dsn: process.env.SENTRY_DSN || process.env.VITE_SENTRY_DSN,
  // eslint-disable-next-line no-undef
  environment: process.env.VERCEL_ENV || 'development',
});

// eslint-disable-next-line no-undef
const env = process.env;

const GRAPH_URL = 'https://graph.instagram.com';
const MEDIA_FIELDS = 'id,caption,media_type,media_url,thumbnail_url,permalink,children{media_type,media_url,thumbnail_url}';
const PAGE_SIZE = 25;
const MAX_POSTS = 50;
const REQUEST_TIMEOUT_MS = 8000;
const INVALID_TOKEN_CODE = 190;

// Long-lived tokens expire 60 days after they were issued or last refreshed
const REFRESH_AFTER_MS = 7 * 24 * 60 * 60 * 1000;
const TOKEN_TABLE = 'instagram_token';
const TOKEN_ROW_ID = 1;

const POST_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
  CAROUSEL_ALBUM: 'carousel',
};
const DEFAULT_ALT = 'Instagram post by Little Bloom Photography';
const MAX_ALT_LENGTH = 120;

export class InstagramNotConfiguredError extends Error {
  constructor() {
    super('INSTAGRAM_ACCESS_TOKEN is not set');
    this.name = 'InstagramNotConfiguredError';
  }
}

class InstagramApiError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'InstagramApiError';
    this.code = code;
  }
}

const isInvalidTokenError = (error) =>
  error instanceof InstagramApiError && error.code === INVALID_TOKEN_CODE;

export const reportError = async (error, operation) => {
  Sentry.captureException(error, { tags: { operation } });
  // Serverless functions can freeze right after responding, so send the event first
  await Sentry.flush(2000);
};

const graphRequest = async (url) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body.error) {
    throw new InstagramApiError(
      body.error?.message ?? `Instagram responded with ${response.status}`,
      body.error?.code
    );
  }
  return body;
};

// The env token seeds the instagram_token table, where the cron keeps it refreshed

const getTokenStore = () => {
  const url = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    return null;
  }
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
};

const readStoredToken = async (store) => {
  const { data, error } = await store
    .from(TOKEN_TABLE)
    .select('access_token, refreshed_at')
    .eq('id', TOKEN_ROW_ID)
    .maybeSingle();
  if (error) {
    throw new Error(`Could not read the Instagram token from Supabase: ${error.message}`);
  }
  return data;
};

const saveToken = async (store, accessToken, expiresInSeconds) => {
  const now = Date.now();
  const { error } = await store.from(TOKEN_TABLE).upsert({
    id: TOKEN_ROW_ID,
    access_token: accessToken,
    refreshed_at: new Date(now).toISOString(),
    expires_at: expiresInSeconds ? new Date(now + expiresInSeconds * 1000).toISOString() : null,
  });
  if (error) {
    throw new Error(`Could not save the Instagram token to Supabase: ${error.message}`);
  }
};

const getEnvToken = () => {
  const token = env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
    throw new InstagramNotConfiguredError();
  }
  return token;
};

// Returns the newest token we have, adopting the env token on the first run
const getStoredOrEnvToken = async (store) => {
  const envToken = getEnvToken();
  if (!store) {
    return envToken;
  }
  try {
    const stored = await readStoredToken(store);
    if (stored) {
      return stored.access_token;
    }
    await saveToken(store, envToken);
  } catch (error) {
    // Keep the feed up with the env token while the table is unreachable
    await reportError(error, 'instagram_token_read');
  }
  return envToken;
};

export const refreshTokenIfDue = async () => {
  const store = getTokenStore();
  if (!store) {
    return { refreshed: false, reason: 'Supabase is not configured, so the token cannot be refreshed' };
  }
  const envToken = getEnvToken();
  const stored = await readStoredToken(store);
  if (!stored) {
    await saveToken(store, envToken);
    return { refreshed: false, reason: 'Saved the token from INSTAGRAM_ACCESS_TOKEN' };
  }
  const refreshedAt = Date.parse(stored.refreshed_at) || 0;
  if (Date.now() - refreshedAt < REFRESH_AFTER_MS) {
    return { refreshed: false, reason: 'Not due yet', refreshedAt: stored.refreshed_at };
  }
  const body = await graphRequest(
    `${GRAPH_URL}/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(stored.access_token)}`
  );
  await saveToken(store, body.access_token, body.expires_in);
  return { refreshed: true };
};

// Instagram's CDN can block images on other sites, so they go through our signed proxy

const toProxiedImageUrl = (url) =>
  `/api/instagram-image?url=${encodeURIComponent(url)}&sig=${signImageUrl(url)}`;

const getThumbnailUrl = (media) => {
  if (media.media_type === 'VIDEO') {
    return media.thumbnail_url;
  }
  if (media.media_type === 'CAROUSEL_ALBUM') {
    const [first] = media.children?.data ?? [];
    if (first) {
      return first.media_type === 'VIDEO' ? first.thumbnail_url : first.media_url;
    }
  }
  return media.media_url;
};

// Use the caption's opening words as alt text, minus hashtags and mentions
const describeCaption = (caption) => {
  const text = (caption ?? '')
    .replace(/[#@][\p{L}\p{N}_.]+/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) {
    return DEFAULT_ALT;
  }
  return text.length > MAX_ALT_LENGTH ? `${text.slice(0, MAX_ALT_LENGTH - 1).trimEnd()}…` : text;
};

const toPost = (media) => {
  const thumbnailUrl = getThumbnailUrl(media);
  if (!thumbnailUrl || !media.permalink) {
    return null;
  }
  return {
    id: media.id,
    permalink: media.permalink,
    imageUrl: toProxiedImageUrl(thumbnailUrl),
    alt: describeCaption(media.caption),
    type: POST_TYPES[media.media_type] ?? 'image',
  };
};

const fetchPosts = async (token) => {
  const posts = [];
  let url = `${GRAPH_URL}/me/media?fields=${encodeURIComponent(MEDIA_FIELDS)}&limit=${PAGE_SIZE}&access_token=${encodeURIComponent(token)}`;
  while (url && posts.length < MAX_POSTS) {
    const page = await graphRequest(url);
    posts.push(...(page.data ?? []).map(toPost).filter(Boolean));
    url = page.paging?.next;
  }
  return posts.slice(0, MAX_POSTS);
};

export const getInstagramPosts = async () => {
  const store = getTokenStore();
  const token = await getStoredOrEnvToken(store);
  try {
    return await fetchPosts(token);
  } catch (error) {
    // After reconnecting Instagram, the new INSTAGRAM_ACCESS_TOKEN replaces the stored one
    const envToken = getEnvToken();
    if (!store || !isInvalidTokenError(error) || envToken === token) {
      throw error;
    }
    const posts = await fetchPosts(envToken);
    await saveToken(store, envToken);
    return posts;
  }
};
