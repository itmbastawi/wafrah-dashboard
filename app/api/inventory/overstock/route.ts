import { NextResponse } from "next/server";
import { fetchOverstock } from "@/lib/inventory-data";

export async function GET() {
  const data = await fetchOverstock();
  return NextResponse.json(data);
}