'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
// @ts-ignore
import L from 'leaflet';
import {
  Search,
  Plus,
  Minus,
  Compass,
  MapPin,
  ArrowRight,
  X,
  Radio,
  Layers,
  Wind,
  ShieldAlert,
  Sparkles,
  Crosshair
} from 'lucide-react';
import OnGroundNeedsModal, { ZoneData } from './OnGroundNeedsModal';

// Fix Leaflet's default marker icon paths in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export type FilterCategory = 'all' | 'flood' | 'cyclone' | 'landslide' | 'hub';

export interface Hotspot {
  id: string;
  name: string;
  subhead: string;
  category: 'flood' | 'cyclone' | 'landslide' | 'hub';
  badgeText: string;
  severity: 'P0' | 'P1' | 'P2' | 'SAFE';
  lat: number;
  lng: number;
  primaryMetricLabel: string;
  primaryMetricValue: string;
  secondaryMetricLabel: string;
  secondaryMetricValue: string;
  statusTag: string;
  zoneRef?: ZoneData;
}

// -------------------------------------------------------------
// VERIFIED NON-OVERLAPPING HOTSPOTS ACROSS INDIA
// -------------------------------------------------------------
const HOTSPOTS_DATA: Hotspot[] = [
  {
    id: 'silchar-barak',
    name: 'Silchar & Barak Valley Basin',
    subhead: 'Cachar District, Assam (North-East)',
    category: 'flood',
    badgeText: 'Assam • P0',
    severity: 'P0',
    lat: 24.8333,
    lng: 92.7789,
    primaryMetricLabel: 'River Level',
    primaryMetricValue: '+1.8m Above Danger Mark',
    secondaryMetricLabel: '24h Inflow',
    secondaryMetricValue: '120mm Extreme Rainfall',
    statusTag: 'Embankment Breached',
    zoneRef: {
      id: 1,
      district: 'Silchar',
      state: 'Assam',
      score: 85,
      rainfallIndex: '+120mm',
      riverDanger: '+1.5m',
      unaddressedCount: 42,
      severity: 'P0'
    }
  },
  {
    id: 'patna-ganga',
    name: 'Patna Central Flood Plain',
    subhead: 'Ganga & Gandak Confluence, Bihar',
    category: 'flood',
    badgeText: 'Patna • P1',
    severity: 'P1',
    lat: 25.5941,
    lng: 85.1376,
    primaryMetricLabel: 'River Level',
    primaryMetricValue: '+0.6m Warning Stage',
    secondaryMetricLabel: 'Field Distress',
    secondaryMetricValue: '16 Active Triage Cases',
    statusTag: 'Low-Lying Inundation',
    zoneRef: {
      id: 2,
      district: 'Patna',
      state: 'Bihar',
      score: 62,
      rainfallIndex: '+50mm',
      riverDanger: '+0.4m',
      unaddressedCount: 15,
      severity: 'P1'
    }
  },
  {
    id: 'cyclone-bob',
    name: 'Bay of Bengal Cyclone Vortex',
    subhead: 'Maritime Sector 4 (Tracking WNW)',
    category: 'cyclone',
    badgeText: 'Cyclone • 140 km/h',
    severity: 'P0',
    lat: 16.5000,
    lng: 87.5000,
    primaryMetricLabel: 'Wind Speed',
    primaryMetricValue: '140 km/h (Gusts: 165 km/h)',
    secondaryMetricLabel: 'Storm Surge',
    secondaryMetricValue: '3.2m Offshore Waves',
    statusTag: 'Category 3 Supercell'
  },
  {
    id: 'wayanad-ghats',
    name: 'Wayanad Hill Slopes',
    subhead: 'Western Ghats, Kerala (South-West)',
    category: 'landslide',
    badgeText: 'Wayanad • P2',
    severity: 'P2',
    lat: 11.6854,
    lng: 76.1320,
    primaryMetricLabel: 'Slope Moisture',
    primaryMetricValue: '92% Soil Saturation',
    secondaryMetricLabel: 'Landslide Risk',
    secondaryMetricValue: 'Level 2 Warning Area',
    statusTag: 'Mudflow Hazard Active',
    zoneRef: {
      id: 3,
      district: 'Wayanad',
      state: 'Kerala',
      score: 38,
      rainfallIndex: '+15mm',
      riverDanger: '-0.2m',
      unaddressedCount: 5,
      severity: 'P2'
    }
  },
  {
    id: 'central-hub',
    name: 'Central Triage Depot (Nagpur)',
    subhead: 'National Disaster Logistics Center',
    category: 'hub',
    badgeText: 'Central Hub • Active',
    severity: 'SAFE',
    lat: 21.1458,
    lng: 79.0882,
    primaryMetricLabel: 'Shelter Capacity',
    primaryMetricValue: '3,000 Emergency Beds',
    secondaryMetricLabel: 'Logistics Fleet',
    secondaryMetricValue: '14 Flotilla Dinghies & Medics',
    statusTag: 'Fully Operational Central Base'
  },
  {
    id: 'south-hub',
    name: 'Southern Staging Hub (Bengaluru)',
    subhead: 'Karnataka & Kerala Rapid Triage Depot',
    category: 'hub',
    badgeText: 'Safe Hub • Active',
    severity: 'SAFE',
    lat: 12.9716,
    lng: 77.5946,
    primaryMetricLabel: 'Shelter Capacity',
    primaryMetricValue: '1,800 Evacuee Capacity',
    secondaryMetricLabel: 'Medical Inventory',
    secondaryMetricValue: 'Emergency IV & Blood Stocked',
    statusTag: 'Staging Ready 100%'
  }
];

