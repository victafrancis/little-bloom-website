import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Hero } from '../components/Hero';
import { CTABand } from '../components/CTABand';
import { ArrowRightIcon } from 'lucide-react';
import { meta } from '../data/siteMeta';
export default function Home() {
  return <>
      <Helmet>
        <title>{meta.home.title}</title>
        <meta name="description" content={meta.home.description} />
        <meta property="og:title" content={meta.home.title} />
        <meta property="og:description" content={meta.home.description} />
        <meta property="og:image" content={meta.home.hero.images.desktop} />
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
                Little Moments<br />
                Big Memories
              </h2>
              <p className="text-text/60 text-base lg:text-lg leading-relaxed md:leading-normal">
                Becoming a mother showed me how quickly time passes and how precious each memory is. My firstborn inspired me to see beauty in the everyday and to capture it before it slips away.
              </p><br />
              <p className="text-text/60 text-base lg:text-lg leading-relaxed md:leading-normal">
                That’s what I want for you — relaxed, natural photos where you can laugh, play, and simply be yourselves, knowing your family’s authentic moments are being preserved forever.
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
                    className="flex items-center justify-between py-3 border-b border-text/10 group"
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
          <div className="grid grid-cols-3 min-h-[400px]">
            {/* Left - Empty */}
            <div></div>

            {/* Center - QuickLinks Menu with cream background */}
            <div className="bg-cream flex flex-col justify-center py-16">
              <div className="max-w-md mx-auto w-full">
                {meta.home.quickLinks.map((link, index) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="flex items-center justify-between py-6 border-b border-text/10 group"
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

            {/* Right - Empty */}
            <div></div>
          </div>
        </section>

        {/* Featured Work Section */}
        <section className="py-16 md:py-24 mt-5">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-display mb-8 text-center">
              Featured Work
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {meta.home.featured.map(item => <Link key={item.to} to={item.to} className="group">
                  <div className="relative overflow-hidden rounded-lg aspect-square mb-4">
                    <img src={item.cover} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <h3 className="text-center text-lg font-medium">{item.title}</h3>
                </Link>)}
            </div>
          </div>
        </section>
        <CTABand headline="Ready to book your next session?" buttonText="Contact Me" buttonLink="/contact" />
      </main>
    </>;
}
