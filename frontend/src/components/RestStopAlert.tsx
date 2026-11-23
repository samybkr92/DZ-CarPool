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
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] shadow-subtle">
        <Coffee className="w-3.5 h-3.5 text-[#92400E]" />
        <span>Pause Naftal 15 min (&gt; 300 km)</span>
      </span>
    );
  }

  return (
    <div className="rounded-xl bg-[#FEF3C7]/80 border border-[#FDE68A] p-4 sm:p-5 text-[#141613] shadow-subtle flex items-start gap-4 text-left">
      <div className="w-9 h-9 rounded-lg bg-[#FDE68A] text-[#92400E] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#FCD34D]">
        <Coffee className="w-4 h-4 text-[#92400E]" />
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-xs font-bold text-[#141613] tracking-tight">
            {t('trip.mandatory_rest_title', 'Halte de sécurité obligatoire (15 minutes)')}
          </h4>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#FDE68A] text-[#92400E] border border-[#FCD34D]">
            <ShieldCheck className="w-3 h-3 text-[#92400E]" />
            Règle Sécurité &gt; 300 km
          </span>
        </div>
        <p className="text-xs text-[#5C6057] leading-relaxed">
          Pour ce trajet de <strong className="text-[#141613]">{distanceKm} km</strong>, une pause minimale de 15 minutes est automatiquement programmée à mi-parcours (station-service Naftal) pour le repos du conducteur et le confort des passagers.
          {cityName && (
            <span className="font-semibold text-[#92400E] block mt-1">
              Station Naftal prévue : secteur {cityName}.
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
