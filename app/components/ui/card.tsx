import { ReactNode } from 'react';

interface CardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  status?: 'good' | 'warning' | 'critical' | 'neutral';
  children?: ReactNode;
  icon?: ReactNode;
}

export function KPICard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  status = 'neutral',
  children,
  icon,
}: CardProps) {
  const statusColors: Record<string, string> = {
    good: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-500/10 text-amber-700 border-amber-200',
    critical: 'bg-rose-500/10 text-rose-700 border-rose-200',
    neutral: 'bg-slate-50 text-slate-700 border-slate-200',
  };

  return (
    <div className={`rounded-xl border p-6 shadow-sm ${statusColors[status]}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && <div className="p-2 rounded-lg bg-white shadow-sm">{icon}</div>}
          <h3 className="text-sm font-medium text-slate-600 uppercase tracking-wider">{title}</h3>
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm ${
              trend === 'up' ? 'text-emerald-600' : trend === 'down' ? 'text-rose-600' : 'text-slate-600'
            }`}
          >
            <span>{trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}</span>
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div className="mt-2">
        <div className="text-3xl font-bold text-slate-900">{value}</div>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
