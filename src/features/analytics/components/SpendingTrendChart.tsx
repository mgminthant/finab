"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/utils/currency";
import { tooltipStyle } from "./chartTheme";

type Point = { label: string; expenses: number };

const compact = (v: number) =>
  v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`;

export default function SpendingTrendChart({ data }: { data: Point[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            className="text-muted"
          />
          <XAxis
            dataKey="label"
            tick={{ fill: "currentColor", fontSize: 12 }}
            className="text-muted-foreground"
            stroke="currentColor"
          />
          <YAxis
            tickFormatter={compact}
            tick={{ fill: "currentColor", fontSize: 12 }}
            className="text-muted-foreground"
            stroke="currentColor"
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => formatCurrency(Number(value))}
          />
          <Area
            type="monotone"
            dataKey="expenses"
            name="Expenses"
            stroke="currentColor"
            className="text-primary"
            fill="currentColor"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
