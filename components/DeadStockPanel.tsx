"use client";

import { useState, useMemo } from "react";
import { SkuFlag } from "@/lib/inventory-data";

interface DeadStockPanelProps {
  items: SkuFlag[];
  count: number;
  totalValue: number;
}

type SortKey = "sku" | "name" | "daysIdle" | "value";
type SortDirection = "asc" | "desc";

export default function DeadStockPanel({ items, count, totalValue }: DeadStockPanelProps) {
  const [sortKey, setSortKey] = useState<SortKey>("daysIdle");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return 0;
    });
  }, [items, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <span className="ml-1 opacity-30">↕</span>;
    return <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>;
  };

  const getColumnLabel = (col: SortKey) => {
    if (col === "daysIdle") return "Days Idle";
    if (col === "value") return "Value ($)";
    return col.charAt(0).toUpperCase() + col.slice(1);
  };

  return (
    <div className="bg-white dark:bg-aura-dark-card border border-aura-light-border dark:border-aura-dark-border">
      <div className="p-4 border-b border-aura-light-border dark:border-aura-dark-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-serif text-lg text-gray-900 dark:text-white">Dead Stock (90+ Days)</h3>
          <span className="text-sm text-gray-500">{count} SKUs</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Value at Risk:</span>
          <span className="font-serif text-xl text-crimson-500">${totalValue.toLocaleString()}</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full" role="table" aria-label="Dead stock inventory items">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-900/50">
              {(["sku", "name", "daysIdle", "value"] as const).map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  className="px-4 py-3 text-xs font-medium text-slate-600 dark:text-slate-400 uppercase cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 text-left"
                  role="columnheader"
                  aria-sort={sortKey === col ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && handleSort(col)}
                >
                  {getColumnLabel(col)}
                  <SortIcon column={col} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-aura-light-border dark:divide-aura-dark-border">
            {sortedItems.map((item) => (
              <tr key={item.sku} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-mono">{item.sku}</td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.name}</td>
                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400 font-mono">{item.daysIdle} days</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-mono">${item.value?.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}