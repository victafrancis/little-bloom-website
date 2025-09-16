import React, { useCallback, useEffect, useRef, useState } from 'react';
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
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState<'left' | 'right' | null>(null);
  const [disableTransition, setDisableTransition] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
  const nextIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;

  const handleTransitionEnd = useCallback(() => {
    setDisableTransition(true);
    if (transitionDirection === 'left') {
      setCurrentIndex(nextIndex);
      setTranslateX(-containerWidth);
    } else if (transitionDirection === 'right') {
      setCurrentIndex(prevIndex);
      setTranslateX(-containerWidth);
    }
    setTransitionDirection(null);
    setIsAnimating(false);
    // Re-enable transition after a brief moment
    setTimeout(() => setDisableTransition(false), 0);
  }, [transitionDirection, nextIndex, prevIndex, containerWidth]);

  const handlePrevious = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isDragging || isAnimating) return;
    setIsAnimating(true);
    setTransitionDirection('right');
    setTranslateX(0);
  }, [isDragging, isAnimating]);

  const handleNext = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isDragging || isAnimating) return;
    setIsAnimating(true);
    setTransitionDirection('left');
    setTranslateX(-2 * containerWidth);
  }, [isDragging, isAnimating, containerWidth]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen || isDragging) return;
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
  }, [isOpen, isDragging, handlePrevious, handleNext, onClose]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const delta = currentX - startX;
    setTranslateX(-containerWidth + delta);
  }, [isDragging, startX, containerWidth]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const endX = e.changedTouches[0].clientX;
    const delta = endX - startX;
    const threshold = 50;

    if (Math.abs(delta) > threshold) {
      setIsAnimating(true);
      if (delta > 0) {
        // Swipe right - go to previous
        setTransitionDirection('right');
        setTranslateX(0);
      } else {
        // Swipe left - go to next
        setTransitionDirection('left');
        setTranslateX(-2 * containerWidth);
      }
    } else {
      // Snap back
      setTranslateX(-containerWidth);
    }
  }, [isDragging, startX, containerWidth]);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setTranslateX(0);
  }, [initialIndex]);

  useEffect(() => {
    if (isOpen && carouselRef.current) {
      const width = carouselRef.current.offsetWidth;
      setContainerWidth(width);
      setTranslateX(-width);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !isAnimating) {
      setTranslateX(-containerWidth);
    }
  }, [isOpen, currentIndex, isAnimating, containerWidth]);

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

  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('transitionend', handleTransitionEnd);
      return () => carousel.removeEventListener('transitionend', handleTransitionEnd);
    }
  }, [handleTransitionEnd]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={onClose}>
      <div className="relative w-full h-full flex items-center justify-center">
        <button className="absolute top-4 right-4 md:top-8 md:right-8 text-white hover:text-gray-300 focus:outline-none z-10 hidden md:block" onClick={onClose} aria-label="Close lightbox">
          <XIcon className="w-8 h-8" />
        </button>
        <button className="absolute left-4 md:left-8 text-white hover:text-gray-300 focus:outline-none z-10 hidden md:block" onClick={handlePrevious} aria-label="Previous image">
          <ChevronLeftIcon className="w-10 h-10" />
        </button>
        <div
          ref={carouselRef}
          className="w-full h-full overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex h-full"
            style={{
              width: `${3 * containerWidth}px`,
              transform: `translateX(${translateX}px)`,
              transition: isDragging || disableTransition ? 'none' : 'transform 0.3s ease',
            }}
          >
            <div className="flex items-center justify-center p-4 md:p-12" style={{ width: `${containerWidth}px` }}>
              <img src={images[prevIndex]} alt="" className="w-full h-auto object-contain" onClick={e => e.stopPropagation()} />
            </div>
            <div className="flex items-center justify-center p-4 md:p-12" style={{ width: `${containerWidth}px` }}>
              <img src={images[currentIndex]} alt="" className="w-full h-auto object-contain" onClick={e => e.stopPropagation()} />
            </div>
            <div className="flex items-center justify-center p-4 md:p-12" style={{ width: `${containerWidth}px` }}>
              <img src={images[nextIndex]} alt="" className="w-full h-auto object-contain" onClick={e => e.stopPropagation()} />
            </div>
          </div>
        </div>
        <button className="absolute right-4 md:right-8 text-white hover:text-gray-300 focus:outline-none z-10 hidden md:block" onClick={handleNext} aria-label="Next image">
          <ChevronRightIcon className="w-10 h-10" />
        </button>
        <div className="absolute bottom-4 md:bottom-8 left-0 right-0 text-center text-white">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}
