"use client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { SunIcon, MoonIcon, DesktopIcon } from "@radix-ui/react-icons";
import { useTheme } from "@/components/ThemeProvider";
import { useT } from "./I18nProvider";

const OPTIONS = [
  { value: "light", labelKey: "theme.light", Icon: SunIcon },
  { value: "dark", labelKey: "theme.dark", Icon: MoonIcon },
  { value: "system", labelKey: "theme.system", Icon: DesktopIcon },
] as const;

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useT();
  const current = OPTIONS.find((o) => o.value === theme) ?? OPTIONS[2];
  const CurrentIcon = current.Icon;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={t("header.theme")}
          className="inline-flex h-[35px] items-center gap-1 rounded border border-border px-[10px] text-sm text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary"
        >
          <CurrentIcon className="h-4 w-4" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-[110] min-w-[160px] rounded-md border border-border bg-card p-1 text-foreground shadow-lg"
        >
          {OPTIONS.map((o) => {
            const Icon = o.Icon;
            return (
              <DropdownMenu.Item
                key={o.value}
                onSelect={() => setTheme(o.value)}
                className="flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-muted"
              >
                <Icon className="h-4 w-4" />
                <span>{t(o.labelKey)}</span>
              </DropdownMenu.Item>
            );
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
