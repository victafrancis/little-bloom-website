import React from 'react';
import SEO from '../components/SEO';
import { Button } from '../components/Button';
import { CTABand } from '../components/CTABand';
import { meta } from '../data/siteMeta';
import { MapPin } from 'lucide-react';
export default function Pricing() {
  return <>
      <SEO
        title={meta.pricing.title}
        description={meta.pricing.description}
        keywords={meta.pricing.keywords}
        image="/img/hero-desktop.jpg"
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
            </div>
            
            <div className="bg-cream p-8 rounded-xl mb-8">
              <h2 className="text-xl font-display mb-4">Both packages below include:</h2>
              <ul className="list-disc list-inside text-text/70">
                <li>Unlimited shots (no cap on the best moments, I am a trigger-happy type of photographer)</li>
                <li>Time-permitting outfit changes.</li>
                <li>Full access to <b>ALL</b> edited, high-resolution photos — you’ll receive every great shot, no limits on the number because you deserve them all!</li>
                <li>Applicable taxes</li>
              </ul>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-cream p-8 rounded-xl">
                <img
                  src="/assets/budding bloom.png"
                  alt="Decorative image"
                  className="max-w-full h-auto object-contain mx-auto"
              />
              </div>
              <div className="bg-cream p-8 rounded-xl">
                <img
                  src="/assets/flourishing bloom.png"
                  alt="Decorative image"
                  className="max-w-full h-auto object-contain mx-auto"
              />
              </div>
            </div>
            
            <div className="p-8 rounded-xl mb-8 border border-solid border-gray-300">
              <h2 className="text-xl font-display mb-4">Optional Add-ons</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">
                    Newborn Session (Bumps & Beginnings clients only)
                  </h3>
                  <p className="text-text/70">
                    +$150 — a 1-hour session dedicated to your little one, to be scheduled once they arrive
                    (50% discount off the regular price.)
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-2">
                    Studio Access
                  </h3>
                  <p className="text-text/70">
                    +$150 — capture your photos in a beautiful, controlled indoor studio environment. (Scheduled based on studio availability. View the studio <a href="https://www.instagram.com/nerastudios/" className="text-mustard" target='_blank'>here</a>).
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
                    Currently servicing <b>Barrie</b> and <b>Innisfil</b> locations. Any other location will incur transportation fees, depending on the location and service.
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
