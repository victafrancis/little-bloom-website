import React, { memo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/Button';
import { meta } from '../data/siteMeta';
export default function About() {
  return <>
      <Helmet>
        <title>{meta.about.title}</title>
        <meta name="description" content={meta.about.description} />
      </Helmet>
      <main className="pt-24 md:pt-32">
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-display mb-8">About Me</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
              <div>
                <img src="/img/about.jpg" alt="Photographer portrait" className="rounded-lg w-full" />
              </div>
              <div>
                <h2 className="text-2xl font-display mb-4">My Story</h2>
                <p className="mb-4">
                  Hello! I'm Ayi, and I'm so glad you're here. I know it can
                  feel a little strange to meet a total stranger from the
                  internet, but I promise to be a friend by the end of our time
                  together.
                </p>
                <p className="mb-4">
                  I am a wife and a mom to a beautiful girl, who reminds me
                  every day how quickly these precious moments pass and how
                  important it is to savor and hold on to them.
                </p>
                <p>
                  My passion for photography started over 20 years ago, and my
                  goal has always been to tell the unique stories and highlight
                  the genuine connections of the people I photograph. When I am
                  not behind the lens, you can find me enjoying a warm cup of
                  coffee (or matcha), cooking for my family, watching my
                  favorite K-dramas, and discovering hidden gems while thrift
                  shopping.
                </p>
              </div>
            </div>
            <div className="mb-12">
              <h2 className="text-2xl font-display mb-4">My Approach</h2>
              <p className="mb-4">
                Little Bloom Photography is something I hold close to my heart
                and pour my care into, it's inspired by my firstborn. I believe
                the best photos come from unscripted joy. My sessions are built
                on fun, play, highlighting the beauty of your everyday.
              </p>
              <p>
                People who are close to me say that I am a little "extra", and
                I'll take that as a compliment! It means you can be assured that
                I'll put my whole heart and soul into whatever I do.
              </p>
            </div>
            <div className="mb-12">
              <h2 className="text-2xl font-display mb-4">Your Experience</h2>
              <p className="mb-4">
                As your new photo friend, I want you to feel completely
                comfortable, and you can always ask me any questions you have.
              </p>
              <p>
                I also believe that the moments we capture are yours to keep,
                which is why I'll never limit the number of photos I send to
                you. You'll get full access to your final gallery—all the tiny
                details and beautiful memories are yours forever.
              </p>
            </div>
            <div className="mb-12">
              <h2 className="text-2xl font-display mb-4">Let's Connect</h2>
              <p className="mb-6">
                My goal is to make our time together feel easy, comfortable,
                and, dare I say, fun! I would be honored to work with you.
              </p>
              <Button to="/contact">Book Now</Button>
            </div>
            <div className="border-t border-text/10 pt-8 mt-12">
              <p className="font-display italic">
                "And above all these put on love, which binds everything
                together in perfect harmony." Colossians 3:14
              </p>
              <p className="mt-4">Ayi - Owner, Little Bloom Photography</p>
            </div>
          </div>
        </section>
      </main>
    </>;
}