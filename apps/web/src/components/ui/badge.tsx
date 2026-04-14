import { clsx } from 'clsx';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'dark' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  success: 'bg-[rgba(0,168,126,0.12)] text-success',
  warning: 'bg-[rgba(236,126,0,0.12)] text-warning',
  danger: 'bg-[rgba(226,59,74,0.12)] text-danger',
  info: 'bg-[rgba(0,123,194,0.12)] text-info',
  dark: 'bg-dark text-white',
  default: 'bg-surface text-text-secondary',
};

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-pill text-[11px] font-semibold tracking-wide',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

// Map Odoo state to badge variant
export function getStateVariant(state: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    draft: 'default',
    active: 'success',
    production: 'success',
    pre_production: 'info',
    post_production: 'warning',
    done: 'success',
    delivered: 'success',
    cancelled: 'danger',
    paused: 'warning',
    signed: 'success',
    approved: 'success',
    review: 'warning',
    locked: 'dark',
    expired: 'danger',
    terminated: 'danger',
    pending: 'warning',
    in_progress: 'info',
    cleared: 'success',
    rejected: 'danger',
    confirmed: 'success',
    shot: 'dark',
    postponed: 'warning',
  };
  return map[state] ?? 'default';
}
