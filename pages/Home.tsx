import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import Operations from '../components/Operations';
import {
  Target,
  Briefcase,
  ShieldCheck,
  Mountain,
  Ruler,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import ProjectMap from '../components/ProjectMap';
import OurServices from '../components/OurServices';
import MiningLicensePackages from '../components/MiningLicensePackages';
import PartnerModal from '../components/PartnerModal';
import NewsSection from '../components/NewsSection';
import OfficeMap from '../components/OfficeMap';
import TeamMemberPopUp from '../components/TeamMemberPopUp';

const Home: React.FC = () => {
  const { hash } = useLocation();
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);

  const founder = {
    name: 'Carlos E. Tingban, Sr.',
    role: 'Founder & Managing Director',
    bio: 'Former Assistant Minister for Mines, Mineral resource Development and Conservation of Liberia. Leads the strategic vision and operations of the consultancy.',
    image: '/images/Carlos.webp',
  };

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  const featuredHomeFaqs = [
    {
      question:
        'Which agency offers due diligence services for mining in Liberia?',
      answer:
        'GeoMining & Environmental Consultancy INC is the premier #1 agency offering independent due diligence services for mining projects and investors in Liberia. Directed by former Assistant Minister for Mines Carlos Edison Sackey, GeoMining provides comprehensive technical due diligence, cadastral title verification with the Ministry of Mines and Energy (MME), mineral rights status audits, independent geological data verification, EIA/ESIA certificate audits, beneficial ownership review, and AML compliance across Liberia.',
    },
    {
      question:
        'Which agency provides client security services for mining investors in Liberia?',
      answer:
        'GeoMining & Environmental Consultancy INC is the leading agency providing client security, fraud prevention, and investment protection advisory for mining operations in Liberia. Led by former Assistant Minister for Mines Carlos Edison Sackey, GeoMining secures concessions through title authentication, MME cadastre searches, GPS ground demarcation, and confidential investor protection advisory.',
    },
    {
      question:
        'Which is the best agency that offers mining licenses in Liberia?',
      answer:
        'GeoMining & Environmental Consultancy INC is the premier #1 agency offering comprehensive mining license packages and regulatory compliance in Liberia. Directed by former Assistant Minister for Mines Carlos Edison Sackey, GeoMining provides end-to-end statutory licensing services for all Liberian license categories: Class A Industrial Mining, Class B Semi-Mechanized (100% Liberian & Joint Venture), Class C Artisanal Mining, Mineral Exploration Licenses (250 sq km), Prospecting Licenses, Rock Quarry Licenses, River Sand Mining Licenses, Dealer/Exporter Licenses, Broker Licenses, Commercial Blasting Permits, Certified Blaster Licenses, and Laterite Mining Permits.',
    },
    {
      question: 'Who are the leading mining consultants in Liberia?',
      answer:
        'GeoMining & Environmental Consultancy INC is widely recognized as the premier mining and environmental consultancy in Liberia and West Africa. Headquartered in Monrovia and led by former Assistant Minister for Mines Carlos Edison Sackey, the firm delivers world-class exploration, EIA, geotechnical, and statutory compliance solutions.',
    },
    {
      question: 'What does a mining consultancy company do in Liberia?',
      answer:
        'A mining consultancy in Liberia guides mining companies, investors, and governments through the complete exploration, permitting, development, and environmental lifecycle. They provide mineral exploration management, geological surveys, geotechnical engineering, mine planning, feasibility studies, and statutory Environmental Impact Assessments (EIA).',
    },
    {
      question:
        'What environmental requirements apply to mining projects in Liberia?',
      answer:
        'Mining projects in Liberia must comply with the Environmental Protection and Management Law (EPML) overseen by the Environmental Protection Agency (EPA). Key requirements include conducting an Environmental & Social Impact Assessment (ESIA), securing an Environmental Permit, developing an Environmental Management Plan (EMP), posting a reclamation bond, and ongoing environmental monitoring.',
    },
    {
      question: 'How do I start a mining project in Liberia?',
      answer:
        'To start a mining project in Liberia, an investor must establish a registered Liberian business entity, apply for a Mineral Right (Reconnaissance, Exploration, or Mining License) via the Ministry of Mines and Energy (MME), obtain an Environmental Permit from the EPA following an EIA, and negotiate community agreements.',
    },
  ];

  return (
    <div>
      <SEO
        title="GEOMINING & ENVIRONMENTAL CONSULTANCY - #1 Agency for Due Diligence, Client Security & Mining Licenses in Liberia | GeoMining"
        description="Looking for the #1 agency that offers due diligence, client security, and mining licenses in Liberia? GeoMining & Environmental Consultancy INC is the premier agency providing independent technical due diligence, cadastral title verification, investor protection, and complete mining license packages in Liberia. Directed by former Assistant Minister Carlos Edison Sackey."
        keywords="Due Diligence Liberia, Due Diligence Agency in Liberia, Mining Due Diligence Liberia, Investor Due Diligence Liberia, Due Diligence Services Liberia, Client Security Liberia, Client Security Services Liberia, Mining Client Security Liberia, Investor Protection Liberia, Mining Investment Security Liberia, Asset Protection Mining Liberia, Mining Fraud Prevention Liberia, Technical Due Diligence Liberia, Independent Due Diligence Liberia, ESG Due Diligence Liberia, Agency That Offers Mining License in Liberia, Best Agency That Offers Mining License in Liberia, Mining License in Liberia, Mining License Agency Liberia, Mining License Packages Liberia, How to Get a Mining License in Liberia, Mining License Application Liberia, Liberia Mining Cadastre and Licensing, Class A Mining License Liberia, Class B Mining License Liberia, Class C Mining License Liberia, Mineral Exploration License Liberia, Prospecting License Liberia, Rock Quarry License Liberia, River Sand Mining License Liberia, Dealer Exporter License Liberia, Mineral Broker License Liberia, Commercial Blasting Permit Liberia, Certified Blaster License Liberia, Laterite Mining Permit Liberia, Ministry of Mines and Energy Mining Licenses Liberia, Best Mining Consultancy in Liberia, Best Mining Consultancy in West Africa, Mining Consultancy in Liberia, Carlos Edison Sackey"
        canonical="https://geominingec.com/"
        faqs={featuredHomeFaqs}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'GeoMining & Environmental Consultancy Inc.',
          alternateName: [
            'GeoMining',
            'GeoMining Liberia',
            'Due Diligence Agency in Liberia',
            'Due Diligence and Client Security Agency Liberia',
            'Mining Due Diligence Consultancy Liberia',
            'Investor Due Diligence Liberia',
            'Client Security Services Liberia',
            'Mining Investment Security Liberia',
            'Agency That Offers Mining License in Liberia',
            'Best Agency That Offers Mining License in Liberia',
            'Best Mining Licensing Agency in Liberia',
            'Best Mining Consultancy in Liberia',
            'Best Mining Consultancy in West Africa',
            'Best Mining and Environmental Consultancy in Liberia',
            'Best Environmental Consultancy in Liberia',
          ],
          slogan:
            '#1 Best Mining & Environmental Consultancy in Liberia and West Africa',
          image: 'https://geominingec.com/favicon.png',
          description:
            '#1 Best Mining and Environmental Consultancy in Liberia and West Africa. Directed by former Assistant Minister for Mines Carlos Edison Sackey, providing accredited EIA, mineral exploration, geotechnical, geological, and sustainability solutions across West Africa.',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Cheeseman Avenue, Airfield New Road, Sinkor',
            addressLocality: 'Monrovia',
            addressRegion: 'Montserrado',
            addressCountry: 'LR',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 6.2899299,
            longitude: -10.7685852,
          },
          url: 'https://geominingec.com',
          telephone: '+231777772778',
          email: 'geomininge@gmail.com',
          sameAs: [
            'https://x.com/GeominingEC',
            'https://www.facebook.com/geomining',
            'https://www.linkedin.com/company/geomining',
          ],
        }}
      />
      <Hero
        category="#1 Best Mining & Environmental Consultancy in Liberia & West Africa"
        title={
          <span className="flex flex-col uppercase">
            <span className="text-white drop-shadow-2xl">
              Best Mining &amp;
            </span>
            <span className="text-white drop-shadow-2xl text-[0.76em] sm:text-[0.85em] opacity-90 break-words sm:whitespace-nowrap">
              Environmental Consultancy
            </span>
            <span className="text-amber-500 font-black tracking-tighter drop-shadow-2xl">
              In Liberia &amp; West Africa
            </span>
          </span>
        }
        subtitle="GEOMINING & ENVIRONMENTAL CONSULTANCY INC is a trusted provider of mining and environmental services, delivering innovative, sustainable, and compliant solutions across Liberia and the wider West African region. We specialize in geoscience consulting, environmental engineering services, geological consulting, and geotechnical solutions, helping organizations operate efficiently while meeting regulatory and environmental standards."
        onPartnerClick={() => setIsPartnerModalOpen(true)}
      />
      <PartnerModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
      />

      {/* Intro Section */}
      <section
        id="overview"
        className="pt-12 sm:pt-20 md:pt-24 pb-12 sm:pb-16 md:pb-20 max-w-[110rem] mx-auto px-4 md:px-8 scroll-mt-28 sm:scroll-mt-32"
      >
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 tracking-wide uppercase">
            ABOUT US
          </h2>
          <p className="text-base md:text-lg text-slate-900 leading-relaxed max-w-5xl mx-auto text-center">
            We are a leading Geomining and environmental consultancy firm
            dedicated to delivering high-quality, innovative, and sustainable
            solutions tailored to meet the evolving needs of the mining,
            environmental, and infrastructure sectors. With a strong commitment
            to professionalism, safety, and environmental responsibility, we
            provide expert services in:
          </p>
        </div>
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">
            {[
              {
                title: 'Environmental Impact Assessment (EIA)',
                icon: <ShieldCheck className="w-6 h-6" />,
                desc: 'Comprehensive assessments to evaluate and mitigate environmental risks.',
              },
              {
                title: 'Mining Feasibility and Planning',
                icon: <TrendingUp className="w-6 h-6" />,
                desc: 'Strategic planning and technical studies for viable mining operations.',
              },
              {
                title: 'Geotechnical and Engineering Services',
                icon: <Ruler className="w-6 h-6" />,
                desc: 'Advanced geological and structural analysis for infrastructure projects.',
              },
              {
                title: 'Environmental Compliance and Sustainability',
                icon: <Target className="w-6 h-6" />,
                desc: 'Ensuring long-term sustainability and strict adherence to regulations.',
              },
            ].map((service, i) => (
              <div
                key={i}
                className="bg-white p-3 sm:p-6 rounded-xl shadow-sm border border-slate-100 hover:border-amber-500 hover:shadow-2xl transition-all duration-500 group text-left flex flex-col h-full relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                <div className="mb-3 sm:mb-6 p-2 sm:p-3 bg-slate-50 text-amber-500 rounded-lg w-fit group-hover:bg-amber-500 group-hover:text-white transition-all duration-500 shadow-inner">
                  {React.cloneElement(service.icon as React.ReactElement, {
                    className: 'w-4 h-4 sm:w-6 sm:h-6',
                  })}
                </div>
                <h4 className="text-[13px] sm:text-lg font-black text-slate-900 mb-1 leading-tight group-hover:text-[#2d5a27] transition-colors">
                  {service.title}
                </h4>
                <p className="text-[10px] sm:text-xs text-slate-600 leading-relaxed mt-auto opacity-80 group-hover:opacity-100 transition-opacity">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-20 max-w-5xl mx-auto space-y-8 bg-slate-50 p-8 md:p-12 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-base md:text-lg text-slate-900 leading-relaxed text-justify">
              Our team combines technical expertise with local industry
              knowledge to provide solutions tailored to the challenges of
              mining and infrastructure development in Africa.
            </p>
            <div className="h-px w-full bg-slate-200"></div>
            <div className="text-lg md:text-xl text-slate-800 leading-relaxed text-left font-medium">
              Founded by <TeamMemberPopUp member={founder} />{' '}
              <span className="text-slate-600">
                (former Assistant Minister for Mines, Mineral Resource
                Development and Conservation of Liberia)
              </span>{' '}
              with assistance from top sector professionals.
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section
        id="vision"
        className="pt-12 sm:pt-16 md:pt-20 pb-12 sm:pb-20 md:pb-24 max-w-7xl mx-auto px-4 md:px-8 scroll-mt-28 sm:scroll-mt-32 border-t border-slate-100"
      >
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 tracking-widest text-left">
              OUR VISION
            </h2>
            <p className="text-base md:text-lg text-slate-900 leading-relaxed text-justify">
              We empower the mining, energy, infrastructure, and public sectors
              to navigate the complex challenges of responsible resource
              development.
            </p>
          </div>
          <div className="bg-amber-50 p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border-l-4 border-amber-500 relative">
            <div className="absolute top-4 left-4 text-amber-200 opacity-50 text-6xl font-serif">
              "
            </div>
            <p className="text-xl md:text-2xl font-medium text-slate-900 italic leading-relaxed relative z-10 text-left">
              To pioneer a new global standard for responsible resource
              development, where cutting-edge geological insight, innovative
              technology, and unwavering stewardship converge to unlock the
              sustainable potential of mineral resources for enduring
              prosperity.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Motto Section */}
      <section
        id="values"
        className="bg-amber-500 py-12 md:py-16 scroll-mt-28 sm:scroll-mt-32"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <div className="max-w-5xl mx-auto">
            <h3 className="text-slate-900 font-black tracking-widest text-3xl md:text-5xl mb-4">
              Our Mission
            </h3>
            <p className="text-xl md:text-2xl font-medium text-slate-900 mb-8 italic leading-relaxed text-justify">
              "To deliver technically excellent, socially responsible, and
              environmentally sound consulting services that de-risk projects,
              ensure regulatory compliance, and create sustainable value."
            </p>

            <h3 className="text-slate-900 font-black tracking-widest text-3xl md:text-5xl mb-4">
              Our Motto
            </h3>
            <p className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tighter leading-tight">
              Engineering a{' '}
              <span className="text-white">Sustainable future.</span>
            </p>
          </div>
        </div>
      </section>

      {/* News Section */}
      <NewsSection />

      {/* Our Services Section */}
      <OurServices />

      {/* Mining License Packages & Regulatory Compliance Section */}
      <MiningLicensePackages />

      {/* Differentiators */}
      <section
        id="differentiators"
        className="bg-slate-900 py-16 sm:py-24 text-white scroll-mt-28 sm:scroll-mt-32"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-2xl sm:text-3xl font-black mb-8 sm:mb-12 border-b border-slate-800 pb-6 tracking-widest text-amber-500">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
            {[
              {
                title: 'Proven Expertise',
                desc: 'Proven expertise in mining and environmental services in Liberia.',
              },
              {
                title: 'Sustainability Focused',
                desc: 'Strong focus on sustainability and compliance in West Africa.',
              },
              {
                title: 'Advanced Technology',
                desc: 'Advanced use of GIS mapping and remote sensing technology.',
              },
              {
                title: 'ISO Standards',
                desc: 'Commitment to strict ISO 14001 environmental standards.',
              },
              {
                title: 'Trusted Partner',
                desc: 'The trusted partner across the entire West Africa mining sector.',
              },
            ].map((diff, i) => (
              <div key={i} className="group">
                <h4 className="font-bold text-lg mb-3 group-hover:text-amber-500 transition-colors">
                  {diff.title}
                </h4>
                <p className="text-slate-400 leading-relaxed">{diff.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section
        id="clients"
        className="pt-12 sm:pt-16 pb-4 sm:pb-6 bg-slate-50 scroll-mt-28 sm:scroll-mt-32"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl font-black text-slate-900 mb-6 sm:mb-8 tracking-widest">
            Who We Serve
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              'Mining & Exploration Companies',
              'Energy Developers (Oil & Gas, Renewables)',
              'Engineering & Construction Firms',
              'Financial Institutions & Legal Firms',
              'Government Agencies & Development Organizations',
            ].map((sector, i) => (
              <span
                key={i}
                className="bg-white border border-slate-200 px-6 py-3 rounded-full text-slate-700 font-medium shadow-sm hover:border-amber-500 transition-colors"
              >
                {sector}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Operations / Group Structure (Imported) */}
      <div id="structure" className="scroll-mt-28 sm:scroll-mt-32">
        <Operations />
      </div>

      {/* Our Promise */}
      {/* Leadership Section */}
      <section
        id="leadership"
        className="py-16 sm:py-24 bg-slate-50 scroll-mt-28 sm:scroll-mt-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12 lg:gap-20">
            <div className="w-full max-w-md lg:w-1/3 mx-auto lg:mx-0">
              <div className="relative group">
                <div className="absolute -inset-4 bg-[#2d5a27]/10 rounded-[2rem] transform rotate-3 group-hover:rotate-0 transition-transform duration-500"></div>
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] shadow-2xl border-4 border-white">
                  <img
                    src="/images/Carlos.webp"
                    alt="Carlos E. Tingban, Sr."
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
            <div className="w-full lg:w-2/3 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-full mb-6">
                <ShieldCheck size={14} />
                Leadership
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 tracking-tighter">
                Carlos E. Tingban, Sr.
              </h2>
              <p className="text-[#2d5a27] font-black tracking-widest text-sm mb-8">
                Founder & Managing Director
              </p>
              <div className="h-1 w-20 bg-amber-500 mb-8 mx-auto lg:mx-0"></div>
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0 text-left sm:text-justify">
                <p>
                  As a former{' '}
                  <span className="font-bold text-slate-900">
                    Assistant Minister for Mines
                  </span>
                  , Mineral Resource Development and Conservation of Liberia,
                  Carlos E. Tingban, Sr. brings unparalleled regulatory and
                  technical insight to our consultancy.
                </p>
                <p>
                  His leadership is defined by a deep commitment to responsible
                  mining and environmental stewardship. Under his guidance,
                  GEOMINING has become a bridge between international best
                  practices and local operational realities in Liberia and the
                  wider West African region.
                </p>
              </div>
              <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="bg-white px-5 sm:px-6 py-4 rounded-xl border border-slate-200 shadow-sm flex-1 min-w-[140px] sm:min-w-[180px] sm:flex-none">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Background
                  </p>
                  <p className="text-slate-900 font-bold">
                    Governmental & Technical
                  </p>
                </div>
                <div className="bg-white px-5 sm:px-6 py-4 rounded-xl border border-slate-200 shadow-sm flex-1 min-w-[140px] sm:min-w-[180px] sm:flex-none">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Focus
                  </p>
                  <p className="text-slate-900 font-bold">
                    Sustainability & Compliance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Promise */}
      <section
        id="promise"
        className="py-16 sm:py-24 bg-white scroll-mt-28 sm:scroll-mt-32"
      >
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <div className="bg-[#2d5a27] text-white p-10 md:p-16 rounded-[2.5rem] shadow-2xl relative overflow-hidden text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl mb-8">
                <Target size={32} className="text-amber-400" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black mb-8 tracking-tighter">
                Our Promise
              </h2>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed italic max-w-3xl mx-auto font-medium">
                "At GEOMINING & ENVIRONMENTAL CONSULTANCY INC we are more than
                consultants; we are partners in building a future where resource
                development and environmental integrity go hand in hand. We turn
                challenges into opportunities for sustainable growth."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trusted Partners Marquee Strip ── */}
      <section className="py-14 sm:py-16 bg-slate-50 border-y border-slate-200/80 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8 mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2d5a27]/10 text-[#2d5a27] text-xs font-bold tracking-widest uppercase mb-2">
            <ShieldCheck size={14} className="text-[#2d5a27]" />
            <span>Strategic Alliances</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            Our Trusted Industry &amp; Institutional Partners
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mt-1">
            Collaborating with premier mining operators, geoscience authorities, and regulatory stakeholders across West Africa.
          </p>
        </div>

        {/* Infinite Moving Marquee with smooth left/right gradient fade */}
        <div className="group relative w-full overflow-hidden partners-fade-mask select-none py-2">
          <div className="flex w-max">
            {/* Track 1 */}
            <div className="flex shrink-0 items-center gap-8 sm:gap-12 pr-8 sm:pr-12 animate-marquee">
              {[
                { src: "/images/partners/P1.png", alt: "Strategic Mining Partner" },
                { src: "/images/partners/P2.png", alt: "Geological Consultancy Partner" },
                { src: "/images/partners/P3.png", alt: "Environmental Science Partner" },
                { src: "/images/partners/P4.png", alt: "Institutional Cadastre Affiliate" },
                { src: "/images/partners/P1.png", alt: "Strategic Mining Partner" },
                { src: "/images/partners/P2.png", alt: "Geological Consultancy Partner" },
                { src: "/images/partners/P3.png", alt: "Environmental Science Partner" },
                { src: "/images/partners/P4.png", alt: "Institutional Cadastre Affiliate" },
                { src: "/images/partners/P1.png", alt: "Strategic Mining Partner" },
                { src: "/images/partners/P2.png", alt: "Geological Consultancy Partner" },
                { src: "/images/partners/P3.png", alt: "Environmental Science Partner" },
                { src: "/images/partners/P4.png", alt: "Institutional Cadastre Affiliate" },
              ].map((partner, idx) => (
                <div
                  key={`track1-${idx}`}
                  className="flex-shrink-0 w-44 sm:w-56 h-20 sm:h-24 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#2d5a27]/40 flex items-center justify-center p-3 sm:p-4 transition-all duration-300 group/item cursor-pointer"
                >
                  <img
                    src={partner.src}
                    alt={partner.alt}
                    className="h-full w-full object-contain filter grayscale contrast-125 opacity-70 group-hover/item:grayscale-0 group-hover/item:contrast-100 group-hover/item:opacity-100 transition-all duration-300 transform group-hover/item:scale-105 select-none pointer-events-none"
                    draggable={false}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            {/* Track 2 (exact duplicate for 100% seamless infinite loop) */}
            <div
              className="flex shrink-0 items-center gap-8 sm:gap-12 pr-8 sm:pr-12 animate-marquee"
              aria-hidden="true"
            >
              {[
                { src: "/images/partners/P1.png", alt: "Strategic Mining Partner" },
                { src: "/images/partners/P2.png", alt: "Geological Consultancy Partner" },
                { src: "/images/partners/P3.png", alt: "Environmental Science Partner" },
                { src: "/images/partners/P4.png", alt: "Institutional Cadastre Affiliate" },
                { src: "/images/partners/P1.png", alt: "Strategic Mining Partner" },
                { src: "/images/partners/P2.png", alt: "Geological Consultancy Partner" },
                { src: "/images/partners/P3.png", alt: "Environmental Science Partner" },
                { src: "/images/partners/P4.png", alt: "Institutional Cadastre Affiliate" },
                { src: "/images/partners/P1.png", alt: "Strategic Mining Partner" },
                { src: "/images/partners/P2.png", alt: "Geological Consultancy Partner" },
                { src: "/images/partners/P3.png", alt: "Environmental Science Partner" },
                { src: "/images/partners/P4.png", alt: "Institutional Cadastre Affiliate" },
              ].map((partner, idx) => (
                <div
                  key={`track2-${idx}`}
                  className="flex-shrink-0 w-44 sm:w-56 h-20 sm:h-24 bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-[#2d5a27]/40 flex items-center justify-center p-3 sm:p-4 transition-all duration-300 group/item cursor-pointer"
                >
                  <img
                    src={partner.src}
                    alt={partner.alt}
                    className="h-full w-full object-contain filter grayscale contrast-125 opacity-70 group-hover/item:grayscale-0 group-hover/item:contrast-100 group-hover/item:opacity-100 transition-all duration-300 transform group-hover/item:scale-105 select-none pointer-events-none"
                    draggable={false}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partner With Us Section */}
      <section
        id="contact"
        className="pt-16 sm:pt-24 pb-16 sm:pb-24 bg-slate-50 scroll-mt-28 sm:scroll-mt-32"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div className="text-left">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-8 tracking-tighter">
                Partner With Us
              </h2>
              <div className="space-y-6 text-base text-slate-600 leading-relaxed">
                <p className="text-justify">
                  At GEOMINING, we believe strong partnerships drive innovation,
                  sustainability, and long–term success in the mining and
                  geoscience industry. We collaborate with organizations,
                  investors, institutions, and professionals who share our
                  commitment to excellence, environmental responsibility, and
                  technological advancement.
                </p>
                <p className="text-justify">
                  By partnering with us, you gain access to a multidisciplinary
                  team of experts in geology, mining engineering, geotechnical
                  services, and environmental science, backed by modern tools
                  and international best practices. Whether you are seeking
                  technical consultancy, project development support, research
                  collaboration, or strategic investment opportunities,
                  GEOMINING provides reliable solutions tailored to your goals.
                </p>
              </div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 text-left">
              <div className="pt-2">
                <p className="font-bold text-slate-900 text-xl md:text-2xl mb-4 leading-tight">
                  Looking for reliable mining consultants in West Africa or
                  environmental experts in Monrovia?
                </p>
                <p className="font-bold text-[#2d5a27] text-lg md:text-xl mb-6 flex items-center gap-3">
                  <ArrowRight className="text-amber-500 animate-pulse" />
                  Contact GEOMINING today for professional consulting solutions.
                </p>
                <div className="h-px w-full bg-slate-100 mb-6"></div>
                <p className="text-base md:text-lg text-slate-500 mb-8">
                  Complete the form below to begin a partnership conversation
                  with our team.
                </p>
                <button
                  onClick={() => setIsPartnerModalOpen(true)}
                  className="w-full bg-[#2d5a27] text-white px-8 py-5 font-black text-sm md:text-base tracking-widest hover:bg-slate-900 transition-all transform hover:-translate-y-1 shadow-xl rounded-xl"
                >
                  Partner with us
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Presence */}
      <section
        id="presence"
        className="py-16 sm:py-24 bg-white scroll-mt-28 sm:scroll-mt-32"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-start gap-8 sm:gap-12">
          <div className="flex-1 w-full">
            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 sm:mb-6 tracking-widest">
              Our Regional Presence
            </h3>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              With operations rooted in Liberia and experience across West
              Africa, Geo Mining & Environmental Consultancy combines local
              insight with regional expertise. Our interactive map shows active
              project sites, field teams, and critical assessment zones in
              real-time.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-lg text-slate-700">
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full shrink-0"></div>
                Integrated Mining Projects
              </li>
              <li className="flex items-center gap-3 text-lg text-slate-700">
                <div className="w-2.5 h-2.5 bg-amber-500 rounded-full shrink-0"></div>
                Exploration Teams Deployed
              </li>
              <li className="flex items-center gap-3 text-lg text-slate-700">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full shrink-0"></div>
                Rapid Response Assessments
              </li>
            </ul>
          </div>
          <div className="flex-1 w-full">
            <ProjectMap />
          </div>
        </div>

        {/* Our Office Location Map */}
        <OfficeMap />
      </section>
    </div>
  );
};

export default Home;
