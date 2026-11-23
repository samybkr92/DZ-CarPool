import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, CheckCircle2, XCircle, AlertCircle, CheckCheck } from 'lucide-react';

interface StatusBadgeProps {
  status: 'pending' | 'confirmed' | 'rejected' | 'cancelled' | 'completed';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const { t } = useTranslation();

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1 text-xs';
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  switch (status) {
    case 'pending':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-amber-50 text-amber-800 border border-amber-200 ${sizeClasses}`}
        >
          <Clock className={iconSize} />
          <span>{t('booking.status_pending', 'En attente')}</span>
        </span>
      );
    case 'confirmed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 ${sizeClasses}`}
        >
          <CheckCircle2 className={iconSize} />
          <span>{t('booking.status_confirmed', 'Confirmée')}</span>
        </span>
      );
    case 'rejected':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-rose-50 text-rose-800 border border-rose-200 ${sizeClasses}`}
        >
          <XCircle className={iconSize} />
          <span>{t('booking.status_rejected', 'Refusée')}</span>
        </span>
      );
    case 'cancelled':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-slate-100 text-slate-600 border border-slate-200 ${sizeClasses}`}
        >
          <AlertCircle className={iconSize} />
          <span>{t('booking.status_cancelled', 'Annulée')}</span>
        </span>
      );
    case 'completed':
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-blue-50 text-blue-800 border border-blue-200 ${sizeClasses}`}
        >
          <CheckCheck className={iconSize} />
          <span>{t('booking.status_completed', 'Terminé')}</span>
        </span>
      );
    default:
      return null;
  }
};