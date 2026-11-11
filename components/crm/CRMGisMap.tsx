import React, { useState, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  Circle,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  MapPin,
  Layers,
  Filter,
  Compass,
  Building2,
  FileCheck2,
  CheckCircle2,
  Clock,
  Printer,
  ChevronRight,
  Maximize2,
  Eye,
  Shield,
  Award,
} from 'lucide-react';
import { crmService } from '../../lib/crmService';
import { MiningLicense, CompanyRecord } from '../../types/crm';
import { CRMOfficialDossierModal } from './CRMOfficialDossierModal';

// County Centroids & Mineral Profiles for the 15 Counties of Liberia
export interface CountyGisData {
  name: string;
  lat: number;
  lng: number;
  majorMinerals: string[];
  description: string;
}

export const LIBERIAN_COUNTIES_GIS: CountyGisData[] = [
  {
    name: 'Montserrado',
    lat: 6.3156,
    lng: -10.8074,
    majorMinerals: ['River Sand', 'Aggregates', 'Commercial Granite'],
    description: 'Capital jurisdiction & central mineral trading hub (Monrovia).',
  },
  {
    name: 'Nimba',
    lat: 7.3621,
    lng: -8.7183,
    majorMinerals: ['Iron Ore', 'Gold', 'Base Metals'],
    description: 'World-class high-grade hematite deposits (Mount Nimba & Tokadeh).',
  },
  {
    name: 'Bong',
    lat: 7.0000,
    lng: -9.5000,
    majorMinerals: ['Iron Ore', 'Gold', 'Diamonds'],
    description: 'Historic Bong Mines magnetite formations & alluvial gold belts.',
  },
  {
    name: 'Lofa',
    lat: 8.4219,
    lng: -9.7478,
    majorMinerals: ['Gold', 'Diamonds', 'Iron Ore'],
    description: 'Northern frontier with Wologizi Range iron ore & rich diamond gravels.',
  },
  {
    name: 'Grand Bassa',
    lat: 5.8808,
    lng: -10.0467,
    majorMinerals: ['Heavy Mineral Sands', 'Aggregates', 'Gold'],
    description: 'Commercial mineral export gateway (Port of Buchanan) & river placers.',
  },
  {
    name: 'Grand Cape Mount',
    lat: 6.7533,
    lng: -11.3681,
    majorMinerals: ['Gold', 'Diamonds', 'Heavy Sands'],
    description: 'Western industrial gold belt (Bea Mountain & New Liberty concessions).',
  },
  {
    name: 'Grand Gedeh',
    lat: 6.0667,
    lng: -8.1333,
    majorMinerals: ['Gold', 'Iron Ore', 'Coltan'],
    description: 'Eastern greenstone belt holding Putu Range & artisanal gold corridors.',
  },
  {
    name: 'Sinoe',
    lat: 5.0111,
    lng: -9.0389,
    majorMinerals: ['Gold', 'Heavy Mineral Sands', 'Diamonds'],
    description: 'Southeastern coastal deposits & Dugbe multi-million ounce gold trend.',
  },
  {
    name: 'Maryland',
    lat: 4.3750,
    lng: -7.7169,
    majorMinerals: ['Gold', 'Ilmenite', 'Zircon'],
    description: 'Coastal placer deposits along the Atlantic & Cavalla River basin.',
  },
  {
    name: 'Margibi',
    lat: 6.5317,
    lng: -10.3536,
    majorMinerals: ['Rock Quarry', 'Laterite', 'River Sand'],
    description: 'Key infrastructure stone aggregate & laterite quarrying zones.',
  },
  {
    name: 'Rivercess',
    lat: 5.4578,
    lng: -9.5889,
    majorMinerals: ['Diamonds', 'Gold', 'Timber/Minerals'],
    description: 'Alluvial diamond waterways along Cestos River drainage systems.',
  },
  {
    name: 'Gbarpolu',
    lat: 7.0667,
    lng: -10.4833,
    majorMinerals: ['Gold', 'Diamonds'],
    description: 'Henry Town & Weasua diamondiferous kimberlitic indicator gravels.',
  },
  {
    name: 'Bomi',
    lat: 6.8708,
    lng: -10.8211,
    majorMinerals: ['Iron Ore', 'Gold', 'Dimension Stone'],
    description: 'Historic Bomi Hills iron ore mines & Western cluster concessions.',
  },
  {
    name: 'River Gee',
    lat: 5.1972,
    lng: -7.8767,
    majorMinerals: ['Gold', 'Base Metals'],
    description: 'Fish Town greenstone belt with growing artisanal & exploration interest.',
  },
  {
    name: 'Grand Kru',
    lat: 4.6739,
    lng: -8.2331,
    majorMinerals: ['Gold', 'Titanium Heavy Sands', 'Rutile'],
    description: 'Southern coastline titanium-bearing beach placers & primary gold.',
  },
];

