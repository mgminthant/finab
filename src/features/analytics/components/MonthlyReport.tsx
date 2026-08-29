import { currentUser } from "@/lib/auth";
import { getMonthlySummary, getFinancialSummary } from "@/lib/summary";
import { formatCurrency } from "@/utils/currency";
import { getDictionary, getT } from "@/lib/i18n";
import { Card } from "@/components/ui/Card";

export default async function MonthlyReport() {
  const user = await currentUser();
  if (!user) return null;

  const [monthly, summary, dict] = await Promise.all([
    getMonthlySummary(user.id),
    getFinancialSummary(user.id),
    getDictionary(),
  ]);
  const t = getT(dict);

  const stats = [
    { label: t("dashboard.income"), value: formatCurrency(monthly.income), tone: "text-success" },
    { label: t("dashboard.expenses"), value: formatCurrency(monthly.expenses), tone: "text-destructive" },
    { label: t("dashboard.balance"), value: formatCurrency(monthly.balance), tone: "text-foreground" },
    { label: t("dashboard.savingsRate"), value: `${(monthly.savingsRate * 100).toFixed(0)}%`, tone: "text-foreground" },
  ];

  return (
    <Card>
      <h2 className="mb-3 text-lg font-semibold">{t("analytics.monthlyReport")}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-sm text-muted-foreground">{s.label}</p>
            <p className={`mt-1 text-lg font-bold ${s.tone}`}>{s.value}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        {t("budget.total")}: {formatCurrency(summary.totalBudget)} ·{" "}
        {t("budget.remaining")}: {formatCurrency(summary.remainingBudget)}
      </p>
    </Card>
  );
}
