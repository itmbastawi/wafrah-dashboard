"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useState } from "react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

interface RevenueChartProps {
  labels: string[];
  data: number[];
}

const timeRanges = [
  { label: "30d", value: "30d" },
  { label: "90d", value: "90d" },
  { label: "1Y", value: "1Y" },
  { label: "All", value: "All" },
];

export default function RevenueChart({ labels, data }: RevenueChartProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentRange = searchParams.get("range") || "30d";

  const chartData = {
    labels,
    datasets: [
      {
        data,
        fill: true,
        borderColor: "#B8924A",
        backgroundColor: "rgba(184, 146, 74, 0.1)",
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: "#B8924A",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index",
    },
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
        displayColors: false,
        callbacks: {
          label: function (context) {
            const value = context.parsed.y ?? 0;
            return `$${value.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#666",
          font: {
            family: "DM Sans",
          },
          maxTicksLimit: 8,
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "#666",
          font: {
            family: "DM Sans",
          },
          callback: function (value) {
            return "$" + (Number(value) / 1000).toFixed(0) + "k";
          },
        },
        border: {
          display: false,
        },
      },
    },
  };

  const handleRangeChange = (range: string) => {
    router.push(`?range=${range}`);
  };

  return (
    <div className="bg-white dark:bg-aura-dark-card p-5 border border-aura-light-border dark:border-aura-dark-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-xl text-gray-900 dark:text-white">Revenue Overview</h2>
        <div className="flex gap-1" role="group" aria-label="Time range selector">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => handleRangeChange(range.value)}
              className={`px-3 py-1.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-aura-gold focus:ring-offset-1 dark:focus:ring-offset-aura-dark ${
                currentRange === range.value
                  ? "bg-aura-gold text-white"
                  : "bg-transparent text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              aria-pressed={currentRange === range.value}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64" role="img" aria-label="Revenue chart showing trend over time">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}