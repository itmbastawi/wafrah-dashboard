"use client";

import { Chart as ChartJS, ArcElement, Tooltip, ChartOptions } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { StockoutRateData } from "@/lib/inventory-data";

ChartJS.register(ArcElement, Tooltip);

interface StockoutRateDonutProps {
  data: StockoutRateData;
}

export default function StockoutRateDonut({ data }: StockoutRateDonutProps) {
  const chartData = {
    labels: data.byCategory.map(c => c.category),
    datasets: [
      {
        data: data.byCategory.map(c => c.rate),
        backgroundColor: ["#B8924A", "#1D9E75", "#378ADD", "#5F5E5A", "#D4537E"],
        borderWidth: 0,
        cutout: "72%",
      },
    ],
  };

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1A1A1A",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#2A2A2A",
        borderWidth: 0.5,
        padding: 12,
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.parsed}% stockout rate`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-aura-dark-card p-5 border border-aura-light-border dark:border-aura-dark-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-lg text-gray-900 dark:text-white">Stockout Rate by Category</h3>
        <div className="text-right">
          <p className="font-serif text-2xl text-gray-900 dark:text-white">{data.stockoutRate}%</p>
          <p className="text-xs text-gray-500">Overall rate</p>
        </div>
      </div>
      <div className="flex justify-center mb-4">
        <div className="h-48 w-48 relative" role="img" aria-label="Stockout rate by category donut chart">
          <Doughnut data={chartData} options={options} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <p className="font-serif text-2xl text-crimson-500">{data.stockoutRate}%</p>
              <p className="text-xs text-gray-500">Stockout</p>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-2" role="list" aria-label="Category breakdown">
        {data.byCategory.map((cat) => (
          <div key={cat.category} className="flex items-center justify-between" role="listitem">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" aria-hidden="true" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{cat.category}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">{cat.count} SKUs</span>
              <span className="text-sm font-mono text-gray-900 dark:text-white w-12 text-right">{cat.rate}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}