import { useEffect, useState } from 'react';
import { getGalleryCoverUrl } from '../lib/supabase';
import { useImageRetry } from '../lib/useImageRetry';

type GalleryCoverProps = {
  slug: string;
  alt: string;
  className?: string;
};

type CoverImageProps = {
  src: string;
  alt: string;
  className?: string;
};

// A cover that still fails after retrying leaves the tile's cream background, not a broken image
function CoverImage({ src, alt, className }: CoverImageProps) {
  const { src: imageSrc, hasFailed, handleError } = useImageRetry(src, 'gallery_cover');
  if (hasFailed) return null;
  return <img src={imageSrc} alt={alt} className={className} onError={handleError} />;
}

export function GalleryCover({ slug, alt, className }: GalleryCoverProps) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getGalleryCoverUrl(slug).then(url => {
      if (!cancelled) setSrc(url);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  // Render nothing until the cover is resolved so the old default cover never flashes
  if (!src) return null;

  return <CoverImage src={src} alt={alt} className={className} />;
}
