import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlbumChangedError, createUploadPath, loadAlbum, removeFiles, saveAlbum, uploadPhoto } from './albumAdmin';
import { resizeImage, UnreadableImageError } from './resizeImage';
import { getPhotoUrl } from './supabase';

export type DraftPhotoStatus = 'saved' | 'resizing' | 'uploading' | 'uploaded' | 'failed';

export type DraftPhoto = {
  path: string;
  // A public URL for saved photos, or a local preview for new ones (empty until it's ready)
  src: string;
  status: DraftPhotoStatus;
  error?: string;
};

type LoadStatus = 'loading' | 'ready' | 'error';

const isNewPhoto = (photo: DraftPhoto) => photo.status !== 'saved';

const toSavedPhotos = (paths: string[]): DraftPhoto[] =>
  paths.map(path => ({ path, src: getPhotoUrl(path), status: 'saved' }));

const haveSameOrder = (photos: DraftPhoto[], paths: string[]) =>
  photos.length === paths.length && photos.every((photo, index) => photo.path === paths[index]);

// One album's photos as you arrange them. Nothing reaches the site until save().
export const useAlbumDraft = (slug: string) => {
  const [loadStatus, setLoadStatus] = useState<LoadStatus>('loading');
  const [loadedPaths, setLoadedPaths] = useState<string[]>([]);
  const [photos, setPhotos] = useState<DraftPhoto[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isAlbumChanged, setIsAlbumChanged] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);

  // Read by upload callbacks and the unmount cleanup, which outlive the render that started them
  const photosRef = useRef(photos);
  photosRef.current = photos;
  const uploadQueueRef = useRef<Promise<void>>(Promise.resolve());

  const updatePhoto = useCallback((path: string, changes: Partial<DraftPhoto>) => {
    setPhotos(current => current.map(photo => (photo.path === path ? { ...photo, ...changes } : photo)));
  }, []);

  useEffect(() => {
    let isCancelled = false;
    setLoadStatus('loading');
    loadAlbum(slug)
      .then(paths => {
        if (isCancelled) {
          return;
        }
        setLoadedPaths(paths);
        setPhotos(toSavedPhotos(paths));
        setIsAlbumChanged(false);
        setSaveError(null);
        setLoadStatus('ready');
      })
      .catch(() => {
        if (!isCancelled) {
          setLoadStatus('error');
        }
      });
    return () => {
      isCancelled = true;
    };
  }, [slug, loadAttempt]);

  // New photos that were uploaded but never saved are deleted when the album closes
  useEffect(() => () => {
    const closingPhotos = photosRef.current;
    removeFiles(closingPhotos.filter(photo => photo.status === 'uploaded').map(photo => photo.path), slug);
    closingPhotos.filter(isNewPhoto).forEach(photo => photo.src && URL.revokeObjectURL(photo.src));
    // Uploads still running will see they're no longer wanted and delete their file
    photosRef.current = [];
  }, [slug]);

  const processUpload = useCallback(async (path: string, file: File) => {
    const isStillInDraft = () => photosRef.current.some(photo => photo.path === path);
    if (!isStillInDraft()) {
      return;
    }
    try {
      const resized = await resizeImage(file);
      const src = URL.createObjectURL(resized);
      if (!isStillInDraft()) {
        URL.revokeObjectURL(src);
        return;
      }
      updatePhoto(path, { src, status: 'uploading' });
      await uploadPhoto(path, resized, slug);
      // Removed while uploading, so the file isn't needed after all
      if (!isStillInDraft()) {
        removeFiles([path], slug);
        return;
      }
      updatePhoto(path, { status: 'uploaded' });
    } catch (error) {
      const message = error instanceof UnreadableImageError
        ? "This file couldn't be read. Try exporting it as a JPEG."
        : "This photo didn't upload. Remove it and try adding it again.";
      updatePhoto(path, { status: 'failed', error: message });
    }
  }, [slug, updatePhoto]);

  // New photos join the end of the album and upload one at a time, so big batches don't run out of memory
  const addFiles = useCallback((files: File[]) => {
    const added = files.map(file => ({ file, path: createUploadPath(slug) }));
    setPhotos(current => [...current, ...added.map(({ path }) => ({ path, src: '', status: 'resizing' as const }))]);
    added.forEach(({ file, path }) => {
      uploadQueueRef.current = uploadQueueRef.current.then(() => processUpload(path, file));
    });
  }, [slug, processUpload]);

  const removePhoto = useCallback((path: string) => {
    const photo = photosRef.current.find(item => item.path === path);
    if (!photo) {
      return;
    }
    if (photo.status === 'uploaded') {
      removeFiles([path], slug);
    }
    if (isNewPhoto(photo) && photo.src) {
      URL.revokeObjectURL(photo.src);
    }
    setPhotos(current => current.filter(item => item.path !== path));
  }, [slug]);

  const movePhoto = useCallback((fromIndex: number, toIndex: number) => {
    setPhotos(current => {
      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  const makeCover = useCallback((path: string) => {
    setPhotos(current => {
      const cover = current.find(photo => photo.path === path);
      return cover ? [cover, ...current.filter(photo => photo !== cover)] : current;
    });
  }, []);

  const resetTo = useCallback((paths: string[]) => {
    const unsaved = photosRef.current.filter(photo => photo.status === 'uploaded');
    removeFiles(unsaved.map(photo => photo.path), slug);
    photosRef.current.filter(isNewPhoto).forEach(photo => photo.src && URL.revokeObjectURL(photo.src));
    setPhotos(toSavedPhotos(paths));
    setSaveError(null);
  }, [slug]);

  const discard = useCallback(() => resetTo(loadedPaths), [resetTo, loadedPaths]);

  // Throws away the draft and loads the album as it is now
  const reload = useCallback(() => {
    resetTo([]);
    setLoadAttempt(attempt => attempt + 1);
  }, [resetTo]);

  const save = useCallback(async (): Promise<boolean> => {
    const paths = photosRef.current.map(photo => photo.path);
    setIsSaving(true);
    setSaveError(null);
    try {
      await saveAlbum(slug, paths, loadedPaths);
      // The new photos are saved now, so their local previews can give way to the stored files
      photosRef.current.filter(isNewPhoto).forEach(photo => photo.src && URL.revokeObjectURL(photo.src));
      setLoadedPaths(paths);
      setPhotos(toSavedPhotos(paths));
      return true;
    } catch (error) {
      if (error instanceof AlbumChangedError) {
        setIsAlbumChanged(true);
      } else {
        setSaveError("The album couldn't be saved. Check your connection and try again.");
      }
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [slug, loadedPaths]);

  const pendingCount = photos.filter(photo => photo.status === 'resizing' || photo.status === 'uploading').length;
  const failedCount = photos.filter(photo => photo.status === 'failed').length;
  const removedCount = loadedPaths.filter(path => !photos.some(photo => photo.path === path)).length;
  const hasChanges = useMemo(() => !haveSameOrder(photos, loadedPaths), [photos, loadedPaths]);

  return {
    loadStatus,
    photos,
    hasChanges,
    pendingCount,
    failedCount,
    removedCount,
    isSaving,
    saveError,
    isAlbumChanged,
    addFiles,
    removePhoto,
    movePhoto,
    makeCover,
    discard,
    reload,
    save
  };
};
