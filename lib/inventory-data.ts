export interface InventoryKpi {
  turnoverRate: number;
  lowStockCount: number;
  stockoutRate: number;
  deadStockValue: number;
  overstockUnits: number;
  turnoverTrend: number[];
}

export interface SkuFlag {
  sku: string;
  name: string;
  onHand: number;
  reorderPoint: number;
  daysIdle?: number;
  velocity?: number;
  urgency: 'critical' | 'warning' | 'watch';
  category?: string;
  value?: number;
  safetyStock?: number;
  excessUnits?: number;
  holdingCost?: number;
  action?: 'reduce' | 'promote' | 'discontinue';
}

export interface DeadStockData {
  count: number;
  items: SkuFlag[];
  totalValue: number;
}

export interface StockoutRateData {
  stockoutRate: number;
  byCategory: { category: string; rate: number; count: number; total: number }[];
}

export interface OverstockData {
  count: number;
  items: SkuFlag[];
  totalExcessUnits: number;
  totalHoldingCost: number;
}

export async function fetchInventoryKpis(): Promise<InventoryKpi> {
  return {
    turnoverRate: 4.2,
    lowStockCount: 24,
    stockoutRate: 8.5,
    deadStockValue: 156000,
    overstockUnits: 3450,
    turnoverTrend: [3.8, 3.9, 4.0, 4.1, 4.0, 4.2, 4.2],
  };
}

export async function fetchLowStock(): Promise<SkuFlag[]> {
  return [
    { sku: 'SKU-001', name: 'Velvet Evening Gown', onHand: 3, reorderPoint: 15, urgency: 'critical', category: 'Dresses' },
    { sku: 'SKU-002', name: 'Silk Scarf Collection', onHand: 8, reorderPoint: 20, urgency: 'critical', category: 'Accessories' },
    { sku: 'SKU-003', name: 'Cashmere Sweater', onHand: 12, reorderPoint: 25, urgency: 'warning', category: 'Knitwear' },
    { sku: 'SKU-004', name: 'Leather Handbag', onHand: 18, reorderPoint: 30, urgency: 'warning', category: 'Bags' },
    { sku: 'SKU-005', name: 'Gold Plated Earrings', onHand: 22, reorderPoint: 35, urgency: 'watch', category: 'Jewelry' },
    { sku: 'SKU-006', name: 'Wool Blazer', onHand: 15, reorderPoint: 20, urgency: 'watch', category: 'Outerwear' },
  ];
}

export async function fetchHighSpeed(): Promise<SkuFlag[]> {
  return [
    { sku: 'SKU-101', name: 'Signature Tote Bag', velocity: 12.5, urgency: 'watch', category: 'Bags', onHand: 45, reorderPoint: 20 },
    { sku: 'SKU-102', name: 'Silk Blend Blouse', velocity: 9.8, urgency: 'watch', category: 'Tops', onHand: 38, reorderPoint: 25 },
    { sku: 'SKU-103', name: 'Cashmere Wrap', velocity: 8.2, urgency: 'watch', category: 'Knitwear', onHand: 28, reorderPoint: 15 },
    { sku: 'SKU-104', name: 'Leather Belt', velocity: 7.6, urgency: 'watch', category: 'Accessories', onHand: 52, reorderPoint: 30 },
    { sku: 'SKU-105', name: 'Pearl Necklace', velocity: 6.4, urgency: 'watch', category: 'Jewelry', onHand: 22, reorderPoint: 18 },
  ];
}

export async function fetchDeadStock(): Promise<DeadStockData> {
  return {
    count: 18,
    totalValue: 156000,
    items: [
      { sku: 'SKU-201', name: 'Vintage Clutch', onHand: 5, reorderPoint: 10, daysIdle: 145, urgency: 'watch', value: 12500 },
      { sku: 'SKU-202', name: 'Sequin Party Dress', onHand: 8, reorderPoint: 15, daysIdle: 120, urgency: 'watch', value: 18400 },
      { sku: 'SKU-203', name: 'Fur Trim Coat', onHand: 2, reorderPoint: 5, daysIdle: 98, urgency: 'watch', value: 32000 },
      { sku: 'SKU-204', name: 'Cocktail Dress', onHand: 12, reorderPoint: 20, daysIdle: 95, urgency: 'watch', value: 22800 },
      { sku: 'SKU-205', name: 'Embroidered Blouse', onHand: 15, reorderPoint: 25, daysIdle: 92, urgency: 'watch', value: 10500 },
    ],
  };
}

export async function fetchSafetyStock(): Promise<SkuFlag[]> {
  return [
    { sku: 'SKU-301', name: 'Classic White Shirt', onHand: 25, reorderPoint: 30, safetyStock: 40, urgency: 'warning', category: 'Tops' },
    { sku: 'SKU-302', name: 'Tailored Trousers', onHand: 18, reorderPoint: 25, safetyStock: 35, urgency: 'critical', category: 'Bottoms' },
    { sku: 'SKU-303', name: 'Leather Jacket', onHand: 8, reorderPoint: 12, safetyStock: 20, urgency: 'critical', category: 'Outerwear' },
    { sku: 'SKU-304', name: 'Evening Gown', onHand: 6, reorderPoint: 10, safetyStock: 15, urgency: 'critical', category: 'Dresses' },
    { sku: 'SKU-305', name: 'Silk Scarf', onHand: 45, reorderPoint: 50, safetyStock: 60, urgency: 'watch', category: 'Accessories' },
  ];
}

export async function fetchStockoutRate(): Promise<StockoutRateData> {
  return {
    stockoutRate: 8.5,
    byCategory: [
      { category: 'Dresses', rate: 12.3, count: 8, total: 65 },
      { category: 'Bags', rate: 9.1, count: 5, total: 55 },
      { category: 'Accessories', rate: 7.5, count: 6, total: 80 },
      { category: 'Jewelry', rate: 6.2, count: 3, total: 48 },
      { category: 'Knitwear', rate: 5.8, count: 4, total: 69 },
    ],
  };
}

export async function fetchOverstock(): Promise<OverstockData> {
  return {
    count: 12,
    totalExcessUnits: 3450,
    totalHoldingCost: 28750,
    items: [
      { sku: 'SKU-401', name: 'Summer Dress', onHand: 85, reorderPoint: 25, excessUnits: 60, holdingCost: 1800, urgency: 'warning', action: 'promote', category: 'Dresses' },
      { sku: 'SKU-402', name: 'Beach Coverup', onHand: 72, reorderPoint: 20, excessUnits: 52, holdingCost: 1560, urgency: 'warning', action: 'reduce', category: 'Tops' },
      { sku: 'SKU-403', name: 'Statement Earrings', onHand: 120, reorderPoint: 30, excessUnits: 90, holdingCost: 2700, urgency: 'warning', action: 'discontinue', category: 'Jewelry' },
      { sku: 'SKU-404', name: 'Wool Scarf', onHand: 68, reorderPoint: 25, excessUnits: 43, holdingCost: 1290, urgency: 'warning', action: 'promote', category: 'Accessories' },
      { sku: 'SKU-405', name: 'Pencil Skirt', onHand: 55, reorderPoint: 20, excessUnits: 35, holdingCost: 1050, urgency: 'warning', action: 'reduce', category: 'Bottoms' },
    ],
  };
}