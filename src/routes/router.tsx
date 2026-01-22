import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
// Lazy-loaded Pages
const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About'));
const FAQ = lazy(() => import('../pages/FAQ'));
const Pricing = lazy(() => import('../pages/Pricing'));
const Gallery = lazy(() => import('../pages/Gallery'));
const GalleryCategory = lazy(() => import('../pages/GalleryCategory'));
const Notes = lazy(() => import('../pages/Notes'));
const Note = lazy(() => import('../pages/Note'));
const Contact = lazy(() => import('../pages/Contact'));
const NotFound = lazy(() => import('../pages/NotFound'));

const pageVariants = {
  initial: { opacity: 0 },
  in: { opacity: 1 },
  out: { opacity: 0 }
};

const pageTransition = {
  duration: 0.5
};

export function AppRoutes() {
  const location = useLocation();

  // Scroll to top immediately on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage mx-auto mb-4"></div>
          <p className="text-text/70">Loading...</p>
        </div>
      </div>
    }>
      <AnimatePresence
        mode="wait"
        onExitComplete={() => window.scrollTo(0, 0)}
      >
        <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Home />
          </motion.div>
        } />
        <Route path="/about" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <About />
          </motion.div>
        } />
        {/* <Route path="/faq" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <FAQ />
          </motion.div>
        } /> */}
        <Route path="/pricing" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Pricing />
          </motion.div>
        } />
        <Route path="/gallery" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Gallery />
          </motion.div>
        } />
        <Route path="/gallery/:slug" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <GalleryCategory />
          </motion.div>
        } />
        <Route path="/notes" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Notes />
          </motion.div>
        } />
        <Route path="/notes/:slug" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Note />
          </motion.div>
        } />
        <Route path="/contact" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <Contact />
          </motion.div>
        } />
        <Route path="*" element={
          <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
          >
            <NotFound />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
    </Suspense>
  );
}
