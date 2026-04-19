import { NextResponse } from "next/server";
import { fetchSegments } from "@/lib/data";

export async function GET() {
  const data = await fetchSegments();
  return NextResponse.json(data);
}