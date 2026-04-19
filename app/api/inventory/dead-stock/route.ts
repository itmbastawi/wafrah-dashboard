import { NextResponse } from "next/server";
import { fetchDeadStock } from "@/lib/inventory-data";

export async function GET() {
  const data = await fetchDeadStock();
  return NextResponse.json(data);
}