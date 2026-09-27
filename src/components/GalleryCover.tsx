import React, { useEffect, useState } from 'react';
import { getGalleryCoverUrl } from '../lib/supabase';

type GalleryCoverProps = {
  slug: string;
  alt: string;
  className?: string;
};

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

  return <img src={src} alt={alt} className={className} />;
}
