"use client";

import { useState, useMemo } from "react";
import { CampaignData } from "@/lib/data";

interface CampaignTableProps {
  campaigns: CampaignData[];
}

type SortKey = keyof CampaignData;
type SortDirection = "asc" | "desc";

const statusStyles = {
  Live: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  Watch: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  Paused: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

export default function CampaignTable({ campaigns }: CampaignTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("revenue");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const sortedCampaigns = useMemo(() => {
    return [...campaigns].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      return sortDirection === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [campaigns, sortKey, sortDirection]);

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
    return <span className="ml-1" aria-hidden="true">{sortDirection === "asc" ? "↑" : "↓"}</span>;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const columns: { key: SortKey; label: string; align: "left" | "right" }[] = [
    { key: "name", label: "Campaign", align: "left" },
    { key: "status", label: "Status", align: "left" },
    { key: "impressions", label: "Impressions", align: "right" },
    { key: "clicks", label: "Clicks", align: "right" },
    { key: "ctr", label: "CTR", align: "right" },
    { key: "conversions", label: "Conv.", align: "right" },
    { key: "spend", label: "Spend", align: "right" },
    { key: "revenue", label: "Revenue", align: "right" },
  ];

  return (
    <div className="bg-white dark:bg-aura-dark-card border border-aura-light-border dark:border-aura-dark-border overflow-hidden">
      <div className="p-5 border-b border-aura-light-border dark:border-aura-dark-border">
        <h2 className="font-serif text-xl text-gray-900 dark:text-white">Campaign Performance</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full" role="table" aria-label="Campaign performance data">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-900/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.key !== "status" && handleSort(col.key)}
                  className={`px-4 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-aura-gold ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                  role="columnheader"
                  aria-sort={sortKey === col.key ? (sortDirection === "asc" ? "ascending" : "descending") : "none"}
                  tabIndex={col.key !== "status" ? 0 : -1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      col.key !== "status" && handleSort(col.key);
                    }
                  }}
                >
                  {col.label}
                  {col.key !== "status" && <SortIcon column={col.key} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-aura-light-border dark:divide-aura-dark-border">
            {sortedCampaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">{campaign.name}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[campaign.status]}`}
                    role="status"
                    aria-label={`Status: ${campaign.status}`}
                  >
                    {campaign.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 text-right font-mono">
                  {formatNumber(campaign.impressions)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 text-right font-mono">
                  {formatNumber(campaign.clicks)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 text-right font-mono">
                  {campaign.ctr.toFixed(2)}%
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 text-right font-mono">
                  {formatNumber(campaign.conversions)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 text-right font-mono">
                  ${formatNumber(campaign.spend)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white text-right font-mono font-medium">
                  ${formatNumber(campaign.revenue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}