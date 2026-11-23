import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, CheckCircle2, XCircle, AlertCircle, CheckCheck } from 'lucide-react';

interface StatusBadgeProps {
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'completed';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const { t } = useTranslation();

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  switch (status) {
    case 'pending':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-md bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] ${sizeClasses}`}
        >
          <Clock className={iconSize} />
          <span>{t('booking.status_pending', 'En attente')}</span>
        </span>
      );
    case 'confirmed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-md bg-[#E1EDE6] text-[#173C2C] border border-[#C2DBCF] ${sizeClasses}`}
        >
          <CheckCircle2 className={iconSize} />
          <span>{t('booking.status_confirmed', 'Confirmée')}</span>
        </span>
      );
    case 'rejected':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-md bg-rose-50 text-rose-800 border border-rose-200 ${sizeClasses}`}
        >
          <XCircle className={iconSize} />
          <span>{t('booking.status_rejected', 'Refusée')}</span>
        </span>
      );
    case 'cancelled':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-md bg-[#FAF8F5] text-[#5C6057] border border-[#E6E0D6] ${sizeClasses}`}
        >
          <AlertCircle className={iconSize} />
          <span>{t('booking.status_cancelled', 'Annulée')}</span>
        </span>
      );
    case 'completed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-md bg-[#EFF6FF] text-[#1E3A8A] border border-[#DBEAFE] ${sizeClasses}`}
        >
          <CheckCheck className={iconSize} />
          <span>{t('booking.status_completed', 'Terminé')}</span>
        </span>
      );
    default:
      return null;
  }
};
