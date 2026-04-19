import { NextResponse } from "next/server";
import { fetchInventoryKpis } from "@/lib/inventory-data";

export async function GET() {
  const data = await fetchInventoryKpis();
  return NextResponse.json(data);
}