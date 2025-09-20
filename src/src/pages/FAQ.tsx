import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/Button';
import { meta } from '../data/siteMeta';
export default function FAQ() {
  return <>
      <Helmet>
        <title>{meta.faq.title}</title>
        <meta name="description" content={meta.faq.description} />
      </Helmet>
      <main className="pt-24 md:pt-32">
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-center text-3xl md:text-4xl font-light mb-8">
              Frequently Asked Questions
            </h1>
            <p className="text-text/70 mb-12">{meta.faq.description}</p>
            <dl className="space-y-8">
              {meta.faq.items.map((item, index) => <div key={index} className="border-b border-text/10 pb-8">
                  <dt className="text-xl font-display mb-3">{item.q}</dt>
                  <dd className="text-text/70">{item.a}</dd>
                </div>)}
            </dl>
            <div className="mt-16 text-center">
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