import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CheckCircle2,
  ArrowRightLeft,
  Navigation,
  Compass,
  Clock,
  Fuel,
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
      base: '1 600 DA',
      tag: 'A1 Ouest • Côtière',
      comfort: true,
      rest: true,
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    },
    {
      from: 'Alger',
      fromCode: '16',
      to: 'Constantine',
      toCode: '25',
      dist: '390 km',
      time: '4h 20m',
      price: '1 725 DA',
      base: '1 500 DA',
      tag: 'A1 Est • Gorges du Rhumel',
      comfort: true,
      rest: true,
      image: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=800&q=80',
    },
    {
      from: 'Alger',
      fromCode: '16',
      to: 'Sétif',
      toCode: '19',
      dist: '260 km',
      time: '2h 50m',
      price: '1 150 DA',
      base: '1 000 DA',
      tag: 'Hauts Plateaux • A1',
      comfort: true,
      rest: false,
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    },
    {
      from: 'Oran',
      fromCode: '31',
      to: 'Tlemcen',
      toCode: '13',
      dist: '140 km',
      time: '1h 40m',
      price: '690 DA',
      base: '600 DA',
      tag: 'Grand Ouest • RN22',
      comfort: false,
      rest: false,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    },
    {
      from: 'Constantine',
      fromCode: '25',
      to: 'Annaba',
      toCode: '23',
      dist: '160 km',
      time: '1h 50m',
      price: '805 DA',
      base: '700 DA',
      tag: 'Liaison Nord-Est',
      comfort: true,
      rest: false,
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    },
    {
      from: 'Alger',
      fromCode: '16',
      to: 'Ghardaïa',
      toCode: '47',
      dist: '600 km',
      time: '7h 00m',
      price: '2 875 DA',
      base: '2 500 DA',
      tag: 'Porte du Sahara • RN1',
      comfort: true,
      rest: true,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-24">
      {/* 1. HERO SECTION: Refined Algerian Travel Aesthetic */}
      <section className="relative bg-slate-950 text-white overflow-visible pt-14 sm:pt-20 pb-20 sm:pb-28">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80"
            alt="Voyage en Algérie"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-emerald-950/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Réseau National de Covoiturage • 58 Wilayas</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              La route d’Algérie, <br />
              <span className="text-emerald-400">partagée avec sérénité.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Voyagez entre wilayas à prix équitable. Conducteurs vérifiés, halte de repos réglementaire de 15 min (&gt; 300 km) et transparence tarifaire en Dinars Algériens.
            </p>
          </div>

          {/* Focal Point: Modern Search Box with Wilaya Autocomplete */}
          <div className="mt-8 sm:mt-12 max-w-4xl mx-auto relative z-30">
            <div className="bg-white rounded-3xl p-3 sm:p-3.5 shadow-2xl border border-slate-200 text-slate-900">
              <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2 lg:gap-0">
                {/* Segment 1: Departure Origin */}
                <div ref={originRef} className="relative flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50 transition-colors">
                  <MapPin className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                  <div className="flex-1 min-w-0 text-left">
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Départ (Wilaya / Ville)
                    </label>
                    <input
                      type="text"
                      value={origin}
                      onChange={(e) => {
                        setOrigin(e.target.value);
                        setShowOriginDropdown(true);
                      }}
                      onFocus={() => setShowOriginDropdown(true)}
                      placeholder="D'où partez-vous ?"
                      className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none placeholder:text-slate-400"
                    />
                  </div>

                  {/* Origin Dropdown */}
                  {showOriginDropdown && filteredOriginWilayas.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 max-h-60 overflow-y-auto">
                      <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase">Wilayas suggérées</div>
                      {filteredOriginWilayas.map((w) => (
                        <button
                          key={w.code}
                          type="button"
                          onClick={() => {
                            setOrigin(w.name);
                            setShowOriginDropdown(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800 flex items-center justify-between"
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center font-extrabold text-[10px]">
                              {w.code_str}
                            </span>
                            <span>{w.name}</span>
                          </span>
                          <span className="text-[11px] text-slate-400 font-normal">{w.name_ar}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Swap button (desktop) */}
                <div className="hidden lg:flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handleSwap}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-emerald-100 border border-slate-200 text-slate-600 hover:text-emerald-800 flex items-center justify-center transition-all -mx-2 z-10"
                    title="Inverser les villes"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="hidden lg:block w-px h-10 bg-slate-200" />

                {/* Segment 2: Destination */}
                <div ref={destRef} className="relative flex-1 flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-slate-50 transition-colors">
                  <Navigation className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                  <div className="flex-1 min-w-0 text-left">
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
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
                      placeholder="Où allez-vous ?"
                      className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none placeholder:text-slate-400"
                    />
                  </div>

                  {/* Destination Dropdown */}
                  {showDestDropdown && filteredDestWilayas.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 max-h-60 overflow-y-auto">
                      <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase">Wilayas suggérées</div>
                      {filteredDestWilayas.map((w) => (
                        <button
                          key={w.code}
                          type="button"
                          onClick={() => {
                            setDestination(w.name);
                            setShowDestDropdown(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800 flex items-center justify-between"
                        >
                          <span className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 flex items-center justify-center font-extrabold text-[10px]">
                              {w.code_str}
                            </span>
                            <span>{w.name}</span>
                          </span>
                          <span className="text-[11px] text-slate-400 font-normal">{w.name_ar}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="hidden lg:block w-px h-10 bg-slate-200" />

                {/* Segment 3: Date */}
                <div className="w-full lg:w-44 flex items-center gap-2.5 px-4 py-3 rounded-2xl hover:bg-slate-50 transition-colors">
                  <Calendar className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        Date
                      </label>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={setDateToday}
                          className="text-[9px] font-bold text-emerald-700 hover:underline"
                        >
                          Auj.
                        </button>
                        <span className="text-slate-300">•</span>
                        <button
                          type="button"
                          onClick={setDateTomorrow}
                          className="text-[9px] font-bold text-emerald-700 hover:underline"
                        >
                          Demain
                        </button>
                      </div>
                    </div>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>

                <div className="hidden lg:block w-px h-10 bg-slate-200" />

                {/* Segment 4: Passengers */}
                <div className="w-full lg:w-28 flex items-center gap-2.5 px-4 py-3 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer">
                  <Users className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                  <div className="flex-1 min-w-0 text-left">
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Places
                    </label>
                    <select
                      value={seats}
                      onChange={(e) => setSeats(parseInt(e.target.value, 10))}
                      className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                    >
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>
                          {n} pers.
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="p-1">
                  <button
                    type="submit"
                    className="w-full lg:w-auto h-12 lg:h-12 px-7 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 flex-shrink-0"
                  >
                    <Search className="w-4 h-4 text-white" strokeWidth={2.5} />
                    <span>Rechercher</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Wilaya Pills */}
            <div className="mt-4 flex items-center justify-center gap-2 flex-wrap text-xs">
              <span className="text-slate-400 font-semibold text-[11px]">Départs fréquents :</span>
              {['Alger', 'Oran', 'Constantine', 'Sétif', 'Annaba', 'Tlemcen'].map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    if (!origin) setOrigin(name);
                    else setDestination(name);
                  }}
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold border border-white/10 backdrop-blur-sm transition-colors"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE KEY CORE GUARANTEES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-3 text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Validation Manuelle du Conducteur
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Le conducteur approuve ou refuse explicitement chaque demande de siège. Vos réservations sont confirmées de manière transparente avant le voyage.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-3 text-left">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
              <Coffee className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Pause Sécurité 15 Min (&gt; 300 km)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pour tout trajet inter-wilayas supérieur à 300 km, une halte obligatoire de 15 minutes au point médian en station Naftal est automatiquement planifiée.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all space-y-3 text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <Sparkles className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Option Trajet Confort (+30%)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Voyagez détendu avec le siège passager avant garanti sans personne au milieu à l’arrière. Supplément de 30% affiché en toute clarté.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED ITINERARIES / BOARDING PASS CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 text-left">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Liaisons Régulières
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Axes Majeurs Inter-Wilayas
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Trajets réguliers sur les grands axes autoroutiers avec prix certifiés en Dinars.
            </p>
          </div>

          <button
            onClick={() => navigate('/search')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-emerald-700 hover:text-emerald-800 self-start sm:self-auto"
          >
            <span>Voir tous les trajets</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredRoutes.map((route, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/search?origin=${route.from}&destination=${route.to}`)}
              className="group cursor-pointer rounded-3xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden text-left"
            >
              <div className="h-44 overflow-hidden relative">
                <img
                  src={route.image}
                  alt={`${route.from} vers ${route.to}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-black/20" />
                <span className="absolute top-3 left-3 text-[10px] font-extrabold text-white bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20">
                  {route.tag}
                </span>

                {route.rest && (
                  <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[10px] font-bold text-amber-200 bg-amber-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-amber-500/30">
                    <Coffee className="w-3 h-3 text-amber-400" />
                    Pause 15 min
                  </span>
                )}

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black">{route.from}</span>
                      <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                      <span className="text-lg font-black">{route.to}</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-300">
                      {route.dist}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 flex items-center justify-between border-t border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Prix par passager (+15% inclus)
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-emerald-700 tabular-nums">
                      {route.price}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      (Base: {route.base})
                    </span>
                  </div>
                </div>

                {route.comfort ? (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    Confort dispo
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                    Standard
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DRIVER PUBLISH BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 text-left">
          <div className="max-w-2xl space-y-3 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <Car className="w-3.5 h-3.5 text-emerald-400" />
              Conducteurs & Automobilistes en Algérie
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Des sièges libres sur votre trajet ? Partagez vos frais.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Notre calculateur intègre le barème officiel Naftal (Essence, Gasoil, GPL) pour vous recommander un prix par siège équitable. Vous gardez 100% de votre prix de base.
            </p>
          </div>

          <div className="z-10 flex-shrink-0 w-full lg:w-auto">
            <button
              onClick={() => navigate('/trips/create')}
              className="w-full sm:w-auto py-3.5 px-7 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Car className="w-4 h-4 text-white" />
              <span>Publier un trajet maintenant</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
