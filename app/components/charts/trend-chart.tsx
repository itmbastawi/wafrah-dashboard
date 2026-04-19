'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TrendDataPoint {
  date: string;
  score: number;
}

interface TrendChartProps {
  data: TrendDataPoint[];
  id?: string;
}

export function TrendChart({ data, id }: TrendChartProps) {
  return (
    <div id={id} className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3} />
              <stop offset="50%" stopColor="#22d3ee" stopOpacity={0.08} />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(99, 117, 171, 0.08)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
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
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#22d3ee"
            strokeWidth={2.5}
            fill="url(#trendGradient)"
            dot={{
              r: 4,
              fill: '#22d3ee',
              stroke: 'rgba(15, 23, 41, 0.8)',
              strokeWidth: 2,
            }}
            activeDot={{
              r: 6,
              fill: '#22d3ee',
              stroke: 'rgba(34, 211, 238, 0.3)',
              strokeWidth: 4,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
