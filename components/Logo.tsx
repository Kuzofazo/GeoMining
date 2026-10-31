import React from 'react';
// Images will be served from /public/images/

/**
 * The Logo component renders the official GEO Mining logo.
 * Using the high-resolution circular badge provided by the company.
 */
export const Logo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={`relative bg-white rounded-full flex items-center justify-center ${className}`}
    >
      <img
        src="/images/logo.webp"
        alt="GEO Mining & Environmental Consultancy"
        className="w-full h-full object-contain p-1.5"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src =
            'https://raw.githubusercontent.com/stackblitz/stackblitz-images/main/geomining-logo.webp';
          target.onerror = () => {
            target.src =
              'https://api.dicebear.com/7.x/initials/svg?seed=GM&backgroundColor=2d5a27&fontColor=ffffff&fontSize=45';
          };
        }}
      />
    </div>
  );
};

export default Logo;
