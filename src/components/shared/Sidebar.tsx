"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT } from "./I18nProvider";
import TransactionInput from "@/features/transactions/components/TransactionInput";
import type { CategoryOption } from "@/types/category";

const LINKS = [
  { href: "/dashboard", key: "nav.dashboard" },
  { href: "/transactions", key: "nav.transactions" },
  { href: "/budgets", key: "nav.budgets" },
  { href: "/categories", key: "nav.categories" },
  { href: "/analytics", key: "nav.analytics" },
];

export default function Sidebar({
  categories,
}: {
  categories: CategoryOption[];
}) {
  const pathname = usePathname();
  const t = useT();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card p-4 md:flex">
      <span className="px-2 py-2 text-lg font-bold text-foreground">
        {t("app.name")}
      </span>
      <nav className="mt-2 flex flex-col gap-1">
        {LINKS.map((l) => {
          const active =
            l.href === "/"
              ? pathname === "/"
              : pathname === l.href || pathname.startsWith(l.href + "/");
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded px-3 py-2 text-sm font-medium ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted"
              }`}
            >
              {t(l.key)}
            </Link>
          );
        })}
      </nav>
      <div className="mt-3">
        <TransactionInput categories={categories} />
      </div>
    </aside>
  );
}
