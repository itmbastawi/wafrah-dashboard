'use client';

import React, { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  BarChart3,
  Box,
  Clock,
  Package,
  RefreshCw,
  ShieldAlert,
  TrendingUp,
  Warehouse,
} from 'lucide-react';
import type { HealthScore, KPIData, AlertItem } from '../../types/inventory';
import {
  fetchHealthScores,
  fetchKPISummary,
  fetchAlerts,
} from '../../lib/data';
import { Card } from '../components/ui/card';
import { KPICard } from '../components/ui/kpi-card';
import { HealthGauge } from '../components/ui/health-gauge';
import { HealthRadar } from '../components/charts/health-radar';
import { ProductBarChart } from '../components/charts/product-bar-chart';
import { TrendChart } from '../components/charts/trend-chart';
import { AlertsTable } from '../components/tables/alerts-table';

// Mock 7-day trend data
const mockTrendData = [
  { date: 'Apr 13', score: 68.2 },
  { date: 'Apr 14', score: 70.5 },
  { date: 'Apr 15', score: 69.8 },
  { date: 'Apr 16', score: 73.1 },
  { date: 'Apr 17', score: 71.4 },
  { date: 'Apr 18', score: 74.0 },
  { date: 'Apr 19', score: 72.5 },
];

// Extended mock products for richer visuals
const extendedMockProducts: HealthScore[] = [
  {
    product_key: 1,
    product_name: 'Wireless Headphones',
    location_key: 101,
    location_name: 'Warehouse A',
    snapshot_date: '2024-04-19',
    availability_score: 85,
    turnover_score: 78,
    freshness_score: 92,
    balance_score: 88,
    value_score: 95,
    health_score: 87.6,
    health_status: 'HEALTHY',
    quantity_available: 450,
    quantity_on_hand: 500,
    days_since_last_movement: 12,
  },
  {
    product_key: 2,
    product_name: 'Gaming Mouse',
    location_key: 101,
    location_name: 'Warehouse A',
    snapshot_date: '2024-04-19',
    availability_score: 25,
    turnover_score: 45,
    freshness_score: 30,
    balance_score: 40,
    value_score: 50,
    health_score: 38.0,
    health_status: 'CRITICAL',
    quantity_available: 5,
    quantity_on_hand: 8,
    days_since_last_movement: 45,
  },
  {
    product_key: 3,
    product_name: 'USB-C Hub',
    location_key: 102,
    location_name: 'Warehouse B',
    snapshot_date: '2024-04-19',
    availability_score: 72,
    turnover_score: 65,
    freshness_score: 58,
    balance_score: 70,
    value_score: 68,
    health_score: 66.6,
    health_status: 'WARNING',
    quantity_available: 120,
    quantity_on_hand: 180,
    days_since_last_movement: 22,
  },
  {
    product_key: 4,
    product_name: 'Mechanical Keyboard',
    location_key: 101,
    location_name: 'Warehouse A',
    snapshot_date: '2024-04-19',
    availability_score: 90,
    turnover_score: 82,
    freshness_score: 88,
    balance_score: 85,
    value_score: 91,
    health_score: 87.2,
    health_status: 'HEALTHY',
    quantity_available: 320,
    quantity_on_hand: 350,
    days_since_last_movement: 5,
  },
  {
    product_key: 5,
    product_name: '4K Monitor',
    location_key: 102,
    location_name: 'Warehouse B',
    snapshot_date: '2024-04-19',
    availability_score: 55,
    turnover_score: 48,
    freshness_score: 62,
    balance_score: 52,
    value_score: 58,
    health_score: 55.0,
    health_status: 'WARNING',
    quantity_available: 45,
    quantity_on_hand: 90,
    days_since_last_movement: 30,
  },
  {
    product_key: 6,
    product_name: 'Webcam Pro',
    location_key: 101,
    location_name: 'Warehouse A',
    snapshot_date: '2024-04-19',
    availability_score: 95,
    turnover_score: 88,
    freshness_score: 90,
    balance_score: 92,
    value_score: 87,
    health_score: 90.4,
    health_status: 'HEALTHY',
    quantity_available: 280,
    quantity_on_hand: 300,
    days_since_last_movement: 3,
  },
];

const extendedMockAlerts: AlertItem[] = [
  {
    product_key: 2,
    product_name: 'Gaming Mouse',
    health_score: 38.0,
    issue: 'Critical stock level — only 5 units remaining',
    severity: 'critical',
    metric_type: 'Availability',
  },
  {
    product_key: 5,
    product_name: '4K Monitor',
    health_score: 55.0,
    issue: 'High overstock ratio — 50% excess inventory',
    severity: 'warning',
    metric_type: 'Balance',
  },
  {
    product_key: 3,
    product_name: 'USB-C Hub',
    health_score: 66.6,
    issue: 'Slowing turnover — 22 days since last movement',
    severity: 'warning',
    metric_type: 'Freshness',
  },
  {
    product_key: 2,
    product_name: 'Gaming Mouse',
    health_score: 38.0,
    issue: 'Dead stock risk — 45 days without movement',
    severity: 'critical',
    metric_type: 'Turnover',
  },
];

