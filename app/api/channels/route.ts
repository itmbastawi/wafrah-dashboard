import { NextResponse } from "next/server";
import { fetchChannels } from "@/lib/data";

export async function GET() {
  const data = await fetchChannels();
  return NextResponse.json(data);
}