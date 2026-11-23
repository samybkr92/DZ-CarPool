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
      <div className="bg-white rounded-xl border border-[#E6E0D6] p-5 shadow-card space-y-4">
        <form onSubmit={handleUpdateSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <MapPin className="w-4 h-4 text-[#173C2C] absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={inputOrigin}
              onChange={(e) => setInputOrigin(e.target.value)}
              placeholder="Ville de départ"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E6E0D6] bg-[#FAF8F5] text-xs font-bold text-[#141613] focus:bg-white focus:outline-none focus:border-[#173C2C]"
            />
          </div>

          <div className="relative">
            <MapPin className="w-4 h-4 text-rose-600 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={inputDestination}
              onChange={(e) => setInputDestination(e.target.value)}
              placeholder="Ville d'arrivée"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E6E0D6] bg-[#FAF8F5] text-xs font-bold text-[#141613] focus:bg-white focus:outline-none focus:border-[#173C2C]"
            />
          </div>

          <div className="relative">
            <Calendar className="w-4 h-4 text-[#8E9389] absolute left-3.5 top-3.5" />
            <input
              type="date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E6E0D6] bg-[#FAF8F5] text-xs font-bold text-[#141613] focus:bg-white focus:outline-none focus:border-[#173C2C]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-5 rounded-lg bg-[#173C2C] hover:bg-[#112E22] text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Mettre à jour</span>
          </button>
        </form>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F3EFE8] text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#8E9389] font-medium mr-1">Filtres :</span>
            <button
              type="button"
              onClick={() => setComfortOnly(!comfortOnly)}
              className={`px-3 py-1.5 rounded-md border text-xs font-bold transition-all flex items-center gap-1.5 ${
                comfortOnly
                  ? 'bg-[#F3E8FF] text-[#6B21A8] border-[#E9D5FF]'
                  : 'bg-white text-[#5C6057] border-[#E6E0D6] hover:bg-[#FAF8F5]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#6B21A8]" />
              <span>Trajet Confort (+30%)</span>
            </button>

            <button
              type="button"
              onClick={() => setRestStopOnly(!restStopOnly)}
              className={`px-3 py-1.5 rounded-md border text-xs font-bold transition-all flex items-center gap-1.5 ${
                restStopOnly
                  ? 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'
                  : 'bg-white text-[#5C6057] border-[#E6E0D6] hover:bg-[#FAF8F5]'
              }`}
            >
              <Coffee className="w-3.5 h-3.5 text-[#92400E]" />
              <span>Halte Naftal (&gt;300km)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#8E9389]">Trier par :</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-[#E6E0D6] rounded-md px-2.5 py-1 text-xs font-bold text-[#141613] focus:outline-none cursor-pointer"
            >
              <option value="departure">Heure de départ</option>
              <option value="price">Prix croissant</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Results Header */}
      {!loading && (
        <div className="flex items-center justify-between px-1">
          <h2 className="text-base font-extrabold text-[#141613]">
            {sortedTrips.length} trajet{sortedTrips.length > 1 ? 's' : ''} disponible{sortedTrips.length > 1 ? 's' : ''}
          </h2>
          {(originCity || destinationCity) && (
            <span className="text-xs text-[#5C6057]">
              {originCity || 'Toutes wilayas'} ➔ {destinationCity || 'Toutes wilayas'}
            </span>
          )}
        </div>
      )}

      {/* 3. Trip Feed / List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-xl border border-[#E6E0D6] p-6 shadow-card animate-pulse space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <div className="h-5 w-40 bg-[#F3EFE8] rounded" />
                  <div className="h-3 w-60 bg-[#F3EFE8] rounded" />
                </div>
                <div className="h-8 w-24 bg-[#F3EFE8] rounded" />
              </div>
              <div className="h-4 w-full bg-[#FAF8F5] rounded" />
              <div className="flex justify-between items-center pt-2 border-t border-[#F3EFE8]">
                <div className="h-6 w-32 bg-[#F3EFE8] rounded" />
                <div className="h-6 w-28 bg-[#F3EFE8] rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 text-center text-rose-800 text-xs font-bold">
          {error}
        </div>
      ) : sortedTrips.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E6E0D6] p-12 text-center space-y-4 shadow-card">
          <div className="w-12 h-12 rounded-lg bg-[#FAF8F5] border border-[#E6E0D6] flex items-center justify-center text-[#8E9389] mx-auto">
            <Car className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#141613]">Aucun trajet trouvé pour ces critères</h3>
          <p className="text-xs text-[#5C6057] max-w-md mx-auto leading-relaxed">
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
            className="px-5 py-2.5 rounded-lg bg-[#173C2C] text-white font-bold text-xs hover:bg-[#112E22] transition-colors"
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
                className="group bg-white rounded-xl border border-[#E6E0D6] p-5 sm:p-6 shadow-card hover:shadow-elevated hover:border-[#173C2C] transition-all cursor-pointer space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Timeline & Route Details */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-black text-[#141613]">{depTimeStr}</span>
                      <span className="text-xs text-[#8E9389] font-semibold">• {depDateStr}</span>
                      <span className="text-xs text-[#5C6057]">({durationStr} • {trip.distance_km} km)</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#173C2C]" />
                        <div className="w-0.5 h-6 bg-[#E6E0D6] my-0.5" />
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                      </div>

                      <div className="space-y-1.5 flex-1">
                        <div>
                          <span className="text-sm font-bold text-[#141613] block">{trip.origin_city}</span>
                          <span className="text-[11px] text-[#8E9389] block">{trip.origin_address}</span>
                        </div>
                        <div>
                          <span className="text-sm font-bold text-[#141613] block">{trip.destination_city}</span>
                          <span className="text-[11px] text-[#8E9389] block">{trip.destination_address}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Route Specs & Price Column */}
                  <div className="flex md:flex-col justify-between md:items-end items-center pt-3 md:pt-0 border-t md:border-t-0 border-[#F3EFE8]">
                    <div className="text-left md:text-right">
                      <div className="text-2xl font-black text-[#173C2C] tabular-nums">
                        {passengerTotal.toLocaleString('fr-DZ')} DA
                      </div>
                      <span className="text-[10px] text-[#8E9389] font-medium block">TTC tout inclus / place</span>
                      <div className="text-[11px] text-[#5C6057] font-medium mt-0.5">
                        Base conducteur : {trip.base_seat_price} DA
                      </div>
                    </div>

                    <div className="mt-2 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-[#FAF8F5] border border-[#E6E0D6] text-[#32362F]">
                        <Users className="w-3.5 h-3.5 text-[#5C6057]" />
                        <span>{trip.available_seats} place{trip.available_seats > 1 ? 's' : ''} libre{trip.available_seats > 1 ? 's' : ''}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer: Driver, Vehicle & Badges */}
                <div className="pt-3 border-t border-[#F3EFE8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-4">
                    {/* Driver Profile */}
                    <div className="flex items-center gap-2">
                      <img
                        src={trip.driver?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${trip.driver?.full_name || 'Amine'}`}
                        alt={trip.driver?.full_name || 'Conducteur'}
                        className="w-7 h-7 rounded-full object-cover border border-[#E6E0D6]"
                      />
                      <div>
                        <span className="font-bold text-[#141613] block leading-tight">
                          {trip.driver?.full_name || 'Conducteur'}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-[#8E9389]">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span className="font-bold text-[#141613]">{trip.driver?.rating_avg || 4.9}</span>
                          <span>({trip.driver?.rating_count || 12} avis)</span>
                        </div>
                      </div>
                    </div>

                    {/* Vehicle */}
                    {trip.vehicle && (
                      <span className="text-[#8E9389] hidden sm:inline-flex items-center gap-1">
                        <Car className="w-3.5 h-3.5" />
                        <span>{trip.vehicle.make} {trip.vehicle.model} ({trip.vehicle.color})</span>
                      </span>
                    )}
                  </div>

                  {/* Badges & Action Link */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center gap-2">
                      {trip.has_mandatory_rest && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                          <Coffee className="w-3 h-3 text-[#92400E]" />
                          <span>Pause Naftal 15 min</span>
                        </span>
                      )}

                      {trip.comfort_enabled && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F3E8FF] text-[#6B21A8] border border-[#E9D5FF]">
                          <Sparkles className="w-3 h-3 text-[#6B21A8]" />
                          <span>Option Confort (+30%)</span>
                        </span>
                      )}
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#173C2C] text-white font-bold text-xs group-hover:bg-[#112E22] transition-colors shadow-subtle">
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
