import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import SEO from '../components/SEO';
import {
  Pickaxe,
  Combine,
  MapPin,
  Compass,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MiningGeologicalServices: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <SEO
        title="Mining & Geological Consultancy in Liberia | Mineral Exploration Services"
        description="GeoMining & Environmental Consultancy INC provides leading mineral exploration, geological survey, resource assessment, and mining feasibility study services across Liberia and West Africa."
        keywords="Mining Consultancy in Liberia, Mining Consultants in Liberia, Geological Consultancy Liberia, Geology Consultants in Liberia, Mining Exploration Liberia, Mineral Exploration Liberia, Mineral exploration services Liberia, Mining feasibility study Liberia, Geological Survey Liberia, Mineral Resource Assessment Liberia, Mining Consultants Africa, Mineral Exploration West Africa, Mining Services West Africa, Mining Engineering Africa"
        canonical="https://geominingec.com/services/mining-geological"
      />
      <Hero
        title="Mining & Geological Services"
        category="Mining Consultancy"
        subtitle="Expert mineral exploration and geological consulting services across West Africa."
        showButtons={false}
        isFullHeight={false}
      />

      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6 uppercase tracking-widest leading-tight">
              Maximizing Resource Efficiency
            </h2>
            <div className="h-1 w-20 bg-amber-500 mx-auto mb-6"></div>
            <p className="text-lg text-slate-600 leading-relaxed">
              GEOMINING & ENVIRONMENTAL CONSULTANCY INC delivers expert mineral
              exploration and geological consulting services across West Africa.
              Our cutting-edge approach integrates deep field experience with
              modern geospatial technologies to unlock the potential of mineral
              assets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Compass,
                title: 'Geological Surveys',
                desc: 'Comprehensive field mapping and structural analysis.',
              },
              {
                icon: Layers,
                title: 'Resource Estimation',
                desc: 'Accurate modeling and calculation of mineral resources.',
              },
              {
                icon: Pickaxe,
                title: 'Mining Feasibility Studies',
                desc: 'Economic and technical evaluation of mining projects.',
              },
              {
                icon: Combine,
                title: 'Exploration Drilling Support',
                desc: 'Management and execution of target drilling programs.',
              },
              {
                icon: MapPin,
                title: 'GIS & Remote Sensing',
                desc: 'Advanced spatial analysis to optimize mineral exploration strategies.',
              },
            ].map((service, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-8 rounded-sm border border-slate-100 hover:border-amber-500 hover:shadow-lg transition-all group"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:bg-amber-500 transition-colors">
                  <service.icon
                    className="text-[#2d5a27] group-hover:text-white transition-colors"
                    size={32}
                  />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3 uppercase tracking-wide">
                  {service.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-3xl font-black mb-6 uppercase tracking-widest text-amber-500">
            Uncover the True Value of Your Assets
          </h2>
          <p className="text-xl font-light leading-relaxed italic text-slate-300 mb-10">
            "We help mining companies maximize resource efficiency and
            profitability from discovery to development."
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-8 py-4 font-black text-sm uppercase tracking-widest hover:bg-white transition-all transform hover:-translate-y-1"
          >
            Engage Our Geologists
            <ChevronRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MiningGeologicalServices;
