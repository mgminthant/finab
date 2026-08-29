import { cookies } from "next/headers";
import { currentUser } from "@/lib/auth";
import { getMonthlyTrend } from "@/lib/analytics";
import { getSpendingByCategory } from "@/lib/summary";
import { getDictionary, getT } from "@/lib/i18n";
import { Card } from "@/components/ui/Card";
import IncomeExpenseChart from "@/features/analytics/components/IncomeExpenseChart";
import CategoryDonutChart from "@/features/analytics/components/CategoryDonutChart";
import SpendingTrendChart from "@/features/analytics/components/SpendingTrendChart";
import MonthlyReport from "@/features/analytics/components/MonthlyReport";
import Insights from "@/features/analytics/components/Insights";

export default async function AnalyticsPage() {
  const user = await currentUser();
  if (!user) {
    const dict = await getDictionary();
    return (
      <p className="mt-4 text-center text-muted-foreground">
        {getT(dict)("common.signInToView")}
      </p>
    );
  }

  const locale = (await cookies()).get("locale")?.value === "mm" ? "my" : "en";

  const [trend, spending, dict] = await Promise.all([
    getMonthlyTrend(user.id, 6),
    getSpendingByCategory(user.id),
    getDictionary(),
  ]);
  const t = getT(dict);

  const trendWithLabels = trend.map((p) => ({
    label: new Date(p.year, p.month - 1, 1).toLocaleDateString(locale, {
      month: "short",
    }),
    income: p.income,
    expenses: p.expenses,
  }));

  const donut = spending.map((s) => ({
    name: s.name,
    value: s.total,
    percentage: s.percentage,
  }));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{t("analytics.title")}</h1>

      <MonthlyReport />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-lg font-semibold">
            {t("analytics.incomeVsExpense")}
          </h2>
          <IncomeExpenseChart data={trendWithLabels} />
        </Card>

        <Card>
          <h2 className="mb-3 text-lg font-semibold">
            {t("analytics.categorySpending")}
          </h2>
          <CategoryDonutChart data={donut} />
        </Card>
      </div>

      <Card>
        <h2 className="mb-3 text-lg font-semibold">
          {t("analytics.spendingTrend")}
        </h2>
        <SpendingTrendChart
          data={trendWithLabels.map((p) => ({
            label: p.label,
            expenses: p.expenses,
          }))}
        />
      </Card>

      <Insights />
    </div>
  );
}
