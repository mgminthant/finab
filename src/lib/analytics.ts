"use server";

import { prisma } from "@/lib/prisma";
import { getYangonDate } from "@/lib/yangon";
import { getFinancialSummary, getSpendingByCategory } from "@/lib/summary";
import { getBudgets } from "@/lib/budget";
import { formatCurrency } from "@/utils/currency";

export type MonthlyTrendPoint = {
  year: number;
  month: number;
  income: number;
  expenses: number;
};

export async function getMonthlyTrend(
  userId: string,
  months = 6
): Promise<MonthlyTrendPoint[]> {
  const now = getYangonDate();
  const currentIndex = now.month - 1; // 0-11
  const points: MonthlyTrendPoint[] = [];

  for (let i = months - 1; i >= 0; i--) {
    const idx = currentIndex - i;
    const year = now.year + Math.floor(idx / 12);
    const month = ((idx % 12) + 12) % 12; // 0-11

    const start = new Date(Date.UTC(year, month, 1));
    const end = new Date(Date.UTC(year, month + 1, 1));

    const [incomeAgg, expenseAgg] = await Promise.all([
      prisma.transaction.aggregate({
        where: { userId, type: "INCOME", date: { gte: start, lt: end } },
        _sum: { amount: true },
      }),
      prisma.transaction.aggregate({
        where: { userId, type: "EXPENSE", date: { gte: start, lt: end } },
        _sum: { amount: true },
      }),
    ]);

    points.push({
      year,
      month: month + 1,
      income: incomeAgg._sum.amount?.toNumber() ?? 0,
      expenses: expenseAgg._sum.amount?.toNumber() ?? 0,
    });
  }

  return points;
}

export type InsightSeverity = "info" | "warning" | "critical";

export type Insight = {
  key: string;
  value: string;
  severity: InsightSeverity;
};

export async function getInsights(userId: string): Promise<Insight[]> {
  const [summary, spending, budget] = await Promise.all([
    getFinancialSummary(userId),
    getSpendingByCategory(userId),
    getBudgets(userId),
  ]);

  const insights: Insight[] = [];

  if (spending.length > 0) {
    const top = spending[0];
    insights.push({
      key: "analytics.largestCategory",
      value: `${top.name} · ${formatCurrency(top.total)}`,
      severity: "info",
    });
  }

  const savingsRate =
    summary.totalIncome > 0 ? (summary.balance / summary.totalIncome) * 100 : 0;
  insights.push({
    key: "analytics.savingsRate",
    value: `${savingsRate.toFixed(0)}%`,
    severity: savingsRate < 0 ? "critical" : savingsRate < 10 ? "warning" : "info",
  });

  if (budget && summary.totalBudget > 0 && summary.totalExpenses > summary.totalBudget) {
    insights.push({
      key: "analytics.overBudget",
      value: formatCurrency(summary.totalExpenses - summary.totalBudget),
      severity: "critical",
    });
  }

  const { day } = getYangonDate();
  const avgDaily = day > 0 ? summary.totalExpenses / day : 0;
  insights.push({
    key: "analytics.avgDailySpend",
    value: formatCurrency(avgDaily),
    severity: "info",
  });

  return insights;
}
