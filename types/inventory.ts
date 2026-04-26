export interface HealthScore {
  product_key: number;
  product_name: string;
  location_key: number;
  location_name: string;
  snapshot_date: string;
  availability_score: number;
  turnover_score: number;
  freshness_score: number;
  balance_score: number;
  value_score: number;
  health_score: number;
  health_status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  quantity_available: number;
  quantity_on_hand: number;
  days_since_last_movement: number;
}

export interface TurnoverMetric {
  product_key: number;
  product_name: string;
  turnover_rate: number;
  period: string;
}

export interface StockoutMetric {
  product_key: number;
  product_name: string;
  stockout_days: number;
  period: string;
}

export interface DeadStockMetric {
  product_key: number;
  product_name: string;
  days_without_movement: number;
  quantity_on_hand: number;
}

export interface OverstockMetric {
  product_key: number;
  product_name: string;
  overstock_ratio: number;
  excess_quantity: number;
}

export interface KPIData {
  avg_health_score: number;
  critical_items: number;
  avg_turnover: number;
  stockout_rate: number;
  dead_stock_pct: number;
  overstock_pct: number;
  date: string;
}

export interface AlertItem {
  product_key: number;
  product_name: string;
  health_score: number;
  issue: string;
  severity: 'critical' | 'warning' | 'info';
  metric_type: string;
}

export interface DemandForecast {
  product_key: number;
  product_name: string;
  current_stock: number;
  predicted_demand: number;
  period_days: number;
  weekly_breakdown: { week: string; demand: number }[];
  confidence_score: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  recommendation: 'reorder' | 'reduce' | 'maintain';
  risk_level: 'high' | 'medium' | 'low';
}
