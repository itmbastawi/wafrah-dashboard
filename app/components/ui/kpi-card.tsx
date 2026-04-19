'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from './card';

interface KPICardProps {
  id: string;
  label: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  glow?: 'emerald' | 'amber' | 'rose' | 'cyan' | 'violet' | 'none';
  accentColor?: string;
}

export function KPICard({
  id,
  label,
  value,
  subtitle,
  icon,
  trend = 'neutral',
  trendValue,
  glow = 'none',
  accentColor = 'text-accent-cyan',
}: KPICardProps) {
  const trendConfig = {
    up: {
      icon: <TrendingUp className="w-3.5 h-3.5" />,
      color: 'text-accent-emerald',
      bg: 'bg-accent-emerald/10',
    },
    down: {
      icon: <TrendingDown className="w-3.5 h-3.5" />,
      color: 'text-accent-rose',
      bg: 'bg-accent-rose/10',
    },
    neutral: {
      icon: <Minus className="w-3.5 h-3.5" />,
      color: 'text-text-muted',
      bg: 'bg-text-muted/10',
    },
  };

  const t = trendConfig[trend];

  return (
    <Card glow={glow} id={id}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl bg-surface-hover ${accentColor}`}>
          {icon}
        </div>
        {trendValue && (
          <div
            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${t.color} ${t.bg}`}
          >
            {t.icon}
            <span>{trendValue}</span>
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
      </div>
    </Card>
  );
}
