'use client';
import React, { useState } from 'react';
import {
  ShieldCheck,
  Compass,
  Radio,
  HeartHandshake,
  Cpu,
  Navigation,
  FileCheck2,
  CheckCircle2,
  Lock,
  ArrowRight,
  Layers,
  MoreVertical,
  Globe,
  Mail,
  ExternalLink,
} from 'lucide-react';

interface AboutUsSectionProps {
  onLaunchConsole?: () => void;
  onNavigateContact?: () => void;
}

export default function AboutUsSection({ onLaunchConsole, onNavigateContact }: AboutUsSectionProps) {
  const [activeStep, setActiveStep] = useState(0);

  const pillars = [
    {
      badge: 'Our Mission',
      title: 'Our Mission',
      subtitle: 'Radical Transparency in Crisis Rescue',
      description: 'Eradicating intermediary fraud and direct zero-MDR UPI routing.',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
      dotsColor: 'text-emerald-400',
      glow: 'hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]',
    },
    {
      badge: 'Our Vision',
      title: 'Our Vision',
      subtitle: 'Autonomous Disaster Grid',
      description: 'Self-triage and coordinate boat rescues within minutes of cellular failure.',
      icon: Compass,
      color: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
      dotsColor: 'text-cyan-400',
      glow: 'hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]',
    },
    {
      badge: 'Our Goal',
      title: 'Our Goal',
      subtitle: 'Sub-60s Offline Telephony',
      description: '1938 IVRS/USSD triage with PostGIS automated shelter allocation.',
      icon: Radio,
      color: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
      dotsColor: 'text-amber-400',
      glow: 'hover:border-amber-400/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]',
    },
    {
      badge: 'Societal Impact',
      title: 'Societal Impact',
      subtitle: 'Community Empowerment',
      description: '100% fund-to-field delivery with Sentinel dHash forensic verification.',
      icon: HeartHandshake,
      color: 'text-rose-400',
      badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-300',
      dotsColor: 'text-rose-400',
      glow: 'hover:border-rose-400/50 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      tag: 'Offline Signal Ingest',
      title: '1938 2G Telephony',
      description:
        'Marooned victim dials emergency shortcode 1938 via basic 2G feature phone (USSD/IVRS audio prompt) without internet access.',
      icon: Radio,
      accent: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    },
    {
      step: '02',
      tag: 'AI & Geospatial Triage',
      title: 'PostGIS Risk Mapping',
      description:
        'Natural language parser extracts location, urgency, and medical needs, ingesting coordinates into PostGIS with automated elevation risk mapping.',
      icon: Cpu,
      accent: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    },
    {
      step: '03',
      tag: 'Flotilla & NGO Auto-Dispatch',
      title: 'Tactical Boat Routing',
      description:
        'Nearby verified NGO volunteers and rescue boat unions receive targeted geo-pings with safe topological routing away from active flood surges.',
      icon: Navigation,
      accent: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    },
    {
      step: '04',
      tag: 'Sentinel Forensics',
      title: 'Cryptographic dHash',
      description:
        'Ground photos submitted for fund release are verified via Sentinel perceptual dHash against duplicate reuse and timestamp tampering.',
      icon: FileCheck2,
      accent: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    },
    {
      step: '05',
      tag: 'Zero-MDR Settlement',
      title: 'Direct UPI Release',
      description:
        'Upon multi-party verification, milestone escrow funds are instantly released directly to local supplier VPAs with 0% platform deductions.',
      icon: Lock,
      accent: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-24 relative z-10">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. FOUNDER & CORE LEADERSHIP CARD (High-Luxury Glassmorphic) */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-5xl mx-auto rounded-3xl bg-[#0E1626]/80 backdrop-blur-2xl border border-slate-700/60 shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-6 sm:p-8 md:p-10 mb-14 relative overflow-hidden">
        {/* Subtle interior ambient light bloom */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          
          {/* Left Avatar Column: Portrait + Tactical Radar Ring + Curved Text */}
          <div className="relative flex-shrink-0 flex items-center justify-center w-56 h-56 sm:w-64 sm:h-64">
            
            {/* Outer Subtle Rotating Halo */}
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl animate-pulse" />

            {/* SVG Circular Tactical Badge Label along the curved ring */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none select-none"
              viewBox="0 0 256 256"
            >
              <defs>
                {/* Clockwise circular path starting from lower-left around the top to lower-right */}
                <path
                  id="avatarTextRing"
                  d="M 32, 142 A 96,96 0 1,1 224, 142"
                  fill="none"
                />
              </defs>
              <text className="text-[9.5px] font-mono font-bold tracking-[0.22em] fill-emerald-300/90 uppercase drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]">
                <textPath href="#avatarTextRing" startOffset="50%" textAnchor="middle">
                  OPERATIONAL LEAD // DISASTER LOGISTICS & PROTOCOLS
                </textPath>
              </text>
            </svg>

            {/* Circular Portrait Frame with Active Glowing Radar Ring */}
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-full overflow-hidden border-2 border-emerald-400/80 shadow-[0_0_25px_rgba(52,211,153,0.5)] bg-slate-900 flex items-center justify-center">
              <img
                src="/founder-anik.jpg"
                alt="Anik Sarkar - Founder & Lead System Architect"
                className="w-full h-full object-cover object-top select-none"
              />
            </div>

            {/* Animated Green Pulse Dot at the 6 o'clock Position */}
            <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_12px_#34d399]" />
            </div>
          </div>

          {/* Right Information Column */}
          <div className="flex-1 text-center md:text-left">
            {/* Category Sub-Header */}
            <div className="text-xs font-mono font-bold tracking-widest text-slate-400 uppercase mb-1">
              FOUNDER & LEADERSHIP
            </div>

            {/* Founder Name */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
              Anik Sarkar
            </h2>

            {/* Title & Affiliation */}
            <div className="text-sky-400 font-semibold text-sm sm:text-base mb-0.5">
              Founder & Lead System Architect
            </div>
            <div className="text-slate-300 text-xs sm:text-sm mb-4">
              Dept. of Computer Science & Engineering, JIS College of Engineering
            </div>

            {/* Manifesto Paragraph */}
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed mb-5 font-normal max-w-xl">
              Disaster relief fails not from a lack of human empathy, but from broken last-mile infrastructure. PreranaAid was engineered to bridge the 2G gap and guarantee verified resources reach marooned families.
            </p>

            {/* 3 Glowing Credential Chips */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-5">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-slate-900/80 border border-slate-700/80 text-slate-200 shadow-sm">
                Full-Stack Geospatial Engineering
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-slate-900/80 border border-slate-700/80 text-slate-200 shadow-sm">
                Ground Leadership & Volunteer Mobilization
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-slate-900/80 border border-amber-500/60 text-amber-200 shadow-[0_0_14px_rgba(245,158,11,0.25)]">
                Zero-MDR Humanitarian Commitment
              </span>
            </div>

            {/* Social & Action HUD */}
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <a
                href="mailto:aniksarkar5237@gmail.com"
                className="px-4 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/90 text-slate-100 text-xs font-semibold border border-slate-700 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-slate-300" />
                <span>Contact</span>
              </a>

              {/* Twitter / X */}
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Founder on X"
                className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700/90 text-slate-300 hover:text-white border border-slate-700 transition-all shadow-sm cursor-pointer"
                aria-label="X Profile"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Web / Portfolio */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                title="Open Source Portfolio"
                className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700/90 text-slate-300 hover:text-white border border-slate-700 transition-all shadow-sm cursor-pointer"
                aria-label="Web Portfolio"
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. CORE PILLARS SECTION (Below Founder Card)                  */}
      {/* ------------------------------------------------------------- */}
      <div className="mb-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
            Engineered for Resilience. Built for Zero Leakage.
          </h3>
          <div className="text-xs font-mono font-bold tracking-[0.25em] text-cyan-400 uppercase">
            CORE PILLARS
          </div>
        </div>

        {/* 4-Column Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className={`bg-[#0E1626]/70 hover:bg-[#0E1626]/90 backdrop-blur-xl border border-slate-700/50 ${pillar.glow} rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 shadow-[0_8px_30px_rgba(0,0,0,0.35)] flex flex-col justify-between`}
            >
              <div>
                {/* Top Row: Icon Box + Title + Vertical 3-Dots */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-900/90 border border-slate-700/60 flex items-center justify-center shadow-inner">
                      <pillar.icon className={`w-5 h-5 ${pillar.color}`} />
                    </div>
                    <span className="text-sm font-bold text-white tracking-tight">
                      {pillar.title}
                    </span>
                  </div>

                  {/* Tactical Vertical 3 Dots */}
                  <div className={`flex flex-col gap-0.5 ${pillar.dotsColor}`}>
                    <span className="w-1 h-1 rounded-full bg-current opacity-80" />
                    <span className="w-1 h-1 rounded-full bg-current opacity-80" />
                    <span className="w-1 h-1 rounded-full bg-current opacity-80" />
                  </div>
                </div>

                {/* Subtitle */}
                <h4 className="text-sm font-semibold text-slate-100 mb-1.5 leading-snug">
                  {pillar.subtitle}
                </h4>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. INTERACTIVE 5-STEP SYSTEM WORKFLOW                         */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#0E1626]/75 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-6 sm:p-10 mb-16 shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" /> Telemetry & Settlement Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              5-Step Zero-Leakage Pipeline
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-800 self-start">
            Total Cycle Latency: <strong className="text-emerald-400">&lt; 3.5 Mins</strong>
          </span>
        </div>

        {/* Desktop Horizontal Timeline / Mobile Vertical Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {workflowSteps.map((step, idx) => (
            <div
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                activeStep === idx
                  ? 'bg-slate-900/90 border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.15)] -translate-y-1'
                  : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-extrabold text-slate-500">
                    STEP {step.step}
                  </span>
                  <div className={`p-2 rounded-xl border ${step.accent}`}>
                    <step.icon className="w-4 h-4" />
                  </div>
                </div>

                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 block mb-1">
                  {step.tag}
                </span>
                <h4 className="text-sm font-bold text-white mb-2 leading-tight">
                  {step.title}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
                  {step.description}
                </p>
              </div>

              {idx < 4 && (
                <div className="hidden md:flex justify-end pt-3 text-slate-600">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. REAL-TIME IMPACT COUNTERS                                  */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-[#0E1626]/85 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-4 sm:p-6 shadow-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">₹0 Cut</div>
            <div className="text-xs font-medium text-slate-300 uppercase tracking-wider mt-1">Middleman Deductions</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono tracking-tight">&lt; 45s</div>
            <div className="text-xs font-medium text-slate-300 uppercase tracking-wider mt-1">Telephony Signal Ingest</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">100%</div>
            <div className="text-xs font-medium text-slate-300 uppercase tracking-wider mt-1">Geotag Forensic Audited</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono tracking-tight">24/7/365</div>
            <div className="text-xs font-medium text-slate-300 uppercase tracking-wider mt-1">Grid Resiliency & Carrier Link</div>
          </div>
        </div>
      </div>

    </div>
  );
}
