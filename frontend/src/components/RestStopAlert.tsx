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
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 shadow-soft-xs">
        <Coffee className="w-3.5 h-3.5 text-amber-600" />
        <span>Pause Naftal 15 min (&gt; 300 km)</span>
      </span>
    );
  }

  return (
    <div className="rounded-2xl bg-amber-50/90 border border-amber-200/90 p-4 sm:p-5 text-slate-900 shadow-soft-xs flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-300 shadow-soft-xs">
        <Coffee className="w-5 h-5 text-amber-700" />
      </div>
      <div className="flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-xs font-bold text-slate-900 tracking-tight">
            {t('trip.mandatory_rest_title', 'Halte de sécurité obligatoire (15 minutes)')}
          </h4>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">
            <ShieldCheck className="w-3 h-3 text-amber-700" />
            Règle Sécurité &gt; 300 km
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Pour ce trajet longue distance de <strong className="text-slate-900">{distanceKm} km</strong>, une pause minimale de 15 minutes est automatiquement programmée à mi-parcours (station-service Naftal) pour le repos du conducteur et le confort des passagers.
          {cityName && (
            <span className="font-semibold text-amber-900 block mt-1">
              Halte prévue vers : {cityName}.
            </span>
          )}
        </p>
      </div>
    </div>
  );
};