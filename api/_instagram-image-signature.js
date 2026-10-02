// Signs the Instagram image URLs the feed hands out, so api/instagram-image
// proxies our own posts only and can't be used as an open proxy.
import { Buffer } from 'node:buffer';
import { createHmac, timingSafeEqual } from 'node:crypto';

const getSigningKey = () => {
  // eslint-disable-next-line no-undef
  const key = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!key) {
    throw new Error('INSTAGRAM_ACCESS_TOKEN is not set');
  }
  return key;
};

export const signImageUrl = (url) =>
  createHmac('sha256', getSigningKey()).update(url).digest('base64url');

export const isValidImageSignature = (url, signature) => {
  // eslint-disable-next-line no-undef
  if (!process.env.INSTAGRAM_ACCESS_TOKEN) {
    return false;
  }
  const expected = Buffer.from(signImageUrl(url));
  const received = Buffer.from(String(signature ?? ''));
  return expected.length === received.length && timingSafeEqual(expected, received);
};
