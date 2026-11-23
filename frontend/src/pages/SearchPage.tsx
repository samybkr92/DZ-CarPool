import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { Trip } from '../types';
import { calculatePrices } from '../utils/algeriaData';
import {
  Search,
  MapPin,
  Calendar,
  Coffee,
  Sparkles,
  ArrowRight,
  Car,
  Filter,
  Navigation,
  Clock,
  ShieldCheck,
  ChevronRight,
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
      <div className="bg-white rounded-2xl border border-[#EAE5DC] p-5 sm:p-6 shadow-fine space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#F4EFE6]">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#141716] tracking-tight">
              {t('search.title', 'Trajets Disponibles')}
            </h1>
            <p className="text-xs text-[#5A625D] mt-1 flex items-center gap-2">
              {originCity || destinationCity ? (
                <span className="flex items-center gap-1.5 flex-wrap">
                  Résultats pour <strong className="text-[#16382C]">{originCity || 'Toute wilaya'}</strong>
                  <ArrowRight className="w-3.5 h-3.5 text-[#ADB3AF] inline" />
                  <strong className="text-[#16382C]">{destinationCity || 'Toute wilaya'}</strong>
                  {dateParam && <span className="text-[#7E8681]">• {dateParam}</span>}
                </span>
              ) : (
                'Trajets réguliers inter-wilayas vérifiés en Dinars Algériens (DZD)'
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-[#7E8681]">Trier par :</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-1.5 px-3 rounded-lg border border-[#EAE5DC] bg-[#FAF7F2] text-xs font-semibold text-[#141716] focus:outline-none focus:border-[#16382C]"
            >
              <option value="departure">Heure de départ</option>
              <option value="price">Prix le plus bas</option>
            </select>
          </div>
        </div>

        {/* Inline Quick Search Refinement */}
        <form onSubmit={handleUpdateSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2">
          <div className="lg:col-span-4 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC]">
            <MapPin className="w-4 h-4 text-[#16382C] flex-shrink-0" />
            <input
              type="text"
              value={inputOrigin}
              onChange={(e) => setInputOrigin(e.target.value)}
              placeholder="Ville de départ (ex: Alger)..."
              className="w-full bg-transparent text-xs font-semibold text-[#141716] focus:outline-none placeholder:text-[#ADB3AF]"
            />
          </div>

          <div className="lg:col-span-4 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC]">
            <Navigation className="w-4 h-4 text-[#16382C] flex-shrink-0" />
            <input
              type="text"
              value={inputDestination}
              onChange={(e) => setInputDestination(e.target.value)}
              placeholder="Ville d'arrivée (ex: Oran)..."
              className="w-full bg-transparent text-xs font-semibold text-[#141716] focus:outline-none placeholder:text-[#ADB3AF]"
            />
          </div>

          <div className="lg:col-span-2 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC]">
            <Calendar className="w-4 h-4 text-[#16382C] flex-shrink-0" />
            <input
              type="date"
              value={inputDate}
              onChange={(e) => setInputDate(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-[#141716] focus:outline-none cursor-pointer"
            />
          </div>

          <div className="lg:col-span-2">
            <button
              type="submit"
              className="w-full h-full py-2.5 px-4 rounded-xl bg-[#16382C] hover:bg-[#0F281F] text-[#FAF7F2] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-fine active:scale-[0.98]"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Actualiser</span>
            </button>
          </div>
        </form>

        {/* Filter Badges Pill Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="font-bold text-[#7E8681] uppercase tracking-wider text-[10px] flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3 text-[#16382C]" />
            Filtres :
          </span>

          <button
            type="button"
            onClick={() => setComfortOnly(!comfortOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              comfortOnly
                ? 'bg-[#16382C] text-[#FAF7F2] border-[#16382C] shadow-fine'
                : 'bg-white text-[#303632] border-[#EAE5DC] hover:border-[#16382C]'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${comfortOnly ? 'text-[#FAF7F2]' : 'text-[#D96B27]'}`} />
            <span>Option Confort (+30%)</span>
          </button>

          <button
            type="button"
            onClick={() => setRestStopOnly(!restStopOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              restStopOnly
                ? 'bg-[#A14114] text-[#FAF7F2] border-[#A14114] shadow-fine'
                : 'bg-white text-[#303632] border-[#EAE5DC] hover:border-[#A14114]'
            }`}
          >
            <Coffee className={`w-3.5 h-3.5 ${restStopOnly ? 'text-[#FAF7F2]' : 'text-[#A14114]'}`} />
            <span>Pause Naftal obligatoire (&gt; 300 km)</span>
          </button>

          {(comfortOnly || restStopOnly) && (
            <button
              type="button"
              onClick={() => {
                setComfortOnly(false);
                setRestStopOnly(false);
              }}
              className="text-xs text-[#A14114] hover:underline ml-2"
            >
              Effacer les filtres
            </button>
          )}
        </div>
      </div>

      {/* 2. Scannable Ticket Ledger */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-40 rounded-2xl bg-white border border-[#EAE5DC] p-6 animate-pulse space-y-4">
              <div className="h-4 bg-[#F4EFE6] rounded w-1/4" />
              <div className="h-8 bg-[#F4EFE6] rounded w-1/2" />
              <div className="h-4 bg-[#F4EFE6] rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl bg-[#FCF7F3] border border-[#F0D5C3] p-8 text-center text-[#A14114] space-y-2">
          <p className="font-bold">{error}</p>
          <button
            onClick={() => fetchTrips()}
            className="text-xs font-bold text-[#16382C] underline"
          >
            Réessayer
          </button>
        </div>
      ) : sortedTrips.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#EAE5DC] p-12 text-center space-y-4 shadow-fine">
          <div className="w-12 h-12 rounded-lg bg-[#E2EDE6] text-[#16382C] flex items-center justify-center mx-auto border border-[#C4DBCD]">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-base font-bold text-[#141716]">{t('search.no_results', 'Aucun trajet correspondant')}</p>
            <p className="text-xs text-[#5A625D] max-w-md mx-auto">
              {t('search.no_results_sub', 'Essayez d’élargir vos filtres ou de sélectionner une autre date.')}
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
            className="inline-flex items-center gap-2 py-2.5 px-5 rounded-lg bg-[#16382C] text-[#FAF7F2] text-xs font-bold hover:bg-[#0F281F] transition-colors shadow-fine"
          >
            <span>Voir tous les trajets disponibles</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-[#7E8681] px-1">
            <span>{sortedTrips.length} trajet{sortedTrips.length > 1 ? 's' : ''} disponible{sortedTrips.length > 1 ? 's' : ''}</span>
            <span>Prix TTC par siège (commission plateforme 15% incluse)</span>
          </div>

          <div className="grid grid-cols-1 gap-3.5">
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
                  className="group cursor-pointer rounded-2xl bg-white border border-[#EAE5DC] hover:border-[#16382C] hover:shadow-card transition-all p-5 sm:p-6 flex flex-col lg:flex-row justify-between gap-6 items-stretch lg:items-center"
                >
                  {/* Left: Route Timeline & Stations */}
                  <div className="space-y-4 flex-1">
                    {/* Time & Route */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                      {/* Departure */}
                      <div className="flex sm:flex-col items-baseline sm:items-start justify-between sm:justify-start gap-0.5">
                        <span className="text-xl font-extrabold text-[#141716] tabular-nums">
                          {depTimeString}
                        </span>
                        <div className="text-right sm:text-left">
                          <span className="text-xs sm:text-sm font-bold text-[#141716] block">
                            {trip.origin_city}
                          </span>
                          <span className="text-[11px] text-[#7E8681] truncate max-w-[200px] block">
                            {trip.origin_address.split(',')[0]}
                          </span>
                        </div>
                      </div>

                      {/* Timeline Duration Track */}
                      <div className="hidden sm:flex flex-col items-center px-2 flex-shrink-0 min-w-[140px]">
                        <span className="text-[10px] font-semibold text-[#7E8681]">
                          {durationHours}h{durationMins > 0 ? ` ${durationMins}m` : ''}
                        </span>
                        <div className="w-full flex items-center my-1.5">
                          <div className="w-2 h-2 rounded-full bg-[#16382C]" />
                          <div className="flex-1 h-0.5 bg-[#EAE5DC] border-t border-dashed border-[#16382C]" />
                          <ArrowRight className="w-3.5 h-3.5 text-[#16382C] flex-shrink-0" />
                        </div>
                        <span className="text-[10px] text-[#ADB3AF]">
                          {trip.distance_km} km
                        </span>
                      </div>

                      {/* Arrival */}
                      <div className="flex sm:flex-col items-baseline sm:items-start justify-between sm:justify-start gap-0.5">
                        <span className="text-xl font-extrabold text-[#141716] tabular-nums">
                          {arrTimeString}
                        </span>
                        <div className="text-right sm:text-left">
                          <span className="text-xs sm:text-sm font-bold text-[#141716] block">
                            {trip.destination_city}
                          </span>
                          <span className="text-[11px] text-[#7E8681] truncate max-w-[200px] block">
                            {trip.destination_address.split(',')[0]}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Driver Profile & Badges Row */}
                    <div className="pt-3 border-t border-[#F4EFE6] flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={trip.driver?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${trip.driver?.full_name || 'DZ'}`}
                          alt={trip.driver?.full_name}
                          className="w-8 h-8 rounded-full border border-[#EAE5DC] object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-[#141716]">
                              {trip.driver?.full_name}
                            </span>
                            <span className="text-[11px] font-semibold text-[#16382C]">
                              ★ {trip.driver?.rating_avg || 4.8}
                            </span>
                          </div>
                          {trip.vehicle && (
                            <span className="text-[10px] text-[#7E8681] flex items-center gap-1">
                              <Car className="w-3 h-3 text-[#ADB3AF]" />
                              {trip.vehicle.make} {trip.vehicle.model}
                              {trip.vehicle.air_conditioning && (
                                <span className="text-[#16382C] ml-1">• Climatisé</span>
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Safety & Comfort Badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {trip.has_mandatory_rest && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#A14114] bg-[#F8ECE3] px-2 py-0.5 rounded border border-[#F0D5C3]">
                            <Coffee className="w-3 h-3" />
                            Pause 15 min (&gt; 300 km)
                          </span>
                        )}

                        {trip.comfort_enabled && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#16382C] bg-[#E2EDE6] px-2 py-0.5 rounded border border-[#C4DBCD]">
                            <Sparkles className="w-3 h-3" />
                            Confort (+30%)
                          </span>
                        )}

                        {/* Available Seats Pill */}
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded border ${
                            trip.available_seats > 1
                              ? 'bg-[#E2EDE6] text-[#16382C] border-[#C4DBCD]'
                              : trip.available_seats === 1
                              ? 'bg-[#F8ECE3] text-[#A14114] border-[#F0D5C3]'
                              : 'bg-[#FCF7F3] text-[#A14114] border-[#F0D5C3]'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              trip.available_seats > 1
                                ? 'bg-[#16382C]'
                                : trip.available_seats === 1
                                ? 'bg-[#D96B27]'
                                : 'bg-[#A14114]'
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
                  <div className="lg:border-l lg:border-[#F4EFE6] lg:pl-6 flex flex-col justify-between items-start lg:items-end gap-3 min-w-[190px]">
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] text-[#7E8681] font-semibold uppercase tracking-wider block">
                        Tarif Standard (TTC)
                      </span>
                      <div className="flex items-baseline gap-1 lg:justify-end">
                        <span className="text-2xl font-black text-[#16382C] tabular-nums">
                          {standardPrice} DA
                        </span>
                      </div>
                      <span className="text-[10px] text-[#7E8681] font-medium block">
                        Base net: {trip.base_seat_price} DA + 15%
                      </span>

                      {comfortPrice && (
                        <span className="text-[10px] font-semibold text-[#5A625D] block mt-0.5">
                          Option Confort : <strong className="text-[#141716]">{comfortPrice} DA</strong>
                        </span>
                      )}
                    </div>

                    <div className="w-full lg:w-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/trips/${trip.id}`);
                        }}
                        className="w-full lg:w-auto py-2.5 px-5 rounded-lg bg-[#16382C] group-hover:bg-[#0F281F] text-[#FAF7F2] font-bold text-xs shadow-fine transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                      >
                        <span>Voir & Réserver</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
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
