import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  ArrowLeftRight,
  Search,
  Users,
  ShieldCheck,
  Clock,
  Sparkles,
  Building,
} from 'lucide-react';
import { TravelMode } from '../types';
import { POPULAR_CITIES } from '../data/mockData';

interface HeroSearchProps {
  activeMode: TravelMode;
  onSearch: (from: string, to: string, date: string) => void;
  onOpenLiveTracking: () => void;
  onQuickPNR: () => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  activeMode,
  onSearch,
  onOpenLiveTracking,
  onQuickPNR,
}) => {
  const [fromCity, setFromCity] = useState('Bangalore');
  const [toCity, setToCity] = useState('Chennai');
  const [travelDate, setTravelDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split('T')[0];
  });
  const [passengers, setPassengers] = useState(1);
  const [hotelRooms, setHotelRooms] = useState(1);

  const handleSwap = () => {
    const temp = fromCity;
    setFromCity(toCity);
    setToCity(temp);
  };

  const handleQuickRoute = (from: string, to: string) => {
    setFromCity(from);
    setToCity(to);
    onSearch(from, to, travelDate);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(fromCity, toCity, travelDate);
  };

  const setDateOffset = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setTravelDate(d.toISOString().split('T')[0]);
  };

  return (
    <section className="relative bg-gradient-to-b from-[#D84E55] via-[#c63d44] to-[#af2e35] text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle decorative highway curve grid in background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Hero Title & Value Proposition */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3 text-balance">
            {activeMode === 'bus' && "India's No. 1 Online Bus Ticket Booking"}
            {activeMode === 'train' && 'IRCTC Authorized Train Tickets & Live PNR'}
            {activeMode === 'flight' && 'Lowest Airfares & Instant Flight Booking'}
            {activeMode === 'hotel' && 'redStays: Best Verified Hotels & Resorts'}
            {activeMode === 'tracking' && 'Real-Time Live GPS Travel Tracking Hub'}
          </h1>
          <p className="text-sm sm:text-base text-red-100 max-w-2xl mx-auto">
            Book AC Volvo sleepers, electric buses, trains, flights & hotels with live GPS vehicle tracking and zero booking fee.
          </p>
        </div>

        {/* Floating Search Container */}
        <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-5 text-slate-800 border border-white/20">
          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* From City / Origin */}
              <div className="md:col-span-4 relative bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-xl p-3 border border-slate-200">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#d84e55]" />
                  {activeMode === 'hotel' ? 'Destination City' : 'From'}
                </label>
                <input
                  type="text"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  placeholder="Enter source city"
                  list="popular-from-cities"
                  className="w-full text-base font-bold text-slate-900 bg-transparent focus:outline-hidden"
                  required
                />
                <datalist id="popular-from-cities">
                  {POPULAR_CITIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                <span className="text-[11px] text-slate-400">Boarding point or landmark</span>
              </div>

              {/* Swap Button (only for transport) */}
              {activeMode !== 'hotel' && (
                <div className="hidden md:flex md:col-span-1 justify-center -mx-4 z-10">
                  <button
                    type="button"
                    onClick={handleSwap}
                    className="w-10 h-10 rounded-full bg-white border border-slate-300 shadow-md hover:bg-slate-50 hover:rotate-180 transition-all duration-300 flex items-center justify-center text-slate-700 cursor-pointer"
                    title="Swap Cities"
                  >
                    <ArrowLeftRight className="w-4 h-4 text-[#d84e55]" />
                  </button>
                </div>
              )}

              {/* To City / Destination */}
              {activeMode !== 'hotel' ? (
                <div className="md:col-span-4 relative bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-xl p-3 border border-slate-200">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    To
                  </label>
                  <input
                    type="text"
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    placeholder="Enter destination city"
                    list="popular-to-cities"
                    className="w-full text-base font-bold text-slate-900 bg-transparent focus:outline-hidden"
                    required
                  />
                  <datalist id="popular-to-cities">
                    {POPULAR_CITIES.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                  <span className="text-[11px] text-slate-400">Dropping point or station</span>
                </div>
              ) : (
                <div className="md:col-span-4 relative bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-xl p-3 border border-slate-200">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-blue-600" />
                    Rooms & Guests
                  </label>
                  <div className="flex items-center gap-3">
                    <select
                      value={hotelRooms}
                      onChange={(e) => setHotelRooms(Number(e.target.value))}
                      className="bg-transparent font-bold text-slate-900 text-sm focus:outline-hidden"
                    >
                      <option value={1}>1 Room, 2 Guests</option>
                      <option value={2}>2 Rooms, 4 Guests</option>
                      <option value={3}>3 Rooms, 6 Guests</option>
                    </select>
                  </div>
                  <span className="text-[11px] text-slate-400">Standard check-in 12:00 PM</span>
                </div>
              )}

              {/* Date & Search Button */}
              <div className="md:col-span-3 flex flex-col gap-2">
                <div className="bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-xl p-3 border border-slate-200">
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      Date of Journey
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setDateOffset(0)}
                        className="text-[10px] px-1.5 py-0.5 rounded-sm bg-slate-200 hover:bg-slate-300 font-semibold"
                      >
                        Today
                      </button>
                      <button
                        type="button"
                        onClick={() => setDateOffset(1)}
                        className="text-[10px] px-1.5 py-0.5 rounded-sm bg-slate-200 hover:bg-slate-300 font-semibold"
                      >
                        Tom
                      </button>
                    </div>
                  </label>
                  <input
                    type="date"
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full text-sm font-bold text-slate-900 bg-transparent focus:outline-hidden"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Bottom Row inside card: Quick CTA & Subactions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Free Cancellation</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Instant Confirmation</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-[#d84e55]" />
                  <span>Primo Certified</span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {activeMode === 'train' && (
                  <button
                    type="button"
                    onClick={onQuickPNR}
                    className="px-4 py-3 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Check PNR Status
                  </button>
                )}

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#d84e55] hover:bg-[#c23f46] active:scale-98 text-white text-sm font-black rounded-xl shadow-lg shadow-[#d84e55]/30 flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer uppercase tracking-wider"
                >
                  <Search className="w-4 h-4 stroke-[3]" />
                  <span>
                    SEARCH {activeMode === 'bus' ? 'BUSES' : activeMode === 'train' ? 'TRAINS' : activeMode === 'flight' ? 'FLIGHTS' : 'HOTELS'}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Popular Route Fast Chips */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-red-200 font-semibold mr-1">Trending Routes:</span>
          {[
            { from: 'Bangalore', to: 'Chennai' },
            { from: 'Delhi', to: 'Manali' },
            { from: 'Mumbai', to: 'Goa' },
            { from: 'Bangalore', to: 'Hyderabad' },
            { from: 'Bangalore', to: 'Kochi' },
          ].map((route) => (
            <button
              key={`${route.from}-${route.to}`}
              type="button"
              onClick={() => handleQuickRoute(route.from, route.to)}
              className="bg-white/15 hover:bg-white/25 text-white px-3 py-1.5 rounded-lg backdrop-blur-xs transition-colors cursor-pointer font-medium"
            >
              {route.from} ➔ {route.to}
            </button>
          ))}
          <button
            type="button"
            onClick={onOpenLiveTracking}
            className="bg-emerald-500/25 border border-emerald-400/50 hover:bg-emerald-500/35 text-white px-3 py-1.5 rounded-lg backdrop-blur-xs transition-colors cursor-pointer font-semibold flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Track Live Vehicle</span>
          </button>
        </div>
      </div>
    </section>
  );
};
