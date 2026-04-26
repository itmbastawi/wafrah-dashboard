'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Warehouse, Package, Activity, TrendingUp } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: Activity },
  { href: '/demand-forecast', label: 'Demand Forecast', icon: TrendingUp },
  { href: '/products', label: 'Products', icon: Package },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="hidden sm:flex flex-col w-56 shrink-0 min-h-screen border-r border-border-default bg-surface-elevated">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-border-default">
        <div className="p-2 rounded-xl bg-primary-light">
          <Warehouse className="w-5 h-5 text-primary" />
        </div>
        <span className="text-text-primary font-bold text-lg tracking-tight">Wafrah</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active
                  ? 'bg-primary-light text-primary border border-primary/15'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-border-default">
        <p className="text-text-muted text-xs">v1.0 · Analytics</p>
      </div>
    </aside>
  );
}
