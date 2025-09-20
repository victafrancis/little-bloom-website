import React, { useState, useEffect } from 'react';
import { Button } from './Button';
type HeroProps = {
  headline: string;
  kicker?: string;
  backgroundImageDesktop: string;
  backgroundImageMobile: string;
  cta?: {
    label: string;
    to: string;
  };
};
export function Hero({
  headline,
  kicker,
  backgroundImageDesktop,
  backgroundImageMobile,
  cta
}: HeroProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const backgroundImage = isDesktop ? backgroundImageDesktop : backgroundImageMobile;

  return <section
    className="relative min-h-[80vh] flex items-center justify-center"
    style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}
  >
      {/* <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold text-white mb-4">
            {headline}
          </h1>
          {kicker && <p className="text-xl md:text-2xl text-white/90 mb-8">{kicker}</p>}
          {cta && <Button to={cta.to} className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20">
              {cta.label}
            </Button>}
        </div>
      </div> */}
    </section>;
}
