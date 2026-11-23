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
  ArrowRightLeft,
  Navigation,
  Clock,
  Fuel,
  Check,
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
      axis: 'Autoroute A1 Ouest',
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
      axis: 'Autoroute A1 Est',
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
      axis: 'Hauts Plateaux',
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
      axis: 'RN22 Ouest',
      comfort: false,
      rest: false,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    },
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-28 text-left">
      {/* 1. HERO SECTION: Architectural & Warm Ivory Typography */}
      <section className="pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          {/* Subtle Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold text-[#16382C] bg-[#E2EDE6] border border-[#C4DBCD]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16382C]" />
            <span>Réseau National de Covoiturage • 58 Wilayas</span>
          </div>

          {/* Main Headline: Editorial, confident, no generic templates */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#141716] leading-[1.12]">
            Le covoiturage inter-wilayas, <br />
            <span className="font-serif italic font-normal text-[#16382C]">pensé avec exigence.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#5A625D] max-w-2xl mx-auto leading-relaxed">
            Reliez les grandes villes algériennes en toute sérénité. Conducteurs vérifiés, halte de repos réglementaire de 15 minutes au-delà de 300 km et transparence tarifaire en Dinars (DZD).
          </p>
        </div>

        {/* 2. THE SEARCH INSTRUMENT */}
        <div className="mt-10 sm:mt-12 max-w-4xl mx-auto relative z-30">
          <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-card border border-[#EAE5DC]">
            <form onSubmit={handleSearch} className="flex flex-col lg:flex-row items-stretch lg:items-center gap-1.5 lg:gap-0">
              {/* Segment 1: Origin */}
              <div ref={originRef} className="relative flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#FAF7F2] transition-colors">
                <MapPin className="w-4 h-4 text-[#16382C] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] font-bold text-[#7E8681] uppercase tracking-wider">
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
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#141716] focus:outline-none placeholder:text-[#ADB3AF]"
                  />
                </div>

                {/* Autocomplete Dropdown */}
                {showOriginDropdown && filteredOriginWilayas.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-dropdown border border-[#EAE5DC] py-1.5 z-50 max-h-60 overflow-y-auto">
                    <div className="px-3.5 py-1 text-[10px] font-bold text-[#7E8681] uppercase tracking-wider">
                      Wilayas suggérées
                    </div>
                    {filteredOriginWilayas.map((w) => (
                      <button
                        key={w.code}
                        type="button"
                        onClick={() => {
                          setOrigin(w.name);
                          setShowOriginDropdown(false);
                        }}
                        className="w-full px-3.5 py-2 text-left text-xs font-semibold text-[#303632] hover:bg-[#FAF7F2] hover:text-[#16382C] flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded bg-[#F4EFE6] text-[#434A46] flex items-center justify-center font-bold text-[10px]">
                            {w.code_str}
                          </span>
                          <span>{w.name}</span>
                        </span>
                        <span className="text-[11px] text-[#7E8681] font-arabic">{w.name_ar}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Swap Button */}
              <div className="hidden lg:flex items-center justify-center">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="w-8 h-8 rounded-full bg-[#FAF7F2] hover:bg-[#EAE5DC] border border-[#EAE5DC] text-[#5A625D] hover:text-[#141716] flex items-center justify-center transition-all -mx-2 z-10"
                  title="Inverser les villes"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="hidden lg:block w-px h-10 bg-[#EAE5DC]" />

              {/* Segment 2: Destination */}
              <div ref={destRef} className="relative flex-1 flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#FAF7F2] transition-colors">
                <Navigation className="w-4 h-4 text-[#16382C] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] font-bold text-[#7E8681] uppercase tracking-wider">
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
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-[#141716] focus:outline-none placeholder:text-[#ADB3AF]"
                  />
                </div>

                {/* Destination Dropdown */}
                {showDestDropdown && filteredDestWilayas.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-dropdown border border-[#EAE5DC] py-1.5 z-50 max-h-60 overflow-y-auto">
                    <div className="px-3.5 py-1 text-[10px] font-bold text-[#7E8681] uppercase tracking-wider">
                      Wilayas suggérées
                    </div>
                    {filteredDestWilayas.map((w) => (
                      <button
                        key={w.code}
                        type="button"
                        onClick={() => {
                          setDestination(w.name);
                          setShowDestDropdown(false);
                        }}
                        className="w-full px-3.5 py-2 text-left text-xs font-semibold text-[#303632] hover:bg-[#FAF7F2] hover:text-[#16382C] flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded bg-[#F4EFE6] text-[#434A46] flex items-center justify-center font-bold text-[10px]">
                            {w.code_str}
                          </span>
                          <span>{w.name}</span>
                        </span>
                        <span className="text-[11px] text-[#7E8681] font-arabic">{w.name_ar}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="hidden lg:block w-px h-10 bg-[#EAE5DC]" />

              {/* Segment 3: Date */}
              <div className="w-full lg:w-44 flex items-center gap-2.5 px-4 py-3 rounded-xl hover:bg-[#FAF7F2] transition-colors">
                <Calendar className="w-4 h-4 text-[#16382C] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-bold text-[#7E8681] uppercase tracking-wider">
                      Date
                    </label>
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <button
                        type="button"
                        onClick={setDateToday}
                        className="font-semibold text-[#16382C] hover:underline"
                      >
                        Auj.
                      </button>
                      <span className="text-[#C8BEAD]">•</span>
                      <button
                        type="button"
                        onClick={setDateTomorrow}
                        className="font-semibold text-[#16382C] hover:underline"
                      >
                        Demain
                      </button>
                    </div>
                  </div>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent text-xs font-semibold text-[#141716] focus:outline-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="hidden lg:block w-px h-10 bg-[#EAE5DC]" />

              {/* Segment 4: Seats */}
              <div className="w-full lg:w-28 flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-[#FAF7F2] transition-colors">
                <Users className="w-4 h-4 text-[#16382C] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <label className="block text-[10px] font-bold text-[#7E8681] uppercase tracking-wider">
                    Places
                  </label>
                  <select
                    value={seats}
                    onChange={(e) => setSeats(parseInt(e.target.value, 10))}
                    className="w-full bg-transparent text-xs font-semibold text-[#141716] focus:outline-none cursor-pointer"
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n} pers.
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Search Submit Action Button */}
              <div className="p-1">
                <button
                  type="submit"
                  className="w-full lg:w-auto h-12 px-7 rounded-xl bg-[#16382C] hover:bg-[#0F281F] text-[#FAF7F2] font-bold text-xs shadow-fine active:scale-[0.98] transition-all flex items-center justify-center gap-2 flex-shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>Rechercher</span>
                </button>
              </div>
            </form>
          </div>

          {/* Quick Wilaya Pills */}
          <div className="mt-4 flex items-center justify-center gap-2 flex-wrap text-xs text-[#5A625D]">
            <span className="font-semibold text-[11px] text-[#7E8681]">Liaisons rapides :</span>
            {['Alger', 'Oran', 'Constantine', 'Sétif', 'Annaba', 'Tlemcen', 'Ghardaïa'].map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  if (!origin) setOrigin(name);
                  else setDestination(name);
                }}
                className="px-2.5 py-1 rounded-md bg-white hover:bg-[#EAE5DC] text-[#303632] text-[11px] font-medium border border-[#EAE5DC] shadow-fine transition-colors"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CORE GUARANTEES (DZ-CARPOOL BUSINESS RULES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Card 1: Approval */}
          <div className="p-6 rounded-2xl bg-white border border-[#EAE5DC] shadow-fine space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#E2EDE6] text-[#16382C] flex items-center justify-center border border-[#C4DBCD]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#141716] tracking-tight">
              Validation Manuelle par le Conducteur
            </h3>
            <p className="text-xs text-[#5A625D] leading-relaxed">
              Chaque demande fait l’objet d’une approbation explicite. La réservation atomique avec contrôle de concurrence garantit qu’aucune place n’est doublement allouée.
            </p>
          </div>

          {/* Card 2: Rest Stop */}
          <div className="p-6 rounded-2xl bg-white border border-[#EAE5DC] shadow-fine space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#F8ECE3] text-[#A14114] flex items-center justify-center border border-[#F0D5C3]">
              <Coffee className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#141716] tracking-tight">
              Halte Sécurité 15 Min (&gt; 300 km)
            </h3>
            <p className="text-xs text-[#5A625D] leading-relaxed">
              Pour tout trajet supérieur à 300 km sur le réseau autoroutier, une pause obligatoire de 15 minutes en station Naftal est automatiquement intégrée à l’itinéraire.
            </p>
          </div>

          {/* Card 3: Pricing */}
          <div className="p-6 rounded-2xl bg-white border border-[#EAE5DC] shadow-fine space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#FAF7F2] text-[#16382C] flex items-center justify-center border border-[#EAE5DC]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#141716] tracking-tight">
              Option Confort (+30%) & Commission 15%
            </h3>
            <p className="text-xs text-[#5A625D] leading-relaxed">
              Arithmétique transparente : le prix passager inclut 15% de commission. L’option Confort garantit le siège avant sans personne au milieu avec un supplément clair de 30%.
            </p>
          </div>
        </div>
      </section>

      {/* 4. CURATED AXES (EDITORIAL TRAVEL PHOTO CARDS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-[#16382C]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#16382C]">
                Liaisons Régulières
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#141716] tracking-tight">
              Grands Axes Inter-Wilayas
            </h2>
            <p className="text-xs sm:text-sm text-[#5A625D] mt-1">
              Trajets fréquents vérifiés sur le réseau autoroutier national.
            </p>
          </div>

          <button
            onClick={() => navigate('/search')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#16382C] hover:underline self-start sm:self-auto"
          >
            <span>Explorer tous les trajets</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredRoutes.map((route, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/search?origin=${route.from}&destination=${route.to}`)}
              className="group cursor-pointer rounded-2xl bg-white border border-[#EAE5DC] hover:border-[#16382C] hover:shadow-card transition-all flex flex-col justify-between overflow-hidden"
            >
              {/* Image with 16:9 aspect crop */}
              <div className="h-40 overflow-hidden relative bg-[#F4EFE6]">
                <img
                  src={route.image}
                  alt={`${route.from} vers ${route.to}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141716]/80 via-transparent to-transparent" />
                <span className="absolute top-2.5 left-2.5 text-[10px] font-semibold text-[#FAF7F2] bg-[#141716]/70 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
                  {route.axis}
                </span>

                {route.rest && (
                  <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 text-[10px] font-semibold text-[#FAF7F2] bg-[#A14114]/85 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
                    <Coffee className="w-3 h-3 text-[#F0D5C3]" />
                    Pause 15 min
                  </span>
                )}

                <div className="absolute bottom-2.5 left-3 right-3 text-[#FAF7F2]">
                  <div className="flex items-center justify-between text-sm font-bold">
                    <div className="flex items-center gap-1.5">
                      <span>[{route.fromCode}] {route.from}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#97C0A7]" />
                      <span>[{route.toCode}] {route.to}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-[#D6D9D7]">
                    {route.dist} • {route.time}
                  </span>
                </div>
              </div>

              {/* Price Details */}
              <div className="p-4 flex items-center justify-between border-t border-[#F4EFE6]">
                <div>
                  <span className="text-[10px] text-[#7E8681] font-semibold uppercase tracking-wider block">
                    Passager (TTC)
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg font-bold text-[#141716] tabular-nums">
                      {route.price}
                    </span>
                    <span className="text-[10px] text-[#7E8681]">
                      (Net: {route.base})
                    </span>
                  </div>
                </div>

                {route.comfort ? (
                  <span className="text-[10px] font-bold text-[#16382C] bg-[#E2EDE6] px-2 py-0.5 rounded border border-[#C4DBCD]">
                    Confort +30%
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-[#7E8681] bg-[#FAF7F2] px-2 py-0.5 rounded border border-[#EAE5DC]">
                    Standard
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. DRIVER CALL TO ACTION: Matte Forest Tone */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-[#16382C] text-[#FAF7F2] p-8 sm:p-12 border border-[#276243] shadow-card flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider text-[#97C0A7] bg-[#0F281F]">
              <Car className="w-3.5 h-3.5" />
              Automobilistes & Conducteurs
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
              Vous prenez la route ? Partagez vos frais de carburant.
            </h2>
            <p className="text-xs sm:text-sm text-[#C4DBCD] leading-relaxed">
              Publiez votre annonce en quelques secondes. Notre barème officiel Naftal estime automatiquement votre consommation (8L/100km) et vous suggère une contribution par siège équitable. Vous conservez 100% de votre prix net.
            </p>
          </div>

          <div className="flex-shrink-0 w-full lg:w-auto">
            <button
              onClick={() => navigate('/trips/create')}
              className="w-full sm:w-auto py-3.5 px-7 rounded-xl bg-white hover:bg-[#FAF7F2] text-[#16382C] font-bold text-xs shadow-fine transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <Car className="w-4 h-4 text-[#16382C]" />
              <span>Publier un trajet conducteur</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
