"use client";
import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronDownIcon, Cross2Icon } from "@radix-ui/react-icons";
import type { CategoryOption } from "@/types/category";
import Spinner from "@/components/ui/Spinner";
import { useT } from "@/components/shared/I18nProvider";

function FilterIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2.5 3.5h10L9 8v4l-3 1.5V8L2.5 3.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function TransactionFilters({
  categories,
}: {
  categories: CategoryOption[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = React.useTransition();
  const [open, setOpen] = React.useState(false);
  const t = useT();

  const q = searchParams.get("q") ?? "";
  const type = searchParams.get("type") ?? "";
  const categoryId = searchParams.get("categoryId") ?? "";
  const dateFrom = searchParams.get("dateFrom") ?? "";
  const dateTo = searchParams.get("dateTo") ?? "";
  const sortBy = searchParams.get("sortBy") ?? "date";
  const sortDir = searchParams.get("sortDir") ?? "desc";

  const hasActiveFilters = Boolean(
    q || type || categoryId || dateFrom || dateTo
  );

  const updateParams = React.useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [router, pathname, searchParams, startTransition]
  );

  const [search, setSearch] = React.useState(q);
  React.useEffect(() => {
    setSearch(q);
  }, [q]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (search !== q) {
        updateParams({ q: search.trim() || null });
      }
    }, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const reset = () => {
    setSearch("");
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  const selectClass =
    "inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-3 text-[15px] leading-none text-foreground shadow-[0_0_0_1px] shadow-border outline-none focus:shadow-[0_0_0_2px] focus:shadow-foreground bg-card dark:color-scheme-dark";
  const labelClass = "text-[13px] text-muted-foreground";

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="transaction-filters-panel"
        className="inline-flex h-[35px] items-center gap-2 rounded bg-muted px-[15px] font-medium leading-none text-foreground outline-none outline-offset-1 hover:bg-muted-foreground/30 focus-visible:outline-2 focus-visible:outline-foreground"
      >
        <FilterIcon />
        {t("common.filter")}
        {hasActiveFilters && (
          <span
            className="inline-block h-2 w-2 rounded-full bg-primary"
            aria-label={t("common.filter")}
          />
        )}
        <ChevronDownIcon
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          id="transaction-filters-panel"
          className="mt-2 rounded-lg border border-border bg-card p-4 shadow-md"
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              {t("common.filter")}
            </h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("common.cancel")}
              className="inline-flex size-[25px] items-center justify-center rounded-full text-foreground bg-muted hover:bg-muted-foreground/30 focus:shadow-[0_0_0_2px] focus:shadow-border focus:outline-none"
            >
              <Cross2Icon />
            </button>
          </div>

          <fieldset
            disabled={isPending}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-end"
          >
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="q">
                {t("common.search")}
              </label>
              <input
                id="q"
                value={search}
                disabled={isPending}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("common.title")}
                className="inline-flex h-[35px] w-full items-center justify-center rounded px-3 text-[15px] leading-none text-foreground shadow-[0_0_0_1px] shadow-border outline-none focus:shadow-[0_0_0_2px] focus:shadow-foreground bg-card dark:color-scheme-dark disabled:opacity-60"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="type">
                {t("common.type")}
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => updateParams({ type: e.target.value || null })}
                className={selectClass}
              >
                <option value="">{t("common.all")}</option>
                <option value="EXPENSE">{t("common.expense")}</option>
                <option value="INCOME">{t("common.income")}</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="categoryId">
                {t("common.category")}
              </label>
              <select
                id="categoryId"
                value={categoryId}
                onChange={(e) =>
                  updateParams({ categoryId: e.target.value || null })
                }
                className={selectClass}
              >
                <option value="">{t("common.all")}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="dateFrom">
                {t("common.from")}
              </label>
              <input
                id="dateFrom"
                type="date"
                value={dateFrom}
                onChange={(e) =>
                  updateParams({ dateFrom: e.target.value || null })
                }
                className={selectClass}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="dateTo">
                {t("common.to")}
              </label>
              <input
                id="dateTo"
                type="date"
                value={dateTo}
                onChange={(e) => updateParams({ dateTo: e.target.value || null })}
                className={selectClass}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="sortBy">
                {t("common.sort")}
              </label>
              <div className="flex gap-2">
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => updateParams({ sortBy: e.target.value })}
                  className={selectClass}
                >
                  <option value="date">{t("common.date")}</option>
                  <option value="amount">{t("common.amount")}</option>
                  <option value="title">{t("common.title")}</option>
                </select>
                <select
                  aria-label="Sort direction"
                  value={sortDir}
                  onChange={(e) => updateParams({ sortDir: e.target.value })}
                  className={selectClass}
                >
                  <option value="desc">Desc</option>
                  <option value="asc">Asc</option>
                </select>
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={reset}
                disabled={isPending}
                className="inline-flex h-[35px] items-center justify-center gap-2 rounded bg-muted px-[15px] font-medium leading-none text-foreground hover:bg-muted-foreground/30 disabled:opacity-60"
              >
                {isPending && <Spinner />}
                {t("common.clear")}
              </button>
            </div>
          </fieldset>
        </div>
      )}
    </div>
  );
}
