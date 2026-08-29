"use client";
import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { GlobeIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useT } from "./I18nProvider";

export default function LanguageSwitcher() {
  const router = useRouter();
  const t = useT();
  const [current, setCurrent] = React.useState<"en" | "mm">("en");

  React.useEffect(() => {
    const match = document.cookie.match(/(?:^|; )locale=(en|mm)/);
    if (match) setCurrent(match[1] as "en" | "mm");
  }, []);

  const switchTo = (lang: "en" | "mm") => {
    document.cookie = `locale=${lang}; path=/; max-age=31536000`;
    setCurrent(lang);
    router.refresh();
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={t("header.language")}
          className="inline-flex h-[35px] items-center gap-1 rounded border border-border px-[10px] text-sm text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary"
        >
          <GlobeIcon className="h-4 w-4" />
          <span>{current === "en" ? "EN" : "မြန်မာ"}</span>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={6}
          className="z-[110] min-w-[160px] rounded-md border border-border bg-card p-1 text-foreground shadow-lg"
        >
          <DropdownMenu.Item
            onSelect={() => switchTo("en")}
            className="cursor-pointer rounded px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-muted"
          >
            {t("language.en")}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={() => switchTo("mm")}
            className="cursor-pointer rounded px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-muted"
          >
            {t("language.mm")}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
