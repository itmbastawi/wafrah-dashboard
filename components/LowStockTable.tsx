"use client";

import { useState, useMemo } from "react";
import { SkuFlag } from "@/lib/inventory-data";

interface LowStockTableProps {
  items: SkuFlag[];
  count: number;
}

const urgencyStyles = {
  critical: "bg-crimson-100 text-crimson-800 dark:bg-crimson-900/40 dark:text-crimson-300",
  warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  watch: "bg-sapphire-100 text-sapphire-800 dark:bg-sapphire-900/40 dark:text-sapphire-300",
};

type SortKey = keyof SkuFlag;
type SortDirection = "asc" | "desc";

export default function LowStockTable({ items, count }: LowStockTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("onHand");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDirection === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [items, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <span className="ml-1 opacity-30">↕</span>;
    return <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div className="bg-white dark:bg-aura-dark-card border border-aura-light-border dark:border-aura-dark-border">
      <div className="p-4 border-b border-aura-light-border dark:border-aura-dark-border flex items-center justify-between">
        <h3 className="font-serif text-lg text-gray-900 dark:text-white">Low Stock Alerts</h3>
        <span className="text-sm text-gray-500">{count} SKUs below reorder point</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full" role="table" aria-label="Low stock inventory items">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50">
              {(["sku", "name", "onHand", "reorderPoint", "urgency"] as SortKey[]).map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  className="px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 text-left"
                  role="columnheader"
                  aria-sort={sortKey === col ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && handleSort(col)}
                >
                  {col === "onHand" ? "On Hand" : col === "reorderPoint" ? "Reorder Pt" : col.charAt(0).toUpperCase() + col.slice(1)}
                  <SortIcon column={col} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-aura-light-border dark:divide-aura-dark-border">
            {sortedItems.map((item) => (
              <tr key={item.sku} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-mono">{item.sku}</td>
                <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{item.name}</td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-mono font-medium">{item.onHand}</td>
                <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 font-mono">{item.reorderPoint}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${urgencyStyles[item.urgency]}`} role="status" aria-label={`Urgency: ${item.urgency}`}>
                    {item.urgency}
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