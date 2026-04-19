"use client";

import { SkuFlag } from "@/lib/inventory-data";

interface SafetyStockGaugeProps {
  items: SkuFlag[];
}

const getGapStatus = (onHand: number, safetyStock: number | undefined): "healthy" | "warning" | "critical" => {
  if (!safetyStock) return "warning";
  const ratio = onHand / safetyStock;
  if (ratio >= 1) return "healthy";
  if (ratio >= 0.5) return "warning";
  return "critical";
};

type GapStatus = "healthy" | "warning" | "critical";

const gapColors: Record<GapStatus, string> = {
  healthy: "bg-emerald-500",
  warning: "bg-amber-500",
  critical: "bg-crimson-500",
};

const gapTextColors: Record<GapStatus, string> = {
  healthy: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  critical: "text-crimson-600 dark:text-crimson-400",
};

export default function SafetyStockGauge({ items }: SafetyStockGaugeProps) {
  const maxSafety = Math.max(...items.map(i => i.safetyStock || 0));

  return (
    <div className="bg-white dark:bg-aura-dark-card p-5 border border-aura-light-border dark:border-aura-dark-border">
      <h3 className="font-serif text-lg text-gray-900 dark:text-white mb-4">Safety Stock Gap</h3>
      <div className="space-y-4" role="list" aria-label="Safety stock levels by SKU">
        {items.map((item) => {
          const status = getGapStatus(item.onHand, item.safetyStock);
          const safetyQty = item.safetyStock || 0;
          const actualPercent = Math.min((item.onHand / safetyQty) * 100, 100);
          const thresholdPercent = 100;

          return (
            <div key={item.sku} role="listitem">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</span>
                <span className={`text-xs font-mono ${gapTextColors[status]}`}>
                  {item.onHand} / {safetyQty} units
                </span>
              </div>
              <div className="relative h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`absolute h-full ${gapColors[status]} transition-all duration-500`}
                  style={{ width: `${actualPercent}%` }}
                  role="progressbar"
                  aria-valuenow={item.onHand}
                  aria-valuemin={0}
                  aria-valuemax={safetyQty}
                  aria-label={`${item.name}: ${item.onHand} of ${safetyQty} safety stock`}
                />
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-gray-400"
                  style={{ left: `${thresholdPercent}%` }}
                  aria-hidden="true"
                />
              </div>
              {status !== "healthy" && (
                <p className={`text-xs mt-1 ${gapTextColors[status]}`}>
                  {status === "critical" ? "Critical gap - reorder immediately" : "Below safety threshold"}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}