import { currentUser } from "@/lib/auth";
import { getCategories } from "@/lib/category";
import { prisma } from "@/lib/prisma";
import { getDictionary, getT } from "@/lib/i18n";
import CategoryManager from "@/features/categories/components/CategoryManager";

export default async function CategoriesPage() {
  const user = await currentUser();
  if (!user) return null;

  const [categories, dict] = await Promise.all([
    getCategories(user.id),
    getDictionary(),
  ]);
  const t = getT(dict);

  const [txCounts, budgetCounts] = await Promise.all([
    prisma.transaction.groupBy({
      by: ["categoryId"],
      where: { userId: user.id },
      _count: { _all: true },
    }),
    prisma.budget.groupBy({
      by: ["categoryId"],
      where: { userId: user.id, categoryId: { not: null } },
      _count: { _all: true },
    }),
  ]);

  const usageIds = Array.from(
    new Set(
      [...txCounts, ...budgetCounts]
        .map((r) => r.categoryId)
        .filter((id): id is string => Boolean(id))
    )
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-4 text-xl font-bold text-foreground">
        {t("category.title")}
      </h1>
      <CategoryManager categories={categories} usageIds={usageIds} />
    </div>
  );
}
