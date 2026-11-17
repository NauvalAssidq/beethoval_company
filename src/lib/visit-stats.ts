import clientPromise from "@/lib/mongodb";
import { unstable_cache } from "next/cache";

export type VisitRange = "7d" | "30d" | "90d" | "ytd" | "1y" | "all";

export interface VisitChartPoint {
  date: string;
  fullDate: string;
  visitors: number;
}

export interface VisitStatsResult {
  range: VisitRange;
  periodTotal: number;
  allTimeTotal: number;
  data: VisitChartPoint[];
  topCountries: { country: string; count: number }[];
}

async function fetchVisitStats(
  range: VisitRange = "30d",
  locale: string = "en"
): Promise<VisitStatsResult> {
  const client = await clientPromise;
  const db = client.db("portfolio");
  const collection = db.collection("visits");

  const now = new Date();
  let startDate: Date | null = null;
  let granularity: "day" | "month" | "year" = "day";

  if (range === "7d") {
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 6);
    startDate.setHours(0, 0, 0, 0);
    granularity = "day";
  } else if (range === "30d") {
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 29);
    startDate.setHours(0, 0, 0, 0);
    granularity = "day";
  } else if (range === "90d") {
    startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 89);
    startDate.setHours(0, 0, 0, 0);
    granularity = "day";
  } else if (range === "ytd") {
    startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
    granularity = "month";
  } else if (range === "1y") {
    startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1, 0, 0, 0, 0);
    granularity = "month";
  } else {
    startDate = null;
    granularity = "year";
  }

  const dateFormat =
    granularity === "day" ? "%Y-%m-%d" : granularity === "month" ? "%Y-%m" : "%Y";

  const [allTimeTotal, facetResult] = await Promise.all([
    collection.estimatedDocumentCount(),
    collection
      .aggregate([
        ...(startDate ? [{ $match: { createdAt: { $gte: startDate } } }] : []),
        {
          $facet: {
            total: [{ $count: "count" }],
            byDate: [
              {
                $group: {
                  _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
                  count: { $sum: 1 },
                },
              },
              { $sort: { _id: 1 } },
            ],
            topCountries: [
              { $match: { country: { $exists: true, $nin: ["", "Unknown", null] } } },
              { $group: { _id: "$country", count: { $sum: 1 } } },
              { $sort: { count: -1 } },
              { $limit: 4 },
            ],
          },
        },
      ])
      .toArray(),
  ]);

  const facet = facetResult[0] || { total: [], byDate: [], topCountries: [] };
  const periodTotal = facet.total?.[0]?.count ? Number(facet.total[0].count) : 0;
  const grouped = Array.isArray(facet.byDate) ? facet.byDate : [];
  const topCountriesRaw = Array.isArray(facet.topCountries) ? facet.topCountries : [];

  const countsMap = new Map<string, number>();
  for (const row of grouped) {
    if (row._id) countsMap.set(String(row._id), Number(row.count) || 0);
  }

  const localeTag = locale === "id" ? "id-ID" : "en-US";
  const data: VisitChartPoint[] = [];

  if (granularity === "day" && startDate) {
    const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split("T")[0];
      data.push({
        date: d.toLocaleDateString(localeTag, { month: "short", day: "numeric" }),
        fullDate: d.toLocaleDateString(localeTag, {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        visitors: countsMap.get(key) ?? 0,
      });
    }
  } else if (granularity === "month" && startDate) {
    const totalMonths = range === "ytd" ? now.getMonth() + 1 : 12;
    for (let i = 0; i < totalMonths; i++) {
      const d = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const key = `${yyyy}-${mm}`;
      data.push({
        date: d.toLocaleDateString(localeTag, { month: "short" }),
        fullDate: d.toLocaleDateString(localeTag, { month: "long", year: "numeric" }),
        visitors: countsMap.get(key) ?? 0,
      });
    }
  } else {
    const years = Array.from(countsMap.keys()).sort();
    const currentYear = String(now.getFullYear());
    if (years.length === 0) years.push(currentYear);
    for (const yr of years) {
      data.push({
        date: yr,
        fullDate: yr,
        visitors: countsMap.get(yr) ?? 0,
      });
    }
  }

  return {
    range,
    periodTotal,
    allTimeTotal,
    data,
    topCountries: topCountriesRaw.map((c: any) => ({
      country: String(c._id),
      count: Number(c.count) || 0,
    })),
  };
}

export const getVisitStats = unstable_cache(
  fetchVisitStats,
  ["dashboard-visit-stats"],
  { tags: ["visits"], revalidate: 60 }
);
