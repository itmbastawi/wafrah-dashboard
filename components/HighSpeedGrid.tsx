"use client";

import { SkuFlag } from "@/lib/inventory-data";

interface HighSpeedGridProps {
  items: SkuFlag[];
}

export default function HighSpeedGrid({ items }: HighSpeedGridProps) {
  const maxVelocity = Math.max(...items.map(i => i.velocity || 0));

  return (
    <div className="bg-white dark:bg-aura-dark-card p-5 border border-aura-light-border dark:border-aura-dark-border">
      <h3 className="font-serif text-lg text-gray-900 dark:text-white mb-4">High-Velocity Stock</h3>
      <div className="space-y-3" role="list" aria-label="Top performing SKUs by velocity">
        {items.map((item, index) => (
          <div
            key={item.sku}
            role="listitem"
            className="p-3 bg-gray-50 dark:bg-gray-900/50 border border-aura-light-border dark:border-aura-dark-border"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 flex items-center justify-center bg-amber-500 text-white text-xs font-bold rounded-full">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</span>
              </div>
              <span className="text-xs px-2 py-0.5 bg-sapphire-100 text-sapphire-800 dark:bg-sapphire-900/40 dark:text-sapphire-300 rounded">
                {item.category}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${((item.velocity || 0) / maxVelocity) * 100}%` }}
                  role="progressbar"
                  aria-valuenow={item.velocity}
                  aria-valuemin={0}
                  aria-valuemax={maxVelocity}
                />
              </div>
              <span className="text-sm font-mono text-gray-700 dark:text-gray-300 w-20 text-right">
                {item.velocity?.toFixed(1)} <span className="text-gray-400 text-xs">units/day</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}