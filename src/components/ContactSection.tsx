'use client';
import React, { useState } from 'react';
import {
  PhoneCall,
  Radio,
  Mail,
  MapPin,
  ShieldCheck,
  Send,
  Building,
  CheckCircle2,
  Lock,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

export default function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    role: 'NGO Coordinator',
    phone: '',
    message: '',
  });

  const nodalOfficers = [
    {
      region: 'Sundarbans Delta Zone A (West Bengal)',
      officer: 'Debabrata Mukherjee, WBCS',
      desk: 'District Disaster Emergency Cell, Canning Sub-division',
      phone: '+91 3218-255201',
      directChannel: 'VHF Ch 16 / Telephony 1938',
      status: 'Online • River Patrol Active',
    },
    {
      region: 'Barak Valley River Basin (Assam)',
      officer: 'Ananya Hazarika, ACS',
      desk: 'DDMA Cachar, Silchar DC Complex',
      phone: '+91 3842-245813',
      directChannel: 'Toll-free 1077 / Telephony 1938',
      status: 'Online • Flood Early Warning P1',
    },
    {
      region: 'Coastal Puri Cyclone Command (Odisha)',
      officer: 'Satyajit Patnaik, OAS',
      desk: 'OSDMA Emergency Operations Centre',
      phone: '+91 6752-223400',
      directChannel: 'Satellite Trunk / USSD *999#',
      status: 'Standby • Multi-purpose Shelters Active',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', organization: '', role: 'NGO Coordinator', phone: '', message: '' });
    }, 4000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 pb-20">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E1626]/80 border border-slate-700/60 backdrop-blur-xl text-xs font-mono font-bold text-rose-400 uppercase tracking-wider mb-4">
          <PhoneCall className="w-3.5 h-3.5 animate-pulse" /> 24/7 District Command Telephony & Liaison
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
          Direct Liaison & Transparency Ledger
        </h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Connect directly with state disaster management nodal desks, initiate formal ground NGO onboarding, or query cryptographic fund disbursement audits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Left Column: District Nodal Directory (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0E1626]/75 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
              <div>
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                  Government Coordination
                </span>
                <h3 className="text-xl font-bold text-white">District Nodal Liaison Desks</h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> Live Line Active
              </span>
            </div>

            <div className="space-y-4">
              {nodalOfficers.map((nodal, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                      <h4 className="font-bold text-white text-base">{nodal.region}</h4>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-md self-start sm:self-auto">
                      {nodal.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mb-3 ml-6 font-medium">
                    {nodal.officer} • <span className="text-slate-400">{nodal.desk}</span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800/60 text-xs ml-6">
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-mono">Official Landline</span>
                      <span className="font-mono text-white font-semibold">{nodal.phone}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-mono">Emergency Carrier Routing</span>
                      <span className="font-mono text-rose-400 font-semibold">{nodal.directChannel}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Carrier Access Bar */}
          <div className="bg-[#0E1626]/75 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Emergency Signal Shortcode: 1938</h4>
                <p className="text-xs text-slate-400">Operational on Airtel, Jio, BSNL & Vi feature phones without data plan.</p>
              </div>
            </div>
            <a
              href="tel:1938"
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/20 whitespace-nowrap"
            >
              <PhoneCall className="w-3.5 h-3.5" /> Dial 1938
            </a>
          </div>
        </div>

        {/* Right Column: Direct Dispatch & Onboarding Form */}
        <div className="bg-[#0E1626]/85 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <MessageSquare className="w-4 h-4" /> Secure Transmission Desk
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Partner & Nodal Inquiries</h3>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Submit flotilla registration, report infrastructure damages, or request emergency satellite terminal allocation.
            </p>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-center animate-in fade-in duration-300">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <h4 className="font-bold text-white text-base mb-1">Transmission Received</h4>
                <p className="text-xs text-slate-300">Your dispatch has been registered with the Central Triage Desk.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-white rounded-xl text-xs outline-none focus:border-cyan-400"
                    placeholder="E.g. Capt. Bikram Roy"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Organization / Panchayat *</label>
                  <input
                    type="text"
                    required
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-white rounded-xl text-xs outline-none focus:border-cyan-400"
                    placeholder="E.g. Gosaba Fishermen Welfare Co-op"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Phone Number (SMS verified) *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-white rounded-xl text-xs outline-none focus:border-cyan-400 font-mono"
                    placeholder="+91..."
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Message / Operational Need *</label>
                  <textarea
                    rows={3}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-white rounded-xl text-xs outline-none focus:border-cyan-400 resize-none"
                    placeholder="Provide details on equipment, village coordinates, or relief request..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" /> Dispatch Inquiry
                </button>
              </form>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Encrypted Signal Gateway</span>
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
