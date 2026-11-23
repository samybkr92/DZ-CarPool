import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { Booking } from '../types';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import {
  Calendar,
  MapPin,
  Car,
  MessageCircle,
  AlertCircle,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Search,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const PassengerDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Cancellation Modal State
  const [cancelModalOpen, setCancelModalOpen] = useState<boolean>(false);
  const [targetBookingId, setTargetBookingId] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState<string>('Imprévu personnel');

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
    setCancelReason('Imprévu personnel');
    setCancelModalOpen(true);
  };

  const confirmCancel = async () => {
    if (!targetBookingId) return;
    setActionLoading(targetBookingId);
    try {
      await api.cancelBooking(targetBookingId, cancelReason);
      await fetchBookings();
      setCancelModalOpen(false);
      setTargetBookingId(null);
    } catch (err: any) {
      alert(err.message || "Erreur lors de l'annulation");
    } finally {
      setActionLoading(null);
    }
  };

  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedCount = bookings.filter((b) => b.status === 'confirmed').length;

  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-pulse text-left">
        <div className="h-8 w-64 bg-[#EAE5DC] rounded-lg" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-white rounded-xl border border-[#EAE5DC]" />
          ))}
        </div>
        <div className="h-96 bg-white rounded-2xl border border-[#EAE5DC]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* 1. Header with Overview */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE5DC]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#16382C] bg-[#E2EDE6] px-2.5 py-0.5 rounded border border-[#C4DBCD]">
              Espace Passager
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#141716] tracking-tight">
            {t('dashboard.passenger_title', 'Mes Réservations & Trajets')}
          </h1>
          <p className="text-xs sm:text-sm text-[#5A625D] mt-0.5">
            Suivez l'état d'approbation de vos réservations et échangez avec vos conducteurs.
          </p>
        </div>

        <button
          onClick={() => navigate('/search')}
          className="inline-flex items-center gap-2 py-2.5 px-5 bg-[#16382C] hover:bg-[#0F281F] text-[#FAF7F2] font-bold text-xs rounded-xl shadow-fine transition-all active:scale-[0.98]"
        >
          <Search className="w-4 h-4 text-[#FAF7F2]" />
          <span>Trouver un nouveau trajet</span>
        </button>
      </div>

      {/* 2. Quick Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#EAE5DC] p-4 shadow-fine">
          <span className="text-[10px] font-bold text-[#7E8681] uppercase tracking-wider block">
            Total Réservations
          </span>
          <span className="text-2xl font-black text-[#141716] tabular-nums mt-1 block">
            {bookings.length}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-[#EAE5DC] p-4 shadow-fine">
          <span className="text-[10px] font-bold text-[#7E8681] uppercase tracking-wider block">
            En Attente de Validation
          </span>
          <span className="text-2xl font-black text-[#A14114] tabular-nums mt-1 block">
            {pendingCount}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-[#EAE5DC] p-4 shadow-fine">
          <span className="text-[10px] font-bold text-[#7E8681] uppercase tracking-wider block">
            Confirmées & Garanties
          </span>
          <span className="text-2xl font-black text-[#16382C] tabular-nums mt-1 block">
            {confirmedCount}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-[#EAE5DC] p-4 shadow-fine">
          <span className="text-[10px] font-bold text-[#7E8681] uppercase tracking-wider block">
            Tarif Garanti DZD
          </span>
          <span className="text-xs font-semibold text-[#16382C] flex items-center gap-1.5 mt-2">
            <ShieldCheck className="w-4 h-4 text-[#16382C]" />
            15% commission incluse
          </span>
        </div>
      </div>

      {/* 3. Bookings List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-40 rounded-2xl bg-white border border-[#EAE5DC] animate-pulse p-6" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#EAE5DC] p-12 text-center space-y-4 shadow-fine">
          <div className="w-12 h-12 rounded-lg bg-[#E2EDE6] text-[#16382C] flex items-center justify-center mx-auto border border-[#C4DBCD]">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#141716]">{t('dashboard.no_bookings', 'Aucune réservation enregistrée')}</h3>
            <p className="text-xs text-[#5A625D] max-w-md mx-auto">
              Vous n'avez pas encore réservé de place. Trouvez un trajet parmi les départs disponibles.
            </p>
          </div>
          <button
            onClick={() => navigate('/search')}
            className="inline-flex items-center gap-2 py-2.5 px-6 rounded-lg bg-[#16382C] hover:bg-[#0F281F] text-[#FAF7F2] text-xs font-bold shadow-fine transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Rechercher un trajet</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#7E8681] px-1">
            Historique de vos demandes
          </h2>

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
                  className="bg-white rounded-2xl border border-[#EAE5DC] p-5 sm:p-6 shadow-fine flex flex-col md:flex-row justify-between gap-6 items-start md:items-center hover:border-[#16382C] transition-all"
                >
                  {/* Left: Route, Date, Seats */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <StatusBadge status={booking.status} />
                      <span className="text-[11px] font-medium text-[#7E8681]">
                        Demande #{booking.id} • Enregistrée le {new Date(booking.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {trip ? (
                      <div>
                        <h3 className="text-base font-bold text-[#141716] flex items-center gap-2">
                          <span>{trip.origin_city}</span>
                          <ArrowRight className="w-4 h-4 text-[#16382C]" />
                          <span>{trip.destination_city}</span>
                        </h3>
                        <p className="text-xs text-[#5A625D] flex items-center gap-2 mt-1">
                          <Calendar className="w-3.5 h-3.5 text-[#16382C]" />
                          <span>{departureDate}</span>
                          <span>•</span>
                          <span>Conducteur : <strong>{trip.driver?.full_name}</strong></span>
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-[#7E8681] italic">Détails du trajet en cours d'actualisation...</p>
                    )}

                    <div className="flex items-center gap-3 text-xs text-[#5A625D]">
                      <span>{booking.seat_count} place{booking.seat_count > 1 ? 's' : ''}</span>
                      <span>•</span>
                      <span className={booking.seat_type === 'comfort' ? 'text-[#16382C] font-semibold' : ''}>
                        {booking.seat_type === 'comfort' ? 'Option Confort (+30%)' : 'Standard'}
                      </span>
                      <span>•</span>
                      <span className="font-bold text-[#141716]">
                        Total TTC : {booking.quoted_total_price || booking.total_price} DA
                      </span>
                    </div>

                    {booking.rejection_or_cancellation_reason && (
                      <p className="text-xs text-[#A14114] bg-[#FCF7F3] p-2 rounded-lg border border-[#F0D5C3]">
                        Motif : {booking.rejection_or_cancellation_reason}
                      </p>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                    {trip && (
                      <button
                        onClick={() => navigate(`/trips/${trip.id}/chat`)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#EAE5DC] bg-[#FAF7F2] hover:bg-[#EAE5DC] text-[#141716] text-xs font-semibold transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-[#16382C]" />
                        <span>Chat</span>
                      </button>
                    )}

                    {trip && (
                      <button
                        onClick={() => navigate(`/trips/${trip.id}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#EAE5DC] hover:bg-[#EAE5DC] text-[#141716] text-xs font-semibold transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#7E8681]" />
                        <span>Fiche</span>
                      </button>
                    )}

                    {['pending', 'confirmed'].includes(booking.status) && (
                      <button
                        onClick={() => openCancelModal(booking.id)}
                        disabled={actionLoading === booking.id}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FCF7F3] hover:bg-[#F8ECE3] text-[#A14114] text-xs font-semibold border border-[#F0D5C3] transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Annuler</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Annuler votre réservation"
      >
        <div className="space-y-4 text-left">
          <p className="text-xs text-[#5A625D] leading-relaxed">
            Êtes-vous sûr de vouloir annuler cette réservation ? Vos places seront immédiatement libérées pour d'autres voyageurs.
          </p>

          <div className="space-y-2">
            {[
              "Imprévu personnel",
              "Changement de date de départ",
              "Trouvé un autre moyen de transport",
              "Erreur lors de la réservation",
            ].map((reason) => (
              <label
                key={reason}
                className="flex items-center gap-2 p-2.5 rounded-lg border border-[#EAE5DC] hover:bg-[#FAF7F2] cursor-pointer text-xs font-semibold text-[#141716] transition-colors"
              >
                <input
                  type="radio"
                  name="cancel_reason"
                  checked={cancelReason === reason}
                  onChange={() => setCancelReason(reason)}
                  className="text-[#16382C] focus:ring-[#16382C]"
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-[#F4EFE6]">
            <button
              type="button"
              onClick={() => setCancelModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-[#EAE5DC] text-xs font-semibold text-[#5A625D] hover:bg-[#FAF7F2]"
            >
              Retour
            </button>
            <button
              type="button"
              onClick={confirmCancel}
              disabled={actionLoading !== null}
              className="px-4 py-2 rounded-lg bg-[#A14114] hover:bg-[#823414] text-white text-xs font-bold transition-colors"
            >
              Confirmer l'annulation
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
