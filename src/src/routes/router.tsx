import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
// Pages
import Home from '../pages/Home';
import About from '../pages/About';
import FAQ from '../pages/FAQ';
import Services from '../pages/Services';
import Portfolio from '../pages/Portfolio';
import PortfolioCategory from '../pages/PortfolioCategory';
import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';
export function AppRoutes() {
  const location = useLocation();
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/services" element={<Services />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/portfolio/:slug" element={<PortfolioCategory />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
    </Routes>;
}