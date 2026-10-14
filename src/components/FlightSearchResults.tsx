import React from 'react';
import { Plane, Clock, ShieldCheck, Luggage, Navigation, CheckCircle2 } from 'lucide-react';
import { FlightTrip } from '../types';
import { MOCK_FLIGHT_TRIPS } from '../data/mockData';

interface FlightSearchResultsProps {
  fromCity: string;
  toCity: string;
  travelDate: string;
  onBookFlight: (flight: FlightTrip) => void;
  onTrackFlight: (flight: FlightTrip) => void;
}

export const FlightSearchResults: React.FC<FlightSearchResultsProps> = ({
  fromCity,
  toCity,
  travelDate,
  onBookFlight,
  onTrackFlight,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Flight Banner */}
      <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-sky-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-300 block mb-1">
              redBus Flights Portal
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Lowest Airfare Guarantee on Domestic & International Flights
            </h2>
            <p className="text-xs text-sky-200 mt-1">
              Instant web check-in, free seat selection vouchers, and live satellite flight radar.
            </p>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-xl text-center backdrop-blur-xs border border-white/20">
            <span className="text-[10px] text-sky-200 block uppercase font-bold">Use Code FLY1000</span>
            <span className="text-sm font-black text-white">Save Up to ₹1,000</span>
          </div>
        </div>
      </div>

      {/* Flight Cards */}
      <div className="space-y-4">
        {MOCK_FLIGHT_TRIPS.map((flight) => (
          <div
            key={flight.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-slate-300 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            {/* Airline & Number */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center font-bold text-sky-700 text-lg">
                ✈️
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900">{flight.airline}</h3>
                <span className="font-mono text-xs text-slate-500 font-bold">{flight.flightNumber}</span>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Luggage className="w-3 h-3 text-slate-400" /> {flight.checkInBaggage}
                  </span>
                  <span>·</span>
                  <span>Cabin: {flight.cabinBaggage}</span>
                </div>
              </div>
            </div>

            {/* Timings */}
            <div className="flex items-center gap-6 text-center">
              <div>
                <span className="font-mono text-xl font-black text-slate-900 block">
                  {flight.departureTime}
                </span>
                <span className="text-xs font-semibold text-slate-600">{flight.fromAirport}</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {flight.duration}
                </span>
                <div className="w-20 h-0.5 bg-slate-200 my-1 relative">
                  <div className="w-2 h-2 rounded-full bg-sky-600 absolute -top-[3px] left-1/2 -translate-x-1/2" />
                </div>
                <span className="text-[10px] text-emerald-600 font-bold">Non-Stop</span>
              </div>

              <div>
                <span className="font-mono text-xl font-black text-slate-900 block">
                  {flight.arrivalTime}
                </span>
                <span className="text-xs font-semibold text-slate-600">{flight.toAirport}</span>
              </div>
            </div>

            {/* Price & CTA */}
            <div className="flex items-center justify-between md:flex-col md:items-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
              <div className="text-left md:text-right">
                <span className="font-mono text-2xl font-black text-slate-900">
                  ₹{flight.price.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-400 block font-medium">per adult (inc. taxes)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onTrackFlight(flight)}
                  className="px-3 py-2 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-xl transition-colors cursor-pointer flex items-center gap-1 border border-sky-200"
                >
                  <Navigation className="w-3.5 h-3.5 text-sky-600" />
                  <span>Live Radar</span>
                </button>

                <button
                  type="button"
                  onClick={() => onBookFlight(flight)}
                  className="px-6 py-2.5 bg-[#d84e55] hover:bg-[#c23f46] text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer uppercase tracking-wider"
                >
                  Book Flight
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
