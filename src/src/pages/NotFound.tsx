import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '../components/Button';
import { meta } from '../data/siteMeta';
export default function NotFound() {
  return <>
      <Helmet>
        <title>{meta.notFound.title}</title>
        <meta name="description" content={meta.notFound.description} />
      </Helmet>
      <main className="pt-24 md:pt-32 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-display my-6">404</h1>
          <h2 className="text-2xl md:text-3xl font-display mb-6">
            Page Not Found
          </h2>
          <p className="text-text/70 mb-8 max-w-md mx-auto">
            The page you're looking for has moved or no longer exists.
          </p>
          <Button to="/">Return Home</Button>
        </div>
        <img
          src="/assets/flowers.png"
          alt="Decorative image"
          className="w-max h-max object-cover mx-auto"
        />
      </main>
    </>;
}