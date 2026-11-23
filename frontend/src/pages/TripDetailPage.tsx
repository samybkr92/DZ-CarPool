import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { Trip } from '../types';
import { useAuth } from '../context/AuthContext';
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
  Check,
  ArrowRight,
  UserCheck,
  Fuel,
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
        <div className="h-96 rounded-2xl bg-white border border-[#EAE5DC] p-8 animate-pulse space-y-4">
          <div className="h-6 bg-[#F4EFE6] rounded w-1/3" />
          <div className="h-4 bg-[#F4EFE6] rounded w-1/2" />
          <div className="h-32 bg-[#F4EFE6] rounded" />
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-lg bg-[#FCF7F3] text-[#A14114] flex items-center justify-center mx-auto border border-[#F0D5C3]">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[#141716]">{error || 'Trajet introuvable'}</h2>
        <p className="text-xs text-[#5A625D]">Ce trajet n'existe plus ou a été annulé par son conducteur.</p>
        <button
          onClick={() => navigate('/search')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#16382C] text-[#FAF7F2] text-xs font-bold hover:bg-[#0F281F] transition-colors shadow-fine"
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

  // Accurate monetary arithmetic
  const basePricePerSeat = trip.base_seat_price;
  const commissionPerSeat = Math.round(basePricePerSeat * 0.15);
  const standardPricePerSeat = basePricePerSeat + commissionPerSeat;
  const comfortFeePerSeat = seatType === 'comfort' ? Math.round(basePricePerSeat * 0.30) : 0;
  const finalPricePerSeat = standardPricePerSeat + comfortFeePerSeat;
  const totalDue = finalPricePerSeat * seatCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* 1. Page Header Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE5DC]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#16382C] bg-[#E2EDE6] px-2.5 py-0.5 rounded border border-[#C4DBCD]">
              Trajet Certifié Inter-Wilayas
            </span>
            <span className="text-xs text-[#C8BEAD]">•</span>
            <span className="text-xs font-medium text-[#7E8681]">
              Publié le {new Date(trip.created_at).toLocaleDateString()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#141716] tracking-tight flex items-center gap-3">
            <span>{trip.origin_city}</span>
            <ArrowRight className="w-5 h-5 text-[#16382C] flex-shrink-0" />
            <span>{trip.destination_city}</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#5A625D] mt-1 flex items-center gap-2 flex-wrap">
            <Calendar className="w-4 h-4 text-[#16382C] inline" />
            <span className="capitalize">{departureDateFormatted}</span>
            <span>•</span>
            <span>Départ à <strong>{departureTimeFormatted}</strong></span>
            <span>•</span>
            <span>{trip.distance_km} km ({Math.floor(trip.estimated_duration_minutes / 60)}h{trip.estimated_duration_minutes % 60 > 0 ? ` ${trip.estimated_duration_minutes % 60}m` : ''})</span>
          </p>
        </div>

        {/* Action button if already driver */}
        {isDriver && (
          <div className="self-start sm:self-auto px-3.5 py-2 rounded-lg bg-[#E2EDE6] border border-[#C4DBCD] text-[#16382C] text-xs font-bold flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#16382C]" />
            <span>Vous êtes le conducteur de ce trajet</span>
          </div>
        )}
      </div>

      {/* 2. Main Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Route Timeline, Stops, Driver & Vehicle */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section: Route Itinerary Timeline */}
          <div className="bg-white rounded-2xl border border-[#EAE5DC] p-6 sm:p-8 shadow-fine space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#7E8681] border-b border-[#F4EFE6] pb-3 flex items-center justify-between">
              <span>Itinéraire & Points de Prise en Charge</span>
              <span className="text-xs font-semibold text-[#16382C] lowercase">
                {trip.distance_km} kilomètres
              </span>
            </h2>

            {/* Timeline */}
            <div className="relative pl-8 border-l-2 border-[#16382C]/30 ml-3 space-y-8">
              {/* Point 1: Departure */}
              <div className="relative">
                <div className="absolute -left-[41px] top-0.5 w-5 h-5 rounded-full bg-[#16382C] ring-4 ring-[#E2EDE6] flex items-center justify-center text-white text-[10px] font-bold">
                  D
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-[#141716] tabular-nums">
                      {departureTimeFormatted}
                    </span>
                    <span className="text-[10px] font-bold text-[#16382C] uppercase tracking-wider bg-[#E2EDE6] px-2 py-0.5 rounded border border-[#C4DBCD]">
                      Point de départ
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#141716] mt-1">
                    {trip.origin_city}{' '}
                    <span className="text-xs font-normal text-[#7E8681]">
                      (Wilaya de {trip.origin_wilaya_name})
                    </span>
                  </h3>
                  <p className="text-xs text-[#5A625D] mt-0.5 bg-[#FAF7F2] p-2.5 rounded-lg border border-[#EAE5DC]">
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
                            ? 'bg-[#A14114] ring-4 ring-[#F8ECE3]'
                            : 'bg-[#7E8681] ring-4 ring-[#F4EFE6]'
                        }`}
                      >
                        {stop.is_mandatory_rest ? '☕' : idx + 1}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold ${
                              stop.is_mandatory_rest ? 'text-[#A14114]' : 'text-[#303632]'
                            }`}
                          >
                            {stop.is_mandatory_rest
                              ? 'Pause de Sécurité Obligatoire (15 minutes)'
                              : `Étape intermédiaire #${stop.stop_order}`}
                          </span>
                          {stop.is_mandatory_rest && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#F8ECE3] text-[#A14114] border border-[#F0D5C3]">
                              Règle &gt; 300 km
                            </span>
                          )}
                        </div>

                        <p className="text-sm font-semibold text-[#141716]">
                          {stop.location_name} ({stop.city})
                        </p>

                        {stop.is_mandatory_rest && (
                          <p className="text-xs text-[#823414] bg-[#FCF7F3] p-2.5 rounded-lg border border-[#F0D5C3] leading-relaxed">
                            Arrêt obligatoire au point médian en aire autoroutière Naftal pour le repos du conducteur et la sécurité de tous les passagers.
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Point 3: Destination */}
              <div className="relative">
                <div className="absolute -left-[41px] top-0.5 w-5 h-5 rounded-full bg-[#141716] ring-4 ring-[#EAE5DC] flex items-center justify-center text-white text-[10px] font-bold">
                  A
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-[#141716] tabular-nums">
                      {arrivalTimeFormatted}
                    </span>
                    <span className="text-[10px] font-bold text-[#7E8681] uppercase tracking-wider bg-[#F4EFE6] px-2 py-0.5 rounded border border-[#EAE5DC]">
                      Arrivée prévue
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#141716] mt-1">
                    {trip.destination_city}{' '}
                    <span className="text-xs font-normal text-[#7E8681]">
                      (Wilaya de {trip.destination_wilaya_name})
                    </span>
                  </h3>
                  <p className="text-xs text-[#5A625D] mt-0.5 bg-[#FAF7F2] p-2.5 rounded-lg border border-[#EAE5DC]">
                    🏁 {trip.destination_address}
                  </p>
                </div>
              </div>
            </div>

            {/* Fuel Estimation Advisory Box (GL 2025/2026 Rubric) */}
            <div className="p-4 bg-[#E2EDE6] rounded-xl border border-[#C4DBCD] space-y-2 text-xs text-[#16382C]">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5 text-[#16382C]">
                  <Fuel className="w-4 h-4 text-[#16382C]" />
                  Transparence Carburant (Barème Officiel Naftal)
                </span>
                <span className="text-[10px] font-bold text-[#16382C] bg-white px-2 py-0.5 rounded border border-[#C4DBCD]">
                  8L / 100km
                </span>
              </div>
              <p className="text-[#276243] leading-relaxed">
                Pour ce parcours de <strong>{trip.distance_km} km</strong>, la consommation estimée est d'environ <strong>{Math.round(trip.distance_km * 8 / 100 * 10) / 10} Litres</strong>.
                Le coût estimé de carburant est de <strong>{trip.fuel_estimate_cost ? `${trip.fuel_estimate_cost} DA` : `${Math.round((trip.distance_km * 8 / 100) * 45.62)} DA`}</strong>, soit une part indicative de <strong>{trip.suggested_seat_price ? `${trip.suggested_seat_price} DA` : `${Math.round(((trip.distance_km * 8 / 100) * 45.62) / trip.total_seats)} DA`}</strong> par siège.
              </p>
            </div>
          </div>

          {/* Section: Driver & Vehicle Card */}
          <div className="bg-white rounded-2xl border border-[#EAE5DC] p-6 sm:p-8 shadow-fine space-y-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#7E8681] border-b border-[#F4EFE6] pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#16382C]" />
              Conducteur & Véhicule
            </h2>

            <div className="flex items-start gap-4">
              <img
                src={trip.driver?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${trip.driver?.full_name || 'DZ'}`}
                alt={trip.driver?.full_name}
                className="w-14 h-14 rounded-full border border-[#EAE5DC] object-cover flex-shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-[#141716]">{trip.driver?.full_name}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#E2EDE6] text-[#16382C] border border-[#C4DBCD]">
                    Membre Certifié
                  </span>
                </div>
                <p className="text-xs text-[#7E8681]">
                  Réside à {trip.driver?.wilaya_name || 'Algérie'} • {trip.driver?.trips_completed_count || 14} trajets réalisés
                </p>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#16382C]">
                  <span>★ {trip.driver?.rating_avg || 4.9}</span>
                  <span className="text-[#ADB3AF] font-normal">({trip.driver?.rating_count || 12} avis)</span>
                </div>
              </div>
            </div>

            {trip.driver?.bio && (
              <p className="text-xs text-[#5A625D] italic bg-[#FAF7F2] p-3 rounded-xl border border-[#EAE5DC]">
                "{trip.driver.bio}"
              </p>
            )}

            {/* Vehicle info block */}
            {trip.vehicle && (
              <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#EAE5DC] flex items-center justify-between text-xs text-[#141716]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#EAE5DC] flex items-center justify-center text-[#16382C] shadow-fine">
                    <Car className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-[#141716]">
                      {trip.vehicle.make} {trip.vehicle.model} ({trip.vehicle.year})
                    </span>
                    <span className="text-[11px] text-[#7E8681]">
                      Couleur : {trip.vehicle.color}
                    </span>
                  </div>
                </div>

                {trip.vehicle.air_conditioning && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#E2EDE6] text-[#16382C] font-semibold border border-[#C4DBCD] text-[11px]">
                    <Wind className="w-3.5 h-3.5 text-[#16382C]" />
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
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-[#EAE5DC] bg-[#FAF7F2] hover:bg-[#EAE5DC] text-[#141716] text-xs font-bold transition-all shadow-fine"
                >
                  <MessageCircle className="w-4 h-4 text-[#16382C]" />
                  <span>Messagerie de coordination du trajet</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Sticky Booking & Transparent Pricing Card */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          <div className="bg-white rounded-2xl border border-[#EAE5DC] p-6 sm:p-7 shadow-fine space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#F4EFE6]">
              <h3 className="text-base font-bold text-[#141716] tracking-tight">
                Réserver votre place
              </h3>
              <div className="text-right">
                <span className="text-xs font-bold text-[#16382C]">
                  {trip.available_seats > 1 ? (
                    `${trip.available_seats} places libres`
                  ) : trip.available_seats === 1 ? (
                    <span className="text-[#A14114] font-bold">Dernière place disponible !</span>
                  ) : (
                    <span className="text-[#A14114]">Complet</span>
                  )}
                </span>
              </div>
            </div>

            {/* Seat count selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#303632]">
                Nombre de places souhaitées
              </label>
              <select
                value={seatCount}
                onChange={(e) => setSeatCount(parseInt(e.target.value, 10))}
                className="w-full rounded-xl border border-[#EAE5DC] bg-[#FAF7F2] py-2.5 px-3 text-xs font-semibold text-[#141716] focus:outline-none focus:border-[#16382C] focus:bg-white transition-colors cursor-pointer"
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
              <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#EAE5DC] space-y-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#D96B27]" />
                    <span className="text-xs font-bold text-[#141716]">
                      Option Trajet Confort (+30%)
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={seatType === 'comfort'}
                    onChange={(e) => setSeatType(e.target.checked ? 'comfort' : 'standard')}
                    className="w-4 h-4 text-[#16382C] rounded focus:ring-[#16382C]"
                  />
                </label>
                <p className="text-[11px] text-[#5A625D] leading-relaxed">
                  Siège passager avant garanti sans passager au milieu à l’arrière. Supplément fixe de 30% calculé sur le prix de base net conducteur.
                </p>
              </div>
            )}

            {/* Transparent Pricing Breakdown */}
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC] space-y-2.5 text-xs text-[#5A625D]">
              <div className="flex justify-between items-center">
                <span>Prix de base par siège (Net conducteur) :</span>
                <span className="font-semibold text-[#141716] tabular-nums">{basePricePerSeat} DA</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Commission plateforme (15%) :</span>
                <span className="font-semibold text-[#141716] tabular-nums">+{commissionPerSeat} DA</span>
              </div>
              {seatType === 'comfort' && (
                <div className="flex justify-between items-center text-[#A14114] font-semibold">
                  <span>Supplément Trajet Confort (+30%) :</span>
                  <span className="tabular-nums">+{comfortFeePerSeat} DA</span>
                </div>
              )}
              {seatCount > 1 && (
                <div className="flex justify-between items-center pt-1 border-t border-[#EAE5DC]">
                  <span>Nombre de passagers :</span>
                  <span className="font-bold text-[#141716]">× {seatCount}</span>
                </div>
              )}

              <div className="pt-2 border-t border-[#EAE5DC] flex justify-between items-baseline">
                <div>
                  <span className="text-xs font-bold text-[#141716] block">
                    Total passager à régler :
                  </span>
                  <span className="text-[10px] text-[#7E8681]">TTC, aucun frais additionnel</span>
                </div>
                <span className="text-2xl font-black text-[#16382C] tabular-nums">
                  {totalDue} DA
                </span>
              </div>
            </div>

            {/* Error or Success notification */}
            {bookingError && (
              <div className="p-3 bg-[#FCF7F3] rounded-lg border border-[#F0D5C3] text-xs text-[#A14114]">
                {bookingError}
              </div>
            )}

            {bookingSuccess ? (
              <div className="p-4 bg-[#E2EDE6] rounded-xl border border-[#C4DBCD] text-center space-y-2">
                <div className="w-8 h-8 rounded-full bg-[#16382C] text-[#FAF7F2] flex items-center justify-center mx-auto">
                  <Check className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-[#16382C]">Demande envoyée avec succès !</h4>
                <p className="text-xs text-[#276243] leading-relaxed">
                  Le conducteur examine votre demande. Vos places sont réservées de façon atomique dès son approbation.
                </p>
                <button
                  onClick={() => navigate('/dashboard/passenger')}
                  className="w-full mt-2 py-2 px-4 rounded-lg bg-[#16382C] text-[#FAF7F2] font-bold text-xs"
                >
                  Voir mes réservations
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleBooking}
                disabled={bookingLoading || trip.available_seats < seatCount}
                className="w-full py-3.5 px-6 rounded-xl bg-[#16382C] hover:bg-[#0F281F] disabled:bg-[#D6D9D7] text-[#FAF7F2] font-bold text-xs shadow-fine active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                {bookingLoading ? (
                  <span>Transmission sécurisée...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Demander la réservation ({totalDue} DA)</span>
                  </>
                )}
              </button>
            )}

            <p className="text-[11px] text-[#7E8681] text-center">
              🔒 Réservation avec validation manuelle • Paiement sécurisé à bord
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
