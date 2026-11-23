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
  AlertCircle,
  HelpCircle,
  Coffee,
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

    const departureDateTime = `${departureDate}T${departureTime}:00`;

    try {
      const created = await api.createTrip({
        origin_wilaya_code: originWilayaCode,
        origin_wilaya_name: originCity,
        origin_city: originCity,
        origin_address: originAddress,
        destination_wilaya_code: destWilayaCode,
        destination_wilaya_name: destCity,
        destination_city: destCity,
        destination_address: destAddress,
        departure_datetime: departureDateTime,
        estimated_duration_minutes: durationMin,
        distance_km: distanceKm,
        total_seats: totalSeats,
        base_seat_price: Number(baseSeatPrice),
        comfort_enabled: comfortEnabled,
        vehicle_make: vehicleMake,
        vehicle_model: vehicleModel,
        notes: notes,
      });

      navigate(`/trips/${created.id}`);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la publication du trajet');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-left">
      {/* Header */}
      <div className="space-y-1.5 border-b border-[#1E2C42] pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Publier un trajet inter-wilayas
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Renseignez vos étapes, utilisez notre estimation officielle du carburant et partagez vos frais équitablement.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-xl text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Route & Schedule */}
        <div className="bg-[#131D2E] rounded-xl border border-[#1E2C42] p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-[#1E2C42]">
            <span className="w-6 h-6 rounded-md bg-[#172554] text-[#60A5FA] text-xs font-bold flex items-center justify-center border border-[#2563EB]/40">
              1
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Itinéraire & Horaires
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Origin Wilaya */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200">
                Wilaya de départ
              </label>
              <select
                value={originWilayaCode}
                onChange={(e) => handleOriginWilayaChange(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#1E2C42] bg-[#0E1624] text-xs font-bold text-white focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              >
                {WILAYAS.map((w) => (
                  <option key={w.code} value={w.code} className="bg-[#131D2E] text-white">
                    {w.code_str} - {w.name} ({w.name_ar})
                  </option>
                ))}
              </select>
            </div>

            {/* Destination Wilaya */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200">
                Wilaya d'arrivée
              </label>
              <select
                value={destWilayaCode}
                onChange={(e) => handleDestWilayaChange(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#1E2C42] bg-[#0E1624] text-xs font-bold text-white focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              >
                {WILAYAS.map((w) => (
                  <option key={w.code} value={w.code} className="bg-[#131D2E] text-white">
                    {w.code_str} - {w.name} ({w.name_ar})
                  </option>
                ))}
              </select>
            </div>

            {/* Origin Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200">
                Point de rendez-vous exact (Départ)
              </label>
              <input
                type="text"
                value={originAddress}
                onChange={(e) => setOriginAddress(e.target.value)}
                placeholder="Ex. Station de métro Tafourah, Station service Naftal"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#1E2C42] bg-[#0E1624] text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                required
              />
            </div>

            {/* Destination Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200">
                Point de dépose exact (Arrivée)
              </label>
              <input
                type="text"
                value={destAddress}
                onChange={(e) => setDestAddress(e.target.value)}
                placeholder="Ex. Place d'Armes, Rond-point El Bahia"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#1E2C42] bg-[#0E1624] text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                required
              />
            </div>

            {/* Departure Date */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200">
                Date de départ
              </label>
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#1E2C42] bg-[#0E1624] text-xs font-bold text-white focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                required
              />
            </div>

            {/* Departure Time */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200">
                Heure de départ
              </label>
              <input
                type="time"
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#1E2C42] bg-[#0E1624] text-xs font-bold text-white focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                required
              />
            </div>
          </div>

          {/* Route Distance & Mandatory Rest Stop Notice */}
          <div className="p-4 rounded-lg bg-[#0E1624] border border-[#1E2C42] space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>Distance estimée de l'axe :</span>
              <span className="text-[#60A5FA] font-extrabold">{distanceKm} km (~{Math.floor(durationMin / 60)}h{durationMin % 60 > 0 ? durationMin % 60 + 'm' : ''})</span>
            </div>

            {distanceKm > 300 ? (
              <div className="flex items-start gap-2.5 text-xs text-amber-300 bg-amber-950/60 p-3 rounded-md border border-amber-500/40">
                <Coffee className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Halte obligatoire de 15 minutes programmée</strong>
                  <span className="text-[11px] text-amber-300/80">
                    Conformément aux règles de sécurité pour les trajets supérieurs à 300 km, une pause de 15 minutes à mi-parcours (station Naftal) est automatiquement incluse.
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400">
                Trajet de moins de 300 km : pas de halte obligatoire réglementaire imposée.
              </p>
            )}
          </div>
        </div>

        {/* Step 2: Fuel Estimation & Pricing */}
        <div className="bg-[#131D2E] rounded-xl border border-[#1E2C42] p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-[#1E2C42]">
            <span className="w-6 h-6 rounded-md bg-[#172554] text-[#60A5FA] text-xs font-bold flex items-center justify-center border border-[#2563EB]/40">
              2
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Estimation Carburant & Tarification
            </h2>
          </div>

          {/* Naftal Fuel Advisory Module */}
          <div className="p-5 rounded-lg bg-[#0E1624] border border-[#1E2C42] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#60A5FA] flex items-center gap-1.5">
                <Fuel className="w-4 h-4 text-[#3B82F6]" />
                <span>Calculateur Officiel Carburant (8L/100km)</span>
              </span>
              <span className="text-[10px] font-bold text-[#60A5FA] bg-[#172554] px-2 py-0.5 rounded border border-[#2563EB]/40">
                Prix Naftal Wilaya
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#131D2E] p-3 rounded-lg border border-[#1E2C42]">
                <span className="text-slate-400 block text-[10px]">Carburant estimé</span>
                <span className="font-extrabold text-white text-base">{currentFuelEstimate.consumption_liters} Litres</span>
              </div>
              <div className="bg-[#131D2E] p-3 rounded-lg border border-[#1E2C42]">
                <span className="text-slate-400 block text-[10px]">Coût total carburant</span>
                <span className="font-extrabold text-white text-base">{currentFuelEstimate.total_fuel_cost} DA</span>
              </div>
              <div className="bg-[#131D2E] p-3 rounded-lg border border-[#1E2C42]">
                <span className="text-slate-400 block text-[10px]">Suggestion conseillée / siège</span>
                <span className="font-extrabold text-[#60A5FA] text-base">{currentFuelEstimate.suggested_seat_contribution} DA</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Donnée consultative basée sur la consommation moyenne de 8L/100km et le tarif officiel du carburant en station. Vous gardez la liberté totale de fixer votre prix de base.
            </p>
          </div>

          {/* Base Seat Price Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-200">
                  Votre contribution de base par siège (DA)
                </label>
                <button
                  type="button"
                  onClick={() => setBaseSeatPrice(Math.round(currentFuelEstimate.suggested_seat_contribution))}
                  className="text-[11px] font-bold text-[#60A5FA] hover:underline"
                >
                  Appliquer le prix conseillé
                </button>
              </div>
              <input
                type="number"
                min={100}
                max={20000}
                step={50}
                value={baseSeatPrice}
                onChange={(e) => setBaseSeatPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#1E2C42] bg-[#0E1624] text-sm font-bold text-white focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                required
              />
              <span className="text-[11px] text-slate-400 block">
                Montant net que vous percevrez intégralement pour chaque place standard.
              </span>
            </div>

            {/* Comfort Option Toggle */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200">
                Option Trajet Confort (+30%)
              </label>
              <div
                onClick={() => setComfortEnabled(!comfortEnabled)}
                className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                  comfortEnabled
                    ? 'bg-purple-950/70 border-purple-500/50 text-purple-300'
                    : 'bg-[#0E1624] border-[#1E2C42] text-slate-400'
                }`}
              >
                <div>
                  <span className="text-xs font-bold block flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Activer la place avant Confort</span>
                  </span>
                  <span className="text-[11px] text-purple-400 block">
                    Supplément de 30% (+{Math.round(baseSeatPrice * 0.3)} DA) réservé au passager avant
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={comfortEnabled}
                  onChange={(e) => setComfortEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Live Pricing Breakdown Preview */}
          <PriceBreakdown
            basePrice={baseSeatPrice}
            seatCount={1}
            seatType={comfortEnabled ? 'comfort' : 'standard'}
            showDriverPayout={true}
          />
        </div>

        {/* Step 3: Vehicle & Capacity */}
        <div className="bg-[#131D2E] rounded-xl border border-[#1E2C42] p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-[#1E2C42]">
            <span className="w-6 h-6 rounded-md bg-[#172554] text-[#60A5FA] text-xs font-bold flex items-center justify-center border border-[#2563EB]/40">
              3
            </span>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Véhicule & Places Disponibles
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200">
                Nombre de places disponibles
              </label>
              <select
                value={totalSeats}
                onChange={(e) => setTotalSeats(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#1E2C42] bg-[#0E1624] text-xs font-bold text-white focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
              >
                <option value={1} className="bg-[#131D2E] text-white">1 place</option>
                <option value={2} className="bg-[#131D2E] text-white">2 places</option>
                <option value={3} className="bg-[#131D2E] text-white">3 places (recommandé)</option>
                <option value={4} className="bg-[#131D2E] text-white">4 places max</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200">
                Marque du véhicule
              </label>
              <input
                type="text"
                value={vehicleMake}
                onChange={(e) => setVehicleMake(e.target.value)}
                placeholder="Ex. Renault, Peugeot, Volkswagen"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#1E2C42] bg-[#0E1624] text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-200">
                Modèle
              </label>
              <input
                type="text"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                placeholder="Ex. Clio 4, 208, Golf 8"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#1E2C42] bg-[#0E1624] text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-200">
              Précisions pour les passagers (bagages, musique, non-fumeur...)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#1E2C42] bg-[#0E1624] text-xs font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-5 py-3 rounded-lg border border-[#1E2C42] bg-[#131D2E] text-xs font-bold text-slate-400 hover:text-white hover:bg-[#18253A]"
          >
            Annuler
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="px-7 py-3 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] disabled:bg-[#0E1624] text-white font-bold text-xs shadow-md shadow-blue-600/30 transition-all active:scale-[0.98] flex items-center gap-2"
          >
            <Car className="w-4 h-4" />
            <span>{submitting ? 'Publication en cours...' : 'Publier mon trajet'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
