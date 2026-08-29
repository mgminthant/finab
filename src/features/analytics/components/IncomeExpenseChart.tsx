"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency } from "@/utils/currency";
import { tooltipStyle } from "./chartTheme";

type Point = { label: string; income: number; expenses: number };

const compact = (v: number) =>
  v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`;

export default function IncomeExpenseChart({ data }: { data: Point[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
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
          <Legend
            wrapperStyle={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}
          />
          <Bar
            dataKey="income"
            name="Income"
            className="text-success"
            fill="currentColor"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="expenses"
            name="Expenses"
            className="text-destructive"
            fill="currentColor"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
