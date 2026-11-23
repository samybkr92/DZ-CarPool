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
    <div className="bg-white rounded-xl border border-[#E6E0D6] p-5 shadow-card space-y-4 text-left">
      <div className="flex items-center justify-between pb-3 border-b border-[#F3EFE8]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#141613] flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#173C2C]" />
          <span>{t('pricing.breakdown_title', 'Détail Tarifaire Certifié')}</span>
        </h4>
        <span className="text-[11px] font-bold text-[#173C2C] bg-[#E1EDE6] border border-[#C2DBCF] px-2.5 py-0.5 rounded-md">
          {seatCount} place{seatCount > 1 ? 's' : ''} • {seatType === 'comfort' ? 'Confort' : 'Standard'}
        </span>
      </div>

      <div className="space-y-3 text-xs text-[#32362F]">
        {/* Base Price */}
        <div className="flex justify-between items-center">
          <span className="text-[#5C6057] font-medium">
            {t('pricing.base_price', 'Contribution de base')}
            {seatCount > 1 && <span className="text-[#8E9389]"> ({basePrice.toFixed(0)} DA × {seatCount})</span>}
          </span>
          <span className="font-semibold text-[#141613] tabular-nums">
            {totalBasePrice.toLocaleString('fr-DZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DA
          </span>
        </div>

        {/* 15% Platform Commission */}
        <div className="flex justify-between items-center text-[#5C6057]">
          <span className="flex items-center gap-1.5">
            <span>{t('pricing.commission', 'Frais de service DZ-CarPool (15%)')}</span>
            <span title="Frais de gestion, assistance trajet et infrastructure">
              <Info className="w-3.5 h-3.5 text-[#8E9389] inline" />
            </span>
          </span>
          <span className="font-semibold text-[#32362F] tabular-nums">
            +{commission.toLocaleString('fr-DZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DA
          </span>
        </div>

        {/* 30% Comfort Supplement */}
        {seatType === 'comfort' && (
          <div className="flex justify-between items-center p-2.5 rounded-lg bg-[#F3E8FF] border border-[#E9D5FF] text-[#581C87]">
            <span className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#6B21A8]" />
              <span>{t('pricing.comfort_fee', 'Supplément Trajet Confort (+30%)')}</span>
            </span>
            <span className="font-bold tabular-nums">
              +{comfortFee.toLocaleString('fr-DZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DA
            </span>
          </div>
        )}

        {/* Total Passenger to Pay */}
        <div className="pt-3 border-t border-[#E6E0D6] flex justify-between items-baseline">
          <div>
            <span className="block text-xs font-bold text-[#141613]">
              {t('pricing.passenger_total', 'Total Passager')}
            </span>
            <span className="text-[10px] text-[#8E9389] font-normal">
              Tarif net tout inclus en Dinars Algériens
            </span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-[#173C2C] tabular-nums">
              {totalPassengerPrice.toLocaleString('fr-DZ', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-bold text-[#173C2C] ml-1">DA</span>
          </div>
        </div>

        {/* Driver Net Payout (Transparently Separated) */}
        {showDriverPayout && (
          <div className="pt-3 border-t border-dashed border-[#E6E0D6] flex justify-between items-center text-[11px] text-[#5C6057] bg-[#FAF8F5] -mx-5 -mb-5 p-3 rounded-b-xl border-t">
            <span className="flex items-center gap-1.5 font-medium text-[#32362F]">
              <Wallet className="w-3.5 h-3.5 text-[#173C2C]" />
              <span>{t('pricing.driver_net', 'Rémunération nette conducteur')}</span>
            </span>
            <span className="font-bold text-[#141613] tabular-nums">
              {driverPayout.toLocaleString('fr-DZ', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} DA
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
