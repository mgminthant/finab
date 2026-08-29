import { currentUser } from "@/lib/auth";
import {
  getTransactions,
  type TransactionFilters,
  type TransactionSort,
} from "@/lib/transactions";
import { getCategories } from "@/lib/category";
import { getDictionary, getT } from "@/lib/i18n";
import React from "react";
import CostList from "./CostList";
import TransactionFiltersBar from "./TransactionFilters";

type SearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CostListContainer({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await currentUser();
  const dict = await getDictionary();
  const t = getT(dict);

  if (!user) {
    return (
      <h2 className="text-center text-2xl font-semibold mt-4">
        {t("common.signInToView")}
      </h2>
    );
  }

  const filters: TransactionFilters = {
    q: first(searchParams.q),
    type: (first(searchParams.type) as TransactionFilters["type"]) || undefined,
    categoryId: first(searchParams.categoryId),
    dateFrom: first(searchParams.dateFrom),
    dateTo: first(searchParams.dateTo),
  };

  const sort: TransactionSort = {
    by: (first(searchParams.sortBy) as TransactionSort["by"]) || "date",
    dir: (first(searchParams.sortDir) as TransactionSort["dir"]) || "desc",
  };

  const [transactions, categories] = await Promise.all([
    getTransactions(user.id, filters, sort),
    getCategories(user.id),
  ]);

  if (transactions.length === 0) {
    const hasFilters = Object.values(filters).some(Boolean);
    return (
      <>
        <TransactionFiltersBar categories={categories} />
        <h2 className="text-center text-2xl font-semibold mt-4">
          {hasFilters ? t("transactions.noMatch") : t("transactions.empty")}
        </h2>
      </>
    );
  }

  return (
    <>
      <TransactionFiltersBar categories={categories} />
      <CostList transactions={transactions} categories={categories} />
    </>
  );
}
