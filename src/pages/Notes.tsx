import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { meta } from '../data/siteMeta';
import { notes } from '../data/notes';

export default function Notes() {
  return (
    <>
      <SEO
        title={meta.notes.list.title}
        description={meta.notes.list.description}
        keywords={meta.notes.keywords}
        image="/img/hero-desktop.jpg"
      />
      <main className="pt-24 md:pt-32">
        <section className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto mb-12">
            <h1 className="text-center text-3xl md:text-4xl font-light mb-6">
              Notes
            </h1>
            <p className="text-text/70 text-center">
              Tips, inspiration, and guides to help you prepare for your photo shoot.
            </p>
          </div>

          {notes.length === 0 ? (
            <div className="max-w-4xl mx-auto text-center py-12">
              <p className="text-text/70">No notes available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {notes.map(note => (
                <Link
                  key={note.slug}
                  to={`/notes/${note.slug}`}
                  className="group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="bg-mustard/10 rounded-xl p-6">
                    <h3 className="text-xl font-light mb-3 group-hover:text-mustard transition-colors">
                      {note.title}
                    </h3>
                    <p className="text-text/70 text-sm leading-relaxed mb-4">
                      {note.excerpt}
                    </p>
                    <div className="text-mustard text-sm font-medium group-hover:underline">
                      Read more →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
