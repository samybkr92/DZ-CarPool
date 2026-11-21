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
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A]">
        <Coffee className="w-3.5 h-3.5 text-citrus-600" />
        <span>Pause 15 min obligatoire (&gt; 300 km)</span>
      </span>
    );
  }

  return (
    <div className="rounded-xl bg-[#FFFDF5] border border-[#FDE68A] p-4 text-ink-900 shadow-subtle flex items-start gap-3.5">
      <div className="w-9 h-9 rounded-lg bg-citrus-100 text-citrus-700 flex items-center justify-center flex-shrink-0 mt-0.5 border border-citrus-200">
        <Coffee className="w-4 h-4 text-citrus-700" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-xs font-bold text-ink-900 tracking-tight">
            {t('trip.mandatory_rest_title', 'Pause de sécurité obligatoire (15 minutes)')}
          </h4>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-citrus-100 text-citrus-800 border border-citrus-300/80">
            <ShieldCheck className="w-3 h-3 text-citrus-700" />
            Règle Sécurité Routière &gt; 300 km
          </span>
        </div>
        <p className="text-xs text-ink-600 leading-relaxed">
          Pour ce trajet de <strong className="text-ink-900">{distanceKm} km</strong>, une pause minimale de 15 minutes est programmée à mi-parcours (station-service Naftal) pour le repos du conducteur et le confort des passagers.
          {cityName && (
            <span className="font-semibold text-citrus-800 block mt-0.5">
              Arrêt prévu vers : {cityName}.
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
