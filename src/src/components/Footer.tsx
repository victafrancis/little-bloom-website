import React from 'react';
import { Link } from 'react-router-dom';
import { InstagramIcon, FacebookIcon, MailIcon } from 'lucide-react';
import { site } from '../data/siteMeta';
export function Footer() {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-cream py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">{site.name}</h3>
            <p className="text-text/70 mb-4">
              Capturing beautiful moments for families and children.
            </p>
            <div className="flex space-x-4">
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
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-text/70 hover:text-sage transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-text/70 hover:text-sage transition-colors">
                About
              </Link>
              <Link to="/portfolio" className="text-text/70 hover:text-sage transition-colors">
                Portfolio
              </Link>
              <Link to="/services" className="text-text/70 hover:text-sage transition-colors">
                Services
              </Link>
              <Link to="/faq" className="text-text/70 hover:text-sage transition-colors">
                FAQ
              </Link>
              <Link to="/contact" className="text-text/70 hover:text-sage transition-colors">
                Contact
              </Link>
            </nav>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <address className="not-italic text-text/70">
              <p>123 Photography Lane</p>
              <p>San Francisco, CA 94110</p>
              <p className="mt-2">
                <a href={`mailto:${site.socials.email}`} className="hover:text-sage transition-colors">
                  {site.socials.email}
                </a>
              </p>
              <p className="mt-2">
                <a href="tel:+14155551234" className="hover:text-sage transition-colors">
                  (415) 555-1234
                </a>
              </p>
            </address>
          </div>
        </div>
        <div className="border-t border-text/10 mt-12 pt-6 flex flex-col justify-center items-center text-text/60">
          <Link to="/" className="text-xl md:text-2xl font-display font-semibold z-50">
            <img src="/assets/logo.png" alt="Little Bloom Photography" className="h-32 w-auto" />
          </Link>
          <p className="mt-4 text-center">{currentYear}</p>
        </div>
      </div>
    </footer>;
}
