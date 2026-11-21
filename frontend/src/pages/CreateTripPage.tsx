import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FuelEstimateResult } from '../types';
import { PriceBreakdown } from '../components/PriceBreakdown';
import { RestStopAlert } from '../components/RestStopAlert';
import { WILAYAS, estimateRouteDistance, estimateFuelCost } from '../utils/algeriaData';
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

  // Wilaya and City state
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

  const [totalSeats, setTotalSeats] = useState<number>(3);
  const [baseSeatPrice, setBaseSeatPrice] = useState<number>(1600);
  const [comfortEnabled, setComfortEnabled] = useState<boolean>(true);
  const [fuelType, setFuelType] = useState<'essence' | 'diesel' | 'gpl'>('essence');
  const [notes, setNotes] = useState<string>('Voyage calme et ponctuel. Bagages moyens acceptés dans le coffre.');

  // Vehicle details
  const [vehicleMake, setVehicleMake] = useState<string>('Renault');
  const [vehicleModel, setVehicleModel] = useState<string>('Symbol');

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Recalculate distance and duration when origin or destination changes
  const handleOriginWilayaChange = (code: number) => {
    setOriginWilayaCode(code);
    const w = WILAYAS.find((item) => item.code === code);
    if (w) {
      setOriginCity(w.name);
      const est = estimateRouteDistance(w.name, destCity);
      setDistanceKm(est.distance_km);
      setDurationMin(est.duration_min);
    }
  };

  const handleDestWilayaChange = (code: number) => {
    setDestWilayaCode(code);
    const w = WILAYAS.find((item) => item.code === code);
    if (w) {
      setDestCity(w.name);
      const est = estimateRouteDistance(originCity, w.name);
      setDistanceKm(est.distance_km);
      setDurationMin(est.duration_min);
    }
  };

  const currentFuelEstimate = estimateFuelCost(distanceKm, fuelType, totalSeats);

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
        vehicle_make: vehicleMake,
        vehicle_model: vehicleModel,
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
      <div className="space-y-2 pb-6 border-b border-slate-200 text-left">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
            Espace Conducteur
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs font-medium text-slate-500">
            Publication sécurisée de trajet
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Proposer des places en covoiturage
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
          Renseignez votre itinéraire, consultez le barème officiel Naftal (8L/100km) pour fixer un prix équitable, et conservez 100% de votre prix net conducteur.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 text-left">
        {/* Step 1: Itinerary & Route details */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">
                1
              </span>
              <span>Itinéraire & Horaires de Départ</span>
            </h2>
            <span className="text-xs font-semibold text-slate-400">Étape 1 sur 3</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Origin Wilaya */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Wilaya de départ</label>
              <select
                value={originWilayaCode}
                onChange={(e) => handleOriginWilayaChange(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 cursor-pointer"
              >
                {WILAYAS.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.code_str} - {w.name} ({w.name_ar})
                  </option>
                ))}
              </select>
            </div>

            {/* Origin Address */}
            <div className="space-y-1.5">
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

            {/* Destination Wilaya */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Wilaya de destination</label>
              <select
                value={destWilayaCode}
                onChange={(e) => handleDestWilayaChange(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 cursor-pointer"
              >
                {WILAYAS.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.code_str} - {w.name} ({w.name_ar})
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Address */}
            <div className="space-y-1.5">
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

            {/* Date */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Date du voyage</label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 cursor-pointer"
                required
              />
            </div>

            {/* Time */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Heure de départ</label>
              <input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600 cursor-pointer"
                required
              />
            </div>

            {/* Distance */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">Distance calculée (km)</label>
                <span className="text-[10px] text-emerald-700 font-bold">Auto-estimée</span>
              </div>
              <input
                type="number"
                value={distanceKm}
                onChange={(e) => setDistanceKm(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
                required
              />
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Durée estimée (minutes)</label>
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
            <div className="mt-3">
              <RestStopAlert distanceKm={distanceKm} />
            </div>
          )}
        </div>

        {/* Step 2: Fuel Advisory & Transparent Pricing */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
              <span>Barème Naftal & Tarification par Siège</span>
            </h2>
            <span className="text-xs font-semibold text-slate-400">Étape 2 sur 3</span>
          </div>

          {/* Fuel Estimate Live Advisory Card */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2 text-xs text-emerald-950">
            <div className="flex items-center justify-between">
              <span className="font-extrabold flex items-center gap-1.5 text-emerald-900">
                <Fuel className="w-4 h-4 text-emerald-700" />
                Barème officiel Naftal ({fuelType.toUpperCase()}) :
              </span>
              <span className="text-xs font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                {currentFuelEstimate.price_per_liter} DA / Litre
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-emerald-900">
              <div>
                <span className="text-slate-500 block">Volume estimé (8L/100) :</span>
                <strong>{currentFuelEstimate.consumption_liters} Litres</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Coût total carburant :</span>
                <strong>{currentFuelEstimate.total_fuel_cost} DA</strong>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-slate-500 block">Part suggérée / place :</span>
                <strong className="text-emerald-800 text-xs">{currentFuelEstimate.suggested_seat_contribution} DA</strong>
              </div>
            </div>
            <span className="text-[10px] text-emerald-700 block italic pt-1 border-t border-emerald-200/60">
              * Note consultative : le conducteur fixe librement son prix de base final selon l'usure du véhicule et la climatisation.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Type de carburant</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
              >
                <option value="essence">Essence (45.62 DA/L)</option>
                <option value="diesel">Gasoil / Diesel (29.01 DA/L)</option>
                <option value="gpl">GPL / Sirghaz (9.00 DA/L)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Nombre de places offertes</label>
              <select
                value={totalSeats}
                onChange={(e) => setTotalSeats(parseInt(e.target.value, 10))}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-semibold text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
              >
                <option value={1}>1 place</option>
                <option value={2}>2 places</option>
                <option value={3}>3 places</option>
                <option value={4}>4 places</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Prix de Base / Siège (DA)
                </label>
                <span className="text-[10px] text-emerald-700 font-bold">100% net conducteur</span>
              </div>
              <input
                type="number"
                value={baseSeatPrice}
                onChange={(e) => setBaseSeatPrice(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-black text-emerald-800 focus:bg-white focus:outline-none focus:border-emerald-600"
                required
              />
            </div>
          </div>

          {/* Trajet Confort Toggle */}
          <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-2">
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
                className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4 border-slate-300 cursor-pointer"
              />
            </label>
            <p className="text-xs text-amber-900 leading-relaxed">
              Permet à un passager de réserver le siège passager avant pour plus d'espace en payant un supplément de 30% ({Math.round(baseSeatPrice * 0.30)} DA) reversé au conducteur.
            </p>
          </div>

          {/* Live Preview of Price Breakdown */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Aperçu transparent des tarifs passagers (+15% commission) :
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
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-700 text-white text-xs flex items-center justify-center font-bold">
                3
              </span>
              <span>Véhicule & Consignes de Voyage</span>
            </h2>
            <span className="text-xs font-semibold text-slate-400">Étape 3 sur 3</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Marque du véhicule</label>
              <input
                type="text"
                value={vehicleMake}
                onChange={(e) => setVehicleMake(e.target.value)}
                placeholder="Ex: Renault, Dacia, Peugeot..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">Modèle</label>
              <input
                type="text"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                placeholder="Ex: Symbol, Stepway, 208..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Consignes et précisions pour les passagers
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
              className="w-full py-4 px-6 rounded-2xl font-black text-xs text-white bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-200 disabled:text-slate-400 shadow-md hover:shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <Car className="w-4 h-4 text-white" />
              <span>
                {submitting ? 'Publication en cours...' : 'Publier ce trajet sur DZ-CarPool'}
              </span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-2">
              En publiant, vous vous engagez à respecter le code de la route algérien et les pauses de sécurité réglementaires.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
