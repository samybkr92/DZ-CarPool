import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, CheckCircle2, XCircle, AlertCircle, CheckCheck } from 'lucide-react';

interface StatusBadgeProps {
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'completed';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const { t } = useTranslation();

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  switch (status) {
    case 'pending':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-md bg-[#FFF8EB] text-[#8D5B04] border border-[#FDE68A] ${sizeClasses}`}
        >
          <Clock className={iconSize} />
          <span>{t('booking.status_pending', 'En attente')}</span>
        </span>
      );
    case 'confirmed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-md bg-[#ECFDF3] text-[#0E5E3A] border border-[#A6F4C5] ${sizeClasses}`}
        >
          <CheckCircle2 className={iconSize} />
          <span>{t('booking.status_confirmed', 'Confirmée')}</span>
        </span>
      );
    case 'rejected':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-md bg-[#FEF3F2] text-[#B42318] border border-[#FECDCA] ${sizeClasses}`}
        >
          <XCircle className={iconSize} />
          <span>{t('booking.status_rejected', 'Refusée')}</span>
        </span>
      );
    case 'cancelled':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-md bg-[#F8F9FA] text-[#4F5E68] border border-[#E4E9EC] ${sizeClasses}`}
        >
          <AlertCircle className={iconSize} />
          <span>{t('booking.status_cancelled', 'Annulée')}</span>
        </span>
      );
    case 'completed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-md bg-[#EFF8FF] text-[#175CD3] border border-[#B2DDFF] ${sizeClasses}`}
        >
          <CheckCheck className={iconSize} />
          <span>{t('booking.status_completed', 'Terminé')}</span>
        </span>
      );
    default:
      return null;
  }
};
