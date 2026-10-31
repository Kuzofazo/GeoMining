import React, { useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { useLocation } from 'react-router-dom';
import SEO from '../components/SEO';

const PrivacyPolicy: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div>
      <SEO
        title="Privacy Policy"
        description="Read the Privacy Policy for GeoMining & Environmental Consultancy INC. We are committed to protecting your personal data in compliance with Liberian laws."
        keywords="privacy policy, data protection, GeoMining, environmental consultancy, Liberia, legal"
      />
      <PageHeader
        title="Privacy Policy"
        category="Legal"
        subtitle="Our commitment to protecting your data and privacy."
        image="https://picsum.photos/1920/800?grayscale"
      />

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-slate-700">
          <div className="mb-12">
            <h2 className="text-3xl font-light text-slate-900 mb-2 uppercase">
              GEOMINING & ENVIRONMENTAL CONSULTANCY INC
            </h2>
            <p className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-4">
              (Liberia EPA & Minerals & Mining Act Aligned)
            </p>
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
            {/* 1. Introduction */}
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                1. Introduction
              </h3>
              <p className="leading-relaxed mb-4 text-justify">
                GEOMINING & ENVIRONMENTAL CONSULTANCY INC ("the Company," "we,"
                "us," or "our") is committed to protecting personal data in
                compliance with the Environmental Protection and Management Law
                of Liberia, the Minerals & Mining Act of Liberia, and other
                applicable national regulations.
              </p>
              <p className="leading-relaxed text-justify">
                This Privacy Policy explains how we collect, process, store, and
                protect personal information obtained through our consultancy
                services, field operations, community engagements, and official
                website.
              </p>
            </section>

            {/* 2. Scope of Application */}
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                2. Scope of Application
              </h3>
              <p className="leading-relaxed mb-4 text-justify">
                This policy applies to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Clients and project partners</li>
                <li>Employees, consultants, and contractors</li>
                <li>Community members and stakeholders</li>
                <li>Website visitors</li>
                <li>Government and institutional collaborators</li>
              </ul>
            </section>

            {/* 3. Information We Collect */}
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                3. Information We Collect
              </h3>

              <h4 className="font-bold text-slate-900 mt-6 mb-3">
                3.1 Personal & Operational Information
              </h4>
              <ul className="list-disc pl-6 space-y-2 mb-6">
                <li>Names, addresses, phone numbers, and email contacts</li>
                <li>Identification documents where legally required</li>
                <li>Employment and consultancy records</li>
                <li>Client project documentation</li>
                <li>Community consultation and grievance records</li>
                <li>Environmental and social baseline survey inputs</li>
                <li>Financial information for lawful payments</li>
              </ul>

              <h4 className="font-bold text-slate-900 mt-6 mb-3">
                3.2 Technical & Website Information
              </h4>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP addresses and browser data</li>
                <li>Website usage analytics</li>
                <li>Device and access logs</li>
              </ul>
            </section>

            {/* 4. Purpose of Data Collection */}
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                4. Purpose of Data Collection
              </h3>
              <p className="leading-relaxed mb-4 text-justify">
                In accordance with EPA licensing and mining regulatory
                requirements, information is collected to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Conduct Environmental & Social Impact Assessments (ESIA)
                </li>
                <li>
                  Prepare EPA-mandated reports, audits, and compliance filings
                </li>
                <li>
                  Support mining, geological, and environmental consultancy
                  services
                </li>
                <li>
                  Manage employment, contracts, and professional engagements
                </li>
                <li>
                  Facilitate community consultations and grievance mechanisms
                </li>
                <li>
                  Comply with occupational health, safety, and environmental
                  standards
                </li>
                <li>Meet reporting obligations under Liberian law</li>
              </ul>
            </section>

            {/* 5. Legal Basis for Processing */}
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                5. Legal Basis for Processing
              </h3>
              <p className="leading-relaxed mb-4 text-justify">
                GEOMINING & ENVIRONMENTAL CONSULTANCY INC processes personal
                data under the following lawful bases:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Compliance with Liberian laws and regulations</li>
                <li>Performance of consultancy or employment contracts</li>
                <li>Consent of the data subject</li>
                <li>
                  Legitimate interests related to safety, compliance, and
                  operations
                </li>
              </ul>
            </section>

            {/* 6. Disclosure of Information */}
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                6. Disclosure of Information
              </h3>
              <p className="leading-relaxed mb-4 text-justify">
                Personal information may be disclosed only when legally required
                to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Liberia Environmental Protection Agency (EPA)</li>
                <li>Ministry of Mines and Energy</li>
                <li>Other authorized government institutions</li>
                <li>
                  Project clients and partners under confidentiality agreements
                </li>
                <li>Legal, audit, and financial institutions</li>
              </ul>
              <p className="leading-relaxed font-medium text-justify">
                GEOMINING & ENVIRONMENTAL CONSULTANCY INC does not sell or
                misuse personal data.
              </p>
            </section>

            {/* 7. Data Retention */}
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                7. Data Retention
              </h3>
              <p className="leading-relaxed mb-4 text-justify">
                Personal data is retained for periods required by:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>EPA reporting and audit guidelines</li>
                <li>Mining and environmental licensing conditions</li>
                <li>Employment and contractual obligations</li>
              </ul>
              <p className="leading-relaxed text-justify">
                Data is securely destroyed or anonymized when no longer
                required.
              </p>
            </section>

            {/* 8. Data Security Measures */}
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                8. Data Security Measures
              </h3>
              <p className="leading-relaxed mb-4 text-justify">
                GEOMINING & ENVIRONMENTAL CONSULTANCY INC applies reasonable
                safeguards including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Restricted access controls</li>
                <li>Secure physical and digital storage</li>
                <li>Confidentiality obligations for staff and consultants</li>
                <li>Controlled handling of field and community data</li>
              </ul>
            </section>

            {/* 9. Rights of Data Subjects */}
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                9. Rights of Data Subjects
              </h3>
              <p className="leading-relaxed mb-4 text-justify">
                Subject to Liberian law, individuals may request:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Access to personal data</li>
                <li>Correction of inaccurate records</li>
                <li>Deletion where legally permissible</li>
                <li>Limitation of processing</li>
              </ul>
              <p className="leading-relaxed text-justify">
                Requests should be submitted using the contact details below.
              </p>
            </section>

            {/* 10. Community & Stakeholder Protection */}
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                10. Community & Stakeholder Protection
              </h3>
              <p className="leading-relaxed mb-4 text-justify">
                In line with EPA community engagement requirements, GEOMINING &
                ENVIRONMENTAL CONSULTANCY INC ensures that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Community data is used strictly for project purposes</li>
                <li>Grievances are handled confidentially</li>
                <li>Sensitive social and environmental data is protected</li>
              </ul>
            </section>

            {/* 11. Updates to This Policy */}
            <section>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                11. Updates to This Policy
              </h3>
              <p className="leading-relaxed text-justify">
                This Privacy Policy may be updated to reflect changes in
                Liberian laws or regulatory requirements. Updates will be
                published on our website.
              </p>
            </section>

            {/* 12. Contact Information */}
            <section className="bg-slate-50 p-6 rounded-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                12. Contact Information
              </h3>
              <p className="font-bold mb-2">
                Compliance & Data Protection Office
              </p>
              <p className="mb-4 uppercase font-bold">
                GEOMINING & ENVIRONMENTAL CONSULTANCY INC
              </p>
              <div className="space-y-2 text-sm">
                <p>📍 Broad and Gurley Street, Monrovia, Liberia</p>
                <p>📧 privacy@geomining.com</p>
                <p>📞 +231 77 777 2778</p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
