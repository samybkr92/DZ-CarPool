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
        // Refresh trip data to update available seats
        const tripData = await api.getTrip(selectedTrip.id);
        setSelectedTrip(tripData);
      }
    } catch (err: any) {
      alert(err.message || "Impossible d'approuver la réservation");
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
        <div className="h-96 rounded-3xl bg-white border border-slate-200 animate-pulse p-8" />
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
              Espace Conducteur Certifié
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-semibold">{user?.full_name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Tableau de bord de vos trajets
          </h1>
        </div>

        <Link
          to="/trips/create"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-soft-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau trajet</span>
        </Link>
      </div>

      {/* 2. Key Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-soft-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>Trajets publiés</span>
            <Car className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalTripsCount}</div>
          <span className="text-[11px] text-slate-500 font-medium block">Annonces actives sur le réseau</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-soft-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-amber-600 font-bold uppercase tracking-wider">
            <span>Demandes en attente</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">{pendingRequestsCount}</div>
          <span className="text-[11px] text-slate-500 font-medium block">Nécessitent votre approbation</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-soft-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-emerald-700 font-bold uppercase tracking-wider">
            <span>Passagers confirmés</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{confirmedBookingsCount}</div>
          <span className="text-[11px] text-slate-500 font-medium block">Réservations validées</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-soft-xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>Rémunération nette</span>
            <Wallet className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-black text-brand-600 tabular-nums">
            {estimatedNetEarnings.toLocaleString('fr-DZ')} DA
          </div>
          <span className="text-[11px] text-slate-500 font-medium block">100% net conducteur sans retenue</span>
        </div>
      </div>

      {/* 3. Main Split View: Trips List & Bookings Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Published Trips List */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Vos annonces publiées ({trips.length})
          </h2>

          {trips.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-3">
              <Car className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">Aucun trajet publié pour l'instant</p>
              <Link
                to="/trips/create"
                className="inline-block text-xs font-bold text-brand-600 hover:underline"
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
                    className={`p-5 rounded-3xl border transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? 'bg-white border-brand-500 shadow-soft-md ring-2 ring-brand-100'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-soft-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                        <span>{trip.origin_city}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-brand-600" />
                        <span>{trip.destination_city}</span>
                      </div>
                      <span className="text-xs font-black text-brand-700 tabular-nums">
                        {trip.base_seat_price} DA net
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
                      <span>{depDate}</span>
                      <span className="font-bold text-slate-700">{trip.available_seats} places libres</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Selected Trip Bookings & Approvals */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Gestion des réservations pour ce trajet
            </h2>
            {selectedTrip && (
              <Link
                to={`/trips/${selectedTrip.id}/chat`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:underline"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Messagerie de coordination</span>
              </Link>
            )}
          </div>

          {!selectedTrip ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400">
              Sélectionnez un trajet pour visualiser et approuver les réservations.
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft-sm space-y-6">
              {/* Trip Context Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-base">
                    <span>{selectedTrip.origin_city}</span>
                    <ArrowRight className="w-4 h-4 text-brand-600" />
                    <span>{selectedTrip.destination_city}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Départ : {new Date(selectedTrip.departure_datetime).toLocaleString('fr-DZ')} • {selectedTrip.distance_km} km
                  </p>
                </div>

                <Link
                  to={`/trips/${selectedTrip.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-brand-600"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Voir la fiche</span>
                </Link>
              </div>

              {/* Bookings List */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-2">
                  Demandes de passagers ({bookings.length})
                </h3>

                {bookings.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-2">
                    <Users className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-600">Aucune demande reçue pour ce trajet</p>
                    <p className="text-[11px] text-slate-400">
                      Les passagers trouveront votre trajet via la recherche inter-wilayas.
                    </p>
                  </div>
                ) : (
                  bookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-soft-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={b.passenger?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${b.passenger?.full_name}`}
                            alt={b.passenger?.full_name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <span className="text-sm font-bold text-slate-900 block">{b.passenger?.full_name}</span>
                            <span className="text-[11px] text-slate-500">{b.passenger?.phone_number || 'Téléphone vérifié'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <StatusBadge status={b.status} />
                          <div className="text-right">
                            <span className="text-sm font-black text-slate-900 tabular-nums block">
                              {b.total_price || b.quoted_total_price} DA
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {b.seat_count} place{b.seat_count > 1 ? 's' : ''} ({b.seat_type === 'comfort' ? 'Confort' : 'Standard'})
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Approval Actions (for pending status) */}
                      {b.status === 'pending' && (
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openRejectModal(b.id)}
                            disabled={actionLoading === b.id}
                            className="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors"
                          >
                            Refuser
                          </button>

                          <button
                            type="button"
                            onClick={() => handleApprove(b.id)}
                            disabled={actionLoading === b.id}
                            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-soft-xs transition-colors"
                          >
                            {actionLoading === b.id ? 'Validation...' : 'Accepter la réservation'}
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Refuser la demande de réservation"
      >
        <div className="space-y-4 text-left">
          <p className="text-xs text-slate-600 leading-relaxed">
            Veuillez indiquer un motif poli de refus. Le passager sera notifié et pourra rechercher un autre départ.
          </p>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">Motif du refus</label>
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none"
            >
              <option value="Désolé, indisponibilité imprévue">Désolé, indisponibilité imprévue</option>
              <option value="Complet / Véhicule déjà plein">Complet / Véhicule déjà plein</option>
              <option value="Changement d'horaire ou d'itinéraire">Changement d'horaire ou d'itinéraire</option>
              <option value="Volume de bagages incompatible">Volume de bagages incompatible</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setRejectModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleConfirmReject}
              disabled={actionLoading !== null}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-soft-xs"
            >
              Confirmer le refus
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};