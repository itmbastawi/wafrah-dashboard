export interface KpiData {
  totalRevenue: number;
  revenueGrowth: number;
  activeUsers: number;
  userGrowth: number;
  conversionRate: number;
  conversionGrowth: number;
  avgOrderValue: number;
  aovGrowth: number;
}

export interface RevenueData {
  labels: string[];
  data: number[];
}

export interface SegmentData {
  name: string;
  value: number;
  color: string;
}

export interface ChannelData {
  name: string;
  value: number;
  percentage: number;
}

export interface CampaignData {
  id: string;
  name: string;
  status: "Live" | "Watch" | "Paused";
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  spend: number;
  revenue: number;
}

export async function fetchKpis(): Promise<KpiData> {
  return {
    totalRevenue: 2847500,
    revenueGrowth: 12.5,
    activeUsers: 45892,
    userGrowth: 8.3,
    conversionRate: 3.24,
    conversionGrowth: -2.1,
    avgOrderValue: 892,
    aovGrowth: 5.7,
  };
}

export async function fetchRevenue(range: string = "30d"): Promise<RevenueData> {
  const ranges: Record<string, number> = {
    "30d": 30,
    "90d": 90,
    "1Y": 365,
    All: 730,
  };

  const days = ranges[range] || 30;
  const labels: string[] = [];
  const data: number[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    labels.push(date.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
    data.push(Math.floor(80000 + Math.random() * 40000 + (days - i) * 100));
  }

  return { labels, data };
}

export async function fetchSegments(): Promise<SegmentData[]> {
  return [
    { name: "Enterprise", value: 45, color: "#B8924A" },
    { name: "Mid-Market", value: 35, color: "#1D9E75" },
    { name: "SMB", value: 20, color: "#D4537E" },
  ];
}

export async function fetchChannels(): Promise<ChannelData[]> {
  return [
    { name: "Organic Search", value: 1250000, percentage: 44 },
    { name: "Paid Search", value: 680000, percentage: 24 },
    { name: "Direct", value: 425000, percentage: 15 },
    { name: "Social", value: 285000, percentage: 10 },
    { name: "Email", value: 202500, percentage: 7 },
  ];
}

export async function fetchCampaigns(): Promise<CampaignData[]> {
  return [
    {
      id: "1",
      name: "Summer Luxury Collection",
      status: "Live",
      impressions: 2450000,
      clicks: 122500,
      ctr: 4.98,
      conversions: 8575,
      spend: 45000,
      revenue: 342500,
    },
    {
      id: "2",
      name: "Premium Membership Drive",
      status: "Live",
      impressions: 1820000,
      clicks: 91000,
      ctr: 5.0,
      conversions: 6370,
      spend: 32000,
      revenue: 254800,
    },
    {
      id: "3",
      name: "Holiday Preview 2024",
      status: "Watch",
      impressions: 980000,
      clicks: 49000,
      ctr: 5.0,
      conversions: 2940,
      spend: 18000,
      revenue: 126000,
    },
    {
      id: "4",
      name: "Brand Awareness Q3",
      status: "Paused",
      impressions: 3200000,
      clicks: 128000,
      ctr: 4.0,
      conversions: 5120,
      spend: 65000,
      revenue: 204800,
    },
    {
      id: "5",
      name: "VIP Customer Retention",
      status: "Live",
      impressions: 450000,
      clicks: 36000,
      ctr: 8.0,
      conversions: 3960,
      spend: 12000,
      revenue: 158400,
    },
  ];
}