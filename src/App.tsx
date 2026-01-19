import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AppRoutes } from './routes/router';
export function App() {
  return <HelmetProvider>
      <BrowserRouter>
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