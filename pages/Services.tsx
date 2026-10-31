import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import { useLocation, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import {
  CheckCircle2,
  Target,
  Pickaxe,
  Microscope,
  ClipboardCheck,
  Users,
  Search,
  HardHat,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const Services: React.FC = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [hash]);

  const detailedServices = [
    {
      id: 'consultancy',
      title: 'Geological Consultancy',
      description:
        'Comprehensive geological studies, feasibility assessments, and resource estimation to guide project development.',
      icon: Search,
    },
    {
      id: 'exploration',
      title: 'Exploration Services',
      description:
        'Mineral exploration including mapping, sampling, data analysis, and technical reporting for new discoveries.',
      icon: Microscope,
    },
    {
      id: 'mining',
      title: 'Mining Operations',
      description:
        'End-to-end mine development, operational planning, and processing execution.',
      icon: Pickaxe,
    },
    {
      id: 'esia',
      title: 'Environmental Impact (ESIA)',
      description:
        'Full Environmental and Social Impact Assessments ensuring regulatory compliance and sustainability.',
      icon: ClipboardCheck,
    },
    {
      id: 'community',
      title: 'Community Engagement',
      description:
        'Stakeholder management, Community Development Agreements (CDA), and social license to operate.',
      icon: Users,
    },
    {
      id: 'hse',
      title: 'HSE Management',
      description:
        'Health, Safety, and Environmental management systems implementation and oversight.',
      icon: HardHat,
    },
  ];

  const serviceCategories = [
    {
      id: 'discovery',
      title: '1. Discovery & Definition',
      description:
        'We identify and quantify mineral resources through comprehensive exploration and evaluation.',
      items: [
        'Geological & Exploration: Field mapping, geochemical/geophysical surveys (VLF, IP, Mag, CSAMT), drilling management, and 3D geological modeling.',
        'Resource Estimation: Independent calculation of Mineral Resources and Reserves compliant with international codes (NI 43-101/JORC).',
        '[LINK]/services/mining-geological|Learn more about our Mining & Geological Services',
      ],
    },
    {
      id: 'engineering',
      title: '2. Engineering & Design',
      description:
        'We transform resources into executable mine plans with a focus on safety, stability, and efficiency.',
      items: [
        'Mine Engineering: Open-pit and underground mine design, planning, scheduling, ventilation, and cost estimation (CAPEX/OPEX).',
        'Geotechnical Engineering: Slope stability, rock mechanics, tailings dam design, and foundation engineering.',
        'Infrastructure & Processing: Mine infrastructure design, metallurgical studies, and tailings management.',
        '[LINK]/services/geotechnical-engineering|Learn more about our Geotechnical & Engineering Services',
      ],
    },
    {
      id: 'esg',
      title: '3. Environmental, Social & Compliance (ESG)',
      description:
        'We secure the social license to operate and ensure strict regulatory compliance.',
      items: [
        'Dedicated Page|[LINK] Environmental Impact Assessment (EIA) Services|/services/environmental-impact-assessment',
        'Environmental Management: Comprehensive baseline assessments, monitoring, and Environmental Management Plans (EMP).',
        'Compliance & Permitting: Navigating Ministry of Mines and Energy and EPA regulatory approvals.',
        'Social Management: Community Development Agreements (CDA), stakeholder engagement, and resettlement action plans.',
      ],
    },
    {
      id: 'advisory',
      title: '4. Due Diligence, Client Security & Advisory',
      description:
        'We deliver independent technical due diligence, confidential client security, and strategic advisory for mining investors in Liberia.',
      items: [
        'Due Diligence & Cadastre Audits: Independent MME cadastral title verification, mineral rights validation, and concession overlap checks.',
        'Client Security & Fraud Prevention: Confidential investment protection, authentic title verification, regulatory risk profiling, and dispute prevention.',
        'Technical Studies & JORC Audits: Scoping studies, Pre-Feasibility (PFS), Definitive Feasibility Studies (DFS), and JORC/NI 43-101 resource reviews.',
        'ESG Due Diligence: Environmental & Social Impact audit, EPA permit standing, beneficial ownership analysis, and anti-money laundering (AML) checks.',
      ],
    },
  ];

  return (
    <div>
      <SEO
        title="Best Due Diligence, Client Security & Mining Services in Liberia | GeoMining"
        description="Looking for an agency that offers due diligence and client security in Liberia? GeoMining & Environmental Consultancy INC is the premier firm providing independent technical due diligence, client security advisory, investor protection, mineral exploration, EIA permitting, and turnkey mining license packages in Liberia."
        keywords="Due Diligence Liberia, Due Diligence Agency in Liberia, Mining Due Diligence Liberia, Investor Due Diligence Liberia, Due Diligence Services Liberia, Client Security Liberia, Client Security Services Liberia, Mining Client Security Liberia, Investor Protection Liberia, Mining Investment Security Liberia, Asset Protection Mining Liberia, Mining Fraud Prevention Liberia, Best Mining Consultancy in Liberia, Best Mining Consultancy in West Africa, Mining consultancy services Liberia, Mining consulting company Liberia, Environmental consulting company Liberia, Geological consulting company Liberia, Mining feasibility study Liberia, Mineral exploration services Liberia, Mining project assessment Liberia, Environmental impact assessment services Liberia, Environmental monitoring services Liberia, Mining permit consultancy Liberia, Mining regulatory compliance Liberia, Mine environmental management Liberia, Mining risk assessment Liberia, Geotechnical services Liberia, Hydrogeological services Liberia, Carlos Edison Sackey"
        canonical="https://geominingec.com/services"
      />
      <Hero
        title="Our Services"
        category="Expertise"
        subtitle="Delivering technical excellence across the entire mining lifecycle."
        showButtons={false}
        isFullHeight={false}
      />

      <section className="py-12 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 uppercase tracking-widest">
            Detailed Services
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-12">
            GEOMINING & ENVIRONMENTAL CONSULTANCY INC offers comprehensive
            mining and environmental consultancy services in Liberia and West
            Africa, supporting clients in achieving regulatory compliance,
            operational efficiency, and sustainable development.
          </p>
        </div>

        <div className="max-w-[90rem] mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {detailedServices.map((service, index) => (
            <div
              key={index}
              id={service.id}
              className="bg-slate-50 p-8 rounded-sm border border-slate-100 hover:border-amber-500 hover:shadow-md transition-all group"
            >
              <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:bg-amber-500 transition-colors">
                <service.icon
                  className="text-slate-700 group-hover:text-slate-900 transition-colors"
                  size={28}
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {service.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col lg:flex-row gap-8 md:gap-16">
          {/* Sidebar Navigation (Desktop) */}
          <div className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-28 bg-white p-6 rounded-sm shadow-sm border border-slate-100">
              <h3 className="font-bold text-lg mb-6 uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-4">
                Core Service Pillars
              </h3>
              <ul className="space-y-4">
                {serviceCategories.map((cat) => (
                  <li key={cat.id}>
                    <a
                      href={`#${cat.id}`}
                      className="block text-slate-600 hover:text-amber-500 hover:pl-2 transition-all text-sm font-medium truncate"
                      title={cat.title}
                    >
                      {cat.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-12 sm:space-y-20">
            <div className="mb-12">
              <h2 className="text-3xl font-black text-slate-900 mb-6 uppercase tracking-widest">
                Core Service Pillars
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                Our technical expertise is organized into four foundational
                pillars that support every stage of the mining value chain.
              </p>
            </div>

            {serviceCategories.map((cat) => (
              <div
                key={cat.id}
                id={cat.id}
                className="scroll-mt-28 bg-white p-6 sm:p-8 md:p-12 rounded-sm shadow-sm border-l-4 border-amber-500"
              >
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                  {cat.title}
                </h2>
                <p className="text-slate-500 mb-8 text-lg font-light italic">
                  {cat.description}
                </p>

                <ul className="grid grid-cols-1 gap-4">
                  {cat.items.map((item, idx) => {
                    const [title, desc] = item.includes(':')
                      ? item.split(':')
                      : [item, ''];
                    return (
                      <li
                        key={idx}
                        className="flex items-start gap-4 p-4 rounded-md bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <CheckCircle2
                          className="text-amber-500 shrink-0 mt-1"
                          size={20}
                        />
                        <div className="text-slate-700 leading-relaxed">
                          {title === '[LINK]' ? (
                            <a
                              href={desc.split('|')[0]}
                              className="text-amber-600 font-bold hover:underline inline-flex items-center gap-1"
                            >
                              {desc.split('|')[1]} &rarr;
                            </a>
                          ) : desc ? (
                            <>
                              <span className="font-bold block text-slate-900 mb-1">
                                {title}
                              </span>
                              {desc}
                            </>
                          ) : (
                            title
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AEO Knowledge & FAQ Callout */}
      <section className="py-12 bg-amber-500/10 border-y border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#2d5a27] text-white flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                Have Technical or Regulatory Questions?
              </h3>
              <p className="text-slate-600 text-sm sm:text-base">
                Explore our AEO Knowledge Hub for direct answers on mining
                permits, exploration phases, EIA standards, and project costs in
                Liberia.
              </p>
            </div>
          </div>
          <Link
            to="/faq"
            className="shrink-0 inline-flex items-center gap-2 bg-[#2d5a27] hover:bg-[#23471e] text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs shadow-md hover:shadow-lg transition-all"
          >
            <span>Visit AEO Knowledge Hub</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 sm:py-24 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <div className="inline-block p-4 bg-amber-500/10 text-amber-500 rounded-full mb-6">
            <Target size={40} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-8 uppercase tracking-widest text-amber-500">
            Value Proposition
          </h2>
          <p className="text-xl md:text-2xl font-light leading-relaxed italic text-slate-300">
            "GEOMINING & ENVIRONMENTAL CONSULTANCY INC is a single-source
            partner that de-risks mining projects by integrating deep technical
            expertise with robust environmental and social stewardship. We guide
            clients from the first soil sample to final reclamation, delivering
            certainty, sustainability, and value at every stage."
          </p>
        </div>
      </section>
    </div>
  );
};

export default Services;
