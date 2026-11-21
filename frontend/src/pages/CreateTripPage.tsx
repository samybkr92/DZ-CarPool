import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FuelEstimateResult } from '../types';
import { PriceBreakdown } from '../components/PriceBreakdown';
import { RestStopAlert } from '../components/RestStopAlert';
import {
  MapPin,
  Calendar,
  Users,
  Car,
  Fuel,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const CreateTripPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [originWilayaCode, setOriginWilayaCode] = useState<number>(16);
  const [originCity, setOriginCity] = useState<string>('Alger');
  const [originAddress, setOriginAddress] = useState<string>('Station Tafourah, Alger Centre');

  const [destWilayaCode, setDestWilayaCode] = useState<number>(31);
  const [destCity, setDestCity] = useState<string>('Oran');
  const [destAddress, setDestAddress] = useState<string>("Place d'Armes, Oran Centre");

  const [departureDate, setDepartureDate] = useState<string>('');
  const [departureTime, setDepartureTime] = useState<string>('08:00');
  const [distanceKm, setDistanceKm] = useState<number>(415.0);
  const [durationMin, setDurationMin] = useState<number>(270);

  const [totalSeats, setTotalSeats] = useState<number>(4);
  const [baseSeatPrice, setBaseSeatPrice] = useState<number>(1600);
  const [comfortEnabled, setComfortEnabled] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('Voyage calme, bagages moyens acceptés.');

  // Fuel Estimate State
  const [fuelEstimate, setFuelEstimate] = useState<FuelEstimateResult | null>(null);
  const [fuelLoading, setFuelLoading] = useState<boolean>(false);

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch fuel estimate
  const handleEstimateFuel = async () => {
    setFuelLoading(true);
    try {
      const result = await api.estimateFuel({
        distance_km: distanceKm,
        total_seats: totalSeats,
        wilaya_code: originWilayaCode,
        fuel_type: 'essence',
      });
      setFuelEstimate(result);
      if (result.suggested_seat_price_dzd) {
        setBaseSeatPrice(Math.round(result.suggested_seat_price_dzd));
      }
    } catch {
      // Graceful fallback
    } finally {
      setFuelLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!departureDate) {
      setError('Veuillez renseigner la date de départ');
      return;
    }

    setSubmitting(true);
    setError(null);

    const departureDatetime = `${departureDate}T${departureTime}:00Z`;

    try {
      const newTrip = await api.createTrip({
        origin_wilaya_code: originWilayaCode,
        origin_wilaya_name: originCity,
        origin_city: originCity,
        origin_address: originAddress,
        destination_wilaya_code: destWilayaCode,
        destination_wilaya_name: destCity,
        destination_city: destCity,
        destination_address: destAddress,
        departure_datetime: departureDatetime,
        estimated_duration_minutes: durationMin,
        distance_km: distanceKm,
        total_seats: totalSeats,
        base_seat_price: baseSeatPrice,
        comfort_enabled: comfortEnabled,
        notes: notes,
      });

      navigate(`/trips/${newTrip.id}`);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la publication du trajet');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {t('create_trip.title')}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Proposez vos places libres, respectez les pauses de sécurité et partagez vos frais de carburant Naftal.
        </p>
      </div>

      {/* Mandatory Rest Stop Alert if > 300km */}
      <RestStopAlert distanceKm={distanceKm} />

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Itinerary */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
            1. Itinéraire & Horaires
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Ville de départ</label>
              <input
                type="text"
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-2.5 text-sm font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Point de rassemblement exact</label>
              <input
                type="text"
                value={originAddress}
                onChange={(e) => setOriginAddress(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-2.5 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Ville de destination</label>
              <input
                type="text"
                value={destCity}
                onChange={(e) => setDestCity(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-2.5 text-sm font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Point d'arrivée exact</label>
              <input
                type="text"
                value={destAddress}
                onChange={(e) => setDestAddress(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-2.5 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Date de départ</label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-2.5 text-sm font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Heure de départ</label>
              <input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full rounded-xl border border-gray-300 p-2.5 text-sm font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Distance (km)</label>
              <input
                type="number"
                value={distanceKm}
                onChange={(e) => setDistanceKm(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-gray-300 p-2.5 text-sm font-semibold"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Durée estimée (minutes)</label>
              <input
                type="number"
                value={durationMin}
                onChange={(e) => setDurationMin(parseInt(e.target.value, 10) || 0)}
                className="w-full rounded-xl border border-gray-300 p-2.5 text-sm font-semibold"
                required
              />
            </div>
          </div>
        </div>

        {/* Step 2: Fuel Advisory & Pricing */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h2 className="text-base font-bold text-gray-900">
              2. Estimation Carburant & Prix par Place
            </h2>
            <button
              type="button"
              onClick={handleEstimateFuel}
              disabled={fuelLoading}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <Fuel className="w-4 h-4" />
              <span>{fuelLoading ? 'Calcul en cours...' : 'Calculer estimation Naftal (8L/100km)'}</span>
            </button>
          </div>

          {fuelEstimate && (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1 text-xs text-emerald-950">
              <p className="font-bold">Estimation Naftal pour {fuelEstimate.distance_km} km :</p>
              <p>• Carburant estimé : <strong>{fuelEstimate.estimated_fuel_litres} L</strong> à {fuelEstimate.fuel_price_per_litre} DA/L</p>
              <p>• Coût total carburant : <strong>{fuelEstimate.total_fuel_cost_dzd} DA</strong></p>
              <p className="text-emerald-800 font-semibold mt-1">
                💡 Prix indicatif conseillé par place : <strong>{fuelEstimate.suggested_seat_price_dzd} DA</strong> (le conducteur reste libre du prix final)
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nombre total de places</label>
              <select
                value={totalSeats}
                onChange={(e) => setTotalSeats(parseInt(e.target.value, 10))}
                className="w-full rounded-xl border border-gray-300 p-2.5 text-sm font-semibold"
              >
                <option value={2}>2 places</option>
                <option value={3}>3 places</option>
                <option value={4}>4 places</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Votre Prix de Base / Place (DA)</label>
              <input
                type="number"
                value={baseSeatPrice}
                onChange={(e) => setBaseSeatPrice(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-gray-300 p-2.5 text-sm font-black text-emerald-700"
                required
              />
              <span className="text-[10px] text-gray-400">Ce montant net vous sera intégralement reversé.</span>
            </div>
          </div>

          {/* Comfort Option Toggle */}
          <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200 space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-amber-950">
                  {t('create_trip.comfort_toggle')}
                </span>
              </div>
              <input
                type="checkbox"
                checked={comfortEnabled}
                onChange={(e) => setComfortEnabled(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
              />
            </label>
            <p className="text-xs text-amber-800 leading-relaxed">
              Le passager confort paiera un supplément de 30% ({Math.round(baseSeatPrice * 0.30)} DA) qui vous sera également reversé.
            </p>
          </div>

          {/* Live Pricing Breakdown Preview */}
          <PriceBreakdown
            basePrice={baseSeatPrice}
            seatCount={1}
            seatType={comfortEnabled ? 'comfort' : 'standard'}
            showDriverPayout={true}
          />
        </div>

        {/* Step 3: Notes & Publish */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-2">
            3. Remarques & Validation
          </h2>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Consignes pour les voyageurs</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-gray-300 p-2.5 text-sm"
              placeholder="Ex: Bagages autorisés, ponctualité, véhicule non-fumeur..."
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 px-6 rounded-xl font-black text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.01]"
          >
            {submitting ? 'Publication en cours...' : t('create_trip.publish_button')}
          </button>
        </div>
      </form>
    </div>
  );
};
