import React from 'react';
import SEO from '../components/SEO';
import { ContactForm } from '../components/ContactForm';
import { meta, site, serviceArea } from '../data/siteMeta';
export default function Contact() {
  return <>
      <SEO
        title={meta.contact.title}
        description={meta.contact.description}
        keywords={meta.contact.keywords}
        image="/img/hero-desktop.webp"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'ContactPage',
            url: `${site.url}/contact`,
            mainEntity: {
              '@type': 'LocalBusiness',
              name: site.name,
              url: site.url,
              email: site.socials.email,
              address: {
                '@type': 'PostalAddress',
                addressLocality: serviceArea.primary,
                addressRegion: 'ON',
                addressCountry: 'CA'
              },
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'booking',
                email: site.socials.email,
                availableLanguage: 'English'
              }
            }
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
              { '@type': 'ListItem', position: 2, name: 'Contact & Booking', item: `${site.url}/contact` }
            ]
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
            {/* States the booking basics as text: previously the only contact
                detail on the page was the form itself. */}
            <div className="bg-cream rounded-lg p-6 mt-12 text-sm md:text-base text-text/70 space-y-2">
              <p>
                Prefer email? Reach me at{' '}
                <a href={`mailto:${site.socials.email}`} className="text-mustard hover:underline">
                  {site.socials.email}
                </a>
                . I reply within one business day.
              </p>
              <p>
                All sessions are by appointment. I am based in {serviceArea.primary}, Ontario, and
                also travel across {serviceArea.region} and the surrounding area for a travel fee.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>;
}
