import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Navigation,
  Phone,
  Mail,
  Target,
  ExternalLink,
  Volume2,
  BellRing,
  RefreshCw,
  LocateFixed,
  Info,
  X,
} from 'lucide-react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { renderToStaticMarkup } from 'react-dom/server';

// Custom Marker Icons
const createCustomIcon = (
  icon: React.ReactNode,
  colorClass: string,
  isPulsing = false,
  isUser = false
) => {
  const iconMarkup = renderToStaticMarkup(
    <div
      className={`relative flex items-center justify-center ${colorClass} ${isPulsing ? 'animate-pulse' : ''}`}
    >
      {isPulsing && (
        <div
          className={`absolute ${isUser ? 'w-12 h-12' : 'w-10 h-10'} bg-current opacity-25 rounded-full animate-ping`}
        ></div>
      )}
      {isUser ? (
        <div className="w-4 h-4 bg-white rounded-full border-2 border-amber-500 shadow-lg relative z-10">
          <div className="absolute inset-0 bg-amber-500 rounded-full animate-pulse opacity-40"></div>
        </div>
      ) : (
        <div className="transform transition-transform hover:scale-110">
          {icon}
        </div>
      )}
    </div>
  );

  return L.divIcon({
    html: iconMarkup,
    className: 'custom-marker-icon',
    iconSize: isUser ? [32, 32] : [40, 40],
    iconAnchor: isUser ? [16, 16] : [20, 40],
    popupAnchor: [0, -32],
  });
};

const officeIcon = createCustomIcon(
  <MapPin size={40} fill="#2d5a27" />,
  'text-[#2d5a27]',
  true
);
const userIcon = createCustomIcon(null, 'text-amber-500', true, true);

// Component to handle map view updates and bounds
const MapManager: React.FC<{
  userPos: [number, number] | null;
  officeCoords: [number, number];
  shouldFitBounds: boolean;
  onBoundsComplete: () => void;
}> = ({ userPos, officeCoords, shouldFitBounds, onBoundsComplete }) => {
  const map = useMap();

  useEffect(() => {
    if (shouldFitBounds) {
      if (userPos) {
        const bounds = L.latLngBounds([userPos, officeCoords]);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 18 });
      } else {
        map.setView(officeCoords, 18);
      }
      onBoundsComplete();
    }
  }, [shouldFitBounds, userPos, officeCoords, map, onBoundsComplete]);

  return null;
};

