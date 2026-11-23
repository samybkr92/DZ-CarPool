import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
  ChevronRight,
  Star,
  Users,
  ShieldCheck,
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
      <div className="bg-[#131D2E] rounded-xl border border-[#1E2C42] p-5 shadow-xl space-y-4">
        <form onSubmit={handleUpdateSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <MapPin className="w-4 h-4 text-[#3B82F6] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={inputOrigin}
              onChange={(e) => setInputOrigin(e.target.value)}
              placeholder="Ville de départ"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#1E2C42] bg-[#0E1624] text-xs font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>

          <div className="relative">
            <MapPin className="w-4 h-4 text-rose-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={inputDestination}
              onChange={(e) => setInputDestination(e.target.value)}
              placeholder="Ville d'arrivée"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#1E2C42] bg-[#0E1624] text-xs font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>

          <div className="relative">
            <Calendar className="w-4 h-4 text-[#3B82F6] absolute left-3.5 top-3.5" />
            <input
              type="date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#1E2C42] bg-[#0E1624] text-xs font-bold text-white focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Mettre à jour</span>
          </button>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1E2C42] text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-medium mr-1">Filtres :</span>
            <button
              type="button"
              onClick={() => setComfortOnly(!comfortOnly)}
              className={`px-3 py-1.5 rounded-md border text-xs font-bold transition-all flex items-center gap-1.5 ${
                comfortOnly
                  ? 'bg-purple-950/80 text-purple-300 border-purple-500/50'
                  : 'bg-[#0E1624] text-slate-300 border-[#1E2C42] hover:border-slate-500'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Trajet Confort (+30%)</span>
            </button>

            <button
              type="button"
              onClick={() => setRestStopOnly(!restStopOnly)}
              className={`px-3 py-1.5 rounded-md border text-xs font-bold transition-all flex items-center gap-1.5 ${
                restStopOnly
                  ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                  : 'bg-[#0E1624] text-slate-300 border-[#1E2C42] hover:border-slate-500'
              }`}
            >
              <Coffee className="w-3.5 h-3.5 text-amber-400" />
              <span>Halte Naftal (&gt;300km)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400">Trier par :</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#0E1624] border border-[#1E2C42] rounded-md px-2.5 py-1 text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              <option value="departure" className="bg-[#131D2E] text-white">Heure de départ</option>
              <option value="price" className="bg-[#131D2E] text-white">Prix croissant</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Results Header */}
      {!loading && (
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-extrabold text-white">
            {sortedTrips.length} trajet{sortedTrips.length > 1 ? 's' : ''} disponible{sortedTrips.length > 1 ? 's' : ''}
          </h2>
          {(originCity || destinationCity) && (
            <span className="text-xs text-slate-400">
              {originCity || 'Toutes wilayas'} ➔ {destinationCity || 'Toutes wilayas'}
            </span>
          )}
        </div>
      )}

      {/* 3. Trip Feed / List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-[#131D2E] rounded-xl border border-[#1E2C42] p-6 shadow-xl animate-pulse space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-5 w-40 bg-[#18253A] rounded" />
                  <div className="h-3 w-60 bg-[#18253A] rounded" />
                </div>
                <div className="h-8 w-24 bg-[#18253A] rounded" />
              </div>
              <div className="h-4 w-full bg-[#18253A] rounded" />
              <div className="flex justify-between items-center pt-2 border-t border-[#1E2C42]">
                <div className="h-6 w-32 bg-[#18253A] rounded" />
                <div className="h-6 w-28 bg-[#18253A] rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-rose-950/60 border border-rose-800 rounded-xl p-6 text-center text-rose-300 text-xs font-bold">
          {error}
        </div>
      ) : sortedTrips.length === 0 ? (
        <div className="bg-[#131D2E] rounded-xl border border-[#1E2C42] p-12 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-lg bg-[#0E1624] border border-[#1E2C42] flex items-center justify-center text-slate-400 mx-auto">
            <Car className="w-6 h-6 text-[#3B82F6]" />
          </div>
          <h3 className="text-base font-bold text-white">Aucun trajet trouvé pour ces critères</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Essayez d'élargir votre recherche, de changer de date ou de réinitialiser les filtres pour consulter les départs sur d'autres axes.
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
            className="px-5 py-2.5 rounded-lg bg-[#2563EB] text-white font-bold text-xs hover:bg-[#1D4ED8] transition-colors shadow-md shadow-blue-600/30"
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

            const passengerTotal = trip.passenger_standard_price ?? Math.round(trip.base_seat_price * 1.15);

            return (
              <div
                key={trip.id}
                onClick={() => navigate(`/trips/${trip.id}`)}
                className="group bg-[#131D2E] rounded-xl border border-[#1E2C42] p-5 sm:p-6 shadow-xl hover:border-[#2563EB] hover:bg-[#18253A] transition-all cursor-pointer space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Timeline & Route Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-black text-white">{depTimeStr}</span>
                      <span className="text-xs text-slate-400 font-semibold">• {depDateStr}</span>
                      <span className="text-xs text-slate-400">({durationStr} • {trip.distance_km} km)</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                        <div className="w-0.5 h-6 bg-[#1E2C42] my-0.5" />
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                      </div>

                      <div className="space-y-1.5 flex-1">
                        <div>
                          <span className="text-sm font-bold text-white block">{trip.origin_city}</span>
                          <span className="text-[11px] text-slate-400 block">{trip.origin_address}</span>
                        </div>
                        <div>
                          <span className="text-sm font-bold text-white block">{trip.destination_city}</span>
                          <span className="text-[11px] text-slate-400 block">{trip.destination_address}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Route Specs & Price Column */}
                  <div className="flex md:flex-col justify-between md:items-end items-center pt-3 md:pt-0 border-t md:border-t-0 border-[#1E2C42]">
                    <div className="text-left md:text-right">
                      <div className="text-2xl font-black text-[#60A5FA] tabular-nums">
                        {passengerTotal.toLocaleString('fr-DZ')} DA
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium block">TTC tout inclus / place</span>
                      <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                        Base conducteur : {trip.base_seat_price} DA
                      </div>
                    </div>

                    <div className="mt-2 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-[#0E1624] border border-[#1E2C42] text-slate-300">
                        <Users className="w-3.5 h-3.5 text-[#3B82F6]" />
                        <span>{trip.available_seats} place{trip.available_seats > 1 ? 's' : ''} libre{trip.available_seats > 1 ? 's' : ''}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Driver, Vehicle & Badges */}
                <div className="pt-3 border-t border-[#1E2C42] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-4">
                    {/* Driver Profile */}
                    <div className="flex items-center gap-2">
                      <img
                        src={trip.driver?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${trip.driver?.full_name || 'Amine'}`}
                        alt={trip.driver?.full_name || 'Conducteur'}
                        className="w-7 h-7 rounded-full object-cover border border-[#2563EB]/40"
                      />
                      <div>
                        <span className="font-bold text-white block leading-tight">
                          {trip.driver?.full_name || 'Conducteur'}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="font-bold text-white">{trip.driver?.rating_avg || 4.9}</span>
                          <span>({trip.driver?.rating_count || 12} avis)</span>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle */}
                    {trip.vehicle && (
                      <span className="text-slate-400 hidden sm:inline-flex items-center gap-1">
                        <Car className="w-3.5 h-3.5 text-[#3B82F6]" />
                        <span>{trip.vehicle.make} {trip.vehicle.model} ({trip.vehicle.color})</span>
                      </span>
                    )}
                  </div>

                  {/* Badges & Action Link */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center gap-2">
                      {trip.has_mandatory_rest && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-950/60 text-amber-400 border border-amber-500/30">
                          <Coffee className="w-3 h-3 text-amber-400" />
                          <span>Pause Naftal 15 min</span>
                        </span>
                      )}

                      {trip.comfort_enabled && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-950/60 text-purple-400 border border-purple-500/30">
                          <Sparkles className="w-3 h-3 text-purple-400" />
                          <span>Option Confort (+30%)</span>
                        </span>
                      )}
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] text-white font-bold text-xs group-hover:bg-[#1D4ED8] transition-colors shadow-md shadow-blue-600/30">
                      <span>Réserver</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
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
