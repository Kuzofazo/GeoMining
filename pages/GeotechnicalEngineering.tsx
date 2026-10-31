import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import SEO from '../components/SEO';
import { HardHat, MountainSnow, Hammer, Eye, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const GeotechnicalEngineering: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <SEO
        title="Geotechnical Engineering & Hydrogeological Services Liberia | GeoMining"
        description="Specialized geotechnical engineering, slope stability analysis, hydrogeological testing, and ground support design for mining and civil infrastructure in Liberia."
        keywords="Geotechnical services Liberia, Hydrogeological services Liberia, Mining risk assessment Liberia, Geotechnical engineering Liberia, slope stability Liberia, tailings dam safety Liberia, ground investigation, Mining Engineering Africa, Geotechnical engineering Africa"
        canonical="https://geominingec.com/services/geotechnical-engineering"
      />
      <Hero
        title="Geotechnical & Engineering Services"
        category="Engineering Solutions"
        subtitle="Specialized geotechnical engineering and site investigation services for infrastructure."
        showButtons={false}
        isFullHeight={false}
      />

      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6 tracking-widest leading-tight">
                Safe & Sustainable Infrastructure
              </h2>
              <div className="h-1 w-20 bg-amber-500 mb-6"></div>
              <p className="text-lg text-slate-600 leading-relaxed text-justify">
                We provide specialized geotechnical engineering and site
                investigation services tailored for complex construction and
                mining projects in Liberia and across West Africa.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed text-justify">
                By understanding the exact characteristics of the ground, our
                solutions ensure safe load-bearing capacities, mitigate
                geological hazards, and promote sustainable infrastructure
                development from the ground up.
              </p>
            </div>

            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  icon: MountainSnow,
                  title: 'Soil Testing & Ground Investigation',
                },
                { icon: HardHat, title: 'Engineering Geology Analysis' },
                { icon: Hammer, title: 'Structural Earth Assessments' },
                { icon: Eye, title: 'Construction Inspection' },
              ].map((service, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 p-6 rounded-sm border border-slate-100 hover:border-amber-500 hover:shadow-md transition-all flex flex-col items-center text-center group"
                >
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:bg-amber-500 transition-colors">
                    <service.icon
                      className="text-[#2d5a27] group-hover:text-white transition-colors"
                      size={24}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-wide leading-tight">
                    {service.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-3xl font-black mb-6 tracking-widest text-amber-500">
            Build on Solid Ground
          </h2>
          <p className="text-xl font-light leading-relaxed italic text-slate-300 mb-10">
            "Our engineering solutions guarantee that your infrastructure
            developments maintain long-term stability and absolute safety."
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-8 py-4 font-black text-sm tracking-widest hover:bg-white transition-all transform hover:-translate-y-1"
          >
            Request Geotechnical Analysis
            <ChevronRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default GeotechnicalEngineering;
