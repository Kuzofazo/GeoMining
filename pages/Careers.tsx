import React from 'react';
import Hero from '../components/Hero';
import SEO from '../components/SEO';
import { Award, ChevronRight, Briefcase } from 'lucide-react';
import { Link } from 'react-router-dom';

const Careers: React.FC = () => {
  return (
    <div className="bg-white">
      <SEO
        title="Careers | Work With GeoMining Consultancy"
        description="Join our team of experts in geology, mining engineering, and environmental science. Explore job opportunities at GeoMining & Environmental Consultancy INC."
        keywords="mining jobs Liberia, geology careers West Africa, environmental science jobs, engineering vacancies Liberia"
      />
      <Hero
        category="Careers"
        title="Vacancies Closed"
        subtitle="Thank you for your overwhelming interest in joining GEOMINING & ENVIRONMENTAL CONSULTANCY INC. Our current recruitment cycle has concluded, and all vacancies are now closed."
        showButtons={false}
        isFullHeight={false}
      />

      <section className="max-w-7xl mx-auto px-4 md:px-8 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Briefcase className="text-[#2d5a27]" size={40} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#2d5a27] uppercase tracking-normal mb-6 font-arial-black">
            Recruitment Cycle Closed
          </h2>
          <div className="space-y-6 text-lg text-slate-700 leading-relaxed font-arial text-justify">
            <p>
              We are incredibly grateful for the overwhelming interest and high
              volume of applications we received during our recent recruitment
              drive. The passion and talent demonstrated by all applicants have
              been truly inspiring.
            </p>
            <p>
              Due to this unprecedented response,{' '}
              <strong>we have officially closed all open vacancies</strong> to
              focus on thoroughly reviewing the current pool of candidates. Our
              recruitment team is working diligently to ensure every application
              is given the careful consideration it deserves.
            </p>
            <p>
              While we are no longer accepting applications for these roles, we
              encourage you to stay connected with GEOMINING & ENVIRONMENTAL
              CONSULTANCY INC for future opportunities as we continue to grow
              and engineer a sustainable future.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 py-20 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#2d5a27]/10 skew-x-12 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-black mb-6 leading-tight uppercase tracking-widest font-arial-black">
              Future Opportunities
            </h2>
            <p className="text-xl text-slate-400 mb-10 leading-relaxed">
              We're always on the lookout for exceptional talent. If you have
              expertise in mining, geology, or environmental science, you are
              welcome to send us your resume and we'll keep you in our talent
              pool for future openings.
            </p>
            <a
              href="mailto:info@geominingec.com"
              className="inline-flex items-center gap-3 bg-amber-500 text-slate-900 font-black px-10 py-4 rounded-xl hover:bg-white transition-all transform hover:-translate-y-1 shadow-2xl shadow-amber-500/20"
            >
              Submit General Application
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
