"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const generateData = () => {
  const data = [];
  const startDate = new Date("2024-04-01");
  for (let i = 0; i < 91; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    

    const month = currentDate.toLocaleString('default', { month: 'short' });
    const day = currentDate.getDate();
    const dateStr = `${month} ${day}`;
    

    const baseValue = 30 + Math.random() * 40;
    const peak = Math.random() > 0.8 ? Math.random() * 40 : 0;
    
    data.push({
      date: dateStr,
      fullDate: `${month} ${day}, 2024`,
      visitors: Math.floor(baseValue + peak),
    });
  }
  return data;
};

const chartData = generateData();

const chartConfig = {
  visitors: {
    label: "Page Views",
    color: "#3b82f6",
  },
} satisfies ChartConfig

export function VisitorChart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[160px] w-full">
      <BarChart accessibilityLayer data={chartData} margin={{ top: 12, right: 24, left: 24, bottom: 24 }}>
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
