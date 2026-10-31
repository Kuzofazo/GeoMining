import React, { useState, useEffect, useCallback, useRef } from 'react';
import Hero from '../components/Hero';
import SEO from '../components/SEO';
import {
  Maximize2,
  X,
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { GalleryImage } from '../types';

const programImages: GalleryImage[] = Array.from({ length: 29 }, (_, i) => ({
  id: `program-${i + 1}`,
  url: `/images/Gallery/Program/GMECIGEO/${i + 1}.jpeg`,
  category: 'Program',
  title: 'National Exhibition on Advanced Mineral Discovery Technology',
  description: 'National Exhibition on Advanced Mineral Discovery Technology',
}));

const dailyWorkingImages: GalleryImage[] = Array.from(
  { length: 9 },
  (_, i) => ({
    id: `daily-working-${i + 1}`,
    url: `/images/Gallery/Daily working/${i + 1}.jpeg`,
    category: 'Daily Working',
    title: 'Daily Working - On-Site Operations',
    description:
      'Daily Working - On-Site Field Operations and Technical Services',
  })
);

const otherGalleryImages: GalleryImage[] = [
  {
    id: '1',
    url: '/images/Mining.webp',
    category: 'Operations',
    title: 'Open Pit Operations',
    description:
      'Heavy machinery active at a primary extraction site in Liberia.',
  },
  {
    id: '2',
    url: '/images/Exploration & Geological Services.webp',
    category: 'Exploration',
    title: 'Geological Core Sampling',
    description:
      'Exploration team conducting core analysis in the Nimba region.',
  },
  {
    id: '3',
    url: '/images/GIS & Environmental Services.webp',
    category: 'Environment',
    title: 'Water Management System',
    description:
      'Advanced GIS mapping and environmental monitoring systems ensuring zero discharge impact.',
  },
  {
    id: '4',
    url: '/images/Resource.webp',
    category: 'Exploration',
    title: 'Resource Definition',
    description:
      'Accurate resource modeling and estimation for mining projects.',
  },
  {
    id: '5',
    url: '/images/Mining Services.webp',
    category: 'Operations',
    title: 'Processing Facility',
    description:
      'State-of-the-art mineral processing unit during shift change.',
  },
  {
    id: '6',
    url: '/images/Sustainability.webp',
    category: 'Environment',
    title: 'Land Rehabilitation',
    description:
      'Reforestation of previously mined sectors with indigenous species.',
  },
  {
    id: '7',
    url: '/images/Geotechnical Engineering Services.webp',
    category: 'Exploration',
    title: 'Geotechnical Analysis',
    description:
      'Site stability assessments and soil analysis for infrastructure planning.',
  },
  {
    id: '8',
    url: '/images/Health and Safety.webp',
    category: 'Operations',
    title: 'HSE Excellence',
    description:
      'Prioritizing occupational health and safety across all operational sites.',
  },
  {
    id: '9',
    url: '/images/Metallurgical Services.webp',
    category: 'Operations',
    title: 'Laboratory Analysis',
    description: 'On-site metallurgical testing and grade verification.',
  },
];

interface GalleryImageItemProps {
  image: GalleryImage;
  onClick: (image: GalleryImage) => void;
}

const GalleryImageItem: React.FC<GalleryImageItemProps> = ({
  image,
  onClick,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className="group relative h-80 overflow-hidden bg-slate-100 rounded-sm cursor-pointer shadow-sm border border-slate-100"
      onClick={() => onClick(image)}
    >
      {/* Loading Spinner */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
          <Loader2 className="w-8 h-8 text-slate-300 animate-spin" />
        </div>
      )}

      <img
        src={image.url}
        alt={image.title}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-700 ease-in-out md:grayscale md:group-hover:grayscale-0 group-hover:scale-105 ${
          isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-md'
        }`}
      />

      {/* Overlay Content - enhanced hover interactions */}
      {isLoaded && (
        <>
          {/* Fading Gradient Overlay - desktop hover & mobile subtle scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent md:bg-gradient-to-t md:from-slate-950 md:via-slate-900/20 md:to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-80 transition-opacity duration-500"></div>

          {/* Content with synced fade and slide */}
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 opacity-100 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-500 ease-out">
            <span className="inline-block px-2 py-1 mb-1.5 bg-amber-500 text-slate-900 text-[10px] font-bold uppercase tracking-widest shadow-md rounded-sm">
              {image.category}
            </span>
            <h3 className="text-white font-bold text-sm sm:text-base md:text-lg mb-0.5 drop-shadow-md line-clamp-1">
              {image.title}
            </h3>
            <p className="text-slate-300 text-xs transition-opacity duration-500 line-clamp-1 sm:line-clamp-2 leading-relaxed">
              {image.description}
            </p>
          </div>

          {/* Quick Action Button Reveal */}
          <div className="absolute top-4 right-4 opacity-0 translate-y-[-10px] md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-500 delay-100">
            <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 hover:bg-amber-500 hover:text-slate-900 transition-colors">
              <Maximize2 size={18} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const Gallery: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isModalImageLoaded, setIsModalImageLoaded] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const categories = [
    'All',
    'Program',
    'Daily Working',
    'Operations',
    'Exploration',
    'Community',
    'Environment',
  ];

  const filteredImages =
    filter === 'All'
      ? [
          ...programImages.slice(0, 3),
          ...dailyWorkingImages.slice(0, 3),
          ...otherGalleryImages,
        ]
      : filter === 'Program'
        ? programImages
        : filter === 'Daily Working'
          ? dailyWorkingImages
          : otherGalleryImages.filter((img) => img.category === filter);

  const currentIndex = selectedImage
    ? filteredImages.findIndex((img) => img.id === selectedImage.id)
    : -1;

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setIsModalImageLoaded(false);
      setSelectedImage(filteredImages[currentIndex - 1]);
    } else if (filteredImages.length > 0) {
      setIsModalImageLoaded(false);
      setSelectedImage(filteredImages[filteredImages.length - 1]);
    }
  }, [currentIndex, filteredImages]);

  const handleNext = useCallback(() => {
    if (currentIndex >= 0 && currentIndex < filteredImages.length - 1) {
      setIsModalImageLoaded(false);
      setSelectedImage(filteredImages[currentIndex + 1]);
    } else if (filteredImages.length > 0) {
      setIsModalImageLoaded(false);
      setSelectedImage(filteredImages[0]);
    }
  }, [currentIndex, filteredImages]);

  // Handle body scroll lock & keyboard navigation
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setSelectedImage(null);
        } else if (e.key === 'ArrowLeft') {
          handlePrev();
        } else if (e.key === 'ArrowRight') {
          handleNext();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'auto';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [selectedImage, handlePrev, handleNext]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartX.current = null;
  };

  return (
    <div className="bg-white">
      <SEO
        title="Media Gallery | GeoMining & Environmental Consultancy"
        description="Explore our visual portfolio of mining operations, geological surveys, and environmental projects across Liberia and West Africa."
        keywords="mining gallery, geological survey photos, West Africa mining operations, environmental project visuals"
      />
      <Hero
        title="Visual Archive"
        category="Media Gallery"
        subtitle="Explore our operational footprint, community impact, and commitment to environmental excellence."
        showButtons={false}
        isFullHeight={false}
      />

      <section className="py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-3 sm:gap-6 border-b border-slate-100 pb-6 sm:pb-8">
            <div className="flex items-center gap-2 text-slate-400 shrink-0">
              <Filter size={16} />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Filter By:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-2 rounded-sm text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all ${
                    filter === cat
                      ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20'
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <GalleryImageItem
                key={image.id}
                image={image}
                onClick={(img) => {
                  setIsModalImageLoaded(false);
                  setSelectedImage(img);
                }}
              />
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="py-20 text-center text-slate-400 italic">
              No images found in this category.
            </div>
          )}
        </div>
      </section>

      {/* True Fullscreen Immersive Lightbox Modal */}
      {selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.title}
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-xl flex flex-col justify-between overflow-hidden select-none animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setSelectedImage(null)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Floating Top Bar Overlay */}
          <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between p-4 sm:p-6 bg-gradient-to-b from-black/85 via-black/40 to-transparent pointer-events-none">
            <div className="flex items-center gap-2 pointer-events-auto">
              <span className="px-3 py-1 bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider rounded shadow-md">
                {selectedImage.category}
              </span>
              {currentIndex >= 0 && (
                <span className="text-white/90 text-xs font-semibold tracking-widest bg-white/15 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-sm">
                  {currentIndex + 1} / {filteredImages.length}
                </span>
              )}
            </div>

            <button
              onClick={() => setSelectedImage(null)}
              aria-label="Close fullscreen view"
              className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 active:scale-90 text-white transition-all flex items-center justify-center border border-white/25 backdrop-blur-md shadow-xl cursor-pointer pointer-events-auto"
            >
              <X size={22} />
            </button>
          </div>

          {/* Fullscreen Image Stage */}
          <div
            className="relative flex-1 w-full h-full flex items-center justify-center p-2 sm:p-6 md:p-8 overflow-hidden"
            onClick={(e) => {
              // Clicking outside the direct image box closes or lets users toggle
              if (e.target === e.currentTarget) {
                setSelectedImage(null);
              }
            }}
          >
            {/* Desktop Previous Button */}
            {filteredImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Previous image"
                className="hidden md:flex absolute left-6 z-20 w-12 h-12 rounded-full bg-white/15 hover:bg-amber-500 hover:text-slate-950 active:scale-90 text-white transition-all items-center justify-center border border-white/20 backdrop-blur-md shadow-2xl"
              >
                <ChevronLeft size={28} />
              </button>
            )}

            {/* Spinner */}
            {!isModalImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
              </div>
            )}

            {/* The Main Fullscreen Image */}
            <img
              key={selectedImage.id}
              src={selectedImage.url}
              alt={selectedImage.title}
              loading="eager"
              decoding="async"
              onLoad={() => setIsModalImageLoaded(true)}
              onClick={(e) => e.stopPropagation()}
              className={`w-full h-full max-h-[82dvh] sm:max-h-[84vh] md:max-h-[86vh] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-300 ${
                isModalImageLoaded
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-95'
              }`}
            />

            {/* Desktop Next Button */}
            {filteredImages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Next image"
                className="hidden md:flex absolute right-6 z-20 w-12 h-12 rounded-full bg-white/15 hover:bg-amber-500 hover:text-slate-950 active:scale-90 text-white transition-all items-center justify-center border border-white/20 backdrop-blur-md shadow-2xl"
              >
                <ChevronRight size={28} />
              </button>
            )}
          </div>

          {/* Floating Bottom Info Bar Overlay */}
          <div className="absolute bottom-0 inset-x-0 z-30 p-4 sm:p-6 pb-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent pointer-events-none">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-3 pointer-events-auto">
              <div className="flex-1 min-w-0 pr-2">
                <h2 className="text-white font-bold text-base sm:text-xl drop-shadow-md leading-tight mb-1">
                  {selectedImage.title}
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm drop-shadow-sm leading-relaxed line-clamp-2">
                  {selectedImage.description}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-1 border-t border-white/10 sm:border-t-0 sm:pt-0 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-slate-950 font-black text-[9px] shadow-sm">
                    GEO
                  </div>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Verified Site Capture
                  </span>
                </div>

                {filteredImages.length > 1 && (
                  <div className="flex items-center gap-1.5 md:hidden">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrev();
                      }}
                      aria-label="Previous image"
                      className="p-2 bg-white/15 hover:bg-white/30 active:bg-amber-500 active:text-slate-950 rounded-full text-white transition-colors border border-white/20 backdrop-blur-md"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                      }}
                      aria-label="Next image"
                      className="p-2 bg-white/15 hover:bg-white/30 active:bg-amber-500 active:text-slate-950 rounded-full text-white transition-colors border border-white/20 backdrop-blur-md"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
