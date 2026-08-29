import { currentUser } from "@/lib/auth";
import { getInsights } from "@/lib/analytics";
import { getDictionary, getT } from "@/lib/i18n";
import { Card } from "@/components/ui/Card";

const severityStyles: Record<string, string> = {
  info: "bg-muted text-foreground",
  warning: "bg-warning/15 text-warning",
  critical: "bg-destructive/15 text-destructive",
};

export default async function Insights() {
  const user = await currentUser();
  if (!user) return null;

  const [insights, dict] = await Promise.all([
    getInsights(user.id),
    getDictionary(),
  ]);
  const t = getT(dict);

  if (insights.length === 0) {
    return (
      <Card>
        <h2 className="mb-3 text-lg font-semibold">{t("analytics.insights")}</h2>
        <p className="text-sm text-muted-foreground">{t("analytics.noData")}</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="mb-3 text-lg font-semibold">{t("analytics.insights")}</h2>
      <ul className="space-y-3">
        {insights.map((insight) => (
          <li key={insight.key} className="flex items-center justify-between gap-3">
            <span className="text-sm text-muted-foreground">{t(insight.key)}</span>
            <span
              className={`rounded px-2 py-0.5 text-xs font-semibold ${
                severityStyles[insight.severity] ?? severityStyles.info
              }`}
            >
              {insight.value}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
