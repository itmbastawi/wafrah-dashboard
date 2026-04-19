import { AlertItem } from '../../../types/inventory';
import { formatDistanceToNow } from 'date-fns';

interface AlertTableProps {
  alerts: AlertItem[];
}

export function AlertTable({ alerts }: AlertTableProps) {
  const severityConfig: Record<string, any> = {
    critical: { color: 'text-rose-600', bg: 'bg-rose-50', icon: '🔴' },
    warning: { color: 'text-amber-600', bg: 'bg-amber-50', icon: '⚠️' },
    info: { color: 'text-blue-600', bg: 'bg-blue-50', icon: 'ℹ️' },
  };

  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <h3 className="font-semibold text-slate-900">Active Alerts</h3>
      </div>
      <div className="divide-y divide-slate-100">
        {alerts.length === 0 ? (
          <div className="p-8 text-center text-slate-500">No active alerts. Great job!</div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.product_key} className={`p-4 flex items-center gap-4 ${severityConfig[alert.severity].bg}`}>
              <span className="text-xl">{severityConfig[alert.severity].icon}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${severityConfig[alert.severity].color}`}>{alert.product_name}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-white border border-slate-200 text-slate-600">{alert.metric_type}</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">{alert.issue}</p>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${severityConfig[alert.severity].color}`}>{alert.health_score.toFixed(1)}</div>
                <div className="text-xs text-slate-400">{formatDistanceToNow(new Date(), { addSuffix: true })}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
