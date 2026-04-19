import {
  fetchInventoryKpis,
  fetchLowStock,
  fetchHighSpeed,
  fetchDeadStock,
  fetchSafetyStock,
  fetchStockoutRate,
  fetchOverstock,
} from "@/lib/inventory-data";
import TurnoverRateCard from "@/components/TurnoverRateCard";
import LowStockTable from "@/components/LowStockTable";
import HighSpeedGrid from "@/components/HighSpeedGrid";
import DeadStockPanel from "@/components/DeadStockPanel";
import SafetyStockGauge from "@/components/SafetyStockGauge";
import StockoutRateDonut from "@/components/StockoutRateDonut";
import OverstockAlert from "@/components/OverstockAlert";

export default async function InventoryDashboardPage() {
  const [kpis, lowStock, highSpeed, deadStock, safetyStock, stockoutRate, overstock] = await Promise.all([
    fetchInventoryKpis(),
    fetchLowStock(),
    fetchHighSpeed(),
    fetchDeadStock(),
    fetchSafetyStock(),
    fetchStockoutRate(),
    fetchOverstock(),
  ]);

  return (
    <main className="min-h-screen bg-aura-light dark:bg-aura-dark p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="font-serif text-4xl md:text-5xl text-gray-900 dark:text-white mb-2">
            Aura Inventory
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Luxury Retail Analytics</p>
        </header>

        <section aria-label="Inventory KPIs" className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <TurnoverRateCard kpi={kpis} />
            <div className="bg-white dark:bg-aura-dark-card p-5 border border-aura-light-border dark:border-aura-dark-border border-l-3 border-l-crimson-500">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Low Stock Flags</p>
              <p className="font-serif text-4xl text-gray-900 dark:text-white mb-2">{kpis.lowStockCount}</p>
              <p className="text-sm text-gray-500">SKUs below reorder</p>
            </div>
            <div className="bg-white dark:bg-aura-dark-card p-5 border border-aura-light-border dark:border-aura-dark-border border-l-3 border-l-crimson-500">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Stockout Rate</p>
              <p className="font-serif text-4xl text-gray-900 dark:text-white mb-2">{kpis.stockoutRate}%</p>
              <p className="text-sm text-gray-500">SKUs at zero</p>
            </div>
            <div className="bg-white dark:bg-aura-dark-card p-5 border border-aura-light-border dark:border-aura-dark-border border-l-3 border-l-amber-500">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Dead Stock Value</p>
              <p className="font-serif text-4xl text-crimson-500 mb-2">${(kpis.deadStockValue / 1000).toFixed(0)}K</p>
              <p className="text-sm text-gray-500">90+ days idle</p>
            </div>
          </div>
        </section>

        <section aria-label="Low Stock and High Speed Stock" className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <LowStockTable items={lowStock} count={kpis.lowStockCount} />
          <HighSpeedGrid items={highSpeed} />
        </section>

        <section aria-label="Dead Stock and Safety Stock" className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <DeadStockPanel items={deadStock.items} count={deadStock.count} totalValue={deadStock.totalValue} />
          <SafetyStockGauge items={safetyStock} />
        </section>

        <section aria-label="Stockout and Overstock" className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <StockoutRateDonut data={stockoutRate} />
          <OverstockAlert 
            items={overstock.items} 
            count={overstock.count} 
            totalExcessUnits={overstock.totalExcessUnits}
            totalHoldingCost={overstock.totalHoldingCost}
          />
        </section>

        <footer className="text-center text-sm text-gray-400 py-4 border-t border-aura-light-border dark:border-aura-dark-border">
          <p>Aura Inventory Analytics &copy; 2024. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}