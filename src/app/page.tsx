'use client';
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import AboutUsSection from '../components/AboutUsSection';
import PartnersSection from '../components/PartnersSection';
import ContactSection from '../components/ContactSection';
import DisasterAlertGrid from '../components/DisasterAlertGrid';
import DisasterMap from '../components/DisasterMap';
import CampaignFeed from '../components/CampaignFeed';
import QuickDonationModal from '../components/QuickDonationModal';
import Footer from '../components/Footer';
import PriorityRadar from '../components/PriorityRadar';
import FieldProofModal from '../components/FieldProofModal';
import EvacuationCrisisPanel from '../components/EvacuationCrisisPanel';
import QuickDistressReporter from '../components/QuickDistressReporter';
import LiveTelemetryTicker from '../components/LiveTelemetryTicker';
import HeroEmberOverlay from '../components/HeroEmberOverlay';
import { ArrowRight, Radio, Shield, MapPin, Activity, Compass, Layers } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('Home');
  const [selectedCause, setSelectedCause] = useState<any>(null);
  const [selectedCampaignForProofs, setSelectedCampaignForProofs] = useState<any>(null);
  const [isDistressReporterOpen, setIsDistressReporterOpen] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDonateClick = (cause: any) => {
    setSelectedCause(cause);
  };

  const handleViewProofs = (cause: any) => {
    setSelectedCampaignForProofs(cause.id || cause);
  };

  return (
    <div className="min-h-screen relative flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200 bg-[#080D1A] overflow-x-hidden text-slate-100">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. UNIVERSAL BACKGROUND & ATMOSPHERE SYSTEM (All tabs inherit) */}
      {/* ------------------------------------------------------------- */}
      {/* Full-Screen Natural Delta Canvas */}
      <div
        className="fixed inset-0 bg-cover bg-[center_48%] bg-no-repeat pointer-events-none -z-20 transition-all duration-700"
        style={{
          backgroundImage: `url('/delta-hero-bg.jpg')`,
          filter: activeTab === 'Home' ? 'brightness(1.04) contrast(1.06) saturate(1.16)' : 'brightness(0.95) contrast(1.08) saturate(1.18)',
        }}
      />

      {/* Subtle Organic Dark Obsidian Tint Layer (#080D1A) */}
      <div
        className="fixed inset-0 pointer-events-none -z-10 transition-colors duration-500 backdrop-blur-[1px]"
        style={{
          backgroundColor: activeTab === 'Home' ? 'rgba(8, 13, 26, 0.22)' : 'rgba(8, 13, 26, 0.45)',
        }}
      />

      {/* Persistent Volcanic Ember Sparks & Delta Fireflies (Floats behind glass cards on sub-tabs) */}
      {activeTab !== 'Home' && (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <HeroEmberOverlay />
        </div>
      )}

      {/* Top Misty Dusk Halo Layer */}
      <div
        className="fixed inset-x-0 top-0 h-40 sm:h-56 pointer-events-none -z-10 transition-opacity duration-500"
        style={{
          background:
            activeTab === 'Home'
              ? 'linear-gradient(to bottom, rgba(8, 13, 26, 0.65) 0%, rgba(8, 13, 26, 0.2) 45%, transparent 100%)'
              : 'linear-gradient(to bottom, rgba(14, 22, 38, 0.85) 0%, rgba(8, 13, 26, 0.5) 50%, transparent 100%)',
        }}
      />

      {/* Center Ambient Subtle Glow */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* ------------------------------------------------------------- */}
      {/* 2. NAVIGATION (Sticky, unified pill bar across all views)     */}
      {/* ------------------------------------------------------------- */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onOpenReporter={() => setIsDistressReporterOpen(true)}
      />

      {/* ------------------------------------------------------------- */}
      {/* 3. DYNAMIC TAB VIEWS                                          */}
      {/* ------------------------------------------------------------- */}
      <main className="flex-1 w-full relative z-10">

        {/* ----------------- TAB 1: HOME ----------------- */}
        {activeTab === 'Home' && (
          <div className="animate-in fade-in duration-300">
            {/* Organic Ethereal Hero Section */}
            <HeroSection
              onEmergencyClick={() => setIsDistressReporterOpen(true)}
              onDonateClick={() => {
                const el = document.getElementById('active-relief');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Seamless organic gradient bridge into telemetry modules */}
            <div className="w-full h-24 bg-gradient-to-b from-transparent via-[#080D1A]/80 to-[#080D1A] pointer-events-none -mt-16 relative z-10" />

            {/* Tactical Grid Overview Section */}
            <div id="active-relief" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
              
              {/* Quick Tab Switcher Hub */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                {[
                  {
                    title: 'Disaster Dashboard',
                    desc: 'National Triage & Early Warning',
                    tab: 'Disaster Dashboard',
                    icon: Activity,
                    color: 'text-amber-400',
                  },
                  {
                    title: 'Live Radar Map',
                    desc: 'Geospatial GIS Tracking Grid',
                    tab: 'Live Radar Map',
                    icon: Compass,
                    color: 'text-cyan-400',
                  },
                  {
                    title: 'Our Architecture',
                    desc: 'Executive Manifesto & Pillars',
                    tab: 'About us',
                    icon: Layers,
                    color: 'text-emerald-400',
                  },
                  {
                    title: 'Verified Partners',
                    desc: 'Rescue Flotillas & Escrow Nodes',
                    tab: 'Partners',
                    icon: Shield,
                    color: 'text-blue-400',
                  },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleTabChange(item.tab)}
                    className="p-5 rounded-2xl bg-[#0E1626]/75 hover:bg-[#0E1626]/95 backdrop-blur-xl border border-slate-700/50 hover:border-cyan-400/40 transition-all duration-300 text-left hover:-translate-y-1 shadow-lg group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <item.icon className={`w-5 h-5 ${item.color} group-hover:scale-110 transition-transform`} />
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </button>
                ))}
              </div>

              {/* Priority Triage Matrix */}
              <PriorityRadar />

              {/* Live Disaster Incident Grid */}
              <div className="mt-12">
                <DisasterAlertGrid onDonateClick={handleDonateClick} />
              </div>

              {/* Embedded GIS Tracking Preview */}
              <div className="mt-20 pt-16 border-t border-slate-800/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      Live Geospatial Telemetry Preview
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                      Active river basin sensors, cyclone trajectory models, and real-time distress coordinates.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTabChange('Live Radar Map')}
                    className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold text-xs transition-all flex items-center gap-1.5 self-start cursor-pointer"
                  >
                    <span>Full Tactical View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="bg-[#0E1626]/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-2 overflow-hidden shadow-2xl">
                  <DisasterMap />
                </div>
              </div>

              {/* Verified Community Relief Campaigns */}
              <div className="mt-20">
                <CampaignFeed onDonateClick={handleDonateClick} onViewProofs={handleViewProofs} />
              </div>
            </div>
          </div>
        )}

        {/* ----------------- TAB 2: ABOUT US ----------------- */}
        {activeTab === 'About us' && (
          <div className="animate-in fade-in duration-300">
            <AboutUsSection onLaunchConsole={() => setIsDistressReporterOpen(true)} />
          </div>
        )}

        {/* ----------------- TAB 3: LIVE RADAR MAP ----------------- */}
        {activeTab === 'Live Radar Map' && (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-20 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E1626]/80 border border-slate-700/60 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2">
                  <Radio className="w-3.5 h-3.5 animate-pulse" /> Live Multi-Layered Geospatial Tracking
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                  Tactical Disaster GIS Radar
                </h1>
                <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Real-time hydrometric river gauge monitoring, cyclone isobar wind vectors, and geofenced safe shelter routing across active flood corridors.
                </p>
              </div>

              {/* Legend Pill */}
              <div className="flex items-center gap-4 bg-[#0E1626]/90 px-4 py-2.5 rounded-2xl border border-slate-700/60 shadow-lg self-start">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">Severe</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">Warning</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  <span className="text-xs font-bold text-slate-200 uppercase tracking-wide">Advisory</span>
                </div>
              </div>
            </div>

            {/* Map Frame Embedded in Refined Glass Panel */}
            <div className="bg-[#0E1626]/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-3 shadow-2xl overflow-hidden mb-12">
              <DisasterMap />
            </div>

            {/* Lower Grid Alerts Embedded with Map */}
            <div className="bg-[#0E1626]/75 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-2">Ground Distress Vectors</h3>
              <p className="text-xs text-slate-400 mb-6">Verified emergency distress signals awaiting flotilla dispatch:</p>
              <DisasterAlertGrid onDonateClick={handleDonateClick} />
            </div>
          </div>
        )}

        {/* ----------------- TAB 4: DISASTER DASHBOARD ----------------- */}
        {activeTab === 'Disaster Dashboard' && (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-20 animate-in fade-in duration-300">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E1626]/80 border border-slate-700/60 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-3">
                <Activity className="w-3.5 h-3.5" /> Early Warning & Telephony Command Console
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-3">
                Disaster Response & Triage Dashboard
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                National triage prioritization matrix, CWC automated river threshold triggers, and real-time carrier USSD/IVRS emergency dispatch.
              </p>
            </div>

            {/* Priority Radar */}
            <div className="mb-12">
              <PriorityRadar />
            </div>

            {/* Evacuation Crisis Panel (USSD & IVRS voice simulator) */}
            <div className="bg-[#0E1626]/75 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-4 sm:p-8 shadow-2xl">
              <EvacuationCrisisPanel />
            </div>
          </div>
        )}

        {/* ----------------- TAB 5: PARTNERS ----------------- */}
        {activeTab === 'Partners' && (
          <div className="animate-in fade-in duration-300">
            <PartnersSection />
          </div>
        )}

        {/* ----------------- TAB 6: CONTACT US ----------------- */}
        {activeTab === 'Contact us' && (
          <div className="animate-in fade-in duration-300">
            <ContactSection />
          </div>
        )}

      </main>

      {/* ------------------------------------------------------------- */}
      {/* 4. FOOTER                                                     */}
      {/* ------------------------------------------------------------- */}
      <Footer />

      {/* ------------------------------------------------------------- */}
      {/* 5. REAL-TIME TICKER STATUS STRIP (Fixed Bottom Telemetry)     */}
      {/* ------------------------------------------------------------- */}
      <LiveTelemetryTicker />

      {/* ------------------------------------------------------------- */}
      {/* 6. PORTALED MODALS & EMERGENCY DISPATCHER                    */}
      {/* ------------------------------------------------------------- */}
      {selectedCause && (
        <QuickDonationModal
          cause={selectedCause}
          onClose={() => setSelectedCause(null)}
        />
      )}

      {selectedCampaignForProofs && (
        <FieldProofModal
          campaignId={selectedCampaignForProofs}
          onClose={() => setSelectedCampaignForProofs(null)}
        />
      )}

      {isDistressReporterOpen && (
        <QuickDistressReporter onClose={() => setIsDistressReporterOpen(false)} />
      )}
    </div>
  );
}
