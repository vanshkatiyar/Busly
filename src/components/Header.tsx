import React from 'react';
import { Bus, Train, Plane, Building2, Navigation, Ticket, LifeBuoy } from 'lucide-react';
import { TravelMode } from '../types';

interface HeaderProps {
  activeMode: TravelMode;
  onSelectMode: (mode: TravelMode) => void;
  bookingCount: number;
  onOpenMyBookings: () => void;
  onOpenHelp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeMode,
  onSelectMode,
  bookingCount,
  onOpenMyBookings,
  onOpenHelp,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectMode('bus')}
            className="flex items-center gap-2 group cursor-pointer focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-[#d84e55] flex items-center justify-center text-white shadow-md shadow-[#d84e55]/20 group-hover:scale-105 transition-transform duration-200">
              <Bus className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-black tracking-tight text-[#d84e55]">
                red<span className="text-slate-900">Bus</span>
              </span>
              <span className="block text-[10px] font-semibold text-slate-400 tracking-wider uppercase leading-none">
                India's No. 1
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => onSelectMode('bus')}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
              activeMode === 'bus'
                ? 'bg-[#d84e55] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Bus className="w-4 h-4" />
            <span>Bus Tickets</span>
          </button>

          <button
            onClick={() => onSelectMode('train')}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
              activeMode === 'train'
                ? 'bg-[#d84e55] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Train className="w-4 h-4" />
            <span>redRail (Trains)</span>
          </button>

          <button
            onClick={() => onSelectMode('flight')}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
              activeMode === 'flight'
                ? 'bg-[#d84e55] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Plane className="w-4 h-4" />
            <span>Flights</span>
          </button>

          <button
            onClick={() => onSelectMode('hotel')}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
              activeMode === 'hotel'
                ? 'bg-[#d84e55] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>redStays (Hotels)</span>
          </button>

          <button
            onClick={() => onSelectMode('tracking')}
            className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
              activeMode === 'tracking'
                ? 'bg-[#d84e55] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Navigation className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>Live GPS Tracking</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action & User Utilities */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenHelp}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <LifeBuoy className="w-4 h-4 text-slate-500" />
            <span>24x7 Help</span>
          </button>

          <button
            onClick={onOpenMyBookings}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all duration-150 cursor-pointer whitespace-nowrap"
          >
            <Ticket className="w-4 h-4 text-emerald-400" />
            <span>My Bookings</span>
            {bookingCount > 0 && (
              <span className="w-5 h-5 flex items-center justify-center bg-[#d84e55] text-white text-[11px] font-bold rounded-full">
                {bookingCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-slate-100 bg-white overflow-x-auto">
        <button
          onClick={() => onSelectMode('bus')}
          className={`flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            activeMode === 'bus' ? 'text-[#d84e55] font-bold' : 'text-slate-600'
          }`}
        >
          <Bus className="w-4 h-4" />
          <span>Bus</span>
        </button>
        <button
          onClick={() => onSelectMode('train')}
          className={`flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            activeMode === 'train' ? 'text-[#d84e55] font-bold' : 'text-slate-600'
          }`}
        >
          <Train className="w-4 h-4" />
          <span>Trains</span>
        </button>
        <button
          onClick={() => onSelectMode('flight')}
          className={`flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            activeMode === 'flight' ? 'text-[#d84e55] font-bold' : 'text-slate-600'
          }`}
        >
          <Plane className="w-4 h-4" />
          <span>Flights</span>
        </button>
        <button
          onClick={() => onSelectMode('hotel')}
          className={`flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            activeMode === 'hotel' ? 'text-[#d84e55] font-bold' : 'text-slate-600'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Hotels</span>
        </button>
        <button
          onClick={() => onSelectMode('tracking')}
          className={`flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            activeMode === 'tracking' ? 'text-[#d84e55] font-bold' : 'text-slate-600'
          }`}
        >
          <Navigation className="w-4 h-4 text-emerald-500" />
          <span>Tracking</span>
        </button>
      </div>
    </header>
  );
};
