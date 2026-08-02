import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Button } from '../components/Button';
import { meta, site } from '../data/siteMeta';
export default function FAQ() {
  return <>
      <SEO
        title={meta.faq.title}
        description={meta.faq.description}
        keywords={meta.faq.keywords}
        image="/assets/flowers.png"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: meta.faq.items.map(item => ({
              '@type': 'Question',
              name: item.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.a
              }
            }))
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${site.url}/` },
              { '@type': 'ListItem', position: 2, name: 'FAQ', item: `${site.url}/faq` }
            ]
          }
        ]}
      />
      <main className="pt-24 md:pt-32">
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-center text-3xl md:text-4xl font-light mb-8">
              Frequently Asked Questions
            </h1>
            <p className="text-text/70 mb-12">{meta.faq.description}</p>
            <dl className="space-y-4">
              {meta.faq.items.map((item, index) => <div key={index} className="border border-text/30 p-6 rounded-lg">
                  <dt className="text-xl font-display mb-3">{item.q}</dt>
                  <dd className="text-text/70">
                    {item.a}
                    {'link' in item && item.link && (
                      <Link to={item.link.to} className="block mt-3 text-mustard hover:underline">
                        {item.link.label} →
                      </Link>
                    )}
                  </dd>
                </div>)}
            </dl>
            <div className="bg-mustard/10 p-6 mt-10 rounded-lg text-center">
              <p className="mb-6">
                Have more questions? I'm happy to answer them!
              </p>
              <Button to="/contact">Contact Me</Button>
            </div>
          </div>
        </section>
      </main>
    </>;
}
