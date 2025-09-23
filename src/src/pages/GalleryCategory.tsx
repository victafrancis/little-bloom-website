import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { Button } from '../components/Button';
import { GalleryGrid } from '../components/GalleryGrid';
import { Lightbox } from '../components/Lightbox';
import { galleries } from '../data/galleries';
export default function GalleryCategory() {
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
    navigate('/gallery');
    return null;
  }
  return <>
      <SEO
        title={`${gallery.title} | Gallery | Little Bloom Photography`}
        description={gallery.blurb}
        image={gallery.cover}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type':'ListItem', position:1, name:'Home', item:'https://www.littlebloomphotography.com/' },
              { '@type':'ListItem', position:2, name:'Gallery', item:'https://www.littlebloomphotography.com/gallery' },
              { '@type':'ListItem', position:3, name: gallery.title, item: `https://www.littlebloomphotography.com/gallery/${gallery.slug}` }
            ]
          }
        ]}
      />
      <main className="pt-24 md:pt-32">
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-display mb-1">
              {gallery.title}
            </h1>
            <h1 className="text-xl md:text-2xl font-display mb-4">
              ~{gallery.subtitle}~
            </h1>
            <p className="text-text/70 text-lg">{gallery.blurb}</p>
          </div>
          <GalleryGrid images={gallery.images} onImageClick={openLightbox} altText={(i) => `${gallery.title} – Image ${i + 1}`} />
          <div className="mt-16 text-center">
            <Button to="/contact">Book This Service</Button>
          </div>
        </section>
      </main>
      <Lightbox images={gallery.images} initialIndex={currentImageIndex} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />
    </>;
}
