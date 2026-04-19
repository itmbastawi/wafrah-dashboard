'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { HealthScore } from '../../../types/inventory';

interface ProductBarChartProps {
  products: HealthScore[];
  id?: string;
}

function getBarColor(score: number): string {
  if (score >= 75) return '#34d399';
  if (score >= 50) return '#fbbf24';
  return '#fb7185';
}

export function ProductBarChart({ products, id }: ProductBarChartProps) {
  const data = products.map((p) => ({
    name: p.product_name.length > 15
      ? p.product_name.substring(0, 15) + '…'
      : p.product_name,
    fullName: p.product_name,
    score: p.health_score,
    status: p.health_status,
  }));

  return (
    <div id={id} className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="20%">
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(99, 117, 171, 0.08)"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            axisLine={{ stroke: 'rgba(99, 117, 171, 0.1)' }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
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
            formatter={(value) => [`${Number(value).toFixed(1)}`, 'Health Score']}
            labelFormatter={(_label, payload) => {
              if (payload && payload.length > 0) {
                return (payload[0].payload as { fullName: string }).fullName;
              }
              return String(_label);
            }}
            cursor={{ fill: 'rgba(99, 117, 171, 0.05)' }}
          />
          <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={48}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
