import React from 'react';
import { Button } from './Button';
type CTABandProps = {
  headline: string;
  subheading?: string;
  buttonText: string;
  buttonLink: string;
  bgColor?: string;
};
export function CTABand({
  headline,
  subheading,
  buttonText,
  buttonLink,
  bgColor = 'bg-sage/10'
}: CTABandProps) {
  return <section className={`py-16 ${bgColor}`}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-display font-semibold mb-4">
          {headline}
        </h2>
        {subheading && <p className="text-text/70 max-w-2xl mx-auto mb-8">{subheading}</p>}
        <Button to={buttonLink}>{buttonText}</Button>
      </div>
    </section>;
}