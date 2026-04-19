'use client';

import React from 'react';

interface StatusBadgeProps {
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL' | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toUpperCase();

  const config: Record<string, { bg: string; text: string; dot: string }> = {
    HEALTHY: {
      bg: 'bg-accent-emerald/10',
      text: 'text-accent-emerald',
      dot: 'bg-accent-emerald',
    },
    WARNING: {
      bg: 'bg-accent-amber/10',
      text: 'text-accent-amber',
      dot: 'bg-accent-amber',
    },
    CRITICAL: {
      bg: 'bg-accent-rose/10',
      text: 'text-accent-rose',
      dot: 'bg-accent-rose',
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
