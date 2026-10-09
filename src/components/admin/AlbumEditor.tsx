import React, { useEffect, useRef, useState } from 'react';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { EyeIcon, ImagePlusIcon, Loader2 } from 'lucide-react';
import { Button } from '../Button';
import { MAX_PHOTO_EDGE_PX } from '../../lib/resizeImage';
import { useAlbumDraft } from '../../lib/useAlbumDraft';
import { AlbumPreview } from './AlbumPreview';
import { SortablePhotoTile } from './SortablePhotoTile';

type AlbumEditorProps = {
  slug: string;
  title: string;
  onChangesStateChange: (hasChanges: boolean) => void;
};

const SAVED_MESSAGE_MS = 4000;
const SKELETON_TILES = 6;
const PHOTO_FILE_PATTERN = /\.(jpe?g|png|webp|heic|heif)$/i;

const isFileDrag = (event: React.DragEvent) => event.dataTransfer.types.includes('Files');

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`;

export const AlbumEditor = ({ slug, title, onChangesStateChange }: AlbumEditorProps) => {
  const draft = useAlbumDraft(slug);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);
  const [hasJustSaved, setHasJustSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const savedTimerRef = useRef(0);
  const { photos, hasChanges, pendingCount, failedCount, isSaving } = draft;

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    // A short hold starts a drag on touch screens, so swiping still scrolls the page
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    onChangesStateChange(hasChanges);
  }, [hasChanges, onChangesStateChange]);

  useEffect(() => () => window.clearTimeout(savedTimerRef.current), []);

  // Warn before closing or reloading the tab with unsaved changes
  useEffect(() => {
    if (!hasChanges) {
      return;
    }
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  // A photo dropped just outside the drop area would otherwise open in the tab, losing the draft
  useEffect(() => {
    const preventFileOpen = (event: DragEvent) => {
      if (event.dataTransfer?.types.includes('Files')) {
        event.preventDefault();
      }
    };
    window.addEventListener('dragover', preventFileOpen);
    window.addEventListener('drop', preventFileOpen);
    return () => {
      window.removeEventListener('dragover', preventFileOpen);
      window.removeEventListener('drop', preventFileOpen);
    };
  }, []);

  const addPhotoFiles = (files: FileList | null) => {
    const photoFiles = Array.from(files ?? []).filter(file => file.type.startsWith('image/') || PHOTO_FILE_PATTERN.test(file.name));
    if (photoFiles.length > 0) {
      setHasJustSaved(false);
      draft.addFiles(photoFiles);
    }
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) {
      return;
    }
    const fromIndex = photos.findIndex(photo => photo.path === active.id);
    const toIndex = photos.findIndex(photo => photo.path === over.id);
    if (fromIndex >= 0 && toIndex >= 0) {
      setHasJustSaved(false);
      draft.movePhoto(fromIndex, toIndex);
    }
  };

  const handleSave = async () => {
    const { removedCount } = draft;
    if (removedCount > 0 && !window.confirm(`${plural(removedCount, 'photo')} you removed will be deleted for good. Save anyway?`)) {
      return;
    }
    if (await draft.save()) {
      setHasJustSaved(true);
      window.clearTimeout(savedTimerRef.current);
      savedTimerRef.current = window.setTimeout(() => setHasJustSaved(false), SAVED_MESSAGE_MS);
    }
  };

  const handleDiscard = () => {
    if (window.confirm('Discard your changes to this album?')) {
      draft.discard();
    }
  };

  const isSaveBlocked = isSaving || pendingCount > 0 || failedCount > 0 || photos.length === 0;
  const statusMessage = draft.saveError
    ?? (pendingCount > 0 ? `Uploading ${plural(pendingCount, 'photo')}…`
      : failedCount > 0 ? `Remove the ${plural(failedCount, 'photo')} that didn't upload to save.`
        : photos.length === 0 ? 'An album needs at least one photo.'
          : 'Unsaved changes. Visitors still see the saved album.');

  if (draft.loadStatus === 'loading') {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4" aria-busy="true" aria-label="Loading photos">
        {Array.from({ length: SKELETON_TILES }, (_, index) => (
          <div key={index} className="aspect-square animate-pulse rounded-lg bg-cream" />
        ))}
      </div>
    );
  }

  if (draft.loadStatus === 'error') {
    return (
      <div className="mx-auto max-w-xl rounded-lg bg-cream px-6 py-10 text-center" role="alert">
        <p className="mb-2 text-lg font-display">This album couldn't load.</p>
        <p className="mb-6 text-text/70">Please check your connection and try again.</p>
        <Button onClick={draft.reload}>Try Again</Button>
      </div>
    );
  }

  return (
    <section
      aria-label={`${title} photos`}
      className="relative pb-28"
      onDragEnter={event => isFileDrag(event) && setIsDraggingFiles(true)}
      onDragOver={event => {
        if (isFileDrag(event)) {
          event.preventDefault();
          event.dataTransfer.dropEffect = 'copy';
        }
      }}
      onDragLeave={event => {
        if (!(event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget))) {
          setIsDraggingFiles(false);
        }
      }}
      onDrop={event => {
        event.preventDefault();
        setIsDraggingFiles(false);
        addPhotoFiles(event.dataTransfer.files);
      }}
    >
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display">{title}</h2>
          <p className="text-sm text-text/70">
            {plural(photos.length, 'photo')}. The first photo is the cover. Drag photos to change the order.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsPreviewOpen(true)}
          disabled={photos.length === 0}
          className="flex items-center gap-2 rounded-lg border-2 border-text/60 px-4 py-2 text-sm uppercase tracking-wide transition-colors hover:bg-sage/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage disabled:opacity-50"
        >
          <EyeIcon className="h-4 w-4" aria-hidden="true" />
          Preview
        </button>
      </div>

      {draft.isAlbumChanged && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-mauve/10 px-4 py-3" role="alert">
          <p className="text-sm">This album was changed somewhere else, so your changes weren't saved. Reload it to see the latest version.</p>
          <Button onClick={draft.reload}>Reload</Button>
        </div>
      )}

      <div className="mb-6 flex flex-col items-center gap-3 rounded-lg border-2 border-dashed border-sage/60 bg-cream/50 px-4 py-6 text-center">
        <p className="text-text/80">
          <span className="hidden md:inline">Drag photos here, or </span>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isSaving}
            className="inline-flex items-center gap-1 font-medium text-text underline decoration-mustard decoration-2 underline-offset-4 hover:text-mustard focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
          >
            <ImagePlusIcon className="h-4 w-4" aria-hidden="true" />
            add photos
          </button>
        </p>
        <p className="text-xs text-text/60">
          New photos go at the end. They're shrunk to {MAX_PHOTO_EDGE_PX}px on their longest side, never cropped.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={event => {
            addPhotoFiles(event.target.files);
            event.target.value = '';
          }}
        />
      </div>

      {photos.length === 0 ? (
        <p className="py-12 text-center text-text/60">No photos yet. Add some above.</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={photos.map(photo => photo.path)} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
              {photos.map((photo, index) => (
                <SortablePhotoTile
                  key={photo.path}
                  photo={photo}
                  index={index}
                  isDisabled={isSaving}
                  onMakeCover={path => {
                    setHasJustSaved(false);
                    draft.makeCover(path);
                  }}
                  onRemove={draft.removePhoto}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {isDraggingFiles && (
        <div className="pointer-events-none fixed inset-4 z-30 flex items-center justify-center rounded-2xl border-4 border-dashed border-sage bg-white/80">
          <p className="text-xl font-display">Drop to add photos to {title}</p>
        </div>
      )}

      {(hasChanges || hasJustSaved) && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-text/10 bg-white/95 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
          <div className="container mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
            <p className="text-sm text-text/80" role="status">
              {hasChanges ? statusMessage : 'Saved. The album is live on the site.'}
            </p>
            {hasChanges && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleDiscard}
                  disabled={isSaving}
                  className="rounded-lg px-4 py-2 text-sm uppercase tracking-wide hover:bg-sage/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage disabled:opacity-50"
                >
                  Discard
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaveBlocked}
                  className="flex items-center gap-2 rounded-lg bg-mustard px-5 py-2 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-mustard/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                  {isSaving ? 'Saving' : 'Save'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {isPreviewOpen && (
        <AlbumPreview
          title={title}
          images={photos.filter(photo => photo.src && photo.status !== 'failed').map(photo => photo.src)}
          onClose={() => setIsPreviewOpen(false)}
        />
      )}
    </section>
  );
};
