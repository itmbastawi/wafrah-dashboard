import { HealthScore, TurnoverMetric, StockoutMetric, DeadStockMetric, OverstockMetric, KPIData, AlertItem, DemandForecast } from '../types/inventory';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchHealthScores(date?: string): Promise<HealthScore[]> {
  try {
    const url = date ? `${API_BASE}/api/v1/health-score?date=${date}` : `${API_BASE}/api/v1/health-score`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error('Failed to fetch health scores');
    return res.json();
  } catch (error) {
    console.warn('Using mock health scores data');
    return mockHealthScores;
  }
}

export async function fetchKPISummary(date?: string): Promise<KPIData> {
  try {
    const url = date ? `${API_BASE}/api/v1/kpi/summary?date=${date}` : `${API_BASE}/api/v1/kpi/summary`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error('Failed to fetch KPI summary');
    return res.json();
  } catch (error) {
    console.warn('Using mock KPI data');
    return mockKPISummary;
  }
}

export async function fetchTurnoverMetrics(date?: string): Promise<TurnoverMetric[]> {
  try {
    const url = `${API_BASE}/api/v1/turnover?date=${date}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error('Failed to fetch turnover');
    return res.json();
  } catch (error) {
    console.warn('Using empty turnover data');
    return [];
  }
}

export async function fetchAlerts(threshold: number = 60): Promise<AlertItem[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v1/alerts?threshold=${threshold}`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  } catch (error) {
    console.warn('Using empty alerts data');
    return [{
      product_key: 2,
      product_name: 'Gaming Mouse',
      health_score: 38.0,
      issue: 'Critical stock level - only 5 units remaining',
      severity: 'critical',
      metric_type: 'Availability',
    }];
  }
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

export async function fetchDemandForecast(productKey?: number): Promise<DemandForecast[]> {
  try {
    const url = productKey
      ? `${API_BASE}/api/v1/demand-forecast?product_key=${productKey}`
      : `${API_BASE}/api/v1/demand-forecast`;
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) throw new Error('Failed to fetch demand forecast');
    return res.json();
  } catch (error) {
    console.warn('Using mock demand forecast data');
    return mockDemandForecasts;
  }
}

export const mockDemandForecasts: DemandForecast[] = [
  {
    product_key: 1,
    product_name: 'Wireless Headphones',
    current_stock: 450,
    predicted_demand: 520,
    period_days: 30,
    weekly_breakdown: [
      { week: 'Week 1', demand: 115 },
      { week: 'Week 2', demand: 125 },
      { week: 'Week 3', demand: 135 },
      { week: 'Week 4', demand: 145 },
      { week: 'Week 5', demand: 150 },
      { week: 'Week 6', demand: 155 },
      { week: 'Week 7', demand: 160 },
      { week: 'Week 8', demand: 165 },
    ],
    confidence_score: 87,
    trend: 'increasing',
    recommendation: 'reorder',
    risk_level: 'medium',
  },
  {
    product_key: 2,
    product_name: 'Gaming Mouse',
    current_stock: 5,
    predicted_demand: 180,
    period_days: 30,
    weekly_breakdown: [
      { week: 'Week 1', demand: 35 },
      { week: 'Week 2', demand: 40 },
      { week: 'Week 3', demand: 45 },
      { week: 'Week 4', demand: 50 },
      { week: 'Week 5', demand: 48 },
      { week: 'Week 6', demand: 52 },
      { week: 'Week 7', demand: 55 },
      { week: 'Week 8', demand: 58 },
    ],
    confidence_score: 92,
    trend: 'increasing',
    recommendation: 'reorder',
    risk_level: 'high',
  },
  {
    product_key: 3,
    product_name: 'USB-C Hub',
    current_stock: 120,
    predicted_demand: 85,
    period_days: 30,
    weekly_breakdown: [
      { week: 'Week 1', demand: 18 },
      { week: 'Week 2', demand: 20 },
      { week: 'Week 3', demand: 19 },
      { week: 'Week 4', demand: 21 },
      { week: 'Week 5', demand: 18 },
      { week: 'Week 6', demand: 17 },
      { week: 'Week 7', demand: 16 },
      { week: 'Week 8', demand: 15 },
    ],
    confidence_score: 78,
    trend: 'stable',
    recommendation: 'maintain',
    risk_level: 'low',
  },
  {
    product_key: 4,
    product_name: 'Mechanical Keyboard',
    current_stock: 320,
    predicted_demand: 290,
    period_days: 30,
    weekly_breakdown: [
      { week: 'Week 1', demand: 68 },
      { week: 'Week 2', demand: 70 },
      { week: 'Week 3', demand: 72 },
      { week: 'Week 4', demand: 68 },
      { week: 'Week 5', demand: 65 },
      { week: 'Week 6', demand: 62 },
      { week: 'Week 7', demand: 60 },
      { week: 'Week 8', demand: 58 },
    ],
    confidence_score: 85,
    trend: 'stable',
    recommendation: 'maintain',
    risk_level: 'low',
  },
  {
    product_key: 5,
    product_name: '4K Monitor',
    current_stock: 45,
    predicted_demand: 25,
    period_days: 30,
    weekly_breakdown: [
      { week: 'Week 1', demand: 8 },
      { week: 'Week 2', demand: 7 },
      { week: 'Week 3', demand: 6 },
      { week: 'Week 4', demand: 5 },
      { week: 'Week 5', demand: 4 },
      { week: 'Week 6', demand: 4 },
      { week: 'Week 7', demand: 3 },
      { week: 'Week 8', demand: 3 },
    ],
    confidence_score: 72,
    trend: 'decreasing',
    recommendation: 'reduce',
    risk_level: 'medium',
  },
  {
    product_key: 6,
    product_name: 'Webcam Pro',
    current_stock: 280,
    predicted_demand: 340,
    period_days: 30,
    weekly_breakdown: [
      { week: 'Week 1', demand: 75 },
      { week: 'Week 2', demand: 80 },
      { week: 'Week 3', demand: 85 },
      { week: 'Week 4', demand: 88 },
      { week: 'Week 5', demand: 90 },
      { week: 'Week 6', demand: 92 },
      { week: 'Week 7', demand: 95 },
      { week: 'Week 8', demand: 98 },
    ],
    confidence_score: 90,
    trend: 'increasing',
    recommendation: 'reorder',
    risk_level: 'medium',
  },
];
