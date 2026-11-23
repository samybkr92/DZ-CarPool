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
    <div className="bg-white rounded-2xl border border-[#EAE5DC] p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#EAE5DC]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#141716] flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#16382C]" />
          <span>{t('pricing.breakdown_title', 'Détail Tarifaire Certifié')}</span>
        </h4>
        <span className="text-[11px] font-bold text-[#16382C] bg-[#E2EDE6] border border-[#16382C]/20 px-2.5 py-0.5 rounded-full">
          {seatCount} place{seatCount > 1 ? 's' : ''} • {seatType === 'comfort' ? 'Confort' : 'Standard'}
        </span>
      </div>

      <div className="space-y-3 text-xs text-[#141716]">
        {/* Base Price */}
        <div className="flex justify-between items-center">
          <span className="text-[#5A625D] font-medium">
            {t('pricing.base_price', 'Contribution de base')}
            {seatCount > 1 && <span className="text-[#7E8681]"> ({basePrice.toFixed(0)} DA × {seatCount})</span>}
          </span>
          <span className="font-semibold text-[#141716] tabular-nums">
            {totalBasePrice.toLocaleString('fr-DZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DA
          </span>
        </div>

        {/* 15% Platform Commission */}
        <div className="flex justify-between items-center text-[#5A625D]">
          <span className="flex items-center gap-1.5">
            <span>{t('pricing.commission', 'Commission plateforme DZ-CarPool (15%)')}</span>
            <span title="Frais techniques fixes, assurance trajet et infrastructure locale">
              <Info className="w-3.5 h-3.5 text-[#7E8681] inline" />
            </span>
          </span>
          <span className="font-semibold text-[#141716] tabular-nums">
            +{commission.toLocaleString('fr-DZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DA
          </span>
        </div>

        {/* 30% Comfort Supplement */}
        {seatType === 'comfort' && (
          <div className="flex justify-between items-center p-2.5 rounded-xl bg-[#FCF7F3] border border-[#D96B27]/30 text-[#A14114]">
            <span className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#D96B27]" />
              <span>{t('pricing.comfort_fee', 'Supplément Trajet Confort (+30%)')}</span>
            </span>
            <span className="font-bold tabular-nums">
              +{comfortFee.toLocaleString('fr-DZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DA
            </span>
          </div>
        )}

        {/* Total Passenger to Pay */}
        <div className="pt-3 border-t border-[#EAE5DC] flex justify-between items-baseline">
          <div>
            <span className="block text-xs font-bold text-[#141716]">
              {t('pricing.passenger_total', 'Total Passager')}
            </span>
            <span className="text-[10px] text-[#7E8681] font-normal">
              Tarif net tout inclus en Dinars Algériens
            </span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-serif font-black text-[#16382C] tabular-nums">
              {totalPassengerPrice.toLocaleString('fr-DZ', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-bold text-[#16382C] ml-1">DA</span>
          </div>
        </div>

        {/* Driver Net Payout (Transparently Separated) */}
        {showDriverPayout && (
          <div className="pt-3 border-t border-dashed border-[#EAE5DC] flex justify-between items-center text-[11px] text-[#5A625D] bg-[#F5F1E9] -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-3.5 rounded-b-2xl border-t">
            <span className="flex items-center gap-1.5 font-medium text-[#5A625D]">
              <Wallet className="w-3.5 h-3.5 text-[#16382C]" />
              <span>{t('pricing.driver_net', 'Rémunération nette conducteur')}</span>
            </span>
            <span className="font-bold text-[#141716] tabular-nums">
              {driverPayout.toLocaleString('fr-DZ', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} DA
            </span>
          </div>
        )}
      </div>
    </div>
  );
};