"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export interface VisitData {
  date: string;
  fullDate: string;
  visitors: number;
}

const chartConfig = {
  visitors: {
    label: "Page Views",
    color: "#4f46e5", // using indigo-600
  },
} satisfies ChartConfig

export function VisitorChart({ data }: { data: VisitData[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="min-h-[160px] w-full flex items-center justify-center text-sm text-zinc-500">
        No visitor data available
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[160px] w-full">
      <BarChart accessibilityLayer data={data} margin={{ top: 12, right: 24, left: 24, bottom: 24 }}>
        <CartesianGrid vertical={false} horizontal={true} strokeDasharray="0" className="stroke-zinc-800 dark:stroke-zinc-800/60" />
        
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          minTickGap={18}
          className="text-[10px] text-zinc-500"
        />
        
        <YAxis hide={true} />
        
        <ChartTooltip 
          cursor={{ fill: 'var(--zinc-800)', opacity: 0.2 }}
          content={<ChartTooltipContent labelKey="fullDate" />} 
        />
        
        <Bar 
          dataKey="visitors" 
          fill="var(--color-visitors)" 
          radius={0} 
        />
      </BarChart>
    </ChartContainer>
  )
}

