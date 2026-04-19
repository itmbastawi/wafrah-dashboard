export const metadata = {
  title: 'Inventory Dashboard',
  description: 'Real-time inventory analytics and KPIs',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-8 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">I</span>
            </div>
            <h2 className="font-bold text-slate-900">InventoryDWH</h2>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-600">
            <span className="hover:text-slate-900 cursor-pointer">Dashboard</span>
            <span className="hover:text-slate-900 cursor-pointer">Analytics</span>
            <span className="hover:text-slate-900 cursor-pointer">Settings</span>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto p-8">{children}</main>
    </div>
  );
}
