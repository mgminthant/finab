import { currentUser } from "@/lib/auth";
import { getSpendingByCategory } from "@/lib/summary";
import { getCategories } from "@/lib/category";
import { formatCurrency } from "@/utils/currency";
import { getDictionary, getT } from "@/lib/i18n";
import { Card } from "@/components/ui/Card";
import CategoryDot from "@/features/categories/components/CategoryDot";

export default async function SpendingByCategory() {
  const user = await currentUser();
  if (!user) return null;

  const [data, categories, dict] = await Promise.all([
    getSpendingByCategory(user.id),
    getCategories(user.id),
    getDictionary(),
  ]);
  const t = getT(dict);
  const catMap = Object.fromEntries(categories.map((c) => [c.id, c]));

  return (
    <Card>
      <h2 className="text-lg font-semibold mb-3">
        {t("dashboard.spendingByCategory")}
      </h2>
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t("dashboard.noSpending")}
        </p>
      ) : (
        <ul className="space-y-3">
          {data.map((c) => (
            <li key={c.categoryId}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground">
                  <CategoryDot
                    color={catMap[c.categoryId]?.color ?? null}
                    icon={catMap[c.categoryId]?.icon ?? null}
                    name={c.name}
                  />
                </span>
                <span className="text-muted-foreground">
                  {formatCurrency(c.total)} · {c.percentage.toFixed(0)}%
                </span>
              </div>
              <div className="h-2 w-full rounded bg-muted overflow-hidden">
                <div
                  className="h-full rounded bg-primary"
                  style={{ width: `${Math.min(100, c.percentage)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
