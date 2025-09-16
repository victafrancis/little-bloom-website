import React, { lazy } from 'react';
type GalleryGridProps = {
  images: string[];
  onImageClick?: (index: number) => void;
};
export function GalleryGrid({
  images,
  onImageClick
}: GalleryGridProps) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {images.map((image, index) => <button key={`${image}-${index}`} className="relative aspect-square overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-sage" onClick={() => onImageClick && onImageClick(index)} aria-label={`View image ${index + 1}`}>
          <img src={image} alt="" className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" loading="lazy" />
        </button>)}
    </div>;
}