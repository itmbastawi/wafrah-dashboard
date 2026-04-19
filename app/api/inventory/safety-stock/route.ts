import { NextResponse } from "next/server";
import { fetchSafetyStock } from "@/lib/inventory-data";

export async function GET() {
  const data = await fetchSafetyStock();
  return NextResponse.json(data);
}