import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ContactForm } from '../components/ContactForm';
import { meta, site } from '../data/siteMeta';
export default function Contact() {
  return <>
      <Helmet>
        <title>{meta.contact.title}</title>
        <meta name="description" content={meta.contact.description} />
      </Helmet>
      <main className="pt-24 md:pt-32">
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-display mb-6">
              Let's Connect!
            </h1>
            <p className="text-text/70 mb-12">
              Whether you're planning a family session or a special portrait,
              I'd love to hear from you.
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <ContactForm />
              </div>
              <div>
                <div className="bg-cream p-6 rounded-lg">
                  <h2 className="text-xl font-display mb-4">
                    Contact Information
                  </h2>
                  <div className="space-y-4 text-text/70">
                    <p>
                      <strong className="block text-text">Email</strong>
                      <a href={`mailto:${site.socials.email}`} className="hover:text-sage">
                        {site.socials.email}
                      </a>
                    </p>
                    <p>
                      <strong className="block text-text">Phone</strong>
                      <a href="tel:+14155551234" className="hover:text-sage">
                        (415) 555-1234
                      </a>
                    </p>
                    <p>
                      <strong className="block text-text">
                        Studio Address
                      </strong>
                      123 Photography Lane
                      <br />
                      San Francisco, CA 94110
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>;
}
