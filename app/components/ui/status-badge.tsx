'use client';

import React from 'react';

interface StatusBadgeProps {
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL' | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toUpperCase();

  const config: Record<string, { bg: string; text: string; dot: string }> = {
    HEALTHY: {
      bg: 'bg-success/10',
      text: 'text-success',
      dot: 'bg-success',
    },
    WARNING: {
      bg: 'bg-warning/10',
      text: 'text-warning',
      dot: 'bg-warning',
    },
    CRITICAL: {
      bg: 'bg-danger/10',
      text: 'text-danger',
      dot: 'bg-danger',
    },
  };

  const c = config[normalized] || config.WARNING;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${c.bg} ${c.text}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${c.dot} ${
          normalized === 'CRITICAL' ? 'animate-pulse-glow' : ''
        }`}
      />
      {normalized}
    </span>
  );
}