export default function DashboardPage() {
  const [healthScores, setHealthScores] = useState<HealthScore[]>([]);
  const [kpi, setKPI] = useState<KPIData | null>(null);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<HealthScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [hs, kpiData, alertData] = await Promise.all([
          fetchHealthScores(),
          fetchKPISummary(),
          fetchAlerts(),
        ]);

        // Use extended mock if API returns minimal data
        const products = hs.length > 2 ? hs : extendedMockProducts;
        const alertItems = alertData.length > 1 ? alertData : extendedMockAlerts;

        setHealthScores(products);
        setKPI(kpiData);
        setAlerts(alertItems);
        setSelectedProduct(products[0] || null);
      } catch {
        setHealthScores(extendedMockProducts);
        setKPI({
          avg_health_score: 72.5,
          critical_items: 12,
          avg_turnover: 6.8,
          stockout_rate: 3.2,
          dead_stock_pct: 8.5,
          overstock_pct: 15.3,
          date: '2024-04-19',
        });
        setAlerts(extendedMockAlerts);
        setSelectedProduct(extendedMockProducts[0]);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-accent-cyan animate-spin" />
          <p className="text-text-secondary text-sm font-medium">
            Loading dashboard…
          </p>
        </div>
      </div>
    );
  }

  const overallScore = kpi?.avg_health_score ?? 0;
  const healthyCount = healthScores.filter((h) => h.health_status === 'HEALTHY').length;
  const warningCount = healthScores.filter((h) => h.health_status === 'WARNING').length;
  const criticalCount = healthScores.filter((h) => h.health_status === 'CRITICAL').length;

  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-[1440px] mx-auto">
      {/* ── Header ── */}
      <header className="mb-10 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-accent-cyan/10">
                <Warehouse className="w-6 h-6 text-accent-cyan" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-text">
                Inventory Health
              </h1>
            </div>
            <p className="text-text-secondary text-sm sm:text-base">
              Real-time analytics and health scoring across all inventory items
            </p>
          </div>
          <div className="flex items-center gap-2 text-text-muted text-sm">
            <Clock className="w-4 h-4" />
            <span>Last updated: {kpi?.date ?? 'N/A'}</span>
          </div>
        </div>
      </header>

      {/* ── Hero: Overall Health Gauge + Status Summary ── */}
      <section className="mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <Card glow="cyan" className="flex flex-col lg:flex-row items-center gap-8 p-8">
          <div className="relative flex-shrink-0">
            <HealthGauge
              id="overall-health-gauge"
              score={overallScore}
              size={240}
              strokeWidth={16}
              label="Overall Inventory Health"
            />
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
            {/* Healthy */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-accent-emerald/5 border border-accent-emerald/10">
              <div className="p-3 rounded-xl bg-accent-emerald/10">
                <Activity className="w-6 h-6 text-accent-emerald" />
              </div>
              <div>
                <p className="text-2xl font-bold text-accent-emerald">
                  {healthyCount}
                </p>
                <p className="text-text-secondary text-xs uppercase tracking-wider font-medium">
                  Healthy Items
                </p>
              </div>
            </div>

            {/* Warning */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-accent-amber/5 border border-accent-amber/10">
              <div className="p-3 rounded-xl bg-accent-amber/10">
                <AlertTriangle className="w-6 h-6 text-accent-amber" />
              </div>
              <div>
                <p className="text-2xl font-bold text-accent-amber">
                  {warningCount}
                </p>
                <p className="text-text-secondary text-xs uppercase tracking-wider font-medium">
                  Warning Items
                </p>
              </div>
            </div>

            {/* Critical */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-accent-rose/5 border border-accent-rose/10">
              <div className="p-3 rounded-xl bg-accent-rose/10">
                <ShieldAlert className="w-6 h-6 text-accent-rose" />
              </div>
              <div>
                <p className="text-2xl font-bold text-accent-rose">
                  {criticalCount}
                </p>
                <p className="text-text-secondary text-xs uppercase tracking-wider font-medium">
                  Critical Items
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* ── KPI Row ── */}
      <section className="mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 stagger-children">
        <KPICard
          id="kpi-avg-health"
          label="Avg Health"
          value={overallScore.toFixed(1)}
          icon={<Activity className="w-5 h-5" />}
          trend="up"
          trendValue="+2.3%"
          glow="emerald"
          accentColor="text-accent-emerald"
        />
        <KPICard
          id="kpi-critical-items"
          label="Critical Items"
          value={kpi?.critical_items ?? 0}
          icon={<ShieldAlert className="w-5 h-5" />}
          trend="down"
          trendValue="-3"
          glow="rose"
          accentColor="text-accent-rose"
        />
        <KPICard
          id="kpi-turnover"
          label="Avg Turnover"
          value={`${kpi?.avg_turnover ?? 0}x`}
          icon={<RefreshCw className="w-5 h-5" />}
          trend="up"
          trendValue="+0.4"
          glow="cyan"
          accentColor="text-accent-cyan"
        />
        <KPICard
          id="kpi-stockout"
          label="Stockout Rate"
          value={`${kpi?.stockout_rate ?? 0}%`}
          icon={<Package className="w-5 h-5" />}
          trend="down"
          trendValue="-0.8%"
          glow="amber"
          accentColor="text-accent-amber"
        />
        <KPICard
          id="kpi-dead-stock"
          label="Dead Stock"
          value={`${kpi?.dead_stock_pct ?? 0}%`}
          icon={<Box className="w-5 h-5" />}
          trend="down"
          trendValue="-1.2%"
          glow="violet"
          accentColor="text-accent-violet"
        />
        <KPICard
          id="kpi-overstock"
          label="Overstock"
          value={`${kpi?.overstock_pct ?? 0}%`}
          icon={<ArrowDownRight className="w-5 h-5" />}
          trend="up"
          trendValue="+2.1%"
          glow="amber"
          accentColor="text-accent-amber"
          subtitle="Above optimal"
        />
      </section>

      {/* ── Charts Row: Radar + Bar ── */}
      <section
        className="mb-10 grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up"
        style={{ animationDelay: '0.2s' }}
      >
        {/* Radar Chart */}
        <Card glow="violet" id="chart-radar-section">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Score Dimensions
              </h2>
              <p className="text-text-muted text-xs mt-0.5">
                Health breakdown by category
              </p>
            </div>
            {/* Product selector */}
            <select
              id="product-selector"
              className="bg-surface-hover border border-border-glass rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-violet/30 cursor-pointer"
              value={selectedProduct?.product_key ?? ''}
              onChange={(e) => {
                const found = healthScores.find(
                  (h) => h.product_key === Number(e.target.value)
                );
                if (found) setSelectedProduct(found);
              }}
            >
              {healthScores.map((p) => (
                <option key={p.product_key} value={p.product_key}>
                  {p.product_name}
                </option>
              ))}
            </select>
          </div>
          {selectedProduct && (
            <HealthRadar product={selectedProduct} id="chart-health-radar" />
          )}
        </Card>

        {/* Bar Chart */}
        <Card glow="emerald" id="chart-bar-section">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-text-primary">
              Product Comparison
            </h2>
            <p className="text-text-muted text-xs mt-0.5">
              Health scores across all tracked products
            </p>
          </div>
          <ProductBarChart
            products={healthScores}
            id="chart-product-bar"
          />
        </Card>
      </section>

      {/* ── Trend Chart ── */}
      <section
        className="mb-10 animate-fade-in-up"
        style={{ animationDelay: '0.3s' }}
      >
        <Card glow="cyan" id="chart-trend-section">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent-cyan" />
                <h2 className="text-lg font-semibold text-text-primary">
                  Health Score Trend
                </h2>
              </div>
              <p className="text-text-muted text-xs mt-0.5">
                7-day rolling average across all inventory
              </p>
            </div>
            <BarChart3 className="w-5 h-5 text-text-muted" />
          </div>
          <TrendChart data={mockTrendData} id="chart-trend" />
        </Card>
      </section>

      {/* ── Alerts Table ── */}
      <section
        className="mb-10 animate-fade-in-up"
        style={{ animationDelay: '0.4s' }}
      >
        <Card glow="rose" id="alerts-section">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-accent-rose" />
                <h2 className="text-lg font-semibold text-text-primary">
                  Active Alerts
                </h2>
              </div>
              <p className="text-text-muted text-xs mt-0.5">
                Items requiring immediate attention
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent-rose/10 text-accent-rose">
              {alerts.length} alert{alerts.length !== 1 ? 's' : ''}
            </span>
          </div>
          <AlertsTable alerts={alerts} id="alerts-table" />
        </Card>
      </section>

      {/* ── Footer ── */}
      <footer className="text-center py-6 text-text-muted text-xs">
        <p>Wafrah Inventory Analytics • Powered by real-time health scoring</p>
      </footer>
    </main>
  );
}
