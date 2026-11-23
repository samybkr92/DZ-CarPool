import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { WILAYAS } from '../utils/algeriaData';
import {
  MapPin,
  Calendar,
  Users,
  Search,
  ShieldCheck,
  Coffee,
  Sparkles,
  ArrowRight,
  Car,
  Clock,
  Fuel,
  ChevronRight,
  Star,
  CheckCircle,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [seats, setSeats] = useState(1);

  // Autocomplete dropdown states
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  const originRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (originRef.current && !originRef.current.contains(e.target as Node)) {
        setShowOriginDropdown(false);
      }
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setShowDestDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOriginWilayas = WILAYAS.filter(
    (w) =>
      w.name.toLowerCase().includes(origin.toLowerCase()) ||
      w.code_str.includes(origin) ||
      w.name_ar.includes(origin)
  ).slice(0, 8);

  const filteredDestWilayas = WILAYAS.filter(
    (w) =>
      w.name.toLowerCase().includes(destination.toLowerCase()) ||
      w.code_str.includes(destination) ||
      w.name_ar.includes(destination)
  ).slice(0, 8);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (origin) query.append('origin', origin);
    if (destination) query.append('destination', destination);
    if (date) query.append('date', date);
    if (seats > 1) query.append('seats', seats.toString());
    navigate(`/search?${query.toString()}`);
  };

  const setDateToday = () => {
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  };

  const setDateTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    setDate(d.toISOString().split('T')[0]);
  };

  const featuredRoutes = [
    {
      from: 'Alger',
      fromCode: '16',
      to: 'Oran',
      toCode: '31',
      dist: '415 km',
      time: '4h 30m',
      price: '1 840 DA',
      basePrice: '1 600 DA',
      comfort: true,
      restStop: true,
      driver: 'Amine Benali',
      rating: 4.9,
      reviews: 32,
      car: 'Volkswagen Golf 8',
      departureTime: '07:30',
      availableSeats: 3,
      tag: 'Liaison Côtière',
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    },
    {
      from: 'Alger',
      fromCode: '16',
      to: 'Constantine',
      toCode: '25',
      dist: '390 km',
      time: '4h 15m',
      price: '1 725 DA',
      basePrice: '1 500 DA',
      comfort: true,
      restStop: true,
      driver: 'Karim Fekir',
      rating: 4.85,
      reviews: 19,
      car: 'Peugeot 3008',
      departureTime: '08:00',
      availableSeats: 2,
      tag: 'Ponts Suspendus',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    },
    {
      from: 'Alger',
      fromCode: '16',
      to: 'Sétif',
      toCode: '19',
      dist: '260 km',
      time: '2h 50m',
      price: '1 150 DA',
      basePrice: '1 000 DA',
      comfort: true,
      restStop: false,
      driver: 'Youcef Belkacem',
      rating: 4.8,
      reviews: 15,
      car: 'Renault Megane 4',
      departureTime: '09:15',
      availableSeats: 3,
      tag: 'Hauts Plateaux',
      imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    },
    {
      from: 'Oran',
      fromCode: '31',
      to: 'Tlemcen',
      toCode: '13',
      dist: '140 km',
      time: '1h 45m',
      price: '690 DA',
      basePrice: '600 DA',
      comfort: false,
      restStop: false,
      driver: 'Bilal Boutaleb',
      rating: 4.95,
      reviews: 24,
      car: 'Seat Ibiza',
      departureTime: '14:00',
      availableSeats: 2,
      tag: 'Cité des Zianides',
      imageUrl: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 text-left">
      {/* 1. TRAVEL-LED EDITORIAL HERO WITH INTEGRATED PHOTOGRAPHY */}
      <section className="relative pt-8 sm:pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Text & Value Props */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold text-[#173C2C] bg-[#E1EDE6] border border-[#C2DBCF]">
              <span className="w-2 h-2 rounded-full bg-[#173C2C] animate-pulse" />
              <span className="tracking-wide">Réseau National de Mobilité • 58 Wilayas d'Algérie</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-[#141613] leading-[1.12]">
              Voyager à travers l'Algérie, <br />
              <span className="text-[#173C2C] italic">en toute sérénité.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#5C6057] max-w-xl leading-relaxed">
              Le premier réseau de covoiturage inter-wilayas fondé sur la transparence : tarifs réglementés en Dinars (DZD), conducteurs certifiés, et halte sécurité Naftal de 15 minutes garantie sur les longues distances.
            </p>

            {/* Regulatory & Trust Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-white border border-[#E6E0D6] shadow-subtle">
                <ShieldCheck className="w-4 h-4 text-[#173C2C] flex-shrink-0" />
                <span className="text-xs font-bold text-[#141613]">15% commission plafonnée</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-white border border-[#E6E0D6] shadow-subtle">
                <Coffee className="w-4 h-4 text-[#D97706] flex-shrink-0" />
                <span className="text-xs font-bold text-[#141613]">Pause Naftal &gt;300 km</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-white border border-[#E6E0D6] shadow-subtle">
                <Sparkles className="w-4 h-4 text-purple-700 flex-shrink-0" />
                <span className="text-xs font-bold text-[#141613]">Option Confort (+30%)</span>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#E6E0D6] shadow-elevated group aspect-[4/3] sm:aspect-[16/11]">
              <img
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=85"
                alt="Route nationale et covoiturage en Algérie"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1C14]/90 via-[#0A1C14]/30 to-transparent" />

              {/* Passport Stamp Overlay */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md border border-white/50 text-[10px] font-bold text-[#173C2C] uppercase tracking-wider shadow-sm">
                Autoroute Est-Ouest A1
              </div>

              {/* Route Highlight Badge */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md border border-[#E6E0D6] shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#D97706] block">
                      Liaison Quotidienne
                    </span>
                    <span className="text-base font-bold text-[#141613]">
                      Alger ➔ Oran
                    </span>
                    <span className="text-xs text-[#5C6057] block">
                      415 km • Halte Naftal Chlef incluse
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-[#173C2C] block">
                      1 840 DA
                    </span>
                    <span className="text-[10px] text-[#8E9389]">
                      TTC tout inclus
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. SOLID, INTEGRATED SEARCH CONSOLE */}
        <div className="mt-10 max-w-5xl relative z-30">
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow-elevated border border-[#E6E0D6]">
            <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2 lg:gap-0">
              {/* Segment 1: Origin */}
              <div ref={originRef} className="relative flex-1 flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#FAF8F5] transition-colors">
                <MapPin className="w-4 h-4 text-[#173C2C] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] font-bold text-[#8E9389] uppercase tracking-wider">
                    Départ
                  </label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => {
                      setOrigin(e.target.value);
                      setShowOriginDropdown(true);
                    }}
                    onFocus={() => setShowOriginDropdown(true)}
                    placeholder="Ex. Alger, Blida..."
                    className="w-full bg-transparent text-sm font-bold text-[#141613] focus:outline-none placeholder:text-[#8E9389]"
                  />
                </div>

                {/* Autocomplete Dropdown */}
                {showOriginDropdown && filteredOriginWilayas.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-search border border-[#E6E0D6] py-2 z-50 max-h-60 overflow-y-auto">
                    <div className="px-4 py-1 text-[10px] font-bold text-[#8E9389] uppercase tracking-wider">
                      Wilayas correspondantes
                    </div>
                    {filteredOriginWilayas.map((w) => (
                      <button
                        key={w.code}
                        type="button"
                        onClick={() => {
                          setOrigin(w.name);
                          setShowOriginDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-[#F3EFE8] flex items-center justify-between text-xs transition-colors"
                      >
                        <span className="font-bold text-[#141613]">
                          {w.code_str} - {w.name}
                        </span>
                        <span className="text-[#8E9389] font-arabic">{w.name_ar}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Hairline Divider */}
              <div className="hidden lg:block w-px h-10 bg-[#E6E0D6] my-auto" />

              {/* Segment 2: Destination */}
              <div ref={destRef} className="relative flex-1 flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#FAF8F5] transition-colors">
                <MapPin className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] font-bold text-[#8E9389] uppercase tracking-wider">
                    Destination
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => {
                      setDestination(e.target.value);
                      setShowDestDropdown(true);
                    }}
                    onFocus={() => setShowDestDropdown(true)}
                    placeholder="Ex. Oran, Constantine..."
                    className="w-full bg-transparent text-sm font-bold text-[#141613] focus:outline-none placeholder:text-[#8E9389]"
                  />
                </div>

                {/* Autocomplete Dropdown */}
                {showDestDropdown && filteredDestWilayas.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-search border border-[#E6E0D6] py-2 z-50 max-h-60 overflow-y-auto">
                    <div className="px-4 py-1 text-[10px] font-bold text-[#8E9389] uppercase tracking-wider">
                      Wilayas correspondantes
                    </div>
                    {filteredDestWilayas.map((w) => (
                      <button
                        key={w.code}
                        type="button"
                        onClick={() => {
                          setDestination(w.name);
                          setShowDestDropdown(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-[#F3EFE8] flex items-center justify-between text-xs transition-colors"
                      >
                        <span className="font-bold text-[#141613]">
                          {w.code_str} - {w.name}
                        </span>
                        <span className="text-[#8E9389] font-arabic">{w.name_ar}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Hairline Divider */}
              <div className="hidden lg:block w-px h-10 bg-[#E6E0D6] my-auto" />

              {/* Segment 3: Date */}
              <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#FAF8F5] transition-colors">
                <Calendar className="w-4 h-4 text-[#173C2C] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-bold text-[#8E9389] uppercase tracking-wider">
                      Date
                    </label>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={setDateToday}
                        className="text-[10px] text-[#173C2C] hover:underline font-bold"
                      >
                        Aujourd'hui
                      </button>
                      <span className="text-[10px] text-[#8E9389]">•</span>
                      <button
                        type="button"
                        onClick={setDateTomorrow}
                        className="text-[10px] text-[#173C2C] hover:underline font-bold"
                      >
                        Demain
                      </button>
                    </div>
                  </div>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent text-sm font-bold text-[#141613] focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Hairline Divider */}
              <div className="hidden lg:block w-px h-10 bg-[#E6E0D6] my-auto" />

              {/* Segment 4: Passengers */}
              <div className="flex-initial sm:w-44 flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#FAF8F5] transition-colors">
                <Users className="w-4 h-4 text-[#173C2C] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] font-bold text-[#8E9389] uppercase tracking-wider">
                    Passagers
                  </label>
                  <select
                    value={seats}
                    onChange={(e) => setSeats(Number(e.target.value))}
                    className="w-full bg-transparent text-sm font-bold text-[#141613] focus:outline-none cursor-pointer"
                  >
                    <option value={1}>1 passager</option>
                    <option value={2}>2 passagers</option>
                    <option value={3}>3 passagers</option>
                    <option value={4}>4 passagers</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA Button */}
              <div className="p-1">
                <button
                  type="submit"
                  className="w-full lg:w-auto px-7 py-3.5 rounded-lg bg-[#173C2C] hover:bg-[#112E22] text-white font-bold text-xs shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Rechercher</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Route Shortcuts */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#8E9389] font-medium">Liaisons fréquentes :</span>
            {[
              { from: 'Alger', to: 'Oran' },
              { from: 'Alger', to: 'Constantine' },
              { from: 'Alger', to: 'Sétif' },
              { from: 'Alger', to: 'Béjaïa' },
              { from: 'Oran', to: 'Tlemcen' },
            ].map((route, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setOrigin(route.from);
                  setDestination(route.to);
                }}
                className="px-3 py-1 rounded-md bg-white hover:bg-[#F3EFE8] border border-[#E6E0D6] text-[#32362F] font-medium shadow-subtle transition-colors"
              >
                {route.from} ➔ {route.to}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED CORRIDORS (TRAVEL MARKETPLACE PHOTOGRAPHY) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 border-b border-[#E6E0D6] pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#141613] tracking-tight">
              Liaisons régulières & itinéraires
            </h2>
            <p className="text-xs sm:text-sm text-[#5C6057] mt-1">
              Départs fréquents sur les autoroutes algériennes avec conducteurs certifiés et pause Naftal incluse.
            </p>
          </div>
          <Link
            to="/search"
            className="text-xs font-bold text-[#173C2C] hover:text-[#112E22] flex items-center gap-1 group"
          >
            <span>Voir tous les trajets</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredRoutes.map((route, i) => (
            <div
              key={i}
              onClick={() => navigate(`/search?origin=${route.from}&destination=${route.to}`)}
              className="group bg-white rounded-xl border border-[#E6E0D6] overflow-hidden shadow-card hover:shadow-elevated hover:border-[#173C2C] transition-all cursor-pointer flex flex-col justify-between"
            >
              {/* Photo Header */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={route.imageUrl}
                  alt={`${route.from} vers ${route.to}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute top-3 left-3 bg-[#173C2C] text-white px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase">
                  {route.tag}
                </div>

                <div className="absolute top-3 right-3 flex gap-1.5">
                  {route.comfort && (
                    <span className="bg-purple-900/80 backdrop-blur-sm text-purple-200 border border-purple-400/30 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Confort
                    </span>
                  )}
                  {route.restStop && (
                    <span className="bg-[#D97706]/90 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                      <Coffee className="w-3 h-3" /> Naftal 15 min
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
                  <div>
                    <div className="flex items-center gap-2 text-lg font-bold">
                      <span>{route.from}</span>
                      <ArrowRight className="w-4 h-4 text-white/70" />
                      <span>{route.to}</span>
                    </div>
                    <span className="text-xs text-white/80">
                      {route.dist} • ~{route.time} • Départ {route.departureTime}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-amber-300 block">
                      {route.price}
                    </span>
                    <span className="text-[10px] text-white/80">
                      TTC / place
                    </span>
                  </div>
                </div>
              </div>

              {/* Driver & Booking Footer */}
              <div className="p-4 flex items-center justify-between text-xs bg-white">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#173C2C] text-white flex items-center justify-center font-bold text-xs">
                    {route.driver.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-[#141613] block leading-tight">{route.driver}</span>
                    <span className="text-[11px] text-[#8E9389]">{route.car}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 font-bold text-xs text-[#141613]">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{route.rating}</span>
                    <span className="text-[#8E9389] font-normal">({route.reviews})</span>
                  </div>
                  <span className="px-2 py-1 rounded bg-[#E1EDE6] text-[#173C2C] font-bold text-[11px]">
                    {route.availableSeats} places
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. HOW IT WORKS (COMMENT ÇA MARCHE) */}
      <section className="bg-white border-y border-[#E6E0D6] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#173C2C]">
              Simplicité & Rigueur
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#141613]">
              Comment fonctionne DZ-CarPool
            </h2>
            <p className="text-xs sm:text-sm text-[#5C6057]">
              Un service conçu sur mesure pour les déplacements inter-wilayas en Algérie.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border border-[#E6E0D6] bg-[#FAF8F5] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#173C2C] text-white flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-[#141613]">Recherchez votre liaison</h3>
              <p className="text-xs text-[#5C6057] leading-relaxed">
                Indiquez vos wilayas de départ et d'arrivée. Comparez les horaires, les véhicules et les profils de conducteurs vérifiés.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#E6E0D6] bg-[#FAF8F5] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#173C2C] text-white flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-[#141613]">Tarification claire en Dinars</h3>
              <p className="text-xs text-[#5C6057] leading-relaxed">
                Aucun coût caché. Le prix inclut exactement 15% de frais de plateforme et l'option Confort optionnelle (+30% pour 2 max à l'arrière).
              </p>
            </div>

            <div className="p-6 rounded-xl border border-[#E6E0D6] bg-[#FAF8F5] space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#173C2C] text-white flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-[#141613]">Sécurité & Halte Naftal</h3>
              <p className="text-xs text-[#5C6057] leading-relaxed">
                Sur tous les trajets dépassant 300 km, une pause sécurité obligatoire de 15 minutes en station autoroutière Naftal est intégrée.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DRIVER CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#0A1C14] text-white p-8 sm:p-12 border border-[#173C2C] shadow-elevated relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-bold text-[#8FBFA9] bg-[#173C2C] border border-[#2D6A4F]">
              <Fuel className="w-3.5 h-3.5" />
              <span>Conducteurs : Amortissez vos frais de carburant</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold tracking-tight">
              Vous prenez la route ? <br />
              <span className="text-[#8FBFA9] italic">Partagez vos places libres.</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Publiez votre trajet en 2 minutes. Notre simulateur intègre automatiquement le barème Naftal officiel (8 L / 100 km) pour suggérer un prix juste par passager.
            </p>
            <div className="pt-2">
              <Link
                to="/trips/create"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-[#0A1C14] hover:bg-[#FAF8F5] font-bold text-xs transition-all shadow-sm"
              >
                <span>Publier un trajet maintenant</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
