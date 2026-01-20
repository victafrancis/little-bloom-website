import { getCoverImageUrl } from '../lib/supabase';

export const site = {
  name: 'Little Bloom Photography',
  domain: 'www.littlebloomphotography.com',
  socials: {
    instagram: 'https://instagram.com/littlebloom.photos',
    facebook: 'https://www.facebook.com/people/Little-Bloom-Photography/61581269589318/',
    email: 'hello@littlebloomphotography.com'
  }
};
export const meta = {
  home: {
    title: 'Little Bloom Photography | Little moments, big memories.',
    description: 'Family and kids photography with heart. Natural light sessions for bumps, babies, couples, and families.',
    keywords: 'family photographer Ontario, maternity photographer Ontario, newborn photographer Ontario, lifestyle photography, natural light photographer, Barrie photographer, Innisfil photographer, Simcoe County photographer, Orillia photographer, Collingwood photographer, Wasaga Beach photographer, Midland photographer, Alliston photographer, Bradford photographer, Vaughan photographer, Toronto photographer, York Region photographer, Newmarket photographer, Aurora photographer, Richmond Hill photographer, Markham photographer, Mississauga photographer, Brampton photographer, couples photographer, kids photographer, portrait photographer',
    hero: {
      headline: 'Capturing moments that last a lifetime',
      kicker: 'Authentic. Warm. Timeless.',
      cta: {
        label: 'Book a Session',
        to: '/contact'
      },
      images: {
        desktop: '/img/hero-desktop.webp',
        mobile: '/img/hero-mobile.webp'
      }
    },
    quickLinks: [{
      label: 'ABOUT ME',
      caption: 'Hi! I\'m Ayi..',
      to: '/about'
    }, {
      label: 'THE EXPERIENCE',
      caption: 'Services and Pricing',
      to: '/pricing'
    }, {
      label: 'NOTES',
      caption: 'Tips & Inspiration',
      to: '/notes'
    }],
    featured: [{
      title: 'Bumps & Beginnings',
      to: '/gallery/bumps-and-beginnings',
      cover: getCoverImageUrl('bumps-and-beginnings', '00.jpg')
    }, {
      title: 'Little Blooms',
      to: '/gallery/little-blooms',
      cover: getCoverImageUrl('little-blooms', '00.jpg')
    }, {
      title: 'Love & Connections',
      to: '/gallery/love-and-connections',
      cover: getCoverImageUrl('love-and-connections', '00.jpg')
    }, {
      title: 'Personal Portraits',
      to: '/gallery/personal-portraits',
      cover: getCoverImageUrl('personal-portraits', '00.jpg')
    }]
  },
  about: {
    title: 'About Me | Little Bloom Photography',
    description: "Hello, I am Ayi, I am glad you are here! Photography has always been my passion. I picked up my first camera over 20 years ago, not knowing it would become such a big part of my creative side. Through the years, I’ve captured many stories, but the one that changed everything was my own: becoming a mom.",
    keywords: 'about little bloom photography, professional photographer Ontario, photographer Barrie, photographer Innisfil, family photographer Ontario, maternity photographer Ontario, newborn photographer Ontario'
  },
  faq: {
    title: 'Frequently Asked Questions | Little Bloom Photography',
    description: 'Everything you need to know for a smooth, joyful session.',
    keywords: 'photography faq Ontario, barrie photographer questions, family photography faq, maternity photography questions, newborn photography faq Ontario',
    items: [{
      q: 'What should we wear?',
      a: "Coordinate but don't match, neutrals work best."
    }, {
      q: 'How long are sessions?',
      a: '60–90 minutes.'
    }, {
      q: 'Do you provide prints?',
      a: 'Yes, through a professional lab.'
    }, {
      q: 'What if it rains?',
      a: 'We reschedule at no cost.'
    }]
  },
  pricing: {
    title: 'Sessions & Pricing | Little Bloom Photography',
    description: 'Your experience should be stress-free. My pricing is simple and transparent, with no hidden fees.',
    keywords: 'photography prices Ontario, family photography cost Barrie, maternity photography pricing Ontario, newborn photography prices Ontario, Barrie photographer prices',
    packages: [{
      name: 'The Budding Bloom',
      price: '$200',
      details: ['30-Minute Photo Session', 'Unlimited Shots', 'Full Access to Edited Images', 'Online gallery']
    }, {
      name: 'The Flourishing Bloom',
      price: '$300',
      details: ['1-Hour Photo Session', 'Unlimited Shots', 'Full Access to Edited Images', 'Online gallery']
    }],
    cta: {
      label: 'Check Availability',
      to: '/contact'
    }
  },
  gallery: {
    title: 'Gallery | Little Bloom Photography',
    description: 'Explore our galleries by category.',
    keywords: 'photography portfolio Ontario, family photography gallery, maternity photography gallery, newborn photography gallery, Barrie photographer portfolio, Innisfil photographer portfolio'
  },
  notes: {
    title: 'Notes | Little Bloom Photography',
    description: 'Photography tips, inspiration, and guides to help you prepare for your session.',
    keywords: 'photography tips Ontario, family photography tips, maternity photography guide, newborn photography advice, Barrie photographer blog, Simcoe County photography blog',
    list: {
      title: 'Notes | Little Bloom Photography',
      description: 'Photography tips, inspiration, and guides from Little Bloom Photography'
    }
  },
  contact: {
    title: 'Contact & Booking | Little Bloom Photography',
    description: "Tell me about your family and the kind of session you're dreaming of.",
    keywords: 'book photography session Ontario, contact family photographer Barrie, photographer availability Innisfil, Ontario photography booking',
    successMessage: "Thanks for reaching out. I'll get back to you within one business day."
  },
  notFound: {
    title: 'Page Not Found | Little Bloom Photography',
    description: 'This page has moved or no longer exists.',
    keywords: '404 error, page not found, barrie photography'
  }
};
