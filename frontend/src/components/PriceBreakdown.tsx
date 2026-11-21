import React from 'react';
import { useTranslation } from 'react-i18next';
import { Info, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';

interface PriceBreakdownProps {
  basePrice: number;
  seatCount?: number;
  seatType?: 'standard' | 'comfort';
  showDriverPayout?: boolean;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  basePrice,
  seatCount = 1,
  seatType = 'standard',
  showDriverPayout = true,
}) => {
  const { t } = useTranslation();

  const totalBasePrice = basePrice * seatCount;
  const commission = Math.round(totalBasePrice * 0.15 * 100) / 100;
  const comfortFee = seatType === 'comfort' ? Math.round(totalBasePrice * 0.30 * 100) / 100 : 0;
  const totalPassengerPrice = Math.round((totalBasePrice + commission + comfortFee) * 100) / 100;
  const driverPayout = seatType === 'comfort'
    ? Math.round((totalBasePrice + comfortFee) * 100) / 100
    : totalBasePrice;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          {t('pricing.breakdown_title')}
        </h4>
        <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
          {seatCount} place(s) • {seatType === 'comfort' ? 'Confort' : 'Standard'}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        {/* Base Price */}
        <div className="flex justify-between items-center">
          <span className="text-gray-700">{t('pricing.base_price')}</span>
          <span className="font-medium text-gray-900">{totalBasePrice.toFixed(2)} {t('pricing.currency')}</span>
        </div>

        {/* 15% Platform Commission */}
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500 flex items-center gap-1">
            {t('pricing.commission')}
            <span title="Frais de gestion et d'infrastructure de DZ-CarPool">
              <Info className="w-3.5 h-3.5 text-gray-400 inline" />
            </span>
          </span>
          <span className="font-medium text-gray-700">+{commission.toFixed(2)} {t('pricing.currency')}</span>
        </div>

        {/* 30% Comfort Supplement */}
        {seatType === 'comfort' && (
          <div className="flex justify-between items-center text-xs text-amber-700 bg-amber-50/70 px-2 py-1.5 rounded-lg border border-amber-100">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              {t('pricing.comfort_fee')}
            </span>
            <span className="font-bold">+{comfortFee.toFixed(2)} {t('pricing.currency')}</span>
          </div>
        )}

        {/* Total Passenger */}
        <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
          <span className="font-semibold text-gray-900">{t('pricing.passenger_total')}</span>
          <span className="text-lg font-extrabold text-emerald-700">
            {totalPassengerPrice.toFixed(2)} {t('pricing.currency')}
          </span>
        </div>

        {/* Driver Net Payout */}
        {showDriverPayout && (
          <div className="pt-2 border-t border-dashed border-gray-100 flex justify-between items-center text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              {t('pricing.driver_payout')}
            </span>
            <span className="font-semibold text-gray-800">
              {driverPayout.toFixed(2)} {t('pricing.currency')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
