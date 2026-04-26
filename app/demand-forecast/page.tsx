'use client';

import React, { useState, useEffect } from 'react';
import {
  Package,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Clock,
  RefreshCw,
  CheckCircle,
  ArrowDownRight,
  Minus,
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { DemandKPICard, RecommendationBadge } from '../components/ui/demand-kpi-card';
import { DemandChart } from '../components/charts/demand-chart';
import { ProductSearch } from '../components/ui/product-search';
import { fetchDemandForecast, mockDemandForecasts } from '../../lib/data';
import { fetchHealthScores } from '../../lib/data';
import type { DemandForecast, HealthScore } from '../../types/inventory';

export default function DemandForecastPage() {
  const [forecasts, setForecasts] = useState<DemandForecast[]>([]);
  const [products, setProducts] = useState<HealthScore[]>([]);
  const [selectedForecast, setSelectedForecast] = useState<DemandForecast | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [forecastData, productData] = await Promise.all([
          fetchDemandForecast(),
          fetchHealthScores(),
        ]);
        setForecasts(forecastData);
        setProducts(productData.length > 0 ? productData : []);
        if (forecastData.length > 0) {
          setSelectedForecast(forecastData[0]);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        setForecasts(mockDemandForecasts);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleProductSelect = (product: HealthScore) => {
    const matchingForecast = forecasts.find((f) => f.product_key === product.product_key);
    if (matchingForecast) {
      setSelectedForecast(matchingForecast);
    }
  };

  const top5Forecasts = forecasts.slice(0, 5);

  const aggregateStats = {
    totalPredicted: forecasts.reduce((sum, f) => sum + f.predicted_demand, 0),
    avgConfidence: Math.round(forecasts.reduce((sum, f) => sum + f.confidence_score, 0) / forecasts.length),
    reorderCount: forecasts.filter((f) => f.recommendation === 'reorder').length,
    highRiskCount: forecasts.filter((f) => f.risk_level === 'high').length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
          <p className="text-text-secondary text-sm font-medium">
            Loading demand forecasts…
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-[1440px] mx-auto">
      {/* Header */}
      <header className="mb-10 animate-fade-in-up">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-primary-light">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-text">
                Demand Forecasting
              </h1>
            </div>
            <p className="text-text-secondary text-sm sm:text-base">
              AI-powered demand predictions and stock recommendations
            </p>
          </div>
          <div className="flex items-center gap-2 text-text-muted text-sm">
            <Clock className="w-4 h-4" />
            <span>8-week forecast horizon</span>
          </div>
        </div>
      </header>

      {/* Stats Row */}
      <section className="mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <DemandKPICard
          id="kpi-total-demand"
          label="Total Predicted Demand"
          value={aggregateStats.totalPredicted}
          subtitle="Across all products"
          icon={<Package className="w-5 h-5" />}
          border="primary"
          accentColor="text-primary"
        />
        <DemandKPICard
          id="kpi-avg-confidence"
          label="Avg Confidence"
          value={`${aggregateStats.avgConfidence}%`}
          subtitle="Prediction accuracy"
          icon={<TrendingUp className="w-5 h-5" />}
          border="success"
          accentColor="text-success"
        />
        <DemandKPICard
          id="kpi-reorder-needed"
          label="Reorder Needed"
          value={aggregateStats.reorderCount}
          subtitle="Products require restocking"
          icon={<CheckCircle className="w-5 h-5" />}
          border="warning"
          accentColor="text-warning"
        />
        <DemandKPICard
          id="kpi-high-risk"
          label="High Risk"
          value={aggregateStats.highRiskCount}
          subtitle="Stockout potential"
          icon={<AlertTriangle className="w-5 h-5" />}
          border="danger"
          accentColor="text-danger"
        />
      </section>

      {/* Product Selector */}
      <section className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <label className="text-text-secondary text-sm font-medium">Select Product:</label>
          <ProductSearch
            products={products}
            selectedProduct={selectedForecast ? products.find((p) => p.product_key === selectedForecast.product_key) || null : null}
            onSelectProduct={handleProductSelect}
            placeholder="Search products to view forecast..."
          />
        </div>
      </section>

      {/* Main Content */}
      {selectedForecast ? (
        <section className="mb-10 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <Card border="primary" id="selected-forecast">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  {selectedForecast.product_name}
                </h2>
                <p className="text-text-muted text-xs mt-0.5">
                  8-week demand forecast timeline
                </p>
              </div>
              <RecommendationBadge
                recommendation={selectedForecast.recommendation}
                riskLevel={selectedForecast.risk_level}
              />
            </div>

            {/* Chart */}
            <div className="mb-8">
              <DemandChart forecast={selectedForecast} id="demand-chart" />
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-surface-elevated border border-border-default">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-4 h-4 text-primary" />
                  <span className="text-text-secondary text-sm">Current Stock</span>
                </div>
                <p className="text-2xl font-bold text-text-primary">{selectedForecast.current_stock}</p>
                <p className="text-text-muted text-xs mt-1">units available</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-elevated border border-border-default">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="w-4 h-4 text-info" />
                  <span className="text-text-secondary text-sm">Predicted Demand</span>
                </div>
                <p className="text-2xl font-bold text-text-primary">{selectedForecast.predicted_demand}</p>
                <p className="text-text-muted text-xs mt-1">next {selectedForecast.period_days} days</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-elevated border border-border-default">
                <div className="flex items-center gap-3 mb-2">
                  {selectedForecast.trend === 'increasing' ? (
                    <TrendingUp className="w-4 h-4 text-success" />
                  ) : selectedForecast.trend === 'decreasing' ? (
                    <ArrowDownRight className="w-4 h-4 text-danger" />
                  ) : (
                    <Minus className="w-4 h-4 text-warning" />
                  )}
                  <span className="text-text-secondary text-sm">Trend</span>
                </div>
                <p className={`text-2xl font-bold ${selectedForecast.trend === 'increasing' ? 'text-success' : selectedForecast.trend === 'decreasing' ? 'text-danger' : 'text-warning'}`}>
                  {selectedForecast.trend.charAt(0).toUpperCase() + selectedForecast.trend.slice(1)}
                </p>
                <p className="text-text-muted text-xs mt-1">demand trajectory</p>
              </div>
              <div className="p-4 rounded-xl bg-surface-elevated border border-border-default">
                <div className="flex items-center gap-3 mb-2">
                  <AlertTriangle className="w-4 h-4 text-danger" />
                  <span className="text-text-secondary text-sm">Risk Level</span>
                </div>
                <p className={`text-2xl font-bold ${selectedForecast.risk_level === 'high' ? 'text-danger' : selectedForecast.risk_level === 'medium' ? 'text-warning' : 'text-success'}`}>
                  {selectedForecast.risk_level.charAt(0).toUpperCase() + selectedForecast.risk_level.slice(1)}
                </p>
                <p className="text-text-muted text-xs mt-1">confidence: {selectedForecast.confidence_score}%</p>
              </div>
            </div>

            {/* Recommendation */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-surface-elevated border border-border-default">
              <div>
                <p className="text-text-secondary text-sm font-medium uppercase tracking-wide mb-1">
                  Action Required
                </p>
                <p className="text-text-muted text-xs">
                  Stock gap: {selectedForecast.current_stock < selectedForecast.predicted_demand
                    ? `Need ${selectedForecast.predicted_demand - selectedForecast.current_stock} more units`
                    : `Surplus of ${selectedForecast.current_stock - selectedForecast.predicted_demand} units`
                  }
                </p>
              </div>
              <RecommendationBadge
                recommendation={selectedForecast.recommendation}
                riskLevel={selectedForecast.risk_level}
              />
            </div>
          </Card>
        </section>
      ) : (
        <section className="mb-10">
          <Card border="primary" className="flex items-center justify-center py-16">
            <p className="text-text-muted">Select a product to view its demand forecast</p>
          </Card>
        </section>
      )}

      {/* Top 5 Products Table */}
      <section className="mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <Card border="info" id="top-forecast-table">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Top 5 Products Forecast
              </h2>
              <p className="text-text-muted text-xs mt-0.5">
                Products with highest predicted demand
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-text-secondary text-xs uppercase tracking-wide border-b border-border-default">
                  <th className="text-left py-3 px-4 font-medium">Product</th>
                  <th className="text-center py-3 px-4 font-medium">Current Stock</th>
                  <th className="text-center py-3 px-4 font-medium">Predicted Demand</th>
                  <th className="text-center py-3 px-4 font-medium">Trend</th>
                  <th className="text-center py-3 px-4 font-medium">Confidence</th>
                  <th className="text-center py-3 px-4 font-medium">Recommendation</th>
                  <th className="text-center py-3 px-4 font-medium">Risk</th>
                </tr>
              </thead>
              <tbody>
                {top5Forecasts.map((forecast) => (
                  <tr
                    key={forecast.product_key}
                    className={`border-b border-border-default/50 hover:bg-surface-hover transition-colors cursor-pointer ${
                      selectedForecast?.product_key === forecast.product_key ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => setSelectedForecast(forecast)}
                  >
                    <td className="py-3 px-4 text-text-primary font-medium">
                      {forecast.product_name}
                    </td>
                    <td className="py-3 px-4 text-center text-text-secondary">
                      {forecast.current_stock}
                    </td>
                    <td className="py-3 px-4 text-center text-text-primary font-semibold">
                      {forecast.predicted_demand}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium ${
                          forecast.trend === 'increasing'
                            ? 'text-success'
                            : forecast.trend === 'decreasing'
                            ? 'text-danger'
                            : 'text-warning'
                        }`}
                      >
                        {forecast.trend === 'increasing' && <TrendingUp className="w-3.5 h-3.5" />}
                        {forecast.trend === 'decreasing' && <ArrowDownRight className="w-3.5 h-3.5" />}
                        {forecast.trend === 'stable' && <Minus className="w-3.5 h-3.5" />}
                        {forecast.trend.charAt(0).toUpperCase() + forecast.trend.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-2 bg-surface-elevated rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              forecast.confidence_score >= 80
                                ? 'bg-success'
                                : forecast.confidence_score >= 60
                                ? 'bg-warning'
                                : 'bg-danger'
                            }`}
                            style={{ width: `${forecast.confidence_score}%` }}
                          />
                        </div>
                        <span className="text-text-secondary text-xs">{forecast.confidence_score}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          forecast.recommendation === 'reorder'
                            ? 'bg-success/10 text-success'
                            : forecast.recommendation === 'reduce'
                            ? 'bg-danger/10 text-danger'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {forecast.recommendation.charAt(0).toUpperCase() + forecast.recommendation.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          forecast.risk_level === 'high'
                            ? 'bg-danger/10 text-danger'
                            : forecast.risk_level === 'medium'
                            ? 'bg-warning/10 text-warning'
                            : 'bg-success/10 text-success'
                        }`}
                      >
                        {forecast.risk_level.charAt(0).toUpperCase() + forecast.risk_level.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-text-muted text-xs">
        <p>Wafrah Inventory Analytics • Demand Forecasting</p>
      </footer>
    </main>
  );
}