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
  ArrowRightLeft,
  Clock,
  Fuel,
  CheckCircle2,
  ChevronRight,
  Star,
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

  const handleSwap = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
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
      driver: 'Amine B.',
      rating: 4.9,
      reviews: 32,
      car: 'VW Golf 8',
      departureTime: '07:30',
      availableSeats: 3,
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
      driver: 'Karim F.',
      rating: 4.85,
      reviews: 19,
      car: 'Peugeot 3008',
      departureTime: '08:00',
      availableSeats: 2,
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
      driver: 'Youcef B.',
      rating: 4.8,
      reviews: 15,
      car: 'Renault Megane',
      departureTime: '09:15',
      availableSeats: 3,
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
      driver: 'Bilal B.',
      rating: 4.95,
      reviews: 24,
      car: 'Seat Ibiza',
      departureTime: '14:00',
      availableSeats: 2,
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-24 text-left">
      {/* 1. HERO SECTION: Clean, Modern Tech Mobility */}
      <section className="relative overflow-hidden pt-8 sm:pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-brand-50/60 via-slate-50 to-transparent -z-10 pointer-events-none rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold text-brand-700 bg-brand-50 border border-brand-200 shadow-soft-xs">
            <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
            <span>Plateforme Nationale de Covoiturage • 58 Wilayas</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.12]">
            Vos trajets partout en Algérie, <br />
            <span className="text-brand-600">au meilleur prix.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Rejoignez la première communauté de covoiturage inter-wilayas. Tarification transparente en Dinars (DZD), conducteurs vérifiés et halte de sécurité obligatoire de 15 minutes au-delà de 300 km.
          </p>
        </div>

        {/* 2. THE FLOATING SEARCH BAR (BlaBlaCar-style) */}
        <div className="mt-8 sm:mt-12 max-w-5xl mx-auto relative z-30">
          <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-search border border-slate-200/90">
            <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2 lg:gap-0">
              {/* Segment 1: Origin */}
              <div ref={originRef} className="relative flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50 transition-colors">
                <div className="w-4 h-4 rounded-full border-2 border-brand-600 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
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
                    placeholder="Ville de départ (ex. Alger)"
                    className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none placeholder:text-slate-400"
                  />
                </div>

                {/* Autocomplete Dropdown */}
                {showOriginDropdown && filteredOriginWilayas.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 max-h-60 overflow-y-auto">
                    <div className="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
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
                        className="w-full text-left px-4 py-2 hover:bg-brand-50 flex items-center justify-between text-xs transition-colors"
                      >
                        <span className="font-bold text-slate-800">
                          {w.code_str} - {w.name}
                        </span>
                        <span className="text-slate-400 font-arabic">{w.name_ar}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Swap Button */}
              <div className="flex justify-center -my-2 lg:my-0 lg:-mx-2 z-10">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all border border-slate-200 shadow-soft-xs active:scale-95"
                  title="Intervertir départ et destination"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Segment 2: Destination */}
              <div ref={destRef} className="relative flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50 transition-colors">
                <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
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
                    placeholder="Ville d'arrivée (ex. Oran)"
                    className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none placeholder:text-slate-400"
                  />
                </div>

                {/* Autocomplete Dropdown */}
                {showDestDropdown && filteredDestWilayas.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 max-h-60 overflow-y-auto">
                    <div className="px-4 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
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
                        className="w-full text-left px-4 py-2 hover:bg-brand-50 flex items-center justify-between text-xs transition-colors"
                      >
                        <span className="font-bold text-slate-800">
                          {w.code_str} - {w.name}
                        </span>
                        <span className="text-slate-400 font-arabic">{w.name_ar}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Divider on desktop */}
              <div className="hidden lg:block w-px h-10 bg-slate-200 my-auto" />

              {/* Segment 3: Date */}
              <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50 transition-colors">
                <Calendar className="w-4 h-4 text-brand-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Date de départ
                    </label>
                    <div className="flex gap-1.5 text-[10px] text-brand-700 font-bold">
                      <button type="button" onClick={setDateToday} className="hover:underline">
                        Aujourd'hui
                      </button>
                      <span>•</span>
                      <button type="button" onClick={setDateTomorrow} className="hover:underline">
                        Demain
                      </button>
                    </div>
                  </div>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Divider on desktop */}
              <div className="hidden lg:block w-px h-10 bg-slate-200 my-auto" />

              {/* Segment 4: Seats Selector */}
              <div className="w-full lg:w-32 flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50 transition-colors">
                <Users className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Passagers
                  </label>
                  <select
                    value={seats}
                    onChange={(e) => setSeats(Number(e.target.value))}
                    className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value={1}>1 place</option>
                    <option value={2}>2 places</option>
                    <option value={3}>3 places</option>
                    <option value={4}>4 places</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="p-1">
                <button
                  type="submit"
                  className="w-full lg:w-auto px-8 py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-soft-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Rechercher</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Route Shortcuts */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">Axes fréquents :</span>
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
                className="px-3 py-1 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold shadow-soft-xs transition-colors"
              >
                {route.from} ➔ {route.to}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CORE METRICS & REGULATORY TRUST BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft-xs space-y-1">
            <div className="text-2xl font-black text-brand-600">58 Wilayas</div>
            <p className="text-xs font-semibold text-slate-800">Couverture nationale</p>
            <p className="text-[11px] text-slate-500">Axes autoroutiers A1 Est/Ouest & Sud</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft-xs space-y-1">
            <div className="text-2xl font-black text-slate-900">15% Commission</div>
            <p className="text-xs font-semibold text-slate-800">Transparence garantie</p>
            <p className="text-[11px] text-slate-500">Prix passager = Base + 15% (0 frais cachés)</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft-xs space-y-1">
            <div className="text-2xl font-black text-amber-600">15 min Pause</div>
            <p className="text-xs font-semibold text-slate-800">Sécurité &gt; 300 km</p>
            <p className="text-[11px] text-slate-500">Halte obligatoire en station Naftal</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft-xs space-y-1">
            <div className="text-2xl font-black text-purple-600">+30% Confort</div>
            <p className="text-xs font-semibold text-slate-800">Option place avant</p>
            <p className="text-[11px] text-slate-500">Trajet Confort avec espace garanti</p>
          </div>
        </div>
      </section>

      {/* 4. FEATURED RIDES: Modern Ticket Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-2 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Trajets populaires à réserver
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Départs fréquents sur les autoroutes algériennes avec conducteurs certifiés.
            </p>
          </div>
          <Link
            to="/search"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>Voir tous les trajets</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredRoutes.map((route, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft-sm hover:shadow-soft-md transition-all space-y-5"
            >
              {/* Card Header: Route & Time */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-slate-900">{route.departureTime}</span>
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                      <span>{route.from}</span>
                      <ArrowRight className="w-4 h-4 text-brand-600" />
                      <span>{route.to}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    {route.dist} • Durée estimée : {route.time}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xl font-black text-brand-600 tabular-nums">
                    {route.price}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium block">par place</span>
                </div>
              </div>

              {/* Badges Bar: Rest Stop & Comfort */}
              <div className="flex flex-wrap items-center gap-2">
                {route.restStop && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    <Coffee className="w-3.5 h-3.5 text-amber-600" />
                    <span>Pause Naftal 15 min</span>
                  </span>
                )}
                {route.comfort && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>Trajet Confort (+30%)</span>
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
                  <span>{route.availableSeats} places libres</span>
                </span>
              </div>

              {/* Card Footer: Driver & Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-brand-100 text-brand-800 font-bold flex items-center justify-center text-xs">
                    {route.driver.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">{route.driver}</span>
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-slate-700">{route.rating}</span>
                      <span>({route.reviews} avis) • {route.car}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/search?origin=${encodeURIComponent(route.from)}&destination=${encodeURIComponent(route.to)}`}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-soft-xs"
                >
                  Réserver
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS: Clear 3-Step Tech Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-soft-sm space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Comment fonctionne DZ-CarPool ?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Un fonctionnement simple pensé pour les réalités du transport inter-wilayas en Algérie.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-black text-lg border border-brand-200">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">Recherchez votre trajet</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Renseignez votre ville de départ et votre destination. Consultez les heures précises, les véhicules et les profils vérifiés des conducteurs.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-black text-lg border border-amber-200">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">Approbation du conducteur</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Envoyez votre demande de réservation. Le conducteur approuve manuellement votre demande pour assurer un voyage en toute confiance mutuelle.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-black text-lg border border-blue-200">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">Coordonnez & Voyagez</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Échangez les détails de prise en charge via la messagerie interne du trajet. Profitez de la pause de 15 minutes sur les longs parcours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. DRIVER BANNER: Rentabilisez vos trajets */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 max-w-xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-brand-400 bg-brand-950/80 border border-brand-800">
              <Fuel className="w-3.5 h-3.5" />
              <span>Calculateur de carburant Naftal intégré</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Vous prenez la route ? Publiez vos places libres.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Ne voyagez plus seul. L'application estime automatiquement votre coût en carburant à 8L/100km et suggère un prix équitable par passager. Vous recevez 100% de votre contribution de base.
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              to="/trips/create"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-brand-500 hover:bg-brand-400 text-slate-950 font-black text-sm shadow-lg transition-all active:scale-95"
            >
              <Car className="w-4 h-4" />
              <span>Publier un trajet en 2 min</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};