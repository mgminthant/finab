"use client";
import { useT } from "./I18nProvider";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";
import UserMenu from "./UserMenu";
import type { UserMenuUser } from "./UserMenu";
import NotificationBell from "./NotificationBell";

export default function AppHeader({
  user,
}: {
  user: UserMenuUser | null;
}) {
  const t = useT();
  return (
    <header className="flex items-center justify-between gap-2 border-b border-border bg-card px-4 py-3">
      <span className="text-lg font-bold text-foreground">{t("app.name")}</span>
      <div className="flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeToggle />
        <NotificationBell userId={user?.id ?? null} />
        <UserMenu user={user} />
      </div>
    </header>
  );
}
