import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { meta } from '../data/siteMeta';
import { galleries } from '../data/galleries';
export default function Portfolio() {
  return <>
      <Helmet>
        <title>{meta.portfolio.title}</title>
        <meta name="description" content={meta.portfolio.description} />
      </Helmet>
      <main className="pt-24 md:pt-32">
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-display mb-6">
              Portfolio
            </h1>
            <p className="text-text/70">
              Explore our galleries by category. Each collection showcases our
              approach to different types of sessions.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {galleries.map(gallery => <Link key={gallery.slug} to={`/portfolio/${gallery.slug}`} className="group">
                <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
                  <img src={gallery.cover} alt={gallery.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <h3 className="text-center text-base md:text-xl font-light">{gallery.title}</h3>
              </Link>)}
          </div>
        </section>
      </main>
    </>;
}