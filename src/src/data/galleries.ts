// Utility function to get all images from a gallery folder
import { getGalleryImages as getSupabaseGalleryImages, getCoverImageUrl } from '../lib/supabase';

// Cache for gallery images to avoid repeated API calls
const galleryCache = new Map<string, string[]>();

const getGalleryImages = async (slug: string): Promise<string[]> => {
  if (galleryCache.has(slug)) {
    return galleryCache.get(slug)!;
  }

  const images = await getSupabaseGalleryImages(slug);
  galleryCache.set(slug, images);
  return images;
};

export type Gallery = {
  slug: string;
  title: string;
  subtitle: string;
  blurb: string;
  cover: string;
  images: string[];
};

export const galleryConfigs = [{
  slug: 'bumps-and-beginnings',
  title: 'Bumps & Beginnings',
  subtitle: `Maternity`,
  blurb: "Ready to celebrate? Let’s capture your growing bump and the joy of what’s to come.",
  coverFilename: '00.jpg'
}, {
  slug: 'little-blooms',
  title: 'Little Blooms',
  subtitle: `Babies & Kids`,
  blurb: 'Childhood moves fast. Let’s pause time with playful, joy-filled portraits of your little ones as they grow.',
  coverFilename: '00.jpg'
}, {
  slug: 'love-and-connections',
  title: 'Love & Connections',
  subtitle: `Couples, Families & Friends`,
  blurb: 'Whether it’s a quiet moment with your partner, laughter with your family, or adventures with friends, we’ll capture the bonds that matter most',
  coverFilename: '00.jpg'
}, {
  slug: 'personal-portraits',
  title: 'Personal Portraits',
  subtitle: `Solos`,
  blurb: "From personal branding to just-because sessions, this is all about you.",
  coverFilename: '00.jpg'
}];

export const getGalleries = async (): Promise<Gallery[]> => {
  const galleries = await Promise.all(
    galleryConfigs.map(async (config) => ({
      ...config,
      cover: getCoverImageUrl(config.slug, config.coverFilename),
      images: await getGalleryImages(config.slug)
    }))
  );

  return galleries;
};
