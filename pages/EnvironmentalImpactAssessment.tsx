import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import SEO from '../components/SEO';
import {
  Target,
  Leaf,
  ShieldCheck,
  BarChart4,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const EnvironmentalImpactAssessment: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <SEO
        title="Environmental Impact Assessment (EIA) Liberia | EIA Consultants & Permitting"
        description="Premier Environmental Impact Assessment (EIA/ESIA) consultancy in Liberia and West Africa. Certified EPA environmental management, baseline ecological surveys, mitigation planning, and statutory compliance."
        keywords="Environmental Impact Assessment Liberia, EIA Consultants Liberia, Environmental Management Liberia, Environmental impact assessment services Liberia, Environmental monitoring services Liberia, Mine environmental management Liberia, Mining permit consultancy Liberia, Environmental Consultants in Liberia, Environmental Consultancy Liberia, Sustainable Mining Liberia, Environmental Impact Assessment Africa, Environmental Consultants West Africa"
        canonical="https://geominingec.com/services/environmental-impact-assessment"
      />
      <Hero
        title="Environmental Impact Assessment (EIA)"
        category="Environmental Services"
        subtitle="Professional EIA services for mining and infrastructure projects in Liberia."
        showButtons={false}
        isFullHeight={false}
      />

      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-6 uppercase tracking-widest leading-tight">
                Meeting Local and International Standards
              </h2>
              <div className="h-1 w-20 bg-amber-500 mb-6"></div>
              <p className="text-lg text-slate-600 leading-relaxed mb-6">
                We provide professional Environmental Impact Assessment (EIA)
                services for mining and infrastructure projects in Liberia. Our
                comprehensive approach ensures that environmental risks are
                identified early and mitigated effectively.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                By integrating best practices and ensuring strict adherence to
                EPA regulations, we help organizations operate sustainably and
                maintain their social license to operate.
              </p>
            </div>

            <div className="bg-slate-50 p-8 sm:p-12 rounded-sm border-l-4 border-amber-500 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-wide">
                Our EIA Services Include:
              </h3>
              <ul className="space-y-5">
                {[
                  { icon: Leaf, text: 'Environmental baseline studies' },
                  {
                    icon: Target,
                    text: 'Impact analysis and mitigation planning',
                  },
                  {
                    icon: ShieldCheck,
                    text: 'Environmental management systems (EMS)',
                  },
                  {
                    icon: BarChart4,
                    text: 'Compliance monitoring and auditing',
                  },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                      <item.icon
                        size={18}
                        className="text-[#2d5a27] group-hover:text-white transition-colors"
                      />
                    </div>
                    <span className="text-slate-700 font-medium text-lg md:text-xl">
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-3xl font-black mb-6 uppercase tracking-widest text-amber-500">
            Secure Your Project's Future
          </h2>
          <p className="text-xl font-light leading-relaxed italic text-slate-300 mb-10">
            "Ensuring your projects meet local and international environmental
            standards. Protect the environment while driving progress."
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-amber-500 text-slate-900 px-8 py-4 font-black text-sm uppercase tracking-widest hover:bg-white transition-all transform hover:-translate-y-1"
          >
            Request an EIA Consultation
            <ChevronRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default EnvironmentalImpactAssessment;
