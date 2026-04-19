'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, SlidersHorizontal, LayoutGrid, List, X,
  Package, TrendingUp, DollarSign, MapPin, Tag, ChevronUp, ChevronDown,
  ArrowUpDown, RefreshCw, Eye, BarChart2,
} from 'lucide-react';
import type { Product, SortField, SortDir, ViewMode, FilterStatus } from '../../types/products';
import { mockProducts, CATEGORIES, LOCATIONS } from '../../lib/products-data';
import { Card } from '../components/ui/card';
import { StatusBadge } from '../components/ui/status-badge';
import { ProductRadar } from '../components/charts/product-radar';

/* ── helpers ── */
function scoreColor(s: number) {
  if (s >= 75) return 'text-accent-emerald';
  if (s >= 50) return 'text-accent-amber';
  return 'text-accent-rose';
}

function ScoreBar({ value, color }: { value: number; color: string }) {
  const bg = color === 'text-accent-emerald' ? 'bg-accent-emerald'
    : color === 'text-accent-amber' ? 'bg-accent-amber' : 'bg-accent-rose';
  return (
    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
      <div className={`h-full rounded-full ${bg} transition-all duration-700`} style={{ width: `${value}%` }} />
    </div>
  );
}

function StockBar({ onHand, max, reorder }: { onHand: number; max: number; reorder: number }) {
  const pct = Math.min((onHand / max) * 100, 100);
  const reorderPct = (reorder / max) * 100;
  const fill = pct <= reorderPct ? 'bg-accent-rose' : pct <= 50 ? 'bg-accent-amber' : 'bg-accent-emerald';
  return (
    <div className="relative w-full h-2 rounded-full bg-white/5 overflow-hidden">
      <div className={`h-full rounded-full ${fill} transition-all duration-700`} style={{ width: `${pct}%` }} />
      <div className="absolute top-0 bottom-0 w-0.5 bg-white/30" style={{ left: `${reorderPct}%` }} />
    </div>
  );
}

/* ── Sort icon ── */
function SortIcon({ field, active, dir }: { field: string; active: string; dir: SortDir }) {
  if (field !== active) return <ArrowUpDown className="w-3.5 h-3.5 text-text-muted" />;
  return dir === 'asc'
    ? <ChevronUp className="w-3.5 h-3.5 text-accent-cyan" />
    : <ChevronDown className="w-3.5 h-3.5 text-accent-cyan" />;
}

