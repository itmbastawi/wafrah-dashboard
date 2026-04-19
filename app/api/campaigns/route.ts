import { NextResponse } from "next/server";
import { fetchCampaigns } from "@/lib/data";

export async function GET() {
  const data = await fetchCampaigns();
  return NextResponse.json(data);
}