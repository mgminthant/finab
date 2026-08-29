"use server";

import { prisma } from "@/lib/prisma";
import { getYangonDate } from "@/lib/yangon";

export type FinancialSummary = {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  totalBudget: number;
  remainingBudget: number;
};

export async function getFinancialSummary(
  userId: string
): Promise<FinancialSummary> {
  const { year, month } = getYangonDate();

  const [incomeAgg, expenseAgg, budget] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        userId,
        type: "INCOME",
        date: {
          gte: new Date(Date.UTC(year, month - 1, 1)),
          lt: new Date(Date.UTC(year, month, 1)),
        },
      },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: {
        userId,
        type: "EXPENSE",
        date: {
          gte: new Date(Date.UTC(year, month - 1, 1)),
          lt: new Date(Date.UTC(year, month, 1)),
        },
      },
      _sum: { amount: true },
    }),
    prisma.budget.findFirst({
      where: { userId, month, year, categoryId: null },
    }),
  ]);

  const totalIncome = incomeAgg._sum.amount?.toNumber() ?? 0;
  const totalExpenses = expenseAgg._sum.amount?.toNumber() ?? 0;
  const totalBudget = budget?.amount.toNumber() ?? 0;

  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
    totalBudget,
    remainingBudget: totalBudget - totalExpenses,
  };
}

export type MonthlySummary = {
  income: number;
  expenses: number;
  balance: number;
  savingsRate: number;
};

export async function getMonthlySummary(
  userId: string,
  year: number = getYangonDate().year,
  month: number = getYangonDate().month
): Promise<MonthlySummary> {
  const [incomeAgg, expenseAgg] = await Promise.all([
    prisma.transaction.aggregate({
      where: {
        userId,
        type: "INCOME",
        date: {
          gte: new Date(Date.UTC(year, month - 1, 1)),
          lt: new Date(Date.UTC(year, month, 1)),
        },
      },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: {
        userId,
        type: "EXPENSE",
        date: {
          gte: new Date(Date.UTC(year, month - 1, 1)),
          lt: new Date(Date.UTC(year, month, 1)),
        },
      },
      _sum: { amount: true },
    }),
  ]);

  const income = incomeAgg._sum.amount?.toNumber() ?? 0;
  const expenses = expenseAgg._sum.amount?.toNumber() ?? 0;
  const balance = income - expenses;
  const savingsRate = income > 0 ? balance / income : 0;

  return { income, expenses, balance, savingsRate };
}

export type CategorySpending = {
  categoryId: string;
  name: string;
  total: number;
  percentage: number;
};

export async function getSpendingByCategory(
  userId: string,
  year: number = getYangonDate().year,
  month: number = getYangonDate().month
): Promise<CategorySpending[]> {
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));

  const rows = await prisma.transaction.groupBy({
    by: ["categoryId"],
    where: { userId, type: "EXPENSE", date: { gte: start, lt: end } },
    _sum: { amount: true },
  });

  const categoryIds = rows.map((r) => r.categoryId);
  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds } },
    select: { id: true, name: true },
  });
  const nameMap = new Map(categories.map((c) => [c.id, c.name]));

  const total = rows.reduce(
    (sum, r) => sum + (r._sum.amount?.toNumber() ?? 0),
    0
  );

  return rows
    .map((r) => {
      const value = r._sum.amount?.toNumber() ?? 0;
      return {
        categoryId: r.categoryId,
        name: nameMap.get(r.categoryId) ?? "Unknown",
        total: value,
        percentage: total > 0 ? (value / total) * 100 : 0,
      };
    })
    .sort((a, b) => b.total - a.total);
}
