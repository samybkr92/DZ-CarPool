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
        <div className="h-96 rounded-xl bg-white border border-[#E6E0D6] animate-pulse p-8" />
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6E0D6]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#173C2C] bg-[#E1EDE6] px-2 py-0.5 rounded border border-[#C2DBCF]">
              Espace Conducteur Certifié
            </span>
            <span className="text-xs text-[#8E9389]">•</span>
            <span className="text-xs text-[#5C6057] font-semibold">{user?.full_name}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#141613] tracking-tight">
            Tableau de bord de vos trajets
          </h1>
        </div>

        <Link
          to="/trips/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#173C2C] hover:bg-[#112E22] text-white font-bold text-xs shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau trajet</span>
        </Link>
      </div>

      {/* 2. Key Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-[#E6E0D6] shadow-card space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8E9389] font-bold uppercase tracking-wider">
            <span>Trajets publiés</span>
            <Car className="w-4 h-4 text-[#173C2C]" />
          </div>
          <div className="text-2xl font-black text-[#141613]">{totalTripsCount}</div>
          <span className="text-[11px] text-[#5C6057] block">Annonces actives</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E6E0D6] shadow-card space-y-1">
          <div className="flex items-center justify-between text-xs text-[#92400E] font-bold uppercase tracking-wider">
            <span>Demandes en attente</span>
            <Clock className="w-4 h-4 text-[#D97706]" />
          </div>
          <div className="text-2xl font-black text-[#92400E]">{pendingRequestsCount}</div>
          <span className="text-[11px] text-[#5C6057] block">Nécessitent votre approbation</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E6E0D6] shadow-card space-y-1">
          <div className="flex items-center justify-between text-xs text-[#173C2C] font-bold uppercase tracking-wider">
            <span>Passagers confirmés</span>
            <CheckCircle2 className="w-4 h-4 text-[#173C2C]" />
          </div>
          <div className="text-2xl font-black text-[#173C2C]">{confirmedBookingsCount}</div>
          <span className="text-[11px] text-[#5C6057] block">Réservations validées</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#E6E0D6] shadow-card space-y-1">
          <div className="flex items-center justify-between text-xs text-[#8E9389] font-bold uppercase tracking-wider">
            <span>Rémunération nette</span>
            <Wallet className="w-4 h-4 text-[#173C2C]" />
          </div>
          <div className="text-2xl font-black text-[#173C2C] tabular-nums">
            {estimatedNetEarnings.toLocaleString('fr-DZ')} DA
          </div>
          <span className="text-[11px] text-[#5C6057] block">100% net sans retenue</span>
        </div>
      </div>

      {/* 3. Main Split View: Trips List & Bookings Management */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Published Trips List */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#8E9389] px-1">
            Vos annonces publiées ({trips.length})
          </h2>

          {trips.length === 0 ? (
            <div className="bg-white rounded-xl border border-[#E6E0D6] p-8 text-center space-y-3 shadow-card">
              <Car className="w-8 h-8 text-[#8E9389] mx-auto" />
              <p className="text-sm font-bold text-[#32362F]">Aucun trajet publié pour l'instant</p>
              <Link
                to="/trips/create"
                className="inline-block text-xs font-bold text-[#173C2C] hover:underline"
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
                        ? 'bg-white border-[#173C2C] shadow-elevated ring-1 ring-[#173C2C]'
                        : 'bg-white border-[#E6E0D6] hover:border-[#D4CCBF] shadow-card'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-[#141613] text-sm">
                        <span>{trip.origin_city}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#173C2C]" />
                        <span>{trip.destination_city}</span>
                      </div>
                      <span className="text-xs font-black text-[#173C2C] tabular-nums">
                        {trip.base_seat_price} DA net
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-[#5C6057] pt-1 border-t border-[#F3EFE8]">
                      <span>{depDate}</span>
                      <span className="font-semibold text-[#32362F]">{trip.available_seats} places libres</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Selected Trip Bookings & Approvals */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#8E9389]">
              Gestion des réservations
            </h2>
            {selectedTrip && (
              <Link
                to={`/trips/${selectedTrip.id}/chat`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#173C2C] hover:underline"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Messagerie de coordination</span>
              </Link>
            )}
          </div>

          {!selectedTrip ? (
            <div className="bg-white rounded-xl border border-[#E6E0D6] p-12 text-center text-[#8E9389] shadow-card">
              Sélectionnez un trajet pour visualiser et approuver les réservations.
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#E6E0D6] p-6 shadow-card space-y-6">
              {/* Trip Context Banner */}
              <div className="p-4 rounded-lg bg-[#FAF8F5] border border-[#E6E0D6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 font-extrabold text-[#141613] text-base">
                    <span>{selectedTrip.origin_city}</span>
                    <ArrowRight className="w-4 h-4 text-[#173C2C]" />
                    <span>{selectedTrip.destination_city}</span>
                  </div>
                  <p className="text-xs text-[#5C6057]">
                    Départ : {new Date(selectedTrip.departure_datetime).toLocaleString('fr-DZ')} • {selectedTrip.distance_km} km
                  </p>
                </div>

                <Link
                  to={`/trips/${selectedTrip.id}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#173C2C] hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Voir la fiche</span>
                </Link>
              </div>

              {/* Bookings List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#32362F] border-b border-[#F3EFE8] pb-2">
                  Demandes de passagers ({bookings.length})
                </h3>

                {bookings.length === 0 ? (
                  <div className="py-10 text-center text-[#8E9389] space-y-1">
                    <Users className="w-7 h-7 text-[#8E9389] mx-auto mb-2" />
                    <p className="text-xs font-bold text-[#32362F]">Aucune demande reçue pour ce trajet</p>
                    <p className="text-[11px] text-[#5C6057]">
                      Les passagers trouveront votre trajet via la recherche inter-wilayas.
                    </p>
                  </div>
                ) : (
                  bookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-4 rounded-lg border border-[#E6E0D6] bg-white space-y-3 shadow-subtle"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={b.passenger?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${b.passenger?.full_name}`}
                            alt={b.passenger?.full_name}
                            className="w-9 h-9 rounded-full object-cover border border-[#E6E0D6]"
                          />
                          <div>
                            <span className="text-sm font-bold text-[#141613] block">{b.passenger?.full_name}</span>
                            <span className="text-[11px] text-[#8E9389]">{b.passenger?.phone_number || 'Téléphone vérifié'}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <StatusBadge status={b.status} />
                          <div className="text-right">
                            <span className="text-sm font-black text-[#141613] tabular-nums block">
                              {b.total_price || b.quoted_total_price} DA
                            </span>
                            <span className="text-[10px] text-[#8E9389]">
                              {b.seat_count} place{b.seat_count > 1 ? 's' : ''} ({b.seat_type === 'comfort' ? 'Confort' : 'Standard'})
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Approval Actions (for pending status) */}
                      {b.status === 'pending' && (
                        <div className="pt-2 border-t border-[#F3EFE8] flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openRejectModal(b.id)}
                            disabled={actionLoading === b.id}
                            className="px-3.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors"
                          >
                            Refuser
                          </button>

                          <button
                            type="button"
                            onClick={() => handleApprove(b.id)}
                            disabled={actionLoading === b.id}
                            className="px-4 py-1.5 rounded-lg bg-[#173C2C] hover:bg-[#112E22] text-white font-bold text-xs shadow-subtle transition-colors"
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
          <p className="text-xs text-[#5C6057] leading-relaxed">
            Veuillez indiquer un motif poli de refus. Le passager sera notifié et pourra rechercher un autre départ.
          </p>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#32362F]">Motif du refus</label>
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[#E6E0D6] bg-[#FAF8F5] text-xs font-semibold text-[#141613] focus:outline-none"
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
              className="px-4 py-2 rounded-lg border border-[#E6E0D6] text-xs font-bold text-[#5C6057] hover:bg-[#FAF8F5]"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleConfirmReject}
              disabled={actionLoading !== null}
              className="px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-subtle"
            >
              Confirmer le refus
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
