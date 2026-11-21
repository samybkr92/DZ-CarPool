import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { Trip } from '../types';
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
  Wind,
  Clock,
  Filter,
  CheckCircle2,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Refined Search & Filter Header */}
      <div className="bg-white rounded-2xl border border-[#E7E2DA] p-5 sm:p-6 shadow-subtle space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#F4EFEB]">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-ink-900 tracking-tight">
              {t('search.title', 'Trajets Disponibles')}
            </h1>
            <p className="text-xs sm:text-sm text-ink-600 mt-0.5">
              {originCity || destinationCity ? (
                <span>
                  Résultats pour <strong className="text-forest-700">{originCity || 'Toute ville'}</strong>{' '}
                  $\rightarrow${' '}
                  <strong className="text-forest-700">{destinationCity || 'Toute ville'}</strong>
                  {dateParam && <span className="text-ink-500"> • {dateParam}</span>}
                </span>
              ) : (
                'Tous les trajets actifs vérifiés à travers les wilayas algériennes'
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-ink-500">Trier par :</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1.5 px-3 rounded-lg border border-[#DED7CE] bg-[#FAF8F5] text-xs font-bold text-ink-800 focus:outline-none focus:border-forest-600"
            >
              <option value="departure">Heure de départ</option>
              <option value="price">Prix le plus bas</option>
            </select>
          </div>
        </div>

        {/* Inline Quick Search Refinement */}
        <form onSubmit={handleUpdateSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5">
          <div className="lg:col-span-4 flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA]">
            <MapPin className="w-4 h-4 text-forest-700 flex-shrink-0" />
            <input
              type="text"
              value={inputOrigin}
              onChange={(e) => setInputOrigin(e.target.value)}
              placeholder="Ville de départ..."
              className="w-full bg-transparent text-xs font-semibold text-ink-900 focus:outline-none"
            />
          </div>

          <div className="lg:col-span-4 flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA]">
            <MapPin className="w-4 h-4 text-forest-700 flex-shrink-0" />
            <input
              type="text"
              value={inputDestination}
              onChange={(e) => setInputDestination(e.target.value)}
              placeholder="Ville d'arrivée..."
              className="w-full bg-transparent text-xs font-semibold text-ink-900 focus:outline-none"
            />
          </div>

          <div className="lg:col-span-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA]">
            <Calendar className="w-4 h-4 text-forest-700 flex-shrink-0" />
            <input
              type="date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-ink-900 focus:outline-none"
            />
          </div>

          <div className="lg:col-span-2">
            <button
              type="submit"
              className="w-full h-full py-2 px-4 rounded-xl bg-forest-700 hover:bg-forest-800 text-[#FAF8F5] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Actualiser</span>
            </button>
          </div>
        </form>

        {/* Filter Badges Pill Row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <span className="text-xs font-bold text-ink-500 uppercase tracking-wide flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-forest-700" />
            Filtres :
          </span>

          <button
            type="button"
            onClick={() => setComfortOnly(!comfortOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              comfortOnly
                ? 'bg-forest-700 text-[#FAF8F5] border-forest-700 shadow-xs'
                : 'bg-white text-ink-700 border-[#DED7CE] hover:border-forest-600'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${comfortOnly ? 'text-citrus-300' : 'text-citrus-600'}`} />
            <span>Option Confort (+30%)</span>
          </button>

          <button
            type="button"
            onClick={() => setRestStopOnly(!restStopOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
              restStopOnly
                ? 'bg-citrus-600 text-white border-citrus-600 shadow-xs'
                : 'bg-white text-ink-700 border-[#DED7CE] hover:border-citrus-600'
            }`}
          >
            <Coffee className={`w-3.5 h-3.5 ${restStopOnly ? 'text-white' : 'text-citrus-600'}`} />
            <span>Pause Naftal obligatoire (&gt; 300 km)</span>
          </button>

          {(comfortOnly || restStopOnly) && (
            <button
              type="button"
              onClick={() => {
                setComfortOnly(false);
                setRestStopOnly(false);
              }}
              className="text-xs text-ink-500 hover:text-rose-700 underline ml-2"
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
            <div key={n} className="h-44 rounded-2xl bg-white border border-[#E7E2DA] p-6 animate-pulse space-y-4">
              <div className="h-4 bg-ink-100 rounded w-1/4" />
              <div className="h-8 bg-ink-100 rounded w-1/2" />
              <div className="h-4 bg-ink-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-8 text-center text-rose-800 space-y-2">
          <p className="font-bold">{error}</p>
          <button
            onClick={() => fetchTrips()}
            className="text-xs font-bold text-forest-700 underline"
          >
            Réessayer
          </button>
        </div>
      ) : sortedTrips.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#E7E2DA] p-12 text-center space-y-4 shadow-subtle">
          <div className="w-12 h-12 rounded-full bg-forest-50 border border-forest-100 text-forest-700 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-base font-bold text-ink-900">{t('search.no_results', 'Aucun trajet correspondant')}</p>
            <p className="text-xs text-ink-500 max-w-md mx-auto">
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
            className="inline-flex items-center gap-2 py-2 px-4 rounded-lg bg-forest-700 text-[#FAF8F5] text-xs font-bold hover:bg-forest-800 transition-colors"
          >
            <span>Voir tous les trajets disponibles</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-ink-500 uppercase tracking-wider px-1">
            <span>{sortedTrips.length} trajet{sortedTrips.length > 1 ? 's' : ''} trouvé{sortedTrips.length > 1 ? 's' : ''}</span>
            <span>Prix TTC par siège (commission 15% incluse)</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {sortedTrips.map((trip) => {
              const standardPrice = Math.round(trip.base_seat_price * 1.15 * 100) / 100;
              const comfortPrice = trip.comfort_enabled
                ? Math.round(trip.base_seat_price * 1.45 * 100) / 100
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

              // Estimated arrival
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
                  className="group cursor-pointer rounded-2xl bg-white border border-[#E7E2DA] hover:border-forest-600 hover:shadow-card transition-all p-5 sm:p-6 flex flex-col lg:flex-row justify-between gap-6 items-stretch lg:items-center"
                >
                  {/* Left: Travel Route Timeline */}
                  <div className="space-y-4 flex-1">
                    {/* Time & Route Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                      {/* Departure */}
                      <div className="flex sm:flex-col items-baseline sm:items-start justify-between sm:justify-start gap-1">
                        <span className="text-xl font-black text-ink-900 tabular-nums">
                          {depTimeString}
                        </span>
                        <div className="text-right sm:text-left">
                          <span className="text-sm font-bold text-ink-900 block">
                            {trip.origin_city}
                          </span>
                          <span className="text-[11px] text-ink-500 font-medium">
                            {trip.origin_address.split(',')[0]}
                          </span>
                        </div>
                      </div>

                      {/* Timeline Duration Track */}
                      <div className="hidden sm:flex flex-col items-center px-2 flex-shrink-0 min-w-[120px]">
                        <span className="text-[10px] font-bold text-ink-500 tracking-wider">
                          {durationHours}h{durationMins > 0 ? ` ${durationMins}m` : ''}
                        </span>
                        <div className="w-full flex items-center my-1">
                          <div className="w-2 h-2 rounded-full bg-forest-700" />
                          <div className="flex-1 h-0.5 bg-[#DED7CE] border-t border-dashed border-forest-600" />
                          <ArrowRight className="w-3.5 h-3.5 text-forest-700 flex-shrink-0" />
                        </div>
                        <span className="text-[10px] text-ink-400 font-medium">
                          {trip.distance_km} km
                        </span>
                      </div>

                      {/* Arrival */}
                      <div className="flex sm:flex-col items-baseline sm:items-start justify-between sm:justify-start gap-1">
                        <span className="text-xl font-black text-ink-900 tabular-nums">
                          {arrTimeString}
                        </span>
                        <div className="text-right sm:text-left">
                          <span className="text-sm font-bold text-ink-900 block">
                            {trip.destination_city}
                          </span>
                          <span className="text-[11px] text-ink-500 font-medium">
                            {trip.destination_address.split(',')[0]}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Driver Profile & Badges Row */}
                    <div className="pt-3 border-t border-[#F4EFEB] flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={trip.driver?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${trip.driver?.full_name || 'DZ'}`}
                          alt={trip.driver?.full_name}
                          className="w-8 h-8 rounded-full border border-[#DED7CE] object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-ink-900">
                              {trip.driver?.full_name}
                            </span>
                            <span className="text-[11px] font-semibold text-forest-700">
                              ★ {trip.driver?.rating_avg || 4.8}
                            </span>
                          </div>
                          {trip.vehicle && (
                            <span className="text-[10px] text-ink-500 flex items-center gap-1">
                              <Car className="w-3 h-3 text-ink-400" />
                              {trip.vehicle.make} {trip.vehicle.model}
                              {trip.vehicle.air_conditioning && (
                                <span className="text-forest-700 ml-1">• Climatisé</span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Badges for Safety & Comfort */}
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FAF8F5] border border-[#E7E2DA] text-[11px] font-medium text-ink-700">
                          <Calendar className="w-3 h-3 text-forest-700" />
                          {depDateString}
                        </span>

                        {trip.has_mandatory_rest && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FFFDF5] text-citrus-800 text-[11px] font-bold border border-citrus-200">
                            <Coffee className="w-3 h-3 text-citrus-600" />
                            Pause 15 min &gt; 300km
                          </span>
                        )}

                        {trip.comfort_enabled && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-forest-50 text-forest-800 text-[11px] font-bold border border-forest-200/70">
                            <Sparkles className="w-3 h-3 text-forest-700" />
                            Confort disponible
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Seat Availability, Price & CTA */}
                  <div className="lg:w-48 flex-shrink-0 flex lg:flex-col justify-between items-end border-t lg:border-t-0 lg:border-l border-[#F4EFEB] lg:pl-6 pt-4 lg:pt-0">
                    <div className="space-y-1 text-left lg:text-right">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-500 block">
                        Prix par passager
                      </span>
                      <div className="text-2xl font-black text-forest-700 tabular-nums">
                        {standardPrice.toLocaleString('fr-DZ', { minimumFractionDigits: 0 })}
                        <span className="text-xs font-bold text-forest-800 ml-1">DA</span>
                      </div>
                      {comfortPrice && (
                        <span className="text-[11px] font-semibold text-citrus-700 block">
                          Confort : {comfortPrice.toLocaleString('fr-DZ', { minimumFractionDigits: 0 })} DA
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 text-right">
                      <div className="text-xs font-bold">
                        {trip.available_seats > 1 ? (
                          <span className="text-forest-700">{trip.available_seats} places libres</span>
                        ) : trip.available_seats === 1 ? (
                          <span className="text-citrus-700 font-extrabold">Dernière place disponible !</span>
                        ) : (
                          <span className="text-rose-600">Complet</span>
                        )}
                      </div>

                      <button
                        type="button"
                        className="py-2 px-4 rounded-xl bg-forest-700 group-hover:bg-forest-800 text-[#FAF8F5] text-xs font-bold transition-all shadow-subtle group-hover:shadow-card flex items-center gap-1.5"
                      >
                        <span>Voir le trajet</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
