import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { WILAYAS, estimateRouteDistance, estimateFuelCost } from '../utils/algeriaData';
import { PriceBreakdown } from '../components/PriceBreakdown';
import { RestStopAlert } from '../components/RestStopAlert';
import {
  Car,
  Calendar,
  Fuel,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Clock,
  MapPin,
  Check,
} from 'lucide-react';

export const CreateTripPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

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

  // Set default date to tomorrow
  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    setDepartureDate(d.toISOString().split('T')[0]);
  }, []);

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      {/* Editorial Header */}
      <div className="space-y-2 pb-6 border-b border-[#EAE5DC]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#16382C] bg-[#E2EDE6] px-2.5 py-0.5 rounded border border-[#C4DBCD]">
            Espace Conducteur
          </span>
          <span className="text-xs text-[#C8BEAD]">•</span>
          <span className="text-xs font-medium text-[#7E8681]">
            Publication certifiée de trajet inter-wilayas
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#141716] tracking-tight">
          Proposer des places en covoiturage
        </h1>
        <p className="text-xs sm:text-sm text-[#5A625D] leading-relaxed max-w-2xl">
          Renseignez votre itinéraire, consultez le barème officiel Naftal (8L/100km) pour fixer un prix équitable, et conservez 100% de votre prix net conducteur.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Itinerary & Route details */}
        <div className="bg-white rounded-2xl border border-[#EAE5DC] p-6 sm:p-8 shadow-fine space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#F4EFE6]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#141716] flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-[#16382C] text-[#FAF7F2] text-[10px] flex items-center justify-center font-bold">
                1
              </span>
              <span>Itinéraire & Horaires de Départ</span>
            </h2>
            <span className="text-xs font-semibold text-[#7E8681]">Étape 1 sur 3</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Origin Wilaya */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#303632]">Wilaya de départ</label>
              <select
                value={originWilayaCode}
                onChange={(e) => handleOriginWilayaChange(Number(e.target.value))}
                className="w-full rounded-xl border border-[#EAE5DC] bg-[#FAF7F2] p-3 text-xs font-semibold text-[#141716] focus:bg-white focus:outline-none focus:border-[#16382C] cursor-pointer"
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
              <label className="block text-xs font-bold text-[#303632]">Point de rassemblement exact</label>
              <input
                type="text"
                value={originAddress}
                onChange={(e) => setOriginAddress(e.target.value)}
                placeholder="Ex: Station Tafourah, Alger Centre"
                className="w-full rounded-xl border border-[#EAE5DC] bg-[#FAF7F2] p-3 text-xs font-medium text-[#141716] focus:bg-white focus:outline-none focus:border-[#16382C]"
                required
              />
            </div>

            {/* Destination Wilaya */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#303632]">Wilaya de destination</label>
              <select
                value={destWilayaCode}
                onChange={(e) => handleDestWilayaChange(Number(e.target.value))}
                className="w-full rounded-xl border border-[#EAE5DC] bg-[#FAF7F2] p-3 text-xs font-semibold text-[#141716] focus:bg-white focus:outline-none focus:border-[#16382C] cursor-pointer"
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
              <label className="block text-xs font-bold text-[#303632]">Point d'arrivée exact</label>
              <input
                type="text"
                value={destAddress}
                onChange={(e) => setDestAddress(e.target.value)}
                placeholder="Ex: Place d'Armes, Centre-Ville"
                className="w-full rounded-xl border border-[#EAE5DC] bg-[#FAF7F2] p-3 text-xs font-medium text-[#141716] focus:bg-white focus:outline-none focus:border-[#16382C]"
                required
              />
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#303632]">Date du voyage</label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full rounded-xl border border-[#EAE5DC] bg-[#FAF7F2] p-3 text-xs font-semibold text-[#141716] focus:bg-white focus:outline-none focus:border-[#16382C] cursor-pointer"
                required
              />
            </div>

            {/* Time */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#303632]">Heure de départ</label>
              <input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full rounded-xl border border-[#EAE5DC] bg-[#FAF7F2] p-3 text-xs font-semibold text-[#141716] focus:bg-white focus:outline-none focus:border-[#16382C] cursor-pointer"
                required
              />
            </div>

            {/* Distance */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#303632]">Distance estimée (km)</label>
                <span className="text-[10px] text-[#16382C] font-bold">Auto-calculée</span>
              </div>
              <input
                type="number"
                value={distanceKm}
                onChange={(e) => setDistanceKm(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-[#EAE5DC] bg-[#FAF7F2] p-3 text-xs font-semibold text-[#141716] focus:bg-white focus:outline-none focus:border-[#16382C]"
                required
              />
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#303632]">Durée estimée (minutes)</label>
              <input
                type="number"
                value={durationMin}
                onChange={(e) => setDurationMin(parseInt(e.target.value, 10) || 0)}
                className="w-full rounded-xl border border-[#EAE5DC] bg-[#FAF7F2] p-3 text-xs font-semibold text-[#141716] focus:bg-white focus:outline-none focus:border-[#16382C]"
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
        <div className="bg-white rounded-2xl border border-[#EAE5DC] p-6 sm:p-8 shadow-fine space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F4EFE6]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#141716] flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-[#16382C] text-[#FAF7F2] text-[10px] flex items-center justify-center font-bold">
                2
              </span>
              <span>Barème Naftal & Tarification par Siège</span>
            </h2>
            <span className="text-xs font-semibold text-[#7E8681]">Étape 2 sur 3</span>
          </div>

          {/* Fuel Estimate Live Advisory Card */}
          <div className="p-4 bg-[#E2EDE6] border border-[#C4DBCD] rounded-xl space-y-2 text-xs text-[#16382C]">
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5 text-[#16382C]">
                <Fuel className="w-4 h-4 text-[#16382C]" />
                Barème officiel Naftal ({fuelType.toUpperCase()}) :
              </span>
              <span className="text-xs font-bold text-[#16382C] bg-white px-2 py-0.5 rounded border border-[#C4DBCD]">
                {currentFuelEstimate.price_per_liter} DA / Litre
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 text-[11px] text-[#276243]">
              <div>
                <span className="text-[#5A625D] block">Volume estimé (8L/100) :</span>
                <strong>{currentFuelEstimate.consumption_liters} Litres</strong>
              </div>
              <div>
                <span className="text-[#5A625D] block">Coût total estimé :</span>
                <strong>{currentFuelEstimate.total_fuel_cost} DA</strong>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <span className="text-[#5A625D] block">Part suggérée / place :</span>
                <strong className="text-[#16382C] text-xs">{currentFuelEstimate.suggested_seat_contribution} DA</strong>
              </div>
            </div>
            <span className="text-[10px] text-[#16382C] block italic pt-1 border-t border-[#C4DBCD]/60">
              * Note consultative : vous fixez librement votre prix net de base en Dinars.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#303632]">Carburant utilisé</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value as any)}
                className="w-full rounded-xl border border-[#EAE5DC] bg-[#FAF7F2] p-3 text-xs font-semibold text-[#141716] focus:bg-white focus:outline-none focus:border-[#16382C]"
              >
                <option value="essence">Essence (45.62 DA/L)</option>
                <option value="diesel">Gasoil / Diesel (29.01 DA/L)</option>
                <option value="gpl">GPL / Sirghaz (9.00 DA/L)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#303632]">Places passagers offertes</label>
              <select
                value={totalSeats}
                onChange={(e) => setTotalSeats(parseInt(e.target.value, 10))}
                className="w-full rounded-xl border border-[#EAE5DC] bg-[#FAF7F2] p-3 text-xs font-semibold text-[#141716] focus:bg-white focus:outline-none focus:border-[#16382C]"
              >
                <option value={1}>1 place</option>
                <option value={2}>2 places</option>
                <option value={3}>3 places</option>
                <option value={4}>4 places</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#303632]">
                  Prix de Base / Siège (DA)
                </label>
                <span className="text-[10px] text-[#16382C] font-bold">100% net pour vous</span>
              </div>
              <input
                type="number"
                value={baseSeatPrice}
                onChange={(e) => setBaseSeatPrice(parseFloat(e.target.value) || 0)}
                className="w-full rounded-xl border border-[#EAE5DC] bg-[#FAF7F2] p-3 text-sm font-extrabold text-[#16382C] focus:bg-white focus:outline-none focus:border-[#16382C]"
                required
              />
            </div>
          </div>

          {/* Trajet Confort Toggle */}
          <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EAE5DC] space-y-2">
            <label className="flex items-center justify-between cursor-pointer">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D96B27]" />
                <span className="text-xs font-bold text-[#141716]">
                  Activer l'option « Trajet Confort » (+30%)
                </span>
              </div>
              <input
                type="checkbox"
                checked={comfortEnabled}
                onChange={(e) => setComfortEnabled(e.target.checked)}
                className="rounded text-[#16382C] focus:ring-[#16382C] h-4 w-4 border-[#C8BEAD] cursor-pointer"
              />
            </label>
            <p className="text-xs text-[#5A625D] leading-relaxed">
              Permet à un passager de réserver le siège avant pour plus d'espace avec un supplément de 30% ({Math.round(baseSeatPrice * 0.30)} DA) entièrement reversé au conducteur.
            </p>
          </div>

          {/* Live Preview of Price Breakdown */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-[#7E8681] uppercase tracking-wider block mb-2">
              Aperçu transparent des tarifs passagers (+15% commission) :
            </span>
            <PriceBreakdown baseSeatPrice={baseSeatPrice} comfortEnabled={comfortEnabled} />
          </div>
        </div>

        {/* Step 3: Vehicle details & Travel Guidelines */}
        <div className="bg-white rounded-2xl border border-[#EAE5DC] p-6 sm:p-8 shadow-fine space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#F4EFE6]">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#141716] flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-[#16382C] text-[#FAF7F2] text-[10px] flex items-center justify-center font-bold">
                3
              </span>
              <span>Véhicule & Consignes de Voyage</span>
            </h2>
            <span className="text-xs font-semibold text-[#7E8681]">Étape 3 sur 3</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#303632]">Marque du véhicule</label>
              <input
                type="text"
                value={vehicleMake}
                onChange={(e) => setVehicleMake(e.target.value)}
                placeholder="Ex: Renault, Peugeot, Volkswagen"
                className="w-full rounded-xl border border-[#EAE5DC] bg-[#FAF7F2] p-3 text-xs font-medium text-[#141716] focus:bg-white focus:outline-none focus:border-[#16382C]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#303632]">Modèle</label>
              <input
                type="text"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                placeholder="Ex: Clio 5, 208, Golf 8"
                className="w-full rounded-xl border border-[#EAE5DC] bg-[#FAF7F2] p-3 text-xs font-medium text-[#141716] focus:bg-white focus:outline-none focus:border-[#16382C]"
                required
              />
            </div>

            <div className="sm:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-[#303632]">
                Consignes pour les passagers (bagages, musique, ponctualité)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Ex: Bagages moyens acceptés. Départ ponctuel à l'heure indiquée."
                className="w-full rounded-xl border border-[#EAE5DC] bg-[#FAF7F2] p-3 text-xs font-medium text-[#141716] focus:bg-white focus:outline-none focus:border-[#16382C]"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-[#FCF7F3] rounded-xl border border-[#F0D5C3] text-xs text-[#A14114] font-medium">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4 pt-2">
          <button
            type="button"
            onClick={() => navigate('/dashboard/driver')}
            className="py-3 px-6 rounded-xl border border-[#EAE5DC] text-xs font-semibold text-[#5A625D] hover:bg-[#FAF7F2]"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="py-3.5 px-8 rounded-xl bg-[#16382C] hover:bg-[#0F281F] text-[#FAF7F2] font-bold text-xs shadow-fine active:scale-[0.98] transition-all flex items-center gap-2"
          >
            {submitting ? (
              <span>Publication en cours...</span>
            ) : (
              <>
                <Car className="w-4 h-4 text-[#FAF7F2]" />
                <span>Publier mon annonce de trajet</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
