import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  Search,
  ArrowRight,
  ShieldCheck,
  FileText,
  Scale,
  Layers,
  FileCheck,
  Mail,
  Building2,
  Filter,
} from 'lucide-react';

export interface LicensePackage {
  id: number;
  number: string;
  title: string;
  category:
    | 'artisanal'
    | 'prospecting'
    | 'class-b'
    | 'exploration'
    | 'class-a'
    | 'quarry'
    | 'sand'
    | 'dealer-exporter'
    | 'broker'
    | 'blasting'
    | 'blaster'
    | 'laterite';
  categoryLabel: string;
  scope: string;
  ownership?:
    | '100% Liberian'
    | 'Liberian & Foreign'
    | 'Corporate / Industrial'
    | 'All Operators'
    | '100% Liberian & Joint Venture'
    | 'All Authorized Operators'
    | 'Certified Professionals'
    | 'Commercial Operators & Contractors';
  summaryBadge?: string;
  services: string[];
}

export const licensePackagesData: LicensePackage[] = [
  {
    id: 1,
    number: '01',
    title: 'Class C – Artisanal / Small-Scale Mining',
    category: 'artisanal',
    categoryLabel: 'Artisanal / Small-Scale',
    scope: '25 Acres',
    ownership: '100% Liberian',
    summaryBadge: 'Small-Scale Mining',
    services: [
      'Legal & Regulatory Compliance (Liberia Minerals & Mining Law)',
      'GIS Maps, Coordinates & Cadastral Block Demarcation',
      'Ministry of Mines & Energy (MME) Application & Clearances',
      'Local Mining Agent & County Authority Clearance',
      'Cadastral Ground Boundary Survey',
    ],
  },
  {
    id: 2,
    number: '02',
    title: 'Prospecting License',
    category: 'prospecting',
    categoryLabel: 'Prospecting & Reconnaissance',
    scope: '100 Acres',
    ownership: 'All Operators',
    summaryBadge: 'Target Truthing',
    services: [
      'Legal & Regulatory Compliance (Liberia MME Standards)',
      'GIS Maps, Coordinates & Cadastral Block Verification',
      'Prospecting Work Plan & Technical Program',
      'Prospecting Budget & Financial Estimation',
      'Community Engagement & Local Notice Plan',
    ],
  },
  {
    id: 3,
    number: '03',
    title: 'Class B – Semi-Mechanized / Medium-Scale',
    category: 'class-b',
    categoryLabel: 'Semi-Mechanized / Medium-Scale',
    scope: '100 Acres',
    ownership: '100% Liberian & Joint Venture',
    summaryBadge: 'National & Joint Venture',
    services: [
      'Legal & Regulatory Compliance (MME & Liberia Mining Law)',
      'GIS Cadastral Maps & Detailed Boundary Survey',
      'Prospecting Work Plan, Program & Sampling Budget',
      'Environmental Impact Assessment (EPA Standard)',
      'Semi-Mechanized Mining Work Plan & Financial Model',
      'MME Statutory Production & Royalty Reporting',
      'Community Development & Engagement Plan',
      'Occupational Health & Safety (OHS) Plan',
      'Mine Reclamation & Environmental Closure Plan',
    ],
  },
  {
    id: 4,
    number: '04',
    title: 'Mineral Exploration License',
    category: 'exploration',
    categoryLabel: 'Exploration & Advanced Geochem',
    scope: '250 Sq. km',
    ownership: 'All Operators',
    summaryBadge: 'Large-Scale Exploration',
    services: [
      'Legal & Statutory Compliance (MME Cadastre)',
      'Desk Study Review & Cadastral Concession Selection',
      'Application Filing (Article of Incorporation, Business Registration, Tax Clearance)',
      'Environmental & Social Impact Assessment (ESIA / EPA Permitting)',
      'Multi-Year Exploration Work Plan & Technical Budget',
      'Exploration Field Program (Geochem, Trenching/Pitting, Drilling, 3D Modeling)',
      'Quarterly Statutory Reports — 1st, 2nd & 3rd',
      'MME Annual Statutory Report',
      'Community & Resettlement Framework Plan',
      'Operational Health & Safety (OHS) System',
    ],
  },
  {
    id: 5,
    number: '05',
    title: 'Class A – Large-Scale / Industrial Mining',
    category: 'class-a',
    categoryLabel: 'Large-Scale / Industrial Mining',
    scope: 'Large Scale / Concession',
    ownership: 'Corporate / Industrial',
    summaryBadge: 'Industrial Concession',
    services: [
      'GIS Mapping (Advanced Aerial Survey, LiDAR & 3D Modeling)',
      'Mine Geology (Resource Estimation, Pit Mapping & Grade Control)',
      'Comprehensive Environmental & Social Impact Assessment (ESIA)',
      'Bankable Feasibility Study (BFS compliant with international standards)',
      'Mineral Development Agreement (MDA) Support & Financial Modeling',
      'Statutory MME & EPA Compliance Reporting',
      'Community Development Agreement (CDA) & Resettlement Action Plan',
      'Corporate Health, Safety & Environmental (HSE) Management System',
      'Progressive Mine Closure & Land Rehabilitation Plan',
    ],
  },
  {
    id: 6,
    number: '06',
    title: 'Rock Quarry License',
    category: 'quarry',
    categoryLabel: 'Rock Quarry & Aggregates',
    scope: '50 Acres',
    ownership: '100% Liberian & Joint Venture',
    summaryBadge: 'Commercial Aggregates',
    services: [
      'Legal & Regulatory Compliance (Liberia Ministry of Mines & Energy)',
      'GIS Cadastral Maps & Quarry Site Selection',
      'Resource Testing Work Plan, Testing Program & Budget',
      'Environmental Impact Assessment (EPA Standard)',
      'Commercial Quarry Mining Work Plan & Budget',
      'MME Statutory Quarry Reporting & Royalties',
      'Community Engagement & Haul Route Safety Plan',
      'Occupational Health & Safety (Bench Stability & Blast Safety)',
      'Environmental Reclamation & Quarry Closure Plan',
    ],
  },
  {
    id: 7,
    number: '07',
    title: 'River Sand Mining License',
    category: 'sand',
    categoryLabel: 'River Sand & Dredging',
    scope: '100 Acres',
    ownership: '100% Liberian & Joint Venture',
    summaryBadge: 'River Dredging & Extraction',
    services: [
      'Legal & Regulatory Compliance (MME River Sand Regulations)',
      'GIS Maps, Estuary/River Corridor & Cadastral Demarcation',
      'Bathymetric Survey & Sediment Volume Assessment',
      'Environmental Impact Assessment (EPA Standard)',
      'Dredging Operations Work Plan & Environmental Budget',
      'MME Statutory Dredging Reporting & Royalties',
      'Riparian Riverbank Protection & Hydrological Flow Plan',
      'Community Engagement & Waterway Navigation Safety',
      'Post-Dredging Riverbed Monitoring & Closure Plan',
    ],
  },
  {
    id: 8,
    number: '08',
    title: 'Dealer / Exporter License',
    category: 'dealer-exporter',
    categoryLabel: 'Precious Minerals Trading & Export',
    scope: 'Precious Minerals Trading & Export',
    ownership: 'All Authorized Operators',
    summaryBadge: 'Gold & Diamond Exporter',
    services: [
      'Legal & Regulatory Compliance (Liberia Ministry of Mines & Energy)',
      'Business Incorporation, LRA Tax Clearance & Article of Incorporation',
      'Kimberley Process Certification Scheme (KPCS) Compliance & Audits',
      'Central Bank of Liberia (CBL) Royalty & Financial Clearances',
      'Government Diamond Office (GDO) & National Assay Evaluation Protocols',
      'Cadastral Chain-of-Custody & Mineral Provenance Verification',
      'Anti-Money Laundering (AML) & Beneficial Ownership Filings',
      'Secure Vaulting, Armored Transport & Customs Export Clearances',
    ],
  },
  {
    id: 9,
    number: '09',
    title: 'Broker License',
    category: 'broker',
    categoryLabel: 'Precious Minerals Brokerage',
    scope: 'Mineral Intermediation & Brokerage',
    ownership: '100% Liberian',
    summaryBadge: 'Certified Mineral Broker',
    services: [
      'Legal & Regulatory Compliance (Liberia Minerals & Mining Law)',
      'Ministry of Mines & Energy (MME) Broker Licensing & Annual Accreditation',
      'Police Security Clearance & Character Vetting (Ministry of Justice)',
      'Biometric Registration & Official MME Broker Identification Badging',
      'Kimberley Process Traceability & Artisanal Mine Provenance Verification',
      'Liberia Revenue Authority (LRA) Tax Clearance & Compliance',
      'Official Trade Ledger Maintenance & Statutory Transaction Reporting',
      'Buyer-Seller Conveyance Advisory & Legitimate Trade Facilitation',
    ],
  },
  {
    id: 10,
    number: '10',
    title: 'Commercial Blasting Permit',
    category: 'blasting',
    categoryLabel: 'Commercial Blasting & Explosives',
    scope: 'Mine & Quarry Blasting Operations',
    ownership: 'Commercial Operators & Contractors',
    summaryBadge: 'Explosives & Blasting Authority',
    services: [
      'Statutory Compliance with MME Explosives Division & Ministry of Justice',
      'Liberia National Police (LNP) Security Clearances & Magazine Permitting',
      'Explosives Storage Magazine Inspection & Physical Security Plan',
      'Explosives Import, Transport Logistics & Security Escort Coordination',
      'Controlled Blast Design, Vibration Analysis & Flyrock Mitigation Plan',
      'Environmental Protection Agency (EPA) Environmental Clearance & Monitoring',
      'Community Warning Notices, Siren Protocols & Safety Buffer Mapping',
      'Post-Detonation Inspections, Inventory Audits & MME Logbook Filings',
    ],
  },
  {
    id: 11,
    number: '11',
    title: "Certified Blaster's License",
    category: 'blaster',
    categoryLabel: 'Certified Blaster Accreditation',
    scope: 'Certified Shotfirer / Blaster Operations',
    ownership: 'Certified Professionals',
    summaryBadge: 'Professional Blaster Certification',
    services: [
      'Regulatory Compliance with MME Inspectorate of Mines Standards',
      'Blaster Competency Verification & Practical Examination Coordination',
      'Ministry of Justice & Police National Security Background Vetting',
      'Certified Shotfirer Credentials, Initiation Systems & Priming Protocols',
      'Hazardous Explosive Materials Handling & Misfire Management Plans',
      'Workplace Health & Safety (OHS) & Blast-Zone Hazard Control',
      'Explosives Chain-of-Custody & Official Blasting Logbook Sign-Off',
      'Annual MME Recertification & Continuing Safety Assessment',
    ],
  },
  {
    id: 12,
    number: '12',
    title: 'Laterite (Literate) Mining Permit',
    category: 'laterite',
    categoryLabel: 'Laterite & Borrow Pit Operations',
    scope: 'Borrow Pit & Road Base Extraction',
    ownership: '100% Liberian & Joint Venture',
    summaryBadge: 'Civil & Construction Minerals',
    services: [
      'Legal & Regulatory Compliance (Liberia Ministry of Mines & Energy)',
      'GIS Cadastral Maps, GPS Coordinates & Borrow Pit Demarcation',
      'Geotechnical Testing & Laterite Compaction Suitability Assessment',
      'Environmental Impact Assessment (EIA) & EPA Statutory Clearance',
      'Excavation Work Plan, Extraction Schedule & Financial Budget',
      'Haul Road Traffic Management & Community Engagement Plan',
      'Occupational Health & Safety (Dust Suppression & Pit Slope Stability)',
      'Pit Reclamation, Regrading & Environmental Closure Plan',
    ],
  },
];

