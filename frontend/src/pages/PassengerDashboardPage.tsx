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
  const { user } = useAuth();
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
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [user]);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header with Overview */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              Espace Passager
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('dashboard.passenger_title', 'Mes Réservations & Trajets')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Suivez l'état d'approbation de vos réservations et échangez avec vos conducteurs.
          </p>
        </div>

        <button
          onClick={() => navigate('/search')}
          className="inline-flex items-center gap-2 py-2.5 px-5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all active:scale-[0.99]"
        >
          <Search className="w-4 h-4 text-amber-300" />
          <span>Trouver un nouveau trajet</span>
        </button>
      </div>

      {/* 2. Quick Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Total Réservations
          </span>
          <span className="text-2xl font-black text-slate-900 tabular-nums mt-1 block">
            {bookings.length}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            En Attente de Validation
          </span>
          <span className="text-2xl font-black text-amber-600 tabular-nums mt-1 block">
            {pendingCount}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Confirmées & Garanties
          </span>
          <span className="text-2xl font-black text-emerald-700 tabular-nums mt-1 block">
            {confirmedCount}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            Tarif Garanti DZD
          </span>
          <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mt-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            15% commission incluse
          </span>
        </div>
      </div>

      {/* 3. Bookings List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-40 rounded-2xl bg-white border border-slate-200 animate-pulse p-6" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
            <Calendar className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">{t('dashboard.no_bookings', 'Aucune réservation enregistrée')}</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Vous n'avez pas encore réservé de place. Trouvez un trajet parmi les départs disponibles.
            </p>
          </div>
          <button
            onClick={() => navigate('/search')}
            className="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Rechercher un trajet</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
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
                  className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row justify-between gap-6 items-start md:items-center hover:border-emerald-600 transition-all"
                >
                  {/* Left: Route, Date, Seats */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <StatusBadge status={booking.status} />
                      <span className="text-[11px] font-medium text-slate-500">
                        Demande #{booking.id} • Enregistrée le {new Date(booking.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {trip && (
                      <div className="flex items-center gap-3 text-base font-black text-slate-900">
                        <span>{trip.origin_city}</span>
                        <ArrowRight className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                        <span>{trip.destination_city}</span>
                        <span className="text-xs font-normal text-slate-400">
                          ({trip.distance_km} km)
                        </span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{departureDate}</span>
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-slate-800">
                        {booking.seat_count} place{booking.seat_count > 1 ? 's' : ''}
                      </span>
                      <span>•</span>
                      <span className={booking.seat_type === 'comfort' ? 'text-amber-800 font-bold' : ''}>
                        {booking.seat_type === 'comfort' ? 'Option Confort (+30%)' : 'Standard'}
                      </span>
                    </div>

                    {booking.rejection_or_cancellation_reason && (
                      <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                        Motif : {booking.rejection_or_cancellation_reason}
                      </p>
                    )}
                  </div>

                  {/* Right: Price & Quick Actions */}
                  <div className="text-left md:text-right flex-shrink-0 flex md:flex-col justify-between w-full md:w-auto items-center md:items-end pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
                        Montant total passager
                      </span>
                      <div className="text-2xl font-black text-slate-900 tabular-nums">
                        {booking.quoted_total_price} <span className="text-xs font-extrabold text-slate-500">DA</span>
                      </div>
                      <span className="text-[10px] text-emerald-700 block">
                        Commission 15% incluse
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {trip && (
                        <>
                          <button
                            type="button"
                            onClick={() => navigate(`/trips/${trip.id}/chat`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 hover:text-emerald-700 hover:border-emerald-600 transition-colors shadow-2xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Chat</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => navigate(`/trips/${trip.id}`)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                            <span>Détails</span>
                          </button>
                        </>
                      )}

                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <button
                          type="button"
                          onClick={() => openCancelModal(booking.id)}
                          disabled={actionLoading === booking.id}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-800 hover:bg-rose-100 text-xs font-bold border border-rose-200 transition-colors"
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
        </div>
      )}

      {/* Cancellation Modal Dialog */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => setCancelModalOpen(false)}
        title="Annuler la réservation"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Êtes-vous sûr de vouloir annuler votre réservation ? Votre place sera immédiatement remise à disposition d'autres voyageurs.
          </p>

          <div className="space-y-1">
            <label className="block text-[11px] font-bold text-slate-500 uppercase">
              Motif de l'annulation (optionnel) :
            </label>
            <input
              type="text"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setCancelModalOpen(false)}
              className="py-2 px-4 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Conserver ma place
            </button>
            <button
              type="button"
              onClick={confirmCancel}
              disabled={actionLoading !== null}
              className="py-2 px-4 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition-colors shadow-xs"
            >
              {actionLoading !== null ? 'Annulation...' : 'Confirmer l’annulation'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};