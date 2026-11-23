import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  ArrowRight,
  Plus,
  MessageCircle,
  ShieldCheck,
  Wallet,
  Sparkles,
  AlertCircle,
  ExternalLink,
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
        const tripData = await api.getTrip(selectedTrip.id);
        setSelectedTrip(tripData);
      }
    } catch (err: any) {
      alert(err.message || "Erreur lors de l'approbation de la réservation");
    } finally {
      setActionLoading(null);
    }
  };

  const openRejectModal = (bookingId: number) => {
    setTargetBookingId(bookingId);
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async () => {
    if (!targetBookingId) return;
    setActionLoading(targetBookingId);
    try {
      await api.rejectBooking(targetBookingId, rejectReason);
      setRejectModalOpen(false);
      if (selectedTrip) {
        const updated = await api.getTripBookings(selectedTrip.id);
        setBookings(updated);
        const tripData = await api.getTrip(selectedTrip.id);
        setSelectedTrip(tripData);
      }
    } catch (err: any) {
      alert(err.message || 'Erreur lors du refus de la réservation');
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

  // Calculate Metrics
  const totalTripsCount = trips.length;
  const pendingRequestsCount = bookings.filter((b) => b.status === 'pending').length;
  const confirmedBookingsCount = bookings.filter((b) => b.status === 'confirmed').length;
  const estimatedNetEarnings = bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((sum, b) => sum + (selectedTrip?.base_seat_price || 0) * b.seat_count, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* 1. Header with Publish CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E2C42]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#60A5FA] bg-[#172554] px-2 py-0.5 rounded border border-[#2563EB]/40">
              Espace Conducteur Certifié
            </span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-300 font-semibold">{user?.full_name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Tableau de bord de vos trajets
          </h1>
        </div>

        <Link
          to="/trips/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau trajet</span>
        </Link>
      </div>

      {/* 2. Key Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#131D2E] p-5 rounded-xl border border-[#1E2C42] shadow-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>Trajets publiés</span>
            <Car className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <div className="text-2xl font-black text-white">{totalTripsCount}</div>
          <span className="text-[11px] text-slate-400 block">Annonces actives</span>
        </div>

        <div className="bg-[#131D2E] p-5 rounded-xl border border-[#1E2C42] shadow-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-amber-400 font-bold uppercase tracking-wider">
            <span>Demandes en attente</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{pendingRequestsCount}</div>
          <span className="text-[11px] text-slate-400 block">Nécessitent votre approbation</span>
        </div>

        <div className="bg-[#131D2E] p-5 rounded-xl border border-[#1E2C42] shadow-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-[#60A5FA] font-bold uppercase tracking-wider">
            <span>Passagers confirmés</span>
            <CheckCircle2 className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <div className="text-2xl font-black text-[#60A5FA]">{confirmedBookingsCount}</div>
          <span className="text-[11px] text-slate-400 block">Réservations validées</span>
        </div>

        <div className="bg-[#131D2E] p-5 rounded-xl border border-[#1E2C42] shadow-xl space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>Rémunération nette</span>
            <Wallet className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <div className="text-2xl font-black text-[#60A5FA] tabular-nums">
            {estimatedNetEarnings.toLocaleString('fr-DZ')} DA
          </div>
          <span className="text-[11px] text-slate-400 block">100% net sans retenue</span>
        </div>
      </div>

      {/* 3. Main Split View: Trips List & Bookings Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Published Trips List */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Vos annonces publiées ({trips.length})
          </h2>

          {trips.length === 0 ? (
            <div className="bg-[#131D2E] rounded-xl border border-[#1E2C42] p-8 text-center space-y-3 shadow-xl">
              <Car className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-sm font-bold text-white">Aucun trajet publié pour l'instant</p>
              <Link
                to="/trips/create"
                className="inline-block text-xs font-bold text-[#60A5FA] hover:underline"
              >
                Créer mon premier trajet
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {trips.map((trip) => {
                const isSelected = selectedTrip?.id === trip.id;
                const depDate = new Date(trip.departure_datetime).toLocaleDateString('fr-DZ', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={trip.id}
                    onClick={() => selectTrip(trip)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? 'bg-[#18253A] border-[#2563EB] shadow-lg shadow-blue-900/30 ring-1 ring-[#2563EB]'
                        : 'bg-[#131D2E] border-[#1E2C42] hover:border-slate-500 hover:bg-[#18253A]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span>{trip.origin_city}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#3B82F6]" />
                        <span>{trip.destination_city}</span>
                      </span>
                      <span className="text-xs font-bold text-[#60A5FA] tabular-nums">
                        {trip.base_seat_price} DA
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{depDate}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{trip.available_seats} place{trip.available_seats > 1 ? 's' : ''} libre{trip.available_seats > 1 ? 's' : ''}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Selected Trip Bookings Management */}
        <div className="lg:col-span-7 space-y-4">
          {selectedTrip ? (
            <div className="bg-[#131D2E] rounded-xl border border-[#1E2C42] p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1E2C42]">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{selectedTrip.origin_city}</span>
                    <ArrowRight className="w-4 h-4 text-[#3B82F6]" />
                    <span>{selectedTrip.destination_city}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(selectedTrip.departure_datetime).toLocaleString('fr-DZ', { dateStyle: 'medium', timeStyle: 'short' })} • {selectedTrip.distance_km} km
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/trips/${selectedTrip.id}/chat`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1E2C42] bg-[#0E1624] text-xs font-bold text-slate-300 hover:text-white hover:border-[#2563EB] transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#3B82F6]" />
                    <span>Messages</span>
                  </Link>
                  <Link
                    to={`/trips/${selectedTrip.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1E2C42] bg-[#0E1624] text-xs font-bold text-slate-300 hover:text-white hover:border-[#2563EB] transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Fiche</span>
                  </Link>
                </div>
              </div>

              {/* Bookings List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Demandes de réservation ({bookings.length})
                </h4>

                {bookings.length === 0 ? (
                  <div className="p-8 rounded-lg bg-[#0E1624] border border-[#1E2C42] text-center space-y-2">
                    <Users className="w-6 h-6 text-slate-500 mx-auto" />
                    <p className="text-xs font-bold text-slate-300">Aucune demande reçue pour ce trajet pour le moment.</p>
                    <p className="text-[11px] text-slate-500">Les nouvelles demandes apparaîtront ici pour approbation manuelle.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="p-4 rounded-xl border border-[#1E2C42] bg-[#0E1624] space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={booking.passenger?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${booking.passenger?.full_name || 'Passager'}`}
                              alt={booking.passenger?.full_name || 'Passager'}
                              className="w-9 h-9 rounded-full object-cover border border-[#2563EB]/40"
                            />
                            <div>
                              <span className="font-bold text-white text-xs block leading-tight">
                                {booking.passenger?.full_name || 'Passager'}
                              </span>
                              <span className="text-[11px] text-slate-400">
                                {booking.passenger?.phone_number || 'Numéro disponible après validation'}
                              </span>
                            </div>
                          </div>

                          <StatusBadge status={booking.status} />
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-[#1E2C42]">
                          <span>
                            {booking.seat_count} place{booking.seat_count > 1 ? 's' : ''} ({booking.seat_type === 'comfort' ? 'Confort' : 'Standard'})
                          </span>
                          <span className="font-bold text-white tabular-nums">
                            {(booking.total_price || booking.quoted_total_price || 0).toLocaleString('fr-DZ')} DA
                          </span>
                        </div>

                        {/* Actions for pending booking */}
                        {booking.status === 'pending' && (
                          <div className="flex items-center gap-2 pt-2 border-t border-[#1E2C42]">
                            <button
                              type="button"
                              onClick={() => handleApprove(booking.id)}
                              disabled={actionLoading === booking.id}
                              className="flex-1 py-2 px-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/30 transition-colors"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{actionLoading === booking.id ? 'Approbation...' : 'Approuver'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => openRejectModal(booking.id)}
                              disabled={actionLoading === booking.id}
                              className="py-2 px-3 rounded-lg border border-rose-800 text-rose-300 hover:bg-rose-950/40 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Refuser</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#131D2E] rounded-xl border border-[#1E2C42] p-12 text-center text-slate-400 space-y-2">
              <Car className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs font-bold text-slate-300">Sélectionnez un trajet dans la liste pour gérer ses réservations.</p>
            </div>
          )}
        </div>
      </div>

      {/* Reject Reason Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Refuser la demande de réservation"
      >
        <div className="space-y-4 text-left">
          <p className="text-xs text-slate-400 leading-relaxed">
            Veuillez indiquer un motif de refus qui sera transmis au passager avec la libération immédiate de la place.
          </p>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-200">
              Motif du refus
            </label>
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-[#1E2C42] bg-[#0E1624] text-xs font-bold text-white focus:outline-none focus:border-[#2563EB]"
            >
              <option value="Désolé, indisponibilité imprévue" className="bg-[#131D2E]">Désolé, indisponibilité imprévue</option>
              <option value="Véhicule complet avec bagages encombrants" className="bg-[#131D2E]">Véhicule complet avec bagages encombrants</option>
              <option value="Point de rendez-vous non desservi sur cet axe" className="bg-[#131D2E]">Point de rendez-vous non desservi sur cet axe</option>
              <option value="Modification d'horaire de départ" className="bg-[#131D2E]">Modification d'horaire de départ</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1E2C42]">
            <button
              type="button"
              onClick={() => setRejectModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-[#1E2C42] text-xs font-bold text-slate-400 hover:text-white"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleConfirmReject}
              disabled={actionLoading !== null}
              className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
            >
              {actionLoading !== null ? 'Traitement...' : 'Confirmer le refus'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
