'use client';

import React from 'react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip,
} from 'recharts';
import type { Product } from '../../../types/products';

interface ProductRadarProps { product: Product; }

export function ProductRadar({ product }: ProductRadarProps) {
  const data = [
    { subject: 'Availability', value: product.availability_score },
    { subject: 'Turnover', value: product.turnover_score },
    { subject: 'Freshness', value: product.freshness_score },
    { subject: 'Balance', value: product.balance_score },
    { subject: 'Value', value: product.value_score },
  ];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
        <PolarGrid stroke="rgba(99,117,171,0.2)" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 500 }}
        />
        <Radar
          dataKey="value"
          stroke="#22d3ee"
          fill="#22d3ee"
          fillOpacity={0.15}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{ background: 'rgba(17,25,54,0.95)', border: '1px solid rgba(99,117,171,0.2)', borderRadius: '10px', color: '#f1f5f9' }}
          formatter={(v) => [`${v ?? ''}`, 'Score']}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
