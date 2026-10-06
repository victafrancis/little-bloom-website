import { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import SEO from '../components/SEO';
import { Button } from '../components/Button';
import { GalleryGrid } from '../components/GalleryGrid';
import { Lightbox } from '../components/Lightbox';
import { galleryConfigs, getGalleryImages } from '../data/galleries';

type LoadStatus = 'loading' | 'ready' | 'error';

const SKELETON_TILES = 6;

export default function GalleryCategory() {
  const { slug } = useParams<{ slug: string; }>();
  const gallery = galleryConfigs.find(g => g.slug === slug);
  const [images, setImages] = useState<string[]>([]);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!gallery) {
      return;
    }
    let isCancelled = false;
    setStatus('loading');
    getGalleryImages(gallery.slug).then(galleryImages => {
      if (isCancelled) {
        return;
      }
      setImages(galleryImages);
      // An empty list means the listing failed, since every gallery has photos
      setStatus(galleryImages.length > 0 ? 'ready' : 'error');
    });
    return () => {
      isCancelled = true;
    };
  }, [gallery, loadAttempt]);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  if (!gallery) {
    return <Navigate to="/gallery" replace />;
  }

  return <>
      <SEO
        title={`${gallery.title} | Gallery | Little Bloom Photography`}
        description={gallery.blurb}
        image={images[0]}
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
          {status === 'loading' && (
            <div className="grid grid-cols-1 gap-4 md:gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Loading photos">
              {Array.from({ length: SKELETON_TILES }, (_, index) => (
                <div key={index} className="aspect-square rounded-lg bg-cream animate-pulse" />
              ))}
            </div>
          )}
          {status === 'error' && (
            <div className="max-w-xl mx-auto rounded-lg bg-cream px-6 py-10 text-center" role="alert">
              <p className="text-lg font-display mb-2">These photos are taking a little longer to bloom.</p>
              <p className="text-text/70 mb-6">Please check your connection and try again.</p>
              <Button onClick={() => setLoadAttempt(attempt => attempt + 1)}>Try Again</Button>
            </div>
          )}
          {status === 'ready' && (
            <GalleryGrid images={images} onImageClick={openLightbox} altText={(i) => `${gallery.title} – Image ${i + 1}`} />
          )}
          <div className="mt-16 text-center">
            <Button to="/contact">Book This Service</Button>
          </div>
        </section>
      </main>
      <Lightbox images={images} initialIndex={currentImageIndex} isOpen={lightboxOpen} onClose={() => setLightboxOpen(false)} />
    </>;
}
