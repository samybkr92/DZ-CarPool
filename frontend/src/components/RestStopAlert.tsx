import React from 'react';
import { useTranslation } from 'react-i18next';
import { Coffee, ShieldCheck } from 'lucide-react';

interface RestStopAlertProps {
  distanceKm: number;
  cityName?: string;
  compact?: boolean;
}

export const RestStopAlert: React.FC<RestStopAlertProps> = ({ distanceKm, cityName, compact = false }) => {
  const { t } = useTranslation();

  if (distanceKm <= 300.0) {
    return null;
  }

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-950/70 text-amber-300 border border-amber-500/40">
        <Coffee className="w-3.5 h-3.5 text-amber-400" />
        <span>Pause Naftal 15 min (&gt; 300 km)</span>
      </span>
    );
  }

  return (
    <div className="rounded-xl bg-amber-950/40 border border-amber-500/40 p-4 sm:p-5 text-slate-200 shadow-xl flex items-start gap-4 text-left">
      <div className="w-9 h-9 rounded-lg bg-amber-950/80 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-500/40">
        <Coffee className="w-4 h-4 text-amber-400" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-xs font-bold text-white tracking-tight">
            {t('trip.mandatory_rest_title', 'Halte de sécurité obligatoire (15 minutes)')}
          </h4>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-500/40">
            <ShieldCheck className="w-3 h-3 text-amber-400" />
            Règle Sécurité &gt; 300 km
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Pour ce trajet de <strong className="text-white">{distanceKm} km</strong>, une pause minimale de 15 minutes est automatiquement programmée à mi-parcours (station-service Naftal) pour le repos du conducteur et le confort des passagers.
          {cityName && (
            <span className="font-semibold text-amber-300 block mt-1">
              Station Naftal prévue : secteur {cityName}.
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
