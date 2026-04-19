import { NextResponse } from "next/server";
import { fetchStockoutRate } from "@/lib/inventory-data";

export async function GET() {
  const data = await fetchStockoutRate();
  return NextResponse.json(data);
}