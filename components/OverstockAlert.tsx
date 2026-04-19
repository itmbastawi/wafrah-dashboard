"use client";

import { SkuFlag } from "@/lib/inventory-data";

interface OverstockAlertProps {
  items: SkuFlag[];
  count: number;
  totalExcessUnits: number;
  totalHoldingCost: number;
}

const actionStyles = {
  reduce: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  promote: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300",
  discontinue: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
};

export default function OverstockAlert({ items, count, totalExcessUnits, totalHoldingCost }: OverstockAlertProps) {
  return (
    <div className="bg-white dark:bg-aura-dark-card border border-aura-light-border dark:border-aura-dark-border">
      <div className="p-4 border-b border-aura-light-border dark:border-aura-dark-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-serif text-lg text-gray-900 dark:text-white">Overstock Alerts (180+ Days)</h3>
          <span className="text-sm text-gray-500">{count} SKUs</span>
        </div>
        <div className="flex gap-6">
          <div>
            <p className="text-xs text-gray-500">Excess Units</p>
            <p className="font-serif text-xl text-amber-600 dark:text-amber-400">{totalExcessUnits.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Holding Cost</p>
            <p className="font-serif text-xl text-amber-600 dark:text-amber-400">${totalHoldingCost.toLocaleString()}/mo</p>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full" role="table" aria-label="Overstock inventory items">
          <thead>
            <tr className="bg-amber-50 dark:bg-amber-900/20">
              {["sku", "name", "excessUnits", "holdingCost", "action"].map((col) => (
                <th
                  key={col}
                  className="px-4 py-3 text-xs font-medium text-amber-800 dark:text-amber-300 uppercase text-left"
                  role="columnheader"
                >
                  {col === "excessUnits" ? "Excess" : col === "holdingCost" ? "Cost" : col.charAt(0).toUpperCase() + col.slice(1)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-aura-light-border dark:divide-aura-dark-border">
            {items.map((item) => (
              <tr key={item.sku} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-mono">{item.sku}</td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.name}</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-mono font-medium">{item.excessUnits}</td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 font-mono">${item.holdingCost?.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${actionStyles[item.action || 'reduce']}`}
                    role="status"
                    aria-label={`Recommended action: ${item.action}`}
                  >
                    {item.action}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}