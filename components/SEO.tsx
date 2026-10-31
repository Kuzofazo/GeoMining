import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface FAQItem {
  question: string;
  answer: string;
}

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  schema?: Record<string, any>;
  faqs?: FAQItem[];
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonical,
  schema,
  faqs,
  image,
  imageAlt,
  type = 'website',
  noIndex,
}) => {
  const siteTitle = 'GeoMining';
  const baseUrl = 'https://geominingec.com';
  const fullTitle = title.toLowerCase().includes('geomining')
    ? title
    : `${title} | GeoMining & Environmental Consultancy INC`;
  const defaultImage = `${baseUrl}/favicon.png`;
  const metaImage = image || defaultImage;
  const metaImageAlt =
    imageAlt ||
    'GeoMining & Environmental Consultancy INC - Mining & Environmental Services Liberia';

  // Use the current path for canonical if not provided
  const canonicalUrl =
    canonical ||
    (typeof window !== 'undefined'
      ? `${baseUrl}${window.location.pathname}`
      : baseUrl);

  // Generate FAQPage schema if faqs are provided
  const faqSchema =
    faqs && faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }
      : null;

  const defaultKeywords =
    'Due Diligence Liberia, Due Diligence Agency in Liberia, Mining Due Diligence Liberia, Investor Due Diligence Liberia, Due Diligence Consultancy Liberia, Due Diligence Services Liberia, Client Security Liberia, Client Security Services Liberia, Mining Client Security Liberia, Investor Protection Liberia, Mining Investment Security Liberia, Asset Protection Mining Liberia, Mining Fraud Prevention Liberia, Technical Due Diligence Liberia, Independent Due Diligence Liberia, ESG Due Diligence Liberia, Agency That Offers Mining License in Liberia, Best Agency That Offers Mining License in Liberia, Mining License in Liberia, Mining License Agency Liberia, Mining License Packages Liberia, How to Get a Mining License in Liberia, Mining Permits Liberia, Class A Mining License Liberia, Class B Mining License Liberia, Class C Mining License Liberia, Mineral Exploration License Liberia, Prospecting License Liberia, Rock Quarry License Liberia, River Sand Mining License Liberia, Dealer Exporter License Liberia, Mineral Broker License Liberia, Commercial Blasting Permit Liberia, Certified Blaster License Liberia, Laterite Mining Permit Liberia, Ministry of Mines and Energy Mining Licenses Liberia, Best Mining Consultancy in Liberia, Best Mining Consultancy in West Africa, Best Mining and Environmental Consultancy in Liberia, Best Environmental Consultancy in Liberia, Mining Consultancy in Liberia, Mining Consultants in Liberia, Environmental Consultancy Liberia, Geological Consultancy Liberia, Mining Services Liberia, Environmental Impact Assessment Liberia, Mineral Exploration West Africa, Sustainable Mining Africa, Mining Compliance Liberia, Carlos Edison Sackey';
  const metaKeywords = keywords || defaultKeywords;

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="author" content="GeoMining & Environmental Consultancy INC" />
      <meta
        name="publisher"
        content="GeoMining & Environmental Consultancy INC"
      />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={siteTitle} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />
      <meta property="og:image:alt" content={metaImageAlt} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="en_GB" />
      <meta
        property="og:see_also"
        content="https://www.linkedin.com/company/geo-mining-environmental-consultancy-inc/"
      />
      <meta property="og:see_also" content="https://x.com/GeominingEC" />
      <meta
        property="og:see_also"
        content="https://www.facebook.com/profile.php?id=61586556572882"
      />
      <meta
        property="og:see_also"
        content="https://www.instagram.com/geominingec"
      />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@GeominingEC" />
      <meta name="twitter:creator" content="@GeominingEC" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={metaImage} />
      <meta name="twitter:image:alt" content={metaImageAlt} />

      {/* Geo Tags for Local & Regional SEO */}
      <meta name="geo.region" content="LR-MO" />
      <meta name="geo.placename" content="Monrovia, Sinkor, Liberia" />
      <meta name="geo.position" content="6.2899299;-10.7685852" />
      <meta name="ICBM" content="6.2899299, -10.7685852" />

      {/* Primary Schema.org Structured Data */}
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}

      {/* FAQPage Structured Data for Answer Engine Optimization (AEO) */}
      {faqSchema && (
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      )}
    </Helmet>
  );
};

export default SEO;
