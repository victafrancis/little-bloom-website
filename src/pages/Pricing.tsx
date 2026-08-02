import React from 'react';
import SEO from '../components/SEO';
import { Button } from '../components/Button';
import { CTABand } from '../components/CTABand';
import { meta, site, serviceArea } from '../data/siteMeta';
import { MapPin } from 'lucide-react';
export default function Pricing() {
  const travelList = serviceArea.travel.join(', ');
  return <>
      <SEO
        title={meta.pricing.title}
        description={meta.pricing.description}
        keywords={meta.pricing.keywords}
        image="/img/hero-desktop.webp"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'OfferCatalog',
            name: 'Photography Session Packages',
            url: `${site.url}/pricing`,
            provider: { '@type': 'LocalBusiness', name: site.name, url: site.url },
            itemListElement: meta.pricing.packages.map(pkg => ({
              '@type': 'Offer',
              name: pkg.name,
              price: String(pkg.amount),
              priceCurrency: 'CAD',
              // Taxes are stated as included in the package inclusions.
              valueAddedTaxIncluded: true,
              availability: 'https://schema.org/InStock',
              description: `${pkg.durationLabel} photo session. ${pkg.details.join('. ')}.`,
              areaServed: [serviceArea.primary, ...serviceArea.travel].map(name => ({
                '@type': 'Place',
                name: `${name}, Ontario`
              })),
              itemOffered: {
                '@type': 'Service',
                name: pkg.name,
                serviceType: 'Photography session',
                provider: { '@type': 'LocalBusiness', name: site.name, url: site.url }
              }
            }))
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
              { '@type': 'ListItem', position: 2, name: 'Sessions & Pricing', item: `${site.url}/pricing` }
            ]
          }
        ]}
      />
      <main className="pt-24 md:pt-32">
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-center text-3xl md:text-4xl font-light mb-8">
              Pricing & Packages
            </h1>
            <div className="pb-6 px-4">
              <p>
                Your experience should be simple and stress-free. That’s why my pricing is <b>transparent, with no hidden fees.</b>
              </p>
              <p className="mt-3">
                Sessions in {serviceArea.primary} start at{' '}
                {meta.pricing.packages[0].price} for {meta.pricing.packages[0].durationLabel}, or{' '}
                {meta.pricing.packages[1].price} for {meta.pricing.packages[1].durationLabel}. Every
                package includes all of your edited, high-resolution photos with no limit on the
                number of images.
              </p>
            </div>
            
            <div className="bg-cream p-8 rounded-xl mb-8">
              <h2 className="text-xl font-display mb-4">Both packages below include:</h2>
              <ul className="list-disc list-inside text-text/70">
                <li>Unlimited shots (no cap on the best moments, I am a trigger-happy type of photographer)</li>
                <li>Time-permitting outfit changes.</li>
                <li>Full access to <b>ALL</b> edited, high-resolution photos. You’ll receive every great shot, no limits on the number because you deserve them all!</li>
                <li>Applicable taxes</li>
              </ul>
            </div>
            {/* The package name, price and duration are set inside these
                images, so the alt text carries the same facts as real text. */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {meta.pricing.packages.map(pkg => (
                <div key={pkg.name} className="bg-cream p-8 rounded-xl">
                  <img
                    src={pkg.image}
                    alt={`${pkg.name} — ${pkg.price}, ${pkg.durationLabel} photo session`}
                    className="max-w-full h-auto aspect-square object-contain mx-auto"
                  />
                </div>
              ))}
            </div>
            
            <div className="p-8 rounded-xl mb-8 border border-solid border-gray-300">
              <h2 className="text-xl font-display mb-4">Optional Add-on</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">
                    Studio Access
                  </h3>
                  <p className="text-text/70">
                    Capture your photos in a beautiful, controlled indoor studio environment. (Scheduled based on studio availability. Ask me for more details!)
                  </p>
                </div>
              </div>
            </div>

            {/* Location Information Section */}
            <div className="pb-2 rounded-xl border-gray-300">
              <div className="max-w-2xl mx-auto">
                <div className="bg-cream p-4 rounded-lg text-center">
                  <div className="flex justify-center items-center mb-4">
                    <MapPin className="w-8 h-8 text-mustard mr-3" />
                    <h3 className="text-lg md:text-xl font-display">Service Area</h3>
                  </div>
                  <p className="text-text/70 text-sm md:text-base leading-relaxed">
                    Sessions in <b>{serviceArea.primary}</b> are included in the package price with
                    no travel fee. I also travel across {serviceArea.region} and the surrounding
                    area, including {travelList}, with a travel fee that depends on the distance and
                    the type of session. Not sure whether you are in range? Just ask.
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
