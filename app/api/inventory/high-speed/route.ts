import { NextResponse } from "next/server";
import { fetchHighSpeed } from "@/lib/inventory-data";

export async function GET() {
  const data = await fetchHighSpeed();
  return NextResponse.json(data);
}