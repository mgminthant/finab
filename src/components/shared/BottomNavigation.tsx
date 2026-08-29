"use client";
import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, FileTextIcon, GearIcon, BarChartIcon, BookmarkIcon } from "@radix-ui/react-icons";
import { useT } from "./I18nProvider";
import TransactionInput from "@/features/transactions/components/TransactionInput";
import type { CategoryOption } from "@/types/category";

const LINKS = [
  { href: "/dashboard", key: "nav.dashboard", Icon: HomeIcon },
  { href: "/transactions", key: "nav.transactions", Icon: FileTextIcon },
  { href: "/budgets", key: "nav.budgets", Icon: GearIcon },
  { href: "/categories", key: "nav.categories", Icon: BookmarkIcon },
  { href: "/analytics", key: "nav.analytics", Icon: BarChartIcon },
];

export default function BottomNavigation({
  categories,
}: {
  categories: CategoryOption[];
}) {
  const pathname = usePathname();
  const t = useT();

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 md:hidden">
      <div className="relative flex h-16 items-stretch border-t border-border bg-card pb-[env(safe-area-inset-bottom)]">
        {LINKS.slice(0, 2).map(({ href, key, Icon }) => (
          <NavItem key={href} href={href} label={t(key)} Icon={Icon} active={isActive(href)} />
        ))}

        <div className="relative flex flex-1 items-center justify-center">
          <div className="absolute -top-7">
            <TransactionInput categories={categories} fab />
          </div>
        </div>

        {LINKS.slice(2).map(({ href, key, Icon }) => (
          <NavItem key={href} href={href} label={t(key)} Icon={Icon} active={isActive(href)} />
        ))}
      </div>
    </nav>
  );
}

function NavItem({
  href,
  label,
  Icon,
  active,
}: {
  href: string;
  label: string;
  Icon: ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={`flex flex-1 items-center justify-center font-medium ${
        active ? "text-primary" : "text-muted-foreground"
      }`}
    >
      <Icon className="h-6 w-6" />
    </Link>
  );
}
