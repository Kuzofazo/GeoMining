import React from 'react';
import { ArrowRight } from 'lucide-react';

// Using existing images that best fit the new 4 pillars
// Images will be served from /public/images/

// Interface for Service Items
interface ServiceItem {
  id: string;
  title: string;
  image: string;
  link: string;
  description: string;
}

const services: ServiceItem[] = [
  {
    id: 'environmental',
    title: 'Environmental Services',
    image: '/images/GIS & Environmental Services.webp',
    link: '/services/environmental-impact-assessment',
    description:
      'Industry-leading environmental consultancy including EIA, audit, waste management, and sustainability assessments.',
  },
  {
    id: 'mining-geological',
    title: 'Mining & Geological Services',
    image: '/images/Exploration & Geological Services.webp',
    link: '/services/mining-geological',
    description:
      'Mineral exploration, feasibility studies, geological surveys, GIS mapping, and resource estimation.',
  },
  {
    id: 'geotechnical',
    title: 'Geotechnical & Engineering',
    image: '/images/Mining Services.webp',
    link: '/services/geotechnical-engineering',
    description:
      'Advanced engineering solutions for soil testing, ground investigation, and structural earth analysis.',
  },
  {
    id: 'advisory',
    title: 'Advisory & Due Diligence',
    image: '/images/Strategy & Investment Advisory.webp',
    link: '/services#advisory',
    description:
      'Premier due diligence, client security advisory, title authentication, and strategic studies protecting mining investments across Liberia.',
  },
];

const OurServices: React.FC = () => {
  return (
    <section className="py-24 bg-white" id="services">
      <div className="max-w-[110rem] mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h4 className="text-amber-500 font-bold uppercase tracking-widest text-xl mb-3">
            What We Do
          </h4>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">
            Our Core Service Pillars
          </h2>
          <div className="h-1 w-24 bg-amber-500 mx-auto rounded-full"></div>
          <p className="mt-6 text-xl text-slate-600 leading-relaxed">
            GEOMINING & ENVIRONMENTAL CONSULTANCY INC is a single-source partner
            that de-risks mining projects by integrating deep technical
            expertise with robust environmental and social stewardship.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative h-[300px] overflow-hidden rounded-sm cursor-pointer shadow-lg"
            >
              {/* Background Image */}
              <img
                loading="lazy"
                decoding="async"
                src={service.image}
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent opacity-95 transition-opacity duration-300 group-hover:opacity-80"></div>

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                  <span className="text-amber-500 font-bold text-sm uppercase tracking-widest mb-1 block">
                    Pillar {index + 1}
                  </span>
                  <h3 className="text-xl font-black text-white tracking-wide mb-3 leading-tight">
                    {service.title}
                  </h3>
                  <div className="h-0.5 w-12 bg-amber-500 mb-4 transition-all duration-300 group-hover:w-20"></div>

                  <p className="text-slate-100 text-base mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 line-clamp-4 font-medium">
                    {service.description}
                  </p>

                  <a
                    href={service.link}
                    className="inline-flex items-center gap-2 text-white font-bold text-xs uppercase tracking-widest hover:text-amber-400 transition-colors"
                  >
                    Explore Pillar
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurServices;
