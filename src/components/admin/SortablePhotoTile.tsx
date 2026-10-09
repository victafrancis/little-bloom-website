import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AlertCircleIcon, ImageOffIcon, Loader2, XIcon } from 'lucide-react';
import { DraftPhoto } from '../../lib/useAlbumDraft';

type SortablePhotoTileProps = {
  photo: DraftPhoto;
  index: number;
  isDisabled: boolean;
  onMakeCover: (path: string) => void;
  onRemove: (path: string) => void;
};

export const SortablePhotoTile = ({ photo, index, isDisabled, onMakeCover, onRemove }: SortablePhotoTileProps) => {
  const [hasImageError, setHasImageError] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: photo.path,
    disabled: isDisabled
  });
  const isCover = index === 0;
  const isBusy = photo.status === 'resizing' || photo.status === 'uploading';

  return (
    <div
      ref={setNodeRef}
      data-photo-path={photo.path}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`group relative aspect-square overflow-hidden rounded-lg bg-cream ${isDragging ? 'z-10 shadow-xl ring-2 ring-sage' : ''} ${isCover ? 'ring-2 ring-mustard' : ''}`}
    >
      <div
        {...attributes}
        {...listeners}
        aria-label={`Photo ${index + 1}${isCover ? ', the cover' : ''}. Press space to pick it up, then use the arrow keys to move it.`}
        className={`h-full w-full touch-manipulation focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-sage ${isDisabled ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
      >
        {photo.src && !hasImageError && (
          <img
            src={photo.src}
            alt=""
            draggable={false}
            loading="lazy"
            onError={() => setHasImageError(true)}
            className={`h-full w-full select-none object-cover ${isBusy ? 'opacity-60' : ''}`}
          />
        )}
        {hasImageError && (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-2 text-center text-xs text-text/60">
            <ImageOffIcon className="h-5 w-5 text-mauve" aria-hidden="true" />
            Photo file missing
          </div>
        )}
      </div>

      <span className="pointer-events-none absolute left-1.5 top-1.5 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-text shadow-sm">
        {isCover ? 'Cover' : index + 1}
      </span>

      {isBusy && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 text-xs font-medium text-text">
          <Loader2 className="h-6 w-6 animate-spin text-sage" aria-hidden="true" />
          <span className="rounded bg-white/80 px-1.5 py-0.5">{photo.status === 'resizing' ? 'Preparing…' : 'Uploading…'}</span>
        </div>
      )}

      {photo.status === 'failed' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-cream/95 p-2 text-center text-xs text-text/80" role="alert">
          <AlertCircleIcon className="h-5 w-5 text-mauve" aria-hidden="true" />
          {photo.error}
        </div>
      )}

      {!isCover && photo.status !== 'failed' && (
        <button
          type="button"
          onClick={() => onMakeCover(photo.path)}
          disabled={isDisabled}
          aria-label={`Make photo ${index + 1} the cover`}
          className="tile-action absolute bottom-1.5 left-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-text shadow-sm transition-colors hover:bg-mustard hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sage disabled:cursor-not-allowed"
        >
          Make cover
        </button>
      )}

      <button
        type="button"
        onClick={() => onRemove(photo.path)}
        disabled={isDisabled}
        aria-label={`Remove photo ${index + 1}`}
        title="Remove from the album"
        className="tile-action absolute right-1.5 top-1.5 rounded-full bg-white/90 p-1.5 text-text shadow-sm transition-colors hover:bg-mauve hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-sage disabled:cursor-not-allowed"
      >
        <XIcon className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
};
