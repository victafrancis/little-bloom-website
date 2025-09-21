// Utility function to get all images from a gallery folder
const getGalleryImages = (slug: string): string[] => {
  const imageModules = import.meta.glob([
    '/public/img/*/*.{jpg,jpeg,png,webp,gif}',
    '/public/img/*/*.{JPG,JPEG,PNG,WEBP,GIF}'
  ], {
    eager: true,
    as: 'url'
  }) as Record<string, string>;

  return Object.keys(imageModules)
    .filter(path => path.includes(`/${slug}/`))
    .map(path => imageModules[path])
    .sort(); // Sort for consistent ordering
};

export type Gallery = {
  slug: string;
  title: string;
  subtitle: string;
  blurb: string;
  cover: string;
  images: string[];
};

export const galleries: Gallery[] = [{
  slug: 'bumps-and-beginnings',
  title: 'Bumps & Beginnings',
  subtitle: `Maternity`,
  blurb: "Ready to celebrate? Let’s capture your growing bump and the joy of what’s to come.",
  cover: '/img/bumps-and-beginnings/cover.jpg',
  images: getGalleryImages('bumps-and-beginnings')
}, {
  slug: 'little-blooms',
  title: 'Little Blooms',
  subtitle: `Babies & Kids`,
  blurb: 'Childhood moves fast. Let’s pause time with playful, joy-filled portraits of your little ones as they grow.',
  cover: '/img/little-blooms/cover.jpg',
  images: getGalleryImages('little-blooms')
}, {
  slug: 'love-and-connections',
  title: 'Love & Connections',
  subtitle: `Couples, Families & Friends`,
  blurb: 'Whether it’s a quiet moment with your partner, laughter with your family, or adventures with friends — we’ll capture the bonds that matter most',
  cover: '/img/love-and-connections/cover.jpg',
  images: getGalleryImages('love-and-connections')
}, {
  slug: 'personal-portraits',
  title: 'Personal Portraits',
  subtitle: `Solos`,  
  blurb: "From personal branding to just-because sessions, this is all about you.",
  cover: '/img/personal-portraits/cover.jpg',
  images: getGalleryImages('personal-portraits')
}];
