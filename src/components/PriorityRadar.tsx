import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, AlertCircle, Droplets, MapPin, Search } from 'lucide-react';

export default function PriorityRadar() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Attempt to fetch from backend, fallback to mock data
    fetch('http://localhost:5000/api/agents/priority-matrix')
      .then(res => res.json())
      .then(json => {
        if (json && json.length > 0) setData(json);
        else throw new Error("Empty or invalid");
      })
      .catch(err => {
        // Fallback mock data
        setData([
          { id: 1, state: 'Assam', district: 'Silchar', score: 85, rainfallIndex: '+120mm', riverDanger: '+1.5m', unaddressedCount: 42, severity: 'P0' },
          { id: 2, state: 'Bihar', district: 'Patna', score: 62, rainfallIndex: '+50mm', riverDanger: '+0.4m', unaddressedCount: 15, severity: 'P1' },
          { id: 3, state: 'Kerala', district: 'Wayanad', score: 38, rainfallIndex: '+15mm', riverDanger: '-0.2m', unaddressedCount: 5, severity: 'P2' },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  const getSeverityStyles = (severity) => {
    switch(severity) {
      case 'P0': return {
        border: 'border-red-500/50',
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        icon: <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />,
        label: 'P0 - Life Safety Critical',
        bar: 'bg-red-500',
        glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]'
      };
      case 'P1': return {
        border: 'border-amber-500/50',
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        icon: <AlertCircle className="w-4 h-4 text-amber-500" />,
        label: 'P1 - Urgent Supply Need',
        bar: 'bg-amber-500',
        glow: ''
      };
      case 'P2': default: return {
        border: 'border-cyan-500/50',
        bg: 'bg-cyan-500/10',
        text: 'text-cyan-400',
        icon: <Activity className="w-4 h-4 text-cyan-500" />,
        label: 'P2 - Relief & Rehab',
        bar: 'bg-cyan-500',
        glow: ''
      };
    }
  };

  if (loading) {
    return <div className="animate-pulse h-32 bg-slate-800/50 rounded-2xl"></div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
          <Activity className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">National Disaster Triage Radar</h2>
          <p className="text-sm text-cyan-400/80 font-mono tracking-widest uppercase mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span> Agent 2 Ingest Live
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map(zone => {
          const styles = getSeverityStyles(zone.severity);
          
          return (
            <div key={zone.id} className={`relative glass-panel rounded-2xl p-5 border ${styles.border} ${styles.glow} bg-[#0B0F19]/80 backdrop-blur-xl transition-transform hover:-translate-y-1`}>
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {zone.district}, {zone.state}
                  </h3>
                  <div className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${styles.bg} ${styles.text} border ${styles.border}`}>
                    {styles.icon} {styles.label}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-white">{zone.score}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Urgency Score</div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div>
                  <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <Droplets className="w-3 h-3" /> Rainfall / River
                  </div>
                  <div className="text-sm font-semibold text-slate-200">
                    <span className="text-blue-400">{zone.rainfallIndex}</span> <span className="text-slate-500">|</span> <span className="text-red-400">{zone.riverDanger}</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Field Distress
                  </div>
                  <div className="text-sm font-semibold text-slate-200">
                    {zone.unaddressedCount} Active Cases
                  </div>
                </div>
              </div>

              {/* Gauge */}
              <div className="mb-6">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500">Urgency Level</span>
                  <span className={styles.text}>{zone.score}/100</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className={`h-full rounded-full ${styles.bar}`} style={{ width: `${zone.score}%` }}></div>
                </div>
              </div>

              {/* Action */}
              <button className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-colors border border-slate-700 hover:border-slate-500 flex items-center justify-center gap-2">
                <Search className="w-4 h-4" /> View On-Ground Needs
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