// Seed Concessions if licenses are still in setup phase
const SEED_CADASTRE_CONCESSIONS: MiningLicense[] = [
  {
    id: 'lic-geo-01',
    licenseNumber: 'MEL-2026-NIM-081',
    category: 'Class A – Industrial Mining License',
    companyId: 'comp-101',
    companyName: 'Nimba Western Iron Ore Corp.',
    county: 'Nimba',
    district: 'Yekepa / Sanniquellie',
    concessionArea: '320 Sq. km',
    coordinates: '7.3621, -8.7183',
    issueDate: '2025-01-15',
    expiryDate: '2028-01-15',
    renewalStatus: 'current',
    statutoryFeeUSD: 125000,
    feePaymentStatus: 'paid',
    cadastralCode: 'LR-CAD-NIM-01',
    primaryCommodity: 'Iron Ore',
    complianceObligations: [],
    assignedInspector: 'Eric Kieh',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lic-geo-02',
    licenseNumber: 'MEL-2026-GCM-044',
    category: 'Class A – Industrial Mining License',
    companyId: 'comp-102',
    companyName: 'Cape Mount Gold Exploration Ltd.',
    county: 'Grand Cape Mount',
    district: 'Gola Konneh / Bea',
    concessionArea: '185 Sq. km',
    coordinates: '6.7533, -11.3681',
    issueDate: '2024-06-10',
    expiryDate: '2027-06-10',
    renewalStatus: 'current',
    statutoryFeeUSD: 95000,
    feePaymentStatus: 'paid',
    cadastralCode: 'LR-CAD-GCM-02',
    primaryCommodity: 'Gold',
    complianceObligations: [],
    assignedInspector: 'Eric Kieh',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lic-geo-03',
    licenseNumber: 'SML-2026-BONG-019',
    category: 'Class B – Semi-Mechanized Mining License',
    companyId: 'comp-103',
    companyName: 'Bong Valley Minerals & Gold Inc.',
    county: 'Bong',
    district: 'Fuamah / Bong Mines',
    concessionArea: '75 Sq. km',
    coordinates: '7.0000, -9.5000',
    issueDate: '2025-03-20',
    expiryDate: '2026-12-15',
    renewalStatus: 'expiring_soon',
    statutoryFeeUSD: 35000,
    feePaymentStatus: 'paid',
    cadastralCode: 'LR-CAD-BNG-03',
    primaryCommodity: 'Gold',
    complianceObligations: [],
    assignedInspector: 'Joshua Zayzay',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lic-geo-04',
    licenseNumber: 'AML-2026-LOF-088',
    category: 'Class C – Artisanal Mining License',
    companyId: 'comp-104',
    companyName: 'Lofa River Diamonds Cooperative',
    county: 'Lofa',
    district: 'Voinjama / Foya',
    concessionArea: '25 Hectares',
    coordinates: '8.4219, -9.7478',
    issueDate: '2025-02-01',
    expiryDate: '2026-11-20',
    renewalStatus: 'urgent',
    statutoryFeeUSD: 12000,
    feePaymentStatus: 'paid',
    cadastralCode: 'LR-CAD-LOF-04',
    primaryCommodity: 'Diamonds',
    complianceObligations: [],
    assignedInspector: 'Nathan Dolo',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lic-geo-05',
    licenseNumber: 'EXP-2026-SNO-012',
    category: 'Mineral Exploration License',
    companyId: 'comp-105',
    companyName: 'Sinoe Atlantic Heavy Sands Ltd.',
    county: 'Sinoe',
    district: 'Greenville Placer Corridor',
    concessionArea: '140 Sq. km',
    coordinates: '5.0111, -9.0389',
    issueDate: '2024-11-15',
    expiryDate: '2027-11-15',
    renewalStatus: 'current',
    statutoryFeeUSD: 45000,
    feePaymentStatus: 'paid',
    cadastralCode: 'LR-CAD-SNO-05',
    primaryCommodity: 'Heavy Mineral Sands' as any,
    complianceObligations: [],
    assignedInspector: 'James Godson',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'lic-geo-06',
    licenseNumber: 'MEL-2026-GGD-007',
    category: 'Class A – Industrial Mining License',
    companyId: 'comp-106',
    companyName: 'Putu Range Iron & Gold Resources',
    county: 'Grand Gedeh',
    district: 'Putu Mountain / Zwedru',
    concessionArea: '210 Sq. km',
    coordinates: '6.0667, -8.1333',
    issueDate: '2025-04-10',
    expiryDate: '2028-04-10',
    renewalStatus: 'current',
    statutoryFeeUSD: 110000,
    feePaymentStatus: 'paid',
    cadastralCode: 'LR-CAD-GGD-06',
    primaryCommodity: 'Iron Ore',
    complianceObligations: [],
    assignedInspector: 'Eric Kieh',
    updatedAt: new Date().toISOString(),
  },
];

