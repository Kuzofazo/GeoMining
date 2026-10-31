import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import MiningLicensePackages from '../components/MiningLicensePackages';

/* ─── Constants ──────────────────────────────────────────────────────────── */
const PAGE_URL = 'https://geominingec.com/services/mining-licenses';
const PAGE_TITLE =
  'Mining License Packages & Regulatory Compliance | GeoMining & Environmental Consultancy Inc';
const PAGE_DESC =
  "Liberia's premier agency for mining license acquisition, due diligence, and client security. We handle Class A, Class B Semi-Mechanized, Class C Artisanal, Prospecting, Mineral Exploration, Rock Quarry, River Sand Mining, Dealer/Exporter, Broker, Commercial Blasting, Certified Blaster, and Laterite Mining Permits — independent technical due diligence, cadastral title verification, investor protection, and EPA/MME statutory compliance.";

/* ─── Page Component ─────────────────────────────────────────────────────── */
const MiningLicensesPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const schemaJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Mining License Packages & Regulatory Compliance',
    description: PAGE_DESC,
    url: PAGE_URL,
    provider: {
      '@type': 'Organization',
      name: 'GeoMining & Environmental Consultancy Inc',
      url: 'https://geominingec.com',
      areaServed: 'Liberia',
    },
    serviceType: 'Mining License Acquisition & Regulatory Compliance',
    areaServed: { '@type': 'Country', name: 'Liberia' },
  });

  return (
    <>
      {/* ── SEO / Social meta ── */}
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESC} />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESC} />
        <meta
          property="og:image"
          content="https://geominingec.com/og-mining-licenses.jpg"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:site_name"
          content="GeoMining & Environmental Consultancy Inc"
        />
        <meta property="og:locale" content="en_LR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={PAGE_URL} />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESC} />
        <meta
          name="twitter:image"
          content="https://geominingec.com/og-mining-licenses.jpg"
        />
        <script type="application/ld+json">{schemaJson}</script>
      </Helmet>

      {/* ── Hero Section ── */}
      <Hero
        title="Mining License Packages & Regulatory Compliance"
        category="Statutory Permitting & Licensing"
        subtitle="Turnkey statutory licensing packages across all 12 Liberian categories — Class A Industrial, Class B Semi-Mechanized, Class C Artisanal, Mineral Exploration, Prospecting, Rock Quarry, River Sand Mining, Dealer/Exporter, Broker, Commercial Blasting, Certified Blaster, and Laterite Mining Permits."
        showButtons={false}
        isFullHeight={false}
      />

      {/* ── License Packages ── */}
      <MiningLicensePackages />
    </>
  );
};

export default MiningLicensesPage;
