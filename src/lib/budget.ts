"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { getYangonDate } from "@/lib/yangon";

const budgetInputSchema = z.object({
  budget: z.coerce.number("Budget must be a number").positive().finite(),
});

export type BudgetSummary = {
  totalBudget: number;
  totalSpent: number;
  totalSpentToday: number;
  dailyBudget: number;
  remainingBudgetToday: number;
};

export async function getBudgets(
  userId: string
): Promise<BudgetSummary | null> {
  const { year, month, day } = getYangonDate();

  const [budget, spentThisMonth, spentToday] = await Promise.all([
    prisma.budget.findFirst({
      where: { userId, month, year, categoryId: null },
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
    prisma.transaction.aggregate({
      where: {
        userId,
        type: "EXPENSE",
        date: {
          gte: new Date(Date.UTC(year, month - 1, day)),
          lt: new Date(Date.UTC(year, month - 1, day + 1)),
        },
      },
      _sum: { amount: true },
    }),
  ]);

  if (!budget) return null;

  const totalBudget = budget.amount.toNumber();
  const totalSpent = spentThisMonth._sum.amount?.toNumber() ?? 0;
  const totalSpentToday = spentToday._sum.amount?.toNumber() ?? 0;

  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const remainingDays = daysInMonth - day + 1;
  const dailyBudget =
    remainingDays > 0 ? (totalBudget - totalSpent) / remainingDays : 0;
  const remainingBudgetToday = dailyBudget - totalSpentToday;

  return {
    totalBudget,
    totalSpent,
    totalSpentToday,
    dailyBudget,
    remainingBudgetToday,
  };
}

export type BudgetActionResult = { ok: true } | { ok: false; error: string };

export async function createBudgetAction(
  formData: FormData
): Promise<BudgetActionResult> {
  const user = await currentUser();
  if (!user) {
    return { ok: false, error: "common.unauthorized" };
  }

  const parsed = budgetInputSchema.safeParse({
    budget: formData.get("budget"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }
  const { year, month } = getYangonDate();
  const { budget } = parsed.data;

  const existing = await prisma.budget.findFirst({
    where: { userId: user.id, month, year, categoryId: null },
  });

  if (existing) {
    await prisma.budget.update({
      where: { id: existing.id },
      data: { amount: budget },
    });
  } else {
    await prisma.budget.create({
      data: {
        userId: user.id,
        month,
        year,
        amount: budget,
        categoryId: null,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/budgets");
  return { ok: true };
}

export async function deleteBudgetAction(): Promise<BudgetActionResult> {
  const user = await currentUser();
  if (!user) {
    return { ok: false, error: "common.unauthorized" };
  }

  const { year, month } = getYangonDate();
  await prisma.budget.deleteMany({
    where: { userId: user.id, year, month, categoryId: null },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/budgets");
  return { ok: true };
}

const categoryBudgetSchema = z.object({
  categoryId: z.string().trim().min(1, "Category is required"),
  budget: z.coerce.number("Budget must be a number").positive().finite(),
});

export type CategoryBudgetStatus =
  | "SAFE"
  | "WARNING"
  | "CRITICAL"
  | "EXCEEDED";

function getCategoryBudgetStatus(percent: number): CategoryBudgetStatus {
  if (percent > 100) return "EXCEEDED";
  if (percent >= 90) return "CRITICAL";
  if (percent >= 75) return "WARNING";
  return "SAFE";
}

export type CategoryBudget = {
  categoryId: string;
  name: string;
  budgetAmount: number;
  spent: number;
  remaining: number;
  percent: number;
  status: CategoryBudgetStatus;
};

export async function getCategoryBudgets(
  userId: string
): Promise<CategoryBudget[]> {
  const { year, month } = getYangonDate();

  const [budgets, spentRows] = await Promise.all([
    prisma.budget.findMany({
      where: { userId, year, month, categoryId: { not: null } },
      include: { category: { select: { id: true, name: true } } },
    }),
    prisma.transaction.groupBy({
      by: ["categoryId"],
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

  const spentMap = new Map(
    spentRows.map((r) => [r.categoryId, r._sum.amount?.toNumber() ?? 0])
  );

  return budgets.map((b) => {
    const budgetAmount = b.amount.toNumber();
    const spent = spentMap.get(b.categoryId ?? "") ?? 0;
    const remaining = budgetAmount - spent;
    const percent = budgetAmount > 0 ? (spent / budgetAmount) * 100 : 0;
    return {
      categoryId: b.categoryId ?? "",
      name: b.category?.name ?? "Unknown",
      budgetAmount,
      spent,
      remaining,
      percent,
      status: getCategoryBudgetStatus(percent),
    };
  });
}

export async function setCategoryBudgetAction(
  formData: FormData
): Promise<BudgetActionResult> {
  const user = await currentUser();
  if (!user) {
    return { ok: false, error: "common.unauthorized" };
  }

  const parsed = categoryBudgetSchema.safeParse({
    categoryId: formData.get("categoryId"),
    budget: formData.get("budget"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }
  const { categoryId, budget } = parsed.data;

  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId: user.id, type: "EXPENSE" },
  });
  if (!category) {
    return { ok: false, error: "budget.invalidCategory" };
  }

  const { year, month } = getYangonDate();
  const existing = await prisma.budget.findFirst({
    where: { userId: user.id, year, month, categoryId },
  });

  if (existing) {
    await prisma.budget.update({
      where: { id: existing.id },
      data: { amount: budget },
    });
  } else {
    await prisma.budget.create({
      data: {
        userId: user.id,
        year,
        month,
        amount: budget,
        categoryId,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/dashboard");
  return { ok: true };
}
