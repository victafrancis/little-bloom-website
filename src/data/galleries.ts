// Utility function to get all images in a gallery, in order
import { getGalleryImages as getSupabaseGalleryImages } from '../lib/supabase';

// Cache for gallery images to avoid repeated API calls
const galleryCache = new Map<string, string[]>();

export const getGalleryImages = async (slug: string): Promise<string[]> => {
  if (galleryCache.has(slug)) {
    return galleryCache.get(slug)!;
  }

  const images = await getSupabaseGalleryImages(slug);
  // An empty list may be a failed request, so leave it uncached to retry next time
  if (images.length > 0) {
    galleryCache.set(slug, images);
  }
  return images;
};

export const galleryConfigs = [{
  slug: 'bumps-and-beginnings',
  title: 'Bumps & Beginnings',
  subtitle: `Maternity`,
  blurb: "Ready to celebrate? Let’s capture your growing bump and the joy of what’s to come."
}, {
  slug: 'little-blooms',
  title: 'Little Blooms',
  subtitle: `Babies & Kids`,
  blurb: 'Childhood moves fast. Let’s pause time with playful, joy-filled portraits of your little ones as they grow.'
}, {
  slug: 'love-and-connections',
  title: 'Love & Connections',
  subtitle: `Couples, Families & Friends`,
  blurb: 'Whether it’s a quiet moment with your partner, laughter with your family, or adventures with friends, we’ll capture the bonds that matter most'
}, {
  slug: 'personal-portraits',
  title: 'Personal Portraits',
  subtitle: `Solos`,
  blurb: "From personal branding to just-because sessions, this is all about you."
}];
