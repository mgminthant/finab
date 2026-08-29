import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { getTransactions } from "@/lib/transactions";
import { formatCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/date";
import { getDictionary, getT } from "@/lib/i18n";
import { Card } from "@/components/ui/Card";

export default async function RecentTransactions() {
  const user = await currentUser();
  if (!user) return null;

  const [transactions, dict] = await Promise.all([
    getTransactions(user.id, undefined, { by: "date", dir: "desc" }, 5),
    getDictionary(),
  ]);
  const t = getT(dict);

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">{t("dashboard.recentTransactions")}</h2>
        <Link href="/transactions" className="text-sm text-primary hover:underline">
          {t("common.viewAll")}
        </Link>
      </div>

      {transactions.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("transactions.empty")}</p>
      ) : (
        <ul className="divide-y divide-border">
          {transactions.map((tr) => (
            <li key={tr.id} className="flex justify-between items-center py-2">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {tr.title || tr.note || "No title"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {tr.categoryName} · {formatDate(tr.date)}
                </p>
              </div>
              <p
                className={`text-sm font-bold ${
                  tr.type === "INCOME" ? "text-success" : "text-destructive"
                }`}
              >
                {formatCurrency(tr.amount)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
