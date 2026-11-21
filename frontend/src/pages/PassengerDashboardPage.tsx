import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { Booking } from '../types';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import {
  Calendar,
  MapPin,
  Car,
  MessageCircle,
  AlertCircle,
  XCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const PassengerDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await api.getMyPassengerBookings();
      setBookings(data);
    } catch (err: any) {
      setError(err.message || 'Impossible de charger vos réservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [user]);

  const handleCancel = async (bookingId: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return;
    setActionLoading(bookingId);
    try {
      await api.cancelBooking(bookingId, 'Annulation par le passager');
      await fetchBookings();
    } catch (err: any) {
      alert(err.message || "Erreur lors de l'annulation");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {t('dashboard.passenger_title')}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {t('dashboard.passenger_subtitle')}
        </p>
      </div>

      {loading ? (
        <div className="h-48 rounded-2xl bg-gray-100 animate-pulse" />
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-4">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto" />
          <p className="text-base font-bold text-gray-700">{t('dashboard.no_bookings')}</p>
          <button
            onClick={() => navigate('/search')}
            className="py-2.5 px-6 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
          >
            Rechercher un trajet maintenant
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {bookings.map((booking) => {
            const trip = booking.trip;
            const departureDate = trip
              ? new Date(trip.departure_datetime).toLocaleDateString('fr-DZ', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '';

            return (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6 items-start md:items-center"
              >
                {/* Left: Route and Status */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <StatusBadge status={booking.status} />
                    <span className="text-xs text-gray-400">
                      Réservation #{booking.id} • {new Date(booking.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {trip && (
                    <div className="flex items-center gap-2 text-base font-bold text-gray-900">
                      <span>{trip.origin_city}</span>
                      <ArrowRight className="w-4 h-4 text-emerald-600" />
                      <span>{trip.destination_city}</span>
                      <span className="text-xs font-normal text-gray-400">({trip.distance_km} km)</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
                    <span className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {departureDate}
                    </span>
                    <span>•</span>
                    <span>{booking.seat_count} place(s)</span>
                    <span>•</span>
                    <span className={booking.seat_type === 'comfort' ? 'text-amber-700 font-bold' : ''}>
                      {booking.seat_type === 'comfort' ? 'Option Confort (+30%)' : 'Standard'}
                    </span>
                  </div>

                  {booking.rejection_or_cancellation_reason && (
                    <p className="text-xs text-gray-500 italic bg-gray-50 p-2 rounded-lg">
                      Motif : {booking.rejection_or_cancellation_reason}
                    </p>
                  )}
                </div>

                {/* Right: Price & Actions */}
                <div className="text-left md:text-right flex-shrink-0 flex md:flex-col justify-between w-full md:w-auto items-center md:items-end pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 gap-3">
                  <div>
                    <div className="text-[11px] text-gray-400 font-medium">Montant garanti</div>
                    <div className="text-xl font-black text-emerald-700">
                      {booking.quoted_total_price} <span className="text-xs">DA</span>
                    </div>
                    <div className="text-[10px] text-gray-400">
                      (Base: {booking.quoted_base_price} + Com: {booking.quoted_commission} {booking.quoted_comfort_fee > 0 ? `+ Confort: ${booking.quoted_comfort_fee}` : ''})
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {trip && (
                      <button
                        onClick={() => navigate(`/trips/${trip.id}/chat`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:text-emerald-700 hover:border-emerald-600 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Chat</span>
                      </button>
                    )}

                    {['pending', 'confirmed'].includes(booking.status) && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        disabled={actionLoading === booking.id}
                        className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-rose-50 hover:text-rose-700 text-xs font-bold text-gray-600 transition-colors"
                      >
                        Annuler
                      </button>
                    )}
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