// -------------------------------------------------------------
// LEAFLET BIOLUMINESCENT RADAR ICON GENERATOR
// -------------------------------------------------------------
const createHotspotIcon = (
  type: 'flood' | 'cyclone' | 'landslide' | 'hub',
  badgeText: string
) => {
  let ringClass = 'ping-crimson';
  let dotClass = 'dot-crimson';
  let badgeClass = 'badge-crimson';

  if (type === 'cyclone') {
    ringClass = 'ring-vortex-amber';
    dotClass = 'dot-amber';
    badgeClass = 'badge-amber';
  } else if (type === 'landslide') {
    ringClass = 'ping-yellow';
    dotClass = 'dot-yellow';
    badgeClass = 'badge-yellow';
  } else if (type === 'hub') {
    ringClass = 'ping-emerald';
    dotClass = 'dot-emerald';
    badgeClass = 'badge-emerald';
  }

  const isCyclone = type === 'cyclone';

  return L.divIcon({
    className: 'custom-radar-marker',
    html: `
      <div class="hotspot-pin-wrapper">
        <div class="${isCyclone ? 'vortex-anim ' + ringClass : 'pulse-ring-anim ' + ringClass}"></div>
        <div class="radar-dot ${dotClass}"></div>
        <div class="radar-badge ${badgeClass}">${badgeText}</div>
      </div>
    `,
    iconSize: [120, 44],
    iconAnchor: [60, 22],
    popupAnchor: [0, -26],
  });
};

// -------------------------------------------------------------
// MAP CONTROLLER (Fly-To, Zoom In/Out, Recenter)
// -------------------------------------------------------------
function MapController({
  targetCoords,
  zoomAction,
  onResetZoomAction,
}: {
  targetCoords: [number, number] | null;
  zoomAction: 'in' | 'out' | 'recenter' | null;
  onResetZoomAction: () => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (targetCoords) {
      map.flyTo(targetCoords, 7, { duration: 1.2 });
    }
  }, [targetCoords, map]);

  useEffect(() => {
    if (zoomAction === 'in') {
      map.zoomIn();
      onResetZoomAction();
    } else if (zoomAction === 'out') {
      map.zoomOut();
      onResetZoomAction();
    } else if (zoomAction === 'recenter') {
      map.flyTo([22.5937, 78.9629], 5, { duration: 1.2 });
      onResetZoomAction();
    }
  }, [zoomAction, map, onResetZoomAction]);

  return null;
}

