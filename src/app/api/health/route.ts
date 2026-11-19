import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const COOLDOWN_MS = 5 * 60 * 1000;
let lastPingAt = 0;

export async function GET() {
  const now = Date.now();
  if (now - lastPingAt < COOLDOWN_MS) {
    return NextResponse.json(
      { ok: true, cached: true },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const client = await clientPromise;
    await client.db("portfolio").command({ ping: 1 });
    lastPingAt = Date.now();

    return NextResponse.json(
      { ok: true, warmed: true },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message || "DB wake failed" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
