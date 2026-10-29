import React from 'react';
import { Shield, ExternalLink, Activity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-700/60 bg-[#0E1626]/85 backdrop-blur-xl pt-16 pb-16 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">PreranaAid</span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
              Decentralizing disaster relief through zero-MDR UPI routing and verified ground intelligence. Building trust block by block.
            </p>
            <div className="flex items-center gap-3 text-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 font-medium">All Systems Operational</span>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Transparency</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2">Live Ledger <ExternalLink className="w-3 h-3"/></a></li>
              <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">NGO Verification Process</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Smart Contract Audits</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors flex items-center gap-2">80G Tax Certificates <ExternalLink className="w-3 h-3"/></a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Emergency Support</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">National Relief Helpline</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Report Active Disaster</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">NGO Onboarding</a></li>
              <li><a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">Volunteer Dispatch</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} PreranaAid. Zero platform fees, forever.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-500 hover:text-white text-sm">Privacy Policy</a>
            <a href="#" className="text-slate-500 hover:text-white text-sm">Terms of Service</a>
            <a href="#" className="text-slate-500 hover:text-white text-sm">Open Source</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
