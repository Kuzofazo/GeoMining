import React, { useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { useLocation } from 'react-router-dom';
import SEO from '../components/SEO';

const TermsOfService: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div>
      <SEO
        title="Terms of Service"
        description="Review the Terms of Service for GeoMining & Environmental Consultancy INC. These conditions govern the use of our website and professional services."
        keywords="terms of service, legal conditions, GeoMining, environmental consultancy, Liberia"
      />
      <PageHeader
        title="Terms of Service"
        category="Legal"
        subtitle="Conditions governing the use of our website and services."
        image="https://picsum.photos/1920/800?grayscale"
      />

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-slate-700">
          <div className="mb-12">
            <h2 className="text-3xl font-light text-slate-900 mb-2 uppercase">
              GEOMINING & ENVIRONMENTAL CONSULTANCY INC
            </h2>
            <p className="text-sm text-slate-500 italic">
              Last Updated:{' '}
              {new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>

          <div className="space-y-12">
            {/* 1. Acceptance of Terms */}
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                1. Acceptance of Terms
              </h3>
              <p className="leading-relaxed">
                By accessing the GEOMINING & ENVIRONMENTAL CONSULTANCY INC
                website or engaging our services, you agree to these Terms of
                Service and all applicable laws of the Republic of Liberia.
              </p>
            </section>

            {/* 2. Nature of Services */}
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                2. Nature of Services
              </h3>
              <p className="leading-relaxed mb-4">
                GEOMINING & ENVIRONMENTAL CONSULTANCY INC provides:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Geological and mining consultancy</li>
                <li>Environmental and social impact assessments (ESIA)</li>
                <li>Environmental audits and monitoring</li>
                <li>Regulatory compliance support</li>
                <li>Technical advisory services</li>
              </ul>
              <p className="leading-relaxed">
                All services are conducted in accordance with Liberia EPA
                regulations and the Minerals & Mining Act.
              </p>
            </section>

            {/* 3. Use of Website */}
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                3. Use of Website
              </h3>
              <p className="leading-relaxed mb-4">Users agree to:</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Use the website for lawful purposes only</li>
                <li>
                  Not misuse, copy, or interfere with website content or systems
                </li>
                <li>Not submit false or misleading information</li>
              </ul>
              <p className="leading-relaxed">
                Unauthorized use may result in legal action.
              </p>
            </section>

            {/* 4. Intellectual Property */}
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                4. Intellectual Property
              </h3>
              <p className="leading-relaxed mb-4">
                All website content, reports, graphics, logos, and documents are
                the property of GEOMINING & ENVIRONMENTAL CONSULTANCY INC unless
                otherwise stated.
              </p>
              <p className="leading-relaxed">
                No material may be reproduced without written permission.
              </p>
            </section>

            {/* 5. Professional Disclaimer */}
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                5. Professional Disclaimer
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Consultancy outputs are based on data available at the time of
                  assessment
                </li>
                <li>
                  GEOMINING & ENVIRONMENTAL CONSULTANCY INC does not guarantee
                  regulatory approval outcomes
                </li>
                <li>
                  Final decisions remain with relevant Liberian authorities
                </li>
              </ul>
            </section>

            {/* 6. Client Responsibilities */}
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                6. Client Responsibilities
              </h3>
              <p className="leading-relaxed mb-4">
                Clients are responsible for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Providing accurate and complete project information</li>
                <li>Complying with EPA and mining regulations</li>
                <li>Implementing recommended mitigation measures</li>
              </ul>
            </section>

            {/* 7. Limitation of Liability */}
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                7. Limitation of Liability
              </h3>
              <p className="leading-relaxed mb-4">
                GEOMINING & ENVIRONMENTAL CONSULTANCY INC shall not be liable
                for:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Regulatory decisions by government agencies</li>
                <li>
                  Losses arising from incomplete or inaccurate client data
                </li>
                <li>Indirect or consequential damages</li>
              </ul>
              <p className="leading-relaxed">
                Liability is limited to the scope of contracted services.
              </p>
            </section>

            {/* 8. Confidentiality */}
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                8. Confidentiality
              </h3>
              <p className="leading-relaxed">
                All client and stakeholder information is treated as
                confidential, except where disclosure is required by Liberian
                law or regulatory authorities.
              </p>
            </section>

            {/* 9. Termination of Services */}
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                9. Termination of Services
              </h3>
              <p className="leading-relaxed mb-4">
                GEOMINING & ENVIRONMENTAL CONSULTANCY INC reserves the right to
                suspend or terminate services if:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Legal or regulatory breaches occur</li>
                <li>False information is provided</li>
                <li>Contractual obligations are violated</li>
              </ul>
            </section>

            {/* 10. Governing Law */}
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                10. Governing Law
              </h3>
              <p className="leading-relaxed">
                These Terms of Service are governed by the laws of the Republic
                of Liberia, including applicable mining and environmental
                legislation.
              </p>
            </section>

            {/* 11. Amendments */}
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                11. Amendments
              </h3>
              <p className="leading-relaxed">
                GEOMINING & ENVIRONMENTAL CONSULTANCY INC may update these Terms
                at any time. Continued use of the website constitutes acceptance
                of revised terms.
              </p>
            </section>

            {/* 12. Contact Information */}
            <section className="bg-slate-50 p-6 rounded-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                12. Contact Information
              </h3>
              <p className="mb-4 uppercase font-bold">
                GEOMINING & ENVIRONMENTAL CONSULTANCY INC
              </p>
              <div className="space-y-2 text-sm">
                <p>📍 Broad and Gurley Street, Monrovia, Liberia</p>
                <p>📧 info@geomining.com</p>
                <p>📞 +231 77 777 2778</p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;
