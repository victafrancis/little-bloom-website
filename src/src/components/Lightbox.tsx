import React, { useCallback, useEffect, useState } from 'react';
import { XIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
type LightboxProps = {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
};
export function Lightbox({
  images,
  initialIndex,
  isOpen,
  onClose
}: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const handlePrevious = useCallback(() => {
    setCurrentIndex(prevIndex => prevIndex === 0 ? images.length - 1 : prevIndex - 1);
  }, [images.length]);
  const handleNext = useCallback(() => {
    setCurrentIndex(prevIndex => prevIndex === images.length - 1 ? 0 : prevIndex + 1);
  }, [images.length]);
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return;
    switch (event.key) {
      case 'ArrowLeft':
        handlePrevious();
        break;
      case 'ArrowRight':
        handleNext();
        break;
      case 'Escape':
        onClose();
        break;
      default:
        break;
    }
  }, [isOpen, handlePrevious, handleNext, onClose]);
  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={onClose}>
      <div className="relative w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 md:top-8 md:right-8 text-white hover:text-gray-300 focus:outline-none z-10" onClick={onClose} aria-label="Close lightbox">
          <XIcon className="w-8 h-8" />
        </button>
        <button className="absolute left-4 md:left-8 text-white hover:text-gray-300 focus:outline-none z-10" onClick={handlePrevious} aria-label="Previous image">
          <ChevronLeftIcon className="w-10 h-10" />
        </button>
        <div className="w-full h-full flex items-center justify-center p-4 md:p-12">
          <img src={images[currentIndex]} alt="" className="max-w-full max-h-full object-contain" />
        </div>
        <button className="absolute right-4 md:right-8 text-white hover:text-gray-300 focus:outline-none z-10" onClick={handleNext} aria-label="Next image">
          <ChevronRightIcon className="w-10 h-10" />
        </button>
        <div className="absolute bottom-4 md:bottom-8 left-0 right-0 text-center text-white">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>;
}