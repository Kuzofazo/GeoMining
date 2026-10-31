import React, { useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import SEO from '../components/SEO';
import { Scale, Shield, FileCheck, Building2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Governance: React.FC = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  return (
    <div>
      <SEO
        title="Governance & Compliance | GeoMining Consultancy"
        description="Our commitment to corporate governance, ethical conduct, and regulatory compliance in the Liberian mining sector."
        keywords="mining governance Liberia, corporate responsibility, ethical mining, regulatory compliance West Africa, EPA Liberia, mining laws"
      />
      <PageHeader
        title="Governance & Compliance"
        category="Corporate Responsibility"
        subtitle="Upholding the highest standards of ethical conduct, regulatory compliance, and transparency."
        image="https://picsum.photos/1920/802?grayscale"
      />

      <section className="py-12 sm:py-20 bg-white">
        <div
          id="framework"
          className="max-w-4xl mx-auto px-4 md:px-8 text-center mb-10 sm:mb-16 scroll-mt-24"
        >
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 sm:mb-6 uppercase tracking-widest leading-tight">
            Corporate Governance
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            At Geo Mining & Environmental Consultancy, strict adherence to
            national laws and international best practices is non-negotiable.
            Our governance framework ensures accountability at all levels of the
            organization.
          </p>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="space-y-8">
            <div id="compliance" className="flex gap-6 scroll-mt-24">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-amber-500 rounded-sm flex items-center justify-center text-slate-900">
                  <Scale size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Regulatory Compliance
                </h3>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  We operate in full compliance with the{' '}
                  <strong>Liberia Environmental Protection Agency (EPA)</strong>{' '}
                  and the <strong>Ministry of Land,Mines & Energy</strong>. Our
                  operations meet all permitting requirements and regulatory
                  standards set forth by the Government of Liberia.
                </p>
                <ul className="text-slate-500 space-y-2">
                  <li className="flex items-center gap-2">
                    ✔ Liberia Mining and Minerals Law
                  </li>
                  <li className="flex items-center gap-2">
                    ✔ Environmental Protection and Management Law
                  </li>
                </ul>
              </div>
            </div>

            <div id="ethics" className="flex gap-6 scroll-mt-24">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-slate-900 rounded-sm flex items-center justify-center text-white">
                  <Shield size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Ethical Business Conduct
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Integrity and transparency are core to our business model. We
                  maintain a zero-tolerance policy towards corruption and are
                  committed to ethical dealings with all stakeholders, partners,
                  and government bodies.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div id="risk" className="flex gap-6 scroll-mt-24">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-slate-900 rounded-sm flex items-center justify-center text-white">
                  <FileCheck size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Risk Management
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Our comprehensive risk management strategies identify, assess,
                  and mitigate operational, environmental, and social risks.
                  Regular audits and oversight ensure our projects remain safe
                  and sustainable.
                </p>
              </div>
            </div>

            <div id="oversight" className="flex gap-6 scroll-mt-24">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-amber-500 rounded-sm flex items-center justify-center text-slate-900">
                  <Building2 size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Corporate Oversight
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  As the parent holding company, Geo Mining & Environmental
                  Consultancy sets the governance tone for all subsidiaries,
                  ensuring that StoneCrest Resource Limited and StoneCrest
                  Mining Corporation adhere to the same rigorous standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-slate-50 py-16 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-4 uppercase tracking-widest leading-tight">
            Compliance & Standards
          </h3>
          <p className="text-slate-600 mb-8">
            We believe that transparent operations build trust with our
            communities and investors.
          </p>
          <a
            href="#contact"
            className="inline-block bg-slate-900 text-white px-8 py-3 font-bold uppercase tracking-wider hover:bg-amber-500 hover:text-slate-900 transition-colors rounded-sm"
          >
            Contact Compliance Team
          </a>
        </div>
      </section>
    </div>
  );
};

export default Governance;
