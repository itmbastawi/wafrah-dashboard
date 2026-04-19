"use client";

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";
import { InventoryKpi } from "@/lib/inventory-data";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

interface TurnoverRateCardProps {
  kpi: InventoryKpi;
}

export default function TurnoverRateCard({ kpi }: TurnoverRateCardProps) {
  const isPositive = kpi.turnoverTrend[kpi.turnoverTrend.length - 1] >= kpi.turnoverTrend[0];
  
  const sparklineData = {
    labels: kpi.turnoverTrend.map((_, i) => `W${i + 1}`),
    datasets: [
      {
        data: kpi.turnoverTrend,
        borderColor: isPositive ? "#1D9E75" : "#E24B4A",
        backgroundColor: "transparent",
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        borderWidth: 2,
      },
    ],
  };

  const sparklineOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    elements: { point: { radius: 0 } },
  };

  const trendPercent = ((kpi.turnoverTrend[kpi.turnoverTrend.length - 1] - kpi.turnoverTrend[0]) / kpi.turnoverTrend[0] * 100).toFixed(1);

  return (
    <div className="bg-white dark:bg-aura-dark-card p-5 border border-aura-light-border dark:border-aura-dark-border border-l-3 border-l-amber-500">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Inventory Turnover Rate</p>
      <div className="flex items-end justify-between mb-2">
        <p className="font-serif text-4xl text-gray-900 dark:text-white">{kpi.turnoverRate}x</p>
        <span className={`text-sm font-medium px-2 py-0.5 rounded ${isPositive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-crimson-100 text-crimson-700 dark:bg-crimson-900/30 dark:text-crimson-400'}`}>
          {isPositive ? '↑' : '↓'} {trendPercent}%
        </span>
      </div>
      <div className="h-16" role="img" aria-label={`Turnover rate trend: ${isPositive ? 'increasing' : 'decreasing'} by ${trendPercent}%`}>
        <Line data={sparklineData} options={sparklineOptions} />
      </div>
    </div>
  );
}