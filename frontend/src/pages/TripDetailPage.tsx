import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { Trip } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Clock,
  MapPin,
  Car,
  ShieldCheck,
  Sparkles,
  Coffee,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  Star,
  Users,
  ChevronLeft,
} from 'lucide-react';
import { PriceBreakdown } from '../components/PriceBreakdown';
import { RestStopAlert } from '../components/RestStopAlert';

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
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="h-96 rounded-xl bg-white border border-[#E6E0D6] p-8 animate-pulse space-y-4" />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-[#141613]">{error || 'Trajet introuvable'}</h2>
        <p className="text-xs text-[#5C6057]">Ce trajet n'est plus disponible ou a été annulé par le conducteur.</p>
        <button
          onClick={() => navigate('/search')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#173C2C] text-white text-xs font-bold hover:bg-[#112E22] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
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

  const hours = Math.floor(trip.estimated_duration_minutes / 60);
  const minutes = trip.estimated_duration_minutes % 60;
  const durationStr = `${hours}h ${minutes > 0 ? minutes + 'm' : ''}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* 1. Page Header Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6E0D6]">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#5C6057] hover:text-[#141613] mb-2 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Retour aux résultats</span>
          </button>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#141613] tracking-tight flex items-center gap-3">
            <span>{trip.origin_city}</span>
            <ArrowRight className="w-5 h-5 text-[#173C2C] flex-shrink-0" />
            <span>{trip.destination_city}</span>
          </h1>

          <p className="text-xs sm:text-sm text-[#5C6057] mt-1 flex items-center gap-2 flex-wrap">
            <Calendar className="w-4 h-4 text-[#173C2C] inline" />
            <span className="capitalize font-semibold">{departureDateFormatted}</span>
            <span>•</span>
            <span>Départ à <strong>{departureTimeFormatted}</strong></span>
            <span>•</span>
            <span>{trip.distance_km} km ({durationStr})</span>
          </p>
        </div>

        {/* Status / Driver info */}
        {isDriver && (
          <div className="self-start sm:self-auto px-4 py-2 rounded-lg bg-[#E1EDE6] border border-[#C2DBCF] text-[#173C2C] text-xs font-bold flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#173C2C]" />
            <span>Vous êtes le conducteur de ce trajet</span>
          </div>
        )}
      </div>

      {/* 2. Main Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Route Timeline, Rest Stop, Driver & Vehicle */}
        <div className="lg:col-span-7 space-y-6">
          {/* Section: Route Itinerary Timeline */}
          <div className="bg-white rounded-xl border border-[#E6E0D6] p-6 sm:p-8 shadow-card space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#8E9389] border-b border-[#F3EFE8] pb-3 flex items-center justify-between">
              <span>Itinéraire & Points de Prise en Charge</span>
              <span className="text-xs font-bold text-[#173C2C]">{trip.distance_km} km</span>
            </h2>

            {/* Timeline */}
            <div className="relative pl-8 border-l-2 border-[#E6E0D6] ml-3 space-y-8">
              {/* Point 1: Departure */}
              <div className="relative">
                <div className="absolute -left-[41px] top-0.5 w-5 h-5 rounded-full bg-[#173C2C] ring-4 ring-[#E1EDE6] flex items-center justify-center text-white text-[10px] font-black">
                  D
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-[#141613] tabular-nums">
                      {departureTimeFormatted}
                    </span>
                    <span className="text-[10px] font-bold text-[#173C2C] uppercase tracking-wider bg-[#E1EDE6] px-2 py-0.5 rounded border border-[#C2DBCF]">
                      Départ
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#141613] mt-1">
                    {trip.origin_city}{' '}
                    <span className="text-xs font-normal text-[#8E9389]">
                      (Wilaya de {trip.origin_wilaya_name})
                    </span>
                  </h3>
                  <p className="text-xs text-[#5C6057] mt-1 bg-[#FAF8F5] p-3 rounded-lg border border-[#E6E0D6]">
                    📍 {trip.origin_address}
                  </p>
                </div>
              </div>

              {/* Point 2: Stops & Mandatory Rest Stop */}
              {trip.stops && trip.stops.length > 0 && (
                <div className="space-y-6">
                  {trip.stops.map((stop, idx) => (
                    <div key={idx} className="relative">
                      <div
                        className={`absolute -left-[41px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                          stop.is_mandatory_rest
                            ? 'bg-[#D97706] ring-4 ring-[#FEF3C7]'
                            : 'bg-[#8E9389] ring-4 ring-[#F3EFE8]'
                        }`}
                      >
                        {stop.is_mandatory_rest ? '☕' : idx + 1}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold ${
                              stop.is_mandatory_rest ? 'text-[#92400E]' : 'text-[#32362F]'
                            }`}
                          >
                            {stop.is_mandatory_rest
                              ? 'Pause de Sécurité Obligatoire (15 minutes)'
                              : `Étape #${stop.stop_order}`}
                          </span>
                          {stop.is_mandatory_rest && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                              Règle Sécurité &gt; 300 km
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#141613] font-semibold">{stop.location_name}</p>
                        <p className="text-xs text-[#5C6057]">{stop.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Point 3: Arrival */}
              <div className="relative">
                <div className="absolute -left-[41px] top-0.5 w-5 h-5 rounded-full bg-rose-600 ring-4 ring-rose-100 flex items-center justify-center text-white text-[10px] font-black">
                  A
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-[#141613] tabular-nums">
                      {arrivalTimeFormatted}
                    </span>
                    <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Arrivée
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#141613] mt-1">
                    {trip.destination_city}{' '}
                    <span className="text-xs font-normal text-[#8E9389]">
                      (Wilaya de {trip.destination_wilaya_name})
                    </span>
                  </h3>
                  <p className="text-xs text-[#5C6057] mt-1 bg-[#FAF8F5] p-3 rounded-lg border border-[#E6E0D6]">
                    📍 {trip.destination_address}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mandatory Rest Stop Alert Banner shown prominently BEFORE booking */}
          {trip.has_mandatory_rest && (
            <RestStopAlert distanceKm={trip.distance_km} />
          )}

          {/* Section: Driver Profile */}
          <div className="bg-white rounded-xl border border-[#E6E0D6] p-6 sm:p-8 shadow-card space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8E9389] border-b border-[#F3EFE8] pb-3">
              Conducteur Certifié
            </h3>

            <div className="flex items-start gap-4">
              <img
                src={trip.driver?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${trip.driver?.full_name}`}
                alt={trip.driver?.full_name}
                className="w-14 h-14 rounded-xl object-cover border border-[#E6E0D6] shadow-subtle"
              />

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-[#141613]">{trip.driver?.full_name}</h4>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#92400E] bg-[#FEF3C7] px-2.5 py-0.5 rounded border border-[#FDE68A]">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{trip.driver?.rating_avg || 4.9}</span>
                    <span className="text-[#8E9389] font-normal">({trip.driver?.rating_count || 12} avis)</span>
                  </div>
                </div>

                <p className="text-xs text-[#5C6057] leading-relaxed">
                  {trip.driver?.bio || 'Conducteur vérifié de la communauté DZ-CarPool.'}
                </p>

                <div className="flex items-center gap-4 text-xs text-[#8E9389] pt-2">
                  <span>Wilaya : <strong className="text-[#32362F]">{trip.driver?.wilaya_name || 'Alger'}</strong></span>
                  <span>•</span>
                  <span>Trajets effectués : <strong className="text-[#32362F]">{trip.driver?.trips_completed_count || 8}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Vehicle Details */}
          {trip.vehicle && (
            <div className="bg-white rounded-xl border border-[#E6E0D6] p-6 sm:p-8 shadow-card space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#8E9389] border-b border-[#F3EFE8] pb-3">
                Véhicule Utilisé
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-[#8E9389] block">Modèle</span>
                  <span className="font-bold text-[#141613]">{trip.vehicle.make} {trip.vehicle.model}</span>
                </div>
                <div>
                  <span className="text-[#8E9389] block">Année & Couleur</span>
                  <span className="font-bold text-[#141613]">{trip.vehicle.year} • {trip.vehicle.color}</span>
                </div>
                <div>
                  <span className="text-[#8E9389] block">Climatisation</span>
                  <span className="font-bold text-[#173C2C]">{trip.vehicle.air_conditioning ? 'Oui (Climatisé)' : 'Standard'}</span>
                </div>
                <div>
                  <span className="text-[#8E9389] block">Immatriculation</span>
                  <span className="font-mono text-[#32362F]">{trip.vehicle.license_plate}</span>
                </div>
              </div>
            </div>
          )}

          {/* Link to coordination chat */}
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E0D6] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5 text-[#5C6057] font-medium">
              <MessageCircle className="w-4 h-4 text-[#173C2C]" />
              <span>Messagerie de coordination de trajet disponible pour les membres confirmés.</span>
            </div>
            <Link
              to={`/trips/${trip.id}/chat`}
              className="text-[#173C2C] hover:text-[#112E22] font-bold hover:underline"
            >
              Accéder au fil
            </Link>
          </div>
        </div>

        {/* Right Column (5 cols): Sticky Booking Form & Price Breakdown */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
          <div className="bg-white rounded-xl border border-[#E6E0D6] p-6 sm:p-8 shadow-card space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#F3EFE8]">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8E9389]">
                Réservation de Place
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold bg-[#E1EDE6] text-[#173C2C] border border-[#C2DBCF]">
                <Users className="w-3.5 h-3.5" />
                <span>{trip.available_seats} place{trip.available_seats > 1 ? 's' : ''} libre{trip.available_seats > 1 ? 's' : ''}</span>
              </span>
            </div>

            {/* Seat Count Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#32362F]">
                Nombre de places souhaitées
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].filter((n) => n <= trip.available_seats).map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setSeatCount(num)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                      seatCount === num
                        ? 'bg-[#173C2C] text-white border-[#173C2C] shadow-subtle'
                        : 'bg-[#FAF8F5] text-[#32362F] border-[#E6E0D6] hover:bg-[#F3EFE8]'
                    }`}
                  >
                    {num} place{num > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Comfort Option Selection (if enabled) */}
            {trip.comfort_enabled && (
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-[#32362F] flex items-center justify-between">
                  <span>Type de siège</span>
                  <span className="text-[#6B21A8] font-bold text-[11px]">+30% sur la base</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSeatType('standard')}
                    className={`py-2.5 px-3 rounded-lg border text-xs font-bold text-left transition-all ${
                      seatType === 'standard'
                        ? 'bg-[#E1EDE6] border-[#C2DBCF] text-[#173C2C] shadow-subtle'
                        : 'bg-[#FAF8F5] border-[#E6E0D6] text-[#5C6057] hover:bg-[#F3EFE8]'
                    }`}
                  >
                    <span className="block font-bold">Standard</span>
                    <span className="text-[10px] text-[#8E9389]">Places arrière confort</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSeatType('comfort')}
                    className={`py-2.5 px-3 rounded-lg border text-xs font-bold text-left transition-all ${
                      seatType === 'comfort'
                        ? 'bg-[#F3E8FF] border-[#E9D5FF] text-[#6B21A8] shadow-subtle'
                        : 'bg-[#FAF8F5] border-[#E6E0D6] text-[#5C6057] hover:bg-[#F3EFE8]'
                    }`}
                  >
                    <span className="block font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#6B21A8]" />
                      <span>Trajet Confort</span>
                    </span>
                    <span className="text-[10px] text-[#6B21A8]">Place avant garantie</span>
                  </button>
                </div>
              </div>
            )}

            {/* Price Breakdown Component */}
            <PriceBreakdown
              basePrice={trip.base_seat_price}
              seatCount={seatCount}
              seatType={seatType}
              showDriverPayout={true}
            />

            {/* Error or Success notification */}
            {bookingError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{bookingError}</span>
              </div>
            )}

            {bookingSuccess ? (
              <div className="p-4 bg-[#E1EDE6] border border-[#C2DBCF] rounded-lg text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#173C2C] mx-auto" />
                <h4 className="text-sm font-bold text-[#173C2C]">Demande de réservation envoyée !</h4>
                <p className="text-xs text-[#1E4D38] leading-relaxed">
                  Le conducteur a été notifié et doit approuver manuellement votre demande. Vos places sont bloquées temporairement.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/passenger')}
                  className="mt-2 w-full py-2 px-4 rounded-lg bg-[#173C2C] hover:bg-[#112E22] text-white font-bold text-xs"
                >
                  Voir mes réservations
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleBooking}
                disabled={bookingLoading || trip.available_seats === 0}
                className="w-full py-3.5 rounded-lg bg-[#173C2C] hover:bg-[#112E22] disabled:bg-[#FAF8F5] disabled:text-[#8E9389] text-white font-bold text-xs shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {bookingLoading ? (
                  <span>Transmission de la demande...</span>
                ) : (
                  <>
                    <span>Demander à réserver ({seatCount} place{seatCount > 1 ? 's' : ''})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}

            <p className="text-[11px] text-[#8E9389] text-center leading-relaxed">
              Le conducteur dispose de 24h pour approuver votre demande. Aucun montant n'est débité avant confirmation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
