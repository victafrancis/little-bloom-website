import { PostgrestError } from '@supabase/supabase-js';
import * as Sentry from '@sentry/react';
import { adminSupabase } from './adminSupabase';
import { orderFolderFiles } from './supabase';

const ALBUMS_BUCKET = 'albums';
const FOLDER_LIST_LIMIT = 1000;
// A year, since a photo's file never changes once it's uploaded
const PHOTO_CACHE_SECONDS = '31536000';
// save_album's answer when someone else added or removed photos first
const ALBUM_CHANGED_CODE = 'PT409';
// Uploads that were never saved are left a day before cleanup, in case another tab is still editing
const UNSAVED_UPLOAD_MAX_AGE_MS = 24 * 60 * 60 * 1000;
// The manager names every upload <uuid>.jpg, so it never touches photos added any other way
const MANAGER_UPLOAD_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.jpg$/;

export class AlbumChangedError extends Error {
  constructor() {
    super('This album was changed somewhere else. Reload it to see the latest version.');
    this.name = 'AlbumChangedError';
  }
}

const reportAdminError = (error: unknown, operation: string, slug: string) => {
  Sentry.captureException(error, {
    tags: { operation, gallery_slug: slug },
    extra: { slug }
  });
};

export const signIn = async (email: string, password: string): Promise<void> => {
  const { error } = await adminSupabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  await adminSupabase.auth.signOut();
};

export const isAlbumAdmin = async (): Promise<boolean> => {
  const { data } = await adminSupabase.rpc('is_album_admin').throwOnError();
  return data === true;
};

const listFolder = async (slug: string) => {
  const { data, error } = await adminSupabase.storage
    .from(ALBUMS_BUCKET)
    .list(slug, { limit: FOLDER_LIST_LIMIT, offset: 0 });
  if (error) {
    throw error;
  }
  return data;
};

const fetchSavedPaths = async (slug: string): Promise<string[]> => {
  const { data } = await adminSupabase
    .from('album_photos')
    .select('storage_path')
    .eq('album_slug', slug)
    .order('position')
    .throwOnError();
  return data.map(row => String(row.storage_path));
};

export const removeFiles = async (paths: string[], slug: string): Promise<void> => {
  if (paths.length === 0) {
    return;
  }
  const { error } = await adminSupabase.storage.from(ALBUMS_BUCKET).remove(paths);
  if (error) {
    // The photos are already out of the album, so a leftover file is only untidy
    reportAdminError(error, 'album_manager_remove_files', slug);
  }
};

// Uploads from a draft that was never saved, e.g. after the tab was closed
const cleanUpUnsavedUploads = async (slug: string, savedPaths: string[]) => {
  const saved = new Set(savedPaths);
  const now = Date.now();
  const files = await listFolder(slug);
  const leftovers = files
    .filter(file => MANAGER_UPLOAD_PATTERN.test(file.name) && !saved.has(`${slug}/${file.name}`))
    .filter(file => now - (Date.parse(file.created_at ?? '') || now) > UNSAVED_UPLOAD_MAX_AGE_MS)
    .map(file => `${slug}/${file.name}`);
  await removeFiles(leftovers, slug);
};

const callSaveAlbum = async (slug: string, paths: string[], loadedPaths: string[]): Promise<string[]> => {
  try {
    const { data } = await adminSupabase
      .rpc('save_album', { slug, photo_paths: paths, loaded_paths: loadedPaths })
      .throwOnError();
    return Array.isArray(data) ? data.map(String) : [];
  } catch (error) {
    throw error instanceof PostgrestError && error.code === ALBUM_CHANGED_CODE ? new AlbumChangedError() : error;
  }
};

// Saves the album's photos in this order, the first being the cover, and deletes the files of removed photos
export const saveAlbum = async (slug: string, paths: string[], loadedPaths: string[]): Promise<void> => {
  let removedPaths: string[];
  try {
    removedPaths = await callSaveAlbum(slug, paths, loadedPaths);
  } catch (error) {
    if (!(error instanceof AlbumChangedError)) {
      reportAdminError(error, 'album_manager_save', slug);
    }
    throw error;
  }
  await removeFiles(removedPaths, slug);
};

// The album's saved order. The first time an album is opened, its photos are
// imported from its folder in the order the site already shows them.
export const loadAlbum = async (slug: string): Promise<string[]> => {
  try {
    const savedPaths = await fetchSavedPaths(slug);
    if (savedPaths.length > 0) {
      cleanUpUnsavedUploads(slug, savedPaths).catch(error => reportAdminError(error, 'album_manager_cleanup', slug));
      return savedPaths;
    }

    const folderPaths = orderFolderFiles(await listFolder(slug)).map(file => `${slug}/${file.name}`);
    if (folderPaths.length === 0) {
      return [];
    }
    await callSaveAlbum(slug, folderPaths, []);
    return await fetchSavedPaths(slug);
  } catch (error) {
    // Two tabs importing the same album at once: the other one won, so read its result
    if (error instanceof AlbumChangedError) {
      return fetchSavedPaths(slug);
    }
    reportAdminError(error, 'album_manager_load', slug);
    throw error;
  }
};

export const createUploadPath = (slug: string): string => `${slug}/${crypto.randomUUID()}.jpg`;

export const uploadPhoto = async (path: string, photo: Blob, slug: string): Promise<void> => {
  const { error } = await adminSupabase.storage
    .from(ALBUMS_BUCKET)
    .upload(path, photo, { contentType: 'image/jpeg', cacheControl: PHOTO_CACHE_SECONDS, upsert: false });
  if (error) {
    reportAdminError(error, 'album_manager_upload', slug);
    throw error;
  }
};
