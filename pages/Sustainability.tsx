import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import {
  Leaf,
  Users,
  HardHat,
  Scroll,
  UserCheck,
  Recycle,
  ShieldCheck,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import SEO from '../components/SEO';

const Sustainability: React.FC = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  const pillars = [
    {
      id: 'environment',
      icon: Leaf,
      label: 'Environmental Protection',
      meaning: 'EPA compliance, biodiversity, land restoration',
    },
    {
      id: 'community',
      icon: Users,
      label: 'Community Development',
      meaning: 'CDA, local benefits, stakeholder engagement',
    },
    {
      id: 'safety',
      icon: HardHat,
      label: 'Occupational Safety',
      meaning: 'Worker safety & training',
    },
    {
      id: 'compliance',
      icon: Scroll,
      label: 'Regulatory Compliance',
      meaning: 'Mining law, EPA permits',
    },
    {
      id: 'employment',
      icon: UserCheck,
      label: 'Local Employment',
      meaning: 'Liberian workforce & capacity building',
    },
    {
      id: 'rehabilitation',
      icon: Recycle,
      label: 'Rehabilitation & Closure',
      meaning: 'Post-mining land use',
    },
  ];

  return (
    <div>
      <SEO
        title="Sustainability & ESG | GeoMining & Environmental Consultancy"
        description="Our commitment to environmental stewardship, social responsibility, and sustainable mining practices in Liberia and West Africa."
        keywords="sustainable mining Liberia, ESG mining Africa, environmental stewardship, social responsibility mining"
      />
      <Hero
        title="Sustainability & Community"
        category="Our Commitment"
        subtitle="Sustainability is embedded across all Group activities and decision-making processes."
        showButtons={false}
        isFullHeight={false}
      />

      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 mb-10 sm:mb-16 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 sm:mb-6 uppercase tracking-widest leading-tight">
            Our Commitment
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            We embed circular economy principles, biodiversity protection, and
            community engagement strategies into core project plans, ensuring
            sustainability is by design.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar) => (
            <div
              key={pillar.id}
              id={pillar.id}
              className="p-8 border border-slate-200 rounded-sm hover:border-amber-500 transition-colors group scroll-mt-24 bg-slate-50"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:shadow-md transition-all border border-slate-100">
                  <pillar.icon
                    className="text-slate-700 group-hover:text-amber-600 transition-colors"
                    size={32}
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {pillar.label}
                </h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {pillar.meaning}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Future Commitment */}
        <div className="max-w-4xl mx-auto px-4 md:px-8 mt-20 text-center">
          <div className="bg-slate-50 p-10 rounded-sm border-t-4 border-slate-900">
            <ShieldCheck className="mx-auto text-slate-900 mb-4" size={40} />
            <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4 uppercase tracking-widest leading-tight">
              1. Environmental Stewardship
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Through responsible operations and continuous improvement, Geo
              Mining & Environmental Consultancy aims to contribute positively
              to Liberia’s natural resource sector and support sustainable
              development across West Africa.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sustainability;
