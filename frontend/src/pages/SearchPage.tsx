import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { Trip } from '../types';
import { Search, MapPin, Calendar, Users, Coffee, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const originCity = searchParams.get('origin') || '';
  const destinationCity = searchParams.get('destination') || '';
  const dateParam = searchParams.get('date') || '';
  const [comfortOnly, setComfortOnly] = useState<boolean>(false);
  const [restStopOnly, setRestStopOnly] = useState<boolean>(false);

  useEffect(() => {
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

    fetchTrips();
  }, [originCity, destinationCity, dateParam, comfortOnly, restStopOnly]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Search Summary */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          {t('search.title')}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {originCity || destinationCity ? (
            <span>
              Résultats pour : <strong className="text-gray-800">{originCity || 'Toute ville'}</strong> $\to$ <strong className="text-gray-800">{destinationCity || 'Toute ville'}</strong>
            </span>
          ) : (
            'Tous les trajets actifs disponibles en Algérie'
          )}
        </p>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-100">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">
            <input
              type="checkbox"
              checked={comfortOnly}
              onChange={(e) => setComfortOnly(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{t('search.filter_comfort')}</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">
            <input
              type="checkbox"
              checked={restStopOnly}
              onChange={(e) => setRestStopOnly(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <Coffee className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('search.filter_rest_stop')}</span>
          </label>
        </div>
      </div>

      {/* Results List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-36 rounded-2xl bg-gray-100 animate-pulse border border-gray-200" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-rose-50 border border-rose-200 p-6 text-center text-rose-800">
          <p className="font-semibold">{error}</p>
        </div>
      ) : trips.length === 0 ? (
        <div className="rounded-2xl bg-white border border-gray-200 p-12 text-center space-y-3">
          <p className="text-lg font-bold text-gray-800">{t('search.no_results')}</p>
          <p className="text-sm text-gray-500">{t('search.no_results_sub')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {t('search.results_count', { count: trips.length })}
          </p>

          <div className="grid grid-cols-1 gap-4">
            {trips.map((trip) => {
              const standardPrice = Math.round(trip.base_seat_price * 1.15 * 100) / 100;
              const comfortPrice = trip.comfort_enabled
                ? Math.round(trip.base_seat_price * 1.45 * 100) / 100
                : null;

              const departureDate = new Date(trip.departure_datetime).toLocaleDateString('fr-DZ', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={trip.id}
                  onClick={() => navigate(`/trips/${trip.id}`)}
                  className="group cursor-pointer rounded-2xl bg-white border border-gray-200/90 hover:border-emerald-500 hover:shadow-lg transition-all p-5 sm:p-6 flex flex-col md:flex-row justify-between gap-6 items-start md:items-center"
                >
                  {/* Left: Driver and Route info */}
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <img
                        src={trip.driver?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${trip.driver?.full_name || 'DZ'}`}
                        alt={trip.driver?.full_name}
                        className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">
                          {trip.driver?.full_name}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1.5">
                          <span className="font-semibold text-emerald-700">★ {trip.driver?.rating_avg || 4.8}</span>
                          <span>({trip.driver?.trips_completed_count || 12} trajets)</span>
                          {trip.vehicle && (
                            <span className="text-gray-400">• {trip.vehicle.make} {trip.vehicle.model}</span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Route line */}
                    <div className="flex items-center gap-3 text-sm">
                      <div className="font-bold text-gray-900 text-base">{trip.origin_city}</div>
                      <ArrowRight className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <div className="font-bold text-gray-900 text-base">{trip.destination_city}</div>
                      <span className="text-xs text-gray-400">({trip.distance_km} km • {Math.round(trip.estimated_duration_minutes / 60)}h)</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" />
                        {departureDate}
                      </span>

                      {trip.has_mandatory_rest && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                          <Coffee className="w-3.5 h-3.5" />
                          Pause 15m &gt; 300km
                        </span>
                      )}

                      {trip.comfort_enabled && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                          <Sparkles className="w-3.5 h-3.5" />
                          Option Confort
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Seats & Price */}
                  <div className="text-left md:text-right flex-shrink-0 flex md:flex-col justify-between w-full md:w-auto items-center md:items-end pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">Prix passager</div>
                      <div className="text-2xl font-black text-emerald-700">
                        {standardPrice} <span className="text-sm font-semibold">DA</span>
                      </div>
                      {comfortPrice && (
                        <div className="text-[11px] text-amber-700 font-medium">
                          Confort : {comfortPrice} DA
                        </div>
                      )}
                    </div>

                    <div className="mt-2 text-xs font-semibold text-gray-600">
                      {trip.available_seats > 1 ? (
                        <span className="text-emerald-700">{trip.available_seats} places dispo</span>
                      ) : trip.available_seats === 1 ? (
                        <span className="text-amber-700">Dernière place disponible !</span>
                      ) : (
                        <span className="text-rose-600">Complet</span>
                      )}
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
