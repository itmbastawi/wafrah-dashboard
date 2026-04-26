'use client';

import React from 'react';
import {
  AlertTriangle,
  AlertCircle,
  Info,
} from 'lucide-react';
import type { AlertItem } from '../../../types/inventory';
import { StatusBadge } from '../ui/status-badge';

interface AlertsTableProps {
  alerts: AlertItem[];
  id?: string;
}

function SeverityIcon({ severity }: { severity: string }) {
  switch (severity) {
    case 'critical':
      return <AlertCircle className="w-4 h-4 text-danger" />;
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-warning" />;
    default:
      return <Info className="w-4 h-4 text-primary" />;
  }
}

function getScoreColor(score: number): string {
  if (score >= 75) return 'text-success';
  if (score >= 50) return 'text-warning';
  return 'text-danger';
}

export function AlertsTable({ alerts, id }: AlertsTableProps) {
  if (alerts.length === 0) {
    return (
      <div id={id} className="flex flex-col items-center justify-center py-12 text-text-muted">
        <Info className="w-10 h-10 mb-3 opacity-50" />
        <p className="text-sm font-medium">No alerts at this time</p>
        <p className="text-xs mt-1 opacity-70">All inventory items are within healthy thresholds</p>
      </div>
    );
  }

  return (
    <div id={id} className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-default">
            <th className="text-left py-3 px-4 text-text-muted font-semibold text-xs uppercase tracking-wider">
              Severity
            </th>
            <th className="text-left py-3 px-4 text-text-muted font-semibold text-xs uppercase tracking-wider">
              Product
            </th>
            <th className="text-left py-3 px-4 text-text-muted font-semibold text-xs uppercase tracking-wider">
              Issue
            </th>
            <th className="text-left py-3 px-4 text-text-muted font-semibold text-xs uppercase tracking-wider">
              Score
            </th>
            <th className="text-left py-3 px-4 text-text-muted font-semibold text-xs uppercase tracking-wider">
              Metric
            </th>
          </tr>
        </thead>
        <tbody>
          {alerts.map((alert, index) => (
            <tr
              key={`${alert.product_key}-${index}`}
              className="table-row-hover border-b border-border-default/50 last:border-0"
            >
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-2">
                  <SeverityIcon severity={alert.severity} />
                  <StatusBadge
                    status={
                      alert.severity === 'critical'
                        ? 'CRITICAL'
                        : alert.severity === 'warning'
                          ? 'WARNING'
                          : 'HEALTHY'
                    }
                  />
                </div>
              </td>
              <td className="py-3.5 px-4 text-text-primary font-medium">
                {alert.product_name}
              </td>
              <td className="py-3.5 px-4 text-text-secondary max-w-xs truncate">
                {alert.issue}
              </td>
              <td className={`py-3.5 px-4 font-bold ${getScoreColor(alert.health_score)}`}>
                {alert.health_score.toFixed(1)}
              </td>
              <td className="py-3.5 px-4">
                <span className="inline-flex px-2 py-0.5 rounded-md bg-surface-elevated text-text-secondary text-xs font-medium">
                  {alert.metric_type}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
