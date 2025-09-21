import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeftIcon } from 'lucide-react';
import { getNoteBySlug } from '../data/notes';
import { Button } from '../components/Button';

export default function Note() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const note = getNoteBySlug(slug || '');

  if (!note) {
    navigate('/notes');
    return null;
  }

  // Create a safe HTML renderer that preserves Tailwind classes
  const createMarkup = (htmlContent: string) => {
    return { __html: htmlContent };
  };

  return (
    <>
      <Helmet>
        <title>{note.title} | Notes | Little Bloom Photography</title>
        <meta name="description" content={note.excerpt} />
      </Helmet>

      <main className="pt-24 md:pt-32">
        {/* Back Navigation */}
        <div className="container mx-auto px-4 py-4">
          <Link
            to="/notes"
            className="inline-flex items-center text-mustard hover:text-mustard/80 transition-colors font-light"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Notes
          </Link>
        </div>

        {/* Note Content */}
        <section className="container mx-auto px-4 py-8">
          <article className="max-w-4xl mx-auto">
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl font-light mb-6">
                {note.title}
              </h1>
              <p className="text-text/70 text-lg leading-relaxed">
                {note.excerpt}
              </p>
            </header>

            {/* Render HTML content with Tailwind classes */}
            <div
              className="note-content"
              dangerouslySetInnerHTML={createMarkup(note.content)}
            />

            {/* Call to Action */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="text-center">
                <p className="text-text/70 mb-6">
                  Ready to capture your beautiful moments? Let's create something special together.
                </p>
                <Button to="/contact">Book a Session</Button>
              </div>
            </div>
          </article>
        </section>

        <img
          src="/assets/flowers.png"
          alt="Decorative image"
          className="w-max h-max object-cover mx-auto mt-8"
        />
      </main>
    </>
  );
}
