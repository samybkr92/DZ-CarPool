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
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FCF7F3] text-[#A14114] border border-[#D96B27]/30">
        <Coffee className="w-3.5 h-3.5 text-[#D96B27]" />
        <span>Pause 15 min obligatoire (&gt; 300 km)</span>
      </span>
    );
  }

  return (
    <div className="rounded-2xl bg-[#FCF7F3] border border-[#D96B27]/30 p-4 sm:p-5 text-[#141716] shadow-xs flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-white text-[#D96B27] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#D96B27]/20 shadow-2xs">
        <Coffee className="w-5 h-5 text-[#D96B27]" />
      </div>
      <div className="flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-xs font-bold text-[#141716] tracking-tight">
            {t('trip.mandatory_rest_title', 'Pause de sécurité obligatoire (15 minutes)')}
          </h4>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white text-[#A14114] border border-[#D96B27]/30">
            <ShieldCheck className="w-3 h-3 text-[#D96B27]" />
            Règle Sécurité Routière &gt; 300 km
          </span>
        </div>
        <p className="text-xs text-[#5A625D] leading-relaxed">
          Pour ce trajet de <strong className="text-[#141716]">{distanceKm} km</strong>, une pause minimale de 15 minutes est programmée à mi-parcours (station-service Naftal) pour le repos du conducteur et le confort des passagers.
          {cityName && (
            <span className="font-semibold text-[#A14114] block mt-1">
              Arrêt prévu vers : {cityName}.
            </span>
          )}
        </p>
      </div>
    </div>
  );
};