const OfficeMap: React.FC = () => {
  const officeCoords: [number, number] = [6.2899299, -10.7685852];

  const [isLocating, setIsLocating] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [eta, setEta] = useState<number | null>(null);
  const [directionHint, setDirectionHint] = useState<string | null>(null);
  const [routeData, setRouteData] = useState<[number, number][]>([]);
  const [hasArrived, setHasArrived] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldFitBounds, setShouldFitBounds] = useState(true);

  const watchId = useRef<number | null>(null);
  const arrivalAnnounced = useRef(false);

  // Calculate cardinal direction
  const getCardinalDirection = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const y = Math.sin(dLon) * Math.cos((lat2 * Math.PI) / 180);
    const x =
      Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
      Math.sin((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.cos(dLon);
    const brng = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
    const directions = [
      'North',
      'North East',
      'East',
      'South East',
      'South',
      'South West',
      'West',
      'North West',
      'North',
    ];
    return directions[Math.round(brng / 45)];
  };

  const fetchRoute = async (start: [number, number]) => {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${officeCoords[1]},${officeCoords[0]}?overview=full&geometries=geojson`
      );
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        setDistance(route.distance);
        setEta(Math.ceil(route.duration / 60));

        const coords = route.geometry.coordinates.map(
          (coord: [number, number]) => [coord[1], coord[0]]
        );
        setRouteData(coords);
        setDirectionHint(
          `Head ${getCardinalDirection(start[0], start[1], officeCoords[0], officeCoords[1])} toward office`
        );
      } else {
        throw new Error('No route found');
      }
    } catch (err) {
      console.error('Routing error:', err);
      const R = 6371e3;
      const p1 = (start[0] * Math.PI) / 180;
      const p2 = (officeCoords[0] * Math.PI) / 180;
      const dp = ((officeCoords[0] - start[0]) * Math.PI) / 180;
      const dl = ((officeCoords[1] - start[1]) * Math.PI) / 180;
      const a =
        Math.sin(dp / 2) * Math.sin(dp / 2) +
        Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) * Math.sin(dl / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c;

      setDistance(d);
      setEta(Math.ceil(d / 8.33 / 60));
      setRouteData([start, officeCoords]);
      setDirectionHint(
        `Head ${getCardinalDirection(start[0], start[1], officeCoords[0], officeCoords[1])} toward office`
      );
    }
  };

  const speakArrival = () => {
    if (arrivalAnnounced.current) return;
    const audio = new Audio(
      'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'
    );
    audio.play().catch((e) => console.log('Audio blocked:', e));

    setTimeout(() => {
      const msg = new SpeechSynthesisUtterance(
        'You have reached your destination. Welcome to Geo Mining and Environmental Consultancy.'
      );
      window.speechSynthesis.speak(msg);
      arrivalAnnounced.current = true;
    }, 1000);
  };

  const startTracking = () => {
    // Unlock audio context by playing empty/silent sound and speech on user interaction
    try {
      const audio = new Audio(
        'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA'
      );
      audio.play().catch(() => {});
      const utterance = new SpeechSynthesisUtterance('');
      utterance.volume = 0;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      // Ignore
    }

    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return;
    }

    setError(null);
    setIsLocating(true);
    setHasArrived(false);
    arrivalAnnounced.current = false;

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPos: [number, number] = [latitude, longitude];
        setUserPos(newPos);
        setIsLocating(false);
        setIsTracking(true);
        fetchRoute(newPos);

        const d = L.latLng(newPos).distanceTo(officeCoords);
        if (d <= 50) {
          setHasArrived(true);
          speakArrival();
          stopTracking();
        }
      },
      (err) => {
        let errorMessage = 'GPS signal lost. Please enable high accuracy.';
        if (err.code === 1) {
          errorMessage = 'Location access denied. Please allow permissions.';
        } else if (err.code === 2) {
          errorMessage =
            'Location unavailable. Please check your GPS or network.';
        } else if (err.code === 3) {
          errorMessage = 'Location request timed out. Please try again.';
        }

        setError(errorMessage);
        setIsLocating(false);
        stopTracking();

        // Auto-dismiss the error after 5 seconds
        setTimeout(() => setError(null), 5000);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  };

  const stopTracking = () => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
    setIsTracking(false);
    setRouteData([]);
    setEta(null);
    setDistance(null);
  };

  useEffect(() => {
    return () => stopTracking();
  }, []);

  return (
    <div
      className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10 sm:py-16 md:py-24"
      id="office-location"
    >
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        {/* Map Container */}
        <div className="flex-grow w-full lg:w-2/3 order-2 lg:order-1 relative">
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.15)] border-4 sm:border-8 border-white bg-slate-100 h-[280px] sm:h-[400px] md:h-[550px] z-0 group">
            <MapContainer
              center={officeCoords}
              zoom={18}
              scrollWheelZoom={false}
              attributionControl={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution="&copy; Google"
                url="https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
              />

              <Marker position={officeCoords} icon={officeIcon}>
                <Popup className="custom-popup">
                  <div className="p-3 min-w-[200px]">
                    <h4 className="font-black text-slate-900 text-sm mb-1 uppercase tracking-tighter">
                      GEOMINING & ENVIRONMENTAL CONSULTANCY INC
                    </h4>
                    <p className="text-xs text-amber-600 font-bold mb-2 uppercase tracking-widest">
                      Office Location
                    </p>
                    <div className="space-y-1 text-[11px] text-slate-600">
                      <p className="flex items-center gap-2">
                        <Phone size={10} /> +231 777 772 778
                      </p>
                      <p className="flex items-center gap-2">
                        <Mail size={10} /> geomininge@gmail.com
                      </p>
                    </div>
                  </div>
                </Popup>
              </Marker>

              {userPos && (
                <>
                  <Marker position={userPos} icon={userIcon}>
                    <Popup>
                      <div className="p-2 text-center">
                        <p className="font-bold text-blue-600 text-xs">
                          Your Current Location
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                  {routeData.length > 0 && (
                    <Polyline
                      positions={routeData}
                      color="#f59e0b"
                      weight={6}
                      opacity={0.8}
                    >
                      <div className="shadow-lg"></div>
                    </Polyline>
                  )}
                  <MapManager
                    userPos={userPos}
                    officeCoords={officeCoords}
                    shouldFitBounds={shouldFitBounds}
                    onBoundsComplete={() => setShouldFitBounds(false)}
                  />
                </>
              )}
            </MapContainer>

            {/* Map Legend & Live ETA */}
            <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-2xl border border-white/20 hidden sm:block min-w-[200px]">
              <h5 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2">
                <Target size={14} /> Map Legend
              </h5>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-amber-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
                  <span className="text-sm font-bold text-slate-700">
                    Your Location
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-[#2d5a27] animate-bounce" />
                  <span className="text-sm font-bold text-slate-700">
                    GEOMINING HQ
                  </span>
                </div>

                {/* Live ETA Section inside Legend */}
                {isTracking && (
                  <div className="mt-4 pt-4 border-t border-slate-200/50 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-blue-500 mb-2">
                      Live Progress
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-slate-500">
                          Distance
                        </span>
                        <span className="text-xs font-black text-slate-900">
                          {distance !== null
                            ? `${(distance / 1000).toFixed(1)} km`
                            : '--'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-slate-500">
                          Time
                        </span>
                        <span className="text-xs font-black text-amber-600">
                          {eta !== null ? `${eta} min` : '--'}
                        </span>
                      </div>
                      {directionHint && (
                        <p className="text-[9px] font-bold text-slate-400 italic mt-2 leading-tight">
                          {directionHint}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tracking Status Overlay (Simplified) */}
            {isTracking && (
              <div className="absolute top-6 left-6 right-6 z-[1000] flex flex-col gap-3">
                <div className="bg-slate-900/95 backdrop-blur-xl text-white p-4 rounded-2xl shadow-2xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#2d5a27]/20 rounded-xl flex items-center justify-center">
                      <Navigation
                        size={20}
                        className="text-[#2d5a27] animate-pulse"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-500">
                        Navigation Active
                      </p>
                      <p className="text-sm font-bold text-slate-300">
                        Tracking movement to headquarters...
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShouldFitBounds(true)}
                      className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-all"
                      title="Recenter Map"
                    >
                      <LocateFixed size={20} />
                    </button>
                    <button
                      onClick={stopTracking}
                      className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-3 rounded-xl transition-all"
                      title="Stop Navigation"
                    >
                      <RefreshCw size={20} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Arrival Notification */}
            {hasArrived && (
              <div className="absolute inset-0 z-[1001] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.3)] text-center max-w-sm transform animate-in fade-in zoom-in duration-500 border border-slate-100">
                  <div className="w-24 h-24 bg-[#2d5a27] text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[#2d5a27]/40 relative">
                    <BellRing size={48} className="animate-ring" />
                    <div className="absolute inset-0 rounded-full bg-[#2d5a27] animate-ping opacity-20"></div>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-3 uppercase tracking-tighter">
                    You Have Arrived!
                  </h3>
                  <p className="text-slate-500 font-medium leading-relaxed mb-8">
                    Welcome to the GEOMINING & ENVIRONMENTAL CONSULTANCY INC
                    headquarters.
                  </p>
                  <button
                    onClick={() => setHasArrived(false)}
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-amber-500 hover:text-slate-900 transition-all shadow-xl active:scale-95"
                  >
                    Finish Route
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="absolute top-4 right-4 z-[1000] animate-in fade-in zoom-in duration-300">
                <div className="bg-white/95 backdrop-blur-md text-red-600 py-2 px-4 rounded-full shadow-[0_10px_30px_rgba(220,38,38,0.15)] flex items-center gap-3 border border-red-100">
                  <Target size={14} className="text-red-500" />
                  <p className="text-[9px] font-bold uppercase tracking-widest whitespace-nowrap">
                    {error}
                  </p>
                  <button
                    onClick={() => setError(null)}
                    className="hover:bg-red-50 text-slate-400 hover:text-red-600 p-1 rounded-full transition-colors flex-shrink-0"
                    title="Dismiss"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <button
              onClick={startTracking}
              disabled={isLocating || isTracking}
              className={`group flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.1)] transform hover:-translate-y-1 ${
                isTracking
                  ? 'bg-blue-600 text-white border-none cursor-default'
                  : 'bg-[#2d5a27] text-white hover:bg-amber-500 hover:text-slate-900'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${isTracking ? 'bg-white animate-pulse' : 'bg-amber-400 group-hover:bg-slate-900'} transition-colors`}
              ></div>
              {isLocating
                ? 'Capturing GPS...'
                : isTracking
                  ? 'Navigation Active'
                  : 'Route From My Location'}
            </button>
            <button
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${officeCoords[0]},${officeCoords[1]}`,
                  '_blank'
                )
              }
              className="group flex items-center justify-center gap-3 bg-white border-2 border-slate-900 text-slate-900 px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#eab308] hover:border-[#eab308] transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.1)] transform hover:-translate-y-1"
            >
              <ExternalLink size={18} />
              Open In Google Maps
            </button>
          </div>
        </div>

        {/* Info Column */}
        <div className="w-full lg:w-1/3 order-1 lg:order-2 space-y-6 sm:space-y-10">
          <div className="space-y-3 sm:space-y-4">
            <h2 className="font-black text-slate-900 leading-[0.9] uppercase tracking-tighter flex flex-col">
              <span className="text-4xl sm:text-5xl md:text-7xl">
                Visit Our
              </span>
              <span className="text-lg sm:text-3xl md:text-5xl text-[#2d5a27] mt-1 sm:mt-2 whitespace-nowrap">
                Headquarters
              </span>
            </h2>
          </div>

          <div className="space-y-8 pt-8 border-t border-slate-100">
            <div className="flex items-start gap-5 group">
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center border border-green-100 group-hover:bg-[#2d5a27] group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-[#2d5a27]/30">
                <MapPin
                  size={24}
                  className="text-[#2d5a27] group-hover:text-white transition-colors"
                />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-black uppercase tracking-[0.1em] text-slate-900 mb-1">
                  Office Address
                </h4>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Cheeseman Avenue, Airfield New Road
                  <br />
                  Sinkor, Monrovia, Liberia
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5 group">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-amber-500/30">
                <Info
                  size={24}
                  className="text-amber-500 group-hover:text-white transition-colors"
                />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-black uppercase tracking-[0.1em] text-slate-900 mb-1">
                  Navigation Legend
                </h4>
                <div className="space-y-1 mt-2">
                  <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>{' '}
                    Your Live Position
                  </p>
                  <p className="text-xs font-bold text-slate-500 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#2d5a27] rounded-full"></span>{' '}
                    GEOMINING HQ
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <div className="bg-[#2d5a27] p-8 rounded-3xl text-white relative overflow-hidden shadow-2xl">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-amber-500 p-2 rounded-lg">
                  <Volume2 size={20} className="text-slate-900" />
                </div>
                <h5 className="text-[10px] font-black uppercase tracking-[0.2em]">
                  Privacy & Safety
                </h5>
              </div>
              <p className="text-xs text-green-50 font-medium leading-relaxed">
                Your location data is processed locally in your browser for
                navigation purposes and is not stored or shared with our
                servers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficeMap;
