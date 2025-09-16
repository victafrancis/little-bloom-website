import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/Button';
import { GalleryGrid } from '../components/GalleryGrid';
import { Lightbox } from '../components/Lightbox';
import { galleries } from '../data/galleries';
export default function PortfolioCategory() {
  const {
    slug
  } = useParams<{
    slug: string;
  }>();
  const navigate = useNavigate();
  const gallery = galleries.find(g => g.slug === slug);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };
  if (!gallery) {
    navigate('/portfolio');
    return null;
  }
  return <>
      <Helmet>
        <title>{gallery.title} | Portfolio</title>
        <meta name="description" content={gallery.blurb} />
      </Helmet>
      <main className="pt-24 md:pt-32">
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-display mb-4">
              {gallery.title}
            </h1>
            <p className="text-text/70 text-lg">{gallery.blurb}</p>
          </div>
          <GalleryGrid images={gallery.images} onImageClick={openLightbox} />
          <div className="mt-16 text-center">
            <Button to="/contact">Book This Service</Button>
          </div>
        </section>
      </main>
      <Lightbox images={gallery.images} initialIndex={currentImageIndex} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />
    </>;
}