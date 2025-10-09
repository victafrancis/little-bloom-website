import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
type GalleryGridProps = {
  images: string[];
  onImageClick?: (index: number) => void;
  altText?: (index: number) => string;
};
type GalleryImageProps = {
  src: string;
  alt: string;
  onClick?: () => void;
};

const rootMargin = '200px';

function GalleryImage({ src, alt, onClick }: GalleryImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (shouldLoad) {
      return;
    }

    const node = containerRef.current;
    if (!node) {
      return;
    }

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [shouldLoad]);

  const imageClassName = useMemo(
    () =>
      [
        'w-full',
        'h-full',
        'object-cover',
        'transition-transform',
        'duration-300',
        'hover:scale-105',
        'transition-opacity',
        'duration-500',
        isLoaded ? 'opacity-100' : 'opacity-0'
      ].join(' '),
    [isLoaded]
  );

  return (
    <button
      type="button"
      className="relative aspect-square overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-sage"
      onClick={onClick}
      aria-label={alt}
    >
      <div ref={containerRef} className="relative h-full w-full bg-cream">
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-cream/90 text-sage">
            <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
            <span className="text-sm font-medium">Loading photo...</span>
          </div>
        )}

        {shouldLoad && (
          <img
            src={src}
            alt={alt}
            className={imageClassName}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => {
              setHasError(true);
              setIsLoaded(true);
            }}
          />
        )}

        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-cream text-center text-sm font-medium text-text">
            Image unavailable
          </div>
        )}
      </div>
    </button>
  );
}

export function GalleryGrid({
  images,
  onImageClick,
  altText
}: GalleryGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {images.map((image, index) => (
        <GalleryImage
          key={`${image}-${index}`}
          src={image}
          alt={altText ? altText(index) : `Gallery image ${index + 1}`}
          onClick={onImageClick ? () => onImageClick(index) : undefined}
        />
      ))}
    </div>
  );
}
