import React from 'react';
import { RouteType, FuelType, TravelClass, PaymentMode, PaymentStatus, BookingStatus } from '../../types/transit';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'bus' | 'metro' | 'success' | 'warning' | 'danger' | 'neutral' | 'info';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', size = 'sm' }) => {
  const styles: Record<string, string> = {
    bus: 'bg-amber-50 text-amber-800 border-amber-200/80',
    metro: 'bg-indigo-50 text-indigo-800 border-indigo-200/80',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-sky-50 text-sky-800 border-sky-200',
    neutral: 'bg-zinc-100 text-zinc-700 border-zinc-200',
  };

  const sizeStyles = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs font-semibold px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium border rounded-full ${styles[variant]} ${sizeStyles} transition-colors`}
    >
      {children}
    </span>
  );
};

export const RouteTypeBadge: React.FC<{ type: RouteType }> = ({ type }) => {
  return (
    <Badge variant={type === 'Metro' ? 'metro' : 'bus'}>
      <span className={`w-1.5 h-1.5 rounded-full ${type === 'Metro' ? 'bg-indigo-600' : 'bg-amber-600'}`} />
      {type}
    </Badge>
  );
};

export const StatusBadge: React.FC<{ status: BookingStatus | PaymentStatus | string }> = ({ status }) => {
  let variant: 'success' | 'warning' | 'danger' | 'neutral' = 'neutral';
  if (['Confirmed', 'Completed', 'Scheduled'].includes(status)) {
    variant = 'success';
  } else if (['Pending', 'In-Transit'].includes(status)) {
    variant = 'warning';
  } else if (['Cancelled', 'Failed'].includes(status)) {
    variant = 'danger';
  }

  return <Badge variant={variant}>{status}</Badge>;
};

export const FuelBadge: React.FC<{ fuel: FuelType }> = ({ fuel }) => {
  let variant: 'success' | 'info' | 'neutral' | 'warning' = 'neutral';
  if (fuel === 'Electric') variant = 'success';
  else if (fuel === 'CNG') variant = 'info';
  else if (fuel === 'Diesel') variant = 'warning';

  return <Badge variant={variant}>{fuel}</Badge>;
};

export const TravelClassBadge: React.FC<{ travelClass: TravelClass }> = ({ travelClass }) => {
  let variant: 'metro' | 'info' | 'neutral' = 'neutral';
  if (travelClass === 'Metro Express') variant = 'metro';
  else if (travelClass === 'AC') variant = 'info';

  return <Badge variant={variant}>{travelClass}</Badge>;
};
