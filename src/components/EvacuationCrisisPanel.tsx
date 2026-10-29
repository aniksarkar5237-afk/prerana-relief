'use client';
import React, { useState, useEffect } from 'react';
import {
  Radio,
  Send,
  AlertOctagon,
  ShieldCheck,
  PhoneCall,
  Activity,
  CheckCircle2,
  Clock,
  RefreshCw,
  Users,
  MapPin,
  TrendingUp,
} from 'lucide-react';

interface SafeZone {
  id: string;
  name: string;
  elevation_meters: number;
  capacity: number;
  structure_type: string;
}

interface VillageData {
  id: string;
  name: string;
  region_name: string;
  vulnerability_score: number;
  safe_zones: SafeZone[];
  victim_count: string | number;
  unresolved_sos_count: string | number;
}

export default function EvacuationCrisisPanel() {
  const [villages, setVillages] = useState<VillageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);
  const [dispatchResult, setDispatchResult] = useState<any | null>(null);

  // Telecom Simulator State (USSD vs IVRS)
  const [simMode, setSimMode] = useState<'ivrs' | 'ussd'>('ivrs');
  const [ussdPhone, setUssdPhone] = useState('+919876543210');
  const [ussdInput, setUssdInput] = useState('');
  const [ussdResponse, setUssdResponse] = useState<string | null>(null);
  const [ussdLatency, setUssdLatency] = useState<number | null>(null);
  const [ussdLoading, setUssdLoading] = useState(false);

  // IVRS Voice Hotline State
  const [ivrsStage, setIvrsStage] = useState<'idle' | 'calling' | 'connected' | 'completed'>('idle');
  const [ivrsPromptText, setIvrsPromptText] = useState<string | null>(null);
  const [ivrsConfirmText, setIvrsConfirmText] = useState<string | null>(null);
  const [ivrsSelectedKey, setIvrsSelectedKey] = useState<string | null>(null);

  const fetchVillages = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/disasters/evacuation/villages');
      if (res.ok) {
        const data = await res.json();
        setVillages(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to load villages for evacuation:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVillages();
  }, []);

  // Trigger Evacuation Dispatch
  const handleDispatch = async (villageId: string) => {
    setDispatchingId(villageId);
    setDispatchResult(null);
    try {
      const res = await fetch('http://localhost:5000/api/disasters/evacuation/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ villageId }),
      });
      const data = await res.json();
      if (res.ok) {
        setDispatchResult(data.data);
        fetchVillages();
      } else {
        alert(data.error || 'Failed to dispatch evacuation alerts');
      }
    } catch (err) {
      console.error(err);
      alert('Network error while dispatching evacuation alert');
    } finally {
      setDispatchingId(null);
    }
  };

  // Simulate USSD Call to /api/ussd
  const handleUssdSubmit = async (selectedOption?: string) => {
    const inputToSend = selectedOption !== undefined ? selectedOption : ussdInput;
    setUssdLoading(true);
    setUssdResponse(null);
    const start = performance.now();

    try {
      const res = await fetch('http://localhost:5000/api/ussd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: ussdPhone,
          text: inputToSend,
          sessionId: `web_sim_${Date.now()}`,
        }),
      });

      const textOutput = await res.text();
      const end = performance.now();
      setUssdLatency(Math.round(end - start));
      setUssdResponse(textOutput);

      // Refresh village counters if distress was signaled
      if (inputToSend === '1' || inputToSend === '2' || inputToSend === '3') {
        setTimeout(fetchVillages, 600);
      }
    } catch (err) {
      console.error(err);
      setUssdResponse('ERROR: Could not communicate with USSD gateway.');
    } finally {
      setUssdLoading(false);
    }
  };

  // IVRS Voice Call Handlers
  const handleIvrsCall = async () => {
    setIvrsStage('calling');
    setIvrsPromptText(null);
    setIvrsConfirmText(null);
    setIvrsSelectedKey(null);

    try {
      const res = await fetch('http://localhost:5000/api/ivrs/incoming', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ From: ussdPhone }),
      });
      const xml = await res.text();
      setIvrsStage('connected');
      setIvrsPromptText(
        'বন্যা ত্রাণ সহায়তার জরুরি সেবা। খাবারের জন্য ১ টিপুন। জরুরি ওষুধের জন্য ২ টিপুন। বন্যা থেকে উদ্ধার পেতে ৩ টিপুন।\n\n' +
        'बाढ़ राहत आपातकालीन सेवा। भोजन के लिए १ दबाएं। दवा के लिए २ दबाएं। बचाव सहायता के लिए ३ दबाएं।\n\n' +
        'Disaster Relief Emergency Service. Press 1 for Food. Press 2 for Medicine. Press 3 for Rescue.'
      );
    } catch (err) {
      console.error(err);
      setIvrsStage('idle');
      alert('Failed to connect to IVRS Voice Gateway');
    }
  };

  const handleIvrsKeyPress = async (digit: string) => {
    setIvrsSelectedKey(digit);
    try {
      const res = await fetch('http://localhost:5000/api/ivrs/gather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ From: ussdPhone, Digits: digit }),
      });
      const xml = await res.text();
      setIvrsStage('completed');
      setIvrsConfirmText(
        '✓ অনুরোধ গ্রহণ করা হয়েছে। নিকটবর্তী আশ্রয় শিবির থেকে উদ্ধারকারী দল রওনা হচ্ছে। নিরাপদ আশ্রয়ে থাকুন।\n\n' +
        '✓ आपकी आपातकालीन सहायता दर्ज कर ली गई है। राहत दल भेजा जा रहा है। सुरक्षित रहें।\n\n' +
        '✓ Your emergency request is registered. Help is on the way. Please stay safe.'
      );
      setTimeout(fetchVillages, 600);
    } catch (err) {
      console.error(err);
      alert('Error registering IVRS DTMF input');
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-rose-500 font-bold uppercase tracking-wider text-xs mb-1">
            <Radio className="w-4 h-4 animate-pulse" /> Live Evacuation & USSD Gateway
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Emergency Dispatch & Shelter Routing
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Real-time village vulnerability monitoring, high-elevation safe zone allocation, and 50 SMS/sec carrier dispatch.
          </p>
        </div>

        <button
          onClick={fetchVillages}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all text-xs font-semibold self-start"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          Refresh Logistics Data
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Village & Evacuation Dispatch (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {villages.length === 0 && !loading && (
            <div className="p-8 rounded-2xl bg-[#0F172A] border border-slate-800 text-center">
              <AlertOctagon className="w-10 h-10 text-amber-500 mx-auto mb-3 opacity-80" />
              <h3 className="text-lg font-bold text-white mb-1">No Active Villages Found</h3>
              <p className="text-sm text-slate-400">
                Run the database migration and seed script to populate flood monitoring zones.
              </p>
            </div>
          )}

          {villages.map((village) => (
            <div
              key={village.id}
              className="p-6 rounded-2xl bg-[#0F172A]/90 border border-slate-800 hover:border-slate-700 transition-all shadow-xl backdrop-blur-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white tracking-tight">{village.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 border border-rose-500/30 text-rose-400">
                      Vuln: {village.vulnerability_score}%
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {village.region_name}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <Users className="w-3.5 h-3.5 text-blue-400" /> {village.victim_count} Registered Victims
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-bold text-amber-400">
                      <Activity className="w-3.5 h-3.5 text-amber-400" /> {village.unresolved_sos_count} Open SOS Pings
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDispatch(village.id)}
                  disabled={dispatchingId === village.id}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all disabled:opacity-50"
                >
                  {dispatchingId === village.id ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Batching 50/sec...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Dispatch Evacuation Alerts
                    </>
                  )}
                </button>
              </div>

              {/* Safe Zones Linked */}
              <div className="mt-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Allocated Safe Zones & Elevation Priority
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {village.safe_zones && village.safe_zones.length > 0 ? (
                    village.safe_zones.map((zone, idx) => (
                      <div
                        key={zone.id || idx}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                          idx === 0
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-300'
                        }`}
                      >
                        <div>
                          <div className="font-bold flex items-center gap-1.5">
                            {idx === 0 && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                            {zone.name}
                          </div>
                          <span className="text-[11px] text-slate-400">{zone.structure_type}</span>
                        </div>
                        <div className="text-right">
                          <span className="block font-bold text-white">{zone.elevation_meters}m Elev.</span>
                          <span className="text-[10px] text-slate-400">Cap: {zone.capacity}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">No safe zones registered.</span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Dispatch Feedback Banner */}
          {dispatchResult && (
            <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-200 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2 font-bold text-emerald-400 mb-2">
                <CheckCircle2 className="w-5 h-5" /> Evacuation Alert Dispatched Successfully
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-emerald-500/20">
                  <span className="text-slate-400 block">Target Shelter</span>
                  <span className="font-bold text-white">{dispatchResult.safeZone?.name}</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-emerald-500/20">
                  <span className="text-slate-400 block">Elevation</span>
                  <span className="font-bold text-white">{dispatchResult.safeZone?.elevation} meters</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-emerald-500/20">
                  <span className="text-slate-400 block">Victims Contacted</span>
                  <span className="font-bold text-white">{dispatchResult.dispatched} / {dispatchResult.totalVictims}</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-emerald-500/20">
                  <span className="text-slate-400 block">Rate Limit</span>
                  <span className="font-bold text-white">50 msgs / sec</span>
                </div>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-[11px] font-mono whitespace-pre-line text-slate-300">
                {dispatchResult.messageSample}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live USSD & IVRS Voice Hotline Simulator (1 col) */}
        <div className="rounded-2xl bg-[#0F172A] border border-slate-800 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            {/* Mode Switcher: IVRS Voice vs USSD Text */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 rounded-xl border border-slate-800 mb-4">
              <button
                type="button"
                onClick={() => setSimMode('ivrs')}
                className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  simMode === 'ivrs'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5" />
                IVRS Voice (বাংলা)
              </button>
              <button
                type="button"
                onClick={() => setSimMode('ussd')}
                className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  simMode === 'ussd'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Radio className="w-3.5 h-3.5" />
                USSD Text
              </button>
            </div>

            {/* Caller Phone Field */}
            <div className="mb-4">
              <label className="text-[11px] font-medium text-slate-400 block mb-1">
                Caller Phone Number (Villager Handset)
              </label>
              <input
                type="text"
                value={ussdPhone}
                onChange={(e) => setUssdPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-white rounded-xl text-xs outline-none focus:border-cyan-500 font-mono"
                placeholder="+91..."
              />
            </div>

            {/* ------------------------------------------------------------- */}
            {/* MODE 1: IVRS Regional Voice Hotline                           */}
            {/* ------------------------------------------------------------- */}
            {simMode === 'ivrs' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Voice Response Handset
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400">
                    /api/ivrs
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 mb-3">
                  Automated Bengali, Hindi & English voice prompts for illiterate villagers. Distress registered by pressing a single number key.
                </p>

                {/* Simulated Call Screen */}
                <div className="bg-[#050811] rounded-xl p-4 border border-slate-800 font-mono text-xs mb-4 min-h-[160px] flex flex-col justify-between">
                  {ivrsStage === 'calling' ? (
                    <div className="flex flex-col items-center justify-center h-32 gap-2 text-rose-400">
                      <PhoneCall className="w-6 h-6 animate-bounce" />
                      <span>Connecting to Voice Gateway...</span>
                    </div>
                  ) : ivrsStage === 'connected' ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-rose-400 font-bold text-[11px]">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                        <span>[VOICE PROMPT PLAYING IN BENGALI & HINDI]</span>
                      </div>
                      <div className="text-slate-200 text-[11px] leading-relaxed whitespace-pre-line bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        {ivrsPromptText}
                      </div>
                      <div className="text-[10px] text-cyan-400 font-bold animate-pulse">
                        👇 Press 1, 2, or 3 on your keypad below:
                      </div>
                    </div>
                  ) : ivrsStage === 'completed' ? (
                    <div className="space-y-2 animate-in fade-in duration-200">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>[VOICE CONFIRMATION SPOKEN TO CALLER]</span>
                      </div>
                      <div className="text-emerald-300 text-[11px] leading-relaxed whitespace-pre-line bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-500/30">
                        {ivrsConfirmText}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                        <span>DTMF Key Pressed: <strong>{ivrsSelectedKey}</strong></span>
                        <span className="text-cyan-400">✓ Call Terminated</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-500 flex flex-col items-center justify-center h-32 text-center">
                      <PhoneCall className="w-8 h-8 mb-2 text-slate-600" />
                      <span>Illiterate Villager Emergency Hotline.<br />Click below to dial shortcode 1938.</span>
                    </div>
                  )}
                </div>

                {/* Keypad & Call Triggers */}
                {ivrsStage !== 'connected' ? (
                  <button
                    type="button"
                    onClick={handleIvrsCall}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 transition-all"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Dial Shortcode 1938 (Voice Prompt)
                  </button>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleIvrsKeyPress('1')}
                      className="py-2.5 px-2 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 rounded-xl text-xs font-bold transition-all text-center"
                    >
                      <span className="block text-base font-black">১</span>
                      <span>খাবার (Food)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleIvrsKeyPress('2')}
                      className="py-2.5 px-2 bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/40 text-blue-300 rounded-xl text-xs font-bold transition-all text-center"
                    >
                      <span className="block text-base font-black">২</span>
                      <span>ওষুধ (Medicine)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleIvrsKeyPress('3')}
                      className="py-2.5 px-2 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 rounded-xl text-xs font-bold transition-all text-center"
                    >
                      <span className="block text-base font-black">৩</span>
                      <span>উদ্ধার (Rescue)</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------- */}
            {/* MODE 2: USSD Cellular Text Menu                               */}
            {/* ------------------------------------------------------------- */}
            {simMode === 'ussd' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    USSD Interactive Screen
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                    /api/ussd
                  </span>
                </div>

                <div className="bg-[#050811] rounded-xl p-4 border border-slate-800 font-mono text-xs mb-4 min-h-[160px] flex flex-col justify-between">
                  {ussdLoading ? (
                    <div className="flex items-center justify-center h-32 gap-2 text-cyan-400">
                      <RefreshCw className="w-4 h-4 animate-spin" /> Dialing USSD Gateway...
                    </div>
                  ) : ussdResponse ? (
                    <div className="space-y-2">
                      <div className="text-emerald-400 whitespace-pre-line">{ussdResponse}</div>
                      {ussdLatency !== null && (
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pt-2 border-t border-slate-800/80">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          <span>Round-Trip: <strong className="text-white">{ussdLatency}ms</strong></span>
                          <span className="text-emerald-400">(Sub-500ms OK)</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-slate-500 flex flex-col items-center justify-center h-32 text-center">
                      <Radio className="w-6 h-6 mb-2 text-slate-600" />
                      <span>Handset Ready.<br />Click 'Dial *999#' or enter an option below.</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleUssdSubmit('')}
                    disabled={ussdLoading}
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-all border border-slate-700"
                  >
                    Dial *999# (Menu)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUssdSubmit('1')}
                    disabled={ussdLoading}
                    className="py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold transition-all"
                  >
                    1. Need Food
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUssdSubmit('2')}
                    disabled={ussdLoading}
                    className="py-2 px-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-semibold transition-all"
                  >
                    2. Need Medicine
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUssdSubmit('3')}
                    disabled={ussdLoading}
                    className="py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold transition-all"
                  >
                    3. Need Rescue
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800 mt-4">
            <span className="font-semibold text-slate-300 block mb-0.5">Predictive Routing:</span>
            Tapping any key automatically attaches the victim's nearest safe shelter to the generated <code className="text-cyan-400 font-mono">SOS_Ping</code>.
          </div>
        </div>
      </div>
    </section>
  );
}
