import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { Trip, Booking } from '../types';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';
import {
  Car,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  MessageCircle,
  PlusCircle,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Wallet,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export const DriverDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reject Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false);
  const [targetBookingId, setTargetBookingId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('Désolé, indisponibilité imprévue');

  const fetchDriverTrips = async () => {
    setLoading(true);
    try {
      const data = await api.getMyDriverTrips();
      setTrips(data);
      if (data.length > 0 && !selectedTrip) {
        setSelectedTrip(data[0]);
        const bData = await api.getTripBookings(data[0].id);
        setBookings(bData);
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement des trajets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchDriverTrips();
  }, [user]);

  const selectTrip = async (trip: Trip) => {
    setSelectedTrip(trip);
    try {
      const bData = await api.getTripBookings(trip.id);
      setBookings(bData);
    } catch {
      setBookings([]);
    }
  };

  const handleApprove = async (bookingId: number) => {
    setActionLoading(bookingId);
    try {
      await api.approveBooking(bookingId);
      if (selectedTrip) {
        const updated = await api.getTripBookings(selectedTrip.id);
        setBookings(updated);
        const refreshedTrips = await api.getMyDriverTrips();
        setTrips(refreshedTrips);
        const updatedCurrent = refreshedTrips.find((t) => t.id === selectedTrip.id);
        if (updatedCurrent) setSelectedTrip(updatedCurrent);
      }
    } catch (err: any) {
      alert(err.message || "Erreur lors de l'approbation");
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectModal = (bookingId: number) => {
    setTargetBookingId(bookingId);
    setRejectReason('Désolé, indisponibilité imprévue');
    setRejectModalOpen(true);
  };

  const confirmReject = async () => {
    if (!targetBookingId) return;
    setActionLoading(targetBookingId);
    try {
      await api.rejectBooking(targetBookingId, rejectReason || undefined);
      if (selectedTrip) {
        const updated = await api.getTripBookings(selectedTrip.id);
        setBookings(updated);
      }
      setRejectModalOpen(false);
      setTargetBookingId(null);
    } catch (err: any) {
      alert(err.message || 'Erreur lors du refus');
    } finally {
      setActionLoading(null);
    }
  };

  // Aggregated quick stats
  const totalAvailableSeats = trips.reduce((acc, t) => acc + (t.available_seats || 0), 0);
  const totalPendingBookings = bookings.filter((b) => b.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header with Stats & New Trip CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E7E2DA]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700 bg-forest-50 px-2.5 py-0.5 rounded border border-forest-200/60">
              Espace Conducteur
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink-900 tracking-tight">
            {t('dashboard.driver_title', 'Tableau de Bord Conducteur')}
          </h1>
          <p className="text-xs sm:text-sm text-ink-600 mt-0.5">
            Gérez vos annonces de trajets, validez les demandes de passagers et suivez vos gains nets en Dinars.
          </p>
        </div>

        <button
          onClick={() => navigate('/trips/create')}
          className="inline-flex items-center gap-2 py-2.5 px-5 bg-forest-700 hover:bg-forest-800 text-[#FAF8F5] font-bold text-xs rounded-xl shadow-subtle hover:shadow-card transition-all"
        >
          <PlusCircle className="w-4 h-4 text-citrus-300" />
          <span>Publier un nouveau trajet</span>
        </button>
      </div>

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#E7E2DA] p-4 shadow-subtle">
          <span className="text-[11px] font-bold text-ink-500 uppercase tracking-wider block">
            Trajets Actifs
          </span>
          <span className="text-2xl font-black text-ink-900 tabular-nums mt-1 block">
            {trips.length}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-[#E7E2DA] p-4 shadow-subtle">
          <span className="text-[11px] font-bold text-ink-500 uppercase tracking-wider block">
            Places Libres Totales
          </span>
          <span className="text-2xl font-black text-forest-700 tabular-nums mt-1 block">
            {totalAvailableSeats}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-[#E7E2DA] p-4 shadow-subtle">
          <span className="text-[11px] font-bold text-ink-500 uppercase tracking-wider block">
            Demandes En Attente
          </span>
          <span className="text-2xl font-black text-citrus-700 tabular-nums mt-1 block">
            {totalPendingBookings}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-[#E7E2DA] p-4 shadow-subtle">
          <span className="text-[11px] font-bold text-ink-500 uppercase tracking-wider block">
            Validation Manuelle
          </span>
          <span className="text-xs font-bold text-forest-800 flex items-center gap-1.5 mt-2">
            <ShieldCheck className="w-4 h-4 text-forest-700" />
            Contrôle total du véhicule
          </span>
        </div>
      </div>

      {/* 3. Main Master-Detail Workarea */}
      {loading ? (
        <div className="h-64 rounded-2xl bg-white border border-[#E7E2DA] animate-pulse p-8" />
      ) : trips.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E7E2DA] p-12 text-center space-y-4 shadow-subtle">
          <div className="w-12 h-12 rounded-full bg-forest-50 border border-forest-100 text-forest-700 flex items-center justify-center mx-auto">
            <Car className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-ink-900">{t('dashboard.no_trips', 'Vous n’avez publié aucun trajet')}</h3>
            <p className="text-xs text-ink-500 max-w-md mx-auto">
              Partagez vos frais de carburant en publiant votre premier trajet inter-wilayas dès aujourd’hui.
            </p>
          </div>
          <button
            onClick={() => navigate('/trips/create')}
            className="inline-flex items-center gap-2 py-2.5 px-6 rounded-xl bg-forest-700 hover:bg-forest-800 text-[#FAF8F5] text-xs font-bold shadow-subtle transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publier mon premier trajet</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (5 cols): Published Trips List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-ink-500">
                Vos annonces ({trips.length})
              </h2>
              <span className="text-[11px] text-ink-400">Cliquez pour gérer</span>
            </div>

            <div className="space-y-3">
              {trips.map((trip) => {
                const isSelected = selectedTrip?.id === trip.id;
                const depDate = new Date(trip.departure_datetime).toLocaleDateString('fr-DZ', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={trip.id}
                    onClick={() => selectTrip(trip)}
                    className={`cursor-pointer rounded-xl p-4 border transition-all text-left ${
                      isSelected
                        ? 'bg-forest-50/70 border-forest-700 shadow-card ring-1 ring-forest-700'
                        : 'bg-white border-[#E7E2DA] hover:border-forest-600'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-ink-500 mb-1.5">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3 h-3 text-forest-700" />
                        {depDate}
                      </span>
                      <span className="font-bold text-forest-700 tabular-nums">
                        {trip.available_seats} / {trip.total_seats} libres
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-ink-900 flex items-center gap-2">
                      <span>{trip.origin_city}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-forest-700 flex-shrink-0" />
                      <span>{trip.destination_city}</span>
                    </h3>

                    <div className="mt-3 pt-2.5 border-t border-[#F4EFEB] flex items-center justify-between text-xs">
                      <span className="text-ink-600 font-semibold tabular-nums">
                        Net conducteur : <strong>{trip.base_seat_price} DA</strong>
                      </span>
                      {trip.comfort_enabled && (
                        <span className="text-[10px] font-bold text-citrus-800 bg-citrus-50 px-2 py-0.5 rounded border border-citrus-200">
                          Confort (+30%)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (7 cols): Selected Trip & Passenger Bookings Management */}
          <div className="lg:col-span-7 space-y-6">
            {selectedTrip && (
              <div className="bg-white rounded-2xl border border-[#E7E2DA] p-6 shadow-subtle space-y-6">
                {/* Header of selected trip */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#F4EFEB]">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-forest-700 uppercase tracking-wider bg-forest-50 px-2 py-0.5 rounded border border-forest-200/60">
                      Gestion des réservations
                    </span>
                    <h3 className="text-lg font-black text-ink-900 flex items-center gap-2">
                      <span>{selectedTrip.origin_city}</span>
                      <ArrowRight className="w-4 h-4 text-forest-700" />
                      <span>{selectedTrip.destination_city}</span>
                    </h3>
                    <p className="text-xs text-ink-500">
                      Départ : {new Date(selectedTrip.departure_datetime).toLocaleString('fr-DZ')} • {selectedTrip.distance_km} km
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={() => navigate(`/trips/${selectedTrip.id}/chat`)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#DED7CE] bg-[#FAF8F5] text-xs font-bold text-ink-800 hover:text-forest-700 hover:border-forest-600 transition-colors shadow-xs"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-forest-700" />
                      <span>Chat du trajet</span>
                    </button>
                    <button
                      onClick={() => navigate(`/trips/${selectedTrip.id}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#DED7CE] hover:bg-[#F4EFEB] text-xs font-bold text-ink-800 transition-colors shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-ink-500" />
                      <span>Fiche</span>
                    </button>
                  </div>
                </div>

                {/* Capacity breakdown bar */}
                <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E7E2DA] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-ink-700">Remplissage du véhicule :</span>
                    <span className="font-bold text-forest-700 tabular-nums">
                      {selectedTrip.total_seats - selectedTrip.available_seats} / {selectedTrip.total_seats} sièges réservés
                    </span>
                  </div>
                  <div className="w-full bg-[#E7E2DA] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-forest-700 h-full rounded-full transition-all"
                      style={{
                        width: `${((selectedTrip.total_seats - selectedTrip.available_seats) / selectedTrip.total_seats) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Bookings List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-ink-700">
                      Demandes de réservation reçues ({bookings.length})
                    </h4>
                    <span className="text-[11px] text-ink-400">
                      Approbation atomique sécurisée
                    </span>
                  </div>

                  {bookings.length === 0 ? (
                    <div className="p-8 text-center text-ink-500 text-xs bg-[#FAF8F5] rounded-xl border border-dashed border-[#DED7CE]">
                      Aucune demande reçue pour ce trajet pour le moment.
                    </div>
                  ) : (
                    <div className="divide-y divide-[#F4EFEB]">
                      {bookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-start gap-3">
                            <img
                              src={booking.passenger?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${booking.passenger?.full_name || 'DZ'}`}
                              alt={booking.passenger?.full_name}
                              className="w-10 h-10 rounded-full border border-[#DED7CE] object-cover flex-shrink-0"
                            />
                            <div className="space-y-0.5">
                              <h5 className="text-xs font-bold text-ink-900">
                                {booking.passenger?.full_name}
                              </h5>
                              <p className="text-[11px] text-ink-600 flex flex-wrap items-center gap-1.5">
                                <span>{booking.seat_count} place{booking.seat_count > 1 ? 's' : ''}</span>
                                <span>•</span>
                                <span className={booking.seat_type === 'comfort' ? 'text-citrus-800 font-bold' : ''}>
                                  {booking.seat_type === 'comfort' ? 'Siège Confort (+30%)' : 'Standard'}
                                </span>
                                <span>•</span>
                                <span className="font-bold text-forest-700">
                                  Gain net : {booking.driver_payout} DA
                                </span>
                              </p>
                              {booking.rejection_or_cancellation_reason && (
                                <p className="text-[10px] text-ink-500 italic mt-0.5">
                                  Motif : {booking.rejection_or_cancellation_reason}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
                            <StatusBadge status={booking.status} size="sm" />

                            {booking.status === 'pending' && (
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleApprove(booking.id)}
                                  disabled={actionLoading === booking.id || selectedTrip.available_seats < booking.seat_count}
                                  className="inline-flex items-center gap-1 py-1.5 px-3 rounded-lg bg-forest-700 hover:bg-forest-800 disabled:bg-ink-200 text-white font-bold text-xs shadow-xs transition-colors"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>Accepter</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openRejectModal(booking.id)}
                                  disabled={actionLoading === booking.id}
                                  className="inline-flex items-center gap-1 py-1.5 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs border border-rose-200 transition-colors"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>Refuser</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Polite Rejection Modal (In-App, No crude window.prompt) */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Refuser la demande de réservation"
      >
        <div className="space-y-4">
          <p className="text-xs text-ink-600 leading-relaxed">
            Veuillez indiquer le motif du refus pour en informer poliment le passager :
          </p>

          <div className="space-y-2">
            {[
              "Désolé, indisponibilité imprévue",
              "Complet hors-ligne (amis / proches)",
              "Modification de l'horaire de départ",
              "Bagages trop volumineux pour le véhicule",
            ].map((reason) => (
              <label
                key={reason}
                className="flex items-center gap-2 p-2.5 rounded-lg border border-[#E7E2DA] hover:bg-white cursor-pointer text-xs font-semibold text-ink-800 transition-colors"
              >
                <input
                  type="radio"
                  name="reject_reason"
                  checked={rejectReason === reason}
                  onChange={() => setRejectReason(reason)}
                  className="text-forest-700 focus:ring-forest-600"
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>

          <div className="space-y-1 pt-1">
            <label className="block text-[11px] font-bold text-ink-500 uppercase">
              Ou motif personnalisé :
            </label>
            <input
              type="text"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full rounded-xl border border-[#DED7CE] bg-white p-2.5 text-xs text-ink-900 focus:outline-none focus:border-forest-600"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E7E2DA]">
            <button
              type="button"
              onClick={() => setRejectModalOpen(false)}
              className="py-2 px-4 rounded-lg bg-white border border-[#DED7CE] text-xs font-bold text-ink-700 hover:bg-[#F4EFEB] transition-colors"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={confirmReject}
              disabled={actionLoading !== null}
              className="py-2 px-4 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold transition-colors shadow-xs"
            >
              {actionLoading !== null ? 'Traitement...' : 'Confirmer le refus'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
