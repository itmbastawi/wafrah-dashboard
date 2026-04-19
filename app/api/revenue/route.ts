import { NextRequest, NextResponse } from "next/server";
import { fetchRevenue } from "@/lib/data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const range = searchParams.get("range") || "30d";
  const data = await fetchRevenue(range);
  return NextResponse.json(data);
}