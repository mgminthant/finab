"use client";
import Link from "next/link";
import TransactionInput from "@/features/transactions/components/TransactionInput";
import type { CategoryOption } from "@/types/category";
import { useT } from "@/components/shared/I18nProvider";
import { Card } from "@/components/ui/Card";

export default function QuickActions({
  categories,
}: {
  categories: CategoryOption[];
}) {
  const t = useT();
  return (
    <Card>
      <h2 className="text-lg font-semibold mb-3">{t("dashboard.quickActions")}</h2>
      <div className="flex flex-wrap items-center gap-4">
        <TransactionInput categories={categories} variant="link" />
        <Link
          href="/budgets"
          className="inline-flex h-[35px] items-center justify-center font-medium text-primary underline-offset-4 hover:underline"
        >
          {t("actions.setBudget")}
        </Link>
      </div>
    </Card>
  );
}
