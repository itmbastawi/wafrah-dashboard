import type { Metadata } from 'next';
import './globals.css';
import { SideNav } from './components/ui/side-nav';

export const metadata: Metadata = {
  title: 'Wafrah — Inventory Health Dashboard',
  description:
    'Professional inventory analytics dashboard with real-time health scoring, KPI tracking, and actionable insights.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-grid min-h-screen antialiased flex">
        <SideNav />
        <div className="flex-1 min-w-0">{children}</div>
      </body>
    </html>
  );
}
