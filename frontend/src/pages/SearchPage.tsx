import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { Trip } from '../types';
import {
  Search,
  MapPin,
  Calendar,
  Coffee,
  Sparkles,
  ArrowRight,
  Car,
  Filter,
  Clock,
  ShieldCheck,
  ChevronRight,
  Star,
  Users,
  Check,
} from 'lucide-react';

export const SearchPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Search inputs
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-left">
      {/* 1. Quick Search Bar & Filters */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-soft-sm space-y-5">
        <form onSubmit={handleUpdateSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <MapPin className="w-4 h-4 text-brand-600 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={inputOrigin}
              onChange={(e) => setInputOrigin(e.target.value)}
              placeholder="Ville de départ"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-brand-600"
            />
          </div>

          <div className="relative">
            <MapPin className="w-4 h-4 text-rose-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={inputDestination}
              onChange={(e) => setInputDestination(e.target.value)}
              placeholder="Ville d'arrivée"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-brand-600"
            />
          </div>

          <div className="relative">
            <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:border-brand-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-soft-xs transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Mettre à jour la recherche</span>
          </button>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-semibold mr-1">Filtres :</span>
            <button
              type="button"
              onClick={() => setComfortOnly(!comfortOnly)}
              className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all flex items-center gap-1.5 ${
                comfortOnly
                  ? 'bg-purple-50 text-purple-800 border-purple-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Trajet Confort (+30%)</span>
            </button>

            <button
              type="button"
              onClick={() => setRestStopOnly(!restStopOnly)}
              className={`px-3 py-1.5 rounded-full border text-xs font-bold transition-all flex items-center gap-1.5 ${
                restStopOnly
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Coffee className="w-3.5 h-3.5 text-amber-600" />
              <span>Avec Pause Naftal (&gt;300km)</span>
            </button>
          </div>

          {/* Sort By Selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Trier par :</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-700 focus:outline-none"
            >
              <option value="departure">Heure de départ</option>
              <option value="price">Prix croissant</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Results Count */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-base font-black text-slate-900">
          {sortedTrips.length} trajet{sortedTrips.length > 1 ? 's' : ''} disponible{sortedTrips.length > 1 ? 's' : ''}
        </h2>
        {(originCity || destinationCity) && (
          <span className="text-xs text-slate-500">
            {originCity || 'Toute wilaya'} ➔ {destinationCity || 'Toute wilaya'}
          </span>
        )}
      </div>

      {/* 3. Trip Feed / List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-44 rounded-3xl bg-white border border-slate-200 animate-pulse p-6" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center text-rose-800 text-xs font-bold">
          {error}
        </div>
      ) : sortedTrips.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-soft-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <Car className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Aucun trajet trouvé pour ces critères</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            Essayez d'élargir votre recherche, de changer de date ou de réinitialiser les filtres pour voir les départs sur d'autres axes.
          </p>
          <button
            onClick={() => {
              setInputOrigin('');
              setInputDestination('');
              setInputDate('');
              setComfortOnly(false);
              setRestStopOnly(false);
              setSearchParams(new URLSearchParams());
            }}
            className="px-5 py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedTrips.map((trip) => {
            const depDate = new Date(trip.departure_datetime);
            const depTimeStr = depDate.toLocaleTimeString('fr-DZ', { hour: '2-digit', minute: '2-digit' });
            const depDateStr = depDate.toLocaleDateString('fr-DZ', { weekday: 'short', day: 'numeric', month: 'short' });

            const hours = Math.floor(trip.estimated_duration_minutes / 60);
            const minutes = trip.estimated_duration_minutes % 60;
            const durationStr = `${hours}h ${minutes > 0 ? minutes + 'm' : ''}`;

            return (
              <div
                key={trip.id}
                onClick={() => navigate(`/trips/${trip.id}`)}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft-sm hover:shadow-soft-md hover:border-brand-300 transition-all cursor-pointer space-y-5"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Timeline & Route Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-black text-slate-900">{depTimeStr}</span>
                      <span className="text-xs text-slate-400 font-semibold">• {depDateStr}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-brand-600" />
                        <div className="w-0.5 h-7 bg-slate-200 my-0.5" />
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      </div>
                      <div className="space-y-3 flex-1">
                        <div>
                          <span className="text-sm font-black text-slate-900 block">{trip.origin_city}</span>
                          <span className="text-[11px] text-slate-400 block">{trip.origin_address}</span>
                        </div>
                        <div>
                          <span className="text-sm font-black text-slate-900 block">{trip.destination_city}</span>
                          <span className="text-[11px] text-slate-400 block">{trip.destination_address}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Route Specs & Price Column */}
                  <div className="flex md:flex-col justify-between md:items-end items-center pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <div className="text-2xl font-black text-brand-600 tabular-nums">
                        {(trip.passenger_standard_price ?? Math.round(trip.base_seat_price * 1.15)).toLocaleString('fr-DZ')} DA
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">TTC tout inclus / place</span>
                      <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                        Base conducteur : {trip.base_seat_price} DA
                      </div>
                    </div>

                    <div className="mt-2 text-right">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                        <Users className="w-3.5 h-3.5 text-slate-600" />
                        <span>{trip.available_seats} place{trip.available_seats > 1 ? 's' : ''} libre{trip.available_seats > 1 ? 's' : ''}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Badges Bar & Driver Footer */}
                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {trip.has_mandatory_rest && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <Coffee className="w-3.5 h-3.5 text-amber-600" />
                        <span>Pause Naftal 15 min ({trip.distance_km} km)</span>
                      </span>
                    )}

                    {trip.comfort_enabled && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <span>Confort (+30%)</span>
                      </span>
                    )}

                    <span className="text-xs text-slate-400">
                      {trip.distance_km} km • {durationStr}
                    </span>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <div className="flex items-center gap-2 text-xs">
                      <img
                        src={trip.driver?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${trip.driver?.full_name}`}
                        alt={trip.driver?.full_name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                      <span className="font-bold text-slate-800">{trip.driver?.full_name}</span>
                      <span className="flex items-center gap-0.5 text-amber-600 font-bold">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{trip.driver?.rating_avg || 4.8}</span>
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:underline">
                      <span>Détails</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};