"use client";

import { useMemo, useState } from "react";
import { BarChart3, Globe, Loader2, TrendingUp } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { VisitorChart } from "@/components/features/dashboard/VisitorChart";
import type { VisitRange, VisitStatsResult } from "@/lib/visit-stats";
import { cn } from "@/lib/utils";

const RANGE_OPTIONS: { id: VisitRange; labelKey: string }[] = [
  { id: "7d", labelKey: "range_7d" },
  { id: "30d", labelKey: "range_30d" },
  { id: "90d", labelKey: "range_90d" },
  { id: "ytd", labelKey: "range_ytd" },
  { id: "1y", labelKey: "range_1y" },
  { id: "all", labelKey: "range_all" },
];

export function VisitorAnalyticsCard({
  initialStats,
}: {
  initialStats: VisitStatsResult;
}) {
  const locale = useLocale();
  const t = useTranslations("DashboardPage");

  const [stats, setStats] = useState<VisitStatsResult>(initialStats);
  const [activeRange, setActiveRange] = useState<VisitRange>(initialStats.range);
  const [loading, setLoading] = useState(false);

  const handleRangeChange = async (range: VisitRange) => {
    if (range === activeRange && !loading) return;
    setActiveRange(range);
    setLoading(true);
    try {
      const res = await fetch(
        `/api/dashboard/visits?range=${range}&locale=${locale}`
      );
      if (res.ok) {
        const next: VisitStatsResult = await res.json();
        setStats(next);
      }
    } finally {
      setLoading(false);
    }
  };

  const { peak, average } = useMemo(() => {
    if (!stats.data.length) return { peak: 0, average: 0 };
    const maxVal = Math.max(...stats.data.map((d) => d.visitors));
    const avgVal = Math.round(stats.periodTotal / stats.data.length);
    return { peak: maxVal, average: avgVal };
  }, [stats]);

  return (
    <Card className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-none p-5 flex flex-col justify-between flex-1 min-h-0 gap-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 shrink-0">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-1.5">
              <BarChart3 className="size-3.5 text-indigo-600 dark:text-indigo-400" />
              {t("visitor_analytics")}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {t("live_data_tracking")}
            </span>
          </div>

          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mt-2">
            <span className="font-serif text-4xl lg:text-5xl text-zinc-900 dark:text-white tracking-tight tabular-nums leading-none">
              {stats.periodTotal.toLocaleString()}
            </span>

            <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
              <span>
                {t("all_time_suffix")}:{" "}
                <strong className="text-zinc-900 dark:text-zinc-200">
                  {stats.allTimeTotal.toLocaleString()}
                </strong>
              </span>
              <span className="text-zinc-300 dark:text-zinc-700">|</span>
              <span className="inline-flex items-center gap-1">
                <TrendingUp className="size-3 text-indigo-500" />
                {t("peak_label")}:{" "}
                <strong className="text-zinc-900 dark:text-zinc-200">{peak}</strong>
              </span>
              <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">|</span>
              <span className="hidden sm:inline">
                {t("avg_label")}:{" "}
                <strong className="text-zinc-900 dark:text-zinc-200">{average}</strong>
              </span>
            </div>
          </div>
        </div>

        <div className="inline-flex items-center p-0.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 self-start shrink-0">
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleRangeChange(opt.id)}
              className={cn(
                "px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all",
                activeRange === opt.id
                  ? "bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              )}
            >
              {t(opt.labelKey as any)}
            </button>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "flex-1 w-full relative min-h-[180px] transition-opacity duration-200",
          loading ? "opacity-45" : "opacity-100"
        )}
      >
        {loading && (
          <div className="absolute top-2 right-2 z-10">
            <Loader2 className="size-4 animate-spin text-indigo-600" />
          </div>
        )}
        <VisitorChart data={stats.data} />
      </div>

      {stats.topCountries.length > 0 && (
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between gap-3 flex-wrap shrink-0">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
            <Globe className="size-3 text-indigo-500" />
            {t("top_regions")}
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            {stats.topCountries.map((c) => (
              <span
                key={c.country}
                className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200/80 dark:border-zinc-800"
              >
                {c.country}{" "}
                <span className="font-mono text-indigo-600 dark:text-indigo-400 ml-1">
                  {c.count}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
