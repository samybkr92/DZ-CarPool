import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  Compass,
  CheckCircle2,
  ChevronRight,
  Fuel,
  ArrowRightLeft,
  Navigation,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [seats, setSeats] = useState(1);

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

  const featuredRoutes = [
    {
      from: 'Alger',
      to: 'Oran',
      dist: '415 km',
      time: '4h 30m',
      price: '1 840 DA',
      tag: 'A1 Ouest • Côtière',
      comfort: true,
      rest: true,
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    },
    {
      from: 'Alger',
      to: 'Constantine',
      dist: '390 km',
      time: '4h 20m',
      price: '1 725 DA',
      tag: 'A1 Est • Gorges du Rhumel',
      comfort: true,
      rest: true,
      image: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=800&q=80',
    },
    {
      from: 'Alger',
      to: 'Sétif',
      dist: '260 km',
      time: '2h 50m',
      price: '1 150 DA',
      tag: 'Hauts Plateaux • A1',
      comfort: true,
      rest: false,
      image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    },
    {
      from: 'Oran',
      to: 'Tlemcen',
      dist: '140 km',
      time: '1h 40m',
      price: '690 DA',
      tag: 'Grand Ouest • RN22',
      comfort: false,
      rest: false,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    },
    {
      from: 'Constantine',
      to: 'Annaba',
      dist: '160 km',
      time: '1h 50m',
      price: '805 DA',
      tag: 'Liaison Nord-Est',
      comfort: true,
      rest: false,
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    },
    {
      from: 'Alger',
      to: 'Ghardaïa',
      dist: '600 km',
      time: '7h 00m',
      price: '2 875 DA',
      tag: 'Porte du Sahara • RN1',
      comfort: true,
      rest: true,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const popularWilayas = [
    { name: 'Alger', code: '16' },
    { name: 'Oran', code: '31' },
    { name: 'Constantine', code: '25' },
    { name: 'Sétif', code: '19' },
    { name: 'Annaba', code: '23' },
    { name: 'Batna', code: '05' },
    { name: 'Tlemcen', code: '13' },
    { name: 'Blida', code: '09' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-24">
      {/* 1. HERO: Premium Editorial Travel Banner with High Impact */}
      <section className="relative bg-slate-950 text-white overflow-hidden pt-12 sm:pt-20 pb-20 sm:pb-28">
        {/* Scenic Mediterranean / Algerian Road Backdrop */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=2000&q=80"
            alt="Voyage en Algérie"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-emerald-950/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Eyebrow & Hero Header */}
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 backdrop-blur-md shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Réseau National de Covoiturage Inter-Wilayas</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.10]">
              La route d’Algérie, <br />
              <span className="text-emerald-400">partagée avec sérénité.</span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Voyagez entre les 58 wilayas à prix équitable. Conducteurs certifiés, haltes de repos réglementaires de 15 min (&gt; 300 km) et transparence tarifaire en Dinars Algériens.
            </p>
          </div>

          {/* Focal Point: The BlaBlaCar-Style Floating Search Pill */}
          <div className="mt-8 sm:mt-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl sm:rounded-full p-2.5 shadow-2xl border border-white/20 text-slate-900">
              <form
                onSubmit={handleSearch}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-1 sm:gap-0"
              >
                {/* Segment 1: Departure Origin */}
                <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl sm:rounded-l-full sm:rounded-r-none hover:bg-slate-50 transition-colors cursor-text">
                  <MapPin className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                  <div className="flex-1 min-w-0 text-left">
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      {t('hero.from', 'Départ')}
                    </label>
                    <input
                      type="text"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder="D'où partez-vous ?"
                      className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Swap button (desktop) */}
                <button
                  type="button"
                  onClick={handleSwap}
                  className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-600 hover:text-emerald-700 hover:scale-110 transition-all flex-shrink-0 -mx-1.5 z-10"
                  title="Inverser les villes"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                </button>

                <div className="hidden sm:block w-px h-10 bg-slate-200" />

                {/* Segment 2: Destination */}
                <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl sm:rounded-none hover:bg-slate-50 transition-colors cursor-text">
                  <Navigation className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                  <div className="flex-1 min-w-0 text-left">
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      {t('hero.to', 'Destination')}
                    </label>
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Où allez-vous ?"
                      className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="hidden sm:block w-px h-10 bg-slate-200" />

                {/* Segment 3: Date */}
                <div className="w-full sm:w-40 flex items-center gap-2.5 px-4 py-3 rounded-xl sm:rounded-none hover:bg-slate-50 transition-colors">
                  <Calendar className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <div className="flex-1 min-w-0 text-left">
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      {t('hero.date', 'Date')}
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>

                <div className="hidden sm:block w-px h-10 bg-slate-200" />

                {/* Segment 4: Passengers */}
                <div className="w-full sm:w-28 flex items-center gap-2 px-4 py-3 rounded-xl sm:rounded-none hover:bg-slate-50 transition-colors cursor-pointer">
                  <Users className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <div className="flex-1 min-w-0 text-left">
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
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
                <div className="p-1 sm:p-0 sm:pr-1">
                  <button
                    type="submit"
                    className="w-full sm:w-auto h-12 sm:h-12 px-7 rounded-xl sm:rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 flex-shrink-0"
                  >
                    <Search className="w-4 h-4 text-amber-300" strokeWidth={2.5} />
                    <span>Rechercher</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Wilaya Quick Pick Pills */}
            <div className="mt-5 flex items-center justify-center gap-2 flex-wrap text-xs">
              <span className="text-slate-400 font-semibold text-[11px]">Départs fréquents :</span>
              {popularWilayas.map((wilaya) => (
                <button
                  key={wilaya.code}
                  type="button"
                  onClick={() => {
                    if (!origin) setOrigin(wilaya.name);
                    else setDestination(wilaya.name);
                  }}
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/10 backdrop-blur-sm transition-colors"
                >
                  {wilaya.code} • {wilaya.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION: Key Guarantees */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-md hover:shadow-lg transition-all space-y-3 text-left">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Validation Manuelle Préalable
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Le conducteur approuve explicitement chaque réservation. Aucune mauvaise surprise : vous connaissez vos compagnons de route avant le départ.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-md hover:shadow-lg transition-all space-y-3 text-left">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
              <Coffee className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Pause Sécurité 15 Min &gt; 300 km
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pour les longs trajets inter-wilayas, un arrêt obligatoire au point médian en station Naftal est programmé pour le repos du conducteur.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-md hover:shadow-lg transition-all space-y-3 text-left">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <Sparkles className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Option Trajet Confort (+30%)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Voyagez l'esprit tranquille avec le siège avant garanti sans passager assis au milieu à l'arrière. Supplément fixe sans cascade de frais.
            </p>
          </div>
        </div>
      </section>

      {/* 3. POPULAR AXES: High-End Travel Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Lignes Fréquentes
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Liaisons Populaires Inter-Wilayas
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Les axes majeurs empruntés quotidiennement avec tarification certifiée en Dinars.
            </p>
          </div>

          <button
            onClick={() => navigate('/search')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 self-start sm:self-auto"
          >
            <span>Consulter tous les trajets</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredRoutes.map((route, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/search?origin=${route.from}&destination=${route.to}`)}
              className="group cursor-pointer rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-500 hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="h-40 overflow-hidden relative">
                <img
                  src={route.image}
                  alt={`${route.from} vers ${route.to}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                <span className="absolute top-3 left-3 text-[11px] font-bold text-white bg-slate-950/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
                  {route.tag}
                </span>
                {route.rest && (
                  <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[11px] font-bold text-amber-200 bg-amber-950/70 backdrop-blur-md px-2 py-0.5 rounded border border-amber-500/30">
                    <Coffee className="w-3 h-3 text-amber-300" />
                    Pause 15 min
                  </span>
                )}
                <div className="absolute bottom-3 left-3 text-white">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black">{route.from}</span>
                    <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                    <span className="text-lg font-black">{route.to}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">
                    {route.dist} • {route.time}
                  </span>
                  <span className="text-xl font-black text-emerald-700 tabular-nums">
                    {route.price}
                  </span>
                </div>

                {route.comfort ? (
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    Option Confort
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                    Standard
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. HOW IT WORKS: Concierge 3-Step Guide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-14 shadow-md">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Simplicité & Confiance
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Comment voyager sur DZ-CarPool ?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Un parcours fluide pensé pour vous éviter les tracas des gares routières encombrées.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 text-left p-4 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-lg shadow-sm">
                01
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Recherchez votre itinéraire</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Indiquez votre ville de départ et votre destination parmi les 58 wilayas. Filtrez par horaire, véhicule climatisé ou option Trajet Confort.
              </p>
            </div>

            <div className="space-y-3 text-left p-4 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-lg shadow-sm">
                02
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Le conducteur valide votre demande</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sélectionnez le nombre de places souhaité. Le conducteur reçoit votre demande et l'approuve manuellement pour bloquer votre siège de façon atomique.
              </p>
            </div>

            <div className="space-y-3 text-left p-4 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black text-lg shadow-sm">
                03
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Voyagez en toute quiétude</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Retrouvez votre conducteur au point de rassemblement convenu. Sur les trajets de plus de 300 km, profitez d'une pause café réglementaire de 15 minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DRIVER CTA: High-Contrast Value Proposition */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-14 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl space-y-4 z-10 text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <Car className="w-3.5 h-3.5 text-emerald-400" />
              Automobilistes & Conducteurs en Algérie
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Vous avez des places libres ? Partagez vos frais de carburant.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Rentabilisez vos trajets inter-wilayas réguliers ou ponctuels. Notre calculateur utilise le barème hebdomadaire officiel Naftal (Essence, Gasoil, Sirghaz) pour vous suggérer un prix par siège équitable.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-semibold">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Droit de regard sur chaque passager
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Net conducteur garanti à 100%
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Aucun intermédiaire opaque
              </span>
            </div>
          </div>

          <div className="z-10 flex-shrink-0 w-full lg:w-auto">
            <button
              onClick={() => navigate('/trips/create')}
              className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Car className="w-5 h-5 text-white" />
              <span>Publier mon trajet dès maintenant</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};