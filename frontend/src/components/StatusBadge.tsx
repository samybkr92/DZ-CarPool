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
          className={`inline-flex items-center gap-1.5 font-bold rounded-md bg-amber-950/70 text-amber-300 border border-amber-500/40 ${sizeClasses}`}
        >
          <Clock className={iconSize} />
          <span>{t('booking.status_pending', 'En attente')}</span>
        </span>
      );
    case 'confirmed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-md bg-[#172554] text-[#60A5FA] border border-[#2563EB]/40 ${sizeClasses}`}
        >
          <CheckCircle2 className={iconSize} />
          <span>{t('booking.status_confirmed', 'Confirmée')}</span>
        </span>
      );
    case 'rejected':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-md bg-rose-950/70 text-rose-300 border border-rose-800 ${sizeClasses}`}
        >
          <XCircle className={iconSize} />
          <span>{t('booking.status_rejected', 'Refusée')}</span>
        </span>
      );
    case 'cancelled':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-md bg-[#18253A] text-slate-400 border border-[#1E2C42] ${sizeClasses}`}
        >
          <AlertCircle className={iconSize} />
          <span>{t('booking.status_cancelled', 'Annulée')}</span>
        </span>
      );
    case 'completed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-md bg-[#1E293B] text-sky-300 border border-sky-500/40 ${sizeClasses}`}
        >
          <CheckCheck className={iconSize} />
          <span>{t('booking.status_completed', 'Terminé')}</span>
        </span>
      );
    default:
      return null;
  }
};
