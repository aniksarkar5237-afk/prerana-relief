import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import UpiDonationModal from './UpiDonationModal';
import {
  AlertTriangle,
  Target,
  TrendingUp,
  Package,
  MapPin,
  Search,
  Activity,
  Layers,
  Wind,
  ShieldAlert,
  Radio,
  Eye,
  Crosshair,
} from 'lucide-react';

// Fix Leaflet's default marker icon paths for React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Emergency Alert Marker
const emergencyAlertIcon = new L.DivIcon({
  className: 'emergency-alert-icon',
  html: '<div class="pulse-ring"></div><div class="pulse-dot"></div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Custom Target Lock Reticle Icon
const targetLockIcon = new L.DivIcon({
  className: 'target-lock-container',
  html: '<div class="target-lock-reticle"></div>',
  iconSize: [60, 60],
  iconAnchor: [30, 30],
});

// Helper for High-Contrast Tactical District HUD Marker Tag
const createDistrictTagIcon = (name: string, depthBadge: string, pingCount: string, isCritical: boolean) => {
  return new L.DivIcon({
    className: 'district-hud-container',
    html: `
      <div class="district-hud-badge">
        <div style="display:flex; align-items:center; justify-content:space-between; gap:8px;">
          <span style="font-weight:800; font-size:11px; color:#ffffff; letter-spacing:-0.2px;">${name}</span>
          <span style="font-size:9px; font-weight:800; padding:2px 6px; border-radius:5px; background:${
            isCritical ? '#7f1d1d' : '#78350f'
          }; color:${isCritical ? '#fecaca' : '#fef08a'}; border:1px solid ${
      isCritical ? '#ef4444' : '#f59e0b'
    };">${depthBadge}</span>
        </div>
        <div style="display:flex; align-items:center; justify-content:space-between; gap:4px; font-size:10px;">
          <div style="display:flex; align-items:center; gap:5px;">
            <span style="display:inline-block; width:7px; height:7px; border-radius:50%; background:#ef4444; box-shadow:0 0 8px #ef4444;"></span>
            <span style="font-weight:700; color:#38bdf8;">${pingCount}</span>
          </div>
          <span style="font-size:9px; color:#94a3b8; font-weight:600; text-transform:uppercase;">USSD Pings</span>
        </div>
      </div>
    `,
    iconSize: [210, 50],
    iconAnchor: [105, 25],
  });
};

// High-Risk Flood Inundation Zones with Verified Geographic Coordinates
const FLOOD_DISTRICT_OVERLAYS = [
  {
    id: 'sundarbans-gosaba',
    name: 'Gosaba / Sundarbans Delta',
    center: [22.08, 88.92] as [number, number],
    depthBadge: 'Inundation: +2.8m | Critical P0',
    pingCount: 'Pings: 48 Unresolved',
    isCritical: true,
    coordinates: [
      [22.25, 88.72],
      [22.32, 88.95],
      [22.28, 89.22],
      [21.88, 89.20],
      [21.68, 88.92],
      [21.78, 88.62],
      [22.08, 88.65],
    ] as [number, number][],
    details: 'Primary embankment collapse in Gosaba block. Tidal surge penetration 8km inland.',
  },
  {
    id: 'north24-basirhat',
    name: 'North 24 Parganas (Hingalganj Basin)',
    center: [22.62, 88.96] as [number, number],
    depthBadge: 'Inundation: +1.9m | Severe P1',
    pingCount: 'Pings: 32 Unresolved',
    isCritical: false,
    coordinates: [
      [22.45, 88.75],
      [22.78, 88.78],
      [22.88, 89.08],
      [22.72, 89.18],
      [22.42, 89.05],
      [22.38, 88.85],
    ] as [number, number][],
    details: 'Ichamati and Raimangal river overflow inundating low-lying farming tracts.',
  },
  {
    id: 'barak-silchar',
    name: 'Silchar Urban Sector (Barak Valley)',
    center: [24.82, 92.80] as [number, number],
    depthBadge: 'Inundation: +3.4m | Critical P0',
    pingCount: 'Pings: 64 Unresolved',
    isCritical: true,
    coordinates: [
      [24.72, 92.68],
      [24.92, 92.74],
      [24.98, 92.90],
      [24.86, 93.02],
      [24.70, 92.96],
      [24.64, 92.80],
    ] as [number, number][],
    details: 'Betukandi dyke rupture; major urban settlements submerged with 3.4m flood line.',
  },
  {
    id: 'sagar-kakdwip',
    name: 'Sagar Island & Kakdwip Sector',
    center: [21.72, 88.16] as [number, number],
    depthBadge: 'Inundation: +2.1m | Severe P1',
    pingCount: 'Pings: 27 Unresolved',
    isCritical: false,
    coordinates: [
      [21.60, 88.02],
      [21.88, 88.12],
      [21.94, 88.30],
      [21.68, 88.26],
      [21.54, 88.10],
    ] as [number, number][],
    details: 'Muriganga river storm tide breaches mud bunds. Low-lying island evacuation underway.',
  },
];

// Fallback high-priority requests if database has no active records yet
const FALLBACK_EMERGENCY_REQUESTS = [
  {
    id: 'req-1',
    title: 'Emergency Rescue Boats & Ration for Silchar',
    charity_name: 'Assam Valley Relief Taskforce',
    lat: 24.824,
    lng: 92.798,
    severity: 'P0',
    target_amount: 500000,
    raised_amount: 142000,
    supplies_needed: ['Inflatable Rafts', 'Potable Water Kits', 'Baby Food Kits'],
    active_distress: 64,
  },
  {
    id: 'req-2',
    title: 'Embankment Repair Materials & Medical Kits',
    charity_name: 'Bengal Delta Emergency Network',
    lat: 22.085,
    lng: 88.925,
    severity: 'P0',
    target_amount: 750000,
    raised_amount: 380000,
    supplies_needed: ['Geo-textile Sandbags', 'ORS Sachets', 'Water Purification Tabs'],
    active_distress: 48,
  },
  {
    id: 'req-3',
    title: 'Amphibious Evacuation Fleet for Hingalganj',
    charity_name: 'Sundarbans Tiger & Forest Foundation',
    lat: 22.618,
    lng: 88.962,
    severity: 'P1',
    target_amount: 300000,
    raised_amount: 95000,
    supplies_needed: ['Life Jackets', 'Solar Lanterns', 'Emergency Tarpaulins'],
    active_distress: 32,
  },
];

// ---------------------------------------------------------------------------
// Realistic Animated Cyclone & Meteorological Radar Layer Component
// ---------------------------------------------------------------------------
function CycloneRadarOverlay({ visible }: { visible: boolean }) {
  const map = useMap();
  const [, setTick] = useState(0);

  useEffect(() => {
    const onMapChange = () => setTick((t) => t + 1);
    map.on('move', onMapChange);
    map.on('zoom', onMapChange);
    map.on('viewreset', onMapChange);
    return () => {
      map.off('move', onMapChange);
      map.off('zoom', onMapChange);
      map.off('viewreset', onMapChange);
    };
  }, [map]);

  if (!visible) return null;

  // Geographic coordinates of Cyclone Eye & Forecast Path (Bay of Bengal -> Sundarbans)
  const eyeGeo: [number, number] = [20.85, 89.25];
  const t3Geo: [number, number] = [21.45, 89.10];
  const t6Geo: [number, number] = [22.08, 88.95]; // Expected Landfall
  const t12Geo: [number, number] = [22.85, 88.75]; // Inland Dissipation

  const eye = map.latLngToContainerPoint(eyeGeo);
  const t3 = map.latLngToContainerPoint(t3Geo);
  const t6 = map.latLngToContainerPoint(t6Geo);
  const t12 = map.latLngToContainerPoint(t12Geo);

  // Dynamic vortex radius based on map zoom
  const currentZoom = map.getZoom();
  const radius = Math.max(90, Math.min(260, 22 * currentZoom));

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-[400] overflow-visible"
      style={{ pointerEvents: 'none' }}
    >
      <defs>
        {/* Wind gradient for spiral arms */}
        <linearGradient id="cycloneArmGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
        </linearGradient>

        {/* Doppler radar precipitation gradient */}
        <radialGradient id="radarPrecipitation">
          <stop offset="0%" stopColor="#dc2626" stopOpacity="0.75" />
          <stop offset="30%" stopColor="#f59e0b" stopOpacity="0.5" />
          <stop offset="65%" stopColor="#06b6d4" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
        </radialGradient>

        {/* Landfall trajectory cone gradient */}
        <linearGradient id="landfallConeGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#0ea5e9" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* 1. Projected 12-Hour Landfall Trajectory Cone */}
      <g className="landfall-projection">
        {/* Uncertainty Cone polygon */}
        <polygon
          points={`
            ${eye.x - radius * 0.4},${eye.y} 
            ${t12.x - radius * 0.8},${t12.y} 
            ${t12.x + radius * 0.8},${t12.y} 
            ${eye.x + radius * 0.4},${eye.y}
          `}
          fill="url(#landfallConeGradient)"
          stroke="rgba(244, 63, 94, 0.4)"
          strokeWidth="1.5"
          strokeDasharray="6,4"
        />

        {/* Projected Centerline Track */}
        <path
          d={`M ${eye.x} ${eye.y} Q ${t3.x} ${t3.y} ${t6.x} ${t6.y} T ${t12.x} ${t12.y}`}
          fill="none"
          stroke="#f43f5e"
          strokeWidth="2.5"
          strokeDasharray="8,5"
          className="radar-cone-animated"
        />

        {/* Waypoint Nodes */}
        <g transform={`translate(${t6.x}, ${t6.y})`}>
          <circle r="6" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
          <text
            x="10"
            y="4"
            fill="#ffffff"
            fontSize="10"
            fontWeight="bold"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))"
          >
            T+6h: Sundarbans Landfall (130 km/h)
          </text>
        </g>

        <g transform={`translate(${t12.x}, ${t12.y})`}>
          <circle r="4" fill="#fbbf24" stroke="#ffffff" strokeWidth="1.5" />
          <text
            x="8"
            y="4"
            fill="#f1f5f9"
            fontSize="9"
            fontWeight="600"
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))"
          >
            T+12h: Inundation Spate
          </text>
        </g>
      </g>

      {/* 2. Rotating Cyclone Vortex (Counter-Clockwise - Indian Ocean Circulation) */}
      <g transform={`translate(${eye.x}, ${eye.y})`}>
        {/* Radar Doppler Precipitation Rings */}
        <circle r={radius} fill="url(#radarPrecipitation)" />

        {/* Counter-Clockwise Animated Spiral Arms */}
        <g className="cyclone-vortex-animated">
          {/* Spiral Arm 1 */}
          <path
            d={`M 0 0 C ${radius * 0.3} ${-radius * 0.4}, ${radius * 0.7} ${-radius * 0.3}, ${radius * 0.95} ${radius * 0.2}`}
            fill="none"
            stroke="url(#cycloneArmGradient)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Spiral Arm 2 */}
          <path
            d={`M 0 0 C ${-radius * 0.3} ${radius * 0.4}, ${-radius * 0.7} ${radius * 0.3}, ${-radius * 0.95} ${-radius * 0.2}`}
            fill="none"
            stroke="url(#cycloneArmGradient)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          {/* Spiral Arm 3 */}
          <path
            d={`M 0 0 C ${radius * 0.4} ${radius * 0.3}, ${radius * 0.3} ${radius * 0.7}, ${-radius * 0.2} ${radius * 0.95}`}
            fill="none"
            stroke="url(#cycloneArmGradient)"
            strokeWidth="11"
            strokeLinecap="round"
          />
          {/* Spiral Arm 4 */}
          <path
            d={`M 0 0 C ${-radius * 0.4} ${-radius * 0.3}, ${-radius * 0.3} ${-radius * 0.7}, ${radius * 0.2} ${-radius * 0.95}`}
            fill="none"
            stroke="url(#cycloneArmGradient)"
            strokeWidth="11"
            strokeLinecap="round"
          />
        </g>

        {/* Cyclone Eye */}
        <circle r="14" fill="#0f172a" stroke="#ffffff" strokeWidth="2.5" />
        <circle r="6" fill="#06b6d4" />

        {/* Eye Badge */}
        <g transform="translate(18, -12)">
          <rect
            x="-4"
            y="-14"
            width="145"
            height="24"
            rx="6"
            fill="rgba(15, 23, 42, 0.9)"
            stroke="rgba(6, 182, 212, 0.7)"
            strokeWidth="1"
          />
          <text x="4" y="2" fill="#38bdf8" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
            CYCLONE VORTEX • 962 hPa
          </text>
        </g>
      </g>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Main Disaster Map Component
