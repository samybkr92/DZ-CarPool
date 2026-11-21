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
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
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

  const featuredRoutes = [
    { from: 'Alger', to: 'Oran', dist: '415 km', time: '4h 30m', price: '1 840 DA', comfort: true, rest: true },
    { from: 'Alger', to: 'Constantine', dist: '390 km', time: '4h 20m', price: '1 725 DA', comfort: true, rest: true },
    { from: 'Alger', to: 'Sétif', dist: '260 km', time: '2h 50m', price: '1 150 DA', comfort: true, rest: false },
    { from: 'Oran', to: 'Tlemcen', dist: '140 km', time: '1h 40m', price: '690 DA', comfort: false, rest: false },
    { from: 'Constantine', to: 'Annaba', dist: '160 km', time: '1h 50m', price: '805 DA', comfort: true, rest: false },
    { from: 'Alger', to: 'Ghardaïa', dist: '600 km', time: '7h 00m', price: '2 875 DA', comfort: true, rest: true },
  ];

  const popularWilayas = ['Alger', 'Oran', 'Constantine', 'Sétif', 'Annaba', 'Batna', 'Blida', 'Tlemcen'];

  return (
    <div className="space-y-20 sm:space-y-28 pb-20">
      {/* 1. Travel-Led Editorial Hero with Integrated Search */}
      <section className="relative pt-8 sm:pt-12 pb-16 sm:pb-24 overflow-hidden border-b border-[#E7E2DA]">
        {/* Editorial Background Motif */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F2ECE4]/70 via-[#FAF8F5] to-[#FAF8F5] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Typography */}
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-forest-100/90 text-forest-800 border border-forest-200/80 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-forest-700 animate-pulse" />
              <span>{t('hero.badge', 'Mobilité Inter-Wilayas en Algérie')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-ink-900 leading-[1.12]">
              {t('hero.title', 'La route, partagée en toute sérénité.')}
            </h1>

            <p className="text-base sm:text-lg text-ink-600 max-w-2xl mx-auto leading-relaxed">
              {t('hero.subtitle', 'Voyagez entre les 58 wilayas à prix juste. Conducteurs certifiés, haltes de repos obligatoires et transparence tarifaire en Dinars Algériens.')}
            </p>
          </div>

          {/* Focal Point: The Clear Search Form */}
          <div className="mt-10 sm:mt-12 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl border border-[#DED7CE] shadow-card p-3 sm:p-4">
              <form
                onSubmit={handleSearch}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 sm:gap-3 items-center"
              >
                {/* Field 1: Departure Origin (4 cols) */}
                <div className="lg:col-span-3 flex items-center gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA] focus-within:bg-white focus-within:border-forest-600 focus-within:ring-2 focus-within:ring-forest-600/15 transition-all">
                  <MapPin className="w-5 h-5 text-forest-700 flex-shrink-0" />
                  <div className="w-full">
                    <label className="block text-[11px] font-bold text-ink-500 uppercase tracking-wider">
                      {t('hero.from', 'Départ')}
                    </label>
                    <input
                      type="text"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder="Ex: Alger, Blida..."
                      className="w-full bg-transparent text-sm font-semibold text-ink-900 focus:outline-none placeholder-ink-400"
                    />
                  </div>
                </div>

                {/* Field 2: Destination (4 cols) */}
                <div className="lg:col-span-3 flex items-center gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA] focus-within:bg-white focus-within:border-forest-600 focus-within:ring-2 focus-within:ring-forest-600/15 transition-all">
                  <MapPin className="w-5 h-5 text-forest-700 flex-shrink-0" />
                  <div className="w-full">
                    <label className="block text-[11px] font-bold text-ink-500 uppercase tracking-wider">
                      {t('hero.to', 'Destination')}
                    </label>
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Ex: Oran, Sétif..."
                      className="w-full bg-transparent text-sm font-semibold text-ink-900 focus:outline-none placeholder-ink-400"
                    />
                  </div>
                </div>

                {/* Field 3: Date (2 cols) */}
                <div className="lg:col-span-2 flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA] focus-within:bg-white focus-within:border-forest-600 focus-within:ring-2 focus-within:ring-forest-600/15 transition-all">
                  <Calendar className="w-4 h-4 text-forest-700 flex-shrink-0" />
                  <div className="w-full">
                    <label className="block text-[11px] font-bold text-ink-500 uppercase tracking-wider">
                      {t('hero.date', 'Date')}
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-transparent text-xs font-semibold text-ink-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Field 4: Passengers (1 col) */}
                <div className="lg:col-span-1 flex items-center gap-2 p-3 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA] focus-within:bg-white focus-within:border-forest-600 focus-within:ring-2 focus-within:ring-forest-600/15 transition-all">
                  <Users className="w-4 h-4 text-forest-700 flex-shrink-0" />
                  <div className="w-full">
                    <label className="block text-[11px] font-bold text-ink-500 uppercase tracking-wider">
                      Places
                    </label>
                    <select
                      value={seats}
                      onChange={(e) => setSeats(parseInt(e.target.value, 10))}
                      className="w-full bg-transparent text-xs font-semibold text-ink-900 focus:outline-none"
                    >
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* CTA Action (3 cols) */}
                <div className="sm:col-span-2 lg:col-span-3">
                  <button
                    type="submit"
                    className="w-full h-14 flex items-center justify-center gap-2.5 px-6 bg-forest-700 hover:bg-forest-800 text-[#FAF8F5] font-bold rounded-xl shadow-subtle hover:shadow-card transition-all active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-forest-700/30"
                  >
                    <Search className="w-4 h-4 text-citrus-300" strokeWidth={2.5} />
                    <span className="text-sm tracking-wide">{t('hero.cta_search', 'Rechercher')}</span>
                  </button>
                </div>
              </form>

              {/* Quick Wilaya Shortcuts */}
              <div className="mt-3 pt-3 border-t border-[#F4EFEB] flex items-center gap-2 text-xs text-ink-500 overflow-x-auto pb-1">
                <span className="font-semibold text-ink-400 flex-shrink-0">Villes populaires :</span>
                {popularWilayas.map((wilaya) => (
                  <button
                    key={wilaya}
                    type="button"
                    onClick={() => {
                      if (!origin) setOrigin(wilaya);
                      else setDestination(wilaya);
                    }}
                    className="px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E7E2DA] text-ink-700 hover:border-forest-600 hover:text-forest-700 text-[11px] font-medium flex-shrink-0 transition-colors"
                  >
                    {wilaya}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Trust Cues: Clear, Distinctive, Honest */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-xl bg-white border border-[#E7E2DA] shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-700 flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-forest-700" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wider">
                  {t('hero.trust_safety', 'Validation Manuelle des Demandes')}
                </h3>
                <p className="text-xs text-ink-600 leading-relaxed">
                  {t('hero.trust_safety_desc', 'Chaque conducteur examine et valide explicitement ses passagers pour garantir la sérénité du voyage.')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-xl bg-white border border-[#E7E2DA] shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-citrus-50 border border-citrus-100 flex items-center justify-center text-citrus-700 flex-shrink-0">
                <Coffee className="w-5 h-5 text-citrus-700" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wider">
                  Pause Sécurité Obligatoire &gt; 300 km
                </h3>
                <p className="text-xs text-ink-600 leading-relaxed">
                  Pour les trajets longs, un arrêt de 15 minutes à mi-parcours (station Naftal) est automatiquement imposé pour le repos du conducteur.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-4 sm:p-5 rounded-xl bg-white border border-[#E7E2DA] shadow-xs">
              <div className="w-10 h-10 rounded-lg bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-700 flex-shrink-0">
                <Sparkles className="w-5 h-5 text-forest-700" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-ink-900 uppercase tracking-wider">
                  Option Trajet Confort (+30%)
                </h3>
                <p className="text-xs text-ink-600 leading-relaxed">
                  Bénéficiez du siège avant spacieux sans voisin au milieu. Supplément transparent sans cascade de frais additionnels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Inter-Wilaya Routes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-forest-700" />
              <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
                Liaisons Régulières
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-ink-900 tracking-tight">
              Trajets Populaires Inter-Wilayas
            </h2>
            <p className="text-xs sm:text-sm text-ink-600 mt-1 max-w-xl">
              Départs fréquents sur les autoroutes Est-Ouest et les routes nationales algériennes.
            </p>
          </div>
          <button
            onClick={() => navigate('/search')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-forest-700 hover:text-forest-900 self-start sm:self-auto"
          >
            <span>Explorer tous les trajets</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredRoutes.map((route, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/search?origin=${route.from}&destination=${route.to}`)}
              className="group cursor-pointer rounded-xl bg-white border border-[#E7E2DA] p-5 hover:border-forest-600 hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Badges line */}
                <div className="flex items-center justify-between text-xs font-semibold text-ink-500">
                  <span className="flex items-center gap-1.5 font-medium text-ink-600">
                    <Compass className="w-3.5 h-3.5 text-forest-700" />
                    <span>{route.dist}</span>
                    <span>•</span>
                    <span>{route.time}</span>
                  </span>

                  {route.rest && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-citrus-50 text-citrus-800 border border-citrus-200">
                      Pause 15 min &gt; 300km
                    </span>
                  )}
                </div>

                {/* Origin -> Destination */}
                <div className="flex items-center gap-2.5 pt-1">
                  <span className="text-lg font-bold text-ink-900 group-hover:text-forest-700 transition-colors">
                    {route.from}
                  </span>
                  <ArrowRight className="w-4 h-4 text-ink-400 group-hover:text-forest-700 group-hover:translate-x-1 transition-all" />
                  <span className="text-lg font-bold text-ink-900 group-hover:text-forest-700 transition-colors">
                    {route.to}
                  </span>
                </div>
              </div>

              {/* Price and Features Footer */}
              <div className="mt-5 pt-3.5 border-t border-[#F4EFEB] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-ink-500 uppercase tracking-wider block font-medium">
                    Tarif passager garanti
                  </span>
                  <span className="text-lg font-black text-forest-700 tabular-nums">
                    {route.price}
                  </span>
                </div>
                {route.comfort && (
                  <span className="text-[11px] font-bold text-forest-800 bg-forest-50 px-2.5 py-1 rounded-md border border-forest-200/80">
                    Option Confort
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Editorial "Comment ça marche" (How It Works) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-2xl p-8 sm:p-12 shadow-xs">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
              Expérience Voyageur
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-ink-900 tracking-tight">
              Comment fonctionne DZ-CarPool ?
            </h2>
            <p className="text-xs sm:text-sm text-ink-600">
              Un processus transparent conçu pour concilier simplicité, respect mutuel et sécurité.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 p-5 rounded-xl bg-white border border-[#E7E2DA] shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-forest-700 text-[#FAF8F5] flex items-center justify-center font-black text-sm">
                1
              </div>
              <h3 className="text-sm font-bold text-ink-900">Recherchez votre itinéraire</h3>
              <p className="text-xs text-ink-600 leading-relaxed">
                Indiquez votre ville de départ, votre destination et votre date. Consultez les profils des conducteurs, leurs véhicules et leurs arrêts prévus.
              </p>
            </div>

            <div className="space-y-3 p-5 rounded-xl bg-white border border-[#E7E2DA] shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-forest-700 text-[#FAF8F5] flex items-center justify-center font-black text-sm">
                2
              </div>
              <h3 className="text-sm font-bold text-ink-900">Demande validée par le conducteur</h3>
              <p className="text-xs text-ink-600 leading-relaxed">
                Sélectionnez le nombre de places et l'option Confort si vous souhaitez la place avant. Le conducteur approuve manuellement votre demande.
              </p>
            </div>

            <div className="space-y-3 p-5 rounded-xl bg-white border border-[#E7E2DA] shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-forest-700 text-[#FAF8F5] flex items-center justify-center font-black text-sm">
                3
              </div>
              <h3 className="text-sm font-bold text-ink-900">Voyagez en toute quiétude</h3>
              <p className="text-xs text-ink-600 leading-relaxed">
                Coordonnez les détails du rendez-vous dans la messagerie dédiée au trajet. Pour les distances supérieures à 300 km, profitez d'une pause café garantie.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Driver Value Proposition Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-forest-900 text-[#FAF8F5] p-8 sm:p-12 border border-forest-800 shadow-elevated relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-3 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-forest-800 text-forest-200 border border-forest-700">
              <Car className="w-3.5 h-3.5 text-citrus-300" />
              Conducteurs Inter-Wilayas
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              Vous voyagez souvent entre les wilayas ? Partagez vos frais de route.
            </h2>
            <p className="text-xs sm:text-sm text-forest-200/90 leading-relaxed">
              Rentabilisez vos trajets en transportant des passagers de confiance. Utilisez notre calculateur de carburant Naftal basé sur les barèmes officiels par wilaya et restez maître de votre véhicule.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-forest-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-citrus-400" />
                Estimation carburant Naftal
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-citrus-400" />
                Droit de regard sur chaque réservation
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-citrus-400" />
                Reversé au centime près
              </span>
            </div>
          </div>

          <div className="z-10 flex-shrink-0 w-full lg:w-auto">
            <button
              onClick={() => navigate('/trips/create')}
              className="w-full sm:w-auto py-3.5 px-8 rounded-xl bg-citrus-500 hover:bg-citrus-600 text-ink-900 font-bold text-sm shadow-card hover:shadow-elevated transition-all flex items-center justify-center gap-2"
            >
              <Car className="w-4 h-4 text-ink-900" />
              <span>Publier un trajet conducteur</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
