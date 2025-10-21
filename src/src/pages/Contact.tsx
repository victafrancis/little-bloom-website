import React from 'react';
import SEO from '../components/SEO';
import { ContactForm } from '../components/ContactForm';
import { meta, site } from '../data/siteMeta';
export default function Contact() {
  return <>
      <SEO
        title={meta.contact.title}
        description={meta.contact.description}
        keywords={meta.contact.keywords}
        image="/img/hero-desktop.jpg"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': ['Organization','LocalBusiness','PhotographyStudio'],
            name: 'Little Bloom Photography',
            url: 'https://www.littlebloomphotography.com',
            image: 'https://www.littlebloomphotography.com/img/hero-desktop.jpg',
            logo: 'https://www.littlebloomphotography.com/assets/logo.png',
            sameAs: [
              'https://www.instagram.com/littlebloom.photos',
              'https://www.facebook.com/people/Little-Bloom-Photography/61581269589318/',
              'https://g.page/r/CT9Kr6mwFHDjEAE'
            ],
            address: { '@type':'PostalAddress', addressLocality: 'Barrie', addressRegion: 'ON', addressCountry: 'CA' },
            geo: { '@type': 'GeoCoordinates', latitude: 44.3894, longitude: -79.6903 },
            areaServed: ['Ontario','Barrie','Innisfil','Simcoe County','Orillia','Collingwood','Wasaga Beach','Midland','Alliston','Bradford','Vaughan','Toronto','York Region','Newmarket','Aurora','Richmond Hill','Markham','Mississauga','Brampton','Keswick','Georgina'],
            priceRange: '$$',
            description: 'Family and kids photography with heart. Natural light sessions for bumps, babies, couples, and families.',
            knowsAbout: ['Family Photography', 'Maternity Photography', 'Newborn Photography', 'Kids Photography', 'Couples Photography', 'Portrait Photography']
          }
        ]}
      />
      <main className="pt-24 md:pt-32">
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-center text-3xl md:text-4xl font-light mb-6">
              Let's Connect!
            </h1>
            <p className="text-text/70 mb-12">
              Whether you're planning a family session or a special portrait,
              I'd love to hear from you.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-3">
                <ContactForm />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>;
}
