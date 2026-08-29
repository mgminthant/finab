"use server";

import { currentUser } from "@/lib/auth";
import { getCategoryBudgets } from "@/lib/budget";
import { getFinancialSummary } from "@/lib/summary";

export type AppNotificationSeverity = "info" | "warning" | "critical";

export type AppNotification = {
  id: string;
  severity: AppNotificationSeverity;
  titleKey: string;
  name?: string;
  href?: string;
};

export async function getNotifications(): Promise<AppNotification[]> {
  const user = await currentUser();
  if (!user) return [];
  const [catBudgets, summary] = await Promise.all([
    getCategoryBudgets(user.id),
    getFinancialSummary(user.id),
  ]);

  const out: AppNotification[] = [];

  for (const c of catBudgets) {
    if (c.status === "WARNING") {
      out.push({
        id: `cat-${c.categoryId}-w`,
        severity: "warning",
        titleKey: "notifications.budgetWarning",
        name: c.name,
        href: "/budgets",
      });
    } else if (c.status === "CRITICAL") {
      out.push({
        id: `cat-${c.categoryId}-c`,
        severity: "critical",
        titleKey: "notifications.budgetCritical",
        name: c.name,
        href: "/budgets",
      });
    } else if (c.status === "EXCEEDED") {
      out.push({
        id: `cat-${c.categoryId}-e`,
        severity: "critical",
        titleKey: "notifications.budgetExceeded",
        name: c.name,
        href: "/budgets",
      });
    }
  }

  if (
    summary.totalBudget > 0 &&
    summary.totalExpenses > summary.totalBudget
  ) {
    out.push({
      id: "overall",
      severity: "critical",
      titleKey: "notifications.overallExceeded",
      href: "/budgets",
    });
  }

  return out;
}
