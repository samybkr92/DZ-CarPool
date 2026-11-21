import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { Trip, Booking } from '../types';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/StatusBadge';
import {
  Car,
  Calendar,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  MessageCircle,
  ChevronRight,
  AlertCircle,
  PlusCircle,
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
      // Refresh
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

  const handleReject = async (bookingId: number) => {
    const reason = window.prompt("Motif du refus (optionnel) :", "Désolé, indisponibilité imprévue");
    setActionLoading(bookingId);
    try {
      await api.rejectBooking(bookingId, reason || undefined);
      if (selectedTrip) {
        const updated = await api.getTripBookings(selectedTrip.id);
        setBookings(updated);
      }
    } catch (err: any) {
      alert(err.message || 'Erreur lors du refus');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {t('dashboard.driver_title')}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {t('dashboard.driver_subtitle')}
          </p>
        </div>
        <button
          onClick={() => navigate('/trips/create')}
          className="flex items-center gap-2 py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publier un nouveau trajet</span>
        </button>
      </div>

      {loading ? (
        <div className="h-48 rounded-2xl bg-gray-100 animate-pulse" />
      ) : trips.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-4">
          <Car className="w-12 h-12 text-gray-400 mx-auto" />
          <p className="text-base font-bold text-gray-700">{t('dashboard.no_trips')}</p>
          <button
            onClick={() => navigate('/trips/create')}
            className="py-2.5 px-6 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
          >
            Créer mon premier trajet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left: Trips list */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
              Vos Annonces Publiées ({trips.length})
            </h2>

            <div className="space-y-3">
              {trips.map((trip) => {
                const isSelected = selectedTrip?.id === trip.id;
                return (
                  <div
                    key={trip.id}
                    onClick={() => selectTrip(trip)}
                    className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                      isSelected
                        ? 'bg-emerald-50/70 border-emerald-500 shadow-sm ring-1 ring-emerald-500'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>{new Date(trip.departure_datetime).toLocaleDateString()}</span>
                      <span className="font-bold text-emerald-700">{trip.available_seats} / {trip.total_seats} places</span>
                    </div>

                    <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      <span>{trip.origin_city}</span>
                      <span>$\to$</span>
                      <span>{trip.destination_city}</span>
                    </h3>

                    <div className="mt-2 text-xs font-semibold text-gray-600 flex justify-between items-center">
                      <span>Base : {trip.base_seat_price} DA</span>
                      {trip.comfort_enabled && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                          Confort (+30%)
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right (2 cols): Bookings Management */}
          <div className="lg:col-span-2 space-y-6">
            {selectedTrip && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-gray-100">
                  <div>
                    <span className="text-xs font-bold text-gray-400 uppercase">Trajet sélectionné</span>
                    <h2 className="text-xl font-extrabold text-gray-900">
                      {selectedTrip.origin_city} $\to$ {selectedTrip.destination_city}
                    </h2>
                    <p className="text-xs text-gray-500">
                      Départ : {new Date(selectedTrip.departure_datetime).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/trips/${selectedTrip.id}/chat`)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:text-emerald-700 hover:border-emerald-600 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span>Fil de discussion</span>
                    </button>
                    <button
                      onClick={() => navigate(`/trips/${selectedTrip.id}`)}
                      className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors"
                    >
                      Fiche publique
                    </button>
                  </div>
                </div>

                {/* Bookings list */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-900">
                    Demandes de réservation & Passagers ({bookings.length})
                  </h3>

                  {bookings.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 text-xs bg-gray-50 rounded-xl">
                      Aucune demande reçue pour ce trajet pour le moment.
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {bookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={booking.passenger?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${booking.passenger?.full_name || 'DZ'}`}
                              alt={booking.passenger?.full_name}
                              className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                            />
                            <div>
                              <h4 className="text-sm font-bold text-gray-900">
                                {booking.passenger?.full_name}
                              </h4>
                              <p className="text-xs text-gray-500 flex items-center gap-2">
                                <span>{booking.seat_count} place(s)</span>
                                <span>•</span>
                                <span className={booking.seat_type === 'comfort' ? 'text-amber-700 font-bold' : ''}>
                                  {booking.seat_type === 'comfort' ? 'Place Confort (+30%)' : 'Standard'}
                                </span>
                                <span>•</span>
                                <span className="font-bold text-emerald-700">Net : {booking.driver_payout} DA</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                            <StatusBadge status={booking.status} />

                            {booking.status === 'pending' && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleApprove(booking.id)}
                                  disabled={actionLoading === booking.id || selectedTrip.available_seats < booking.seat_count}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-bold text-xs shadow-sm transition-all"
                                >
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  <span>Accepter</span>
                                </button>
                                <button
                                  onClick={() => handleReject(booking.id)}
                                  disabled={actionLoading === booking.id}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs border border-rose-200 transition-all"
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
    </div>
  );
};
