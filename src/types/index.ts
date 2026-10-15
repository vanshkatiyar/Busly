export type TravelMode = 'bus' | 'train' | 'flight' | 'hotel' | 'tracking';

export interface BusSeat {
  id: string;
  number: string;
  deck: 'lower' | 'upper';
  type: 'seater' | 'sleeper';
  price: number;
  status: 'available' | 'booked' | 'selected' | 'ladies';
  row: number;
  col: number;
}

export interface RouteStop {
  id: string;
  name: string;
  landmark: string;
  time: string;
  lat: number;
  lng: number;
  isPassed?: boolean;
}

export interface BusTrip {
  id: string;
  operator: string;
  busType: string; // e.g. "Volvo Multi-Axle A/C Sleeper (2+1)"
  category: 'primo' | 'standard' | 'government';
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  rating: number;
  totalReviews: number;
  price: number;
  originalPrice: number;
  seatsAvailable: number;
  liveTrackingAvailable: boolean;
  boardingPoints: RouteStop[];
  droppingPoints: RouteStop[];
  amenities: string[];
  vehicleNo: string;
  driverName: string;
  driverPhone: string;
}

export interface TrainTrip {
  id: string;
  trainNumber: string;
  trainName: string;
  fromStation: string;
  toStation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  runsOn: string[]; // ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  classes: {
    code: '1A' | '2A' | '3A' | 'SL' | 'CC';
    name: string;
    price: number;
    availability: string; // e.g. "AVAILABLE-0042" or "WL 12"
    confirmProbability?: number; // e.g. 96
  }[];
  currentStatus?: {
    currentStation: string;
    delayMinutes: number;
    platform: string;
    lastUpdated: string;
  };
}

export interface FlightTrip {
  id: string;
  flightNumber: string;
  airline: string;
  airlineLogoCode: string; // 'indigo' | 'airindia' | 'akasa' | 'spicejet'
  fromAirport: string;
  toAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  isNonStop: boolean;
  price: number;
  cabinBaggage: string;
  checkInBaggage: string;
  flightTelemetry?: {
    altitudeFt: number;
    speedKnots: number;
    distanceCoveredPct: number;
  };
}

export interface HotelRoomCombo {
  name: string;
  mealPlan: string;
  price: number;
  taxesAndFees: number;
  isPopular?: boolean;
}

export interface HotelItem {
  id: string;
  name: string;
  city: string;
  area: string;
  rating: number;
  totalRatings: number;
  pricePerNight: number;
  originalPrice: number;
  roomType: string;
  amenities: string[];
  checkInTime: string;
  checkOutTime: string;
  imageTheme: string;
  roomStatus?: 'Ready' | 'Cleaning' | 'Reserved';
  images?: string[];
  category?: 'hotel' | 'hostel' | 'homestay';
  brand?: 'OYO' | 'FabHotels' | 'Treebo' | 'Bloom' | 'goSTOPS' | 'The Hosteller';
  distanceLandmark?: string;
  isFlashDeal?: boolean;
  flashDiscountPercent?: number;
  starRating?: number;
  coupleFriendly?: boolean;
  freeBreakfast?: boolean;
  freeCancellation?: boolean;
  isGuestFavourite?: boolean;
  recentBookings?: number;
  taxAndFees?: number;
  roomCombos?: HotelRoomCombo[];
}

export interface Passenger {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  seatNumber?: string;
}

export interface BookingRecord {
  bookingId: string;
  pnr: string;
  mode: TravelMode;
  itemTitle: string;
  subTitle: string;
  from: string;
  to: string;
  travelDate: string;
  passengers: Passenger[];
  selectedSeats?: string[];
  boardingPoint?: RouteStop;
  droppingPoint?: RouteStop;
  fareBreakdown: {
    baseFare: number;
    taxes: number;
    discount: number;
    totalAmount: number;
  };
  couponCode?: string;
  paymentMethod: string;
  bookedAt: string;
  status: 'CONFIRMED' | 'CANCELLED';
  vehicleNumber?: string;
  driverContact?: {
    name: string;
    phone: string;
  };
}

export interface RestStopMenuItem {
  id: string;
  name: string;
  price: number;
  isVeg: boolean;
  category: 'beverages' | 'meals' | 'snacks' | 'desserts';
  isBestseller?: boolean;
}

export interface RestStop {
  id: string;
  name: string;
  highway: string;
  location: string;
  expectedHaltTime: string;
  durationMins: number;
  hygieneScore: number;
  restroomCleanliness: number;
  isSanitizedCertified: boolean;
  isLadiesSafe: boolean;
  cuisineTypes: string[];
  menuItems: RestStopMenuItem[];
}

export interface SeatErgonomics {
  seatNumber: string;
  legroomInches: number;
  legroomGrade: 'Spacious (38"+)' | 'Standard (34"-36")' | 'Compact (32")';
  reclineDegrees: number;
  chargingScorePct: number;
  vibrationScorePct: number;
  windowAlignment: 'Panoramic Clear View' | 'Standard Window' | 'Aisle Berth';
  travelerReview: string;
  travelerRating: number;
}

export interface FarePrediction {
  routeKey: string;
  currentAvg: number;
  predictedPeak: number;
  predictedLow: number;
  trend: 'rising' | 'dropping' | 'stable';
  changePct: number;
  recommendation: 'Book Now' | 'Wait for Drop' | 'Fare Stable';
  forecastExplanation: string;
  priceHistory: { day: string; price: number; isPredicted?: boolean }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'driver';
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  isLocationShare?: boolean;
  coordinates?: { lat: number; lng: number };
}
