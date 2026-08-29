import { currentUser } from "@/lib/auth";
import { getBudgets, type CategoryBudgetStatus } from "@/lib/budget";
import { formatCurrency } from "@/utils/currency";
import { getDictionary, getT } from "@/lib/i18n";
import { Card } from "@/components/ui/Card";
import DeleteBudgetButton from "./DeleteBudgetButton";

function getBudgetStatus(percent: number): CategoryBudgetStatus {
  if (percent > 100) return "EXCEEDED";
  if (percent >= 90) return "CRITICAL";
  if (percent >= 75) return "WARNING";
  return "SAFE";
}

const statusStyles: Record<CategoryBudgetStatus, string> = {
  SAFE: "bg-success/15 text-success",
  WARNING: "bg-warning/15 text-warning",
  CRITICAL: "bg-warning/25 text-warning",
  EXCEEDED: "bg-destructive/15 text-destructive",
};

const progressColor: Record<CategoryBudgetStatus, string> = {
  SAFE: "bg-success",
  WARNING: "bg-warning",
  CRITICAL: "bg-warning",
  EXCEEDED: "bg-destructive",
};

export default async function BudgetOverview() {
  const user = await currentUser();
  if (!user) return null;

  const budgets = await getBudgets(user.id);
  const dict = await getDictionary();
  const t = getT(dict);

  if (!budgets || budgets.totalBudget === 0) {
    return (
      <Card>
        <h2 className="text-lg font-semibold mb-3">{t("budget.monthly")}</h2>
        <p className="text-sm text-muted-foreground">{t("budget.noBudget")}</p>
      </Card>
    );
  }

  const percent =
    budgets.totalBudget > 0
      ? (budgets.totalSpent / budgets.totalBudget) * 100
      : 0;
  const status = getBudgetStatus(percent);
  const over = status === "EXCEEDED";

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">{t("budget.monthly")}</h2>
        <span
          className={`rounded px-2 py-0.5 text-xs font-semibold ${statusStyles[status]}`}
        >
          {t(`budget.${status.toLowerCase()}`)}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-sm text-muted-foreground">{t("budget.total")}</p>
          <p className="mt-1 text-lg font-bold">
            {formatCurrency(budgets.totalBudget)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{t("budget.spent")}</p>
          <p className="mt-1 text-lg font-bold text-destructive">
            {formatCurrency(budgets.totalSpent)}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{t("budget.remaining")}</p>
          <p
            className={`mt-1 text-lg font-bold ${
              over ? "text-destructive" : "text-success"
            }`}
          >
            {formatCurrency(budgets.totalBudget - budgets.totalSpent)}
          </p>
        </div>
      </div>

      <div className="mt-4 h-2 w-full rounded bg-muted overflow-hidden">
        <div
          className={`h-full rounded ${progressColor[status]}`}
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {t("budget.todayRemaining")}:{" "}
          <span className="text-foreground font-medium">
            {formatCurrency(budgets.remainingBudgetToday)}
          </span>
        </p>
        <DeleteBudgetButton />
      </div>
    </Card>
  );
}
