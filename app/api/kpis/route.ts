import { NextResponse } from "next/server";
import { fetchKpis } from "@/lib/data";

export async function GET() {
  const data = await fetchKpis();
  return NextResponse.json(data);
}