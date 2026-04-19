# Aura Analytics - Luxury Data Analysis Dashboard

## Project Overview
- **Project Name**: Aura Analytics
- **Type**: Next.js 14 Web Application (App Router)
- **Core Functionality**: Luxury-styled data analysis dashboard with KPI metrics, revenue charts, segment breakdowns, channel analysis, and campaign tracking
- **Target Users**: Business analysts, executives, marketing teams

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Chart.js + react-chartjs-2 (dynamic import with ssr: false)
- Google Fonts: Cormorant Garamond (display) + DM Sans (body)
- Deployment: Vercel

## Color Palette
```
Primary Gold: #B8924A
Teal: #1D9E75
Rose: #D4537E
Blue: #3B82F6 (additional accent)
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
- 3px left accent bars on KPI cards
- Gold #B8924A as primary accent
- Dark mode support via Tailwind dark: variants

## API Endpoints (Mock Data)

### GET /api/kpis
Returns: `{ totalRevenue, revenueGrowth, activeUsers, userGrowth, conversionRate, conversionGrowth, avgOrderValue, aovGrowth }`

### GET /api/revenue?range=30d|90d|1Y|All
Returns: `{ labels: string[], data: number[] }`

### GET /api/segments
Returns: `[{ name: string, value: number, color: string }]` (Enterprise, Mid-Market, SMB)

### GET /api/channels
Returns: `[{ name: string, value: number, percentage: number }]`

### GET /api/campaigns
Returns: `[{ id, name, status: 'Live'|'Watch'|'Paused', impressions, clicks, ctr, conversions, spend, revenue }]`

## Components

### KpiCard
- Props: label, value, delta, deltaType ('up'|'down'), accentColor ('gold'|'teal'|'blue'|'rose')
- Features:
  - Serif display value (Cormorant Garamond)
  - Delta with directional color (green up / red down)
  - 3px left accent bar in accent color
  - Subtle border

### RevenueChart
- Chart.js line chart
- Smooth tension 0.4
- Filled area with gradient-free solid color
- Time-range toggle buttons (30d / 90d / 1Y / All)
- Uses router.push to trigger fresh SSR
- Accessibility: role="img", aria-label

### DonutChart
- 72% cutout doughnut
- Segment data (Enterprise / Mid-Market / SMB)
- Custom HTML legend below canvas
- Accessibility: role="img", aria-label

### ChannelBars
- Horizontal bar breakdown
- Inline percentage bars with label
- Percentage display

### CampaignTable
- Sortable columns (click header to sort)
- Status badges: Live (green), Watch (gold/amber), Paused (gray)
- Conditional Tailwind classes for styling
- Status includes text, not colour alone (accessibility)

## Data Fetching
- Use getServerSideProps (via App Router - fetch in server component)
- Parallel fetching via Promise.all for all endpoints

## Accessibility Requirements
- Every canvas must have role="img" and aria-label
- Status badges must include text, not colour alone
- All focus rings visible
- WCAG 2.1 AA contrast ratios

## Page Structure
```
/app
  /layout.tsx (fonts, dark mode)
  /page.tsx (main dashboard)
  /api
    /kpis/route.ts
    /revenue/route.ts
    /segments/route.ts
    /channels/route.ts
    /campaigns/route.ts
/components
  /KpiCard.tsx
  /RevenueChart.tsx
  /DonutChart.tsx
  /ChannelBars.tsx
  /CampaignTable.tsx
/lib
  /data.ts (mock data functions)
```

## Acceptance Criteria
1. Dashboard loads with all 5 data sections populated
2. KPI cards show correct metrics with accent bars
3. Revenue chart displays with time-range toggle working
4. Donut chart shows segments with custom legend
5. Channel bars display horizontal breakdown
6. Campaign table is sortable by all columns
7. Status badges have visible text
8. Dark mode toggles correctly
9. All charts have proper accessibility attributes
10. No console errors on load