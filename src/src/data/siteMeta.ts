export const site = {
  name: 'Little Bloom Photography',
  domain: 'littlebloomphotography.com',
  socials: {
    instagram: 'https://instagram.com/yourstudio',
    facebook: 'https://facebook.com/yourstudio',
    email: 'hello@littlebloomphotography.com'
  }
};
export const meta = {
  home: {
    title: 'Little Bloom Photography | Every life is a little bloom.',
    description: 'Family and kids photography with heart. Natural light sessions for bumps, babies, couples, and families.',
    hero: {
      headline: 'Capturing moments that last a lifetime',
      kicker: 'Authentic. Warm. Timeless.',
      cta: {
        label: 'Book a Session',
        to: '/contact'
      },
      images: {
        desktop: '/img/hero-desktop.jpg',
        mobile: '/img/hero-mobile.jpg'
      }
    },
    quickLinks: [{
      label: 'ABOUT ME',
      caption: 'Hi! I\'m Ayi..',
      to: '/about'
    }, {
      label: 'PORTFOLIO',
      caption: 'View galleries',
      to: '/portfolio'
    }, {
      label: 'SERVICES',
      caption: 'Details and Pricing',
      to: '/services'
    }],
    featured: [{
      title: 'Bumps & Beginnings',
      to: '/portfolio/bumps-and-beginnings',
      cover: '/img/bumps-and-beginnings/cover.jpg'
    }, {
      title: 'Little Blooms',
      to: '/portfolio/little-blooms',
      cover: '/img/little-blooms/cover.jpg'
    }, {
      title: 'Love & Connections',
      to: '/portfolio/love-and-connections',
      cover: '/img/love-and-connections/cover.jpg'
    }, {
      title: 'Personal Portraits',
      to: '/portfolio/personal-portraits',
      cover: '/img/personal-portraits/cover.jpg'
    }]
  },
  about: {
    title: 'About Me | Little Bloom Photography',
    description: "Hello, I am Ayi, I am glad you are here! Photography has always been my passion. I picked up my first camera over 20 years ago, not knowing it would become such a big part of my creative side. Through the years, I’ve captured many stories, but the one that changed everything was my own: becoming a mom."
  },
  faq: {
    title: 'Frequently Asked Questions | Little Bloom Photography',
    description: 'Everything you need to know for a smooth, joyful session.',
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
  services: {
    title: 'Sessions & Pricing | Little Bloom Photography',
    description: 'Your experience should be stress-free. My pricing is simple and transparent, with no hidden fees.',
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
  portfolio: {
    title: 'Portfolio | Little Bloom Photography',
    description: 'Explore our galleries by category.'
  },
  contact: {
    title: 'Contact & Booking | Little Bloom Photography',
    description: "Tell me about your family and the kind of session you're dreaming of.",
    successMessage: "Thanks for reaching out. I'll get back to you within one business day."
  },
  notFound: {
    title: 'Page Not Found | Little Bloom Photography',
    description: 'This page has moved or no longer exists.'
  }
};
