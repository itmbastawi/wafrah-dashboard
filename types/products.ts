export interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  location: string;
  quantity_on_hand: number;
  quantity_available: number;
  unit_price: number;
  total_value: number;
  reorder_point: number;
  max_stock: number;
  days_since_movement: number;
  turnover_rate: number;
  health_score: number;
  health_status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  availability_score: number;
  turnover_score: number;
  freshness_score: number;
  balance_score: number;
  value_score: number;
  last_received: string;
  last_sold: string;
  supplier: string;
  tags: string[];
}

export type SortField = 'name' | 'health_score' | 'quantity_on_hand' | 'total_value' | 'turnover_rate' | 'days_since_movement';
export type SortDir = 'asc' | 'desc';
export type ViewMode = 'table' | 'grid';
export type FilterStatus = 'ALL' | 'HEALTHY' | 'WARNING' | 'CRITICAL';
