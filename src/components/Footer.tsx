import React from 'react';
import { Bus, ShieldCheck, Heart, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Top Routes & Operators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-bold text-sm mb-3">Popular Bus Routes</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="#" className="hover:text-white transition-colors">Bangalore to Chennai Bus</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Delhi to Manali Bus</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mumbai to Goa Bus</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hyderabad to Bangalore Bus</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pune to Nagpur Bus</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Coimbatore to Chennai Bus</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-3">Top Bus Operators</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="#" className="hover:text-white transition-colors">IntrCity SmartBus</a></li>
              <li><a href="#" className="hover:text-white transition-colors">SRS Travels</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Orange Tours and Travels</a></li>
              <li><a href="#" className="hover:text-white transition-colors">VRL Travels</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Zingbus Electric</a></li>
              <li><a href="#" className="hover:text-white transition-colors">KSRTC Swift</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-3">Busly Ecosystem</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="#" className="hover:text-white transition-colors">redRail IRCTC Trains</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Busly Flights</a></li>
              <li><a href="#" className="hover:text-white transition-colors">redStays Verified Hotels</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Live GPS Tracking Portal</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Primo Luxury Guarantee</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Bus Hire & Group Charters</a></li>
            </ul>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#d84e55] flex items-center justify-center text-white font-bold">
                <Bus className="w-4 h-4" />
              </div>
              <span className="text-lg font-black text-[#d84e55]">
                Bus<span className="text-white">ly</span>
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400 mb-3">
              Busly is the world's largest online bus ticket booking platform trusted by over 36 million customers globally.
            </p>
            <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-semibold bg-slate-900 p-2 rounded-lg border border-slate-800">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Official IRCTC Authorized Rail Partner & PCI-DSS Level 1 Compliant</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Busly India Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:text-slate-300">Terms & Conditions</a>
            <span>·</span>
            <a href="#" className="hover:text-slate-300">Security & SSL</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
