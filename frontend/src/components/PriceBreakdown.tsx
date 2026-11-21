import React from 'react';
import { useTranslation } from 'react-i18next';
import { Info, ShieldCheck, Sparkles, Wallet, Check } from 'lucide-react';

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

  const totalBasePrice = Math.round(basePrice * seatCount * 100) / 100;
  const commission = Math.round(totalBasePrice * 0.15 * 100) / 100;
  const comfortFee = seatType === 'comfort' ? Math.round(totalBasePrice * 0.30 * 100) / 100 : 0;
  const totalPassengerPrice = Math.round((totalBasePrice + commission + comfortFee) * 100) / 100;
  const driverPayout = seatType === 'comfort'
    ? Math.round((totalBasePrice + comfortFee) * 100) / 100
    : totalBasePrice;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3.5">
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          {t('pricing.breakdown_title', 'Détail Tarifaire Certifié')}
        </h4>
        <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
          {seatCount} place{seatCount > 1 ? 's' : ''} • {seatType === 'comfort' ? 'Confort' : 'Standard'}
        </span>
      </div>

      <div className="space-y-2.5 text-xs text-slate-700">
        {/* Base Price */}
        <div className="flex justify-between items-center">
          <span className="text-slate-600 font-medium">
            {t('pricing.base_price', 'Contribution de base')}
            {seatCount > 1 && <span className="text-slate-400"> ({basePrice.toFixed(0)} DA × {seatCount})</span>}
          </span>
          <span className="font-semibold text-slate-900 tabular-nums">
            {totalBasePrice.toLocaleString('fr-DZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DA
          </span>
        </div>

        {/* 15% Platform Commission */}
        <div className="flex justify-between items-center text-slate-600">
          <span className="flex items-center gap-1.5">
            <span>{t('pricing.commission', 'Commission plateforme DZ-CarPool (15%)')}</span>
            <span title="Frais techniques fixes, assurance trajet et infrastructure locale">
              <Info className="w-3.5 h-3.5 text-slate-400 inline" />
            </span>
          </span>
          <span className="font-semibold text-slate-700 tabular-nums">
            +{commission.toLocaleString('fr-DZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DA
          </span>
        </div>

        {/* 30% Comfort Supplement */}
        {seatType === 'comfort' && (
          <div className="flex justify-between items-center p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-950">
            <span className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{t('pricing.comfort_fee', 'Supplément Trajet Confort (+30%)')}</span>
            </span>
            <span className="font-bold tabular-nums">
              +{comfortFee.toLocaleString('fr-DZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DA
            </span>
          </div>
        )}

        {/* Total Passenger to Pay */}
        <div className="pt-2.5 border-t border-slate-200 flex justify-between items-baseline">
          <div>
            <span className="block text-xs font-bold text-slate-900">
              {t('pricing.passenger_total', 'Total Passager')}
            </span>
            <span className="text-[10px] text-slate-500 font-normal">
              Tarif net tout inclus en Dinars Algériens
            </span>
          </div>
          <div className="text-right">
            <span className="text-xl font-black text-emerald-700 tabular-nums">
              {totalPassengerPrice.toLocaleString('fr-DZ', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-bold text-emerald-800 ml-1">DA</span>
          </div>
        </div>

        {/* Driver Net Payout (Transparently Separated) */}
        {showDriverPayout && (
          <div className="pt-2.5 border-t border-dashed border-slate-200 flex justify-between items-center text-[11px] text-slate-500 bg-slate-50 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-3 rounded-b-xl border-t">
            <span className="flex items-center gap-1.5 font-medium text-slate-600">
              <Wallet className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('pricing.driver_net', 'Rémunération nette conducteur')}</span>
            </span>
            <span className="font-bold text-slate-900 tabular-nums">
              {driverPayout.toLocaleString('fr-DZ', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} DA
            </span>
          </div>
        )}
      </div>
    </div>
  );
};