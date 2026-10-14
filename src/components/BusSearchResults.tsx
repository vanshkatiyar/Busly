import React, { useState, useMemo } from 'react';
import {
  Star,
  Clock,
  Navigation,
  ShieldCheck,
  Zap,
  Filter,
  ArrowUpDown,
  Sparkles,
  Wifi,
  Coffee,
  Check,
  Utensils,
} from 'lucide-react';
import { BusTrip } from '../types';
import { AIFarePredictorWidget } from './AIFarePredictorWidget';

interface BusSearchResultsProps {
  buses: BusTrip[];
  fromCity: string;
  toCity: string;
  travelDate: string;
  onSelectBus: (bus: BusTrip) => void;
  onTrackBus: (bus: BusTrip) => void;
  onViewRestStop: (bus: BusTrip) => void;
}

export const BusSearchResults: React.FC<BusSearchResultsProps> = ({
  buses,
  fromCity,
  toCity,
  travelDate,
  onSelectBus,
  onTrackBus,
  onViewRestStop,
}) => {
  const [filterPrimo, setFilterPrimo] = useState(false);
  const [filterAC, setFilterAC] = useState(false);
  const [filterSleeper, setFilterSleeper] = useState(false);
  const [filterLiveTracking, setFilterLiveTracking] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [sortBy, setSortBy] = useState<'price_asc' | 'rating_desc' | 'duration_asc' | 'departure_asc'>('price_asc');

  // Filter and sort logic
  const filteredBuses = useMemo(() => {
    return buses
      .filter((bus) => {
        if (filterPrimo && bus.category !== 'primo') return false;
        if (filterAC && !bus.busType.toLowerCase().includes('a/c') && !bus.busType.toLowerCase().includes('ac')) return false;
        if (filterSleeper && !bus.busType.toLowerCase().includes('sleeper')) return false;
        if (filterLiveTracking && !bus.liveTrackingAvailable) return false;
        if (bus.rating < minRating) return false;
        if (bus.price > maxPrice) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'rating_desc') return b.rating - a.rating;
        if (sortBy === 'departure_asc') return a.departureTime.localeCompare(b.departureTime);
        if (sortBy === 'duration_asc') return parseInt(a.duration) - parseInt(b.duration);
        return 0;
      });
  }, [buses, filterPrimo, filterAC, filterSleeper, filterLiveTracking, minRating, maxPrice, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* AI Fare Predictor & Price Drop Alert Widget */}
      <AIFarePredictorWidget fromCity={fromCity} toCity={toCity} />

      {/* Route Header summary */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 mb-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {fromCity} ➔ {toCity}
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-[#d84e55] font-bold">
              {filteredBuses.length} Buses Found
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Travel Date: <span className="font-semibold text-slate-700">{travelDate}</span> · All buses sanitized & GPS enabled
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 text-xs font-semibold">
          <span className="text-slate-400 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" /> Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-bold focus:outline-hidden cursor-pointer"
          >
            <option value="price_asc">Cheapest First</option>
            <option value="rating_desc">Highest Rated (Primo)</option>
            <option value="departure_asc">Earliest Departure</option>
            <option value="duration_asc">Fastest Trip</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter Sidebar */}
        <div className="lg:col-span-1 space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-[#d84e55]" />
                Filters
              </h3>
              <button
                onClick={() => {
                  setFilterPrimo(false);
                  setFilterAC(false);
                  setFilterSleeper(false);
                  setFilterLiveTracking(false);
                  setMinRating(0);
                  setMaxPrice(2000);
                }}
                className="text-xs text-[#d84e55] hover:underline font-semibold cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* Quick Filter Toggles */}
            <div className="space-y-2.5">
              <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterPrimo}
                  onChange={(e) => setFilterPrimo(e.target.checked)}
                  className="rounded-sm text-[#d84e55] focus:ring-[#d84e55] cursor-pointer"
                />
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Primo Certified Only
                </span>
              </label>

              <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterLiveTracking}
                  onChange={(e) => setFilterLiveTracking(e.target.checked)}
                  className="rounded-sm text-emerald-600 focus:ring-emerald-600 cursor-pointer"
                />
                <span className="flex items-center gap-1">
                  <Navigation className="w-3.5 h-3.5 text-emerald-600" /> Live GPS Bus Tracking
                </span>
              </label>

              <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterAC}
                  onChange={(e) => setFilterAC(e.target.checked)}
                  className="rounded-sm text-[#d84e55] focus:ring-[#d84e55] cursor-pointer"
                />
                <span>Air Conditioned (A/C)</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterSleeper}
                  onChange={(e) => setFilterSleeper(e.target.checked)}
                  className="rounded-sm text-[#d84e55] focus:ring-[#d84e55] cursor-pointer"
                />
                <span>Sleeper Berths</span>
              </label>
            </div>

            {/* Star Rating Filter */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <span className="block text-xs font-bold text-slate-900 mb-2">Customer Rating</span>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {[0, 4.0, 4.5].map((ratingVal) => (
                  <button
                    key={ratingVal}
                    type="button"
                    onClick={() => setMinRating(ratingVal)}
                    className={`py-1.5 px-2 rounded-lg border font-bold text-center cursor-pointer transition-colors ${
                      minRating === ratingVal
                        ? 'bg-[#d84e55] text-white border-[#d84e55]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {ratingVal === 0 ? 'All' : `${ratingVal}+ ★`}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price Slider */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex justify-between text-xs font-bold mb-2">
                <span className="text-slate-900">Max Ticket Price:</span>
                <span className="text-[#d84e55] font-mono">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min={600}
                max={2000}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#d84e55] cursor-pointer"
              />
            </div>
          </div>

          {/* redBus Safety Banner */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900">
            <div className="flex items-center gap-2 font-bold mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>redBus Safety+ Standard</span>
            </div>
            <p className="text-emerald-700 leading-relaxed">
              All listed operators follow mandatory thermal checks, sanitized interiors, and live GPS route sharing.
            </p>
          </div>
        </div>

        {/* Bus List */}
        <div className="lg:col-span-3 space-y-4">
          {filteredBuses.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <p className="text-base font-bold text-slate-800">No buses matching your selected filters.</p>
              <p className="text-xs text-slate-500 mt-1">Try widening your price range or clearing filters.</p>
            </div>
          ) : (
            filteredBuses.map((bus) => (
              <div
                key={bus.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Operator Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-black text-slate-900">{bus.operator}</h3>
                      {bus.category === 'primo' && (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-sm bg-amber-500 text-white tracking-wider flex items-center gap-1 shadow-xs">
                          <Sparkles className="w-2.5 h-2.5" /> Primo
                        </span>
                      )}
                      {bus.category === 'government' && (
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-sm bg-blue-600 text-white tracking-wider">
                          Govt RTC
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-extrabold">
                        <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                        {bus.rating}
                        <span className="text-slate-400 font-normal">({bus.totalReviews})</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 font-medium">{bus.busType}</p>

                    {/* Amenities Icons */}
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1 flex-wrap">
                      {bus.amenities.slice(0, 4).map((amenity, idx) => (
                        <span key={idx} className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-sm border border-slate-100">
                          <Check className="w-3 h-3 text-emerald-600" />
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Timings & Duration */}
                  <div className="flex items-center gap-4 text-center">
                    <div>
                      <span className="font-mono text-xl font-black text-slate-900 block">
                        {bus.departureTime}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">{bus.from}</span>
                      <span className="text-[10px] text-slate-400 block truncate max-w-[100px]">
                        {bus.boardingPoints[0].name}
                      </span>
                    </div>

                    <div className="flex flex-col items-center px-2">
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {bus.duration}
                      </span>
                      <div className="w-16 h-0.5 bg-slate-200 my-1 relative">
                        <div className="w-2 h-2 rounded-full bg-[#d84e55] absolute -top-[3px] left-1/2 -translate-x-1/2" />
                      </div>
                      <span className="text-[9px] text-emerald-600 font-bold">Non-Stop</span>
                    </div>

                    <div>
                      <span className="font-mono text-xl font-black text-slate-900 block">
                        {bus.arrivalTime}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">{bus.to}</span>
                      <span className="text-[10px] text-slate-400 block truncate max-w-[100px]">
                        {bus.droppingPoints[0].name}
                      </span>
                    </div>
                  </div>

                  {/* Pricing & CTA */}
                  <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 gap-2">
                    <div className="text-left md:text-right">
                      <div className="flex items-center gap-1.5 md:justify-end">
                        <span className="text-xs text-slate-400 line-through">₹{bus.originalPrice}</span>
                        <span className="font-mono text-2xl font-black text-slate-900">₹{bus.price}</span>
                      </div>
                      <span className="text-[11px] text-amber-600 font-semibold block">
                        {bus.seatsAvailable} Seats Left
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onViewRestStop(bus)}
                        className="px-3 py-2 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1 border border-amber-200"
                        title="View verified highway dhaba & restroom hygiene"
                      >
                        <Utensils className="w-3.5 h-3.5 text-amber-600" />
                        <span>Rest Stop & Food</span>
                      </button>

                      {bus.liveTrackingAvailable && (
                        <button
                          type="button"
                          onClick={() => onTrackBus(bus)}
                          className="px-3 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1 border border-emerald-200"
                          title="View live GPS route & current location"
                        >
                          <Navigation className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                          <span>Live Track</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onSelectBus(bus)}
                        className="px-5 py-2.5 bg-[#d84e55] hover:bg-[#c23f46] text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer uppercase tracking-wider"
                      >
                        Select Seats
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
