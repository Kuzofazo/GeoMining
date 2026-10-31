import React, { useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { useLocation } from 'react-router-dom';
// Images will be served from /public/images/
import { CheckCircle2, HardHat, Cog, Trees } from 'lucide-react';
import SEO from '../components/SEO';

const StoneCrestMining: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div>
      <SEO
        title="StoneCrest Mining - Top Mining Operations in Liberia"
        description="StoneCrest Mining Corporation: Leading mining production, safety, and operational excellence in Liberia and West Africa. Your partner for responsible resource extraction."
        keywords="StoneCrest Mining, best mining operations Liberia, mine development Africa, mining safety Liberia, efficient mining production, West Africa mining companies"
      />
      <PageHeader
        title="StoneCrest Mining Corporation"
        category="Subsidiaries"
        subtitle="Operational excellence in mining production and safety."
        image="/images/stonecrest-mining-hero.webp"
      />

      {/* Overview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1 order-2 md:order-1 relative">
            <div className="absolute top-4 -right-4 w-full h-full border-2 border-slate-900 rounded-lg -z-10"></div>
            <img
              loading="lazy"
              decoding="async"
              src="/images/Mining.webp"
              alt="Mining Operations"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex-1 order-1 md:order-2">
            <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-widest">
              Mining & Production
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6">
              StoneCrest Mining Corporation executes the Group’s operational
              mandates, transforming discovered resources into tangible economic
              value. We manage the full lifecycle of mine development, from
              feasibility planning to extraction and processing.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              Safety and efficiency are the cornerstones of our operations. We
              utilize modern mining methods and equipment to maximize recovery
              while strictly adhering to environmental regulations and community
              commitments.
            </p>
            <div className="bg-slate-100 border-l-4 border-slate-800 p-6 rounded-r-sm">
              <p className="text-slate-800 italic">
                "Building a legacy of responsible mining that benefits present
                and future generations."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Activities Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-widest">
              Core Operations
            </h2>
            <p className="text-slate-600">
              Delivering operational success through discipline and innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-slate-100 text-slate-800 rounded-full flex items-center justify-center mb-6">
                <HardHat size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Safety First
              </h3>
              <p className="text-slate-600 mb-4">
                A zero-harm culture that prioritizes the health and well-being
                of our workforce above all else.
              </p>
            </div>

            <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-slate-100 text-slate-800 rounded-full flex items-center justify-center mb-6">
                <Cog size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Efficient Production
              </h3>
              <p className="text-slate-600 mb-4">
                Optimizing workflows and processing techniques to ensure maximum
                yield and cost-effectiveness.
              </p>
            </div>

            <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-slate-100 text-slate-800 rounded-full flex items-center justify-center mb-6">
                <Trees size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Environmental Care
              </h3>
              <p className="text-slate-600 mb-4">
                Concurrent rehabilitation and strict water/waste management
                systems to minimize our footprint.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities List */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <h3 className="text-2xl font-black text-slate-900 mb-8 pb-4 border-b border-slate-200 uppercase tracking-widest">
            Our Mining Services
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
            {[
              'Open-pit mine planning and design',
              'Drill and blast operations',
              'Load and haul fleet management',
              'Mineral processing and beneficiation',
              'Inventory and stockpile management',
              'Site infrastructure development (roads, camps)',
              'Occupational Health & Safety (OHS) systems',
              'Mine closure and land rehabilitation',
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-slate-700">
                <CheckCircle2
                  className="text-slate-800 shrink-0 mt-1"
                  size={18}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default StoneCrestMining;
