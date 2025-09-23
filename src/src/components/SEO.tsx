import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { site } from '../data/siteMeta';

const BASE = 'https://www.littlebloomphotography.com';

export type SEOProps = {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  type?: 'website' | 'article';
  robots?: string;
  jsonLd?: object | object[];
};

export function SEO({
  title,
  description,
  keywords,
  image,
  type = 'website',
  robots,
  jsonLd
}: SEOProps) {
  const { pathname } = useLocation();
  const canonical = `${BASE}${pathname === '/' ? '/' : pathname}`;
  const imageUrl = image
    ? image.startsWith('http')
      ? image
      : `${BASE}${image}`
    : `${BASE}/img/social-default.jpg`;

  const jsonLdArray = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {robots && <meta name="robots" content={robots} />}

      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:locale" content="en_CA" />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={imageUrl} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* JSON-LD */}
      {jsonLdArray.map((node, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(node)}</script>
      ))}
    </Helmet>
  );
}

export default SEO;
