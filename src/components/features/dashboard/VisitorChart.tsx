"use client";

import { useTranslations } from "next-intl";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface VisitData {
  date: string;
  fullDate: string;
  visitors: number;
}

const chartConfig = {
  visitors: {
    label: "Visits",
    color: "#4f46e5",
  },
} satisfies ChartConfig;

export function VisitorChart({ data }: { data: VisitData[] }) {
  const t = useTranslations("VisitorChart");

  if (!data || data.length === 0) {
    return (
      <div className="h-full min-h-[160px] w-full flex items-center justify-center text-sm text-zinc-500">
        {t("no_visitor_data_available")}
      </div>
    );
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="h-full min-h-[160px] w-full aspect-auto"
    >
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
      >
        <defs>
          <linearGradient id="visitAreaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.28} />
            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.02} />
          </linearGradient>
        </defs>

        <CartesianGrid
          vertical={false}
          horizontal={true}
          strokeDasharray="3 3"
          className="stroke-zinc-200/80 dark:stroke-zinc-800/70"
        />

        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={8}
          axisLine={false}
          minTickGap={20}
          className="text-[10px] font-mono text-zinc-400"
        />

        <YAxis hide={true} allowDecimals={false} />

        <ChartTooltip
          cursor={{ stroke: "#4f46e5", strokeWidth: 1, strokeDasharray: "3 3" }}
          content={<ChartTooltipContent labelKey="fullDate" />}
        />

        <Area
          type="monotone"
          dataKey="visitors"
          stroke="#4f46e5"
          strokeWidth={2}
          fill="url(#visitAreaGradient)"
          activeDot={{ r: 4, fill: "#4f46e5", stroke: "#ffffff", strokeWidth: 2 }}
        />
      </AreaChart>
    </ChartContainer>
  );
}
