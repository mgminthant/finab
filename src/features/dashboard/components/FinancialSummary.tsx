import { currentUser } from "@/lib/auth";
import { getFinancialSummary } from "@/lib/summary";
import { formatCurrency } from "@/utils/currency";
import { getDictionary, getT } from "@/lib/i18n";
import { Card } from "@/components/ui/Card";

type Tone = "positive" | "negative" | "neutral";

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: Tone;
}) {
  const valueColor =
    tone === "positive"
      ? "text-success"
      : tone === "negative"
        ? "text-destructive"
        : "text-foreground";

  return (
    <Card>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${valueColor}`}>
        {formatCurrency(value)}
      </p>
    </Card>
  );
}

export default async function FinancialSummary() {
  const user = await currentUser();
  if (!user) return null;

  const summary = await getFinancialSummary(user.id);
  const dict = await getDictionary();
  const t = getT(dict);

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SummaryCard
        label={t("dashboard.balance")}
        value={summary.balance}
        tone={summary.balance >= 0 ? "positive" : "negative"}
      />
      <SummaryCard
        label={t("dashboard.income")}
        value={summary.totalIncome}
        tone="positive"
      />
      <SummaryCard
        label={t("dashboard.expenses")}
        value={summary.totalExpenses}
        tone="negative"
      />
      <SummaryCard
        label={t("dashboard.remainingBudget")}
        value={summary.remainingBudget}
        tone={summary.remainingBudget >= 0 ? "positive" : "negative"}
      />
    </section>
  );
}
