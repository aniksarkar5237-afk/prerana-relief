'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PhoneCall,
  Cpu,
  ShieldAlert,
  Radio,
  Globe,
  Mail,
  ArrowRight,
  ShieldCheck,
  Compass,
  HeartHandshake,
  Layers,
  Navigation,
  FileCheck2,
  Lock,
  ExternalLink,
  Activity,
  CheckCircle2,
} from 'lucide-react';

interface AboutUsSectionProps {
  onLaunchConsole?: () => void;
  onNavigateContact?: () => void;
}

export default function AboutUsSection({ onLaunchConsole, onNavigateContact }: AboutUsSectionProps) {
  const [activeStep, setActiveStep] = useState(0);

  // 1. Three Core Architecture Feature Cards
  const architectureFeatures = [
    {
      id: 'telephony',
      title: 'Offline-First Telephony',
      subtitle: 'Toll-Free 1938 IVRS & 2G USSD (*139#) Fallback',
      tag: '2G GSM // ZERO-DATA INGEST',
      description:
        'Engineered for total blackout conditions when cell towers, fiber lines, and internet networks collapse. Marooned victims dial toll-free shortcode 1938 via basic 2G feature phones or trigger *139# USSD sessions to broadcast triage coordinates without active mobile data.',
      icon: PhoneCall,
      accentColor: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300',
      glow: 'group-hover:border-cyan-400/50 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]',
      highlights: [
        'Toll-Free 1938 emergency IVRS prompt',
        '2G USSD *139# fallback during tower failure',
        'Sub-45s carrier-agnostic packet ingestion',
      ],
    },
    {
      id: 'spatial-radar',
      title: 'PostGIS Spatial Radar',
      subtitle: 'ST_DWithin Clustering & Elevation Benchmarking',
      tag: 'GEOSPATIAL TOPOLOGICAL TRIAGE',
      description:
        'Autonomous spatial triage engine performing real-time ST_DWithin radius clustering across remote riverine delta sectors. Correlates distress GPS/cell tower coordinates against high-resolution topological elevation data to triage urgent boat rescues away from perilous flood crests.',
      icon: Cpu,
      accentColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
      glow: 'group-hover:border-emerald-400/50 group-hover:shadow-[0_0_30px_rgba(52,211,153,0.2)]',
      highlights: [
        'Automated ST_DWithin incident clustering',
        'Topological bathymetry & flood elevation models',
        'Dynamic boat-to-SOS safe vector routing',
      ],
    },
    {
      id: 'cryptographic-sentinel',
      title: 'Cryptographic Sentinel',
      subtitle: '64-bit dHash Perceptual Hashing & DARPAN Checksums',
      tag: 'ZERO-LEAKAGE FORENSIC ESCROW',
      description:
        'Fraud prevention pipeline utilizing 64-bit dHash perceptual image hashing to detect duplicate photo submissions and spoofed relief claims. Enforces automated statutory NITI Aayog Darpan ID and PAN checksum audits before milestone relief funds release via direct zero-MDR UPI.',
      icon: ShieldAlert,
      accentColor: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
      glow: 'group-hover:border-amber-400/50 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]',
      highlights: [
        '64-bit dHash forensic perceptual image hashing',
        'Statutory NITI Darpan & PAN checksum validation',
        '100% direct-to-field zero-MDR milestone escrow',
      ],
    },
  ];

  // 2. Interactive 5-Step System Workflow
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. SECTION HEADER (Tactical Command Dashboard Identity)        */}
      {/* ------------------------------------------------------------- */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        {/* Small uppercase mono tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/60 border border-white/10 text-[11px] font-mono font-bold tracking-[0.25em] text-cyan-400 uppercase mb-4 shadow-sm backdrop-blur-md">
          <Activity className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
          <span>SYSTEM ARCHITECTURE & CAPABILITIES</span>
        </div>

        {/* Main heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.12] mb-4">
          Engineered for Grid-Down Emergency Dispatch
        </h2>

        {/* Brief subhead detailing offline-first resilience */}
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
          Architected for uncompromising offline-first resilience across remote riverine delta zones (Sundarbans & Barak Basin). Ensuring uninterrupted humanitarian triage when conventional power, cell towers, and data backbones completely fail.
        </p>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. THREE CORE FEATURE CARDS (1 col on mobile, 3 cols desktop)  */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-20 sm:mb-24">
        {architectureFeatures.map((feature) => (
          <motion.div
            key={feature.id}
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`relative rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl ${feature.glow} transition-all duration-300 group overflow-hidden`}
          >
            {/* Subtle top ambient glow inside the card */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none -mr-16 -mt-16 group-hover:bg-cyan-500/10 transition-colors" />

            <div>
              {/* Card Header: Icon + Tactical Mono Tag */}
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-center shadow-inner group-hover:border-white/20 transition-colors">
                  <feature.icon className={`w-6 h-6 ${feature.accentColor}`} />
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${feature.badgeBg}`}>
                  {feature.tag}
                </span>
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2 group-hover:text-cyan-200 transition-colors">
                {feature.title}
              </h3>
              <div className="text-xs sm:text-sm font-semibold text-slate-300 mb-4 font-mono leading-snug">
                {feature.subtitle}
              </div>

              {/* Deep Technical Description */}
              <p className="text-xs sm:text-[13px] text-zinc-300 leading-relaxed font-normal mb-6">
                {feature.description}
              </p>
            </div>

            {/* Tactical Highlights Bulleted HUD */}
            <div className="pt-4 border-t border-white/10 space-y-2 font-mono text-[11px] sm:text-xs text-zinc-300">
              {feature.highlights.map((highlight, hIdx) => (
                <div key={hIdx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                  <span className="text-zinc-200">{highlight}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. FOUNDER & CORE LEADERSHIP CARD                             */}
      {/* ------------------------------------------------------------- */}
      <div className="max-w-5xl mx-auto rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl p-6 sm:p-8 md:p-10 mb-20 relative overflow-hidden">
        {/* Interior ambient light bloom */}
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
            <div className="text-zinc-300 text-xs sm:text-sm mb-4">
              Dept. of Computer Science & Engineering, JIS College of Engineering
            </div>

            {/* Manifesto Paragraph */}
            <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed mb-5 font-normal max-w-xl">
              Disaster relief fails not from a lack of human empathy, but from broken last-mile infrastructure. PreranaAid was engineered to bridge the 2G gap and guarantee verified resources reach marooned families.
            </p>

            {/* 3 Glowing Credential Chips */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-5">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-slate-950/80 border border-white/10 text-zinc-300 shadow-sm">
                Full-Stack Geospatial Engineering
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-slate-950/80 border border-white/10 text-zinc-300 shadow-sm">
                Ground Leadership & Volunteer Mobilization
              </span>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-medium bg-slate-950/80 border border-amber-500/50 text-amber-200 shadow-[0_0_14px_rgba(245,158,11,0.25)]">
                Zero-MDR Humanitarian Commitment
              </span>
            </div>

            {/* Social & Action HUD */}
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <a
                href="mailto:aniksarkar5237@gmail.com"
                className="px-4 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/90 text-slate-100 text-xs font-semibold border border-white/10 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
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
                className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700/90 text-slate-300 hover:text-white border border-white/10 transition-all shadow-sm cursor-pointer"
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
                className="p-2 rounded-full bg-slate-800/80 hover:bg-slate-700/90 text-slate-300 hover:text-white border border-white/10 transition-all shadow-sm cursor-pointer"
                aria-label="Web Portfolio"
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. INTERACTIVE 5-STEP SYSTEM WORKFLOW                         */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-10 mb-16 shadow-2xl relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
              <Layers className="w-4 h-4" /> Telemetry & Settlement Architecture
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              5-Step Zero-Leakage Pipeline
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-300 bg-slate-950/80 px-3.5 py-1.5 rounded-full border border-white/10 self-start">
            Total Cycle Latency: <strong className="text-emerald-400">&lt; 3.5 Mins</strong>
          </span>
        </div>

        {/* Desktop Horizontal Timeline / Mobile Vertical Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {workflowSteps.map((step, idx) => (
            <div
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`p-5 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                activeStep === idx
                  ? 'bg-slate-950/90 border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.15)] -translate-y-1'
                  : 'bg-slate-950/40 border-white/10 hover:border-white/20 hover:bg-slate-950/60'
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
                <p className="text-xs text-zinc-300 leading-relaxed font-normal">
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
      {/* 5. REAL-TIME IMPACT COUNTERS                                  */}
      {/* ------------------------------------------------------------- */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">₹0 Cut</div>
            <div className="text-xs font-medium text-zinc-300 uppercase tracking-wider mt-1">Middleman Deductions</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono tracking-tight">&lt; 45s</div>
            <div className="text-xs font-medium text-zinc-300 uppercase tracking-wider mt-1">Telephony Signal Ingest</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">100%</div>
            <div className="text-xs font-medium text-zinc-300 uppercase tracking-wider mt-1">Geotag Forensic Audited</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-rose-400 font-mono tracking-tight">24/7/365</div>
            <div className="text-xs font-medium text-zinc-300 uppercase tracking-wider mt-1">Grid Resiliency & Carrier Link</div>
          </div>
        </div>
      </div>

    </div>
  );
}
