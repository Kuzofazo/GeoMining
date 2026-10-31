import React, { useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { useLocation } from 'react-router-dom';
// Images will be served from /public/images/
import { CheckCircle2, MapPin, Microscope, FileSearch } from 'lucide-react';
import SEO from '../components/SEO';

const StoneCrestResource: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div>
      <SEO
        title="StoneCrest Resource - Premier Mineral Exploration Liberia"
        description="StoneCrest Resource Limited: Expert geological surveys, mineral exploration, and resource estimation services in Liberia and across West Africa."
        keywords="StoneCrest Resource, mineral exploration Liberia, geological surveys Africa, resource estimation, gold exploration Liberia, iron ore Liberia, exploration geologists West Africa"
      />
      <PageHeader
        title="StoneCrest Resource Limited"
        category="Subsidiaries"
        subtitle="Identifying and advancing mineral opportunities through sound geological practices."
        image="/images/stonecrest-resource-hero.webp"
      />

      {/* Overview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1">
            <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-widest">
              Exploration & Resource Development
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-6 text-justify">
              StoneCrest Resource Limited is dedicated to mineral exploration
              and early-stage resource development across Liberia and the West
              African region. Our mission is to discover and define economic
              mineral deposits using modern geological techniques.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6 text-justify">
              We focus on identifying high-potential targets, conducting
              systematic sampling and mapping, and advancing projects from
              grassroots exploration to resource definition. Our work serves as
              the critical first step in the mining value chain, creating value
              through discovery.
            </p>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-sm">
              <p className="text-slate-800 italic">
                "Our geologists combine local knowledge with international best
                practices to unlock the mineral potential of the region."
              </p>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute top-4 -left-4 w-full h-full border-2 border-amber-500 rounded-lg -z-10"></div>
            <img
              loading="lazy"
              decoding="async"
              src="/images/Resource.webp"
              alt="Exploration Site"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* Core Activities Grid */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-widest">
              Core Activities
            </h2>
            <p className="text-slate-600">
              Precise, scientific, and systematic approaches to mineral
              exploration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Geological Mapping
              </h3>
              <p className="text-slate-600 mb-4">
                Detailed field mapping to understand lithology, structure, and
                mineralization controls.
              </p>
            </div>

            <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
                <Microscope size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Sampling & Analysis
              </h3>
              <p className="text-slate-600 mb-4">
                Systematic soil, rock chip, and trench sampling followed by
                rigorous laboratory analysis.
              </p>
            </div>

            <div className="bg-white p-8 rounded-sm shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
                <FileSearch size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Resource Estimation
              </h3>
              <p className="text-slate-600 mb-4">
                Data interpretation and modeling to define resource quantity and
                quality according to international codes.
              </p>
            </div>
            {/* Add more cards if needed */}
          </div>
        </div>
      </section>

      {/* Key Stats / Highlights */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-amber-500 mb-2">10+</div>
              <div className="text-slate-400 text-sm tracking-wider">
                Active Provenances
              </div>
            </div>
            <div className="p-6 border-l border-slate-700">
              <div className="text-4xl font-bold text-amber-500 mb-2">100%</div>
              <div className="text-slate-400 text-sm tracking-wider">
                Regulatory Compliance
              </div>
            </div>
            <div className="p-6 border-l border-slate-700">
              <div className="text-4xl font-bold text-amber-500 mb-2">
                Expert
              </div>
              <div className="text-slate-400 text-sm tracking-wider">
                Geological Team
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services List Detail */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <h3 className="text-2xl font-black text-slate-900 mb-8 pb-4 border-b border-slate-200 tracking-widest">
            Our Exploration Services
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
            {[
              'Regional and local scale geological mapping',
              'Geochemical surveys (Soil, Stream Sediment, Rock)',
              'Geophysical survey interpretation',
              'Trenching and pitting programs',
              'Core logging and sampling',
              'QA/QC data management',
              'Technical report writing',
              'Tenement management and permitting',
            ].map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-slate-700">
                <CheckCircle2
                  className="text-amber-500 shrink-0 mt-1"
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

export default StoneCrestResource;
