import React from 'react';
import { Sparkles, Clock, ShieldCheck, HeartHandshake, Navigation, Award, Users, MapPin } from 'lucide-react';

interface PrimoSectionProps {
  onExplorePrimo: () => void;
}

export const PrimoSection: React.FC<PrimoSectionProps> = ({ onExplorePrimo }) => {
  return (
    <section className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Primo Banner */}
        <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/40 p-8 rounded-3xl border border-amber-500/30 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">
                ★
              </span>
              <span className="text-sm font-black uppercase tracking-widest text-amber-400">
                Primo by redBus
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              The Gold Standard of Intercity Bus Travel
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Travel with operators specially curated for exceptional service, punctual departures, polite staff, clean linen, and continuous live GPS tracking.
            </p>
          </div>

          <button
            onClick={onExplorePrimo}
            className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer uppercase tracking-wider whitespace-nowrap self-start lg:self-auto transition-all"
          >
            Explore Primo Buses ➔
          </button>
        </div>

        {/* 4 Pillars of Primo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">95%+ On-Time Departure</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Punctual pickups with automated SMS alerts and real-time landmark arrival updates.
            </p>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Clean & Sanitized Buses</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Fresh blankets, sterilized sleeper berths, and sealed bottled drinking water.
            </p>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Top Rated Bus Captains</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Courteous drivers trained for smooth overnight highway driving and passenger safety.
            </p>
          </div>

          <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <Navigation className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-white">Live GPS Telemetry & SOS</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Share your live moving bus link with loved ones, complete with speed and 24x7 emergency response.
            </p>
          </div>
        </div>

        {/* Global Numbers Strip */}
        <div className="pt-8 border-t border-slate-800 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div>
            <span className="font-mono text-3xl sm:text-4xl font-black text-white block">36M+</span>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1 block">
              Happy Customers
            </span>
          </div>
          <div>
            <span className="font-mono text-3xl sm:text-4xl font-black text-[#d84e55] block">3,500+</span>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1 block">
              Bus Operators
            </span>
          </div>
          <div>
            <span className="font-mono text-3xl sm:text-4xl font-black text-amber-400 block">2,20,000+</span>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1 block">
              Daily Routes
            </span>
          </div>
          <div>
            <span className="font-mono text-3xl sm:text-4xl font-black text-emerald-400 block">4.8 ★</span>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1 block">
              App Store Rating
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
