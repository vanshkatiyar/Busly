/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TravelMode, BusTrip, TrainTrip, FlightTrip, HotelItem, BookingRecord, RouteStop, RestStop } from './types';
import { MOCK_BUS_TRIPS, MOCK_TRAIN_TRIPS, MOCK_FLIGHT_TRIPS, MOCK_HOTEL_ITEMS, MOCK_REST_STOPS } from './data/mockData';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { BusSearchResults } from './components/BusSearchResults';
import { TrainSearchResults } from './components/TrainSearchResults';
import { FlightSearchResults } from './components/FlightSearchResults';
import { HotelSearchResults } from './components/HotelSearchResults';
import { LiveTrackingHub } from './components/LiveTrackingHub';
import { SeatLayoutModal } from './components/SeatLayoutModal';
import { PaymentModal } from './components/PaymentModal';
import { ETicketModal } from './components/ETicketModal';
import { MyBookingsDrawer } from './components/MyBookingsDrawer';
import { OffersSection } from './components/OffersSection';
import { PrimoSection } from './components/PrimoSection';
import { HelpModal } from './components/HelpModal';
import { RestStopModal } from './components/RestStopModal';
import { Footer } from './components/Footer';

const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    bookingId: 'RB942018',
    pnr: '2847193021',
    mode: 'bus',
    itemTitle: 'IntrCity SmartBus',
    subTitle: 'Bharat Benz A/C Sleeper (2+1)',
    from: 'Bangalore',
    to: 'Chennai',
    travelDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    passengers: [
      { name: 'Navin Chandra', age: 28, gender: 'male', seatNumber: 'L2, L3' },
    ],
    selectedSeats: ['L2', 'L3'],
    boardingPoint: {
      id: 'bp-1',
      name: 'Madiwala',
      landmark: 'Near Police Station',
      time: '21:30',
      lat: 12.9226,
      lng: 77.6174,
    },
    droppingPoint: {
      id: 'dp-3',
      name: 'Koyambedu',
      landmark: 'Omni Bus Stand',
      time: '05:30',
      lat: 13.0694,
      lng: 80.1948,
    },
    fareBreakdown: {
      baseFare: 1798,
      taxes: 90,
      discount: 150,
      totalAmount: 1738,
    },
    couponCode: 'REDBUS50',
    paymentMethod: 'UPI (GPAY)',
    bookedAt: 'Yesterday, 04:30 PM',
    status: 'CONFIRMED',
    vehicleNumber: 'KA-01-MJ-8822',
    driverContact: {
      name: 'Rameshwar Gowda',
      phone: '+91 98450 12890',
    },
  },
];

