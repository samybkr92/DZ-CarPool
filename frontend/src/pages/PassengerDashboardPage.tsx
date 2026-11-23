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
        <div className="h-96 rounded-xl bg-white border border-[#E6E0D6] animate-pulse p-8" />
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6E0D6]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#173C2C] bg-[#E1EDE6] px-2 py-0.5 rounded border border-[#C2DBCF]">
              Espace Passager
            </span>
            <span className="text-xs text-[#8E9389]">•</span>
            <span className="text-xs text-[#5C6057] font-semibold">{user?.full_name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#141613] tracking-tight">
            Mes Réservations & Voyages
          </h1>
        </div>

        <Link
          to="/search"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#173C2C] hover:bg-[#112E22] text-white font-bold text-xs shadow-sm transition-all"
        >
          <Compass className="w-4 h-4" />
          <span>Trouver un autre trajet</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E6E0D6] shadow-card space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8E9389] font-bold uppercase tracking-wider">
            <span>Réservations actives</span>
            <CalendarCheck className="w-4 h-4 text-[#173C2C]" />
          </div>
          <div className="text-2xl font-black text-[#141613]">{activeBookings.length}</div>
          <span className="text-[11px] text-[#5C6057] block">En attente ou confirmées</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E6E0D6] shadow-card space-y-1">
          <div className="flex items-center justify-between text-xs text-[#173C2C] font-bold uppercase tracking-wider">
            <span>Places confirmées</span>
            <Users className="w-4 h-4 text-[#173C2C]" />
          </div>
          <div className="text-2xl font-black text-[#173C2C]">{confirmedCount}</div>
          <span className="text-[11px] text-[#5C6057] block">Approuvées par le conducteur</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E6E0D6] shadow-card space-y-1 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-[#8E9389] font-bold uppercase tracking-wider">
            <span>Total des contributions</span>
            <span className="text-xs font-bold text-[#8E9389]">DZD</span>
          </div>
          <div className="text-2xl font-black text-[#173C2C] tabular-nums">
            {totalSpent.toLocaleString('fr-DZ')} DA
          </div>
          <span className="text-[11px] text-[#5C6057] block">Total réglé pour vos trajets</span>
        </div>
      </div>

      {/* Bookings Feed */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#8E9389] px-1">
          Historique de vos réservations ({bookings.length})
        </h2>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E6E0D6] p-12 text-center space-y-3 shadow-card">
            <CalendarCheck className="w-10 h-10 text-[#8E9389] mx-auto" />
            <h3 className="text-base font-bold text-[#141613]">Vous n'avez aucune réservation en cours</h3>
            <p className="text-xs text-[#5C6057] max-w-sm mx-auto leading-relaxed">
              Recherchez un trajet pour voyager entre les wilayas et partager les frais de route avec un conducteur vérifié.
            </p>
            <Link
              to="/search"
              className="inline-block px-5 py-2.5 rounded-lg bg-[#173C2C] hover:bg-[#112E22] text-white font-bold text-xs"
            >
              Rechercher un départ
            </Link>
          </div>
        ) : (
          bookings.map((booking) => {
            const trip = booking.trip;
            const depDate = trip?.departure_datetime
              ? new Date(trip.departure_datetime).toLocaleDateString('fr-DZ', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Date non renseignée';

            return (
              <div
                key={booking.id}
                className="bg-white rounded-xl border border-[#E6E0D6] p-5 sm:p-6 shadow-card hover:shadow-elevated transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-[#141613]">
                        {trip?.origin_city || 'Départ'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-[#173C2C]" />
                      <span className="text-lg font-bold text-[#141613]">
                        {trip?.destination_city || 'Arrivée'}
                      </span>
                    </div>

                    <p className="text-xs text-[#5C6057]">
                      Départ : <strong className="text-[#141613]">{depDate}</strong> • Conducteur : <strong>{trip?.driver?.full_name || 'Amine B.'}</strong>
                    </p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                    <StatusBadge status={booking.status} />
                    <div className="text-right">
                      <span className="text-lg font-black text-[#173C2C] tabular-nums block">
                        {booking.total_price || booking.quoted_total_price} DA
                      </span>
                      <span className="text-[10px] text-[#8E9389]">
                        {booking.seat_count} place{booking.seat_count > 1 ? 's' : ''} • {booking.seat_type === 'comfort' ? 'Confort (+30%)' : 'Standard'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions: Chat & Cancel */}
                <div className="pt-3 border-t border-[#F3EFE8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {trip?.id && (
                      <Link
                        to={`/trips/${trip.id}/chat`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#E6E0D6] hover:bg-[#F3EFE8] text-[#32362F] font-semibold text-xs transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-[#173C2C]" />
                        <span>Messagerie du trajet</span>
                      </Link>
                    )}

                    {trip?.id && (
                      <Link
                        to={`/trips/${trip.id}`}
                        className="text-xs font-semibold text-[#5C6057] hover:text-[#141613] hover:underline"
                      >
                        Voir la fiche complète
                      </Link>
                    )}
                  </div>

                  {booking.status !== 'cancelled' && booking.status !== 'rejected' && (
                    <button
                      type="button"
                      onClick={() => openCancelModal(booking.id)}
                      disabled={actionLoading === booking.id}
                      className="text-xs font-semibold text-rose-700 hover:text-rose-800 hover:underline self-end sm:self-auto"
                    >
                      {actionLoading === booking.id ? 'Annulation...' : 'Annuler ma réservation'}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cancellation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Annuler votre réservation"
      >
        <div className="space-y-4 text-left">
          <p className="text-xs text-[#5C6057] leading-relaxed">
            Êtes-vous sûr de vouloir annuler cette réservation ? Vos places seront immédiatement libérées pour d'autres passagers sur DZ-CarPool.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setCancelModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-[#E6E0D6] text-xs font-bold text-[#5C6057] hover:bg-[#FAF8F5]"
            >
              Conserver ma place
            </button>
            <button
              type="button"
              onClick={handleConfirmCancel}
              disabled={actionLoading !== null}
              className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-subtle"
            >
              Confirmer l'annulation
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
