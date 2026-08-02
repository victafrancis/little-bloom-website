import { getCoverImageUrl } from '../lib/supabase';

export const site = {
  name: 'Little Bloom Photography',
  domain: 'www.littlebloomphotography.com',
  url: 'https://www.littlebloomphotography.com',
  photographer: {
    name: 'Ayi',
    jobTitle: 'Photographer',
    // Drives the Person schema on /about; keep in step with the page copy.
    description:
      'Barrie-based family, maternity and newborn photographer with over 20 years behind the camera. Ayi founded Little Bloom Photography after becoming a mom.'
  },
  socials: {
    instagram: 'https://instagram.com/littlebloom.photos',
    facebook: 'https://www.facebook.com/people/Little-Bloom-Photography/61581269589318/',
    googleBusiness: 'https://g.page/r/CT9Kr6mwFHDjEAE',
    email: 'hello@littlebloomphotography.com'
  }
};

/**
 * Single source of truth for where sessions happen.
 *
 * Barrie is the only location covered with no travel fee, so it is stated
 * separately from the travel tier. Both the visible copy and the areaServed
 * schema read from here, which keeps the page and the markup from
 * contradicting each other.
 */
export const serviceArea = {
  primary: 'Barrie',
  region: 'Simcoe County',
  travel: [
    'Innisfil',
    'Oro-Medonte',
    'Springwater',
    'Angus',
    'Alliston',
    'Bradford',
    'Orillia',
    'Wasaga Beach',
    'Collingwood',
    'Midland'
  ]
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
    // Ordered by how often people ask before booking: money, deliverables and
    // timing first. Each answer is written to stand on its own, so it still
    // makes sense read in isolation.
    items: [{
      q: 'How much does a photo session cost?',
      a: 'Sessions start at $200 for The Budding Bloom, a 30-minute session, and $300 for The Flourishing Bloom, a one-hour session. Both packages include unlimited shots, time-permitting outfit changes, every edited high-resolution photo, an online gallery, and applicable taxes.',
      link: { to: '/pricing', label: 'See sessions and pricing' }
    }, {
      q: 'How many photos will I receive?',
      a: 'Every good shot from your session, with no cap on the number. All of them are edited and delivered in high resolution, and there is no extra charge for receiving more photos.'
    }, {
      q: 'When will I get my photos?',
      a: 'Usually within two weeks. The exact timing depends on how busy the season is, and I will let you know what to expect when we book your date.'
    }, {
      q: 'How long is a session?',
      a: 'Either 30 minutes or a full hour, depending on which package you choose.'
    }, {
      q: 'Where are you based, and do you travel?',
      a: `I am based in ${serviceArea.primary}, Ontario. Sessions in ${serviceArea.primary} have no travel fee. I also travel across ${serviceArea.region} and the surrounding area, including ${serviceArea.travel.join(', ')}, for a travel fee that depends on the distance and the type of session.`
    }, {
      q: 'What kinds of sessions do you offer?',
      a: 'Maternity, newborn, babies and kids, couples and family, and personal portraits.'
    }, {
      q: 'Do you photograph newborns?',
      a: 'Yes. Newborn sessions are welcome, and we keep the pace gentle and unhurried so your baby can set the schedule.'
    }, {
      q: 'Is a deposit required to hold my date?',
      a: 'Yes. A deposit is required to save your date, and your booking is confirmed once it is received.'
    }, {
      q: 'What is your cancellation policy?',
      a: 'You are welcome to cancel your session, but the deposit is non-refundable.'
    }, {
      q: 'What happens if it rains?',
      a: 'We reschedule at no cost. Weather is never something you need to worry about.'
    }, {
      q: 'What should we wear?',
      a: 'Coordinate rather than match. Neutral tones and simple patterns photograph best, and outfits you feel comfortable moving in will always look the most natural.',
      link: { to: '/notes/what-to-wear-for-photo-session', label: 'Read the full guide' }
    }, {
      q: 'Do you offer indoor or studio sessions?',
      a: 'Studio access is available as an optional add-on, scheduled around studio availability. Just ask when you enquire and I will let you know what is possible for your date.'
    }, {
      q: 'Do you provide prints?',
      a: 'Yes, through a professional lab.'
    }, {
      q: 'What is your photography style?',
      a: 'Natural light and unposed. Sessions feel less like a photoshoot and more like spending time with a friend: I will guide you when you need it, and step back when a moment is happening on its own.'
    }, {
      q: 'How do I book a session?',
      a: 'Send a message through the contact form with a little about your family and the kind of session you have in mind. I reply within one business day.',
      link: { to: '/contact', label: 'Get in touch' }
    }]
  },
  pricing: {
    title: 'Sessions & Pricing | Little Bloom Photography',
    description: 'Your experience should be stress-free. My pricing is simple and transparent, with no hidden fees.',
    keywords: 'photography prices Ontario, family photography cost Barrie, maternity photography pricing Ontario, newborn photography prices Ontario, Barrie photographer prices',
    // `price` is for display; `amount`/`duration` feed the Offer schema, which
    // needs a bare number and an ISO 8601 duration.
    packages: [{
      name: 'The Budding Bloom',
      price: '$200',
      amount: 200,
      durationLabel: '30 minutes',
      duration: 'PT30M',
      image: '/assets/budding bloom.png',
      details: ['30-Minute Photo Session', 'Unlimited Shots', 'Full Access to Edited Images', 'Online gallery']
    }, {
      name: 'The Flourishing Bloom',
      price: '$300',
      amount: 300,
      durationLabel: '1 hour',
      duration: 'PT1H',
      image: '/assets/flourishing bloom.png',
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
