import React from 'react';
import Hero from '../components/Hero';
import SEO from '../components/SEO';

const History: React.FC = () => {
  return (
    <div>
      <SEO
        title="Our History & Legacy | GeoMining & Environmental Consultancy"
        description="Founded in 2025 by Carlos E. Tingban, Sr., GeoMining & Environmental Consultancy INC has quickly become a leader in West African mineral services."
        keywords="GeoMining history, Carlos Tingban, mining consultancy founding, Liberia mining legacy"
      />
      <Hero
        title="Our History"
        category="About Us"
        subtitle="A legacy of excellence in geological, mining, and environmental services."
        showButtons={false}
        isFullHeight={false}
      />

      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-widest text-center">
            Founding & Vision
          </h2>

          <div className="prose prose-lg text-slate-600 mx-auto">
            <p className="leading-relaxed mb-6">
              GEOMINING & ENVIRONMENTAL CONSULTANCY INC is a registered and
              recognized Liberian firm founded in 2025 with focus on providing
              geological, mineral exploration, mining and environmental
              consulting services to mining companies, investors, and related
              stakeholders.
            </p>
            <p className="leading-relaxed mb-6">
              It operates in the extractive and environmental sector, helping
              guide exploration, compliance, and project support.
            </p>
            <p className="leading-relaxed mb-6">
              This institution was founded by{' '}
              <span className="font-bold text-slate-900">
                Carlos E. Tingban, Sr.
              </span>
              , (former Assistant Minister for Mines, Mineral resource
              Development and Conservation of Liberia) with assistance from
              other sector professionals.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default History;
