import React from 'react';
import { useTranslation } from 'react-i18next';
import { Info, ShieldCheck, Sparkles, Wallet } from 'lucide-react';

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
    <div className="bg-[#131D2E] rounded-xl border border-[#1E2C42] p-5 shadow-xl space-y-4 text-left">
      <div className="flex items-center justify-between pb-3 border-b border-[#1E2C42]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#3B82F6]" />
          <span>{t('pricing.breakdown_title', 'Détail Tarifaire Certifié')}</span>
        </h4>
        <span className="text-[11px] font-bold text-[#60A5FA] bg-[#172554] border border-[#2563EB]/40 px-2.5 py-0.5 rounded-md">
          {seatCount} place{seatCount > 1 ? 's' : ''} • {seatType === 'comfort' ? 'Confort' : 'Standard'}
        </span>
      </div>

      <div className="space-y-3 text-xs text-slate-300">
        {/* Base Price */}
        <div className="flex justify-between items-center">
          <span className="text-slate-400 font-medium">
            {t('pricing.base_price', 'Contribution de base')}
            {seatCount > 1 && <span className="text-slate-500"> ({basePrice.toFixed(0)} DA × {seatCount})</span>}
          </span>
          <span className="font-semibold text-white tabular-nums">
            {totalBasePrice.toLocaleString('fr-DZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DA
          </span>
        </div>

        {/* 15% Platform Commission */}
        <div className="flex justify-between items-center text-slate-400">
          <span className="flex items-center gap-1.5">
            <span>{t('pricing.commission', 'Frais de service DZ-CarPool (15%)')}</span>
            <span title="Frais de gestion, assistance trajet et infrastructure">
              <Info className="w-3.5 h-3.5 text-slate-500 inline" />
            </span>
          </span>
          <span className="font-semibold text-slate-300 tabular-nums">
            +{commission.toLocaleString('fr-DZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DA
          </span>
        </div>

        {/* 30% Comfort Supplement */}
        {seatType === 'comfort' && (
          <div className="flex justify-between items-center p-2.5 rounded-lg bg-purple-950/60 border border-purple-500/40 text-purple-300">
            <span className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>{t('pricing.comfort_fee', 'Supplément Trajet Confort (+30%)')}</span>
            </span>
            <span className="font-bold tabular-nums">
              +{comfortFee.toLocaleString('fr-DZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DA
            </span>
          </div>
        )}

        {/* Total Passenger to Pay */}
        <div className="pt-3 border-t border-[#1E2C42] flex justify-between items-baseline">
          <div>
            <span className="block text-xs font-bold text-white">
              {t('pricing.passenger_total', 'Total Passager')}
            </span>
            <span className="text-[10px] text-slate-400 font-normal">
              Tarif net tout inclus en Dinars Algériens
            </span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-[#60A5FA] tabular-nums">
              {totalPassengerPrice.toLocaleString('fr-DZ', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-bold text-[#60A5FA] ml-1">DA</span>
          </div>
        </div>

        {/* Driver Net Payout (Transparently Separated) */}
        {showDriverPayout && (
          <div className="pt-3 border-t border-dashed border-[#1E2C42] flex justify-between items-center text-[11px] text-slate-400 bg-[#0E1624] -mx-5 -mb-5 p-3 rounded-b-xl">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Wallet className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>Rémunération nette versée au conducteur :</span>
            </span>
            <span className="font-bold text-white tabular-nums">
              {driverPayout.toLocaleString('fr-DZ', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} DA
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
