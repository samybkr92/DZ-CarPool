import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { Trip } from '../types';
import { useAuth } from '../context/AuthContext';
import { PriceBreakdown } from '../components/PriceBreakdown';
import { RestStopAlert } from '../components/RestStopAlert';
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  Wind,
  ShieldCheck,
  Sparkles,
  Coffee,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

export const TripDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Booking form state
  const [seatCount, setSeatCount] = useState<number>(1);
  const [seatType, setSeatType] = useState<'standard' | 'comfort'>('standard');
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await api.getTrip(parseInt(id, 10));
        setTrip(data);
      } catch (err: any) {
        setError(err.message || 'Trajet introuvable');
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  const handleBooking = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!trip) return;

    setBookingLoading(true);
    setBookingError(null);
    try {
      await api.createBooking(trip.id, {
        seat_count: seatCount,
        seat_type: seatType,
      });
      setBookingSuccess(true);
    } catch (err: any) {
      setBookingError(err.message || 'Échec de la réservation');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="h-64 rounded-2xl bg-gray-100 animate-pulse" />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-3">
        <p className="text-xl font-bold text-gray-800">{error || 'Trajet introuvable'}</p>
        <button
          onClick={() => navigate('/search')}
          className="text-sm font-bold text-emerald-600 hover:underline"
        >
          Retourner aux recherches
        </button>
      </div>
    );
  }

  const isDriver = user?.id === trip.driver_id;
  const departureDate = new Date(trip.departure_datetime).toLocaleDateString('fr-DZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Rest Stop Alert for > 300km */}
      <RestStopAlert distanceKm={trip.distance_km} cityName={trip.stops?.[0]?.city} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (2 cols): Trip & Driver Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Card */}
          <div className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                Trajet Actif
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Publié le {new Date(trip.created_at).toLocaleDateString()}
              </span>
            </div>

            {/* Route timeline visual */}
            <div className="space-y-6 relative pl-6 border-l-2 border-emerald-500 ml-3">
              {/* Origin */}
              <div className="relative">
                <div className="absolute -left-[31px] top-0 w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                  Départ
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-0.5">
                  {trip.origin_city} <span className="text-sm font-normal text-gray-500">({trip.origin_wilaya_name})</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">{trip.origin_address}</p>
                <p className="text-xs font-medium text-gray-700 mt-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {departureDate}
                </p>
              </div>

              {/* Stops (including mandatory rest if > 300km) */}
              {trip.stops && trip.stops.length > 0 && (
                <div className="space-y-4 pt-2">
                  {trip.stops.map((stop, idx) => (
                    <div key={idx} className="relative">
                      <div className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full flex items-center justify-center ${stop.is_mandatory_rest ? 'bg-amber-500 ring-4 ring-amber-100' : 'bg-gray-400 ring-4 ring-gray-100'}`} />
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${stop.is_mandatory_rest ? 'text-amber-800' : 'text-gray-600'}`}>
                          {stop.is_mandatory_rest ? 'Pause Obligatoire 15 min' : `Arrêt intermédiaire #${stop.stop_order}`}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-gray-800">{stop.location_name} ({stop.city})</p>
                      {stop.notes && <p className="text-xs text-gray-500 mt-0.5">{stop.notes}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* Destination */}
              <div className="relative pt-2">
                <div className="absolute -left-[31px] top-2 w-4 h-4 rounded-full bg-emerald-700 ring-4 ring-emerald-100" />
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                  Arrivée
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-0.5">
                  {trip.destination_city} <span className="text-sm font-normal text-gray-500">({trip.destination_wilaya_name})</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">{trip.destination_address}</p>
                <p className="text-xs font-medium text-gray-600 mt-1">
                  Distance totale : {trip.distance_km} km • Durée estimée : {Math.round(trip.estimated_duration_minutes / 60)}h {trip.estimated_duration_minutes % 60}m
                </p>
              </div>
            </div>

            {/* Notes */}
            {trip.notes && (
              <div className="pt-4 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Consignes du conducteur
                </h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  {trip.notes}
                </p>
              </div>
            )}
          </div>

          {/* Driver & Vehicle Profile */}
          <div className="bg-white rounded-2xl border border-gray-200/90 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Profil du Conducteur & Véhicule
            </h3>

            <div className="flex items-center gap-4">
              <img
                src={trip.driver?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${trip.driver?.full_name || 'DZ'}`}
                alt={trip.driver?.full_name}
                className="w-14 h-14 rounded-full border border-gray-200 object-cover"
              />
              <div>
                <h4 className="text-base font-bold text-gray-900">{trip.driver?.full_name}</h4>
                <p className="text-xs text-gray-500">
                  Réside à {trip.driver?.wilaya_name} • Membre certifié
                </p>
                <p className="text-xs font-bold text-emerald-700 mt-0.5">
                  ★ {trip.driver?.rating_avg || 4.8} / 5 ({trip.driver?.rating_count || 10} avis)
                </p>
              </div>
            </div>

            {trip.driver?.bio && (
              <p className="text-xs text-gray-600 italic">"{trip.driver.bio}"</p>
            )}

            {trip.vehicle && (
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between text-xs text-gray-700">
                <span className="flex items-center gap-2 font-medium">
                  <Car className="w-4 h-4 text-gray-500" />
                  {trip.vehicle.make} {trip.vehicle.model} ({trip.vehicle.year}) • {trip.vehicle.color}
                </span>
                {trip.vehicle.air_conditioning && (
                  <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <Wind className="w-3.5 h-3.5" /> Climatisé
                  </span>
                )}
              </div>
            )}

            {/* Coordination Chat Entry */}
            {user && (
              <div className="pt-2">
                <button
                  onClick={() => navigate(`/trips/${trip.id}/chat`)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 hover:border-emerald-600 hover:text-emerald-700 text-xs font-bold transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Ouvrir la messagerie du trajet</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 col): Transparent Booking Box */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-md space-y-5 sticky top-24">
            <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
              Réserver votre place
            </h3>

            {/* Seat count selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-700">
                Nombre de places souhaitées
              </label>
              <select
                value={seatCount}
                onChange={(e) => setSeatCount(parseInt(e.target.value, 10))}
                className="w-full rounded-xl border border-gray-300 py-2.5 px-3 text-sm font-semibold text-gray-900 focus:outline-none focus:border-emerald-600"
              >
                {[...Array(Math.min(trip.available_seats, 4))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} place(s)
                  </option>
                ))}
              </select>
            </div>

            {/* Comfort upgrade toggle */}
            {trip.comfort_enabled && (
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-amber-950">Option Trajet Confort (+30%)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={seatType === 'comfort'}
                    onChange={(e) => setSeatType(e.target.checked ? 'comfort' : 'standard')}
                    className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
                  />
                </label>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Garantie du siège passager avant sans passager au milieu pour un trajet spacieux.
                </p>
              </div>
            )}

            {/* Transparent Pricing Breakdown */}
            <PriceBreakdown
              basePrice={trip.base_seat_price}
              seatCount={seatCount}
              seatType={seatType}
              showDriverPayout={isDriver}
            />

            {/* Action Button & Status */}
            {isDriver ? (
              <div className="text-center p-3 bg-gray-50 rounded-xl text-xs font-semibold text-gray-500">
                Vous êtes le conducteur de ce trajet.
              </div>
            ) : bookingSuccess ? (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="text-sm font-bold text-emerald-900">Demande envoyée avec succès !</p>
                <p className="text-xs text-emerald-700">Le conducteur examinera votre demande sous peu.</p>
                <button
                  onClick={() => navigate('/dashboard/passenger')}
                  className="mt-2 text-xs font-bold text-emerald-800 underline"
                >
                  Voir mes réservations
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {bookingError && (
                  <div className="p-3 bg-rose-50 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>{bookingError}</span>
                  </div>
                )}
                <button
                  onClick={handleBooking}
                  disabled={bookingLoading || trip.available_seats < 1}
                  className="w-full py-3.5 px-6 rounded-xl font-extrabold text-sm text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 shadow-lg shadow-emerald-600/25 transition-all"
                >
                  {bookingLoading ? 'Envoi en cours...' : trip.available_seats < 1 ? 'Trajet Complet' : 'Confirmer la réservation'}
                </button>
                <p className="text-[10px] text-center text-gray-400">
                  Validation par le conducteur requise. Décompte de place atomique.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
