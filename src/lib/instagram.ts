import { galleryConfigs } from '../data/galleries';
import { site } from '../data/siteMeta';
import { getGalleryImages } from './supabase';

export type InstagramPostType = 'image' | 'video' | 'carousel';

export type InstagramPost = {
  id: string;
  permalink: string;
  imageUrl: string;
  alt: string;
  type: InstagramPostType;
};

export type InstagramFeedData = {
  source: 'instagram' | 'gallery';
  posts: InstagramPost[];
};

const FEED_ENDPOINT = '/api/instagram';
const FALLBACK_PHOTOS_PER_GALLERY = 4;

const isInstagramPost = (value: unknown): value is InstagramPost => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const post = value as Record<string, unknown>;
  return typeof post.id === 'string'
    && typeof post.permalink === 'string'
    && typeof post.imageUrl === 'string'
    && typeof post.alt === 'string'
    && typeof post.type === 'string';
};

const fetchInstagramPosts = async (): Promise<InstagramPost[]> => {
  try {
    const response = await fetch(FEED_ENDPOINT);
    if (!response.ok) {
      return [];
    }
    const body: unknown = await response.json();
    const posts = (body as { posts?: unknown } | null)?.posts;
    return Array.isArray(posts) ? posts.filter(isInstagramPost) : [];
  } catch {
    // The API reports its own failures; here we just fall back to gallery photos
    return [];
  }
};

// Until Instagram is connected, or if it ever fails, show gallery favourites
// instead so the section never sits empty. Covers come first in each gallery.
const getGalleryPosts = async (): Promise<InstagramPost[]> => {
  const galleries = await Promise.all(galleryConfigs.map(async gallery => ({
    title: gallery.title,
    images: (await getGalleryImages(gallery.slug)).slice(0, FALLBACK_PHOTOS_PER_GALLERY)
  })));

  // Interleave the galleries so neighbouring tiles come from different sessions
  const posts: InstagramPost[] = [];
  for (let index = 0; index < FALLBACK_PHOTOS_PER_GALLERY; index++) {
    galleries.forEach(({ title, images }) => {
      if (images[index]) {
        posts.push({
          id: images[index],
          permalink: site.socials.instagram,
          imageUrl: images[index],
          alt: `${title} session by Little Bloom Photography`,
          type: 'image'
        });
      }
    });
  }
  return posts;
};

const loadInstagramFeed = async (): Promise<InstagramFeedData> => {
  const instagramPosts = await fetchInstagramPosts();
  if (instagramPosts.length > 0) {
    return { source: 'instagram', posts: instagramPosts };
  }
  return { source: 'gallery', posts: await getGalleryPosts() };
};

// Shared across pages so the feed is only requested once per visit
let feedRequest: Promise<InstagramFeedData> | null = null;

export const getInstagramFeed = (): Promise<InstagramFeedData> => {
  if (!feedRequest) {
    feedRequest = loadInstagramFeed();
    // Let a failed or empty load try again next time
    feedRequest.then(feed => {
      if (feed.posts.length === 0) {
        feedRequest = null;
      }
    });
  }
  return feedRequest;
};
