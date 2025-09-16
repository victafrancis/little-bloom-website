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
  cover: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?q=80&w=2670&auto=format&fit=crop',
  images: ['https://images.unsplash.com/photo-1544126592-807ade215a0b?q=80&w=2670&auto=format&fit=crop', '/placeholder.jpeg']
}, {
  slug: 'little-blooms',
  title: 'Little Blooms',
  blurb: 'I let babies chill and kids be kids! Their boundless energy and genuine personalities will shine through in a fun, natural way, from their tiny details to their biggest grins.',
  cover: 'https://images.unsplash.com/photo-1612209246511-5b81949e5fdd?q=80&w=2679&auto=format&fit=crop',
  images: ['https://images.unsplash.com/photo-1612209246511-5b81949e5fdd?q=80&w=2679&auto=format&fit=crop', '/placeholder.jpeg']
}, {
  slug: 'love-stories',
  title: 'Love Stories',
  blurb: 'Your relationship is an adventure. We will make a permanent record of the moments of laughter, love, and connection.',
  cover: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=2670&auto=format&fit=crop',
  images: ['https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=2670&auto=format&fit=crop', 'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?q=80&w=2669&auto=format&fit=crop']
}, {
  slug: 'family-fun',
  title: 'Family Fun',
  blurb: "The best family photos are born from fun. Let's run, play, and be silly to tell your family's story.",
  cover: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=2670&auto=format&fit=crop',
  images: ['https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=2670&auto=format&fit=crop', 'https://images.unsplash.com/photo-1581952976147-5a2d15560349?q=80&w=2671&auto=format&fit=crop']
}, {
  slug: 'personal-portraits',
  title: 'Personal Portraits',
  blurb: "Show the world the real you. We'll create a powerful, authentic portrait for your brand or personal journey.",
  cover: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=2670&auto=format&fit=crop',
  images: ['https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=2670&auto=format&fit=crop', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=2564&auto=format&fit=crop']
}];