export default function DisasterMapInner() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [targetCoords, setTargetCoords] = useState<[number, number] | null>(null);
  const [zoomAction, setZoomAction] = useState<'in' | 'out' | 'recenter' | null>(null);
  const [selectedTriageZone, setSelectedTriageZone] = useState<ZoneData | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Filter hotspots based on active pill
  const visibleHotspots = useMemo(() => {
    if (activeFilter === 'all') return HOTSPOTS_DATA;
    return HOTSPOTS_DATA.filter((h) => h.category === activeFilter);
  }, [activeFilter]);

  // Search suggestions
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return HOTSPOTS_DATA.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.subhead.toLowerCase().includes(q) ||
        h.badgeText.toLowerCase().includes(q) ||
        h.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleSelectSearchResult = (hotspot: Hotspot) => {
    setTargetCoords([hotspot.lat, hotspot.lng]);
    setSearchQuery(hotspot.name);
    setIsSearchFocused(false);
  };

  const handleOpenTriage = (hotspot: Hotspot) => {
    if (hotspot.zoneRef) {
      setSelectedTriageZone(hotspot.zoneRef);
    } else {
      setSelectedTriageZone({
        district: hotspot.name.split(' ')[0],
        state: hotspot.subhead.split(',')[1]?.trim() || 'Bay of Bengal',
        score: hotspot.severity === 'P0' ? 88 : hotspot.severity === 'P1' ? 64 : 35,
        severity: hotspot.severity
      });
    }
  };

  return (
    <div className="relative w-full h-[540px] sm:h-[580px] lg:h-[620px] rounded-2xl overflow-hidden bg-[#080D1A]/85 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] select-none">
      
      {/* ------------------------------------------------------------- */}
      {/* ATMOSPHERIC BACKGROUND GRADIENT & DELTA TEXTURE OVERLAY       */}
      {/* ------------------------------------------------------------- */}
      {/* Center Subtle Bioluminescent Glow */}
      <div className="pointer-events-none absolute inset-0 z-[200] bg-gradient-to-tr from-cyan-500/10 via-transparent to-amber-500/10 mix-blend-screen" />

      {/* Atmospheric Edge Vignette - Softens and dissolves borders into delta backdrop */}
      <div className="pointer-events-none absolute inset-0 z-[300] shadow-[inset_0_0_90px_rgba(8,13,26,0.95)]" />

      {/* Subtle Tactical Radar Crosshair Grid Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-[250] opacity-35"
        style={{
          backgroundImage:
            'radial-gradient(rgba(6, 182, 212, 0.25) 1px, transparent 1px), linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)',
          backgroundSize: '36px 36px, 144px 144px, 144px 144px'
        }}
      />

      {/* Tactical Corner HUD Telemetry Badges */}
      <div className="pointer-events-none absolute top-3.5 left-4 z-[500] hidden sm:flex items-center gap-2 font-mono text-[10px] text-cyan-400/80 uppercase tracking-widest bg-slate-950/60 px-2.5 py-1 rounded-full border border-white/5 backdrop-blur-md">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span>RELIEFGRID // SPATIAL RADAR v2.4</span>
      </div>

      <div className="pointer-events-none absolute top-3.5 right-4 z-[500] hidden sm:flex items-center gap-2 font-mono text-[10px] text-zinc-400 uppercase tracking-wider bg-slate-950/60 px-2.5 py-1 rounded-full border border-white/5 backdrop-blur-md">
        <Crosshair className="w-3 h-3 text-cyan-400" />
        <span>EPSG:3857 // WGS-84</span>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. TOP FLOATING CONTROLS: SEARCH BAR + FILTER PILLS TOGETHER  */}
      {/* (Google Maps Style - Translucent Frosted Glass Texture)       */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute top-4 sm:top-5 inset-x-0 z-[1000] flex flex-col items-center gap-2.5 px-3 pointer-events-none">
        
        {/* Search Bar */}
        <div className="relative w-full max-w-sm sm:w-96 pointer-events-auto">
          <div className="flex items-center gap-2.5 bg-[#0E1626]/85 backdrop-blur-2xl border border-slate-700/60 rounded-full px-4 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-all focus-within:border-cyan-400/70 focus-within:shadow-[0_0_25px_rgba(6,182,212,0.3)]">
            <Search className="w-4 h-4 text-cyan-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search state, river basin, or triage hub..."
              className="bg-transparent border-none text-xs sm:text-sm text-white placeholder:text-zinc-400 focus:outline-none w-full font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Autocomplete Suggestions Dropdown */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0E1626]/95 backdrop-blur-2xl border border-slate-700/70 rounded-2xl p-2 shadow-2xl space-y-1 z-[1001] max-h-60 overflow-y-auto">
              {searchResults.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => handleSelectSearchResult(h)}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {h.name}
                      </div>
                      <div className="text-[10px] text-zinc-400">{h.subhead}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-zinc-300">
                    {h.badgeText}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filter Pills with Tactical Atmospheric Glow */}
        <div className="flex items-center gap-1.5 sm:gap-2 max-w-full overflow-x-auto py-1.5 px-3.5 no-scrollbar bg-[#0E1626]/85 backdrop-blur-2xl border border-slate-700/60 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.6)] pointer-events-auto">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                : 'text-zinc-400 hover:text-white border border-transparent'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#06b6d4]"></span>
            <span>All Disasters</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('flood')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'flood'
                ? 'bg-red-500/20 text-red-300 border border-red-400/60 shadow-[0_0_15px_rgba(239,68,68,0.35)]'
                : 'text-zinc-400 hover:text-white border border-transparent'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]"></span>
            <span>Floods (Assam/Bihar)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('cyclone')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'cyclone'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.35)]'
                : 'text-zinc-400 hover:text-white border border-transparent'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_6px_#f59e0b]"></span>
            <span>Cyclones (Bay of Bengal)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('landslide')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'landslide'
                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/60 shadow-[0_0_15px_rgba(234,179,8,0.35)]'
                : 'text-zinc-400 hover:text-white border border-transparent'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_6px_#eab308]"></span>
            <span>Landslides (Wayanad)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilter('hub')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeFilter === 'hub'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/60 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                : 'text-zinc-400 hover:text-white border border-transparent'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]"></span>
            <span>Safe Hubs</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. FLOATING ZOOM & RECENTER BUTTONS (Bottom Right)             */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute bottom-5 right-4 z-[1000] flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setZoomAction('in')}
          aria-label="Zoom in"
          title="Zoom In"
          className="w-9 h-9 rounded-full bg-[#0E1626]/90 hover:bg-[#131D35] text-white border border-slate-700/70 shadow-xl flex items-center justify-center transition-all cursor-pointer active:scale-95 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setZoomAction('out')}
          aria-label="Zoom out"
          title="Zoom Out"
          className="w-9 h-9 rounded-full bg-[#0E1626]/90 hover:bg-[#131D35] text-white border border-slate-700/70 shadow-xl flex items-center justify-center transition-all cursor-pointer active:scale-95 hover:border-cyan-400/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => setZoomAction('recenter')}
          aria-label="Recenter all-India"
          title="Recenter All-India View"
          className="w-9 h-9 rounded-full bg-[#0E1626]/90 hover:bg-[#131D35] text-cyan-400 border border-slate-700/70 shadow-xl flex items-center justify-center transition-all cursor-pointer active:scale-95 hover:border-cyan-400/60 hover:shadow-[0_0_18px_rgba(6,182,212,0.4)]"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Left Live Ping Tag */}
      <div className="pointer-events-none absolute bottom-5 left-4 z-[1000] hidden sm:flex items-center gap-2 font-mono text-[10px] text-zinc-400 bg-slate-950/70 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
        <span>LIVE TELEMETRY STREAMING // 12ms</span>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. LEAFLET ALL-INDIA RADAR MAP CANVAS                         */}
      {/* (Color graded into deep obsidian delta tone with NO watermarks)*/}
      {/* ------------------------------------------------------------- */}
      {React.createElement(
        MapContainer as any,
        {
          center: [22.5937, 78.9629],
          zoom: 5,
          minZoom: 4,
          maxZoom: 10,
          maxBounds: [
            [6.0, 68.0],
            [37.5, 98.0]
          ],
          maxBoundsViscosity: 0.9,
          zoomControl: false,
          scrollWheelZoom: true,
          style: { height: '100%', width: '100%', background: '#080D1A' }
        },
        <>
          {/* ESRI World Dark Gray Base (Free, 0 Watermarks, Dark Subcontinental Cartography) */}
          {React.createElement(TileLayer as any, {
            attribution: '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; GIS Radar',
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
            maxZoom: 10,
            minZoom: 4
          })}

          {/* ESRI Dark Gray Reference (Labels & Coastal Borders) */}
          {React.createElement(TileLayer as any, {
            attribution: '',
            url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
            maxZoom: 10,
            minZoom: 4
          })}

          {/* Map Controller for Programmatic Pan/Zoom */}
          <MapController
            targetCoords={targetCoords}
            zoomAction={zoomAction}
            onResetZoomAction={() => setZoomAction(null)}
          />

          {/* Hotspot Radar Pins */}
          {visibleHotspots.map((hotspot) => {
            const icon = createHotspotIcon(hotspot.category, hotspot.badgeText);

            return React.createElement(
              Marker as any,
              { key: hotspot.id, position: [hotspot.lat, hotspot.lng], icon },
              React.createElement(
                Popup as any,
                { className: 'disaster-popup', closeButton: false },
                <div className="p-3.5 text-slate-100 min-w-[240px] max-w-[280px] bg-[#0E1626]/95 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl">
                  {/* Severity & Category Header */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        hotspot.severity === 'P0'
                          ? 'bg-red-500/20 text-red-300 border-red-500/40'
                          : hotspot.severity === 'P1'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : hotspot.severity === 'P2'
                          ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {hotspot.severity === 'SAFE' ? 'SAFE HAVEN' : `${hotspot.severity} • CRITICAL`}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase">
                      {hotspot.category}
                    </span>
                  </div>

                  {/* Hotspot Name */}
                  <h4 className="text-sm font-bold text-white mb-0.5 leading-snug">
                    {hotspot.name}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mb-2.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span>{hotspot.subhead}</span>
                  </p>

                  {/* Metric Box */}
                  <div className="bg-slate-950/80 rounded-xl p-2.5 border border-white/10 space-y-1.5 mb-3 text-[11px] font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">{hotspot.primaryMetricLabel}:</span>
                      <span className="text-white font-bold">{hotspot.primaryMetricValue}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400">{hotspot.secondaryMetricLabel}:</span>
                      <span className="text-cyan-400">{hotspot.secondaryMetricValue}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenTriage(hotspot)}
                    className="w-full py-2 px-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                  >
                    <span>View Triage Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )
            );
          })}
        </>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. INTERACTIVE ON-GROUND NEEDS MODAL LINKAGE                  */}
      {/* ------------------------------------------------------------- */}
      <OnGroundNeedsModal
        zone={selectedTriageZone}
        isOpen={!!selectedTriageZone}
        onClose={() => setSelectedTriageZone(null)}
      />

      {/* ------------------------------------------------------------- */}
      {/* 5. TACTICAL DELTA TONE COLOR GRADING & RADAR CSS ANIMATIONS   */}
      {/* ------------------------------------------------------------- */}
      <style jsx global>{`
        /* Color Grade ESRI Basemap Tiles to Match Misty Mangrove Delta Tone */
        .leaflet-tile-pane {
          filter: brightness(0.68) contrast(1.3) hue-rotate(192deg) saturate(0.85);
        }
        .leaflet-container {
          background: #080D1A !important;
        }

        .custom-radar-marker {
          background: transparent !important;
          border: none !important;
        }
        .hotspot-pin-wrapper {
          position: relative;
          width: 120px;
          height: 44px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .radar-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          z-index: 10;
          box-shadow: 0 0 10px currentColor;
          border: 1.5px solid #ffffff;
        }
        .dot-crimson { background: #ef4444; color: #ef4444; }
        .dot-amber { background: #f59e0b; color: #f59e0b; }
        .dot-yellow { background: #eab308; color: #eab308; }
        .dot-emerald { background: #10b981; color: #10b981; }

        .pulse-ring-anim {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 28px;
          height: 28px;
          margin-top: -14px;
          margin-left: -14px;
          border-radius: 50%;
          animation: radarRipple 2s cubic-bezier(0, 0.2, 0.8, 1) infinite;
        }
        .ping-crimson { border: 2px solid rgba(239, 68, 68, 0.85); background: rgba(239, 68, 68, 0.25); }
        .ping-yellow { border: 2px solid rgba(234, 179, 8, 0.85); background: rgba(234, 179, 8, 0.25); }
        .ping-emerald { border: 2px solid rgba(16, 185, 129, 0.85); background: rgba(16, 185, 129, 0.25); }

        .vortex-anim {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 34px;
          height: 34px;
          margin-top: -17px;
          margin-left: -17px;
          border-radius: 50%;
          border: 2px dashed #f59e0b;
          box-shadow: 0 0 14px rgba(245, 158, 11, 0.6);
          animation: vortexRotate 4s linear infinite;
        }
        .ring-vortex-amber { background: rgba(245, 158, 11, 0.2); }

        @keyframes radarRipple {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes vortexRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .radar-badge {
          position: absolute;
          bottom: 0px;
          font-family: monospace;
          font-size: 9.5px;
          font-weight: 700;
          padding: 1.5px 6.5px;
          border-radius: 9999px;
          white-space: nowrap;
          backdrop-filter: blur(12px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.8);
          letter-spacing: -0.2px;
          z-index: 12;
        }
        .badge-crimson { background: rgba(185, 28, 28, 0.9); border: 1px solid #ef4444; color: #fee2e2; }
        .badge-amber { background: rgba(180, 83, 9, 0.9); border: 1px solid #f59e0b; color: #fef3c7; }
        .badge-yellow { background: rgba(161, 98, 7, 0.9); border: 1px solid #eab308; color: #fef9c3; }
        .badge-emerald { background: rgba(4, 120, 87, 0.9); border: 1px solid #10b981; color: #d1fae5; }
      `}</style>
    </div>
  );
}
