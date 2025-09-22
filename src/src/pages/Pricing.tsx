import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/Button';
import { CTABand } from '../components/CTABand';
import { meta } from '../data/siteMeta';
export default function Pricing() {
  return <>
      <Helmet>
        <title>{meta.pricing.title}</title>
        <meta name="description" content={meta.pricing.description} />
      </Helmet>
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
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-cream p-8 rounded-xl">
                <img
                  src="/assets/budding bloom.png"
                  alt="Decorative image"
                  className="w-max h-max object-contain mx-auto"
              />
              </div>
              <div className="bg-cream p-8 rounded-xl">
                <img
                  src="/assets/flourishing bloom.png"
                  alt="Decorative image"
                  className="w-max h-max object-contain mx-auto"
              />
              </div>
            </div>
            <div className="bg-cream p-8 rounded-xl mb-8">
              <h2 className="text-xl font-display mb-4">Both packages include:</h2>
              <ul className="list-disc list-inside text-text/70">
                <li>Unlimited shots (no cap on the best moments, I am a trigger-happy type of photographer)</li>
                <li>Time-permitting outfit changes.</li>
                <li>Full access to <b>ALL</b> edited, high-resolution photos — you’ll receive every great shot, no limits on the number because you deserve them all!</li>
              </ul>
            </div>
            
            <div className="p-8 rounded-xl mb-8 border border-solid border-gray-300">
              <h2 className="text-xl font-display mb-4">Optional Add-ons</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">
                    Newborn Session (Bumps & Beginnings clients only)
                  </h3>
                  <p className="text-text/70">
                    +$100 — a 45-minute session dedicated to your little one, to be scheduled once they arrive.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">
                    Studio Access
                  </h3>
                  <p className="text-text/70">
                    +$150 — capture your photos in a beautiful, controlled indoor studio environment. (Scheduled based on studio availability. View the studio here: <a href="https://www.instagram.com/nerastudios/" className="underline" target='_blank'>Nera Studios</a>)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-cream p-8 rounded-xl mb-8">
              <h2 className="text-xl font-display mb-4">Notes</h2>
              <ul className="list-disc list-inside text-text/70">
                <li>All prices include tax</li>
                <li>Travel outside Barrie and Innisfil areas may include additional transportation fees</li>
              </ul>
            </div>
          </div>
        </section>

        <CTABand headline="Ready to book your session?" subheading="Check availability and secure your date." buttonText="Contact Me" buttonLink="/contact" />
        <img
          src="/assets/flowers.png"
          alt="Decorative image"
          className="w-max h-max object-cover mx-auto"
        />
      </main>
    </>;
}