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
  blurb: string;
  cover: string;
  images: string[];
};

export const galleries: Gallery[] = [{
  slug: 'bumps-and-beginnings',
  title: 'Bumps & Beginnings',
  blurb: "Ready to celebrate? We'll capture the incredible chapter of your life, and that includes your growing bump.",
  cover: '/img/bumps-and-beginnings/cover.jpg',
  images: getGalleryImages('bumps-and-beginnings')
}, {
  slug: 'little-blooms',
  title: 'Little Blooms',
  blurb: 'I let babies chill and kids be kids! Their boundless energy and genuine personalities will shine through in a fun, natural way, from their tiny details to their biggest grins.',
  cover: '/img/little-blooms/cover.jpg',
  images: getGalleryImages('little-blooms')
}, {
  slug: 'love-and-connections',
  title: 'Love & Connections',
  blurb: 'Your relationship is an adventure. We will make a permanent record of the moments of laughter, love, and connection.',
  cover: '/img/love-and-connections/cover.jpg',
  images: getGalleryImages('love-and-connections')
}, {
  slug: 'personal-portraits',
  title: 'Personal Portraits',
  blurb: "Show the world the real you. We'll create a powerful, authentic portrait for your brand or personal journey.",
  cover: '/img/personal-portraits/cover.jpg',
  images: getGalleryImages('personal-portraits')
}];
