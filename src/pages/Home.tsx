import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Hero } from '../components/Hero';
import { CTABand } from '../components/CTABand';
import { ArrowRightIcon, MapPin } from 'lucide-react';
import { meta } from '../data/siteMeta';

const archedBackgroundStyle = {
  clipPath: 'ellipse(80% 80% at 50% 80%)',
  backgroundColor: '#FFF5F2',
  minHeight: '300px',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  padding: '2rem 2rem 1rem 2rem',
  width: '600px',
};

export default function Home() {
  return <>
      <SEO
        title={meta.home.title}
        description={meta.home.description}
        keywords={meta.home.keywords}
        image={meta.home.hero.images.desktop.replace('.webp', '.jpg')}
        type="website"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': ['LocalBusiness','ProfessionalService'],
            name: 'Little Bloom Photography',
            url: 'https://www.littlebloomphotography.com',
            image: 'https://www.littlebloomphotography.com/img/hero-desktop.webp',
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
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Family Photography',
            description: 'Natural light family portrait sessions capturing authentic moments and connections',
            provider: { '@type': 'Organization', name: 'Little Bloom Photography' },
            areaServed: { '@type': 'Place', name: 'Barrie, Ontario' },
            serviceType: 'Photography'
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Maternity Photography',
            description: 'Beautiful maternity portrait sessions celebrating the journey of motherhood',
            provider: { '@type': 'Organization', name: 'Little Bloom Photography' },
            areaServed: { '@type': 'Place', name: 'Barrie, Ontario' },
            serviceType: 'Photography'
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Newborn Photography',
            description: 'Gentle newborn portrait sessions capturing precious early moments',
            provider: { '@type': 'Organization', name: 'Little Bloom Photography' },
            areaServed: { '@type': 'Place', name: 'Barrie, Ontario' },
            serviceType: 'Photography'
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Kids Photography',
            description: 'Fun and natural children\'s portrait sessions for babies, toddlers, and kids',
            provider: { '@type': 'Organization', name: 'Little Bloom Photography' },
            areaServed: { '@type': 'Place', name: 'Barrie, Ontario' },
            serviceType: 'Photography'
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Couples Photography',
            description: 'Romantic couples portrait sessions capturing love and connection',
            provider: { '@type': 'Organization', name: 'Little Bloom Photography' },
            areaServed: { '@type': 'Place', name: 'Barrie, Ontario' },
            serviceType: 'Photography'
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type':'ListItem', position:1, name:'Home', item:'https://www.littlebloomphotography.com/' }
            ]
          }
        ]}
      />
      <main>
        <h1 className="sr-only">Little Bloom Photography | Family, Maternity, Newborn Photographer in Barrie, Innisfil and across Ontario</h1>
        <Hero
          headline={meta.home.hero.headline}
          kicker={meta.home.hero.kicker}
          backgroundImageDesktop={meta.home.hero.images.desktop}
          backgroundImageMobile={meta.home.hero.images.mobile}
          cta={meta.home.hero.cta}
        />
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-4xl font-display mb-6">
                Little Moments,<br />
                Big Memories
              </h2>
              <p className="text-text/60 text-base lg:text-lg leading-relaxed md:leading-normal">
                Motherhood showed me how quickly the little things pass. One day it’s baby giggles and cuddles, the next it’s new milestones. <br />I want to hold onto those moments, and help you do the same with photos that feel real and natural.
              </p>
              <div className="flex justify-center pt-8">
                <img
                  src="/assets/butterfly.png"
                  alt="Decorative image"
                  className="w-20 h-20 aspect-square object-cover"
                />
              </div>
            </div>
          </div>
        </section>
        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Cream section menu */}
          <section className="py-4 bg-cream">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                {/* Menu */}
                {meta.home.quickLinks.map((link, index) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center justify-between py-3 ${index < meta.home.quickLinks.length - 1 ? 'border-b border-text/10' : ''} group`}
                  >
                    <div className="flex-1 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-xl font-display">
                          {link.label}
                        </span>
                        <span className="text-sm text-text/70">
                          {link.caption}
                        </span>
                      </div>
                    </div>
                    <ArrowRightIcon className="w-6 h-6 transform group-hover:translate-x-2 transition-transform md:mr-4" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Desktop Layout */}
        <section className="hidden md:block relative">
          <div className="flex justify-center min-h-[300px]">
            {/* QuickLinks Menu with arched cream background */}
            <div style={archedBackgroundStyle}>
              <div className="max-w-md mx-auto w-full">
                {meta.home.quickLinks.map((link, index) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center justify-between py-3 ${index < meta.home.quickLinks.length - 1 ? 'border-b border-text/10' : ''} group`}
                  >
                    <div className="flex-1 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-2xl font-display">
                          {link.label}
                        </span>
                        <span className="text-sm text-text/70">
                          {link.caption}
                        </span>
                      </div>
                    </div>
                    <ArrowRightIcon className="w-6 h-6 transform group-hover:translate-x-2 transition-transform md:mr-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Work Section */}
        <section className="py-16 md:py-24 mt-5">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-display mb-8 text-center">
              Explore Galleries
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {meta.home.featured.map(item => <Link key={item.to} to={item.to} className="group">
                  <div className="relative overflow-hidden rounded-lg aspect-square mb-4 max-w-96 mx-auto">
                    <img src={item.cover} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <h3 className="text-center text-base md:text-xl font-light">{item.title}</h3>
                </Link>)}
            </div>
          </div>
        </section>

        <CTABand headline="Your story is beautiful, I’d be honored to capture it." buttonText="Contact Me" buttonLink="/contact" />
      </main>
    </>;
}
