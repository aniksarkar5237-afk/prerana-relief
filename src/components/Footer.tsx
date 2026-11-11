import React from 'react';
import { ExternalLink, ShieldCheck, PhoneCall, Radio, Activity, Cpu } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#080D1A]/90 backdrop-blur-2xl pt-16 pb-12 relative z-20 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ------------------------------------------------------------- */}
        {/* TOP 4-COLUMN GRID                                             */}
        {/* ------------------------------------------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* COLUMN 1: BRAND & DUAL TELEMETRY STATUS */}
          <div className="space-y-4">
            <div className="mb-2">
              <BrandLogo className="h-9 w-auto" showText={true} />
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              Decentralizing disaster relief through zero-MDR UPI routing and verified ground intelligence. Building trust block by block.
            </p>

            {/* Dual Telemetry Status Pills */}
            <div className="flex flex-col gap-2 pt-2 font-mono text-xs">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 w-fit shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>● Core Relay: Operational</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 w-fit shadow-[0_0_12px_rgba(6,182,212,0.15)]">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
                </span>
                <span>● Toll-Free 1938 IVRS: Ingesting Live</span>
              </div>
            </div>
          </div>

          {/* COLUMN 2: TRANSPARENCY */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wide font-mono uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-cyan-400 rounded-sm"></span>
              Transparency
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="#ledger"
                  className="text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">Live Ledger</span>
                  <ExternalLink className="w-3 h-3 text-cyan-400 opacity-70 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href="#escrow"
                  className="text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">Zero-MDR Escrow</span>
                </a>
              </li>
              <li>
                <a
                  href="#audits"
                  className="text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">Smart Contract Audits</span>
                </a>
              </li>
              <li>
                <a
                  href="#tax"
                  className="text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">80G Tax Certificates</span>
                  <ExternalLink className="w-3 h-3 text-cyan-400 opacity-70 group-hover:opacity-100" />
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: CLINICAL & FORENSIC ESCROW */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wide font-mono uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-emerald-400 rounded-sm"></span>
              Clinical & Forensic Escrow
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="#hospital-registry"
                  className="text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">Hospital Sign-Off Registry</span>
                </a>
              </li>
              <li>
                <a
                  href="#darpan"
                  className="text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">NITI Darpan Compliance</span>
                </a>
              </li>
              <li>
                <a
                  href="#sentinel-dhash"
                  className="text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">Sentinel dHash Anti-Tamper</span>
                </a>
              </li>
              <li>
                <a
                  href="#postgis-benchmarks"
                  className="text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">PostGIS Spatial Benchmarks</span>
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: EMERGENCY SUPPORT */}
          <div>
            <h3 className="text-white font-bold text-sm tracking-wide font-mono uppercase mb-4 flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-amber-400 rounded-sm"></span>
              Emergency Support
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="tel:1938"
                  className="text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1.5 group font-mono"
                >
                  <span className="text-amber-400">●</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">National Helpline (1938)</span>
                </a>
              </li>
              <li>
                <a
                  href="#ussd"
                  className="text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1.5 group font-mono"
                >
                  <span className="text-cyan-400">●</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">2G USSD (*139#)</span>
                </a>
              </li>
              <li>
                <a
                  href="#report"
                  className="text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">Field Distress Reporting</span>
                </a>
              </li>
              <li>
                <a
                  href="#volunteers"
                  className="text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform">Volunteer Roster</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* ------------------------------------------------------------- */}
        {/* BOTTOM ROW & CHALLENGE ATTRIBUTION                            */}
        {/* ------------------------------------------------------------- */}
        <div className="border-t border-white/10 pt-6 mt-12 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-400 gap-4">
          {/* Left Copyright */}
          <div>
            © 2026 PreranaAid (ReliefGrid). Zero platform fees, forever.
          </div>

          {/* Center Challenge Attribution Badge */}
          <div className="px-3 py-1 rounded-full bg-slate-800/80 border border-white/10 text-cyan-400 font-mono shadow-[0_0_15px_rgba(6,182,212,0.1)]">
            Built for Seva First Innovation Challenge (SFIC East)
          </div>

          {/* Right Quick Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-zinc-400">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <span className="text-zinc-600">·</span>
            <a href="#terms" className="hover:text-white transition-colors">Terms</a>
            <span className="text-zinc-600">·</span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <span>GitHub Repo</span>
            </a>
            <span className="text-zinc-600">·</span>
            <a href="#docs" className="hover:text-white transition-colors">Documentation</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
