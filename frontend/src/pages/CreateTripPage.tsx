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
  Coffee,
  ArrowRight,
  ShieldCheck,
  Clock,
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
  const [destAddress, setDestAddress] = useState<string>("Place du 1er Novembre (Place d'Armes), Oran");

  const [departureDate, setDepartureDate] = useState<string>('');
  const [departureTime, setDepartureTime] = useState<string>('08:00');
  const [distanceKm, setDistanceKm] = useState<number>(415.0);
  const [durationMin, setDurationMin] = useState<number>(270);

  const [totalSeats, setTotalSeats] = useState<number>(4);
  const [baseSeatPrice, setBaseSeatPrice] = useState<number>(1600);
  const [comfortEnabled, setComfortEnabled] = useState<boolean>(true);
  const [fuelType, setFuelType] = useState<string>('essence');
  const [notes, setNotes] = useState<string>('Voyage calme et courtois. Bagages moyens acceptés.');

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
        fuel_type: fuelType,
      });
      setFuelEstimate(result);
      if (result.suggested_seat_price_dzd) {
        setBaseSeatPrice(Math.round(result.suggested_seat_price_dzd));
      }
    } catch {
      // Graceful fallback handled by backend
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
      setError('Veuillez sélectionner une date de départ valide');
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
      {/* Editorial Header */}
      <div className="space-y-2 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
            Espace Conducteur
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs font-medium text-slate-500">
            Publication sécurisée
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {t('create_trip.title', 'Publier un trajet inter-wilayas')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
          Proposez vos places libres, estimez vos frais de carburant Naftal et voyagez en toute sérénité en partageant les coûts réels de votre déplacement.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Itinerary & Route details */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">
                1
              </span>
              <span>Itinéraire & Horaires de Départ</span>
            </h2>
            <span className="text-xs font-semibold text-slate-500">Étape 1 sur 3</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Ville de départ</label>
              <input
                type="text"
                value={originCity}
                onChange={(e) => setOriginCity(e.target.value)}
                placeholder="Ex: Alger"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Point de rassemblement exact</label>
              <input
                type="text"
                value={originAddress}
                onChange={(e) => setOriginAddress(e.target.value)}
                placeholder="Ex: Station Tafourah, Rue d'Isly"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Ville d'arrivée</label>
              <input
                type="text"
                value={destCity}
                onChange={(e) => setDestCity(e.target.value)}
                placeholder="Ex: Oran"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Point d'arrivée exact</label>
              <input
                type="text"
                value={destAddress}
                onChange={(e) => setDestAddress(e.target.value)}
                placeholder="Ex: Place d'Armes, Centre-Ville"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Date du trajet</label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Heure de départ</label>
              <input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Distance estimée (km)</label>
              <input
                type="number"
                value={distanceKm}
                onChange={(e) => setDistanceKm(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Durée du trajet (minutes)</label>
              <input
                type="number"
                value={durationMin}
                onChange={(e) => setDurationMin(parseInt(e.target.value, 10) || 0)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                required
              />
            </div>
          </div>

          {/* Mandatory Rest Alert if > 300km */}
          {distanceKm > 300.0 && (
            <div className="mt-2">
              <RestStopAlert distanceKm={distanceKm} />
            </div>
          )}
        </div>

        {/* Step 2: Fuel Advisory & Transparent Pricing */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span>Calculateur de Carburant Naftal & Tarification</span>
            </h2>
            <button
              type="button"
              onClick={handleEstimateFuel}
              disabled={fuelLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-colors self-start sm:self-auto"
            >
              <Fuel className="w-3.5 h-3.5 text-emerald-700" />
              <span>{fuelLoading ? 'Calcul...' : 'Estimer barème officiel (8L/100km)'}</span>
            </button>
          </div>

          {/* Fuel Estimate Advisory Banner */}
          {fuelEstimate && (
            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-1.5 text-xs text-emerald-950">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5">
                  <Fuel className="w-4 h-4 text-emerald-700" />
                  Barème officiel carburant ({fuelEstimate.fuel_type.toUpperCase()}) :
                </span>
                <span className="text-[11px] font-semibold text-emerald-700">
                  {fuelEstimate.fuel_price_per_litre} DA / Litre
                </span>
              </div>
              <p className="text-emerald-800">
                • Volume estimé : <strong>{fuelEstimate.estimated_fuel_litres} L</strong> ({fuelEstimate.distance_km} km à 8L/100km)
              </p>
              <p className="text-emerald-800">
                • Coût total carburant : <strong>{fuelEstimate.total_fuel_cost_dzd} DA</strong>
              </p>
              <div className="pt-1 border-t border-emerald-200 flex items-center justify-between font-bold text-emerald-900">
                <span>Contribution indicative suggérée par place :</span>
                <span className="text-sm tabular-nums text-emerald-800">
                  {fuelEstimate.suggested_seat_price_dzd} DA
                </span>
              </div>
              <span className="text-[10px] text-emerald-700 block italic">
                * Note consultative : le conducteur fixe librement son prix de base final selon l'usure et le trajet.
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Type de carburant</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
              >
                <option value="essence">Essence (45.62 DA/L)</option>
                <option value="diesel">Gasoil / Diesel (29.01 DA/L)</option>
                <option value="gpl">GPL / Sirghaz (9.00 DA/L)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Places passagers offertes</label>
              <select
                value={totalSeats}
                onChange={(e) => setTotalSeats(parseInt(e.target.value, 10))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
              >
                <option value={2}>2 places</option>
                <option value={3}>3 places</option>
                <option value={4}>4 places</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Votre Prix de Base / Siège (DA)
              </label>
              <input
                type="number"
                value={baseSeatPrice}
                onChange={(e) => setBaseSeatPrice(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-black text-emerald-700 focus:bg-white focus:outline-none focus:border-emerald-600"
                required
              />
              <span className="text-[10px] text-slate-400">Net conducteur perçu par place</span>
            </div>
          </div>

          {/* Trajet Confort Toggle */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-amber-950">
                  Activer l'option « Trajet Confort » (+30%)
                </span>
              </div>
              <input
                type="checkbox"
                checked={comfortEnabled}
                onChange={(e) => setComfortEnabled(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4 border-slate-300"
              />
            </label>
            <p className="text-xs text-amber-900 leading-relaxed">
              Permet à un voyageur de réserver le siège avant spacieux en payant un supplément de 30% ({Math.round(baseSeatPrice * 0.30)} DA) qui vous sera intégralement reversé.
            </p>
          </div>

          {/* Live Preview of Price Breakdown */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Aperçu en direct du tarif passager et de votre gain net :
            </span>
            <PriceBreakdown
              basePrice={baseSeatPrice}
              seatCount={1}
              seatType={comfortEnabled ? 'comfort' : 'standard'}
              showDriverPayout={true}
            />
          </div>
        </div>

        {/* Step 3: Vehicle notes & Submit */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">
                3
              </span>
              <span>Consignes & Confirmation</span>
            </h2>
            <span className="text-xs font-semibold text-slate-500">Étape 3 sur 3</span>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              Consignes du voyage (bagages, ponctualité, pauses)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Ex: Bagages moyens acceptés dans le coffre, départ à l'heure pile..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
            />
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 px-6 rounded-xl font-black text-sm text-white bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-400 shadow-xs hover:shadow-md transition-all active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-emerald-700/30 flex items-center justify-center gap-2"
            >
              <Car className="w-4 h-4 text-amber-300" />
              <span>
                {submitting ? 'Publication en cours...' : 'Publier ce trajet sur DZ-CarPool'}
              </span>
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-2">
              En publiant, vous vous engagez à respecter le code de la route algérien et les pauses de sécurité prescrites.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};