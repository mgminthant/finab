import { currentUser } from "@/lib/auth";
import {
  getCategoryBudgets,
  type CategoryBudgetStatus,
} from "@/lib/budget";
import { getCategories } from "@/lib/category";
import { formatCurrency } from "@/utils/currency";
import { getDictionary, getT } from "@/lib/i18n";
import { Card } from "@/components/ui/Card";
import CategoryBudgetInput from "./CategoryBudgetInput";
import CategoryDot from "@/features/categories/components/CategoryDot";

const statusStyles: Record<CategoryBudgetStatus, string> = {
  SAFE: "bg-success/15 text-success",
  WARNING: "bg-warning/15 text-warning",
  CRITICAL: "bg-warning/25 text-warning",
  EXCEEDED: "bg-destructive/15 text-destructive",
};

export default async function CategoryBudgets() {
  const user = await currentUser();
  if (!user) return null;

  const [budgets, categories, dict] = await Promise.all([
    getCategoryBudgets(user.id),
    getCategories(user.id),
    getDictionary(),
  ]);
  const t = getT(dict);
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">{t("budget.categoryBudgets")}</h2>
        <CategoryBudgetInput categories={categories} />
      </div>

      {budgets.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("budget.noBudget")}</p>
      ) : (
        <ul className="space-y-4">
          {budgets.map((b) => (
            <li key={b.categoryId}>
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-foreground font-medium">
                  <CategoryDot
                    color={catMap[b.categoryId]?.color ?? null}
                    icon={catMap[b.categoryId]?.icon ?? null}
                    name={b.name}
                  />
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-xs font-semibold ${statusStyles[b.status]}`}
                >
                  {t(`budget.${b.status.toLowerCase()}`)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{formatCurrency(b.spent)} {t("budget.spent").toLowerCase()}</span>
                <span>{formatCurrency(b.budgetAmount)} {t("budget.total").toLowerCase()}</span>
              </div>
              <div className="h-2 w-full rounded bg-muted overflow-hidden">
                <div
                  className={`h-full rounded ${
                    b.status === "EXCEEDED"
                      ? "bg-destructive"
                      : b.status === "SAFE"
                        ? "bg-success"
                        : "bg-warning"
                  }`}
                  style={{ width: `${Math.min(100, b.percent)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
