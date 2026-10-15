import React, { useState, useEffect } from 'react';
import {
  Bus,
  Train,
  Plane,
  Building2,
  Navigation,
  Phone,
  Share2,
  AlertTriangle,
  Play,
  Pause,
  Clock,
  Compass,
  Gauge,
  CheckCircle2,
  MapPin,
  Key,
  Bell,
  Coffee,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import { BusTrip } from '../types';
import { MOCK_BUS_TRIPS, MOCK_TRAIN_TRIPS, MOCK_FLIGHT_TRIPS, MOCK_HOTEL_ITEMS } from '../data/mockData';
import { DriverChatModal } from './DriverChatModal';
import { RealWorldGPSMap } from './RealWorldGPSMap';

interface LiveTrackingHubProps {
  selectedBus?: BusTrip;
  onBookNow: (mode: string) => void;
}

export const LiveTrackingHub: React.FC<LiveTrackingHubProps> = ({
  selectedBus = MOCK_BUS_TRIPS[0],
  onBookNow,
}) => {
  const [activeTrackingMode, setActiveTrackingMode] = useState<'bus' | 'train' | 'flight' | 'hotel'>('bus');
  const [currentBus, setCurrentBus] = useState<BusTrip>(selectedBus);
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [progressPct, setProgressPct] = useState<number>(38);
  const [speedKmh, setSpeedKmh] = useState<number>(68);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showDriverChat, setShowDriverChat] = useState(false);

  // Train tracking state
  const [selectedTrain, setSelectedTrain] = useState(MOCK_TRAIN_TRIPS[0]);

  // Flight tracking state
  const [selectedFlight, setSelectedFlight] = useState(MOCK_FLIGHT_TRIPS[0]);

  // Hotel tracking concierge state
  const [selectedHotel, setSelectedHotel] = useState(MOCK_HOTEL_ITEMS[0]);
  const [conciergeActionPending, setConciergeActionPending] = useState<string | null>(null);
  const [digitalKeyGenerated, setDigitalKeyGenerated] = useState(true);

  // Sync if selectedBus prop changes
  useEffect(() => {
    if (selectedBus) {
      setCurrentBus(selectedBus);
    }
  }, [selectedBus]);

  // Real-time animation loop for bus movement
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgressPct((prev) => {
        const next = prev + 0.3 * simSpeed;
        return next > 98 ? 15 : next;
      });

      // Realistic speed fluctuation (62 - 76 km/h)
      setSpeedKmh(Math.floor(64 + Math.sin(Date.now() / 2000) * 8));
    }, 500);

    return () => clearInterval(interval);
  }, [isPlaying, simSpeed]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleShareTrip = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Live tracking link copied to clipboard! Share with family.');
  };

  const handleEmergencySOS = () => {
    showToast('Emergency SOS alert dispatched to Busly Safety Command & Local Highway Patrol.');
  };

  const handleConciergeRequest = (requestName: string) => {
    setConciergeActionPending(requestName);
    setTimeout(() => {
      setConciergeActionPending(null);
      showToast(`Concierge confirmed: "${requestName}" is dispatched to your room!`);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Title & Mode Selector */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                Busly Live Travel GPS Tracking System
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Real-time telemetry, GPS satellite sync, on-time delay predictions, and passenger concierge.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveTrackingMode('bus')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTrackingMode === 'bus' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Bus className="w-3.5 h-3.5 text-[#d84e55]" />
              <span>Live Bus</span>
            </button>
            <button
              onClick={() => setActiveTrackingMode('train')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTrackingMode === 'train' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Train className="w-3.5 h-3.5 text-blue-600" />
              <span>Live Train (RTIS)</span>
            </button>
            <button
              onClick={() => setActiveTrackingMode('flight')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTrackingMode === 'flight' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Plane className="w-3.5 h-3.5 text-indigo-600" />
              <span>Flight Radar</span>
            </button>
            <button
              onClick={() => setActiveTrackingMode('hotel')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                activeTrackingMode === 'hotel' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Hotel Concierge</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. BUS LIVE TRACKING VIEW */}
      {activeTrackingMode === 'bus' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Map & Live Highway View (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden border border-slate-800">
              {/* Telemetry Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#d84e55] flex items-center justify-center font-bold text-white shadow-md">
                    <Bus className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                      {currentBus.operator}
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono">
                        GPS LIVE
                      </span>
                    </h2>
                    <p className="text-xs text-slate-400">
                      Vehicle: <span className="font-mono text-slate-200">{currentBus.vehicleNo}</span> ·{' '}
                      {currentBus.from} ➔ {currentBus.to}
                    </p>
                  </div>
                </div>

                {/* Telemetry Gauges */}
                <div className="flex items-center gap-4 text-xs">
                  <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 block">CURRENT SPEED</span>
                    <span className="font-mono text-emerald-400 font-extrabold text-sm">{speedKmh} km/h</span>
                  </div>
                  <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
                    <span className="text-[10px] text-slate-400 block">NEXT STOP ETA</span>
                    <span className="font-mono text-amber-400 font-extrabold text-sm">14 Mins</span>
                  </div>
                </div>
              </div>

              {/* Real-World Leaflet OpenStreetMap & HTML5 Geolocation */}
              <div className="my-6">
                <RealWorldGPSMap bus={currentBus} />
              </div>

              {/* Action Buttons: SOS & Share Trip */}
              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={handleShareTrip}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-2 border border-slate-700"
                >
                  <Share2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Share Live Trip with Family</span>
                </button>

                <button
                  onClick={handleEmergencySOS}
                  className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-2 border border-red-500/30"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  <span>24x7 Emergency Assistance (SOS)</span>
                </button>
              </div>
            </div>

            {/* Stops Timeline Breakdown */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#d84e55]" />
                Scheduled Route Stops & Real-Time Tracking
              </h3>

              <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {currentBus.boardingPoints.concat(currentBus.droppingPoints).map((stop, idx) => {
                  const isPassed = idx < 2;
                  const isCurrent = idx === 2;

                  return (
                    <div key={stop.id} className="relative flex items-start gap-4 pl-8">
                      <div
                        className={`absolute left-1.5 top-1 -translate-x-1/2 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          isPassed
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : isCurrent
                            ? 'bg-[#d84e55] border-[#d84e55] text-white ring-4 ring-red-100'
                            : 'bg-white border-slate-300'
                        }`}
                      >
                        {isPassed && <span className="text-[8px] font-bold">✓</span>}
                      </div>

                      <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900">{stop.name}</span>
                            {isCurrent && (
                              <span className="text-[10px] font-bold bg-red-100 text-[#d84e55] px-2 py-0.5 rounded-sm">
                                CURRENT STOP
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">{stop.landmark}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xs font-bold text-slate-900 block">{stop.time}</span>
                          <span className="text-[10px] font-semibold text-emerald-600">
                            {isPassed ? 'Departed' : isCurrent ? 'Arriving Now' : 'Scheduled'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Driver Card, Bus Switcher & Booking Prompt */}
          <div className="space-y-6">
            {/* Driver & Bus Info Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-3">
                Crew & Vehicle Details
              </span>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-lg">
                  👨‍✈️
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">{currentBus.driverName}</h4>
                  <p className="text-xs text-slate-500">Certified Primo Captain · 8 Yrs Exp</p>
                  <span className="text-[11px] text-amber-700 font-bold">4.9 ★ Rating</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 pt-3 border-t border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-400">Bus Registration:</span>
                  <span className="font-mono font-bold text-slate-900">{currentBus.vehicleNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Model:</span>
                  <span className="font-semibold text-slate-900">{currentBus.busType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sanitization:</span>
                  <span className="text-emerald-600 font-bold">Verified 2 Hours Ago</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShowDriverChat(true)}
                  className="py-2.5 bg-[#25D366] hover:bg-[#1faa53] text-white text-xs font-black rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>Chat (WhatsApp)</span>
                </button>

                <a
                  href={`tel:${currentBus.driverPhone}`}
                  className="py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors text-center"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call Captain</span>
                </a>
              </div>
            </div>

            {/* In-App Driver WhatsApp Live Chat Modal */}
            {showDriverChat && (
              <DriverChatModal
                bus={currentBus}
                onClose={() => setShowDriverChat(false)}
              />
            )}

            {/* Select Other Active Buses to Track */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Track Other Active Buses
              </h4>
              <div className="space-y-2">
                {MOCK_BUS_TRIPS.map((bus) => (
                  <button
                    key={bus.id}
                    onClick={() => {
                      setCurrentBus(bus);
                      setProgressPct(35);
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                      currentBus.id === bus.id
                        ? 'border-[#d84e55] bg-red-50/50 text-slate-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs">{bus.operator}</span>
                      <span className="font-mono text-[11px] text-[#d84e55] font-bold">₹{bus.price}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {bus.from} ➔ {bus.to} ({bus.departureTime})
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TRAIN LIVE RUNNING STATUS (redRail RTIS) */}
      {activeTrackingMode === 'train' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-sm bg-blue-100 text-blue-800 text-xs font-bold">
                  RTIS SATELLITE
                </span>
                <h2 className="text-xl font-black text-slate-900">
                  {selectedTrain.trainNumber} - {selectedTrain.trainName}
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {selectedTrain.fromStation} ➔ {selectedTrain.toStation} · Live via Indian Railways Satellite GPS
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedTrain.id}
                onChange={(e) => {
                  const tr = MOCK_TRAIN_TRIPS.find((t) => t.id === e.target.value);
                  if (tr) setSelectedTrain(tr);
                }}
                className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-3 py-2 cursor-pointer focus:outline-hidden"
              >
                {MOCK_TRAIN_TRIPS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.trainNumber} - {t.trainName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Train Live Status Banner */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              <div>
                <span className="text-xs text-blue-200 block">CURRENT LOCATION</span>
                <span className="text-lg font-black text-white">{selectedTrain.currentStatus?.currentStation}</span>
                <span className="text-xs text-emerald-400 block mt-0.5">
                  Arrived on {selectedTrain.currentStatus?.platform}
                </span>
              </div>

              <div>
                <span className="text-xs text-blue-200 block">PUNCTUALITY</span>
                <span className="text-lg font-mono font-black text-emerald-400">
                  {selectedTrain.currentStatus?.delayMinutes === 0
                    ? 'Right On Time'
                    : `+${selectedTrain.currentStatus?.delayMinutes} min Delay`}
                </span>
                <span className="text-xs text-blue-300 block">{selectedTrain.currentStatus?.lastUpdated}</span>
              </div>

              <div>
                <span className="text-xs text-blue-200 block">JOURNEY PROGRESS</span>
                <span className="text-lg font-black text-white">4h 25m Total</span>
                <div className="w-full bg-blue-950 h-2 rounded-full mt-1">
                  <div className="w-2/3 bg-emerald-400 h-full rounded-full" />
                </div>
              </div>

              <div className="text-right">
                <button
                  onClick={() => onBookNow('train')}
                  className="px-5 py-2.5 bg-white hover:bg-blue-50 text-blue-900 text-xs font-black rounded-xl shadow-md cursor-pointer transition-colors"
                >
                  Book Tickets on redRail ➔
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. FLIGHT RADAR VIEW */}
      {activeTrackingMode === 'flight' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-sm bg-indigo-100 text-indigo-800 text-xs font-bold">
                  ADS-B LIVE RADAR
                </span>
                <h2 className="text-xl font-black text-slate-900">
                  {selectedFlight.airline} {selectedFlight.flightNumber}
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {selectedFlight.fromAirport} ➔ {selectedFlight.toAirport} · Airbus A321neo
              </p>
            </div>

            <select
              value={selectedFlight.id}
              onChange={(e) => {
                const fl = MOCK_FLIGHT_TRIPS.find((f) => f.id === e.target.value);
                if (fl) setSelectedFlight(fl);
              }}
              className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-800 rounded-xl px-3 py-2 cursor-pointer focus:outline-hidden"
            >
              {MOCK_FLIGHT_TRIPS.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.flightNumber} - {f.airline}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-slate-950 rounded-2xl p-6 text-white border border-slate-800">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block">ALTITUDE</span>
                <span className="font-mono text-lg font-black text-blue-400">
                  {selectedFlight.flightTelemetry?.altitudeFt.toLocaleString()} FT
                </span>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block">GROUND SPEED</span>
                <span className="font-mono text-lg font-black text-emerald-400">
                  {selectedFlight.flightTelemetry?.speedKnots} KTS
                </span>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block">DEPARTURE</span>
                <span className="font-mono text-lg font-black text-white">{selectedFlight.departureTime}</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                <span className="text-[11px] text-slate-400 block">EST. ARRIVAL</span>
                <span className="font-mono text-lg font-black text-amber-400">{selectedFlight.arrivalTime}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
              <span>{selectedFlight.fromAirport}</span>
              <div className="flex-1 mx-6 relative flex items-center">
                <div className="w-full h-0.5 bg-slate-800" />
                <div
                  className="absolute -top-3 transform -translate-x-1/2 text-lg text-blue-400"
                  style={{ left: `${selectedFlight.flightTelemetry?.distanceCoveredPct}%` }}
                >
                  ✈️
                </div>
              </div>
              <span>{selectedFlight.toAirport}</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. HOTEL STAY & CONCIERGE TRACKER */}
      {activeTrackingMode === 'hotel' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-sm bg-amber-100 text-amber-800 text-xs font-bold">
                  redStays 24x7 CONCIERGE
                </span>
                <h2 className="text-xl font-black text-slate-900">{selectedHotel.name}</h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {selectedHotel.area}, {selectedHotel.city} · Room 408 ({selectedHotel.roomType})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Room Inspected & Ready
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Digital Key & Room Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 border border-slate-700 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Digital Smart Key
                </span>
                <Key className="w-5 h-5 text-amber-400" />
              </div>

              <div>
                <span className="text-xs text-slate-400 block">ROOM NUMBER</span>
                <span className="font-mono text-3xl font-black text-white">ROOM 408</span>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400 block mb-1">TOUCHLESS ACCESS NFC PIN</span>
                <span className="font-mono text-2xl font-black text-amber-400 tracking-widest">
                  8 4 9 2 #
                </span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Hold smartphone near room door sensor or type this PIN on the keypad.
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300 pt-2">
                <span>Check-in: 12:00 PM</span>
                <span>Check-out: 11:00 AM</span>
              </div>
            </div>

            {/* Interactive 1-Click Concierge Requests */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-[#d84e55]" />
                1-Click Room Concierge Requests
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Tap any request to alert the floor butler directly with instant fulfillment tracking.
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { title: 'Extra Towels & Pillows', icon: Sparkles },
                  { title: 'Morning Coffee Service', icon: Coffee },
                  { title: 'Room Cleaning Service', icon: CheckCircle2 },
                  { title: 'Airport Taxi Booking', icon: Navigation },
                ].map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    disabled={conciergeActionPending === item.title}
                    onClick={() => handleConciergeRequest(item.title)}
                    className="p-3 bg-white hover:bg-slate-100/90 active:scale-98 rounded-xl border border-slate-200 text-left transition-all cursor-pointer shadow-2xs"
                  >
                    <item.icon className="w-4 h-4 text-[#d84e55] mb-2" />
                    <span className="text-xs font-bold text-slate-800 block">{item.title}</span>
                    <span className="text-[10px] text-slate-400 font-medium">Instant Dispatch</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
