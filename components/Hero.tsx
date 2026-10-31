import React, { useState, useEffect } from 'react';
// Images will be served from /public/images/

interface HeroProps {
  title?: React.ReactNode;
  subtitle?: string;
  category?: string;
  showButtons?: boolean;
  isFullHeight?: boolean;
  onPartnerClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  category = 'About The Consultancy',
  showButtons = true,
  isFullHeight = true,
  onPartnerClick,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

  const heroImages = [
    { src: '/images/hero-background.webp', alt: 'GEO Mining Operations' },
    { src: '/images/stonecrest-mining-hero.webp', alt: 'Mining Production' },
    {
      src: '/images/stonecrest-resource-hero.webp',
      alt: 'Resource Development',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 6000); // Rotate every 6 seconds

    return () => clearInterval(timer);
  }, [heroImages.length]);

  const handleImageLoad = (index: number) => {
    setImagesLoaded((prev) => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  const heroHeight = isFullHeight
    ? 'min-h-dvh pt-20 pb-12'
    : 'min-h-[60dvh] sm:min-h-[70dvh] pt-24 pb-12';

  return (
    <div
      className={`relative w-full ${heroHeight} bg-slate-900 overflow-hidden flex flex-col`}
      id="about"
    >
      {/* Background Carousel */}
      {heroImages.map((image, index) => (
        <img
          key={index}
          src={image.src}
          alt={image.alt}
          loading={index === 0 ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => handleImageLoad(index)}
          className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-[3000ms] ease-in-out ${
            index === currentImageIndex
              ? 'opacity-80 scale-100 z-0 animate-ken-burns'
              : 'opacity-0 scale-110 z-[-1]'
          } ${imagesLoaded[index] ? 'blur-0' : 'blur-xl'}`}
        />
      ))}

      {/* Fallback pattern if images fail */}
      {!imagesLoaded.some((loaded) => loaded) && (
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Sophisticated Corporate Overlay */}
      {/* This gradient is designed to be darker on the left for text readability and transparent on the right to show the trucks */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent z-10" />
      <div className="absolute inset-0 bg-black/10 z-10" />

      <div
        className={`relative z-20 max-w-[110rem] mx-auto px-4 md:px-6 lg:px-6 w-full ${isFullHeight ? 'flex flex-col justify-center pt-8 pb-8 sm:pt-16 sm:pb-12' : 'pt-8 pb-6 sm:pt-14 sm:pb-10'}`}
      >
        <div className="max-w-6xl animate-fade-in-up">
          <div className="inline-flex max-w-full items-center gap-2 sm:gap-3 py-1.5 sm:py-2 px-3 sm:px-4 mb-3 sm:mb-6 bg-[#2d5a27] text-white text-[9px] xs:text-[10px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-[0.25em] rounded-sm shadow-2xl">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-400 rounded-full animate-pulse shrink-0"></span>
            <span className="break-words leading-relaxed">{category}</span>
          </div>

          <h1
            className={`text-white text-[1.65rem] xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.12] sm:leading-[1.05] ${isFullHeight ? 'mb-6 sm:mb-8 md:mb-12' : 'mb-5 sm:mb-6 md:mb-8'} tracking-tight break-words`}
          >
            {title || (
              <>
                Advancing Responsible <br className="hidden sm:block" />
                <strong className="font-black text-amber-400">
                  Mineral Resource Development
                </strong>
              </>
            )}
          </h1>

          <div className="max-w-3xl border-l-4 border-amber-500 pl-3.5 sm:pl-8 pr-4 sm:pr-10 py-3.5 sm:py-6 bg-black/30 backdrop-blur-md rounded-r-xl">
            <p
              className={`text-sm sm:text-base md:text-lg text-slate-100 font-medium leading-relaxed ${isFullHeight ? 'mb-4 sm:mb-6' : 'mb-0'} text-left`}
            >
              {subtitle ||
                'A specialized consultancy bridging geology, mining, and environmental science. We guide resource and infrastructure projects from discovery through closure.'}
            </p>
            {!subtitle && (
              <p className="text-amber-400 font-bold uppercase tracking-widest text-xs sm:text-sm">
                "Engineering a Sustainable Future"
              </p>
            )}
          </div>

          {showButtons && (
            <div className="mt-6 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-5 w-full sm:w-auto">
              <button
                onClick={(e) => {
                  if (onPartnerClick) {
                    e.preventDefault();
                    onPartnerClick();
                  } else {
                    window.location.hash = 'contact';
                  }
                }}
                className="w-full sm:w-auto text-center bg-amber-500 text-slate-900 px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 font-black text-xs sm:text-sm tracking-widest hover:bg-white transition-all transform hover:-translate-y-1 shadow-[0_20px_50px_rgba(245,158,11,0.3)]"
              >
                Partner With Us
              </button>
              <a
                href="#overview"
                className="w-full sm:w-auto text-center bg-white/10 backdrop-blur-md text-white border border-white/30 px-6 sm:px-8 md:px-10 py-3.5 sm:py-4 font-black text-xs sm:text-sm tracking-widest hover:bg-white hover:text-slate-900 transition-all transform hover:-translate-y-1"
              >
                About Us
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Decorative Accent */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-transparent to-transparent z-30" />

      {/* Bottom Scroll Indicator */}
      <div className="absolute bottom-10 left-8 hidden md:block animate-bounce opacity-30 z-30">
        <div className="w-px h-16 bg-white"></div>
      </div>
    </div>
  );
};

export default Hero;
