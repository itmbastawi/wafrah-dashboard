# Aura Inventory Analytics - Luxury Retail Dashboard

## Project Overview
- **Project Name**: Aura Inventory Analytics
- **Type**: Next.js 14 Web Application (App Router)
- **Core Functionality**: Luxury retail inventory analytics dashboard tracking turnover, stock levels, dead stock, and overstock indicators
- **Target Users**: Retail inventory managers, supply chain analysts, e-commerce operations teams

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Chart.js + react-chartjs-2 (dynamic import with ssr: false)
- Google Fonts: Cormorant Garamond (display) + DM Sans (body)
- Deployment: Vercel

## Color Palette
```
Amber (Primary): #B8924A
Red (Critical): #E24B4A
Green (Healthy): #1D9E75
Blue (Info): #378ADD
Slate (Dead): #5F5E5A
Dark Background: #0F0F0F
Light Background: #FAFAFA
Card Dark: #1A1A1A
Card Light: #FFFFFF
Border: #E5E5E5 (light) / #2A2A2A (dark)
```

## Typography
- **Display Font**: Cormorant Garamond (serif) - for metric values, headers
- **Body Font**: DM Sans - for labels, body text
- **Heading Sizes**: 48px (h1), 32px (h2), 24px (h3)
- **Body Sizes**: 16px (base), 14px (small), 12px (caption)

## Design Principles
- No gradients, no shadows - flat refined surfaces only
- 0.5px borders
- Amber #B8924A as primary accent
- Dark mode support via Tailwind dark: variants
- Luxury retail aesthetic

## TypeScript Interfaces
```ts
interface InventoryKpi {
  turnoverRate: number;
  lowStockCount: number;
  stockoutRate: number;
  deadStockValue: number;
  overstockUnits: number;
}

interface SkuFlag {
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
```

## Status Badge Color Logic
- Critical / Stockout → red (#E24B4A)
- Warning / Low / Overstock → amber (#B8924A)
- Healthy / In-Stock → green (#1D9E75)
- Dead Stock → slate (#5F5E5A)

## API Endpoints (Mock Data)

### GET /api/inventory/kpis
Returns: `{ turnoverRate, lowStockCount, stockoutRate, deadStockValue, overstockUnits }`

### GET /api/inventory/low-stock
Returns: `SkuFlag[]` - SKUs below reorder threshold

### GET /api/inventory/high-speed
Returns: `SkuFlag[]` - top fast-moving SKUs by velocity

### GET /api/inventory/dead-stock
Returns: `{ count: number, items: SkuFlag[], totalValue: number }`

### GET /api/inventory/safety-stock
Returns: `SkuFlag[]` - SKUs with safety stock gap

### GET /api/inventory/stockout-rate
Returns: `{ stockoutRate: number, byCategory: { category: string, rate: number, count: number }[] }`

### GET /api/inventory/overstock
Returns: `{ count: number, items: SkuFlag[], totalExcessUnits: number, totalHoldingCost: number }`

## Components

### TurnoverRateCard
- Large serif number display
- Trend direction badge (up/down)
- Mini sparkline (Chart.js line, 7 data points)
- Role: img, aria-label for accessibility

### LowStockTable
- Sortable table with columns: SKU, Product Name, On-Hand, Reorder Point, Urgency
- Urgency badges: Critical / Warning / Watch
- Conditional Tailwind classes for urgency colors

### HighSpeedGrid
- Top 5 fast movers as ranked cards
- Velocity bar visualization
- Category tag for each SKU

### DeadStockPanel
- SKU count and total value at risk (in red)
- Sortable table by days-idle
- Slate color scheme

### SafetyStockGauge
- Per-SKU horizontal bar showing actual vs safety threshold
- Color-coded gap indicator (green = healthy, amber = below, red = critical)

### StockoutRateDonut
- Chart.js doughnut (72% cutout)
- Stockout vs in-stock rate by category
- Custom legend below canvas

### OverstockAlert
- Flagged SKUs with excess units
- Estimated holding cost
- Recommended action badges (reduce/promote/discontinue)

## Data Fetching
- Server-side fetching in page component
- Parallel fetching via Promise.all for all endpoints
- Dynamic time ranges via searchParams

## Accessibility Requirements
- Every canvas must have role="img" and aria-label
- All badges must include text labels, not colour alone
- Focus rings visible on all interactive elements
- Keyboard-navigable tables
- WCAG 2.1 AA contrast ratios

## Acceptance Criteria
1. Dashboard loads with all 7 KPI sections populated
2. Turnover rate displays with sparkline trend
3. Low stock table shows urgency badges correctly
4. High speed grid shows top 5 by velocity
5. Dead stock panel shows value at risk in red
6. Safety stock gauges show gap indicators
7. Stockout donut shows category breakdown
8. Overstock alerts show holding costs
9. Dark mode toggles correctly
10. All charts have proper accessibility attributes
11. No console errors on load