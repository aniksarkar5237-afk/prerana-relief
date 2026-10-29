import React from 'react';
import { AlertTriangle, Navigation, HeartHandshake } from 'lucide-react';

const MOCK_ALERTS = [
  {
    id: 1,
    title: "Cachar District Flood Inundation",
    severity: "Critical Inundation",
    gps: "24.83° N, 92.77° E",
    ngo: "Assam Relief Team",
    needs: ["Water", "Baby Food", "Medical Kits"],
    target: 500000,
    raised: 312000,
    ngo_vpa: "assamrelief@upi"
  },
  {
    id: 2,
    title: "Coastal Cyclone Alert - Odisha",
    severity: "Severe Warning",
    gps: "19.81° N, 85.83° E",
    ngo: "Coastal Care Foundation",
    needs: ["Shelter Tents", "Rations", "Flashlights"],
    target: 800000,
    raised: 150000,
    ngo_vpa: "coastalcare@upi"
  }
];

export default function DisasterAlertGrid({ onDonateClick }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Live Disaster Grid</h2>
          <p className="text-slate-400 font-medium">Real-time geospatial alerts requiring immediate decentralized aid.</p>
        </div>
        <button className="hidden sm:flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium text-sm transition-colors">
          View All Alerts &rarr;
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {MOCK_ALERTS.map(alert => (
          <div key={alert.id} className="glass-panel p-6 rounded-2xl glow-border hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{alert.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">{alert.severity}</span>
                    <span className="text-slate-600">&bull;</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1"><Navigation className="w-3 h-3"/> {alert.gps}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-medium bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20">Verified NGO: {alert.ngo}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {alert.needs.map((need, idx) => (
                  <span key={idx} className="text-[10px] font-semibold bg-slate-800 text-slate-300 px-2 py-1 rounded uppercase tracking-wider border border-slate-700">
                    {need}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-slate-300">₹{(alert.raised/100000).toFixed(2)}L Raised</span>
                <span className="text-slate-500">Goal: ₹{(alert.target/100000).toFixed(2)}L</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-gradient-to-r from-red-500 to-orange-400 h-2 rounded-full" style={{ width: `${(alert.raised/alert.target)*100}%` }}></div>
              </div>
            </div>

            <button 
              onClick={() => onDonateClick({ ...alert, type: 'disaster' })}
              className="w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 hover:border-red-500/50 font-bold flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(239,68,68,0.1)]"
            >
              <HeartHandshake className="w-5 h-5" />
              Zero-Fee UPI Donate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
