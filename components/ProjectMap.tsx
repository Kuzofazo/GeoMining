import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  RadioTower,
  Users,
  AlertTriangle,
  Layers,
  Map as MapIcon,
  Satellite,
} from 'lucide-react';

// Fix for default Leaflet icon issues in React
import L from 'leaflet';

// Custom Marker Icons using Lucide with high-visibility badge styling
const createCustomIcon = (
  icon: React.ReactNode,
  badgeBg: string,
  badgeBorder: string,
  textColor: string,
  pulseColor?: string
) => {
  const iconMarkup = renderToStaticMarkup(
    <div className="relative flex items-center justify-center cursor-pointer">
      {pulseColor && (
        <span
          className={`absolute -inset-1 rounded-full ${pulseColor} animate-ping opacity-60`}
        />
      )}
      <div
        className={`relative flex items-center justify-center w-8 h-8 rounded-full ${badgeBg} border-2 ${badgeBorder} ${textColor} shadow-lg shadow-black/40 transform transition-transform duration-200 hover:scale-125`}
      >
        {icon}
      </div>
    </div>
  );

  return divIcon({
    html: iconMarkup,
    className: 'custom-project-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
};

const towerIcon = createCustomIcon(
  <RadioTower size={16} />,
  'bg-slate-900',
  'border-emerald-500',
  'text-emerald-400',
  'bg-emerald-500/40'
);

const teamIcon = createCustomIcon(
  <Users size={16} />,
  'bg-slate-900',
  'border-amber-500',
  'text-amber-400',
  'bg-amber-500/40'
);

const alertIcon = createCustomIcon(
  <AlertTriangle size={16} />,
  'bg-slate-900',
  'border-rose-500',
  'text-rose-400',
  'bg-rose-500/50'
);

const locations = [
  // Active Sites (Green Towers)
  {
    id: 1,
    pos: [7.5, -8.5] as [number, number],
    name: 'Nimba Project',
    type: 'tower',
    status: 'Active',
    description: 'High-grade iron ore exploration and environmental monitoring',
  },
  {
    id: 2,
    pos: [6.8, -9.0] as [number, number],
    name: 'Bong Mines Ops',
    type: 'tower',
    status: 'Active',
    description: 'Operational audit, tailings management & ESIA compliance',
  },
  {
    id: 3,
    pos: [5.8, -9.8] as [number, number],
    name: 'Grand Bassa Setup',
    type: 'tower',
    status: 'Active',
    description: 'Coastal logistics and marine aggregate assessment',
  },
  {
    id: 4,
    pos: [6.0, -10.0] as [number, number],
    name: 'Western Cluster',
    type: 'tower',
    status: 'Active',
    description: 'Regional corridor geological surveying and licensing support',
  },
  {
    id: 5,
    pos: [5.5, -8.0] as [number, number],
    name: 'Sinoe Exploration',
    type: 'tower',
    status: 'Active',
    description: 'Greenfield gold and base metal reconnaissance',
  },

  // Teams (Yellow Users)
  {
    id: 6,
    pos: [6.2899, -10.7686] as [number, number],
    name: 'Monrovia HQ Team',
    type: 'team',
    status: 'Deployed',
    description: 'Executive management, GIS analysis & cadastral coordination',
  },
  {
    id: 7,
    pos: [5.9, -10.0] as [number, number],
    name: 'Buchanan Field Team',
    type: 'team',
    status: 'Deployed',
    description: 'Port facility environmental audit and water testing',
  },

  // Alerts / Critical (Red)
  {
    id: 8,
    pos: [7.0, -9.5] as [number, number],
    name: 'Gbarnga Site Assessment',
    type: 'alert',
    status: 'Critical',
    description: 'Urgent environmental baseline audit & tailings inspection',
  },
  {
    id: 9,
    pos: [4.5, -7.5] as [number, number],
    name: 'Harper Coastal Study',
    type: 'alert',
    status: 'Warning',
    description: 'Coastal erosion and artisanal mining impact survey',
  },
  {
    id: 10,
    pos: [8.0, -10.2] as [number, number],
    name: 'Voinjama Survey',
    type: 'alert',
    status: 'Pending',
    description: 'Pre-feasibility cross-border alluvial diamond evaluation',
  },
];

const DEFAULT_CENTER: [number, number] = [6.4281, -9.4295];
const DEFAULT_ZOOM = 7;

// Component to handle automatic container resizing
const MapController: React.FC = () => {
  const map = useMap();

  // Invalidate size on mount and on window resize to ensure full visibility
  useEffect(() => {
    map.invalidateSize();
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 500);

    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);

  return null;
};

type LayerType = 'satellite' | 'streets';

const ProjectMap: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<LayerType>('satellite');

  return (
    <div className="h-[380px] sm:h-[450px] md:h-[520px] w-full rounded-2xl overflow-hidden border-2 sm:border-4 border-slate-900 shadow-2xl relative z-0 bg-slate-900">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        minZoom={5}
        maxZoom={18}
        scrollWheelZoom={false}
        attributionControl={false}
        className="h-full w-full"
        style={{ height: '100%', width: '100%', minHeight: '380px' }}
      >
        <MapController />

        {/* Tile Layers based on user selection */}
        {activeLayer === 'satellite' && (
          <TileLayer
            attribution="&copy; Google Maps"
            url="https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            maxZoom={20}
          />
        )}

        {activeLayer === 'streets' && (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        )}

        {locations.map((loc) => (
          <Marker
            key={loc.id}
            position={loc.pos}
            icon={
              loc.type === 'tower'
                ? towerIcon
                : loc.type === 'team'
                  ? teamIcon
                  : alertIcon
            }
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-[200px] max-w-[260px]">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="font-black text-slate-900 text-sm leading-snug">
                    {loc.name}
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${loc.type === 'tower'
                        ? 'bg-emerald-100 text-emerald-800'
                        : loc.type === 'team'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                  >
                    {loc.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">
                  {loc.description}
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Lat: {loc.pos[0].toFixed(2)}°N</span>
                  <span>Lng: {Math.abs(loc.pos[1]).toFixed(2)}°W</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Top Controls: Layer Switcher */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-[1000] flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700 shadow-xl">
        <button
          onClick={() => setActiveLayer('satellite')}
          title="Satellite View"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeLayer === 'satellite'
              ? 'bg-[#2d5a27] text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
        >
          <Satellite size={14} />
          <span>Satellite</span>
        </button>

        <button
          onClick={() => setActiveLayer('streets')}
          title="Streets View"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeLayer === 'streets'
              ? 'bg-[#2d5a27] text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
        >
          <MapIcon size={14} />
          <span>Streets</span>
        </button>
      </div>

      {/* Legend Overlay - Responsive positioning and layout */}
      <div className="absolute bottom-2 left-2 w-fit max-w-[200px] sm:bottom-4 sm:left-4 sm:max-w-none bg-slate-900/95 p-2.5 sm:p-4 rounded-xl border border-slate-700/80 text-white z-[1000] shadow-2xl backdrop-blur-md">
        <h4 className="font-black uppercase tracking-widest mb-2 text-amber-400 text-[10px] sm:text-xs flex items-center gap-1.5">
          <Layers size={13} className="text-amber-400" />
          Operational Legend
        </h4>
        <div className="flex flex-col gap-y-1.5 sm:space-y-2 text-[9px] sm:text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
            <RadioTower className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium text-slate-200">Active Operations (5)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></span>
            <Users className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium text-slate-200">Field Teams Deployed (2)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50"></span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-medium text-slate-200">Critical Assessments (3)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectMap;
