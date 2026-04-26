'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from './card';

interface DemandKPICardProps {
  id: string;
  label: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'increasing' | 'decreasing' | 'stable';
  confidence?: number;
  border?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'none';
  accentColor?: string;
}

export function DemandKPICard({
  id,
  label,
  value,
  subtitle,
  icon,
  trend = 'stable',
  confidence,
  border = 'none',
  accentColor = 'text-primary',
}: DemandKPICardProps) {
  const trendConfig = {
    increasing: {
      icon: <TrendingUp className="w-3.5 h-3.5" />,
      color: 'text-success',
      bg: 'bg-success/10',
      label: 'Increasing',
    },
    decreasing: {
      icon: <TrendingDown className="w-3.5 h-3.5" />,
      color: 'text-danger',
      bg: 'bg-danger/10',
      label: 'Decreasing',
    },
    stable: {
      icon: <Minus className="w-3.5 h-3.5" />,
      color: 'text-primary',
      bg: 'bg-primary/10',
      label: 'Stable',
    },
  };

  const t = trendConfig[trend];

  return (
    <Card border={border} id={id}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl bg-surface-hover ${accentColor}`}>
          {icon}
        </div>
        {confidence !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${t.color} ${t.bg}`}>
            {t.icon}
            <span>{t.label}</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-text-secondary text-sm font-medium tracking-wide uppercase">
          {label}
        </p>
        <p className={`text-3xl font-bold tracking-tight ${accentColor}`}>
          {value}
        </p>
        {subtitle && (
          <p className="text-text-muted text-xs mt-1">{subtitle}</p>
        )}
        {confidence !== undefined && (
          <p className="text-text-muted text-xs mt-2">
            Confidence: <span className="font-semibold">{confidence}%</span>
          </p>
        )}
      </div>
    </Card>
  );
}

interface RecommendationBadgeProps {
  recommendation: 'reorder' | 'reduce' | 'maintain';
  riskLevel: 'high' | 'medium' | 'low';
}

export function RecommendationBadge({ recommendation, riskLevel }: RecommendationBadgeProps) {
  const config = {
    reorder: {
      color: 'text-success',
      bg: 'bg-success/10',
      border: 'border-success/20',
      icon: <CheckCircle className="w-4 h-4" />,
      label: 'Reorder Soon',
    },
    reduce: {
      color: 'text-danger',
      bg: 'bg-danger/10',
      border: 'border-danger/20',
      icon: <AlertTriangle className="w-4 h-4" />,
      label: 'Reduce Stock',
    },
    maintain: {
      color: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/20',
      icon: <AlertCircle className="w-4 h-4" />,
      label: 'Maintain',
    },
  };

  const riskConfig = {
    high: 'text-danger',
    medium: 'text-warning',
    low: 'text-success',
  };

  const rec = config[recommendation];

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${rec.bg} ${rec.color} border ${rec.border}`}>
      {rec.icon}
      <span>{rec.label}</span>
      <span className={`text-xs ${riskConfig[riskLevel]}`}>• {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk</span>
    </div>
  );
}
