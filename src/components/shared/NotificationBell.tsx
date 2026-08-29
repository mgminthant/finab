"use client";

import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { BellIcon } from "@radix-ui/react-icons";
import { getNotifications, type AppNotification } from "@/lib/notifications";
import { useT } from "./I18nProvider";

export default function NotificationBell({
  userId,
}: {
  userId: string | null;
}) {
  const [items, setItems] = React.useState<AppNotification[]>([]);
  const [open, setOpen] = React.useState(false);
  const t = useT();

  React.useEffect(() => {
    if (!userId) {
      setItems([]);
      return;
    }
    let active = true;
    getNotifications()
      .then((data) => {
        if (active) setItems(data);
      })
      .catch(() => {
        if (active) setItems([]);
      });
    return () => {
      active = false;
    };
  }, [userId, open]);

  if (!userId) return null;

  const count = items.length;

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={t("notifications.title")}
          className="relative inline-flex h-[35px] w-[35px] items-center justify-center rounded text-foreground outline-none hover:bg-muted focus-visible:outline-2 focus-visible:outline-foreground"
        >
          <BellIcon className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-destructive-foreground">
              {count}
            </span>
          )}
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="z-[101] w-72 rounded-md border border-border bg-card p-2 text-card-foreground shadow-lg focus:outline-none">
          <p className="px-2 py-1 text-sm font-semibold">
            {t("notifications.title")}
          </p>
          {count === 0 ? (
            <p className="px-2 py-3 text-sm text-muted-foreground">
              {t("notifications.empty")}
            </p>
          ) : (
            <ul className="max-h-80 overflow-auto">
              {items.map((n) => (
                <li
                  key={n.id}
                  className="flex items-start justify-between gap-2 rounded px-2 py-2 hover:bg-muted"
                >
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        n.severity === "critical"
                          ? "text-destructive"
                          : "text-warning"
                      }`}
                    >
                      {t(n.titleKey)}
                    </p>
                    {n.name && (
                      <p className="text-xs text-muted-foreground">{n.name}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setItems((s) => s.filter((x) => x.id !== n.id))
                    }
                    aria-label="Dismiss"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
