import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { Booking } from '../types';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import {
  CalendarCheck,
  Calendar,
  Clock,
  ArrowRight,
  MessageCircle,
  AlertCircle,
  Car,
  Compass,
  Star,
  Users,
  XCircle,
} from 'lucide-react';

export const PassengerDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Cancellation Modal
  const [cancelModalOpen, setCancelModalOpen] = useState<boolean>(false);
  const [targetBookingId, setTargetBookingId] = useState<number | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await api.getMyPassengerBookings();
      setBookings(data);
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des réservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (user) {
      fetchBookings();
    }
  }, [user, authLoading, navigate]);

  const openCancelModal = (bookingId: number) => {
    setTargetBookingId(bookingId);
    setCancelModalOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!targetBookingId) return;
    setActionLoading(targetBookingId);
    try {
      await api.cancelBooking(targetBookingId);
      setCancelModalOpen(false);
      fetchBookings();
    } catch (err: any) {
      alert(err.message || "Erreur lors de l'annulation de la réservation");
    } finally {
      setActionLoading(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="h-96 rounded-xl bg-[#131D2E] border border-[#1E2C42] animate-pulse p-8" />
      </div>
    );
  }

  const activeBookings = bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending');
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;
  const totalSpent = bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((sum, b) => sum + (b.total_price || b.quoted_total_price || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E2C42]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#60A5FA] bg-[#172554] px-2 py-0.5 rounded border border-[#2563EB]/40">
              Espace Passager
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-300 font-semibold">{user?.full_name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Mes Réservations & Voyages
          </h1>
        </div>

        <Link
          to="/search"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all"
        >
          <Compass className="w-4 h-4" />
          <span>Trouver un autre trajet</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-[#131D2E] p-5 rounded-xl border border-[#1E2C42] shadow-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>Réservations actives</span>
            <CalendarCheck className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <div className="text-2xl font-black text-white">{activeBookings.length}</div>
          <span className="text-[11px] text-slate-400 block">En attente ou confirmées</span>
        </div>

        <div className="bg-[#131D2E] p-5 rounded-xl border border-[#1E2C42] shadow-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-[#60A5FA] font-bold uppercase tracking-wider">
            <span>Places confirmées</span>
            <Users className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <div className="text-2xl font-black text-[#60A5FA]">{confirmedCount}</div>
          <span className="text-[11px] text-slate-400 block">Approuvées par le conducteur</span>
        </div>

        <div className="bg-[#131D2E] p-5 rounded-xl border border-[#1E2C42] shadow-xl space-y-1 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>Total des contributions</span>
            <span className="text-xs font-bold text-slate-400">DZD</span>
          </div>
          <div className="text-2xl font-black text-[#60A5FA] tabular-nums">
            {totalSpent.toLocaleString('fr-DZ')} DA
          </div>
          <span className="text-[11px] text-slate-400 block">Total réglé pour vos trajets</span>
        </div>
      </div>

      {/* Bookings Feed */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          Historique de vos réservations ({bookings.length})
        </h2>

        {bookings.length === 0 ? (
          <div className="bg-[#131D2E] rounded-xl border border-[#1E2C42] p-12 text-center space-y-4 shadow-xl">
            <Car className="w-10 h-10 text-slate-500 mx-auto" />
            <h3 className="text-base font-bold text-white">Vous n'avez pas encore de réservations</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Consultez les trajets disponibles au départ de votre wilaya et voyagez en toute confiance.
            </p>
            <Link
              to="/search"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-colors"
            >
              <Compass className="w-4 h-4" />
              <span>Explorer les trajets</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => {
              const trip = booking.trip;
              const depDate = trip ? new Date(trip.departure_datetime) : new Date(booking.created_at);
              const depDateStr = depDate.toLocaleDateString('fr-DZ', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              });
              const depTimeStr = depDate.toLocaleTimeString('fr-DZ', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={booking.id}
                  className="bg-[#131D2E] rounded-xl border border-[#1E2C42] p-5 sm:p-6 shadow-xl space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1E2C42]">
                    <div className="flex items-center gap-3">
                      <StatusBadge status={booking.status} />
                      <span className="text-xs text-slate-400">
                        Réservé le {new Date(booking.created_at).toLocaleDateString('fr-DZ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {booking.status === 'confirmed' && (
                        <Link
                          to={`/trips/${booking.trip_id}/chat`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#172554] text-[#60A5FA] border border-[#2563EB]/40 font-bold text-xs hover:bg-[#1E3A8A] transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Contacter le conducteur</span>
                        </Link>
                      )}

                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <button
                          type="button"
                          onClick={() => openCancelModal(booking.id)}
                          disabled={actionLoading === booking.id}
                          className="px-3 py-1.5 rounded-lg border border-rose-800 text-rose-300 hover:bg-rose-950/40 text-xs font-bold transition-colors"
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  </div>

                  {trip && (
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Itinerary info */}
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-black text-white">{depTimeStr}</span>
                          <span className="text-xs text-slate-400 font-semibold">• {depDateStr}</span>
                          <span className="text-xs text-slate-400">({trip.distance_km} km)</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-bold text-white">
                          <span>{trip.origin_city}</span>
                          <ArrowRight className="w-4 h-4 text-[#3B82F6]" />
                          <span>{trip.destination_city}</span>
                        </div>

                        <p className="text-xs text-slate-400">
                          Rendez-vous : {trip.origin_address}
                        </p>
                      </div>

                      {/* Driver & Price details */}
                      <div className="flex sm:flex-col justify-between sm:items-end items-center pt-3 sm:pt-0 border-t sm:border-t-0 border-[#1E2C42]">
                        <div className="text-left sm:text-right">
                          <div className="text-xl font-black text-[#60A5FA] tabular-nums">
                            {(booking.total_price || booking.quoted_total_price || 0).toLocaleString('fr-DZ')} DA
                          </div>
                          <span className="text-[10px] text-slate-400 block">
                            {booking.seat_count} place{booking.seat_count > 1 ? 's' : ''} ({booking.seat_type === 'comfort' ? 'Confort' : 'Standard'})
                          </span>
                        </div>

                        {trip.driver && (
                          <div className="mt-2 flex items-center gap-2">
                            <img
                              src={trip.driver.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${trip.driver.full_name}`}
                              alt={trip.driver.full_name}
                              className="w-6 h-6 rounded-full object-cover border border-[#2563EB]/40"
                            />
                            <span className="text-xs text-white font-semibold">
                              {trip.driver.full_name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancellation Confirmation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Annuler ma réservation"
      >
        <div className="space-y-4 text-left">
          <p className="text-xs text-slate-300 leading-relaxed">
            Êtes-vous sûr de vouloir annuler cette réservation ? La place sera immédiatement libérée pour les autres passagers.
          </p>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1E2C42]">
            <button
              type="button"
              onClick={() => setCancelModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-[#1E2C42] text-xs font-bold text-slate-400 hover:text-white"
            >
              Conserver ma place
            </button>
            <button
              type="button"
              onClick={handleConfirmCancel}
              disabled={actionLoading !== null}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
            >
              {actionLoading !== null ? 'Annulation...' : 'Confirmer l’annulation'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
