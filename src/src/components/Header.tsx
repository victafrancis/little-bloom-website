import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MenuIcon, XIcon } from 'lucide-react';
import { site } from '../data/siteMeta';
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = '';
  };
  useEffect(() => {
    closeMenu();
  }, [location]);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const navLinks = [{
    name: 'Home',
    path: '/'
  }, {
    name: 'About',
    path: '/about'
  }, {
    name: 'Portfolio',
    path: '/portfolio'
  }, {
    name: 'Services',
    path: '/services'
  }, {
    name: 'FAQ',
    path: '/faq'
  }, {
    name: 'Contact',
    path: '/contact'
  }];
  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="text-xl md:text-2xl font-display font-semibold z-50">
          <img src="/assets/logo-nav.png" alt="Little Bloom Photography" className="h-16 w-auto" />
        </Link>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          {navLinks.map(link => <Link key={link.path} to={link.path} className={`transition-colors hover:text-sage ${location.pathname === link.path ? 'text-sage font-medium' : ''}`}>
              {link.name}
            </Link>)}
        </nav>
        {/* Mobile Menu Button */}
        <button className="md:hidden z-50 focus:outline-none" onClick={toggleMenu} aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}>
          {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
        {/* Mobile Menu */}
        <div className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="container mx-auto px-4 pt-20 pb-8">
            <nav className="flex flex-col space-y-6">
              {navLinks.map(link => <Link key={link.path} to={link.path} className={`text-xl transition-colors hover:text-sage ${location.pathname === link.path ? 'text-sage font-medium' : ''}`} onClick={closeMenu}>
                  {link.name}
                </Link>)}
            </nav>
          </div>
        </div>
      </div>
    </header>;
}