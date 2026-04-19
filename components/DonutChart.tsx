"use client";

import { Chart as ChartJS, ArcElement, Tooltip, ChartOptions } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { SegmentData } from "@/lib/data";

ChartJS.register(ArcElement, Tooltip);

interface DonutChartProps {
  segments: SegmentData[];
}

export default function DonutChart({ segments }: DonutChartProps) {
  const chartData = {
    labels: segments.map((s) => s.name),
    datasets: [
      {
        data: segments.map((s) => s.value),
        backgroundColor: segments.map((s) => s.color),
        borderWidth: 0,
        cutout: "72%",
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#1A1A1A",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#2A2A2A",
        borderWidth: 0.5,
        padding: 12,
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.parsed}%`;
          },
        },
      },
    },
  };

  const total = segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="bg-white dark:bg-aura-dark-card p-5 border border-aura-light-border dark:border-aura-dark-border">
      <h2 className="font-serif text-xl text-gray-900 dark:text-white mb-4">Customer Segments</h2>
      <div className="flex justify-center mb-4">
        <div className="h-48 w-48 relative" role="img" aria-label="Customer segments distribution donut chart">
          <Doughnut data={chartData} options={options} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="font-serif text-2xl text-gray-900 dark:text-white">{total}%</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-3" role="list" aria-label="Segment legend">
        {segments.map((segment) => (
          <div key={segment.name} className="flex items-center justify-between" role="listitem">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3"
                style={{ backgroundColor: segment.color }}
                aria-hidden="true"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{segment.name}</span>
            </div>
            <span className="font-serif text-sm text-gray-900 dark:text-white">{segment.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}