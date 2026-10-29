import React from 'react';
import Navbar from '../../../components/Navbar';
import NgoOnboardingForm from '../../../components/ngo/NgoOnboardingForm';

export default function NgoRegisterPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col font-sans selection:bg-blue-500/30 relative overflow-hidden">
      <Navbar />
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-emerald-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <main className="flex-1 w-full pt-32 pb-16 px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Join PreranaAid</h1>
          <p className="text-lg text-slate-400">Complete your NGO profile to activate public campaigns and receive donations directly.</p>
        </div>

        <NgoOnboardingForm />
      </main>
    </div>
  );
}
