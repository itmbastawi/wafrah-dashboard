'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { DemandForecast } from '../../../types/inventory';

interface DemandChartProps {
  forecast: DemandForecast;
  id?: string;
}

export function DemandChart({ forecast, id }: DemandChartProps) {
  const chartData = forecast.weekly_breakdown.map((item) => ({
    week: item.week,
    demand: item.demand,
    cumulative: 0,
  }));

  let cumulative = 0;
  chartData.forEach((item, index) => {
    cumulative += item.demand;
    chartData[index].cumulative = cumulative;
  });

  return (
    <div id={id} className="w-full h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(99, 117, 171, 0.08)"
            vertical={false}
          />
          <XAxis
            dataKey="week"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(99, 117, 171, 0.1)' }}
            tickLine={false}
          />
          <YAxis
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
          />
          <Legend
            wrapperStyle={{
              paddingTop: '16px',
              fontSize: '12px',
            }}
          />
          <Line
            type="monotone"
            dataKey="demand"
            stroke="#22d3ee"
            strokeWidth={2.5}
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
            name="Weekly Demand"
          />
          <Line
            type="monotone"
            dataKey="cumulative"
            stroke="#8b5cf6"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Cumulative Demand"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
