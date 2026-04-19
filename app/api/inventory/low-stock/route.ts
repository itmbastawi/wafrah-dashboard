import { NextResponse } from "next/server";
import { fetchLowStock } from "@/lib/inventory-data";

export async function GET() {
  const data = await fetchLowStock();
  return NextResponse.json(data);
}