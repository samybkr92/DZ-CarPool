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
          className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-[#FCF7F3] text-[#A14114] border border-[#D96B27]/30 ${sizeClasses}`}
        >
          <Clock className={iconSize} />
          <span>{t('booking.status_pending', 'En attente')}</span>
        </span>
      );
    case 'confirmed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-[#E2EDE6] text-[#16382C] border border-[#16382C]/20 ${sizeClasses}`}
        >
          <CheckCircle2 className={iconSize} />
          <span>{t('booking.status_confirmed', 'Confirmée')}</span>
        </span>
      );
    case 'rejected':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-[#FEF3F2] text-[#9E1C1C] border border-[#FECDCA] ${sizeClasses}`}
        >
          <XCircle className={iconSize} />
          <span>{t('booking.status_rejected', 'Refusée')}</span>
        </span>
      );
    case 'cancelled':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-[#F5F1E9] text-[#5A625D] border border-[#EAE5DC] ${sizeClasses}`}
        >
          <AlertCircle className={iconSize} />
          <span>{t('booking.status_cancelled', 'Annulée')}</span>
        </span>
      );
    case 'completed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-[#F5F1E9] text-[#141716] border border-[#EAE5DC] ${sizeClasses}`}
        >
          <CheckCheck className={iconSize} />
          <span>{t('booking.status_completed', 'Terminé')}</span>
        </span>
      );
    default:
      return null;
  }
};
