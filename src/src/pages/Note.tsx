import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
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
      <SEO
        title={`${note.title} | Notes | Little Bloom Photography`}
        description={note.excerpt}
        keywords="photography tips Ontario, family photography tips, maternity photography guide, newborn photography advice"
        image="/img/hero-desktop.jpg"
        type="article"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: note.title,
            description: note.excerpt,
            mainEntityOfPage: `https://www.littlebloomphotography.com/notes/${note.slug}`,
            image: 'https://www.littlebloomphotography.com/img/hero-desktop.jpg',
            author: { '@type': 'Organization', name: 'Little Bloom Photography' },
            publisher: { '@type': 'Organization', name: 'Little Bloom Photography', logo: { '@type': 'ImageObject', url: 'https://www.littlebloomphotography.com/assets/logo.png' } }
          },
          {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type':'ListItem', position:1, name:'Home', item:'https://www.littlebloomphotography.com/' },
              { '@type':'ListItem', position:2, name:'Notes', item:'https://www.littlebloomphotography.com/notes' },
              { '@type':'ListItem', position:3, name: note.title, item: `https://www.littlebloomphotography.com/notes/${note.slug}` }
            ]
          }
        ]}
      />

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
        <section>
          <article className="max-w-4xl mx-auto">
            {/* Render HTML content with Tailwind classes */}
            <div
              dangerouslySetInnerHTML={createMarkup(note.content)}
            />

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

            {/* Call to Action */}
            <div className="bg-sage/10 pt-8 pb-4 border-t border-gray-200">
              <div className="text-center">
                <p className="text-text/70 mb-6">
                  Ready to capture your beautiful moments?<br />
                  Let's create something special together.
                </p>
                <Button to="/contact">Book a Session</Button>
              </div>
            </div>
          </article>
        </section>
      </main>
    </>
  );
}
