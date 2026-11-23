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
  Plus,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Wallet,
  Sparkles,
  AlertCircle,
  Check,
  X,
} from 'lucide-react';

export const DriverDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
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
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    if (user) {
      fetchDriverTrips();
    }
  }, [user, authLoading, navigate]);

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
      {/* 1. Header with Stats & New Trip CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE5DC]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#16382C] bg-[#E2EDE6] px-2.5 py-0.5 rounded border border-[#C4DBCD]">
              Espace Conducteur
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#141716] tracking-tight">
            {t('dashboard.driver_title', 'Tableau de Bord Conducteur')}
          </h1>
          <p className="text-xs sm:text-sm text-[#5A625D] mt-0.5">
            Gérez vos annonces de trajets, validez les demandes de passagers et suivez vos gains nets en Dinars.
          </p>
        </div>

        <button
          onClick={() => navigate('/trips/create')}
          className="inline-flex items-center gap-2 py-2.5 px-5 bg-[#16382C] hover:bg-[#0F281F] text-[#FAF7F2] font-bold text-xs rounded-xl shadow-fine transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 text-[#FAF7F2]" />
          <span>Publier un nouveau trajet</span>
        </button>
      </div>

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#EAE5DC] p-4 shadow-fine">
          <span className="text-[10px] font-bold text-[#7E8681] uppercase tracking-wider block">
            Trajets Actifs
          </span>
          <span className="text-2xl font-black text-[#141716] tabular-nums mt-1 block">
            {trips.length}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-[#EAE5DC] p-4 shadow-fine">
          <span className="text-[10px] font-bold text-[#7E8681] uppercase tracking-wider block">
            Places Libres Totales
          </span>
          <span className="text-2xl font-black text-[#16382C] tabular-nums mt-1 block">
            {totalAvailableSeats}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-[#EAE5DC] p-4 shadow-fine">
          <span className="text-[10px] font-bold text-[#7E8681] uppercase tracking-wider block">
            Demandes En Attente
          </span>
          <span className="text-2xl font-black text-[#A14114] tabular-nums mt-1 block">
            {totalPendingBookings}
          </span>
        </div>

        <div className="bg-white rounded-xl border border-[#EAE5DC] p-4 shadow-fine">
          <span className="text-[10px] font-bold text-[#7E8681] uppercase tracking-wider block">
            Validation Manuelle
          </span>
          <span className="text-xs font-semibold text-[#16382C] flex items-center gap-1.5 mt-2">
            <ShieldCheck className="w-4 h-4 text-[#16382C]" />
            Contrôle total du véhicule
          </span>
        </div>
      </div>

      {/* 3. Main Master-Detail Workarea */}
      {loading ? (
        <div className="h-64 rounded-2xl bg-white border border-[#EAE5DC] animate-pulse p-8" />
      ) : trips.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#EAE5DC] p-12 text-center space-y-4 shadow-fine">
          <div className="w-12 h-12 rounded-lg bg-[#E2EDE6] text-[#16382C] flex items-center justify-center mx-auto border border-[#C4DBCD]">
            <Car className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#141716]">{t('dashboard.no_trips', 'Vous n’avez publié aucun trajet')}</h3>
            <p className="text-xs text-[#5A625D] max-w-md mx-auto">
              Partagez vos frais de carburant en publiant votre premier trajet inter-wilayas dès aujourd’hui.
            </p>
          </div>
          <button
            onClick={() => navigate('/trips/create')}
            className="inline-flex items-center gap-2 py-2.5 px-6 rounded-lg bg-[#16382C] hover:bg-[#0F281F] text-[#FAF7F2] text-xs font-bold shadow-fine transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Publier mon premier trajet</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (5 cols): Published Trips List */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#7E8681]">
                Vos annonces ({trips.length})
              </h2>
              <span className="text-[11px] text-[#7E8681]">Sélectionnez pour gérer</span>
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
                        ? 'bg-white border-[#16382C] shadow-card ring-1 ring-[#16382C]'
                        : 'bg-white border-[#EAE5DC] hover:border-[#16382C]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-[#7E8681] mb-1.5">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3 h-3 text-[#16382C]" />
                        {depDate}
                      </span>
                      <span className="font-bold text-[#16382C] tabular-nums">
                        {trip.available_seats} / {trip.total_seats} libres
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#141716] flex items-center gap-2">
                      <span>{trip.origin_city}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#16382C] flex-shrink-0" />
                      <span>{trip.destination_city}</span>
                    </h3>

                    <div className="mt-3 pt-2.5 border-t border-[#F4EFE6] flex items-center justify-between text-xs">
                      <span className="text-[#5A625D] font-medium tabular-nums">
                        Net conducteur : <strong className="text-[#141716]">{trip.base_seat_price} DA</strong>
                      </span>
                      {trip.comfort_enabled && (
                        <span className="text-[10px] font-bold text-[#16382C] bg-[#E2EDE6] px-2 py-0.5 rounded border border-[#C4DBCD]">
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
              <div className="bg-white rounded-2xl border border-[#EAE5DC] p-6 shadow-fine space-y-6">
                {/* Header of selected trip */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-[#F4EFE6]">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-[#16382C] uppercase tracking-wider bg-[#E2EDE6] px-2 py-0.5 rounded border border-[#C4DBCD]">
                      Gestion des réservations
                    </span>
                    <h3 className="text-lg font-bold text-[#141716] flex items-center gap-2">
                      <span>{selectedTrip.origin_city}</span>
                      <ArrowRight className="w-4 h-4 text-[#16382C]" />
                      <span>{selectedTrip.destination_city}</span>
                    </h3>
                    <p className="text-xs text-[#7E8681]">
                      Départ : {new Date(selectedTrip.departure_datetime).toLocaleString('fr-DZ')} • {selectedTrip.distance_km} km
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={() => navigate(`/trips/${selectedTrip.id}/chat`)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#EAE5DC] bg-[#FAF7F2] text-xs font-semibold text-[#141716] hover:border-[#16382C] transition-colors shadow-fine"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#16382C]" />
                      <span>Chat du trajet</span>
                    </button>
                    <button
                      onClick={() => navigate(`/trips/${selectedTrip.id}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#FAF7F2] border border-[#EAE5DC] hover:bg-[#EAE5DC] text-xs font-semibold text-[#141716] transition-colors shadow-fine"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#7E8681]" />
                      <span>Fiche</span>
                    </button>
                  </div>
                </div>

                {/* Capacity breakdown bar */}
                <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE5DC] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#5A625D]">Remplissage du véhicule :</span>
                    <span className="font-bold text-[#16382C] tabular-nums">
                      {selectedTrip.total_seats - selectedTrip.available_seats} / {selectedTrip.total_seats} sièges réservés
                    </span>
                  </div>
                  <div className="w-full bg-[#EAE5DC] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#16382C] h-full rounded-full transition-all"
                      style={{
                        width: `${((selectedTrip.total_seats - selectedTrip.available_seats) / selectedTrip.total_seats) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Bookings List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#141716]">
                      Demandes de réservation reçues ({bookings.length})
                    </h4>
                    <span className="text-[11px] text-[#7E8681]">
                      Approbation atomique sécurisée
                    </span>
                  </div>

                  {bookings.length === 0 ? (
                    <div className="p-8 text-center text-[#7E8681] text-xs bg-[#FAF7F2] rounded-xl border border-dashed border-[#EAE5DC]">
                      Aucune demande reçue pour ce trajet pour le moment.
                    </div>
                  ) : (
                    <div className="divide-y divide-[#F4EFE6]">
                      {bookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-start gap-3">
                            <img
                              src={booking.passenger?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${booking.passenger?.full_name || 'DZ'}`}
                              alt={booking.passenger?.full_name}
                              className="w-9 h-9 rounded-full border border-[#EAE5DC] object-cover flex-shrink-0"
                            />
                            <div className="space-y-0.5">
                              <h5 className="text-xs font-bold text-[#141716]">
                                {booking.passenger?.full_name}
                              </h5>
                              <p className="text-[11px] text-[#5A625D] flex flex-wrap items-center gap-1.5">
                                <span>{booking.seat_count} place{booking.seat_count > 1 ? 's' : ''}</span>
                                <span>•</span>
                                <span className={booking.seat_type === 'comfort' ? 'text-[#16382C] font-semibold' : ''}>
                                  {booking.seat_type === 'comfort' ? 'Siège Confort (+30%)' : 'Standard'}
                                </span>
                                <span>•</span>
                                <span className="font-bold text-[#16382C]">
                                  Gain net : {booking.driver_payout} DA
                                </span>
                              </p>
                              {booking.rejection_or_cancellation_reason && (
                                <p className="text-[10px] text-[#7E8681] italic mt-0.5">
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
                                  className="inline-flex items-center gap-1 py-1.5 px-3 rounded-lg bg-[#16382C] hover:bg-[#0F281F] disabled:bg-[#D6D9D7] text-[#FAF7F2] font-bold text-xs shadow-fine transition-colors"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Accepter</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openRejectModal(booking.id)}
                                  disabled={actionLoading === booking.id}
                                  className="inline-flex items-center gap-1 py-1.5 px-2.5 rounded-lg bg-[#FCF7F3] hover:bg-[#F8ECE3] text-[#A14114] font-semibold text-xs border border-[#F0D5C3] transition-colors"
                                >
                                  <X className="w-3.5 h-3.5" />
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

      {/* Polite Rejection Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Refuser la demande de réservation"
      >
        <div className="space-y-4 text-left">
          <p className="text-xs text-[#5A625D] leading-relaxed">
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
                className="flex items-center gap-2 p-2.5 rounded-lg border border-[#EAE5DC] hover:bg-[#FAF7F2] cursor-pointer text-xs font-semibold text-[#141716] transition-colors"
              >
                <input
                  type="radio"
                  name="reject_reason"
                  checked={rejectReason === reason}
                  onChange={() => setRejectReason(reason)}
                  className="text-[#16382C] focus:ring-[#16382C]"
                />
                <span>{reason}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-2.5 pt-4 border-t border-[#F4EFE6]">
            <button
              type="button"
              onClick={() => setRejectModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-[#EAE5DC] text-xs font-semibold text-[#5A625D] hover:bg-[#FAF7F2]"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={confirmReject}
              disabled={actionLoading !== null}
              className="px-4 py-2 rounded-lg bg-[#A14114] hover:bg-[#823414] text-white text-xs font-bold transition-colors"
            >
              Confirmer le refus
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
