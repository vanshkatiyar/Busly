import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, Star, MapPin, Search, Calendar, Users, Clock, 
  Sparkles, Heart, ChevronLeft, ChevronRight, SlidersHorizontal, 
  Filter, Check, ArrowRight, Mic, ShieldCheck, Tag, X,
  BadgePercent, Coffee, Key, Hotel, Home, CheckCircle2
} from 'lucide-react';
import { HotelItem, HotelRoomCombo } from '../types';
import { MOCK_HOTEL_ITEMS } from '../data/mockData';
import { HotelDetailModal } from './HotelDetailModal';

interface HotelSearchResultsProps {
  city: string;
  onBookHotel: (hotel: HotelItem, combo?: HotelRoomCombo) => void;
  onTrackHotel: (hotel: HotelItem) => void;
  wishlistIds?: string[];
  onToggleWishlist?: (hotelId: string) => void;
}

export const HotelSearchResults: React.FC<HotelSearchResultsProps> = ({
  city,
  onBookHotel,
  onTrackHotel,
  wishlistIds = [],
  onToggleWishlist,
}) => {
  // Search Inputs
  const [selectedCity, setSelectedCity] = useState(city || 'Bangalore');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  
  // Guest Popover
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [isGuestsOpen, setIsGuestsOpen] = useState(false);

  // View state: 'landing' (browse mode with flash deals, budget collections, brands) vs 'results' (search listing with filters)
  const [viewState, setViewState] = useState<'landing' | 'results'>('landing');

  // Filters
  const [aiFilterQuery, setAiFilterQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all'); // 'all' | 'hotel' | 'hostel' | 'homestay'
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedStar, setSelectedStar] = useState<number>(0);
  const [onlyFlashDeals, setOnlyFlashDeals] = useState(false);
  const [onlyCoupleFriendly, setOnlyCoupleFriendly] = useState(false);
  const [onlyFreeBreakfast, setOnlyFreeBreakfast] = useState(false);
  const [onlyFreeCancellation, setOnlyFreeCancellation] = useState(false);

  // Selected hotel for Room Selection Modal (Screenshot 5)
  const [activeModalHotel, setActiveModalHotel] = useState<HotelItem | null>(null);

  // Image carousel indices for cards
  const [cardImageIndices, setCardImageIndices] = useState<Record<string, number>>({});

  // Countdown timer for Flash Deals (starts at 06:19:07 as shown in screenshot)
  const [timeLeft, setTimeLeft] = useState({ hours: 6, minutes: 19, seconds: 7 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 6, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format date nicely (e.g. "15 Oct, Thu")
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      const day = d.getDate();
      const month = d.toLocaleDateString('en-US', { month: 'short' });
      const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
      return `${day} ${month}, ${weekday}`;
    } catch {
      return dateStr;
    }
  };

  const guestsSummary = `${rooms} Room · ${adults} Adult${adults > 1 ? 's' : ''}${childrenCount > 0 ? ` · ${childrenCount} Child` : ''}`;

  // Filtered hotels
  const filteredHotels = useMemo(() => {
    return MOCK_HOTEL_ITEMS.filter((hotel) => {
      // Category filter
      if (selectedCategory !== 'all' && hotel.category !== selectedCategory) return false;
      // Brand filter
      if (selectedBrand !== 'all' && hotel.brand !== selectedBrand) return false;
      // Price
      if (hotel.pricePerNight > maxPrice) return false;
      // Rating
      if (minRating > 0 && hotel.rating < minRating) return false;
      // Star rating
      if (selectedStar > 0 && hotel.starRating !== selectedStar) return false;
      // Flash deals
      if (onlyFlashDeals && !hotel.isFlashDeal) return false;
      // Amenities
      if (onlyCoupleFriendly && !hotel.coupleFriendly) return false;
      if (onlyFreeBreakfast && !hotel.freeBreakfast) return false;
      if (onlyFreeCancellation && !hotel.freeCancellation) return false;

      // AI smart search text matching
      if (aiFilterQuery.trim()) {
        const q = aiFilterQuery.toLowerCase();
        const searchable = `${hotel.name} ${hotel.area} ${hotel.city} ${hotel.distanceLandmark || ''} ${hotel.amenities.join(' ')} ${hotel.category || ''} ${hotel.brand || ''}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }

      return true;
    });
  }, [selectedCategory, selectedBrand, maxPrice, minRating, selectedStar, onlyFlashDeals, onlyCoupleFriendly, onlyFreeBreakfast, onlyFreeCancellation, aiFilterQuery]);

  const handleNextImage = (hotelId: string, maxLen: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCardImageIndices((prev) => ({
      ...prev,
      [hotelId]: ((prev[hotelId] || 0) + 1) % maxLen,
    }));
  };

  const handlePrevImage = (hotelId: string, maxLen: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCardImageIndices((prev) => ({
      ...prev,
      [hotelId]: ((prev[hotelId] || 0) - 1 + maxLen) % maxLen,
    }));
  };

  const handleSearchClick = (e: React.FormEvent) => {
    e.preventDefault();
    setViewState('results');
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setMaxPrice(5000);
    setMinRating(0);
    setSelectedStar(0);
    setOnlyFlashDeals(false);
    setOnlyCoupleFriendly(false);
    setOnlyFreeBreakfast(false);
    setOnlyFreeCancellation(false);
    setAiFilterQuery('');
  };

  const popularCities = ['Bangalore', 'Goa', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai', 'Manali', 'Pune'];

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. HERO BANNER & SEARCH CONTAINER (Screenshot 1) */}
      <section className="relative bg-gradient-to-r from-[#80101b] via-[#9e1626] to-[#80101b] text-white pt-10 pb-20 px-4 sm:px-6 lg:px-8 overflow-visible">
        
        {/* Background Architectural Vector Skyline & Palm Trees Backdrop */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1440 320" fill="none" preserveAspectRatio="xMidYMid slice">
            <path d="M0,280 C320,320 640,220 960,260 C1280,300 1440,240 1440,240 L1440,320 L0,320 Z" fill="#4a040b" />
            {/* Buildings silhouette */}
            <rect x="850" y="80" width="180" height="240" rx="6" fill="#fff" opacity="0.12" />
            <rect x="880" y="110" width="25" height="20" rx="2" fill="#fff" opacity="0.25" />
            <rect x="930" y="110" width="25" height="20" rx="2" fill="#fff" opacity="0.25" />
            <rect x="980" y="110" width="25" height="20" rx="2" fill="#fff" opacity="0.25" />
            <rect x="880" y="150" width="25" height="20" rx="2" fill="#fff" opacity="0.25" />
            <rect x="930" y="150" width="25" height="20" rx="2" fill="#fff" opacity="0.25" />
            <rect x="980" y="150" width="25" height="20" rx="2" fill="#fff" opacity="0.25" />
            <rect x="880" y="190" width="25" height="20" rx="2" fill="#fff" opacity="0.25" />
            <rect x="930" y="190" width="25" height="20" rx="2" fill="#fff" opacity="0.25" />
            <rect x="980" y="190" width="25" height="20" rx="2" fill="#fff" opacity="0.25" />
            <rect x="1080" y="120" width="140" height="200" rx="6" fill="#fff" opacity="0.1" />
            <circle cx="800" cy="180" r="14" fill="#fff" opacity="0.15" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-20">
          
          {/* Hero Titles (Screenshot 1) */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-2">
              Pocket friendly, Verified stays
            </h1>
            <p className="text-sm sm:text-base text-rose-100/90 font-medium flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-300" />
              <span>Available in 2400+ cities</span>
            </p>
          </div>

          {/* Floating Search Widget (Screenshot 1) */}
          <div className="relative">
            <form onSubmit={handleSearchClick}>
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col lg:flex-row items-stretch divide-y lg:divide-y-0 lg:divide-x divide-slate-200 text-slate-800">
                
                {/* 1. City / Hotel Name Field */}
                <div className="flex-[1.5] min-w-0 p-4 hover:bg-slate-50 transition-colors relative">
                  <div className="flex items-center gap-3">
                    <Search className="w-5 h-5 text-slate-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
                        City, area or hotel name
                      </label>
                      <input
                        type="text"
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        onFocus={() => setIsCityDropdownOpen(true)}
                        placeholder="Search city or hotel"
                        className="w-full text-base font-black text-slate-900 bg-transparent focus:outline-hidden truncate"
                      />
                    </div>
                  </div>

                  {/* City Suggestions Dropdown */}
                  {isCityDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-400 uppercase">Popular Cities</span>
                        <button
                          type="button"
                          onClick={() => setIsCityDropdownOpen(false)}
                          className="text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {popularCities.map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => {
                              setSelectedCity(c);
                              setIsCityDropdownOpen(false);
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-[#d84e55] hover:text-white transition-colors cursor-pointer"
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Check-In Date (No text overlap, invisible native picker over formatted label) */}
                <div className="flex-1 min-w-[170px] p-4 hover:bg-slate-50 transition-colors relative cursor-pointer group">
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                    title="Click to change check-in date"
                  />
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-400 group-hover:text-[#d84e55] transition-colors shrink-0" />
                    <div className="min-w-0">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
                        Check in
                      </label>
                      <span className="block text-base font-black text-slate-900 truncate mt-0.5">
                        {formatDateDisplay(checkInDate)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Check-Out Date (No text overlap, invisible native picker over formatted label) */}
                <div className="flex-1 min-w-[170px] p-4 hover:bg-slate-50 transition-colors relative cursor-pointer group">
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                    title="Click to change check-out date"
                  />
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-slate-400 group-hover:text-[#d84e55] transition-colors shrink-0" />
                    <div className="min-w-0">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
                        Check out
                      </label>
                      <span className="block text-base font-black text-slate-900 truncate mt-0.5">
                        {formatDateDisplay(checkOutDate)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. Rooms & Guests */}
                <div className="flex-[1.2] min-w-[200px] p-4 hover:bg-slate-50 transition-colors relative">
                  <div 
                    onClick={() => setIsGuestsOpen(!isGuestsOpen)}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <Users className="w-5 h-5 text-slate-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider truncate">
                        No. of rooms & guests
                      </label>
                      <span className="text-base font-black text-slate-900 block truncate mt-0.5">
                        {guestsSummary}
                      </span>
                    </div>
                  </div>

                  {/* Guests Dropdown Popover */}
                  {isGuestsOpen && (
                    <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-900">Select Rooms & Guests</span>
                        <button
                          type="button"
                          onClick={() => setIsGuestsOpen(false)}
                          className="text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Rooms Counter */}
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <span className="font-black text-slate-900 block">Rooms</span>
                          <span className="text-[10px] text-slate-400">Total rooms needed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setRooms(Math.max(1, rooms - 1))}
                            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-5 text-center font-black">{rooms}</span>
                          <button
                            type="button"
                            onClick={() => setRooms(rooms + 1)}
                            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Adults Counter */}
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <span className="font-black text-slate-900 block">Adults</span>
                          <span className="text-[10px] text-slate-400">Age 13+ years</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setAdults(Math.max(1, adults - 1))}
                            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-5 text-center font-black">{adults}</span>
                          <button
                            type="button"
                            onClick={() => setAdults(adults + 1)}
                            className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsGuestsOpen(false)}
                        className="w-full py-2 bg-[#d84e55] hover:bg-[#c23f46] text-white text-xs font-black rounded-xl cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Floating Red Pill Button (Screenshot 1) */}
              <div className="flex justify-center -mt-6">
                <button
                  type="submit"
                  className="px-10 py-3.5 bg-[#d84e55] hover:bg-[#c23f46] text-white text-base font-black rounded-full shadow-xl shadow-red-950/40 cursor-pointer uppercase tracking-wider transition-transform duration-150 active:scale-95 flex items-center gap-2"
                >
                  <span>Search hotels</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

        </div>
      </section>

      {/* 2. FLASH DEALS SECTION (Screenshot 1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        
        {/* Flash Deals Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-amber-500 text-white font-black text-base uppercase tracking-wider px-3.5 py-1.5 rounded-xl shadow-md">
              <Clock className="w-5 h-5 animate-spin-slow" />
              <span>FLASH DEALS</span>
            </div>
            <span className="text-xs font-bold text-slate-500">
              Exclusive limited time discounts up to 82% off
            </span>
          </div>

          {/* Countdown Clock (Screenshot 1: "Offer ends in 06 hr 19 min 07 sec") */}
          <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm">
            <span className="text-slate-400">Offer ends in</span>
            <div className="flex items-center gap-1 font-mono font-black text-amber-400">
              <span className="bg-slate-800 px-1.5 py-0.5 rounded">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-slate-500">:</span>
              <span className="bg-slate-800 px-1.5 py-0.5 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-slate-500">:</span>
              <span className="bg-slate-800 px-1.5 py-0.5 rounded">{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        {/* Horizontal Flash Deals Carousel (Screenshot 1) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {MOCK_HOTEL_ITEMS.filter((h) => h.isFlashDeal).slice(0, 5).map((hotel) => (
            <div
              key={hotel.id}
              onClick={() => setActiveModalHotel(hotel)}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Image & Rating */}
                <div className="h-38 relative overflow-hidden bg-slate-100">
                  <img
                    src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80'}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Rating Tag */}
                  <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-md text-white text-[10px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{hotel.rating}</span>
                    <span className="text-slate-400 font-normal">({hotel.totalRatings})</span>
                  </div>

                  {/* Wishlist Icon */}
                  {onToggleWishlist && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(hotel.id);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-700 shadow-xs transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          wishlistIds.includes(hotel.id) ? 'fill-rose-600 text-rose-600' : ''
                        }`}
                      />
                    </button>
                  )}
                </div>

                {/* Orange Flash Deal Banner */}
                <div className="bg-gradient-to-r from-red-600 to-amber-600 text-white text-[11px] font-black px-3 py-1 text-center uppercase tracking-wider">
                  Flash deal · {hotel.flashDiscountPercent || 35}% off
                </div>

                {/* Title & Area */}
                <div className="p-3.5 space-y-1">
                  <h4 className="font-black text-slate-900 text-xs line-clamp-1 group-hover:text-[#d84e55] transition-colors">
                    {hotel.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate">
                    {hotel.area}
                  </p>
                </div>
              </div>

              {/* Price & Per Night */}
              <div className="p-3.5 pt-0 border-t border-slate-100 mt-2 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 line-through block">
                    ₹{hotel.originalPrice}
                  </span>
                  <span className="font-mono text-base font-black text-slate-900">
                    ₹{hotel.pricePerNight}
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-500">
                  Per night
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. THE BUDGET COLLECTION (Screenshot 2) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            The Budget Collection
          </h2>
          <p className="text-xs text-slate-500">Verified handpicked stays under your dream budget</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Under 999 */}
          <div
            onClick={() => {
              setMaxPrice(999);
              setViewState('results');
              window.scrollTo({ top: 700, behavior: 'smooth' });
            }}
            className="h-56 rounded-3xl overflow-hidden relative group cursor-pointer shadow-md hover:shadow-xl transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80"
              alt="Under 999"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-5 right-5 bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-5 py-2.5 rounded-2xl shadow-xl flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-wider">Under</span>
              <span className="font-black text-xl sm:text-2xl tracking-tight">₹999</span>
            </div>
            <div className="absolute bottom-5 left-5 text-white">
              <span className="text-sm font-black block">Comfort Deluxe Stays</span>
              <span className="text-xs text-slate-300">Clean AC Rooms with Free Wi-Fi</span>
            </div>
          </div>

          {/* Under 799 */}
          <div
            onClick={() => {
              setMaxPrice(799);
              setViewState('results');
              window.scrollTo({ top: 700, behavior: 'smooth' });
            }}
            className="h-56 rounded-3xl overflow-hidden relative group cursor-pointer shadow-md hover:shadow-xl transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80"
              alt="Under 799"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-5 right-5 bg-gradient-to-r from-blue-600 to-cyan-700 text-white px-5 py-2.5 rounded-2xl shadow-xl flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-wider">Under</span>
              <span className="font-black text-xl sm:text-2xl tracking-tight">₹799</span>
            </div>
            <div className="absolute bottom-5 left-5 text-white">
              <span className="text-sm font-black block">Executive Stays</span>
              <span className="text-xs text-slate-300">Transit & Couple Friendly Hubs</span>
            </div>
          </div>

          {/* Under 499 */}
          <div
            onClick={() => {
              setMaxPrice(499);
              setViewState('results');
              window.scrollTo({ top: 700, behavior: 'smooth' });
            }}
            className="h-56 rounded-3xl overflow-hidden relative group cursor-pointer shadow-md hover:shadow-xl transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80"
              alt="Under 499"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-5 right-5 bg-gradient-to-r from-purple-700 to-indigo-900 text-white px-5 py-2.5 rounded-2xl shadow-xl flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-wider">Under</span>
              <span className="font-black text-xl sm:text-2xl tracking-tight">₹499</span>
            </div>
            <div className="absolute bottom-5 left-5 text-white">
              <span className="text-sm font-black block">Hostel & Backpacker Pods</span>
              <span className="text-xs text-slate-300">Modern Pods & Dorm Beds</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VALUE STAYS (Screenshot 2) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Value Stays
          </h2>
          <p className="text-xs text-slate-500">For travellers who love to save</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Hotels */}
          <div
            onClick={() => {
              setSelectedCategory('hotel');
              setViewState('results');
              window.scrollTo({ top: 700, behavior: 'smooth' });
            }}
            className="h-48 rounded-2xl overflow-hidden relative group cursor-pointer shadow-md hover:shadow-xl transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80"
              alt="Hotels"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-lg font-black block">Hotels</h3>
              <p className="text-xs text-slate-300">Affordable & comfortable rooms</p>
            </div>
          </div>

          {/* Hostels */}
          <div
            onClick={() => {
              setSelectedCategory('hostel');
              setViewState('results');
              window.scrollTo({ top: 700, behavior: 'smooth' });
            }}
            className="h-48 rounded-2xl overflow-hidden relative group cursor-pointer shadow-md hover:shadow-xl transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=800&auto=format&fit=crop&q=80"
              alt="Hostels"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-lg font-black block">Hostels</h3>
              <p className="text-xs text-slate-300">Happy deals on dorm rooms</p>
            </div>
          </div>

          {/* Homestays */}
          <div
            onClick={() => {
              setSelectedCategory('homestay');
              setViewState('results');
              window.scrollTo({ top: 700, behavior: 'smooth' });
            }}
            className="h-48 rounded-2xl overflow-hidden relative group cursor-pointer shadow-md hover:shadow-xl transition-all"
          >
            <img
              src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&auto=format&fit=crop&q=80"
              alt="Homestays"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-lg font-black block">Homestays</h3>
              <p className="text-xs text-slate-300">Perfect for group bookings</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TOP HOTEL BRANDS (Screenshot 3) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Top Hotel Brands
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          
          {/* OYO */}
          <div
            onClick={() => {
              setSelectedBrand('OYO');
              setViewState('results');
              window.scrollTo({ top: 700, behavior: 'smooth' });
            }}
            className="bg-[#E61C24] text-white p-4 rounded-2xl cursor-pointer hover:scale-103 transition-transform shadow-md flex flex-col justify-between h-34"
          >
            <span className="text-2xl font-black tracking-widest block">OYO</span>
            <div>
              <span className="text-xs font-bold block">Starts from ₹399</span>
              <span className="text-[11px] text-white/80">550+ cities</span>
            </div>
            <div className="flex justify-end">
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">➔</span>
            </div>
          </div>

          {/* FabHotels */}
          <div
            onClick={() => {
              setSelectedBrand('FabHotels');
              setViewState('results');
              window.scrollTo({ top: 700, behavior: 'smooth' });
            }}
            className="bg-[#182848] text-white p-4 rounded-2xl cursor-pointer hover:scale-103 transition-transform shadow-md flex flex-col justify-between h-34"
          >
            <span className="text-lg font-black block">fabHotels</span>
            <div>
              <span className="text-xs font-bold block">Starts from ₹699</span>
              <span className="text-[11px] text-white/80">100+ cities</span>
            </div>
            <div className="flex justify-end">
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">➔</span>
            </div>
          </div>

          {/* Treebo */}
          <div
            onClick={() => {
              setSelectedBrand('Treebo');
              setViewState('results');
              window.scrollTo({ top: 700, behavior: 'smooth' });
            }}
            className="bg-[#5B3A8C] text-white p-4 rounded-2xl cursor-pointer hover:scale-103 transition-transform shadow-md flex flex-col justify-between h-34"
          >
            <span className="text-lg font-black block">treebo</span>
            <div>
              <span className="text-xs font-bold block">Starts from ₹1199</span>
              <span className="text-[11px] text-white/80">100+ cities</span>
            </div>
            <div className="flex justify-end">
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">➔</span>
            </div>
          </div>

          {/* Bloom */}
          <div
            onClick={() => {
              setSelectedBrand('Bloom');
              setViewState('results');
              window.scrollTo({ top: 700, behavior: 'smooth' });
            }}
            className="bg-[#FFD200] text-slate-900 p-4 rounded-2xl cursor-pointer hover:scale-103 transition-transform shadow-md flex flex-col justify-between h-34"
          >
            <span className="text-xl font-black block">bloom</span>
            <div>
              <span className="text-xs font-black block">Starts from ₹1799</span>
              <span className="text-[11px] text-slate-800">15+ cities</span>
            </div>
            <div className="flex justify-end">
              <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-xs font-bold">➔</span>
            </div>
          </div>

          {/* goSTOPS */}
          <div
            onClick={() => {
              setSelectedBrand('goSTOPS');
              setViewState('results');
              window.scrollTo({ top: 700, behavior: 'smooth' });
            }}
            className="bg-[#E91E63] text-white p-4 rounded-2xl cursor-pointer hover:scale-103 transition-transform shadow-md flex flex-col justify-between h-34"
          >
            <span className="text-lg font-black block">goSTOPS</span>
            <div>
              <span className="text-xs font-bold block">Starts from ₹299</span>
              <span className="text-[11px] text-white/80">23+ cities</span>
            </div>
            <div className="flex justify-end">
              <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">➔</span>
            </div>
          </div>

          {/* The Hosteller */}
          <div
            onClick={() => {
              setSelectedBrand('The Hosteller');
              setViewState('results');
              window.scrollTo({ top: 700, behavior: 'smooth' });
            }}
            className="bg-[#FFF176] text-slate-900 p-4 rounded-2xl cursor-pointer hover:scale-103 transition-transform shadow-md flex flex-col justify-between h-34"
          >
            <span className="text-sm font-black block">THE HOSTELLER</span>
            <div>
              <span className="text-xs font-black block">Starts from ₹299</span>
              <span className="text-[11px] text-slate-800">35+ cities</span>
            </div>
            <div className="flex justify-end">
              <span className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center text-xs font-bold">➔</span>
            </div>
          </div>

        </div>
      </section>

      {/* 6. ONLY ON BUSLY (Screenshot 3 - replaced redbus with busly, original design) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFEB3B] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg border border-amber-300">
          
          {/* Subtle sunburst lines in background */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polygon points="50,50 0,0 20,0" fill="#E65100" />
              <polygon points="50,50 40,0 60,0" fill="#E65100" />
              <polygon points="50,50 80,0 100,0" fill="#E65100" />
              <polygon points="50,50 100,20 100,40" fill="#E65100" />
              <polygon points="50,50 100,60 100,80" fill="#E65100" />
            </svg>
          </div>

          <div className="relative z-10 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Only on Busly
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Offer 1 */}
              <div className="bg-white rounded-2xl p-5 shadow-md flex items-center justify-between gap-4 border border-slate-100">
                <div className="space-y-1">
                  <h3 className="font-black text-base text-slate-900">Flat 15% Instant Off</h3>
                  <span className="text-[11px] text-slate-400 block">Valid till 31 Dec</span>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono font-black text-slate-800 mt-2">
                    <Tag className="w-3.5 h-3.5 text-[#d84e55]" />
                    <span>BUSLYSTAYS</span>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-2xl shrink-0">
                  🎉
                </div>
              </div>

              {/* Offer 2 */}
              <div className="bg-white rounded-2xl p-5 shadow-md flex items-center justify-between gap-4 border border-slate-100">
                <div className="space-y-1">
                  <h3 className="font-black text-base text-slate-900">12% Off in Select Cities</h3>
                  <span className="text-[11px] text-slate-400 block">Valid till 31 Dec</span>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono font-black text-slate-800 mt-2">
                    <Tag className="w-3.5 h-3.5 text-[#d84e55]" />
                    <span>PILGRIMPASS</span>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-2xl shrink-0">
                  🛕
                </div>
              </div>

              {/* Offer 3 */}
              <div className="bg-white rounded-2xl p-5 shadow-md flex items-center justify-between gap-4 border border-slate-100">
                <div className="space-y-1">
                  <h3 className="font-black text-base text-slate-900">Upto 35% off on Hourly Stays</h3>
                  <span className="text-[11px] text-slate-400 block">Valid till 31 Dec</span>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono font-black text-slate-800 mt-2">
                    <Tag className="w-3.5 h-3.5 text-[#d84e55]" />
                    <span>SHORTSTAYS</span>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl shrink-0">
                  ⏱️
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 7. SEARCH RESULTS VIEW (Screenshot 4) */}
      <section id="results-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pt-6">
        
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Showing Properties in {selectedCity}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Found {filteredHotels.length} verified stays • {formatDateDisplay(checkInDate)} - {formatDateDisplay(checkOutDate)}
            </p>
          </div>

          {/* Quick Active Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#d84e55] text-white text-xs font-bold">
                {selectedCategory}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('all')} />
              </span>
            )}
            {selectedBrand !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold">
                {selectedBrand}
                <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedBrand('all')} />
              </span>
            )}
            {(selectedCategory !== 'all' || selectedBrand !== 'all' || maxPrice < 5000 || minRating > 0 || onlyFlashDeals || aiFilterQuery) && (
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-[#d84e55] hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Two-Column Search Grid: Left Filters Sidebar, Right Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar: Eazzy Filter & Traditional Filters (Screenshot 4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Eazzy Filter - AI Powered Smart Search (Screenshot 4) */}
            <div className="bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-white p-5 rounded-2xl border border-indigo-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 font-black text-sm">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Eazzy filter</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 ml-auto">
                  AI powered smart search
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={aiFilterQuery}
                  onChange={(e) => setAiFilterQuery(e.target.value)}
                  placeholder="Try 'hostels with breakfast near Whitefield'..."
                  className="w-full pl-3 pr-9 py-2.5 bg-white rounded-xl border border-indigo-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-indigo-500 shadow-2xs"
                />
                <button
                  type="button"
                  title="Voice search"
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-indigo-600 cursor-pointer"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-500">
                <span className="font-semibold text-slate-400">Popular:</span>
                <button
                  type="button"
                  onClick={() => setAiFilterQuery('hostel')}
                  className="hover:text-indigo-600 cursor-pointer underline"
                >
                  Hostels
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setAiFilterQuery('breakfast')}
                  className="hover:text-indigo-600 cursor-pointer underline"
                >
                  Free Breakfast
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setAiFilterQuery('Koramangala')}
                  className="hover:text-indigo-600 cursor-pointer underline"
                >
                  Koramangala
                </button>
              </div>
            </div>

            {/* Traditional Filters Box (Screenshot 4) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#d84e55]" />
                  <span>Filters</span>
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-slate-400 hover:text-[#d84e55] cursor-pointer"
                >
                  Reset
                </button>
              </div>

              {/* Price Per Night Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">Max Price Per Night</span>
                  <span className="font-mono font-black text-[#d84e55]">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={5000}
                  step={100}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#d84e55] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>₹200</span>
                  <span>₹2500</span>
                  <span>₹5000+</span>
                </div>
              </div>

              {/* Customer Rating Filter */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-900 block">Customer Rating</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'All', val: 0 },
                    { label: '3.5+ ★', val: 3.5 },
                    { label: '4.0+ ★', val: 4.0 },
                  ].map((r) => (
                    <button
                      key={r.label}
                      type="button"
                      onClick={() => setMinRating(r.val)}
                      className={`py-1.5 text-xs font-bold rounded-lg border text-center transition-colors cursor-pointer ${
                        minRating === r.val
                          ? 'border-[#d84e55] bg-red-50 text-[#d84e55]'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Deals & Amenities Checkboxes */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-900 block">Deals & Perks</span>
                
                <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyFlashDeals}
                    onChange={(e) => setOnlyFlashDeals(e.target.checked)}
                    className="rounded text-[#d84e55] focus:ring-[#d84e55]"
                  />
                  <span>⚡ Flash Deals Only</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyFreeBreakfast}
                    onChange={(e) => setOnlyFreeBreakfast(e.target.checked)}
                    className="rounded text-[#d84e55] focus:ring-[#d84e55]"
                  />
                  <span>☕ Free Breakfast Included</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyCoupleFriendly}
                    onChange={(e) => setOnlyCoupleFriendly(e.target.checked)}
                    className="rounded text-[#d84e55] focus:ring-[#d84e55]"
                  />
                  <span>💑 Couple Friendly Stays</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyFreeCancellation}
                    onChange={(e) => setOnlyFreeCancellation(e.target.checked)}
                    className="rounded text-[#d84e55] focus:ring-[#d84e55]"
                  />
                  <span>🛡️ Free Cancellation</span>
                </label>
              </div>

            </div>
          </div>

          {/* Right Column: Hotel Listings (Screenshot 4) */}
          <div className="lg:col-span-8 space-y-6">
            
            {filteredHotels.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-black text-slate-800">No properties found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your budget range, rating filters, or search query to see more verified stays.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2 bg-[#d84e55] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              filteredHotels.map((hotel) => {
                const images = hotel.images && hotel.images.length > 0 ? hotel.images : [
                  'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=80',
                  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
                ];
                const activeImgIdx = cardImageIndices[hotel.id] || 0;

                return (
                  <div
                    key={hotel.id}
                    className="bg-white rounded-2xl overflow-hidden border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col md:flex-row group"
                  >
                    {/* Left: Image Carousel */}
                    <div className="md:w-72 h-56 md:h-auto relative overflow-hidden bg-slate-900 shrink-0">
                      <img
                        src={images[activeImgIdx]}
                        alt={hotel.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                      />

                      {/* Carousel Arrows */}
                      {images.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => handlePrevImage(hotel.id, images.length, e)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleNextImage(hotel.id, images.length, e)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black transition-colors"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      {/* Carousel Dots */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1">
                        {images.map((_, i) => (
                          <span
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full ${
                              activeImgIdx === i ? 'bg-white w-3' : 'bg-white/50'
                            } transition-all`}
                          />
                        ))}
                      </div>

                      {/* Flash Deal Bottom Ribbon (Screenshot 4: "Flash deal · Ends in 5h:57m:12s") */}
                      {hotel.isFlashDeal && (
                        <div className="absolute bottom-0 left-0 right-0 bg-[#d84e55] text-white text-[10px] font-black uppercase tracking-wider py-1 text-center shadow-xs">
                          Flash deal · Ends in 05h:57m:12s
                        </div>
                      )}
                    </div>

                    {/* Right: Hotel Info & Pricing (Screenshot 4) */}
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div className="space-y-2">
                        
                        {/* Rating & Wishlist Row */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="bg-emerald-600 text-white text-xs font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                              <span>★ {hotel.rating}</span>
                              <span className="text-[10px] font-normal">({hotel.totalRatings})</span>
                            </div>
                            <span className="text-xs font-bold text-emerald-800">Very Good</span>
                          </div>

                          {/* Wishlist Heart */}
                          {onToggleWishlist && (
                            <button
                              type="button"
                              onClick={() => onToggleWishlist(hotel.id)}
                              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            >
                              <Heart
                                className={`w-5 h-5 ${
                                  wishlistIds.includes(hotel.id) ? 'fill-rose-600 text-rose-600' : ''
                                }`}
                              />
                            </button>
                          )}
                        </div>

                        {/* Title & Category */}
                        <div>
                          <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                            {hotel.area}
                          </span>
                          <h3 className="text-base font-black text-slate-900 group-hover:text-[#d84e55] transition-colors leading-snug">
                            {hotel.name}
                          </h3>
                        </div>

                        {/* Distance / Landmark (Screenshot 4: "1.5 km drive to Phoenix Marketcity") */}
                        <p className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#d84e55] shrink-0" />
                          <span>{hotel.distanceLandmark || `${hotel.area}, ${hotel.city}`}</span>
                        </p>

                        {/* Tags (Screenshot 4: "Breakfast Available", "Couple Friendly") */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {hotel.freeBreakfast && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                              Breakfast Available
                            </span>
                          )}
                          {hotel.coupleFriendly && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200">
                              Couple Friendly
                            </span>
                          )}
                          {hotel.freeCancellation && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                              Free Cancellation
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bottom Pricing & Select Room Button */}
                      <div className="pt-4 mt-3 border-t border-slate-100 flex items-end justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                              {hotel.flashDiscountPercent || 31}% off
                            </span>
                            <span className="text-xs text-slate-400 line-through">
                              ₹{hotel.originalPrice}
                            </span>
                          </div>
                          <div className="font-mono text-2xl font-black text-slate-900 leading-tight">
                            ₹{hotel.pricePerNight}
                          </div>
                          <span className="text-[10px] text-slate-400 block font-medium">
                            + ₹{hotel.taxAndFees || 44} tax & fees · Per night
                          </span>
                        </div>

                        {/* Red "Select room" Pill Button (Screenshot 4) */}
                        <button
                          type="button"
                          onClick={() => setActiveModalHotel(hotel)}
                          className="px-6 py-2.5 bg-[#d84e55] hover:bg-[#c23f46] text-white text-xs font-black rounded-full shadow-md transition-all cursor-pointer uppercase tracking-wider flex items-center gap-1.5"
                        >
                          <span>Select room</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })
            )}

          </div>

        </div>

      </section>

      {/* 8. ROOM SELECTION MODAL (Screenshot 5) */}
      {activeModalHotel && (
        <HotelDetailModal
          hotel={activeModalHotel}
          checkInDate={formatDateDisplay(checkInDate)}
          checkOutDate={formatDateDisplay(checkOutDate)}
          guestsText={guestsSummary}
          isWishlisted={wishlistIds.includes(activeModalHotel.id)}
          onToggleWishlist={() => onToggleWishlist && onToggleWishlist(activeModalHotel.id)}
          onClose={() => setActiveModalHotel(null)}
          onSelectCombo={(h, combo) => {
            setActiveModalHotel(null);
            onBookHotel(h, combo);
          }}
        />
      )}

    </div>
  );
};
