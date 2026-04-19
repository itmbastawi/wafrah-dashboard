'use client';

import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { HealthScore } from '../../../types/inventory';

interface HealthRadarProps {
  product: HealthScore;
  id?: string;
}

export function HealthRadar({ product, id }: HealthRadarProps) {
  const data = [
    { dimension: 'Availability', value: product.availability_score, fullMark: 100 },
    { dimension: 'Turnover', value: product.turnover_score, fullMark: 100 },
    { dimension: 'Freshness', value: product.freshness_score, fullMark: 100 },
    { dimension: 'Balance', value: product.balance_score, fullMark: 100 },
    { dimension: 'Value', value: product.value_score, fullMark: 100 },
  ];

  const color =
    product.health_score >= 75
      ? '#34d399'
      : product.health_score >= 50
        ? '#fbbf24'
        : '#fb7185';

  return (
    <div id={id} className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid
            stroke="rgba(99, 117, 171, 0.15)"
            strokeDasharray="3 3"
          />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#64748b', fontSize: 10 }}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(17, 25, 54, 0.95)',
              border: '1px solid rgba(99, 117, 171, 0.2)',
              borderRadius: '12px',
              color: '#f1f5f9',
              fontSize: '13px',
              backdropFilter: 'blur(12px)',
            }}
            formatter={(value) => [`${value}`, 'Score']}
          />
          <Radar
            name={product.product_name}
            dataKey="value"
            stroke={color}
            fill={color}
            fillOpacity={0.15}
            strokeWidth={2}
            dot={{
              r: 4,
              fill: color,
              stroke: 'rgba(15, 23, 41, 0.8)',
              strokeWidth: 2,
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