/* ── Product Detail Drawer ── */
function ProductDrawer({ product, onClose }: { product: Product; onClose: () => void }) {
  const col = scoreColor(product.health_score);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative glass-card glow-cyan w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-text-primary">{product.name}</h2>
            <p className="text-text-muted text-sm mt-0.5">SKU: {product.sku} · {product.supplier}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={product.health_status} />
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-text-primary transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* health score big */}
        <div className="flex items-center gap-6 mb-6 p-4 rounded-xl bg-white/3 border border-border-glass">
          <div className="text-center">
            <p className={`text-4xl font-bold ${col}`}>{product.health_score.toFixed(1)}</p>
            <p className="text-text-muted text-xs mt-1 uppercase tracking-wider">Health Score</p>
          </div>
          <div className="flex-1">
            <ProductRadar product={product} />
          </div>
        </div>

        {/* dimension bars */}
        <div className="grid grid-cols-1 gap-3 mb-6">
          {[
            ['Availability', product.availability_score],
            ['Turnover', product.turnover_score],
            ['Freshness', product.freshness_score],
            ['Balance', product.balance_score],
            ['Value', product.value_score],
          ].map(([label, val]) => (
            <div key={label as string} className="flex items-center gap-3">
              <span className="text-text-muted text-xs w-24 shrink-0">{label}</span>
              <div className="flex-1">
                <ScoreBar value={val as number} color={scoreColor(val as number)} />
              </div>
              <span className={`text-xs font-semibold w-8 text-right ${scoreColor(val as number)}`}>{val}</span>
            </div>
          ))}
        </div>

        {/* stock level */}
        <div className="mb-6 p-4 rounded-xl bg-white/3 border border-border-glass">
          <div className="flex justify-between items-center mb-2">
            <span className="text-text-secondary text-sm font-medium">Stock Level</span>
            <span className="text-text-muted text-xs">{product.quantity_on_hand} / {product.max_stock} units</span>
          </div>
          <StockBar onHand={product.quantity_on_hand} max={product.max_stock} reorder={product.reorder_point} />
          <div className="flex justify-between mt-1.5">
            <span className="text-text-muted text-xs">0</span>
            <span className="text-accent-amber text-xs">Reorder: {product.reorder_point}</span>
            <span className="text-text-muted text-xs">Max: {product.max_stock}</span>
          </div>
        </div>

        {/* meta grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Unit Price', value: `$${product.unit_price.toFixed(2)}` },
            { label: 'Total Value', value: `$${product.total_value.toLocaleString()}` },
            { label: 'Turnover Rate', value: `${product.turnover_rate}x` },
            { label: 'Available', value: `${product.quantity_available} units` },
            { label: 'Days Since Move', value: `${product.days_since_movement}d` },
            { label: 'Location', value: product.location },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded-xl bg-white/3 border border-border-glass">
              <p className="text-text-muted text-xs mb-1">{item.label}</p>
              <p className="text-text-primary text-sm font-semibold">{item.value}</p>
            </div>
          ))}
        </div>

        {/* tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {product.tags.map((t) => (
            <span key={t} className="px-2.5 py-1 rounded-full text-xs bg-accent-violet/10 text-accent-violet border border-accent-violet/15">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Grid Card ── */
function ProductGridCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const col = scoreColor(product.health_score);
  return (
    <div
      className="glass-card p-5 cursor-pointer group hover:border-accent-cyan/30 transition-all duration-300"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0 mr-3">
          <p className="text-text-primary font-semibold text-sm truncate group-hover:text-accent-cyan transition-colors">{product.name}</p>
          <p className="text-text-muted text-xs mt-0.5">{product.sku}</p>
        </div>
        <StatusBadge status={product.health_status} />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className={`text-2xl font-bold ${col}`}>{product.health_score.toFixed(0)}</span>
        <div className="flex-1">
          <ScoreBar value={product.health_score} color={col} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="flex items-center gap-1.5 text-text-secondary">
          <Package className="w-3 h-3 shrink-0" />
          <span>{product.quantity_available} avail.</span>
        </div>
        <div className="flex items-center gap-1.5 text-text-secondary">
          <TrendingUp className="w-3 h-3 shrink-0" />
          <span>{product.turnover_rate}x turn.</span>
        </div>
        <div className="flex items-center gap-1.5 text-text-secondary">
          <DollarSign className="w-3 h-3 shrink-0" />
          <span>${(product.total_value / 1000).toFixed(1)}k value</span>
        </div>
        <div className="flex items-center gap-1.5 text-text-secondary">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{product.location.replace('Warehouse ', 'WH-')}</span>
        </div>
      </div>

      <StockBar onHand={product.quantity_on_hand} max={product.max_stock} reorder={product.reorder_point} />

      <div className="mt-3 flex items-center justify-between">
        <span className="text-text-muted text-xs">{product.category}</span>
        <span className="flex items-center gap-1 text-text-muted text-xs opacity-0 group-hover:opacity-100 transition-opacity">
          <Eye className="w-3 h-3" /> Details
        </span>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('ALL');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [sortField, setSortField] = useState<SortField>('health_score');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const filtered = useMemo(() => {
    let data = mockProducts.filter((p) => {
      const q = search.toLowerCase();
      if (q && !p.name.toLowerCase().includes(q) && !p.sku.toLowerCase().includes(q) && !p.supplier.toLowerCase().includes(q)) return false;
      if (statusFilter !== 'ALL' && p.health_status !== statusFilter) return false;
      if (categoryFilter !== 'All' && p.category !== categoryFilter) return false;
      if (locationFilter !== 'All' && p.location !== locationFilter) return false;
      return true;
    });
    data = [...data].sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1;
      if (sortField === 'name') return mul * a.name.localeCompare(b.name);
      return mul * ((a[sortField] as number) - (b[sortField] as number));
    });
    return data;
  }, [search, statusFilter, categoryFilter, locationFilter, sortField, sortDir]);

  const stats = useMemo(() => ({
    healthy: mockProducts.filter((p) => p.health_status === 'HEALTHY').length,
    warning: mockProducts.filter((p) => p.health_status === 'WARNING').length,
    critical: mockProducts.filter((p) => p.health_status === 'CRITICAL').length,
    totalValue: mockProducts.reduce((s, p) => s + p.total_value, 0),
  }), []);

  const thCls = 'text-left py-3 px-4 text-text-muted font-semibold text-xs uppercase tracking-wider whitespace-nowrap';
  const sortTh = (field: SortField, label: string) => (
    <th className={thCls}>
      <button className="flex items-center gap-1.5 hover:text-text-primary transition-colors" onClick={() => handleSort(field)}>
        {label} <SortIcon field={field} active={sortField} dir={sortDir} />
      </button>
    </th>
  );

  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <header className="mb-8 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-accent-violet/10">
                <Package className="w-6 h-6 text-accent-violet" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-text">Products</h1>
            </div>
            <p className="text-text-secondary text-sm sm:text-base">
              Full catalog with health metrics, stock levels and performance analytics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-text-muted text-sm">{filtered.length} of {mockProducts.length} products</span>
          </div>
        </div>
      </header>

      {/* Stats row */}
      <section className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4 stagger-children">
        {[
          { label: 'Total Products', value: mockProducts.length, color: 'text-accent-cyan', bg: 'bg-accent-cyan/10', border: 'border-accent-cyan/10' },
          { label: 'Healthy', value: stats.healthy, color: 'text-accent-emerald', bg: 'bg-accent-emerald/10', border: 'border-accent-emerald/10' },
          { label: 'Warning', value: stats.warning, color: 'text-accent-amber', bg: 'bg-accent-amber/10', border: 'border-accent-amber/10' },
          { label: 'Critical', value: stats.critical, color: 'text-accent-rose', bg: 'bg-accent-rose/10', border: 'border-accent-rose/10' },
        ].map((s) => (
          <div key={s.label} className={`glass-card p-4 flex items-center gap-4 border ${s.border}`}>
            <div className={`p-3 rounded-xl ${s.bg}`}>
              <BarChart2 className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-text-muted text-xs uppercase tracking-wider">{s.label}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Toolbar */}
      <div className="mb-6 glass-card p-4 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              id="products-search"
              type="text"
              placeholder="Search by name, SKU, or supplier…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-border-glass rounded-xl text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent-cyan/30 focus:border-accent-cyan/30 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status filter pills */}
          <div className="flex gap-2">
            {(['ALL', 'HEALTHY', 'WARNING', 'CRITICAL'] as FilterStatus[]).map((s) => {
              const active = statusFilter === s;
              const colors: Record<FilterStatus, string> = {
                ALL: 'text-accent-cyan border-accent-cyan/30 bg-accent-cyan/10',
                HEALTHY: 'text-accent-emerald border-accent-emerald/30 bg-accent-emerald/10',
                WARNING: 'text-accent-amber border-accent-amber/30 bg-accent-amber/10',
                CRITICAL: 'text-accent-rose border-accent-rose/30 bg-accent-rose/10',
              };
              return (
                <button
                  key={s}
                  id={`filter-${s.toLowerCase()}`}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${active ? colors[s] : 'text-text-muted border-border-glass hover:border-border-glass-hover'}`}
                >
                  {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
                </button>
              );
            })}
          </div>

          {/* More filters toggle */}
          <button
            id="toggle-filters"
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-all ${showFilters ? 'text-accent-violet border-accent-violet/30 bg-accent-violet/10' : 'text-text-muted border-border-glass hover:border-border-glass-hover'}`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          {/* View mode */}
          <div className="flex rounded-xl border border-border-glass overflow-hidden">
            <button
              id="view-table"
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 transition-all ${viewMode === 'table' ? 'bg-accent-cyan/10 text-accent-cyan' : 'text-text-muted hover:text-text-primary'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              id="view-grid"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 transition-all ${viewMode === 'grid' ? 'bg-accent-cyan/10 text-accent-cyan' : 'text-text-muted hover:text-text-primary'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Extended filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-border-glass flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-text-muted" />
              <select
                id="filter-category"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white/5 border border-border-glass rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-violet/30"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-text-muted" />
              <select
                id="filter-location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="bg-white/5 border border-border-glass rounded-lg px-3 py-1.5 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-violet/30"
              >
                {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <button
              onClick={() => { setSearch(''); setStatusFilter('ALL'); setCategoryFilter('All'); setLocationFilter('All'); }}
              className="flex items-center gap-1.5 text-text-muted text-sm hover:text-text-primary transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="glass-card p-16 flex flex-col items-center text-text-muted animate-fade-in-up">
          <Package className="w-12 h-12 mb-4 opacity-40" />
          <p className="font-medium">No products match your filters</p>
          <p className="text-xs mt-1 opacity-70">Try adjusting the search or filters above</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
          {filtered.map((p) => (
            <ProductGridCard key={p.id} product={p} onClick={() => setSelectedProduct(p)} />
          ))}
        </div>
      ) : (
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <Card glow="violet" className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-glass">
                  <th className={thCls}>
                    <button className="flex items-center gap-1.5 hover:text-text-primary transition-colors" onClick={() => handleSort('name')}>
                      Product <SortIcon field="name" active={sortField} dir={sortDir} />
                    </button>
                  </th>
                  <th className={thCls}>Status</th>
                  {sortTh('health_score', 'Health')}
                  {sortTh('quantity_on_hand', 'Stock')}
                  <th className={thCls}>Stock Level</th>
                  {sortTh('turnover_rate', 'Turnover')}
                  {sortTh('total_value', 'Value')}
                  {sortTh('days_since_movement', 'Last Move')}
                  <th className={thCls}>Location</th>
                  <th className={thCls}></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const col = scoreColor(p.health_score);
                  return (
                    <tr
                      key={p.id}
                      className="table-row-hover border-b border-border-glass/50 last:border-0 cursor-pointer"
                      onClick={() => setSelectedProduct(p)}
                    >
                      <td className="py-3.5 px-4">
                        <div>
                          <p className="text-text-primary font-medium">{p.name}</p>
                          <p className="text-text-muted text-xs">{p.sku} · {p.category}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={p.health_status} />
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`font-bold text-base ${col}`}>{p.health_score.toFixed(1)}</span>
                      </td>
                      <td className="py-3.5 px-4 text-text-secondary">
                        <span className="font-medium text-text-primary">{p.quantity_available}</span>
                        <span className="text-text-muted">/{p.quantity_on_hand}</span>
                      </td>
                      <td className="py-3.5 px-4 w-32">
                        <StockBar onHand={p.quantity_on_hand} max={p.max_stock} reorder={p.reorder_point} />
                      </td>
                      <td className="py-3.5 px-4 text-text-secondary">{p.turnover_rate}x</td>
                      <td className="py-3.5 px-4 text-text-secondary">${p.total_value.toLocaleString()}</td>
                      <td className={`py-3.5 px-4 font-medium ${p.days_since_movement > 30 ? 'text-accent-rose' : p.days_since_movement > 14 ? 'text-accent-amber' : 'text-accent-emerald'}`}>
                        {p.days_since_movement}d
                      </td>
                      <td className="py-3.5 px-4 text-text-muted text-xs">{p.location}</td>
                      <td className="py-3.5 px-4">
                        <button className="p-1.5 rounded-lg hover:bg-white/5 text-text-muted hover:text-accent-cyan transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-border-glass flex items-center justify-between">
            <span className="text-text-muted text-xs">Showing {filtered.length} products</span>
            <span className="text-text-muted text-xs">
              Total inventory value: <span className="text-text-primary font-semibold">
                ${mockProducts.reduce((s, p) => s + p.total_value, 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </span>
          </div>
        </Card>
        </div>
      )}

      {/* Detail Drawer */}
      {selectedProduct && (
        <ProductDrawer product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}

      <footer className="text-center py-6 text-text-muted text-xs mt-8">
        <p>Wafrah Inventory Analytics • Products Catalog</p>
      </footer>
    </main>
  );
}
