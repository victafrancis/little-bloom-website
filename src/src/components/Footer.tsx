import React from 'react';
import { Link } from 'react-router-dom';
import { InstagramIcon, FacebookIcon, MailIcon } from 'lucide-react';
import { site } from '../data/siteMeta';
export function Footer() {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-cream py-8">
      <div className="container mx-auto px-4">
        <p className="border-b border-text/20 pb-6 font-light italic text-center text-xs md:text-base">
          "And above all these put on love, which binds everything
          together in perfect harmony."<br />
          - Colossians 3:14
        </p>
        <div className="mt-8 flex flex-col justify-center items-center text-text/60">
          <div className="flex space-x-4 justify-center mb-4">
            <a href={site.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-text/70 hover:text-sage transition-colors" aria-label="Instagram">
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a href={site.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-text/70 hover:text-sage transition-colors" aria-label="Facebook">
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a href={`mailto:${site.socials.email}`} className="text-text/70 hover:text-sage transition-colors" aria-label="Email">
              <MailIcon className="h-5 w-5" />
            </a>
          </div>
          <Link to="/" className="text-xl md:text-2xl font-display font-semibold">
            <img src="/assets/logo.png" alt="Little Bloom Photography" className="h-32 w-auto" />
          </Link>
          <p className="mt-4 text-center text-sm">©{currentYear}</p>
        </div>
      </div>
    </footer>;
}
