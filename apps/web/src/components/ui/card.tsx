import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white rounded-lg border border-border overflow-hidden',
        onClick && 'cursor-pointer hover:border-accent/30 transition-colors',
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function CardHeader({ icon, title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div className={clsx('flex items-center gap-3 px-7 py-5 border-b border-border', className)}>
      {icon && (
        <div className="w-9 h-9 rounded-md bg-surface flex items-center justify-center text-lg flex-shrink-0">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="text-[17px] font-bold text-text-primary truncate">{title}</h3>
        {subtitle && <p className="text-[13px] text-text-muted mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={clsx('p-7', className)}>{children}</div>;
}
