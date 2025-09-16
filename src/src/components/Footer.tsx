import React from 'react';
import { Link } from 'react-router-dom';
import { InstagramIcon, FacebookIcon, MailIcon } from 'lucide-react';
import { site } from '../data/siteMeta';
export function Footer() {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-cream py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-4">Let's Connect!</h3>
            <div className="flex space-x-4 justify-center">
              <a href={site.socials.instagram} target="_blank" rel="noopener noreferrer" className="text-text hover:text-sage transition-colors" aria-label="Instagram">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href={site.socials.facebook} target="_blank" rel="noopener noreferrer" className="text-text hover:text-sage transition-colors" aria-label="Facebook">
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a href={`mailto:${site.socials.email}`} className="text-text hover:text-sage transition-colors" aria-label="Email">
                <MailIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-text/10 mt-12 pt-6 flex flex-col justify-center items-center text-text/60">
          <Link to="/" className="text-xl md:text-2xl font-display font-semibold">
            <img src="/assets/logo.png" alt="Little Bloom Photography" className="h-32 w-auto" />
          </Link>
          <p className="mt-4 text-center text-sm">©{currentYear}</p>
        </div>
      </div>
    </footer>;
}
