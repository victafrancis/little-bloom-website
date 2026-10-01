import { createClient } from '@supabase/supabase-js';
import * as Sentry from '@sentry/react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

type StorageFile = { name: string; created_at?: string | null; updated_at?: string | null };

const IMAGE_FILE_PATTERN = /\.(jpg|jpeg|png|webp|gif)$/i;
const DEFAULT_COVER_FILENAME = '00.jpg';
const NETWORK_RETRY_DELAY_MS = 1000;

// Browsers word a dropped connection differently: Chrome, Safari, Firefox
const NETWORK_ERROR_PATTERN = /Failed to fetch|Load failed|NetworkError when attempting to fetch resource/i;

const isNetworkError = (error: unknown): boolean =>
  error instanceof Error && NETWORK_ERROR_PATTERN.test(error.message);

// A dropped connection on the visitor's side is not a bug, so report it as a warning
const reportGalleryError = (error: unknown, slug: string, operation: string) => {
  Sentry.captureException(error, {
    level: isNetworkError(error) ? 'warning' : 'error',
    tags: { gallery_slug: slug, operation },
    extra: { slug }
  });
};

const listAlbumFolder = async (slug: string) => {
  const { data, error } = await supabase.storage
    .from('albums')
    .list(slug, {
      limit: 100,
      offset: 0
    });

  if (error) {
    throw error;
  }

  return data ?? [];
};

// Cache folder listings so the cover lookup and the gallery images share one request
const galleryFilesCache = new Map<string, Promise<StorageFile[]>>();

const listGalleryImageFiles = (slug: string): Promise<StorageFile[]> => {
  const cached = galleryFilesCache.get(slug);
  if (cached) {
    return cached;
  }

  const request = Sentry.startSpan(
    {
      op: 'http.client',
      name: `GET /storage/albums/${slug}`,
    },
    async (span) => {
      span.setAttribute('gallery_slug', slug);

      let files: StorageFile[];
      try {
        files = await listAlbumFolder(slug);
      } catch (error) {
        if (!isNetworkError(error)) {
          throw error;
        }
        // Retry once, since flaky mobile connections usually recover quickly
        span.setAttribute('retried', true);
        await new Promise(resolve => setTimeout(resolve, NETWORK_RETRY_DELAY_MS));
        files = await listAlbumFolder(slug);
      }

      // Filter to get only image files (not folders)
      const imageFiles = files
        .filter(item => IMAGE_FILE_PATTERN.test(item.name))
        .sort((a, b) => a.name.localeCompare(b.name));

      span.setAttribute('image_count', imageFiles.length);
      return imageFiles;
    }
  );

  galleryFilesCache.set(slug, request);
  // Don't keep failed requests around so the next call can retry
  request.catch(() => galleryFilesCache.delete(slug));
  return request;
};

export const getGalleryImages = async (slug: string): Promise<string[]> => {
  try {
    const imageFiles = await listGalleryImageFiles(slug);
    // Show the current cover first, followed by the rest in filename order
    const cover = findCoverFile(imageFiles);
    const orderedFiles = cover
      ? [cover, ...imageFiles.filter(file => file !== cover)]
      : imageFiles;
    return orderedFiles.map(file => getCoverImageUrl(slug, file.name));
  } catch (error) {
    reportGalleryError(error, slug, 'get_gallery_images');
    return [];
  }
};

export const getCoverImageUrl = (slug: string, filename: string): string => {
  const { data } = supabase.storage
    .from('albums')
    .getPublicUrl(`${slug}/${filename}`);

  return data.publicUrl;
};

// The cover is any image whose name starts with "cover" (e.g. cover-2.jpg).
// Use a new name each time the cover changes so the CDN never serves a stale copy.
// If several exist, the most recently uploaded wins; with none, fall back to 00.jpg.
const findCoverFile = (imageFiles: StorageFile[]): StorageFile | undefined => {
  const uploadedAt = (file: StorageFile) =>
    Date.parse(file.updated_at ?? file.created_at ?? '') || 0;
  const [latestCover] = imageFiles
    .filter(file => file.name.toLowerCase().startsWith('cover'))
    .sort((a, b) => uploadedAt(b) - uploadedAt(a));

  return latestCover ?? imageFiles.find(file => file.name === DEFAULT_COVER_FILENAME);
};

export const getGalleryCoverUrl = async (slug: string): Promise<string> => {
  try {
    const imageFiles = await listGalleryImageFiles(slug);
    const cover = findCoverFile(imageFiles);

    return getCoverImageUrl(slug, cover?.name ?? DEFAULT_COVER_FILENAME);
  } catch (error) {
    reportGalleryError(error, slug, 'get_gallery_cover');
    return getCoverImageUrl(slug, DEFAULT_COVER_FILENAME);
  }
};
