import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { InstagramFeed } from './components/InstagramFeed';
import { ExternalLinkGuard } from './components/ExternalLinkGuard';
import { AppRoutes } from './routes/router';

// Loaded on demand so visitors never download the album manager. Unlike the public
// pages, a chunk missing after a deploy only affects the manager, and the reload
// guard in index.tsx recovers from it.
const Admin = lazy(() => import('./pages/Admin'));

const PublicSite = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <div className="flex-grow">
      <AppRoutes />
    </div>
    <InstagramFeed />
    <Footer />
    <ExternalLinkGuard />
  </div>
);

export function App() {
  return <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<Suspense fallback={null}><Admin /></Suspense>} />
          <Route path="*" element={<PublicSite />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>;
}
