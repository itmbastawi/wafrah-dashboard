import { Suspense } from "react";
import { fetchKpis, fetchRevenue, fetchSegments, fetchChannels, fetchCampaigns } from "@/lib/data";
import KpiCard from "@/components/KpiCard";
import RevenueChart from "@/components/RevenueChart";
import DonutChart from "@/components/DonutChart";
import ChannelBars from "@/components/ChannelBars";
import CampaignTable from "@/components/CampaignTable";

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return "$" + (value / 1000000).toFixed(2) + "M";
  }
  if (value >= 1000) {
    return "$" + (value / 1000).toFixed(0) + "K";
  }
  return "$" + value.toString();
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range } = await searchParams;
  const timeRange = range || "30d";

  const [kpis, revenue, segments, channels, campaigns] = await Promise.all([
    fetchKpis(),
    fetchRevenue(timeRange),
    fetchSegments(),
    fetchChannels(),
    fetchCampaigns(),
  ]);

  return (
    <main className="min-h-screen bg-aura-light dark:bg-aura-dark p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="font-serif text-4xl md:text-5xl text-gray-900 dark:text-white mb-2">
            Aura Analytics
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Luxury Data Analysis Dashboard</p>
        </header>

        <section aria-label="Key Performance Indicators" className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              label="Total Revenue"
              value={formatCurrency(kpis.totalRevenue)}
              delta={kpis.revenueGrowth}
              deltaType={kpis.revenueGrowth >= 0 ? "up" : "down"}
              accentColor="gold"
            />
            <KpiCard
              label="Active Users"
              value={kpis.activeUsers.toLocaleString()}
              delta={kpis.userGrowth}
              deltaType={kpis.userGrowth >= 0 ? "up" : "down"}
              accentColor="teal"
            />
            <KpiCard
              label="Conversion Rate"
              value={`${kpis.conversionRate}%`}
              delta={kpis.conversionGrowth}
              deltaType={kpis.conversionGrowth >= 0 ? "up" : "down"}
              accentColor="blue"
            />
            <KpiCard
              label="Avg Order Value"
              value={formatCurrency(kpis.avgOrderValue)}
              delta={kpis.aovGrowth}
              deltaType={kpis.aovGrowth >= 0 ? "up" : "down"}
              accentColor="rose"
            />
          </div>
        </section>

        <section aria-label="Revenue Chart" className="mb-8">
          <Suspense fallback={<div className="h-96 bg-aura-dark-card animate-pulse" />}>
            <RevenueChart labels={revenue.labels} data={revenue.data} />
          </Suspense>
        </section>

        <section aria-label="Segments and Channels" className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Suspense fallback={<div className="h-80 bg-aura-dark-card animate-pulse" />}>
            <DonutChart segments={segments} />
          </Suspense>
          <Suspense fallback={<div className="h-80 bg-aura-dark-card animate-pulse" />}>
            <ChannelBars channels={channels} />
          </Suspense>
        </section>

        <section aria-label="Campaign Performance" className="mb-8">
          <Suspense fallback={<div className="h-96 bg-aura-dark-card animate-pulse" />}>
            <CampaignTable campaigns={campaigns} />
          </Suspense>
        </section>

        <footer className="text-center text-sm text-gray-400 py-4 border-t border-aura-light-border dark:border-aura-dark-border">
          <p>Aura Analytics &copy; 2024. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}