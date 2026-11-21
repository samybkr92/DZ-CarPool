import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  MapPin,
  Calendar,
  Users,
  Search,
  ShieldCheck,
  Coins,
  Sparkles,
  ArrowRight,
  Car,
  Compass,
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

  const featuredRoutes = [
    { from: 'Alger', to: 'Oran', dist: '415 km', time: '4h 30m', price: '1 840 DA', comfort: true, rest: true },
    { from: 'Alger', to: 'Constantine', dist: '390 km', time: '4h 20m', price: '1 725 DA', comfort: true, rest: true },
    { from: 'Alger', to: 'Sétif', dist: '260 km', time: '2h 50m', price: '1 150 DA', comfort: true, rest: false },
    { from: 'Oran', to: 'Tlemcen', dist: '140 km', time: '1h 40m', price: '690 DA', comfort: false, rest: false },
    { from: 'Constantine', to: 'Annaba', dist: '160 km', time: '1h 50m', price: '805 DA', comfort: true, rest: false },
    { from: 'Alger', to: 'Ghardaïa', dist: '600 km', time: '7h 00m', price: '2 875 DA', comfort: true, rest: true },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-emerald-50/60 via-white to-gray-50/50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              {t('hero.badge')}
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.15]">
              {t('hero.title')}
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Search-First Box */}
          <div className="mt-10 max-w-4xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-200/80 p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center"
            >
              {/* Origin */}
              <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200/70 focus-within:bg-white focus-within:border-emerald-600 transition-colors">
                <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div className="w-full">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {t('hero.from')}
                  </label>
                  <input
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    placeholder="Ex: Alger, Blida..."
                    className="w-full bg-transparent text-sm font-semibold text-gray-900 focus:outline-none placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Destination */}
              <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200/70 focus-within:bg-white focus-within:border-emerald-600 transition-colors">
                <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div className="w-full">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {t('hero.to')}
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Ex: Oran, Constantine..."
                    className="w-full bg-transparent text-sm font-semibold text-gray-900 focus:outline-none placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200/70 focus-within:bg-white focus-within:border-emerald-600 transition-colors">
                <Calendar className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div className="w-full">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    {t('hero.date')}
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent text-sm font-semibold text-gray-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="sm:col-span-2 lg:col-span-1">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Search className="w-4 h-4" />
                  <span>{t('hero.cta_search')}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Trust Cues */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">{t('hero.trust_safety')}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{t('hero.trust_safety_desc')}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">{t('hero.trust_pricing')}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{t('hero.trust_pricing_desc')}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">{t('hero.trust_comfort')}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{t('hero.trust_comfort_desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Inter-Wilaya Routes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Liaisons Populaires Inter-Wilayas
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Les axes les plus empruntés avec tarification standard et confort certifiés.
            </p>
          </div>
          <button
            onClick={() => navigate('/search')}
            className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700"
          >
            <span>Voir tous les trajets</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredRoutes.map((route, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/search?origin=${route.from}&destination=${route.to}`)}
              className="group cursor-pointer rounded-2xl bg-white border border-gray-200/80 p-5 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
                  <span className="flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-emerald-600" />
                    {route.dist} • {route.time}
                  </span>
                  {route.rest && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                      Pause 15m (&gt;300km)
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-1">
                  <span className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {route.from}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  <span className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                    {route.to}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-gray-400 block font-medium">À partir de</span>
                  <span className="text-lg font-black text-emerald-700">{route.price}</span>
                </div>
                {route.comfort && (
                  <span className="text-xs font-semibold text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                    Confort dispo
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Driver Call-To-Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-8 sm:p-12 shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3 z-10">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-700/60 text-emerald-200 border border-emerald-500/30">
              Conducteurs en Algérie
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Vous avez des places libres dans votre véhicule ?
            </h2>
            <p className="text-emerald-100/90 text-sm leading-relaxed">
              Rentabilisez vos trajets inter-villes en partageant vos frais de carburant Naftal. Définissez votre prix, choisissez vos passagers et profitez d'une communauté conviviale.
            </p>
          </div>
          <div className="z-10 flex-shrink-0">
            <button
              onClick={() => navigate('/trips/create')}
              className="py-3.5 px-8 rounded-xl bg-white text-emerald-900 font-extrabold text-sm shadow-lg hover:bg-emerald-50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <Car className="w-5 h-5 text-emerald-700" />
              <span>Publier mon trajet</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
