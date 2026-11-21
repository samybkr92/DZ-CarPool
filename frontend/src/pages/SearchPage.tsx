import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { Trip } from '../types';
import { WILAYAS, calculatePrices } from '../utils/algeriaData';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Coffee,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Car,
  Filter,
  CheckCircle2,
  Navigation,
  Clock,
} from 'lucide-react';

export const SearchPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search input state
  const originCity = searchParams.get('origin') || '';
  const destinationCity = searchParams.get('destination') || '';
  const dateParam = searchParams.get('date') || '';

  const [inputOrigin, setInputOrigin] = useState(originCity);
  const [inputDestination, setInputDestination] = useState(destinationCity);
  const [inputDate, setInputDate] = useState(dateParam);

  // Filters
  const [comfortOnly, setComfortOnly] = useState<boolean>(false);
  const [restStopOnly, setRestStopOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'departure' | 'price'>('departure');

  const fetchTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await api.searchTrips({
        origin_city: originCity || undefined,
        destination_city: destinationCity || undefined,
        date: dateParam || undefined,
        comfort_only: comfortOnly || undefined,
        has_rest_stop: restStopOnly || undefined,
      });
      setTrips(results);
    } catch (err: any) {
      setError(err.message || 'Impossible de récupérer les trajets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [originCity, destinationCity, dateParam, comfortOnly, restStopOnly]);

  const handleUpdateSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (inputOrigin) query.append('origin', inputOrigin);
    if (inputDestination) query.append('destination', inputDestination);
    if (inputDate) query.append('date', inputDate);
    setSearchParams(query);
  };

  const sortedTrips = [...trips].sort((a, b) => {
    if (sortBy === 'price') {
      return a.base_seat_price - b.base_seat_price;
    }
    return new Date(a.departure_datetime).getTime() - new Date(b.departure_datetime).getTime();
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* 1. Refined Search & Filter Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('search.title', 'Trajets Disponibles')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-2">
              {originCity || destinationCity ? (
                <span className="flex items-center gap-1.5 flex-wrap">
                  Résultats pour <strong className="text-emerald-700">{originCity || 'Toute ville'}</strong>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 inline" />
                  <strong className="text-emerald-700">{destinationCity || 'Toute ville'}</strong>
                  {dateParam && <span className="text-slate-400">• {dateParam}</span>}
                </span>
              ) : (
                'Tous les trajets actifs vérifiés à travers les wilayas algériennes'
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500">Trier par :</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600"
            >
              <option value="departure">Heure de départ</option>
              <option value="price">Prix le plus bas</option>
            </select>
          </div>
        </div>

        {/* Inline Quick Search Refinement */}
        <form onSubmit={handleUpdateSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5">
          <div className="lg:col-span-4 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200">
            <MapPin className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <input
              type="text"
              value={inputOrigin}
              onChange={(e) => setInputOrigin(e.target.value)}
              placeholder="Ville de départ (ex: Alger)..."
              className="w-full bg-transparent text-xs font-semibold text-slate-900 focus:outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="lg:col-span-4 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200">
            <Navigation className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <input
              type="text"
              value={inputDestination}
              onChange={(e) => setInputDestination(e.target.value)}
              placeholder="Ville d'arrivée (ex: Oran)..."
              className="w-full bg-transparent text-xs font-semibold text-slate-900 focus:outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="lg:col-span-2 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200">
            <Calendar className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <input
              type="date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
            />
          </div>

          <div className="lg:col-span-2">
            <button
              type="submit"
              className="w-full h-full py-2.5 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Actualiser</span>
            </button>
          </div>
        </form>

        {/* Filter Badges Pill Row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-emerald-700" />
            Filtres :
          </span>

          <button
            type="button"
            onClick={() => setComfortOnly(!comfortOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              comfortOnly
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-600'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${comfortOnly ? 'text-amber-300' : 'text-amber-500'}`} />
            <span>Option Confort (+30%)</span>
          </button>

          <button
            type="button"
            onClick={() => setRestStopOnly(!restStopOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              restStopOnly
                ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:border-amber-600'
            }`}
          >
            <Coffee className={`w-3.5 h-3.5 ${restStopOnly ? 'text-white' : 'text-amber-600'}`} />
            <span>Pause Naftal obligatoire (&gt; 300 km)</span>
          </button>

          {(comfortOnly || restStopOnly) && (
            <button
              type="button"
              onClick={() => {
                setComfortOnly(false);
                setRestStopOnly(false);
              }}
              className="text-xs text-slate-500 hover:text-rose-700 underline ml-2"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      </div>

      {/* 2. Results List with High Scannability */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-44 rounded-3xl bg-white border border-slate-200 p-6 animate-pulse space-y-4">
              <div className="h-4 bg-slate-100 rounded w-1/4" />
              <div className="h-8 bg-slate-100 rounded w-1/2" />
              <div className="h-4 bg-slate-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-3xl bg-rose-50 border border-rose-200 p-8 text-center text-rose-800 space-y-2">
          <p className="font-bold">{error}</p>
          <button
            onClick={() => fetchTrips()}
            className="text-xs font-bold text-emerald-700 underline"
          >
            Réessayer
          </button>
        </div>
      ) : sortedTrips.length === 0 ? (
        <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-base font-bold text-slate-900">{t('search.no_results', 'Aucun trajet correspondant')}</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {t('search.no_results_sub', 'Essayez d’élargir vos filtres de recherche ou de modifier votre date de départ.')}
            </p>
          </div>
          <button
            onClick={() => {
              setSearchParams(new URLSearchParams());
              setInputOrigin('');
              setInputDestination('');
              setInputDate('');
              setComfortOnly(false);
              setRestStopOnly(false);
            }}
            className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors shadow-xs"
          >
            <span>Voir tous les trajets disponibles</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            <span>{sortedTrips.length} trajet{sortedTrips.length > 1 ? 's' : ''} trouvé{sortedTrips.length > 1 ? 's' : ''}</span>
            <span>Prix TTC par passager (commission 15% incluse)</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {sortedTrips.map((trip) => {
              const prices = calculatePrices(trip.base_seat_price);
              const standardPrice = trip.passenger_standard_price || prices.passengerStandard;
              const comfortPrice = trip.comfort_enabled
                ? (trip.passenger_comfort_price || prices.passengerComfort)
                : null;

              const departure = new Date(trip.departure_datetime);
              const depTimeString = departure.toLocaleTimeString('fr-DZ', {
                hour: '2-digit',
                minute: '2-digit',
              });
              const depDateString = departure.toLocaleDateString('fr-DZ', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              });

              const arrival = new Date(departure.getTime() + trip.estimated_duration_minutes * 60000);
              const arrTimeString = arrival.toLocaleTimeString('fr-DZ', {
                hour: '2-digit',
                minute: '2-digit',
              });

              const durationHours = Math.floor(trip.estimated_duration_minutes / 60);
              const durationMins = trip.estimated_duration_minutes % 60;

              return (
                <div
                  key={trip.id}
                  onClick={() => navigate(`/trips/${trip.id}`)}
                  className="group cursor-pointer rounded-3xl bg-white border border-slate-200 hover:border-emerald-600 hover:shadow-lg transition-all p-5 sm:p-6 flex flex-col lg:flex-row justify-between gap-6 items-stretch lg:items-center"
                >
                  {/* Left: Travel Route Timeline */}
                  <div className="space-y-4 flex-1">
                    {/* Time & Route Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                      {/* Departure */}
                      <div className="flex sm:flex-col items-baseline sm:items-start justify-between sm:justify-start gap-1">
                        <span className="text-xl font-black text-slate-900 tabular-nums">
                          {depTimeString}
                        </span>
                        <div className="text-right sm:text-left">
                          <span className="text-sm font-bold text-slate-900 block">
                            {trip.origin_city}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium truncate max-w-[180px] block">
                            {trip.origin_address.split(',')[0]}
                          </span>
                        </div>
                      </div>

                      {/* Timeline Duration Track */}
                      <div className="hidden sm:flex flex-col items-center px-2 flex-shrink-0 min-w-[130px]">
                        <span className="text-[10px] font-bold text-slate-500 tracking-wider">
                          {durationHours}h{durationMins > 0 ? ` ${durationMins}m` : ''}
                        </span>
                        <div className="w-full flex items-center my-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-700" />
                          <div className="flex-1 h-0.5 bg-slate-200 border-t border-dashed border-emerald-600" />
                          <ArrowRight className="w-3.5 h-3.5 text-emerald-700 flex-shrink-0" />
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {trip.distance_km} km
                        </span>
                      </div>

                      {/* Arrival */}
                      <div className="flex sm:flex-col items-baseline sm:items-start justify-between sm:justify-start gap-1">
                        <span className="text-xl font-black text-slate-900 tabular-nums">
                          {arrTimeString}
                        </span>
                        <div className="text-right sm:text-left">
                          <span className="text-sm font-bold text-slate-900 block">
                            {trip.destination_city}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium truncate max-w-[180px] block">
                            {trip.destination_address.split(',')[0]}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Driver Profile & Badges Row */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={trip.driver?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${trip.driver?.full_name || 'DZ'}`}
                          alt={trip.driver?.full_name}
                          className="w-9 h-9 rounded-full border border-slate-200 object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900">
                              {trip.driver?.full_name}
                            </span>
                            <span className="text-[11px] font-semibold text-emerald-700">
                              ★ {trip.driver?.rating_avg || 4.8}
                            </span>
                          </div>
                          {trip.vehicle && (
                            <span className="text-[10px] text-slate-500 flex items-center gap-1">
                              <Car className="w-3 h-3 text-slate-400" />
                              {trip.vehicle.make} {trip.vehicle.model}
                              {trip.vehicle.air_conditioning && (
                                <span className="text-emerald-700 ml-1">• Climatisé</span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Badges for Safety & Comfort */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {trip.has_mandatory_rest && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                            <Coffee className="w-3 h-3 text-amber-600" />
                            Pause 15 min (&gt; 300 km)
                          </span>
                        )}

                        {trip.comfort_enabled && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                            <Sparkles className="w-3 h-3 text-emerald-600" />
                            Confort (+30%)
                          </span>
                        )}

                        {/* Available Seats Pill with visual dot */}
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border ${
                            trip.available_seats > 1
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : trip.available_seats === 1
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              trip.available_seats > 1
                                ? 'bg-emerald-600'
                                : trip.available_seats === 1
                                ? 'bg-amber-500'
                                : 'bg-rose-600'
                            }`}
                          />
                          <span>
                            {trip.available_seats > 0
                              ? `${trip.available_seats} place${trip.available_seats > 1 ? 's' : ''} libre${trip.available_seats > 1 ? 's' : ''}`
                              : 'Complet'}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Boarding Pass Pricing & Action */}
                  <div className="lg:border-l lg:border-slate-100 lg:pl-6 flex flex-col justify-between items-start lg:items-end gap-3 min-w-[190px]">
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                        Tarif Standard (TTC)
                      </span>
                      <div className="flex items-baseline gap-1.5 lg:justify-end">
                        <span className="text-2xl font-black text-emerald-800 tabular-nums">
                          {standardPrice} DA
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium block">
                        Base: {trip.base_seat_price} DA + 15%
                      </span>

                      {comfortPrice && (
                        <div className="mt-1 pt-1 border-t border-slate-100 text-[11px] text-slate-500 font-semibold">
                          Confort: <strong className="text-slate-900">{comfortPrice} DA</strong>
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      className="w-full lg:w-auto py-2.5 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs group-hover:shadow-md active:scale-95"
                    >
                      <span>Voir & Réserver</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
