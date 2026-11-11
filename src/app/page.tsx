'use client';
import React, { useState, useEffect } from 'react';
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
  const [isScrolled, setIsScrolled] = useState(false);

  // Dynamic scroll listener: triggers backdrop blur when viewport leaves Hero (scrollY >= 200)
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      setIsScrolled(scrollY >= 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Blur activates when scrolled past Hero on Home or on any other sub-section/tab
  const isBlurred = activeTab !== 'Home' || isScrolled;

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
    <div className="min-h-screen relative flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200 bg-transparent overflow-x-hidden text-slate-100">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. UNIVERSAL BACKGROUND & ATMOSPHERE SYSTEM (Single Persistent) */}
      {/* ------------------------------------------------------------- */}
      {/* Single Persistent Fixed Delta Tree Background */}
      <div className="fixed inset-0 -z-50 bg-[url('/delta-hero-bg.jpg')] bg-cover bg-center bg-no-repeat pointer-events-none" />

      {/* Fixed Scroll-Aware Backdrop Filter Layer */}
      <div
        id="global-backdrop-blur"
        className={`fixed inset-0 -z-40 pointer-events-none transition-all duration-700 ease-in-out ${
          isBlurred ? 'bg-black/55 backdrop-blur-md' : 'bg-transparent backdrop-blur-none'
        }`}
      />

      {/* Persistent Volcanic Ember Sparks & Delta Fireflies */}
      <div className="fixed inset-0 pointer-events-none -z-30 overflow-hidden">
        <HeroEmberOverlay />
      </div>

      {/* Top Subtle Dusk Vignette */}
      <div
        className="fixed inset-x-0 top-0 h-36 sm:h-48 pointer-events-none -z-30 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(to bottom, rgba(8, 13, 26, 0.7) 0%, rgba(8, 13, 26, 0.2) 60%, transparent 100%)',
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
                const el = document.getElementById('architecture-capabilities') || document.getElementById('active-relief');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Live Telemetry Ticker immediately below HeroSection */}
            <LiveTelemetryTicker />

            {/* About Us & Architecture Grid right after the ticker with proper semantic spacing */}
            <section id="architecture-capabilities" className="py-16 md:py-24 relative z-10">
              <AboutUsSection onLaunchConsole={() => setIsDistressReporterOpen(true)} />
            </section>

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
                    className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30 transition-all duration-300 text-left hover:-translate-y-1 shadow-2xl group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <item.icon className={`w-5 h-5 ${item.color} group-hover:scale-110 transition-transform`} />
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-xs text-zinc-300">{item.desc}</p>
                  </button>
                ))}
              </div>

              {/* Priority Triage Matrix */}
              <PriorityRadar onDonateClick={handleDonateClick} />

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
                    <p className="text-zinc-300 text-sm mt-1">
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

                <div className="w-full">
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
          <div className="pt-28 sm:pt-32 pb-24 animate-in fade-in duration-300">
            <AboutUsSection onLaunchConsole={() => setIsDistressReporterOpen(true)} />
          </div>
        )}

        {/* ----------------- TAB 3: LIVE RADAR MAP ----------------- */}
        {activeTab === 'Live Radar Map' && (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-20 animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-xl border border-white/10 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2 shadow-2xl">
                  <Radio className="w-3.5 h-3.5 animate-pulse" /> Live Multi-Layered Geospatial Tracking
                </div>
                <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
                  Tactical Disaster GIS Radar
                </h1>
                <p className="text-sm text-zinc-300 mt-1 max-w-2xl leading-relaxed">
                  Real-time hydrometric river gauge monitoring, cyclone isobar wind vectors, and geofenced safe shelter routing across active flood corridors.
                </p>
              </div>

              {/* Legend Pill */}
              <div className="flex items-center gap-4 bg-slate-900/60 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-white/10 shadow-2xl self-start">
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
            <div className="w-full mb-12">
              <DisasterMap />
            </div>

            {/* Lower Grid Alerts Embedded with Map */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-2">Ground Distress Vectors</h3>
              <p className="text-xs text-zinc-300 mb-6">Verified emergency distress signals awaiting flotilla dispatch:</p>
              <DisasterAlertGrid onDonateClick={handleDonateClick} />
            </div>
          </div>
        )}

        {/* ----------------- TAB 4: DISASTER DASHBOARD ----------------- */}
        {activeTab === 'Disaster Dashboard' && (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-20 animate-in fade-in duration-300">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-xl border border-white/10 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-3 shadow-2xl">
                <Activity className="w-3.5 h-3.5" /> Early Warning & Telephony Command Console
              </div>
              <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-3">
                Disaster Response & Triage Dashboard
              </h1>
              <p className="text-sm text-zinc-300 leading-relaxed">
                National triage prioritization matrix, CWC automated river threshold triggers, and real-time carrier USSD/IVRS emergency dispatch.
              </p>
            </div>

            {/* Priority Radar */}
            <div className="mb-12">
              <PriorityRadar onDonateClick={handleDonateClick} />
            </div>

            {/* Evacuation Crisis Panel (USSD & IVRS voice simulator) */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-8 shadow-2xl">
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
      {/* 5. PORTALED MODALS & EMERGENCY DISPATCHER                    */}
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