type FilterCategory =
  | 'all'
  | 'concessions-exploration'
  | 'quarry-materials'
  | 'trading-brokerage'
  | 'blasting-explosives';

const MiningLicensePackages: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs: { id: FilterCategory; label: string; count: number }[] = [
    { id: 'all', label: 'All Packages', count: 12 },
    {
      id: 'concessions-exploration',
      label: 'Concessions & Exploration',
      count: 5,
    },
    { id: 'quarry-materials', label: 'Quarry, Sand & Laterite', count: 3 },
    { id: 'trading-brokerage', label: 'Trading & Brokerage', count: 2 },
    { id: 'blasting-explosives', label: 'Blasting & Explosives', count: 2 },
  ];

  const filteredPackages = useMemo(() => {
    return licensePackagesData.filter((pkg) => {
      // Category filter
      let matchesCategory = true;
      if (selectedFilter === 'concessions-exploration') {
        matchesCategory =
          pkg.category === 'artisanal' ||
          pkg.category === 'prospecting' ||
          pkg.category === 'class-b' ||
          pkg.category === 'exploration' ||
          pkg.category === 'class-a';
      } else if (selectedFilter === 'quarry-materials') {
        matchesCategory =
          pkg.category === 'quarry' ||
          pkg.category === 'sand' ||
          pkg.category === 'laterite';
      } else if (selectedFilter === 'trading-brokerage') {
        matchesCategory =
          pkg.category === 'dealer-exporter' || pkg.category === 'broker';
      } else if (selectedFilter === 'blasting-explosives') {
        matchesCategory =
          pkg.category === 'blasting' || pkg.category === 'blaster';
      }

      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        pkg.title.toLowerCase().includes(q) ||
        pkg.scope.toLowerCase().includes(q) ||
        pkg.categoryLabel.toLowerCase().includes(q) ||
        (pkg.ownership && pkg.ownership.toLowerCase().includes(q)) ||
        pkg.services.some((s) => s.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedFilter, searchQuery]);

  return (
    <div className="bg-white">
      {/* ── SECTION 1: MINING LICENSE PACKAGES ── */}
      <section
        id="mining-licenses"
        className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200 scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Section Header */}
          <div className="max-w-3xl mb-12 sm:mb-16">
            <span className="text-amber-600 font-bold uppercase tracking-widest text-xs sm:text-sm mb-2 block">
              Statutory Permitting &amp; Licensing
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Mining License Packages
            </h2>
            <div className="h-1 w-20 bg-amber-500 rounded-full mt-4 mb-4"></div>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              GeoMining provides end-to-end statutory permitting and licensing
              services across all 12 categories recognized under the Liberia
              Minerals &amp; Mining Law. Each package includes complete legal,
              GIS cadastral, technical work program, and environmental
              deliverables required by the Ministry of Mines and Energy (MME) and
              the Environmental Protection Agency (EPA).
            </p>
          </div>

          {/* Corporate Value Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 pb-10 border-b border-slate-200">
            <div className="bg-white border border-slate-200 rounded-sm p-4">
              <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block mb-1">
                Statutory Coverage
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 block mb-1">
                12 Categories
              </span>
              <span className="text-xs text-slate-500">
                Artisanal to large-scale industrial
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-sm p-4">
              <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block mb-1">
                Regulatory Alignment
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 block mb-1">
                MME &amp; EPA
              </span>
              <span className="text-xs text-slate-500">
                100% compliant with Liberian law
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-sm p-4">
              <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block mb-1">
                Technical Precision
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 block mb-1">
                GIS Cadastre
              </span>
              <span className="text-xs text-slate-500">
                WGS84 boundary &amp; overlap checks
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-sm p-4">
              <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block mb-1">
                Leadership
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 block mb-1">
                Ministerial Insight
              </span>
              <span className="text-xs text-slate-500">
                Directed by former Assistant Minister
              </span>
            </div>
          </div>

          {/* Filter Bar & Quick Search */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {filterTabs.map((tab) => {
                const isActive = selectedFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedFilter(tab.id)}
                    className={`px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-sm transition-colors cursor-pointer flex items-center gap-2 ${
                      isActive
                        ? 'bg-slate-900 text-white font-bold'
                        : 'bg-white text-slate-700 hover:text-slate-950 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded-xs font-mono font-normal ${
                        isActive
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search packages or deliverables..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-sm pl-9 pr-8 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:ring-0 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 font-medium cursor-pointer"
                  aria-label="Clear search"
                >
                  &times;
                </button>
              )}
            </div>
          </div>

          {/* Package Cards Grid */}
          {filteredPackages.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-sm border border-slate-200">
              <Filter className="w-8 h-8 text-slate-400 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800 mb-1">
                No matching license packages found
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 mb-4">
                Try modifying your search criteria or selecting a different
                category.
              </p>
              <button
                onClick={() => {
                  setSelectedFilter('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-slate-900 text-white font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="bg-white border border-slate-200 rounded-sm p-6 sm:p-7 flex flex-col justify-between hover:border-slate-400 hover:shadow-xs transition-all duration-200"
                >
                  <div>
                    {/* Header: Package Code & Category */}
                    <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-100">
                      <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-xs border border-slate-200">
                        PKG-{pkg.number}
                      </span>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        {pkg.categoryLabel}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-slate-900 leading-snug mb-4">
                      {pkg.title}
                    </h3>

                    {/* Specification / Scope Strip */}
                    <div className="bg-slate-50 border border-slate-200/80 rounded-sm p-3 mb-5 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-0.5">
                          Permitted Scope
                        </span>
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">
                          {pkg.scope}
                        </span>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-0.5">
                          Statutory Eligibility
                        </span>
                        <span
                          className="font-bold text-amber-700 text-xs truncate block"
                          title={pkg.ownership}
                        >
                          {pkg.ownership || 'Authorized Entities'}
                        </span>
                      </div>
                    </div>

                    {/* Included Services List */}
                    <div className="mb-6">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center justify-between">
                        <span>Included Deliverables</span>
                        <span className="text-[11px] text-slate-500 font-normal">
                          ({pkg.services.length})
                        </span>
                      </h4>
                      <ul className="space-y-2">
                        {pkg.services.map((service, sIdx) => (
                          <li
                            key={sIdx}
                            className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed"
                          >
                            <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <span>{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Action Link */}
                  <div className="pt-4 border-t border-slate-100">
                    <Link
                      to={`/contact?package=${encodeURIComponent(pkg.title)}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-950 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors text-center"
                    >
                      <span>Inquire For Package</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── SECTION 2: REGULATORY COMPLIANCE & PERMITTING FRAMEWORK ── */}
      <section
        id="regulatory-compliance"
        className="py-16 sm:py-24 bg-white border-t border-slate-200 scroll-mt-24"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Section Header */}
          <div className="max-w-3xl mb-14 sm:mb-16">
            <span className="text-amber-600 font-bold uppercase tracking-widest text-xs sm:text-sm mb-2 block">
              Statutory Governance &amp; Permitting
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Regulatory Compliance Framework
            </h2>
            <div className="h-1 w-20 bg-amber-500 rounded-full mt-4 mb-4"></div>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Operating in Liberia requires strict adherence to statutory
              mandates spanning mining law, environmental protection, community
              development, and fiscal responsibilities. GeoMining structures and
              manages all regulatory interactions, ensuring that every
              concession operates with unassailable statutory standing.
            </p>
          </div>

          {/* Part A: 4-Stage Statutory Licensing Procedure */}
          <div className="mb-16">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
              Statutory Licensing Procedure
            </h3>
            <p className="text-sm text-slate-600 mb-8 max-w-2xl">
              A structured, sequential process from initial polygon selection
              through official ministerial gazetting and operational compliance.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-50 border border-slate-200 rounded-sm p-6 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-amber-600 uppercase tracking-widest block mb-2">
                    Stage 01
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mb-2">
                    Cadastral Verification
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Coordinate validation and ground demarcation with the
                    Ministry of Mines &amp; Energy (MME) Mining Cadastre Office.
                    Ensures absence of conflicting mineral rights or overlap.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 font-medium">
                  Deliverable: Cadastral Clearance Certificate
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-sm p-6 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-amber-600 uppercase tracking-widest block mb-2">
                    Stage 02
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mb-2">
                    Technical Program
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Formulation of the mandatory multi-year technical work plan,
                    sampling program, equipment deployment schedule, and minimum
                    financial expenditure commitments under Liberian law.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 font-medium">
                  Deliverable: Technical Work Plan &amp; Budget
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-sm p-6 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-amber-600 uppercase tracking-widest block mb-2">
                    Stage 03
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mb-2">
                    Environmental Scoping
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Preparation and defense of the Environmental &amp; Social
                    Impact Assessment (ESIA) or Environmental Management Plan
                    (EMP) before the Environmental Protection Agency (EPA).
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 font-medium">
                  Deliverable: EPA Environmental Permit
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-sm p-6 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-amber-600 uppercase tracking-widest block mb-2">
                    Stage 04
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mb-2">
                    Grant &amp; Stewardship
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    Execution of official ministerial license agreement,
                    Community Development Agreement (CDA) facilitation, and
                    statutory quarterly/annual reporting compliance.
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 font-medium">
                  Deliverable: Official Mining License &amp; CDA
                </div>
              </div>
            </div>
          </div>

          {/* Part B: Statutory Authorities & Governing Mandates */}
          <div className="mb-16">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
              Statutory Authorities &amp; Legal Mandates
            </h3>
            <p className="text-sm text-slate-600 mb-8 max-w-2xl">
              Compliance oversight in Liberia spans key governmental bodies,
              each with distinct regulatory purviews.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-4 h-4 text-slate-700" />
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Ministry of Mines (MME)
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Enforces the Minerals and Mining Law of 2000. Regulates
                  cadastral licensing, mineral development agreements (MDAs),
                  inspectorate oversight, and statutory royalty schedules.
                </p>
                <span className="text-[11px] font-semibold text-slate-500 block">
                  Mandate: Mineral Rights &amp; Cadastre
                </span>
              </div>

              <div className="p-6 bg-slate-50 border border-slate-200 rounded-sm">
                <div className="flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-4 h-4 text-slate-700" />
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Environmental Agency (EPA)
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Administers the Environmental Protection and Management Law
                  (EPML). Mandates certified ESIA assessments, environmental
                  audits, effluent monitoring, and mine closure bonds.
                </p>
                <span className="text-[11px] font-semibold text-slate-500 block">
                  Mandate: Ecological Clearances &amp; Audits
                </span>
              </div>

              <div className="p-6 bg-slate-50 border border-slate-200 rounded-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Scale className="w-4 h-4 text-slate-700" />
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Revenue Authority (LRA)
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Oversees annual concession surface rentals, withholding
                  taxes, corporate income tax clearances, and mineral export
                  royalty assessments prior to customs dispatch.
                </p>
                <span className="text-[11px] font-semibold text-slate-500 block">
                  Mandate: Fiscal Clearances &amp; Royalties
                </span>
              </div>

              <div className="p-6 bg-slate-50 border border-slate-200 rounded-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="w-4 h-4 text-slate-700" />
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Justice &amp; Police (LNP)
                  </h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  Enforces commercial explosives magazine security, blaster
                  competency credentials, and Kimberley Process origin
                  traceability for precious mineral conveyances.
                </p>
                <span className="text-[11px] font-semibold text-slate-500 block">
                  Mandate: Explosives &amp; Security Vetting
                </span>
              </div>
            </div>
          </div>

          {/* Part C: Mandatory Documentation Checklist */}
          <div className="mb-16">
            <div className="bg-slate-50 border border-slate-200 rounded-sm p-6 sm:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                    Mandatory Documentation Checklist
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Statutory documentation assembled and vetted by GeoMining
                    for license applicants.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-sm w-fit">
                  Standard Statutory File
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <FileCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Articles of Incorporation:</strong> Certified copy
                      registered with the Liberia Business Registry (LBR).
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <FileCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>LRA Tax Clearance:</strong> Valid tax certificate
                      demonstrating compliance with Liberian fiscal mandates.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <FileCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>WGS84 Coordinates:</strong> Official GIS cadastral
                      polygon demarcation without overlapping concession claims.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <FileCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Technical Work Program:</strong> Detailed multi-year
                      exploration or extraction plan with itemized budgets.
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <FileCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>EPA Environmental Permit:</strong> Accredited ESIA
                      or EMP certification with approved mitigation schedules.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <FileCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Community Endorsements:</strong> County authority
                      clearances and Community Development Agreement (CDA) draft.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <FileCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Financial Competence Evidence:</strong> Bank
                      guarantee, audited statements, or environmental escrow
                      provisions.
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <FileCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Beneficial Ownership Declaration:</strong> Anti-Money
                      Laundering (AML) filings and corporate director vetting.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Part D: Executive Advisory Banner */}
          <div className="bg-slate-900 text-white rounded-sm p-8 sm:p-10 border border-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2">
                <span className="text-amber-400 font-mono text-xs font-bold uppercase tracking-widest block mb-2">
                  Institutional Advisory Support
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug mb-3">
                  Statutory Representation &amp; Ministerial Advisory
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                  Led by Carlos Edison Sackey, Former Assistant Minister for
                  Mines, Mineral Resource Development and Conservation of
                  Liberia. GeoMining provides authoritative advisory for foreign
                  mining companies, institutional investors, and domestic
                  operators seeking reliable concession acquisition, statutory
                  defense, and independent due diligence.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Direct liaison with MME Cadastre &amp; EPA Directorate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Independent concession title &amp; boundary validation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>100% statutory clearance and compliance track record</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>Comprehensive dispute mitigation &amp; client security</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 lg:border-l lg:border-slate-800 lg:pl-8">
                <Link
                  to="/contact?subject=Regulatory%20Compliance%20Advisory"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-sm bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors text-center"
                >
                  <span>Request Advisory Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href="mailto:info@geominingec.com?subject=Inquiry%20regarding%20Mining%20License%20Packages"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-sm bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider border border-slate-700 transition-colors text-center"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Email Advisory Desk</span>
                </a>

                <p className="text-[11px] text-slate-400 text-center lg:text-left mt-1">
                  Confidential advisory across Liberia and West Africa.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MiningLicensePackages;
