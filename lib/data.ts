import { HealthScore, TurnoverMetric, StockoutMetric, DeadStockMetric, OverstockMetric, KPIData, AlertItem } from '../types/inventory';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchHealthScores(date?: string): Promise<HealthScore[]> {
  const url = date ? `${API_BASE}/api/v1/health-score?date=${date}` : `${API_BASE}/api/v1/health-score`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch health scores');
  return res.json();
}

export async function fetchKPISummary(date?: string): Promise<KPIData> {
  const url = date ? `${API_BASE}/api/v1/kpi/summary?date=${date}` : `${API_BASE}/api/v1/kpi/summary`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch KPI summary');
  return res.json();
}

export async function fetchTurnoverMetrics(date?: string): Promise<TurnoverMetric[]> {
  const url = `${API_BASE}/api/v1/turnover?date=${date}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch turnover');
  return res.json();
}

export async function fetchAlerts(threshold: number = 60): Promise<AlertItem[]> {
  const res = await fetch(`${API_BASE}/api/v1/alerts?threshold=${threshold}`);
  if (!res.ok) throw new Error('Failed to fetch alerts');
  return res.json();
}

export const mockHealthScores: HealthScore[] = [
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
];

export const mockKPISummary: KPIData = {
  avg_health_score: 72.5,
  critical_items: 12,
  avg_turnover: 6.8,
  stockout_rate: 3.2,
  dead_stock_pct: 8.5,
  overstock_pct: 15.3,
  date: '2024-04-19',
};
