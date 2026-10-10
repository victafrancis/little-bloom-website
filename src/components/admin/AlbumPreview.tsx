import { useEffect, useState } from 'react';
import { XIcon } from 'lucide-react';
import { GalleryGrid } from '../GalleryGrid';
import { Lightbox } from '../Lightbox';

type AlbumPreviewProps = {
  title: string;
  images: string[];
  onClose: () => void;
};

// The album the way visitors see it, using the real gallery grid and lightbox
export const AlbumPreview = ({ title, images, onClose }: AlbumPreviewProps) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    // The lightbox closes itself on Escape, so only close the preview when it isn't open
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && lightboxIndex === null) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, onClose]);

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-white" role="dialog" aria-modal="true" aria-label={`Preview of ${title}`}>
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-text/10 bg-white/95 px-4 py-3">
        <p className="text-sm text-text/70">
          Preview with your unsaved changes. Visitors still see the saved album.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm hover:bg-sage/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sage"
        >
          <XIcon className="h-4 w-4" aria-hidden="true" />
          Close preview
        </button>
      </div>
      <div className="container mx-auto px-4 py-12">
        <h1 className="mx-auto mb-12 max-w-4xl text-3xl font-display md:text-4xl">{title}</h1>
        <GalleryGrid images={images} onImageClick={setLightboxIndex} altText={index => `${title} – Image ${index + 1}`} />
      </div>
      <Lightbox
        images={images}
        initialIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
      />
    </div>
  );
};
