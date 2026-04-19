'use client';

import { useState, useEffect } from 'react';
import { KPICard } from '../components/ui/card';
import { HealthGauge } from '../components/charts/health-gauge';
import { Sparkline } from '../components/charts/sparkline';
import { AlertTable } from '../components/tables/alert-table';
import { fetchHealthScores, fetchKPISummary, fetchAlerts, mockHealthScores, mockKPISummary } from '../../lib/data';
import { HealthScore, KPIData, AlertItem } from '../../types/inventory';
import { Activity, Package, TrendingUp, AlertTriangle, Archive, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';

export default function DashboardPage() {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [healthScores, setHealthScores] = useState<HealthScore[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [kpi, health, alertData] = await Promise.all([
          fetchKPISummary(date),
          fetchHealthScores(date),
          fetchAlerts(60),
        ]);

        setKpiData(kpi);
        setHealthScores(health);
        setAlerts(alertData);
      } catch (error) {
        console.error('Failed to load data:', error);
        setKpiData(mockKPISummary);
        setHealthScores(mockHealthScores);
        setAlerts([
          {
            product_key: 2,
            product_name: 'Gaming Mouse',
            health_score: 38.0,
            issue: 'Critical stock level - only 5 units remaining',
            severity: 'critical',
            metric_type: 'Availability',
          },
        ]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [date]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading inventory data...</div>
      </div>
    );
  }

  const criticalCount = healthScores.filter((s) => s.health_status === 'CRITICAL').length;
  const atRiskCount = healthScores.filter((s) => s.health_status === 'AT_RISK').length;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Inventory Command Center</h1>
          <p className="text-slate-500 mt-1">Real-time visibility into inventory health</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
            <Calendar className="w-5 h-5 text-slate-400" />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border-none outline-none text-slate-700 font-medium" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard title="Health Score" value={kpiData?.avg_health_score.toFixed(1) || '0.0'} subtitle={`${criticalCount} critical, ${atRiskCount} at-risk items`} trend={kpiData && kpiData.avg_health_score > 70 ? 'up' : 'down'} trendValue="vs yesterday" status={kpiData && kpiData.avg_health_score >= 80 ? 'good' : kpiData && kpiData.avg_health_score >= 60 ? 'warning' : 'critical'} icon={<Activity className="w-6 h-6 text-blue-600" />}>
          <div className="mt-4 flex justify-center">
            <HealthGauge score={kpiData?.avg_health_score || 0} size={100} />
          </div>
        </KPICard>

        <KPICard title="Inventory Turnover" value={kpiData?.avg_turnover.toFixed(1) || '0.0'} subtitle="Annualized ratio" trend="up" trendValue="+12% vs last month" status={kpiData && kpiData.avg_turnover >= 5 ? 'good' : 'warning'} icon={<TrendingUp className="w-6 h-6 text-emerald-600" />}>
          <div className="mt-4">
            <Sparkline data={[4.2, 5.1, 4.8, 6.2, 5.9, 6.8, 7.2, 6.5]} color="#10b981" />
          </div>
        </KPICard>

        <KPICard title="Stockout Rate" value={`${kpiData?.stockout_rate.toFixed(1)}%` || '0.0%'} subtitle="Target: <2%" trend={kpiData && kpiData.stockout_rate < 2 ? 'down' : 'up'} trendValue={kpiData && kpiData.stockout_rate < 2 ? 'On track' : 'Above target'} status={kpiData && kpiData.stockout_rate < 2 ? 'good' : 'warning'} icon={<Package className="w-6 h-6 text-purple-600" />}>
          <div className="mt-4 text-sm text-slate-600">
            <div className="flex justify-between mb-1">
              <span>Service Level</span>
              <span className="font-semibold">{kpiData ? (100 - kpiData.stockout_rate).toFixed(1) : '100'}%</span>
            </div>
          </div>
        </KPICard>

        <KPICard title="Dead Stock" value={`${kpiData?.dead_stock_pct.toFixed(1)}%` || '0.0%'} subtitle="Target: <10%" trend="down" trendValue="-2.3% vs last month" status={kpiData && kpiData.dead_stock_pct < 10 ? 'good' : 'warning'} icon={<Archive className="w-6 h-6 text-slate-600" />}>
          <div className="mt-4 text-sm text-slate-600">
            <div className="flex justify-between mb-1">
              <span>Tied Up Capital</span>
              <span className="font-semibold">${kpiData ? (kpiData.dead_stock_pct * 1000000 / 100).toFixed(0) : '0'}</span>
            </div>
          </div>
        </KPICard>
      </div>

      <KPICard title="Overstock" value={`${kpiData?.overstock_pct.toFixed(1)}%` || '0.0%'} subtitle="Excess inventory value" trend="down" trendValue="-5% vs target" status={kpiData && kpiData.overstock_pct < 15 ? 'good' : 'warning'} icon={<ArrowUpRight className="w-6 h-6 text-amber-600" />} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Health Score Distribution</h2>
              <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm"><div className="w-3 h-3 rounded-full bg-emerald-500" />Healthy</div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm"><div className="w-3 h-3 rounded-full bg-amber-500" />At Risk</div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-sm"><div className="w-3 h-3 rounded-full bg-rose-500" />Critical</div>
              </div>
            </div>

            <div className="space-y-4">
              {healthScores.slice(0, 5).map((score) => (
                <div key={score.product_key} className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-slate-900">{score.product_name}</span>
                      <span className={`text-sm px-2 py-1 rounded ${score.health_status === 'HEALTHY' ? 'bg-emerald-100 text-emerald-700' : score.health_status === 'AT_RISK' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>{score.health_status}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div className="h-full transition-all duration-500" style={{ width: `${score.health_score}%`, backgroundColor: score.health_score > 80 ? '#10b981' : score.health_score > 60 ? '#f59e0b' : '#ef4444' }} />
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-2"><span>Qty: {score.quantity_available}</span><span>•</span><span>Last moved: {score.days_since_last_movement}d ago</span></div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-slate-700">{score.health_score.toFixed(1)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <AlertTable alerts={alerts} />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"><Package className="w-4 h-4" />Reorder Critical Items</button>
              <button className="w-full flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"><Archive className="w-4 h-4" />Review Dead Stock</button>
              <button className="w-full flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors"><AlertTriangle className="w-4 h-4" />Adjust Safety Stock</button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white">
            <h3 className="font-semibold mb-4">Inventory Insights</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3"><ArrowDownRight className="w-5 h-5 text-emerald-400 mt-0.5" /><div><div className="font-medium">Turnover Trending Up</div><div className="text-slate-300">Inventory velocity improving across top 20 SKUs</div></div></div>
              <div className="flex items-start gap-3"><AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" /><div><div className="font-medium">12 Items Critical</div><div className="text-slate-300">Immediate attention required for stockouts</div></div></div>
              <div className="flex items-start gap-3"><Archive className="w-5 h-5 text-rose-400 mt-0.5" /><div><div className="font-medium">Dead Stock Alert</div><div className="text-slate-300">$85K tied up in &gt;365 day inventory</div></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
