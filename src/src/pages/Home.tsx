import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Hero } from '../components/Hero';
import { CTABand } from '../components/CTABand';
import { ArrowRightIcon } from 'lucide-react';
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
      <Helmet>
        <title>{meta.home.title}</title>
        <meta name="description" content={meta.home.description} />

        {/* Open Graph tags for Facebook, WhatsApp, LinkedIn, etc. */}
        <meta property="og:title" content={meta.home.title} />
        <meta property="og:description" content={meta.home.description} />
        <meta property="og:image" content={meta.home.hero.images.desktop} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content="https://www.littlebloomphotography.com/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Little Bloom Photography" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={meta.home.title} />
        <meta name="twitter:description" content={meta.home.description} />
        <meta name="twitter:image" content={meta.home.hero.images.desktop} />
      </Helmet>
      <main>
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
                  className="w-20 h-20 object-cover"
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
        <img
          src="/assets/flowers.png"
          alt="Decorative image"
          className="w-max h-max object-cover mx-auto"
        />
      </main>
    </>;
}
