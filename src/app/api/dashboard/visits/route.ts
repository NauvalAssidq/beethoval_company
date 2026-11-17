import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getVisitStats, type VisitRange } from "@/lib/visit-stats";

const VALID_RANGES: VisitRange[] = ["7d", "30d", "90d", "ytd", "1y", "all"];

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const rawRange = (searchParams.get("range") || "30d") as VisitRange;
    const locale = searchParams.get("locale") || "en";
    const range = VALID_RANGES.includes(rawRange) ? rawRange : "30d";

    const stats = await getVisitStats(range, locale);
    return NextResponse.json(stats);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
