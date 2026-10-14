import React from 'react';
import { Building2, Star, MapPin, Wifi, Coffee, CheckCircle2, ShieldCheck, Key } from 'lucide-react';
import { HotelItem } from '../types';
import { MOCK_HOTEL_ITEMS } from '../data/mockData';

interface HotelSearchResultsProps {
  city: string;
  onBookHotel: (hotel: HotelItem) => void;
  onTrackHotel: (hotel: HotelItem) => void;
}

export const HotelSearchResults: React.FC<HotelSearchResultsProps> = ({
  city,
  onBookHotel,
  onTrackHotel,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* redStays Banner */}
      <div className="bg-gradient-to-r from-amber-900 via-orange-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-amber-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block mb-1">
              redStays by redBus
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Handpicked Verified Hotels, Resorts & Homestays
            </h2>
            <p className="text-xs text-amber-200 mt-1">
              100% Guaranteed check-in, free cancellation, digital smart NFC keys, and 24x7 room concierge.
            </p>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-xl text-center backdrop-blur-xs border border-white/20">
            <span className="text-[10px] text-amber-200 block uppercase font-bold">Use Code SUPERSTAY</span>
            <span className="text-sm font-black text-white">Flat 15% Off</span>
          </div>
        </div>
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_HOTEL_ITEMS.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Hotel Image Card Fallback / Visual */}
              <div className="h-44 bg-gradient-to-tr from-slate-900 to-slate-700 relative flex flex-col justify-between p-4 text-white">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-amber-300 border border-amber-400/30">
                    redStays PRIME
                  </span>
                  <span className="flex items-center gap-1 text-xs font-extrabold bg-emerald-600 px-2 py-0.5 rounded-md">
                    <Star className="w-3.5 h-3.5 fill-white text-white" /> {hotel.rating}
                  </span>
                </div>

                <div>
                  <h3 className="font-black text-base leading-tight drop-shadow-sm">{hotel.name}</h3>
                  <span className="text-xs text-slate-300 flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3 text-red-400" /> {hotel.area}, {hotel.city}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">{hotel.roomType}</span>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm font-semibold text-[11px]">
                    Free Cancellation
                  </span>
                </div>

                {/* Amenities List */}
                <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-600">
                  {hotel.amenities.map((am, idx) => (
                    <span key={idx} className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200">
                      {am}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  <span>Digital Key & 1-Click Concierge Included</span>
                </div>
              </div>
            </div>

            {/* Price & Booking Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 line-through">₹{hotel.originalPrice}</span>
                <div className="font-mono text-xl font-black text-slate-900">
                  ₹{hotel.pricePerNight}
                  <span className="text-[10px] text-slate-500 font-normal"> / night</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onTrackHotel(hotel)}
                  className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-xl transition-colors cursor-pointer border border-amber-200"
                  title="View digital room key and concierge"
                >
                  Concierge
                </button>

                <button
                  type="button"
                  onClick={() => onBookHotel(hotel)}
                  className="px-5 py-2 bg-[#d84e55] hover:bg-[#c23f46] text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer uppercase tracking-wider"
                >
                  Book Room
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