// Helper component to center map on selection
const MapRecenter: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

// Create Custom Leaflet DivIcon with Tailwind classes
const createConcessionPin = (category: string, commodity: string) => {
  let bgColor = 'bg-amber-500';
  let ringColor = 'ring-amber-400';
  let label = 'A';

  if (category.includes('Class A')) {
    bgColor = 'bg-amber-500';
    ringColor = 'ring-amber-300';
    label = 'A';
  } else if (category.includes('Class B')) {
    bgColor = 'bg-[#2a602f]';
    ringColor = 'ring-emerald-300';
    label = 'B';
  } else if (category.includes('Class C')) {
    bgColor = 'bg-blue-600';
    ringColor = 'ring-blue-300';
    label = 'C';
  } else if (category.includes('Exploration')) {
    bgColor = 'bg-purple-600';
    ringColor = 'ring-purple-300';
    label = 'EXP';
  } else {
    bgColor = 'bg-teal-600';
    ringColor = 'ring-teal-300';
    label = 'Q';
  }

  const html = `
    <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer group">
      <span class="absolute inline-flex h-8 w-8 animate-ping rounded-full ${bgColor} opacity-30"></span>
      <div class="relative w-8 h-8 rounded-full ${bgColor} text-white font-black text-[10px] flex items-center justify-center shadow-lg ring-2 ${ringColor} ring-offset-1 border border-white">
        ${label}
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-concession-marker',
    html,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

export const CRMGisMap: React.FC = () => {
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedCommodity, setSelectedCommodity] = useState<string>('all');
  const [mapCenter, setMapCenter] = useState<[number, number]>([6.4281, -9.4295]);
  const [mapZoom, setMapZoom] = useState<number>(7.5);
  const [dossierLicense, setDossierLicense] = useState<MiningLicense | null>(null);
  const [tileLayerType, setTileLayerType] = useState<'streets' | 'satellite' | 'terrain'>('streets');

  // Pull live licenses or fallback to seed cadastre data
  const liveLicenses = crmService.getLicenses();
  const allConcessions = useMemo(() => {
    return liveLicenses.length > 0 ? liveLicenses : SEED_CADASTRE_CONCESSIONS;
  }, [liveLicenses]);

  // Filter concessions
  const filteredConcessions = useMemo(() => {
    return allConcessions.filter((c) => {
      if (selectedCounty !== 'all' && c.county.toLowerCase() !== selectedCounty.toLowerCase()) {
        return false;
      }
      if (selectedClass !== 'all') {
        if (selectedClass === 'Class A' && !c.category.includes('Class A')) return false;
        if (selectedClass === 'Class B' && !c.category.includes('Class B')) return false;
        if (selectedClass === 'Class C' && !c.category.includes('Class C')) return false;
        if (selectedClass === 'Exploration' && !c.category.includes('Exploration')) return false;
      }
      if (selectedCommodity !== 'all') {
        if (!c.primaryCommodity?.toLowerCase().includes(selectedCommodity.toLowerCase())) {
          return false;
        }
      }
      return true;
    });
  }, [allConcessions, selectedCounty, selectedClass, selectedCommodity]);

  // Handle county zoom
  const handleCountySelect = (countyName: string) => {
    setSelectedCounty(countyName);
    if (countyName === 'all') {
      setMapCenter([6.4281, -9.4295]);
      setMapZoom(7.5);
    } else {
      const county = LIBERIAN_COUNTIES_GIS.find((c) => c.name.toLowerCase() === countyName.toLowerCase());
      if (county) {
        setMapCenter([county.lat, county.lng]);
        setMapZoom(9);
      }
    }
  };

  // Tile layer configuration
  const tileLayers = {
    streets: {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye',
    },
    terrain: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors',
    },
  };

  return (
    <div className="space-y-6 font-['Outfit',sans-serif] animate-in fade-in duration-300">
      {/* ─── Header & Strategic Overview ──────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
            <span>Republic of Liberia Cadastre</span>
            <span>›</span>
            <span>Spatial Concession Analytics</span>
            <span>›</span>
            <span className="text-[#2a602f] font-black">Interactive GIS Map</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Compass className="text-[#2a602f]" size={28} />
            <span>Liberia Concession GIS Map</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Live spatial inspection across all 15 counties: Industrial Class A, Semi-Mechanized Class B, Artisanal Class C &amp; Mineral Exploration boundaries
          </p>
        </div>

        {/* Quick Concession Statistics */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-2 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-700">Class A Industrial:</span>
            <span className="text-xs font-black text-slate-900">
              {allConcessions.filter((c) => c.category.includes('Class A')).length}
            </span>
          </div>

          <div className="px-3 py-2 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2a602f]"></span>
            <span className="text-xs font-bold text-slate-700">Class B &amp; C:</span>
            <span className="text-xs font-black text-slate-900">
              {allConcessions.filter((c) => c.category.includes('Class B') || c.category.includes('Class C')).length}
            </span>
          </div>

          <div className="px-3 py-2 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
            <span className="text-xs font-bold text-slate-700">Exploration:</span>
            <span className="text-xs font-black text-slate-900">
              {allConcessions.filter((c) => c.category.includes('Exploration')).length}
            </span>
          </div>
        </div>
      </div>

      {/* ─── Map Filter & Layer Control Bar ───────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* County Selector */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              County Location
            </label>
            <select
              value={selectedCounty}
              onChange={(e) => handleCountySelect(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">All 15 Liberian Counties</option>
              {LIBERIAN_COUNTIES_GIS.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name} County
                </option>
              ))}
            </select>
          </div>

          {/* Concession Class */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Concession Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">All License Classes</option>
              <option value="Class A">Class A – Industrial Mining</option>
              <option value="Class B">Class B – Semi-Mechanized</option>
              <option value="Class C">Class C – Artisanal</option>
              <option value="Exploration">Mineral Exploration</option>
            </select>
          </div>

          {/* Commodity Filter */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              Primary Mineral Ore
            </label>
            <select
              value={selectedCommodity}
              onChange={(e) => setSelectedCommodity(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
            >
              <option value="all">All Commodities</option>
              <option value="Gold">Gold (Au)</option>
              <option value="Iron Ore">Iron Ore (Fe)</option>
              <option value="Diamonds">Diamonds (C)</option>
              <option value="Heavy Mineral Sands">Heavy Mineral Sands</option>
            </select>
          </div>
        </div>

        {/* Tile Basemap Layer Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setTileLayerType('streets')}
            className={`px-3 py-1 rounded-xl transition-all ${
              tileLayerType === 'streets'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Cadastre
          </button>
          <button
            onClick={() => setTileLayerType('satellite')}
            className={`px-3 py-1 rounded-xl transition-all ${
              tileLayerType === 'satellite'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setTileLayerType('terrain')}
            className={`px-3 py-1 rounded-xl transition-all ${
              tileLayerType === 'terrain'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Topographic
          </button>
        </div>
      </div>

      {/* ─── Interactive Map & Side Corridor Panel ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Leaflet Map Container (8 cols on large screens) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl relative min-h-[520px] h-[640px] flex flex-col">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            scrollWheelZoom={true}
            className="w-full h-full z-0"
            style={{ height: '100%', minHeight: '520px' }}
          >
            <MapRecenter center={mapCenter} zoom={mapZoom} />
            <TileLayer
              attribution={tileLayers[tileLayerType].attribution}
              url={tileLayers[tileLayerType].url}
            />

            {/* County Boundary Approximate Circles */}
            {LIBERIAN_COUNTIES_GIS.map((county) => (
              <Circle
                key={county.name}
                center={[county.lat, county.lng]}
                radius={22000}
                pathOptions={{
                  color: selectedCounty.toLowerCase() === county.name.toLowerCase() ? '#2a602f' : '#64748b',
                  fillColor: selectedCounty.toLowerCase() === county.name.toLowerCase() ? '#2a602f' : '#94a3b8',
                  fillOpacity: selectedCounty.toLowerCase() === county.name.toLowerCase() ? 0.15 : 0.05,
                  weight: 1.5,
                  dashArray: '4, 4',
                }}
              >
                <Tooltip direction="center" offset={[0, 0]} opacity={0.8} permanent={false}>
                  <div className="text-center font-bold text-xs">
                    {county.name} County
                    <span className="block text-[10px] text-slate-500 font-normal">
                      {county.majorMinerals.join(', ')}
                    </span>
                  </div>
                </Tooltip>
              </Circle>
            ))}

            {/* Concession Markers */}
            {filteredConcessions.map((concession) => {
              // Parse coordinates or fallback to county centroid
              let lat = 6.4281;
              let lng = -9.4295;
              if (concession.coordinates) {
                const parts = concession.coordinates.split(',').map((p) => parseFloat(p.trim()));
                if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                  lat = parts[0];
                  lng = parts[1];
                }
              } else {
                const countyMatch = LIBERIAN_COUNTIES_GIS.find(
                  (c) => c.name.toLowerCase() === concession.county.toLowerCase()
                );
                if (countyMatch) {
                  lat = countyMatch.lat;
                  lng = countyMatch.lng;
                }
              }

              const markerIcon = createConcessionPin(concession.category, concession.primaryCommodity || '');

              return (
                <Marker key={concession.id} position={[lat, lng]} icon={markerIcon}>
                  <Popup className="custom-concession-popup">
                    <div className="p-3 max-w-xs font-['Outfit',sans-serif]">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                        <span className="font-mono text-[10px] font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                          {concession.licenseNumber}
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            concession.renewalStatus === 'current'
                              ? 'bg-emerald-100 text-emerald-800'
                              : concession.renewalStatus === 'urgent'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {concession.renewalStatus}
                        </span>
                      </div>

                      <h4 className="font-bold text-xs text-slate-900 mb-1 leading-snug">
                        {concession.companyName}
                      </h4>
                      <div className="text-[11px] text-slate-600 mb-1">
                        <strong>Category:</strong> {concession.category}
                      </div>
                      <div className="text-[11px] text-slate-600 mb-1">
                        <strong>County:</strong> {concession.county}
                        {concession.district ? ` • ${concession.district}` : ''}
                      </div>
                      <div className="text-[11px] text-slate-600 mb-1">
                        <strong>Ore:</strong> {concession.primaryCommodity || 'Multi-Commodity'}
                      </div>
                      <div className="text-[11px] text-slate-600 mb-2">
                        <strong>Concession Area:</strong> {concession.concessionArea}
                      </div>

                      <button
                        onClick={() => setDossierLicense(concession)}
                        className="w-full py-1.5 px-3 rounded-xl bg-[#2a602f] hover:bg-[#235027] text-[#ffc30d] text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer mt-2"
                      >
                        <Printer size={13} />
                        <span>View Official Dossier</span>
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Map Floating Legend */}
          <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-3 shadow-lg text-xs space-y-1.5 max-w-xs">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-1">
              Concession Classes
            </span>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0"></span>
              <span className="text-[11px] text-slate-700">Class A – Industrial Mining</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#2a602f] shrink-0"></span>
              <span className="text-[11px] text-slate-700">Class B – Semi-Mechanized</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600 shrink-0"></span>
              <span className="text-[11px] text-slate-700">Class C – Artisanal</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-purple-600 shrink-0"></span>
              <span className="text-[11px] text-slate-700">Mineral Exploration License</span>
            </div>
          </div>
        </div>

        {/* Right Side: Concession List & County Directory (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-3xl p-5 shadow-xl flex flex-col justify-between max-h-[640px] overflow-hidden">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                  Mapped Concessions ({filteredConcessions.length})
                </h3>
                <p className="text-[11px] text-slate-400">Click a concession to inspect details &amp; GPS</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#2a602f] border border-emerald-200 text-[10px] font-bold">
                Live Cadastre
              </span>
            </div>

            {/* Scrollable list */}
            <div className="overflow-y-auto space-y-2.5 max-h-[500px] pr-1">
              {filteredConcessions.map((concession) => (
                <div
                  key={concession.id}
                  onClick={() => {
                    if (concession.coordinates) {
                      const parts = concession.coordinates.split(',').map((p) => parseFloat(p.trim()));
                      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                        setMapCenter([parts[0], parts[1]]);
                        setMapZoom(10);
                      }
                    } else {
                      const county = LIBERIAN_COUNTIES_GIS.find(
                        (c) => c.name.toLowerCase() === concession.county.toLowerCase()
                      );
                      if (county) {
                        setMapCenter([county.lat, county.lng]);
                        setMapZoom(10);
                      }
                    }
                  }}
                  className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {concession.licenseNumber}
                    </span>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        concession.renewalStatus === 'current'
                          ? 'bg-emerald-100 text-emerald-800'
                          : concession.renewalStatus === 'urgent'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {concession.renewalStatus}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#2a602f] transition-colors leading-snug">
                    {concession.companyName}
                  </h4>

                  <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <MapPin size={11} className="text-[#2a602f]" />
                      {concession.county} County
                    </span>
                    <span className="font-bold text-slate-700">{concession.primaryCommodity}</span>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-mono">
                      GPS: {concession.coordinates || 'Cadastral Grid'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDossierLicense(concession);
                      }}
                      className="text-[#2a602f] font-bold flex items-center gap-0.5 hover:underline"
                    >
                      <span>PDF Dossier</span>
                      <ChevronRight size={11} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Official Dossier Modal */}
      {dossierLicense && (
        <CRMOfficialDossierModal
          license={dossierLicense}
          onClose={() => setDossierLicense(null)}
        />
      )}
    </div>
  );
};

export default CRMGisMap;

