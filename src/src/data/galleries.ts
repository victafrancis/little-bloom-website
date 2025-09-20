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
  images: ['https://images.unsplash.com/photo-1544126592-807ade215a0b?q=80&w=2670&auto=format&fit=crop', '/placeholder.jpeg']
}, {
  slug: 'little-blooms',
  title: 'Little Blooms',
  blurb: 'I let babies chill and kids be kids! Their boundless energy and genuine personalities will shine through in a fun, natural way, from their tiny details to their biggest grins.',
  cover: '/img/little-blooms/cover.jpg',
  images: ['https://images.unsplash.com/photo-1612209246511-5b81949e5fdd?q=80&w=2679&auto=format&fit=crop', '/placeholder.jpeg']
}, {
  slug: 'love-and-connections',
  title: 'Love & Connections',
  blurb: 'Your relationship is an adventure. We will make a permanent record of the moments of laughter, love, and connection.',
  cover: '/img/love-and-connections/cover.jpg',
  images: ['https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=2670&auto=format&fit=crop', 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?q=80&w=2669&auto=format&fit=crop']
}, {
  slug: 'personal-portraits',
  title: 'Personal Portraits',
  blurb: "Show the world the real you. We'll create a powerful, authentic portrait for your brand or personal journey.",
  cover: '/img/personal-portraits/cover.jpg',
  images: ['https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=2670&auto=format&fit=crop', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=2564&auto=format&fit=crop']
}];