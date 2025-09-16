import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/Button';
import { CTABand } from '../components/CTABand';
import { meta } from '../data/siteMeta';
export default function Services() {
  return <>
      <Helmet>
        <title>{meta.services.title}</title>
        <meta name="description" content={meta.services.description} />
      </Helmet>
      <main className="pt-24 md:pt-32">
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-display mb-8">
              Sessions & Pricing
            </h1>
            <div className="prose max-w-none mb-12">
              <p>
                Your experience should be stress-free. My pricing is simple and
                transparent, with no hidden fees.
              </p>
              <p>
                All packages come with unlimited shots, the option for outfit
                changes - time permitting.
              </p>
              <p>
                Plus, you'll get FULL ACCESS to all edited, high-resolution
                photos, YES, you deserve every great shot, so I'll never limit
                the number of photos you receive.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {meta.services.packages.map((pkg, index) => <div key={index} className="border-2 border-text/10 rounded-xl p-8 hover:border-sage/50 transition-colors">
                  <h2 className="text-2xl font-display mb-2">{pkg.name}</h2>
                  <p className="text-3xl font-semibold text-sage mb-6">
                    {pkg.price}
                  </p>
                  <ul className="space-y-3">
                    {pkg.details.map((detail, idx) => <li key={idx} className="flex items-start">
                        <span className="inline-block w-5 h-5 bg-sage/20 rounded-full mr-3 flex-shrink-0 mt-1"></span>
                        <span>{detail}</span>
                      </li>)}
                  </ul>
                </div>)}
            </div>
            <div className="bg-cream p-8 rounded-xl mb-16">
              <h2 className="text-xl font-display mb-4">Optional Add-ons</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">
                    For the "Bumps & Beginnings" Package: Newborn Photos
                  </h3>
                  <p className="text-text/70">
                    An additional $100 for a 45-minute session dedicated to
                    capturing your little one, to be scheduled once they arrive.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">
                    Access to a Beautiful Studio
                  </h3>
                  <p className="text-text/70">
                    An additional $150 if you want an aesthetic & controlled
                    environment for your photos. We can schedule based on the
                    studio's availability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <CTABand headline="Ready to book your session?" subheading="Check availability and secure your date." buttonText="Contact Me" buttonLink="/contact" />
      </main>
    </>;
}