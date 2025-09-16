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
      images: ['/placeholder-2.jpg']
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
      title: 'Family Fun',
      to: '/portfolio/family-fun',
      cover: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=2670&auto=format&fit=crop'
    }, {
      title: 'Little Blooms',
      to: '/portfolio/little-blooms',
      cover: 'https://images.unsplash.com/photo-1612209246511-5b81949e5fdd?q=80&w=2679&auto=format&fit=crop'
    }, {
      title: 'Love Stories',
      to: '/portfolio/love-stories',
      cover: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?q=80&w=2670&auto=format&fit=crop'
    }]
  },
  about: {
    title: 'About Me | Little Bloom Photography',
    description: "Hi, I'm Ayi, and I've been capturing families and kids for over 20 years. My goal is to create relaxed, fun sessions where real moments shine."
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