export default function App() {
  const [activeMode, setActiveMode] = useState<TravelMode>('bus');
  const [fromCity, setFromCity] = useState('Bangalore');
  const [toCity, setToCity] = useState('Chennai');
  const [travelDate, setTravelDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });

  // Stored Bookings
  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    const saved = localStorage.getItem('redbus_bookings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_BOOKINGS;
      }
    }
    return INITIAL_BOOKINGS;
  });

  // Modals & Panels
  const [activeSeatBus, setActiveSeatBus] = useState<BusTrip | null>(null);
  const [activePaymentConfig, setActivePaymentConfig] = useState<{
    amount: number;
    itemTitle: string;
    subTitle: string;
    from: string;
    to: string;
    travelDate: string;
    mode: TravelMode;
    selectedSeats?: string[];
    boardingPointName?: string;
    droppingPointName?: string;
  } | null>(null);

  const [activeTicketBooking, setActiveTicketBooking] = useState<BookingRecord | null>(null);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [activeRestStopBus, setActiveRestStopBus] = useState<BusTrip | null>(null);
  const [trackingFocusBus, setTrackingFocusBus] = useState<BusTrip>(MOCK_BUS_TRIPS[0]);

  // Persist bookings to localStorage
  useEffect(() => {
    localStorage.setItem('redbus_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Search handler from Hero
  const handleSearch = (from: string, to: string, date: string) => {
    setFromCity(from);
    setToCity(to);
    setTravelDate(date);
  };

  // Bus booking flow: Seat Layout -> Proceed to Payment
  const handleProceedFromSeats = (
    selectedSeats: string[],
    boardingPoint: RouteStop,
    droppingPoint: RouteStop,
    totalFare: number
  ) => {
    if (!activeSeatBus) return;

    const bus = activeSeatBus;
    setActiveSeatBus(null);

    setActivePaymentConfig({
      amount: totalFare,
      itemTitle: bus.operator,
      subTitle: bus.busType,
      from: bus.from,
      to: bus.to,
      travelDate,
      mode: 'bus',
      selectedSeats,
      boardingPointName: boardingPoint.name,
      droppingPointName: droppingPoint.name,
    });
  };

  // Train booking flow
  const handleBookTrainClass = (train: TrainTrip, selectedClass: TrainTrip['classes'][0]) => {
    setActivePaymentConfig({
      amount: selectedClass.price,
      itemTitle: `${train.trainName} (${train.trainNumber})`,
      subTitle: `Class: ${selectedClass.name} (${selectedClass.code}) · IRCTC Authorized`,
      from: train.fromStation,
      to: train.toStation,
      travelDate,
      mode: 'train',
      selectedSeats: ['Auto Allocated on Charting'],
    });
  };

  // Flight booking flow
  const handleBookFlight = (flight: FlightTrip) => {
    setActivePaymentConfig({
      amount: flight.price,
      itemTitle: `${flight.airline} ${flight.flightNumber}`,
      subTitle: `Economy Class · Free 7kg Cabin + ${flight.checkInBaggage}`,
      from: flight.fromAirport,
      to: flight.toAirport,
      travelDate,
      mode: 'flight',
      selectedSeats: ['12F (Window Seat)'],
    });
  };

  // Hotel booking flow
  const handleBookHotel = (hotel: HotelItem) => {
    setActivePaymentConfig({
      amount: hotel.pricePerNight,
      itemTitle: hotel.name,
      subTitle: `${hotel.roomType} · Check-in 12:00 PM · Free Breakfast`,
      from: `${hotel.area}, ${hotel.city}`,
      to: '1 Night Stay',
      travelDate,
      mode: 'hotel',
      selectedSeats: ['Room 408'],
    });
  };

  // On successful payment confirmation
  const handlePaymentSuccess = (newBooking: BookingRecord) => {
    setActivePaymentConfig(null);
    setBookings([newBooking, ...bookings]);
    setActiveTicketBooking(newBooking);
  };

  // Cancel booking
  const handleCancelBooking = (bookingId: string) => {
    if (confirm('Are you sure you want to cancel this booking? A refund will be credited instantly.')) {
      setBookings(
        bookings.map((b) =>
          b.bookingId === bookingId ? { ...b, status: 'CANCELLED' as const } : b
        )
      );
    }
  };

  // Switch to live tracking
  const handleDirectLiveTrack = (bus: BusTrip) => {
    setTrackingFocusBus(bus);
    setActiveMode('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackBooking = (booking: BookingRecord) => {
    const matchedBus = MOCK_BUS_TRIPS.find((b) => b.operator === booking.itemTitle) || MOCK_BUS_TRIPS[0];
    setTrackingFocusBus(matchedBus);
    setActiveMode('tracking');
    setIsMyBookingsOpen(false);
    setActiveTicketBooking(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F7F8]">
      {/* Top Bar Header */}
      <Header
        activeMode={activeMode}
        onSelectMode={(mode) => {
          setActiveMode(mode);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        bookingCount={bookings.filter((b) => b.status === 'CONFIRMED').length}
        onOpenMyBookings={() => setIsMyBookingsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1">
        {/* Hero Search is shown on Bus, Train, Flight & Hotel modes */}
        {activeMode !== 'tracking' && (
          <HeroSearch
            activeMode={activeMode}
            onSearch={handleSearch}
            onOpenLiveTracking={() => setActiveMode('tracking')}
            onQuickPNR={() => setActiveMode('train')}
          />
        )}

        {/* Content Section by Active Mode */}
        {activeMode === 'bus' && (
          <>
            <BusSearchResults
              buses={MOCK_BUS_TRIPS}
              fromCity={fromCity}
              toCity={toCity}
              travelDate={travelDate}
              onSelectBus={(bus) => setActiveSeatBus(bus)}
              onTrackBus={handleDirectLiveTrack}
              onViewRestStop={(bus) => setActiveRestStopBus(bus)}
            />
            <OffersSection />
            <PrimoSection onExplorePrimo={() => setActiveMode('bus')} />
          </>
        )}

        {activeMode === 'train' && (
          <>
            <TrainSearchResults
              fromCity={fromCity}
              toCity={toCity}
              travelDate={travelDate}
              onBookTrainClass={handleBookTrainClass}
              onTrackTrain={() => setActiveMode('tracking')}
            />
            <OffersSection />
          </>
        )}

        {activeMode === 'flight' && (
          <>
            <FlightSearchResults
              fromCity={fromCity}
              toCity={toCity}
              travelDate={travelDate}
              onBookFlight={handleBookFlight}
              onTrackFlight={() => setActiveMode('tracking')}
            />
            <OffersSection />
          </>
        )}

        {activeMode === 'hotel' && (
          <>
            <HotelSearchResults
              city={fromCity}
              onBookHotel={handleBookHotel}
              onTrackHotel={() => setActiveMode('tracking')}
            />
            <OffersSection />
          </>
        )}

        {activeMode === 'tracking' && (
          <LiveTrackingHub
            selectedBus={trackingFocusBus}
            onBookNow={(mode) => setActiveMode(mode as TravelMode)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Overlays */}
      {/* 1. Seat Selection Modal */}
      {activeSeatBus && (
        <SeatLayoutModal
          bus={activeSeatBus}
          travelDate={travelDate}
          onClose={() => setActiveSeatBus(null)}
          onProceedToPayment={handleProceedFromSeats}
        />
      )}

      {/* 2. Secure Payment Gateway Demo Modal */}
      {activePaymentConfig && (
        <PaymentModal
          amount={activePaymentConfig.amount}
          itemTitle={activePaymentConfig.itemTitle}
          subTitle={activePaymentConfig.subTitle}
          from={activePaymentConfig.from}
          to={activePaymentConfig.to}
          travelDate={activePaymentConfig.travelDate}
          mode={activePaymentConfig.mode}
          selectedSeats={activePaymentConfig.selectedSeats}
          boardingPointName={activePaymentConfig.boardingPointName}
          droppingPointName={activePaymentConfig.droppingPointName}
          onClose={() => setActivePaymentConfig(null)}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {/* 3. e-Ticket Pass & Printable Receipt Modal */}
      {activeTicketBooking && (
        <ETicketModal
          booking={activeTicketBooking}
          onClose={() => setActiveTicketBooking(null)}
          onTrackTrip={handleTrackBooking}
        />
      )}

      {/* 4. My Bookings Drawer */}
      <MyBookingsDrawer
        isOpen={isMyBookingsOpen}
        bookings={bookings}
        onClose={() => setIsMyBookingsOpen(false)}
        onViewTicket={(b) => {
          setIsMyBookingsOpen(false);
          setActiveTicketBooking(b);
        }}
        onTrackBooking={handleTrackBooking}
        onCancelBooking={handleCancelBooking}
        onStartBooking={() => setActiveMode('bus')}
      />

      {/* 5. 24x7 Customer Care & Help Modal */}
      {isHelpOpen && <HelpModal onClose={() => setIsHelpOpen(false)} />}

      {/* 6. Highway Rest Stop & Food Menu Modal */}
      {activeRestStopBus && (
        <RestStopModal
          restStop={
            MOCK_REST_STOPS[`${activeRestStopBus.from}-${activeRestStopBus.to}`] ||
            MOCK_REST_STOPS['Bangalore-Chennai']
          }
          busOperator={activeRestStopBus.operator}
          onClose={() => setActiveRestStopBus(null)}
        />
      )}
    </div>
  );
}
