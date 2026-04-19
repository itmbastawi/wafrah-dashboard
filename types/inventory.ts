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
  health_status: 'HEALTHY' | 'AT_RISK' | 'CRITICAL';
  quantity_available: number;
  quantity_on_hand: number;
  days_since_last_movement: number;
}

export interface TurnoverMetric {
  product_key: number;
  product_name: string;
  total_cogs: number;
  avg_inventory_value: number;
  turnover_ratio: number;
  days_sales_of_inventory: number;
  turnover_status: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
  calculation_period: string;
  as_of_date: string;
}

export interface StockoutMetric {
  product_key: number;
  product_name: string;
  stockout_rate_pct: number;
  near_stockout_rate_pct: number;
  demand_stockout_rate_pct: number;
  service_level_pct: number;
  total_days: number;
  stockout_days: number;
  stockout_severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  period_start: string;
  period_end: string;
}

export interface DeadStockMetric {
  snapshot_date: string;
  dead_sku_count: number;
  dead_stock_value: number;
  total_inventory_value: number;
  dead_stock_pct: number;
  health_grade: 'A' | 'B' | 'C' | 'D';
}

export interface OverstockMetric {
  snapshot_date: string;
  total_overstock_value: number;
  total_inventory_value: number;
  overstock_pct: number;
  overstock_sku_count: number;
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
