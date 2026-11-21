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
  Fuel,
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
        <div className="h-96 rounded-2xl bg-white border border-slate-200 p-8 animate-pulse space-y-4">
          <div className="h-6 bg-slate-100 rounded w-1/3" />
          <div className="h-4 bg-slate-100 rounded w-1/2" />
          <div className="h-32 bg-slate-100 rounded" />
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
        <h2 className="text-xl font-bold text-slate-900">{error || 'Trajet introuvable'}</h2>
        <p className="text-xs text-slate-500">Ce trajet n'existe plus ou a été annulé par son conducteur.</p>
        <button
          onClick={() => navigate('/search')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors shadow-xs"
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              Trajet Certifié Inter-Wilayas
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-slate-500">
              Publié le {new Date(trip.created_at).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <span>{trip.origin_city}</span>
            <ArrowRight className="w-5 h-5 text-emerald-700 flex-shrink-0" />
            <span>{trip.destination_city}</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 mt-1 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-700 inline" />
            <span className="capitalize">{departureDateFormatted}</span>
            <span>•</span>
            <span>Départ à <strong>{departureTimeFormatted}</strong></span>
            <span>•</span>
            <span>{trip.distance_km} km ({Math.floor(trip.estimated_duration_minutes / 60)}h{trip.estimated_duration_minutes % 60 > 0 ? ` ${trip.estimated_duration_minutes % 60}m` : ''})</span>
          </p>
        </div>

        {/* Action button if already driver */}
        {isDriver && (
          <div className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-700" />
            <span>Vous êtes le conducteur de ce trajet</span>
          </div>
        )}
      </div>

      {/* 2. Main Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Route Timeline, Stops, Driver & Vehicle */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section: Route Itinerary Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Itinéraire & Points de Prise en Charge</span>
              <span className="text-xs font-semibold text-emerald-700 lowercase">
                {trip.distance_km} kilomètres
              </span>
            </h2>

            {/* Timeline */}
            <div className="relative pl-8 border-l-2 border-emerald-600/40 ml-3 space-y-8">
              {/* Point 1: Departure */}
              <div className="relative">
                <div className="absolute -left-[41px] top-0.5 w-5 h-5 rounded-full bg-emerald-700 ring-4 ring-emerald-100 flex items-center justify-center text-white text-[10px] font-bold">
                  D
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900 tabular-nums">
                      {departureTimeFormatted}
                    </span>
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Point de départ
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {trip.origin_city}{' '}
                    <span className="text-xs font-normal text-slate-500">
                      (Wilaya de {trip.origin_wilaya_name})
                    </span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
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
                            ? 'bg-amber-600 ring-4 ring-amber-100'
                            : 'bg-slate-400 ring-4 ring-slate-100'
                        }`}
                      >
                        {stop.is_mandatory_rest ? '☕' : idx + 1}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold ${
                              stop.is_mandatory_rest ? 'text-amber-800' : 'text-slate-700'
                            }`}
                          >
                            {stop.is_mandatory_rest
                              ? 'Pause de Sécurité Obligatoire (15 minutes)'
                              : `Étape intermédiaire #${stop.stop_order}`}
                          </span>
                          {stop.is_mandatory_rest && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200">
                              Règle &gt; 300 km
                            </span>
                          )}
                        </div>

                        <p className="text-sm font-semibold text-slate-900">
                          {stop.location_name} ({stop.city})
                        </p>

                        {stop.is_mandatory_rest && (
                          <p className="text-xs text-amber-900 bg-amber-50 p-2.5 rounded-lg border border-amber-200 leading-relaxed">
                            Arrêt obligatoire au point médian dans une station-service Naftal pour le repos du conducteur et la sécurité de tous.
                          </p>
                        )}

                        {stop.notes && !stop.is_mandatory_rest && (
                          <p className="text-xs text-slate-500 italic mt-0.5">{stop.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Point 3: Destination */}
              <div className="relative">
                <div className="absolute -left-[41px] top-0.5 w-5 h-5 rounded-full bg-slate-900 ring-4 ring-slate-200 flex items-center justify-center text-white text-[10px] font-bold">
                  A
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900 tabular-nums">
                      {arrivalTimeFormatted}
                    </span>
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                      Arrivée prévue
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {trip.destination_city}{' '}
                    <span className="text-xs font-normal text-slate-500">
                      (Wilaya de {trip.destination_wilaya_name})
                    </span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    🏁 {trip.destination_address}
                  </p>
                </div>
              </div>
            </div>

            {/* Driver trip notes */}
            {trip.notes && (
              <div className="pt-4 border-t border-slate-100 space-y-1.5">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Consignes de voyage du conducteur
                </h4>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                  "{trip.notes}"
                </p>
              </div>
            )}

            {/* Fuel Estimation Advisory Box (GL 2025/2026 Rubric) */}
            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 space-y-2 text-xs text-emerald-950">
              <div className="flex items-center justify-between">
                <span className="font-extrabold flex items-center gap-1.5 text-emerald-900">
                  <Fuel className="w-4 h-4 text-emerald-700" />
                  Transparence Carburant (Barème Officiel Naftal)
                </span>
                <span className="text-[10px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                  8L / 100km
                </span>
              </div>
              <p className="text-emerald-800 leading-relaxed">
                Pour ce parcours de <strong>{trip.distance_km} km</strong>, la consommation estimée est d'environ <strong>{Math.round(trip.distance_km * 8 / 100 * 10) / 10} Litres</strong>.
                Le coût estimé de carburant est de <strong>{trip.fuel_estimate_cost ? `${trip.fuel_estimate_cost} DA` : `${Math.round((trip.distance_km * 8 / 100) * 45.62)} DA`}</strong>, soit une part indicative de <strong>{trip.suggested_seat_price ? `${trip.suggested_seat_price} DA` : `${Math.round(((trip.distance_km * 8 / 100) * 45.62) / trip.total_seats)} DA`}</strong> par siège.
              </p>
            </div>
          </div>

          {/* Section: Driver & Vehicle Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Conducteur & Véhicule
            </h2>

            <div className="flex items-start gap-4">
              <img
                src={trip.driver?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${trip.driver?.full_name || 'DZ'}`}
                alt={trip.driver?.full_name}
                className="w-14 h-14 rounded-full border-2 border-slate-200 object-cover flex-shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{trip.driver?.full_name}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Membre Certifié
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Réside à {trip.driver?.wilaya_name || 'Algérie'} • {trip.driver?.trips_completed_count || 14} trajets réalisés
                </p>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                  <span>★ {trip.driver?.rating_avg || 4.9}</span>
                  <span className="text-slate-400 font-normal">({trip.driver?.rating_count || 12} avis de passagers)</span>
                </div>
              </div>
            </div>

            {trip.driver?.bio && (
              <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
                "{trip.driver.bio}"
              </p>
            )}

            {/* Vehicle info block */}
            {trip.vehicle && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-emerald-700 shadow-2xs">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-slate-900">
                      {trip.vehicle.make} {trip.vehicle.model} ({trip.vehicle.year})
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Couleur : {trip.vehicle.color}
                    </span>
                  </div>
                </div>

                {trip.vehicle.air_conditioning && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 text-[11px]">
                    <Wind className="w-3.5 h-3.5 text-emerald-700" />
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
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-600 hover:text-emerald-700 text-slate-800 text-xs font-bold transition-all shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-700" />
                  <span>Messagerie de coordination du trajet</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Sticky Booking & Transparent Pricing Card */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Réserver votre place
              </h3>
              <div className="text-right">
                <span className="text-xs font-bold text-emerald-700">
                  {trip.available_seats > 1 ? (
                    `${trip.available_seats} places libres`
                  ) : trip.available_seats === 1 ? (
                    <span className="text-amber-700 font-bold">Dernière place disponible !</span>
                  ) : (
                    <span className="text-rose-600">Complet</span>
                  )}
                </span>
              </div>
            </div>

            {/* Seat count selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Nombre de places souhaitées
              </label>
              <select
                value={seatCount}
                onChange={(e) => setSeatCount(parseInt(e.target.value, 10))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
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
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-amber-950">
                      Option Trajet Confort (+30%)
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={seatType === 'comfort'}
                    onChange={(e) => setSeatType(e.target.checked ? 'comfort' : 'standard')}
                    className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4 border-slate-300"
                  />
                </label>
                <p className="text-[11px] text-amber-900/90 leading-relaxed">
                  Garantie du siège passager avant sans passager assis au milieu à l'arrière. Espace pour les jambes et voyage plus détendu.
                </p>
              </div>
            )}

            {/* Prominent Mandatory Rest Stop Notice Before Booking if > 300km */}
            {trip.distance_km > 300.0 && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
                <Coffee className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-[11px] text-amber-950 space-y-0.5">
                  <span className="font-bold block">Pause de 15 minutes incluse au trajet</span>
                  <p className="text-amber-900 leading-normal">
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
              <div className="text-center p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-500">
                Vous êtes le conducteur de ce trajet. Vous recevrez les demandes de réservation de vos passagers sur votre tableau de bord.
              </div>
            ) : bookingSuccess ? (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-7 h-7 text-emerald-700 mx-auto" />
                <h4 className="text-sm font-bold text-emerald-900">Demande envoyée au conducteur !</h4>
                <p className="text-xs text-emerald-800">
                  Votre demande de réservation a été enregistrée avec le statut <strong>En attente</strong>. Le conducteur vous répondra rapidement.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/passenger')}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 underline hover:text-emerald-900"
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
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-400 shadow-xs hover:shadow-md transition-all active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-emerald-700/30"
                >
                  {bookingLoading
                    ? 'Transmission en cours...'
                    : trip.available_seats < 1
                    ? 'Trajet Complet'
                    : 'Confirmer la demande de réservation'}
                </button>

                <div className="space-y-1 text-center">
                  <p className="text-[11px] text-slate-500">
                    Validation préalable requise par le conducteur • Aucun paiement anticipé en ligne
                  </p>
                  <p className="text-[10px] text-slate-400">
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