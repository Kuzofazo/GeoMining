import React from 'react';

interface PageHeaderProps {
  title: React.ReactNode;
  subtitle?: string;
  category?: string;
  image?: string;
}

// Images will be served from /public/images/

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  category,
  image,
}) => {
  return (
    <div className="relative w-full h-[400px] bg-slate-900 overflow-hidden">
      {/* Background Image with Overlay */}
      <img
        loading="lazy"
        decoding="async"
        src={image || '/images/hero-background.webp'}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-8 h-full flex flex-col justify-center pt-20">
        <div className="max-w-3xl animate-fade-in-up">
          {category && (
            <span className="inline-block py-1 px-3 mb-6 bg-amber-500 text-slate-900 text-xs font-bold uppercase tracking-widest rounded-sm">
              {category}
            </span>
          )}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-6 uppercase tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-slate-200 font-normal leading-relaxed border-l-4 border-amber-500 pl-6">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
