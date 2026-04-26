'use client';

import React, { useState, useEffect } from 'react';
import { Package, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { DemandKPICard, RecommendationBadge } from '../../components/ui/demand-kpi-card';
import { DemandChart } from '../../components/charts/demand-chart';
import { ProductSearch } from '../../components/ui/product-search';
import { fetchDemandForecast } from '../../../lib/data';
import type { DemandForecast, HealthScore } from '../../../types/inventory';

interface DemandForecastSectionProps {
  products: HealthScore[];
}

export function DemandForecastSection({ products }: DemandForecastSectionProps) {
  const [forecasts, setForecasts] = useState<DemandForecast[]>([]);
  const [selectedForecast, setSelectedForecast] = useState<DemandForecast | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadForecasts() {
      setIsLoading(true);
      try {
        const data = await fetchDemandForecast();
        setForecasts(data);
        if (data.length > 0) {
          setSelectedForecast(data[0]);
        }
      } catch (error) {
        console.error('Failed to load demand forecasts:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadForecasts();
  }, []);

  const handleProductSelect = (product: HealthScore) => {
    const matchingForecast = forecasts.find((f) => f.product_key === product.product_key);
    if (matchingForecast) {
      setSelectedForecast(matchingForecast);
    }
  };

  const top5Forecasts = forecasts.slice(0, 5);

  if (isLoading) {
    return (
      <Card border="primary" id="demand-forecast-section">
        <div className="flex items-center justify-center py-12">
          <p className="text-text-secondary text-sm">Loading demand forecasts...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card border="primary" id="demand-forecast-section">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-text-primary">
              Demand Forecasting
            </h2>
          </div>
          <p className="text-text-muted text-xs mt-0.5">
            AI-powered demand predictions and stock recommendations
          </p>
        </div>
        <ProductSearch
          products={products}
          selectedProduct={selectedForecast ? products.find((p) => p.product_key === selectedForecast.product_key) || null : null}
          onSelectProduct={handleProductSelect}
          placeholder="Search products..."
        />
      </div>

      {/* Selected Product Forecast */}
      {selectedForecast && (
        <>
          {/* Chart */}
          <div className="mb-8">
            <DemandChart forecast={selectedForecast} id="demand-chart" />
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <DemandKPICard
              id="kpi-predicted-demand"
              label="Predicted Demand"
              value={selectedForecast.predicted_demand}
              subtitle={`Next ${selectedForecast.period_days} days`}
              icon={<Package className="w-5 h-5" />}
              trend={selectedForecast.trend}
              confidence={selectedForecast.confidence_score}
              border="primary"
              accentColor="text-primary"
            />
            <DemandKPICard
              id="kpi-current-stock"
              label="Current Stock"
              value={selectedForecast.current_stock}
              subtitle="Units available"
              icon={<BarChart3 className="w-5 h-5" />}
              border="info"
              accentColor="text-info"
            />
            <DemandKPICard
              id="kpi-confidence"
              label="Confidence Score"
              value={`${selectedForecast.confidence_score}%`}
              subtitle="Prediction accuracy"
              icon={<TrendingUp className="w-5 h-5" />}
              trend={selectedForecast.trend}
              border="success"
              accentColor="text-success"
            />
            <DemandKPICard
              id="kpi-risk"
              label="Stock Risk"
              value={selectedForecast.risk_level.charAt(0).toUpperCase() + selectedForecast.risk_level.slice(1)}
              subtitle="Based on forecast"
              icon={<AlertTriangle className="w-5 h-5" />}
              border={selectedForecast.risk_level === 'high' ? 'danger' : selectedForecast.risk_level === 'medium' ? 'warning' : 'success'}
              accentColor={selectedForecast.risk_level === 'high' ? 'text-danger' : selectedForecast.risk_level === 'medium' ? 'text-warning' : 'text-success'}
            />
          </div>

          {/* Recommendation */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-elevated border border-border-default">
            <div>
              <p className="text-text-secondary text-sm font-medium uppercase tracking-wide mb-1">
                Recommendation
              </p>
              <p className="text-text-muted text-xs">
                Current stock: {selectedForecast.current_stock} units | Predicted demand: {selectedForecast.predicted_demand} units
              </p>
            </div>
            <RecommendationBadge
              recommendation={selectedForecast.recommendation}
              riskLevel={selectedForecast.risk_level}
            />
          </div>
        </>
      )}

      {/* Top 5 Products Table */}
      <div className="mt-8 pt-6 border-t border-border-default">
        <h3 className="text-sm font-semibold text-text-primary mb-4">
          Top 5 Products Forecast Summary
        </h3>
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
                          : 'text-primary'
                      }`}
                    >
                      {forecast.trend === 'increasing' && <TrendingUp className="w-3.5 h-3.5" />}
                      {forecast.trend === 'decreasing' && <TrendingUp className="w-3.5 h-3.5 rotate-180" />}
                      {forecast.trend === 'stable' && <TrendingUp className="w-3.5 h-3.5 rotate-90" />}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
}
