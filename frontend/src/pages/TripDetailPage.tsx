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
  ArrowRight,
  UserCheck,
  Info,
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
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="h-96 rounded-2xl bg-white border border-[#E7E2DA] p-8 animate-pulse space-y-4">
          <div className="h-6 bg-ink-100 rounded w-1/3" />
          <div className="h-4 bg-ink-100 rounded w-1/2" />
          <div className="h-32 bg-ink-100 rounded" />
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-700 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-ink-900">{error || 'Trajet introuvable'}</h2>
        <p className="text-xs text-ink-500">Ce trajet n'existe plus ou a été annulé par son conducteur.</p>
        <button
          onClick={() => navigate('/search')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-700 text-[#FAF8F5] text-xs font-bold hover:bg-forest-800 transition-colors"
        >
          <span>Retourner aux recherches</span>
        </button>
      </div>
    );
  }

  const isDriver = user?.id === trip.driver_id;
  const departure = new Date(trip.departure_datetime);
  const departureDateFormatted = departure.toLocaleDateString('fr-DZ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const departureTimeFormatted = departure.toLocaleTimeString('fr-DZ', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const arrival = new Date(departure.getTime() + trip.estimated_duration_minutes * 60000);
  const arrivalTimeFormatted = arrival.toLocaleTimeString('fr-DZ', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Page Header Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E2DA]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-2.5 py-0.5 rounded border border-forest-200/60">
              Trajet Certifié Inter-Wilayas
            </span>
            <span className="text-xs text-ink-400">•</span>
            <span className="text-xs font-medium text-ink-500">
              Publié le {new Date(trip.created_at).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-ink-900 tracking-tight flex items-center gap-3">
            <span>{trip.origin_city}</span>
            <ArrowRight className="w-5 h-5 text-forest-700 flex-shrink-0" />
            <span>{trip.destination_city}</span>
          </h1>

          <p className="text-xs sm:text-sm text-ink-600 mt-1 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-forest-700 inline" />
            <span className="capitalize">{departureDateFormatted}</span>
            <span>•</span>
            <span>Départ à <strong>{departureTimeFormatted}</strong></span>
            <span>•</span>
            <span>{trip.distance_km} km ({Math.floor(trip.estimated_duration_minutes / 60)}h{trip.estimated_duration_minutes % 60 > 0 ? ` ${trip.estimated_duration_minutes % 60}m` : ''})</span>
          </p>
        </div>

        {/* Action button if already driver */}
        {isDriver && (
          <div className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-forest-50 border border-forest-200 text-forest-800 text-xs font-bold flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-forest-700" />
            <span>Vous êtes le conducteur de ce trajet</span>
          </div>
        )}
      </div>

      {/* 2. Main Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Route Timeline, Stops, Driver & Vehicle */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section: Route Itinerary Timeline */}
          <div className="bg-white rounded-2xl border border-[#E7E2DA] p-6 sm:p-8 shadow-subtle space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-500 border-b border-[#F4EFEB] pb-3 flex items-center justify-between">
              <span>Itinéraire & Points de Prise en Charge</span>
              <span className="text-xs font-semibold text-forest-700 lowercase">
                {trip.distance_km} kilomètres
              </span>
            </h2>

            {/* Timeline */}
            <div className="relative pl-8 border-l-2 border-forest-700/60 ml-3 space-y-8">
              {/* Point 1: Departure */}
              <div className="relative">
                <div className="absolute -left-[41px] top-0.5 w-5 h-5 rounded-full bg-forest-700 ring-4 ring-forest-100 flex items-center justify-center text-white text-[10px] font-bold">
                  D
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-ink-900 tabular-nums">
                      {departureTimeFormatted}
                    </span>
                    <span className="text-xs font-bold text-forest-700 uppercase tracking-wider bg-forest-50 px-2 py-0.5 rounded">
                      Point de départ
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-ink-900 mt-1">
                    {trip.origin_city}{' '}
                    <span className="text-xs font-normal text-ink-500">
                      (Wilaya de {trip.origin_wilaya_name})
                    </span>
                  </h3>
                  <p className="text-xs text-ink-600 mt-0.5 bg-[#FAF8F5] p-2.5 rounded-lg border border-[#E7E2DA]">
                    📍 {trip.origin_address}
                  </p>
                </div>
              </div>

              {/* Point 2: Intermediate Stops (including Mandatory Rest Stop > 300km) */}
              {trip.stops && trip.stops.length > 0 && (
                <div className="space-y-6">
                  {trip.stops.map((stop, idx) => (
                    <div key={idx} className="relative">
                      <div
                        className={`absolute -left-[41px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                          stop.is_mandatory_rest
                            ? 'bg-citrus-600 ring-4 ring-citrus-100'
                            : 'bg-ink-400 ring-4 ring-ink-100'
                        }`}
                      >
                        {stop.is_mandatory_rest ? '☕' : idx + 1}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold ${
                              stop.is_mandatory_rest ? 'text-citrus-800' : 'text-ink-700'
                            }`}
                          >
                            {stop.is_mandatory_rest
                              ? 'Pause de Sécurité Obligatoire (15 minutes)'
                              : `Étape intermédiaire #${stop.stop_order}`}
                          </span>
                          {stop.is_mandatory_rest && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-citrus-100 text-citrus-800 border border-citrus-200">
                              Règle &gt; 300 km
                            </span>
                          )}
                        </div>

                        <p className="text-sm font-semibold text-ink-900">
                          {stop.location_name} ({stop.city})
                        </p>

                        {stop.is_mandatory_rest && (
                          <p className="text-xs text-citrus-800 bg-[#FFFDF5] p-2.5 rounded-lg border border-[#FDE68A] leading-relaxed">
                            Arrêt obligatoire au point médian dans une station-service Naftal pour le repos du conducteur et la sécurité de tous.
                          </p>
                        )}

                        {stop.notes && !stop.is_mandatory_rest && (
                          <p className="text-xs text-ink-500 italic mt-0.5">{stop.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Point 3: Destination */}
              <div className="relative">
                <div className="absolute -left-[41px] top-0.5 w-5 h-5 rounded-full bg-forest-900 ring-4 ring-forest-100 flex items-center justify-center text-white text-[10px] font-bold">
                  A
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-ink-900 tabular-nums">
                      {arrivalTimeFormatted}
                    </span>
                    <span className="text-xs font-bold text-ink-600 uppercase tracking-wider bg-ink-100 px-2 py-0.5 rounded">
                      Arrivée prévue
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-ink-900 mt-1">
                    {trip.destination_city}{' '}
                    <span className="text-xs font-normal text-ink-500">
                      (Wilaya de {trip.destination_wilaya_name})
                    </span>
                  </h3>
                  <p className="text-xs text-ink-600 mt-0.5 bg-[#FAF8F5] p-2.5 rounded-lg border border-[#E7E2DA]">
                    🏁 {trip.destination_address}
                  </p>
                </div>
              </div>
            </div>

            {/* Driver trip notes */}
            {trip.notes && (
              <div className="pt-4 border-t border-[#F4EFEB] space-y-1.5">
                <h4 className="text-xs font-bold text-ink-500 uppercase tracking-wider">
                  Consignes de voyage du conducteur
                </h4>
                <p className="text-xs text-ink-700 bg-[#FAF8F5] p-3 rounded-xl border border-[#E7E2DA] leading-relaxed">
                  "{trip.notes}"
                </p>
              </div>
            )}
          </div>

          {/* Section: Driver & Vehicle Card */}
          <div className="bg-white rounded-2xl border border-[#E7E2DA] p-6 sm:p-8 shadow-subtle space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-ink-500 border-b border-[#F4EFEB] pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-forest-700" />
              Conducteur & Véhicule
            </h2>

            <div className="flex items-start gap-4">
              <img
                src={trip.driver?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${trip.driver?.full_name || 'DZ'}`}
                alt={trip.driver?.full_name}
                className="w-14 h-14 rounded-full border-2 border-[#DED7CE] object-cover flex-shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-ink-900">{trip.driver?.full_name}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-forest-100 text-forest-800">
                    Membre Certifié
                  </span>
                </div>
                <p className="text-xs text-ink-500">
                  Réside à {trip.driver?.wilaya_name || 'Algérie'} • {trip.driver?.trips_completed_count || 14} trajets réalisés
                </p>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-forest-700">
                  <span>★ {trip.driver?.rating_avg || 4.9}</span>
                  <span className="text-ink-400 font-normal">({trip.driver?.rating_count || 12} avis de passagers)</span>
                </div>
              </div>
            </div>

            {trip.driver?.bio && (
              <p className="text-xs text-ink-600 italic bg-[#FAF8F5] p-3 rounded-xl border border-[#E7E2DA]">
                "{trip.driver.bio}"
              </p>
            )}

            {/* Vehicle info block */}
            {trip.vehicle && (
              <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA] flex items-center justify-between text-xs text-ink-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#DED7CE] flex items-center justify-center text-forest-700">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-ink-900">
                      {trip.vehicle.make} {trip.vehicle.model} ({trip.vehicle.year})
                    </span>
                    <span className="text-[11px] text-ink-500">
                      Couleur : {trip.vehicle.color}
                    </span>
                  </div>
                </div>

                {trip.vehicle.air_conditioning && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-forest-50 text-forest-800 font-semibold border border-forest-200/60 text-[11px]">
                    <Wind className="w-3.5 h-3.5 text-forest-700" />
                    Climatisé
                  </span>
                )}
              </div>
            )}

            {/* Trip Chat Action */}
            {user && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => navigate(`/trips/${trip.id}/chat`)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#DED7CE] bg-[#FAF8F5] hover:bg-forest-50 hover:border-forest-600 hover:text-forest-700 text-ink-800 text-xs font-bold transition-all shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 text-forest-700" />
                  <span>Messagerie de coordination du trajet</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Sticky Booking & Transparent Pricing Card */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          <div className="bg-white rounded-2xl border border-[#DED7CE] p-6 sm:p-7 shadow-card space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#F4EFEB]">
              <h3 className="text-base font-black text-ink-900 tracking-tight">
                Réserver votre place
              </h3>
              <div className="text-right">
                <span className="text-xs font-bold text-forest-700">
                  {trip.available_seats > 1 ? (
                    `${trip.available_seats} places libres`
                  ) : trip.available_seats === 1 ? (
                    <span className="text-citrus-700">Dernière place disponible !</span>
                  ) : (
                    <span className="text-rose-600">Complet</span>
                  )}
                </span>
              </div>
            </div>

            {/* Seat count selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-ink-700">
                Nombre de places souhaitées
              </label>
              <select
                value={seatCount}
                onChange={(e) => setSeatCount(parseInt(e.target.value, 10))}
                className="w-full rounded-xl border border-[#DED7CE] bg-[#FAF8F5] py-2.5 px-3 text-sm font-semibold text-ink-900 focus:outline-none focus:border-forest-600 focus:bg-white transition-colors"
              >
                {[...Array(Math.min(trip.available_seats, 4))].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} place{i + 1 > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Trajet Confort (+30%) option */}
            {trip.comfort_enabled && (
              <div className="p-3.5 bg-citrus-50/70 rounded-xl border border-citrus-200 space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-citrus-600" />
                    <span className="text-xs font-bold text-citrus-950">
                      Option Trajet Confort (+30%)
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={seatType === 'comfort'}
                    onChange={(e) => setSeatType(e.target.checked ? 'comfort' : 'standard')}
                    className="rounded text-citrus-600 focus:ring-citrus-500 h-4 w-4 border-[#DED7CE]"
                  />
                </label>
                <p className="text-[11px] text-citrus-900/90 leading-relaxed">
                  Garantie du siège passager avant sans passager assis au milieu à l'arrière. Espace pour les jambes et voyage plus détendu.
                </p>
              </div>
            )}

            {/* Prominent Mandatory Rest Stop Notice Before Booking if > 300km */}
            {trip.distance_km > 300.0 && (
              <div className="p-3 rounded-xl bg-[#FFFDF5] border border-citrus-200 flex items-start gap-2.5">
                <Coffee className="w-4 h-4 text-citrus-600 flex-shrink-0 mt-0.5" />
                <div className="text-[11px] text-citrus-900 space-y-0.5">
                  <span className="font-bold block">Pause de 15 minutes incluse au trajet</span>
                  <p className="text-citrus-800 leading-normal">
                    Ce trajet de {trip.distance_km} km prévoit un arrêt obligatoire à mi-parcours pour la sécurité du voyage.
                  </p>
                </div>
              </div>
            )}

            {/* Complete Price Breakdown Component */}
            <PriceBreakdown
              basePrice={trip.base_seat_price}
              seatCount={seatCount}
              seatType={seatType}
              showDriverPayout={isDriver}
            />

            {/* Booking Action / Status Handling */}
            {isDriver ? (
              <div className="text-center p-3.5 bg-[#FAF8F5] rounded-xl border border-[#E7E2DA] text-xs font-semibold text-ink-500">
                Vous êtes le conducteur de ce trajet. Vous recevrez les demandes de réservation de vos passagers sur votre tableau de bord.
              </div>
            ) : bookingSuccess ? (
              <div className="p-4 bg-forest-50 rounded-xl border border-forest-200 text-center space-y-2">
                <CheckCircle2 className="w-7 h-7 text-forest-700 mx-auto" />
                <h4 className="text-sm font-bold text-forest-900">Demande envoyée au conducteur !</h4>
                <p className="text-xs text-forest-800">
                  Votre demande de réservation a été enregistrée avec le statut <strong>En attente</strong>. Le conducteur vous répondra rapidement.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/passenger')}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 underline hover:text-forest-900"
                >
                  <span>Accéder à mes réservations</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {bookingError && (
                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs font-bold text-rose-800 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{bookingError}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleBooking}
                  disabled={bookingLoading || trip.available_seats < 1}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-[#FAF8F5] bg-forest-700 hover:bg-forest-800 disabled:bg-ink-200 disabled:text-ink-400 shadow-subtle hover:shadow-card transition-all active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-forest-700/30"
                >
                  {bookingLoading
                    ? 'Transmission en cours...'
                    : trip.available_seats < 1
                    ? 'Trajet Complet'
                    : 'Confirmer la demande de réservation'}
                </button>

                <div className="space-y-1 text-center">
                  <p className="text-[11px] text-ink-500">
                    Validation préalable requise par le conducteur • Aucun paiement anticipé en ligne
                  </p>
                  <p className="text-[10px] text-ink-400">
                    Décompte des sièges exécuté de manière atomique dès confirmation.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
