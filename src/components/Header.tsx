import React from 'react';
import { Bus, Train, Bed, Building2, Navigation, Ticket, LifeBuoy, Heart, User, Plane } from 'lucide-react';
import { TravelMode } from '../types';

interface HeaderProps {
  activeMode: TravelMode;
  onSelectMode: (mode: TravelMode) => void;
  bookingCount: number;
  onOpenMyBookings: () => void;
  onOpenHelp: () => void;
  wishlistCount?: number;
  onOpenWishlist?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeMode,
  onSelectMode,
  bookingCount,
  onOpenMyBookings,
  onOpenHelp,
  wishlistCount = 0,
  onOpenWishlist,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        
        {/* Zone 1: Brand Wordmark (Busly: Bus in red, ly in black) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectMode('bus')}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-hidden"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#d84e55] flex items-center justify-center text-white shadow-md shadow-[#d84e55]/25 group-hover:scale-105 transition-transform duration-200">
              <Bus className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="text-left">
              <span className="text-2xl font-black tracking-tight text-[#d84e55]">
                Bus<span className="text-black">ly</span>
              </span>
              <span className="block text-[10px] font-semibold text-slate-400 tracking-wider uppercase leading-none">
                India's No. 1
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Matching Screenshot 1 & 2 Tabs) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-3 h-full">
          
          {/* Bus Tickets */}
          <button
            onClick={() => onSelectMode('bus')}
            className={`flex flex-col items-center justify-center h-full px-4 text-xs font-bold transition-all duration-150 cursor-pointer border-b-3 ${
              activeMode === 'bus'
                ? 'border-[#d84e55] text-[#d84e55]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bus className="w-5 h-5 mb-1" />
            <span>Bus tickets</span>
          </button>

          {/* Train Tickets */}
          <button
            onClick={() => onSelectMode('train')}
            className={`flex flex-col items-center justify-center h-full px-4 text-xs font-bold transition-all duration-150 cursor-pointer border-b-3 ${
              activeMode === 'train'
                ? 'border-[#d84e55] text-[#d84e55]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Train className="w-5 h-5 mb-1" />
            <span>Train tickets</span>
          </button>

          {/* Hotels (Active Red Indicator - Screenshot 1) */}
          <button
            onClick={() => onSelectMode('hotel')}
            className={`flex flex-col items-center justify-center h-full px-4 text-xs font-bold transition-all duration-150 cursor-pointer border-b-3 relative ${
              activeMode === 'hotel'
                ? 'border-[#d84e55] text-[#d84e55]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bed className="w-5 h-5 mb-1" />
            <span>Hotels</span>
            {activeMode === 'hotel' && (
              <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-[#d84e55] animate-ping" />
            )}
          </button>

          {/* Flights */}
          <button
            onClick={() => onSelectMode('flight')}
            className={`flex flex-col items-center justify-center h-full px-3 text-xs font-bold transition-all duration-150 cursor-pointer border-b-3 ${
              activeMode === 'flight'
                ? 'border-[#d84e55] text-[#d84e55]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plane className="w-5 h-5 mb-1" />
            <span>Flights</span>
          </button>

          {/* Live GPS Tracking */}
          <button
            onClick={() => onSelectMode('tracking')}
            className={`flex flex-col items-center justify-center h-full px-3 text-xs font-bold transition-all duration-150 cursor-pointer border-b-3 ${
              activeMode === 'tracking'
                ? 'border-[#d84e55] text-[#d84e55]'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Navigation className="w-5 h-5 mb-1 text-emerald-500 animate-pulse" />
            <span>Live GPS</span>
          </button>

        </nav>

        {/* Zone 3: Wishlist, Account & Help (Screenshot 1 Right Area) */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          
          {/* Wishlist Button (Screenshot 1) */}
          <button
            onClick={onOpenWishlist || onOpenMyBookings}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer relative"
          >
            <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`} />
            <span className="hidden sm:inline">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#d84e55] text-white text-[10px] font-black flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* 24x7 Help */}
          <button
            onClick={onOpenHelp}
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <LifeBuoy className="w-4 h-4 text-slate-500" />
            <span>Help</span>
          </button>

          {/* Account / My Bookings (Screenshot 1: "Account") */}
          <button
            onClick={onOpenMyBookings}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-all duration-150 cursor-pointer whitespace-nowrap"
          >
            <User className="w-4 h-4 text-slate-300" />
            <span className="hidden sm:inline">Account</span>
            <span className="sm:hidden">Bookings</span>
            {bookingCount > 0 && (
              <span className="w-5 h-5 flex items-center justify-center bg-[#d84e55] text-white text-[11px] font-black rounded-full">
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
          <span>Buses</span>
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
          onClick={() => onSelectMode('hotel')}
          className={`flex flex-col items-center gap-1 px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
            activeMode === 'hotel' ? 'text-[#d84e55] font-bold' : 'text-slate-600'
          }`}
        >
          <Bed className="w-4 h-4" />
          <span>Hotels</span>
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
