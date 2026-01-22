import React, { memo } from 'react';
import SEO from '../components/SEO';
import { Button } from '../components/Button';
import { meta } from '../data/siteMeta';
export default function About() {
  return <>
      <SEO
        title={meta.about.title}
        description={meta.about.description}
        keywords={meta.about.keywords}
        image="/img/about.jpg"
      />
      <main className="pt-24 md:pt-32">
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-center text-3xl md:text-4xl font-light mb-8">About Me</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-4">
              <div>
                <img src="/img/about.jpg" alt="Photographer portrait" className="rounded-lg w-full aspect-[3/4] object-cover" />
              </div>
              <div>
                <div className="py-6 px-4 rounded-lg">
                  <h2 className="text-2xl font-light mb-4">Hello! I'm Ayi, and I'm so glad you're here!</h2>
                  <p>
                    I picked up my first camera over 20 years ago, not knowing it would become such a big part of my creative side. Through the years, I’ve captured many stories, but the one that changed everything was my own: becoming a mom.
                  </p>
                </div>
                <div className="bg-mustard/10 py-6 px-4 rounded-lg">
                  <h2 className="text-2xl font-light mb-4">The Heart Behind “Little Bloom”</h2>
                  <p className="mb-4">
                    When my firstborn arrived, I began to see the world through a new lens, one filled with wonder, gratitude, and an awareness of just how quickly life moves. Every smile, every milestone, every tiny moment feels like a precious bloom.
                  </p>
                  <p>
                    That’s how <b>Little Bloom Photography</b> came to life. It’s more than a name, it’s a promise to treat your story with the same care and love I give to my own.
                  </p>
                </div>
              </div>
            </div>
            <div className="py-6 px-4 rounded-lg">
              <h2 className="text-2xl font-light mb-4">A Little Bit More About Me</h2>
              <p className="mb-4">
                When I’m not behind the camera, you’ll usually find me having a warm cup of coffee (or matcha latte), cooking, spending time with my family, or getting lost in a good K-drama. I also love exploring hidden gems at thrift / vintage shops.
              </p>
              <p>
                People who know me say I’m a little “extra”, and honestly, I take that as a compliment! :) It means you can trust that I’ll pour my whole heart and soul into your session.
              </p>
            </div>
            <div className="bg-mustard/10 py-6 px-4 rounded-lg">
              <h2 className="text-2xl font-light mb-4">My Approach</h2>
              <p>
                I believe the best photos are never forced. Forget stiff poses and awkward smiles, my sessions are about having fun, letting go, and allowing your family’s story to shine through naturally.
              </p>
            </div>
            <div className="py-6 px-4 rounded-lg">
              <h2 className="text-2xl font-light mb-4">What You Can Expect</h2>
              <p className="mb-4">
                Working with me feels less like a photoshoot and more like spending time with a friend. I’ll guide you when you need it, but I’ll also step back and let the natural magic happen. My goal is to make the experience stress-free from start to finish.
              </p>
              <p>
                And when it’s all done? You’ll receive a <b>full</b> gallery of edited, high-resolution photos! No limits and no extra charges for more photos. Because every single memory deserves to be yours.
              </p>
            </div>
            <div className="text-center mt-8">
              <Button className="bg-mustard/10" to="/contact">Book Your Session Today</Button>
            </div>
          </div>
        </section>
      </main>
    </>;
}
