import React from 'react';
import { useTranslation } from 'react-i18next';
import { Coffee, ShieldAlert } from 'lucide-react';

interface RestStopAlertProps {
  distanceKm: number;
  cityName?: string;
}

export const RestStopAlert: React.FC<RestStopAlertProps> = ({ distanceKm, cityName }) => {
  const { t } = useTranslation();

  if (distanceKm <= 300.0) {
    return null;
  }

  return (
    <div className="rounded-xl bg-amber-50/80 border border-amber-200 p-4 text-amber-900 shadow-sm flex items-start gap-3">
      <div className="p-2 rounded-lg bg-amber-100 text-amber-800 flex-shrink-0 mt-0.5">
        <Coffee className="w-5 h-5" />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold text-amber-950">
            {t('trip.mandatory_rest_title')}
          </h4>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-200 text-amber-900">
            <ShieldAlert className="w-3 h-3" />
            Règle Sécurité DZ
          </span>
        </div>
        <p className="text-xs text-amber-800 mt-1 leading-relaxed">
          {t('trip.mandatory_rest_desc')}
          {cityName && (
            <span className="font-semibold block mt-1">
              📍 Arrêt programmé au point médian vers {cityName} (Station-Service Naftal).
            </span>
          )}
        </p>
      </div>
    </div>
  );
};
