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
  Fuel,
  ChevronRight,
  Star,
  CheckCircle2,
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
      fromSub: 'Tafourah / Centre',
      to: 'Oran',
      toCode: '31',
      toSub: "Place du 1er Novembre",
      dist: '415 km',
      time: '4h 30m',
      price: '1 840 DA',
      basePrice: '1 600 DA',
      comfort: true,
      restStop: true,
      driver: 'Amine Benali',
      rating: 4.9,
      reviews: 32,
      car: 'Renault Symbol (2021)',
      departureTime: '07:30',
      availableSeats: 3,
    },
    {
      from: 'Alger',
      fromCode: '16',
      fromSub: 'Station Caroubier',
      to: 'Constantine',
      toCode: '25',
      toSub: 'Sidi Mabrouk',
      dist: '390 km',
      time: '4h 15m',
      price: '1 725 DA',
      basePrice: '1 500 DA',
      comfort: true,
      restStop: true,
      driver: 'Karim Fekir',
      rating: 4.85,
      reviews: 19,
      car: 'Peugeot 3008 (2022)',
      departureTime: '08:00',
      availableSeats: 2,
    },
    {
      from: 'Alger',
      fromCode: '16',
      fromSub: 'Kouba',
      to: 'Sétif',
      toCode: '19',
      toSub: 'Aïn Fouara',
      dist: '260 km',
      time: '2h 50m',
      price: '1 150 DA',
      basePrice: '1 000 DA',
      comfort: true,
      restStop: false,
      driver: 'Youcef Belkacem',
      rating: 4.8,
      reviews: 15,
      car: 'Renault Megane 4 (2020)',
      departureTime: '09:15',
      availableSeats: 3,
    },
    {
      from: 'Oran',
      fromCode: '31',
      fromSub: 'El Bahia',
      to: 'Tlemcen',
      toCode: '13',
      toSub: 'El Mechouar',
      dist: '140 km',
      time: '1h 45m',
      price: '690 DA',
      basePrice: '600 DA',
      comfort: false,
      restStop: false,
      driver: 'Bilal Boutaleb',
      rating: 4.95,
      reviews: 24,
      car: 'Dacia Sandero (2023)',
      departureTime: '14:00',
      availableSeats: 2,
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 text-left">
      {/* 1. TRAVEL-LED HERO — TRIP SEARCH IS THE CLEAR FOCAL POINT */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#173C2C] bg-[#E1EDE6] border border-[#C2DBCF]">
          <span className="w-2 h-2 rounded-full bg-[#173C2C]" />
          <span className="tracking-wide">Réseau National de Mobilité • 58 Wilayas d'Algérie</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-[#141613] leading-[1.12] max-w-4xl mx-auto">
          Le covoiturage inter-wilayas, <br />
          <span className="text-[#173C2C] italic">transparent et serein.</span>
        </h1>

        <p className="text-base sm:text-lg text-[#5C6057] max-w-2xl mx-auto leading-relaxed">
          Partagez vos trajets entre villes algériennes avec des conducteurs vérifiés. Tarifs réglementés en Dinars (DZD), commission fixe de 15% et pause sécurité Naftal garantie.
        </p>

        {/* 2. THE SEARCH CONSOLE (CENTRAL & PROMINENT) */}
        <div className="mt-10 relative z-30 text-left">
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-elevated border border-[#E6E0D6]">
            <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 lg:gap-0">
              {/* Departure */}
              <div ref={originRef} className="relative flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#FAF8F5] transition-colors">
                <MapPin className="w-5 h-5 text-[#173C2C] flex-shrink-0" />
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
                    placeholder="Alger, Oran..."
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

              {/* Destination */}
              <div ref={destRef} className="relative flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#FAF8F5] transition-colors">
                <MapPin className="w-5 h-5 text-rose-600 flex-shrink-0" />
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
                    placeholder="Oran, Sétif..."
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

              {/* Date */}
              <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#FAF8F5] transition-colors">
                <Calendar className="w-5 h-5 text-[#173C2C] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-bold text-[#8E9389] uppercase tracking-wider">
                      Date
                    </label>
                    <div className="flex gap-1.5">
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

              {/* Passengers */}
              <div className="flex-initial sm:w-40 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#FAF8F5] transition-colors">
                <Users className="w-5 h-5 text-[#173C2C] flex-shrink-0" />
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

              {/* Search Button */}
              <div className="p-1">
                <button
                  type="submit"
                  className="w-full lg:w-auto px-8 py-4 rounded-xl bg-[#173C2C] hover:bg-[#112E22] text-white font-bold text-sm shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Rechercher</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Route Shortcuts */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
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
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#F3EFE8] border border-[#E6E0D6] text-[#32362F] font-semibold shadow-subtle transition-colors"
              >
                {route.from} ➔ {route.to}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. REGULATORY & TRUST METRICS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl bg-white border border-[#E6E0D6] shadow-subtle space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#E1EDE6] text-[#173C2C] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#141613]">15% Commission Fixe</h3>
            <p className="text-xs text-[#5C6057] leading-relaxed">
              Frais de service plafonnés à 15%. Aucun supplément imprévu lors du paiement en Dinars (DZD).
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#E6E0D6] shadow-subtle space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#92400E] flex items-center justify-center">
              <Coffee className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#141613]">Pause Naftal &gt;300 km</h3>
            <p className="text-xs text-[#5C6057] leading-relaxed">
              Halte de sécurité de 15 minutes en station autoroutière Naftal obligatoire sur les longues distances.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#E6E0D6] shadow-subtle space-y-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#141613]">Option Trajet Confort</h3>
            <p className="text-xs text-[#5C6057] leading-relaxed">
              Supplément de 30% pour voyager avec 2 passagers maximum à l'arrière du véhicule.
            </p>
          </div>

          <div className="p-5 rounded-xl bg-white border border-[#E6E0D6] shadow-subtle space-y-2">
            <div className="w-8 h-8 rounded-lg bg-[#E1EDE6] text-[#173C2C] flex items-center justify-center">
              <Fuel className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-[#141613]">Barème Naftal Intégré</h3>
            <p className="text-xs text-[#5C6057] leading-relaxed">
              Estimation automatique basée sur 8 L / 100 km et les prix officiels du carburant en Algérie.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED CORRIDORS — EDITORIAL TRANSPORT TICKETS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 border-b border-[#E6E0D6] pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#141613] tracking-tight">
              Liaisons régulières & départs fréquents
            </h2>
            <p className="text-xs sm:text-sm text-[#5C6057] mt-1">
              Consultez les trajets populaires inter-wilayas avec décomposition transparente du prix.
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
              className="group bg-white rounded-2xl border border-[#E6E0D6] p-6 shadow-card hover:shadow-elevated hover:border-[#173C2C] transition-all cursor-pointer flex flex-col justify-between space-y-5"
            >
              {/* Route Itinerary Line */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl font-serif font-bold text-[#141613]">
                      {route.from}
                    </span>
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-[#FAF8F5] border border-[#E6E0D6] text-[#5C6057]">
                      W.{route.fromCode}
                    </span>
                    <ArrowRight className="w-4 h-4 text-[#8E9389]" />
                    <span className="text-xl font-serif font-bold text-[#141613]">
                      {route.to}
                    </span>
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-[#FAF8F5] border border-[#E6E0D6] text-[#5C6057]">
                      W.{route.toCode}
                    </span>
                  </div>
                  <div className="text-xs text-[#5C6057] flex items-center gap-2">
                    <span>{route.dist}</span>
                    <span>•</span>
                    <span>~{route.time}</span>
                    <span>•</span>
                    <span>Départ quotidien <strong>{route.departureTime}</strong></span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-bold text-[#173C2C] tabular-nums block font-serif">
                    {route.price}
                  </span>
                  <span className="text-[10px] text-[#8E9389] block">
                    TTC tout inclus / place
                  </span>
                  <span className="text-[11px] text-[#5C6057] block mt-0.5">
                    Base conducteur : {route.basePrice}
                  </span>
                </div>
              </div>

              {/* Feature Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F3EFE8]">
                {route.restStop && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                    <Coffee className="w-3.5 h-3.5" />
                    <span>Halte Naftal 15 min incluse</span>
                  </span>
                )}
                {route.comfort && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Option Confort disponible (+30%)</span>
                  </span>
                )}
              </div>

              {/* Driver & Booking Footer */}
              <div className="pt-3 border-t border-[#F3EFE8] flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#173C2C] text-white flex items-center justify-center font-bold text-xs">
                    {route.driver.charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-[#141613] block leading-tight">
                      {route.driver}
                    </span>
                    <span className="text-[11px] text-[#8E9389]">
                      {route.car}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 font-bold text-xs text-[#141613]">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{route.rating}</span>
                    <span className="text-[#8E9389] font-normal">({route.reviews})</span>
                  </div>

                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#173C2C] text-white font-bold text-xs group-hover:bg-[#112E22] transition-colors shadow-subtle">
                    <span>Réserver</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
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
              Un service de transport partagé pensé pour la réalité des 58 wilayas d'Algérie.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border border-[#E6E0D6] bg-[#FAF8F5] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#173C2C] text-white flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h3 className="text-base font-bold text-[#141613]">1. Trouvez votre trajet</h3>
              <p className="text-xs text-[#5C6057] leading-relaxed">
                Renseignez votre ville de départ et votre destination. Comparez les horaires, les modèles de véhicules et les profils de conducteurs certifiés.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[#E6E0D6] bg-[#FAF8F5] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#173C2C] text-white flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h3 className="text-base font-bold text-[#141613]">2. Tarif transparent en Dinars</h3>
              <p className="text-xs text-[#5C6057] leading-relaxed">
                Le montant est décomposé à l'écran : prix net conducteur, 15% de commission de service, et supplément optionnel de 30% pour l'option Confort.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[#E6E0D6] bg-[#FAF8F5] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#173C2C] text-white flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h3 className="text-base font-bold text-[#141613]">3. Halte Naftal & Coordination</h3>
              <p className="text-xs text-[#5C6057] leading-relaxed">
                Pause sécurité obligatoire de 15 minutes en station Naftal au-delà de 300 km et messagerie privée intégrée pour coordonner le rendez-vous.
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
              Publiez votre trajet en 2 minutes. Notre simulateur intègre automatiquement le barème officiel Naftal (8 L / 100 km) pour suggérer un prix par place transparent et équitable.
            </p>
            <div className="pt-2">
              <Link
                to="/trips/create"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#0A1C14] hover:bg-[#FAF8F5] font-bold text-xs transition-all shadow-sm"
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