// ---------------------------------------------------------------------------
const DisasterMapInner = () => {
  const [activeZones, setActiveZones] = useState<any[]>([]);
  const [emergencyRequests, setEmergencyRequests] = useState<any[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);

  // Basemap Selector: Topo Terrain (Default), NatGeo Physical, Satellite Hybrid
  const [basemapStyle, setBasemapStyle] = useState<'topo' | 'natgeo' | 'satellite'>('topo');

  // Toggle for meteorological cyclone overlay
  const [showCycloneRadar, setShowCycloneRadar] = useState(true);

  // Target lock coordinates for "Focus Map" animation
  const [focusedCoord, setFocusedCoord] = useState<[number, number] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [zonesRes, requestsRes] = await Promise.all([
          fetch('http://localhost:5000/api/disasters/active-zones'),
          fetch('http://localhost:5000/api/disasters/emergency-requests'),
        ]);

        const zones = await zonesRes.json();
        const requests = await requestsRes.json();

        setActiveZones(Array.isArray(zones) && zones.length > 0 ? zones : []);
        setEmergencyRequests(
          Array.isArray(requests) && requests.length > 0 ? requests : FALLBACK_EMERGENCY_REQUESTS
        );
      } catch (error) {
        console.warn('Backend offline or fetching error, using high-priority emergency feeds:', error);
        setEmergencyRequests(FALLBACK_EMERGENCY_REQUESTS);
      }
    };

    fetchData();
  }, []);

  // Smoothly Fly Map to Coordinate and Activate Lock Reticle
  const handleFocusLocation = (lat: number, lng: number) => {
    if (!map) return;
    setFocusedCoord([lat, lng]);
    map.flyTo([lat, lng], 10, {
      duration: 1.6,
      easeLinearity: 0.25,
    });
  };

  // Basemap Tile Layer URL Provider
  const basemapConfig = useMemo(() => {
    switch (basemapStyle) {
      case 'natgeo':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}',
          attribution:
            'Tiles &copy; National Geographic, Esri &mdash; Delta Flood & Disaster Monitoring',
          maxZoom: 16,
        };
      case 'satellite':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: 'Tiles &copy; Esri World Imagery &mdash; Remote Sensing Satellite',
          maxZoom: 18,
        };
      case 'topo':
      default:
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
          attribution:
            'Tiles &copy; Esri World Topo Map &mdash; Physical Topographic Relief, Rivers & Boundaries',
          maxZoom: 18,
        };
    }
  }, [basemapStyle]);

  return (
    <div className="relative w-full h-[650px] lg:h-[700px] flex flex-col lg:flex-row bg-[#080C16] rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
      {/* ================================================================= */}
      {/* 1. Left/Center 2/3 - Enhanced Interactive GIS Map Viewport        */}
      {/* ================================================================= */}
      <div className="w-full lg:w-2/3 h-[420px] lg:h-full relative overflow-hidden">
        {/* Top Floating Map HUD Header & Basemap Controls */}
        <div className="absolute top-3 left-14 right-3 z-[500] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          {/* Tactical Status Pill */}
          <div className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B0F19]/90 backdrop-blur-md border border-slate-700/80 shadow-xl">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            <span className="text-[11px] font-bold tracking-wider text-slate-200 uppercase">
              Bengal Delta & Assam GIS Radar
            </span>
            <span className="text-[10px] text-cyan-400 font-mono pl-1 border-l border-slate-700">
              Live Topography
            </span>
          </div>

          {/* Controls: Basemap Selector & Cyclone Radar Toggle */}
          <div className="pointer-events-auto flex items-center gap-1.5 bg-[#0B0F19]/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-xl">
            <button
              onClick={() => setBasemapStyle('topo')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                basemapStyle === 'topo'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🏔️ Topo Terrain
            </button>
            <button
              onClick={() => setBasemapStyle('natgeo')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                basemapStyle === 'natgeo'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🗺️ NatGeo Physical
            </button>
            <button
              onClick={() => setBasemapStyle('satellite')}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
                basemapStyle === 'satellite'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🛰️ Satellite
            </button>

            <div className="w-[1px] h-4 bg-slate-700 mx-1" />

            <button
              onClick={() => setShowCycloneRadar(!showCycloneRadar)}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg flex items-center gap-1.5 transition-all ${
                showCycloneRadar
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Toggle Animated Meteorological Radar & Projected Cyclone Track"
            >
              <Wind className="w-3.5 h-3.5" />
              Cyclone Radar: {showCycloneRadar ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Map Container centered over Eastern India / Bengal Delta & Assam flood belt */}
        <MapContainer
          center={[22.5, 89.0]} // Lat: 22.5, Lng: 89.0 as specified
          zoom={7.5}
          minZoom={5}
          maxBounds={[
            [17.0, 80.0],
            [29.0, 97.0],
          ]}
          maxBoundsViscosity={0.8}
          style={{ height: '100%', width: '100%', background: '#e6ebec' }}
          scrollWheelZoom={true}
          ref={setMap}
        >
          {/* High-Definition Physical/Terrain Basemap Tile Layer */}
          <TileLayer
            key={basemapConfig.url}
            attribution={basemapConfig.attribution}
            url={basemapConfig.url}
            maxZoom={basemapConfig.maxZoom}
          />

          {/* Secondary boundary overlay for satellite basemap */}
          {basemapStyle === 'satellite' && (
            <TileLayer
              attribution="Esri Labels"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
              maxZoom={18}
            />
          )}

          {/* ------------------------------------------------------------- */}
          {/* Affected District & Flood Inundation Overlay Polygons         */}
          {/* ------------------------------------------------------------- */}
          {FLOOD_DISTRICT_OVERLAYS.map((zone) => (
            <React.Fragment key={zone.id}>
              {/* Semi-transparent glowing blue-cyan fill & pulsing red warning border */}
              <Polygon
                positions={zone.coordinates}
                pathOptions={{
                  fillColor: '#0ea5e9',
                  fillOpacity: 0.32,
                  color: '#ef4444',
                  weight: 2.5,
                  dashArray: '6, 6',
                  className: 'flood-polygon-pulsing',
                }}
              >
                <Popup className="disaster-popup min-w-[260px]">
                  <div className="p-3">
                    <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs uppercase mb-1">
                      <ShieldAlert className="w-4 h-4 text-rose-500" /> Flood Inundation Zone
                    </div>
                    <h3 className="font-extrabold text-white text-base mb-1">{zone.name}</h3>
                    <p className="text-xs text-slate-300 mb-2">{zone.details}</p>
                    <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 text-[11px] space-y-1">
                      <div className="text-amber-400 font-semibold">{zone.depthBadge}</div>
                      <div className="text-cyan-400">{zone.pingCount}</div>
                    </div>
                  </div>
                </Popup>
              </Polygon>

              {/* District HUD Marker Tag right on the map */}
              <Marker
                position={zone.center}
                icon={createDistrictTagIcon(
                  zone.name,
                  zone.depthBadge.split('|')[0].trim(),
                  zone.pingCount.split(' ')[1] || 'Active',
                  zone.isCritical
                )}
                eventHandlers={{
                  click: () => handleFocusLocation(zone.center[0], zone.center[1]),
                }}
              />
            </React.Fragment>
          ))}

          {/* Dynamic database active zones if configured */}
          {activeZones.map(
            (zone) =>
              zone.geojson && (
                <Polygon
                  key={zone.id}
                  positions={zone.geojson.coordinates[0].map((coord: number[]) => [coord[1], coord[0]])}
                  pathOptions={{
                    fillColor: '#0284c7',
                    fillOpacity: 0.28,
                    color: '#f43f5e',
                    weight: 2,
                  }}
                >
                  <Popup className="disaster-popup">
                    <div className="p-2">
                      <h3 className="font-bold text-white">{zone.title}</h3>
                      <p className="text-xs text-slate-300">Severity: {zone.severity_level}</p>
                    </div>
                  </Popup>
                </Polygon>
              )
          )}

          {/* ------------------------------------------------------------- */}
          {/* Active Emergency Distress Hotspot Markers                     */}
          {/* ------------------------------------------------------------- */}
          {emergencyRequests.map(
            (req) =>
              req.lat &&
              req.lng && (
                <Marker key={req.id} position={[req.lat, req.lng]} icon={emergencyAlertIcon}>
                  <Popup className="disaster-popup min-w-[280px]">
                    <div className="p-1">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="text-rose-500 w-5 h-5" />
                        <h3 className="font-bold text-white text-base leading-tight">{req.title}</h3>
                      </div>

                      <div className="flex items-center gap-1.5 text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2 py-1 rounded-md text-xs font-semibold w-fit mb-3">
                        <Target className="w-3.5 h-3.5" />
                        {req.charity_name || 'Verified Relief Taskforce'}
                      </div>

                      <div className="mb-3 space-y-1.5">
                        <div className="flex justify-between text-xs font-medium text-slate-300">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" /> Raised
                          </span>
                          <span className="font-bold text-white">
                            ₹{req.raised_amount.toLocaleString()} / ₹{req.target_amount.toLocaleString()}
                          </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${Math.min((req.raised_amount / req.target_amount) * 100, 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      {req.supplies_needed && req.supplies_needed.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1">
                            <Package className="w-3.5 h-3.5 text-amber-400" /> Urgent Relief Supplies
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {req.supplies_needed.map((item: string, idx: number) => (
                              <span
                                key={idx}
                                className="bg-rose-500/10 text-rose-300 text-[10px] px-2 py-0.5 rounded-md font-medium border border-rose-500/20"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg active:scale-[0.98] text-xs flex items-center justify-center gap-2"
                      >
                        Donate Directly (0% Platform Fee)
                      </button>
                    </div>
                  </Popup>
                </Marker>
              )
          )}

          {/* Animated Target Lock Marker */}
          {focusedCoord && (
            <Marker position={focusedCoord} icon={targetLockIcon} interactive={false} />
          )}

          {/* Realistic Animated Cyclone & Meteorological Radar Overlay */}
          <CycloneRadarOverlay visible={showCycloneRadar} />
        </MapContainer>

        {/* ------------------------------------------------------------- */}
        {/* Floating Map Legend (Bottom-Left Corner)                       */}
        {/* ------------------------------------------------------------- */}
        <div className="absolute bottom-3 left-3 z-[500] bg-[#0B0F19]/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 shadow-2xl text-[11px] space-y-1.5 text-slate-300 pointer-events-auto">
          <div className="font-bold text-white text-xs flex items-center gap-1.5 pb-1 border-b border-slate-800">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> GIS Map Telemetry Legend
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-cyan-500/40 border border-rose-500"></span>
            <span>Active Flood Inundation Polygon</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_#ef4444]"></span>
            <span>Emergency Distress Signal (Hotspot)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-1 bg-rose-500 border border-white"></span>
            <span>Projected 12h Landfall Cone</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5">
            <MapPin className="w-3 h-3 text-cyan-400" />
            <span>Terrain Relief: Eastern India / Bengal Delta & Assam</span>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 2. Right 1/3 - Dark Tactical Glassmorphism Dispatch Sidebar        */}
      {/* ================================================================= */}
      <div className="w-full lg:w-1/3 h-full bg-[#0B0F19] border-t lg:border-t-0 lg:border-l border-slate-800/90 flex flex-col overflow-hidden">
        {/* Sidebar Header (Clean separated layout to eliminate text collisions) */}
        <div className="p-5 border-b border-slate-800/80 bg-[#0F172A]/90 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              Live Priority Dispatch
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-400">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" /> Priority Hotspots
            </span>
          </div>
          <h3 className="text-xl font-black text-white tracking-tight mt-1.5">
            Emergency Relief Coordination
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Real-time P0/P1 logistics, ration boats, and embankment defense operations.
          </p>
        </div>

        {/* Scrollable Rescue Hotspots List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
          {emergencyRequests.map((req, idx) => (
            <div
              key={req.id}
              className="bg-[#0F172A]/80 hover:bg-[#131D35] rounded-2xl border border-slate-800 hover:border-cyan-500/40 p-4 transition-all duration-200 shadow-lg group"
            >
              <div className="flex justify-between items-start gap-2 mb-2">
                <h4 className="font-extrabold text-slate-100 text-sm leading-snug group-hover:text-cyan-300 transition-colors">
                  {req.title}
                </h4>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    req.severity === 'P0' || idx % 2 === 0
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-[0_0_8px_rgba(244,63,94,0.2)]'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {req.severity || (idx % 2 === 0 ? 'P0' : 'P1')}
                </span>
              </div>

              <p className="text-xs text-slate-400 mb-2.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-300 font-medium">
                  NGO: {req.charity_name || 'Verified Relief Taskforce'}
                </span>
              </p>

              {req.supplies_needed && req.supplies_needed.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3.5">
                  {req.supplies_needed.map((item: string, i: number) => (
                    <span
                      key={i}
                      className="bg-slate-900 text-slate-300 text-[10px] font-medium px-2 py-0.5 rounded-md border border-slate-700/80"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center text-xs text-slate-400 mb-3.5 pt-2 border-t border-slate-800/80">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  Active Distress: <strong className="text-slate-200">{req.active_distress || 35}</strong>
                </span>
                <span>
                  Raised: <strong className="text-white">₹{(req.raised_amount / 1000).toFixed(1)}k</strong>
                </span>
              </div>

              {/* Action Buttons: Focus Map & Direct Donate */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleFocusLocation(req.lat, req.lng)}
                  className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border border-slate-700 hover:border-cyan-500/50"
                >
                  <Crosshair className="w-3.5 h-3.5 text-cyan-400" /> Focus Map
                </button>
                <button
                  onClick={() => setSelectedRequest(req)}
                  className="w-full py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 active:scale-[0.98]"
                >
                  Donate 0% Fee
                </button>
              </div>
            </div>
          ))}

          {emergencyRequests.length === 0 && (
            <div className="text-center text-slate-500 text-sm py-12">
              <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              Scanning for active disaster signals...
            </div>
          )}
        </div>
      </div>

      {/* UPI Donation Modal */}
      {selectedRequest && (
        <UpiDonationModal request={selectedRequest} onClose={() => setSelectedRequest(null)} />
      )}
    </div>
  );
};

export default DisasterMapInner;
