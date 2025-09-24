import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from '@vercel/analytics/react';
import { Header } from './src/components/Header';
import { Footer } from './src/components/Footer';
import { AppRoutes } from './src/routes/router';
export function App() {
  return <HelmetProvider>
      <BrowserRouter>
        <Analytics />
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="flex-grow">
            <AppRoutes />
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </HelmetProvider>;
}
