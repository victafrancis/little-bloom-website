import { createClient, PostgrestError } from '@supabase/supabase-js';
import * as Sentry from '@sentry/react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Visitors only read the albums, so turn off the login session handling.
// Its 30s refresh timer takes a browser lock, which crashed on some visitors' browsers.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

export type StorageFile = { name: string; created_at?: string | null; updated_at?: string | null };
type AlbumPhotoRow = { album_slug: string; storage_path: string };

const ALBUMS_BUCKET = 'albums';
const IMAGE_FILE_PATTERN = /\.(jpg|jpeg|png|webp|gif)$/i;
const DEFAULT_COVER_FILENAME = '00.jpg';
const NETWORK_RETRY_DELAY_MS = 1000;
// Supabase's API returns at most 1000 rows per request
const ALBUM_PHOTOS_PAGE_SIZE = 1000;
// PostgREST's answer while the album_photos table hasn't been created yet
const MISSING_TABLE_CODES = ['PGRST205', '42P01'];

// Browsers word a dropped connection differently: Chrome, Safari, Firefox
const NETWORK_ERROR_PATTERN = /Failed to fetch|Load failed|NetworkError when attempting to fetch resource/i;

const isNetworkError = (error: unknown): boolean =>
  error instanceof Error && NETWORK_ERROR_PATTERN.test(error.message);

const isMissingTableError = (error: unknown): boolean =>
  error instanceof PostgrestError && MISSING_TABLE_CODES.includes(error.code);

// A dropped connection on the visitor's side is not a bug, so report it as a warning
const reportGalleryError = (error: unknown, slug: string, operation: string) => {
  Sentry.captureException(error, {
    level: isNetworkError(error) ? 'warning' : 'error',
    tags: { gallery_slug: slug, operation },
    extra: { slug }
  });
};

// Retry once, since flaky mobile connections usually recover quickly
const withNetworkRetry = async <T>(request: () => Promise<T>, onRetry: () => void): Promise<T> => {
  try {
    return await request();
  } catch (error) {
    if (!isNetworkError(error)) {
      throw error;
    }
    onRetry();
    await new Promise(resolve => setTimeout(resolve, NETWORK_RETRY_DELAY_MS));
    return request();
  }
};

export const getPhotoUrl = (path: string): string => {
  const { data } = supabase.storage
    .from(ALBUMS_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
};

// The album_photos table lists each album's photos in order (see docs/album-manager.md)
const fetchAlbumPhotoRows = async (): Promise<AlbumPhotoRow[]> => {
  const rows: AlbumPhotoRow[] = [];
  let pageSize: number;
  do {
    const { data } = await supabase
      .from('album_photos')
      .select('album_slug, storage_path')
      .order('album_slug')
      .order('position')
      .range(rows.length, rows.length + ALBUM_PHOTOS_PAGE_SIZE - 1)
      .throwOnError();
    rows.push(...data);
    pageSize = data.length;
  } while (pageSize === ALBUM_PHOTOS_PAGE_SIZE);
  return rows;
};

const groupPathsByAlbum = (rows: AlbumPhotoRow[]): Map<string, string[]> => {
  const albumOrder = new Map<string, string[]>();
  rows.forEach(({ album_slug, storage_path }) => {
    const paths = albumOrder.get(album_slug);
    if (paths) {
      paths.push(storage_path);
    } else {
      albumOrder.set(album_slug, [storage_path]);
    }
  });
  return albumOrder;
};

// Every album loads in one request, so the Home page's four covers share it
let albumOrderRequest: Promise<Map<string, string[]>> | null = null;

const loadAlbumOrder = (): Promise<Map<string, string[]>> => {
  if (albumOrderRequest) {
    return albumOrderRequest;
  }

  const request = Sentry.startSpan(
    {
      op: 'http.client',
      name: 'GET /rest/album_photos',
    },
    async (span) => {
      try {
        const rows = await withNetworkRetry(fetchAlbumPhotoRows, () => span.setAttribute('retried', true));
        span.setAttribute('photo_count', rows.length);
        return groupPathsByAlbum(rows);
      } catch (error) {
        // Until the table is set up, every album loads from its folder
        if (isMissingTableError(error)) {
          return new Map<string, string[]>();
        }
        throw error;
      }
    }
  );

  albumOrderRequest = request;
  // Don't keep a failed request around so the next call can retry
  request.catch(() => {
    albumOrderRequest = null;
  });
  return request;
};

// Albums that aren't in the album_photos table yet still load from their folder

const listAlbumFolder = async (slug: string) => {
  const { data, error } = await supabase.storage
    .from(ALBUMS_BUCKET)
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

      const files = await withNetworkRetry(() => listAlbumFolder(slug), () => span.setAttribute('retried', true));
      const imageFiles = orderFolderFiles(files);

      span.setAttribute('image_count', imageFiles.length);
      return imageFiles;
    }
  );

  galleryFilesCache.set(slug, request);
  // Don't keep failed requests around so the next call can retry
  request.catch(() => galleryFilesCache.delete(slug));
  return request;
};

// The cover is any image whose name starts with "cover" (e.g. cover-2.jpg).
// Use a new name each time the cover changes so the CDN never serves a stale copy.
// If several exist, the most recently uploaded wins; with none, fall back to 00.jpg.
const findCoverFile = <T extends StorageFile>(imageFiles: T[]): T | undefined => {
  const uploadedAt = (file: StorageFile) =>
    Date.parse(file.updated_at ?? file.created_at ?? '') || 0;
  const [latestCover] = imageFiles
    .filter(file => file.name.toLowerCase().startsWith('cover'))
    .sort((a, b) => uploadedAt(b) - uploadedAt(a));

  return latestCover ?? imageFiles.find(file => file.name === DEFAULT_COVER_FILENAME);
};

// A folder's images in the order the site has always shown them:
// the current cover first, followed by the rest in filename order
export const orderFolderFiles = <T extends StorageFile>(files: T[]): T[] => {
  const imageFiles = files
    .filter(file => IMAGE_FILE_PATTERN.test(file.name))
    .sort((a, b) => a.name.localeCompare(b.name));
  const cover = findCoverFile(imageFiles);
  return cover ? [cover, ...imageFiles.filter(file => file !== cover)] : imageFiles;
};

const getFolderPhotoPaths = async (slug: string): Promise<string[]> => {
  const imageFiles = await listGalleryImageFiles(slug);
  return imageFiles.map(file => `${slug}/${file.name}`);
};

// An album's photos in order, the first being its cover
const getAlbumPhotoPaths = async (slug: string): Promise<string[]> => {
  const albumOrder = await loadAlbumOrder();
  return albumOrder.get(slug) ?? getFolderPhotoPaths(slug);
};

export const getGalleryImages = async (slug: string): Promise<string[]> => {
  try {
    const paths = await getAlbumPhotoPaths(slug);
    return paths.map(getPhotoUrl);
  } catch (error) {
    reportGalleryError(error, slug, 'get_gallery_images');
    return [];
  }
};

export const getGalleryCoverUrl = async (slug: string): Promise<string> => {
  const defaultCoverPath = `${slug}/${DEFAULT_COVER_FILENAME}`;
  try {
    const [coverPath = defaultCoverPath] = await getAlbumPhotoPaths(slug);
    return getPhotoUrl(coverPath);
  } catch (error) {
    reportGalleryError(error, slug, 'get_gallery_cover');
    return getPhotoUrl(defaultCoverPath);
  }
};
