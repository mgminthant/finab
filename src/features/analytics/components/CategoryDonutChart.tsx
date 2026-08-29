"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { formatCurrency } from "@/utils/currency";
import { useT } from "@/components/shared/I18nProvider";
import { tooltipStyle } from "./chartTheme";

type Slice = { name: string; value: number; percentage: number };

const palette = [
  "text-primary",
  "text-success",
  "text-warning",
  "text-destructive",
  "text-muted-foreground",
];

export default function CategoryDonutChart({ data }: { data: Slice[] }) {
  const t = useT();

  if (data.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        {t("analytics.noData")}
      </p>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={55}
            outerRadius={90}
            paddingAngle={2}
            stroke="none"
          >
            {data.map((entry, i) => (
              <Cell
                key={entry.name}
                className={palette[i % palette.length]}
                fill="currentColor"
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => formatCurrency(Number(value))}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
