"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
  createCategoryAction,
  updateCategoryAction,
} from "@/lib/category";
import type { CategoryOption } from "@/types/category";
import Spinner from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { useT } from "@/components/shared/I18nProvider";

const ICON_OPTIONS = [
  "",
  "🍔",
  "🚌",
  "🛍️",
  "🧾",
  "📚",
  "🎮",
  "💊",
  "✈️",
  "💰",
  "💼",
  "🎁",
  "🏠",
  "⚡",
  "📈",
  "📉",
  "💡",
  "☕",
  "🚗",
  "🏥",
  "🎓",
  "🛒",
  "💳",
  "🔧",
  "🌟",
  "🍽️",
  "🏀",
  "🎵",
  "📱",
  "🐱",
];

const COLOR_PRESETS = [
  "#0d9488",
  "#ef4444",
  "#f59e0b",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#10b981",
  "#6b7280",
];

export default function CategoryDialog({
  open,
  onOpenChange,
  category,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: CategoryOption | null;
}) {
  const t = useT();
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const editing = category ?? null;
  const formKey = editing?.id ?? "create";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    const action = editing
      ? updateCategoryAction(formData)
      : createCategoryAction(formData);
    action
      .then((res) => {
        if (res && "error" in res) {
          setError(t(res.error));
          setPending(false);
        } else {
          setPending(false);
          onOpenChange(false);
        }
      })
      .catch(() => {
        setPending(false);
        setError(t("category.error"));
      });
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/60 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[101] max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-md bg-card p-[25px] shadow-lg focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title className="m-0 text-[17px] font-medium text-card-foreground">
            {editing ? t("category.edit") : t("category.add")}
          </Dialog.Title>
          <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-muted-foreground">
            {t("category.formHint")}
          </Dialog.Description>

          <form key={formKey} onSubmit={handleSubmit}>
            {editing ? (
              <input type="hidden" name="id" value={editing.id} />
            ) : null}
            <fieldset className="mb-[15px] flex items-center gap-5">
              <label
                className="w-[90px] text-right text-[15px] text-foreground"
                htmlFor="category_name"
              >
                {t("category.name")}
              </label>
              <input
                required
                name="name"
                id="category_name"
                defaultValue={editing?.name ?? ""}
                maxLength={40}
                className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-foreground bg-background shadow-[0_0_0_1px] shadow-border outline-none focus:shadow-[0_0_0_2px] focus:shadow-foreground"
              />
            </fieldset>

            <fieldset className="mb-[15px] flex items-center gap-5">
              <label
                className="w-[90px] text-right text-[15px] text-foreground"
                htmlFor="category_type"
              >
                {t("category.type")}
              </label>
              <select
                name="type"
                id="category_type"
                defaultValue={editing?.type ?? "EXPENSE"}
                className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-foreground bg-background shadow-[0_0_0_1px] shadow-border outline-none focus:shadow-[0_0_0_2px] focus:shadow-foreground"
              >
                <option value="EXPENSE">{t("category.expense")}</option>
                <option value="INCOME">{t("category.income")}</option>
              </select>
            </fieldset>

            <fieldset className="mb-[15px] flex items-center gap-5">
              <label
                className="w-[90px] text-right text-[15px] text-foreground"
                htmlFor="category_icon"
              >
                {t("category.icon")}
              </label>
              <select
                name="icon"
                id="category_icon"
                defaultValue={editing?.icon ?? ""}
                className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-foreground bg-background shadow-[0_0_0_1px] shadow-border outline-none focus:shadow-[0_0_0_2px] focus:shadow-foreground"
              >
                <option value="">—</option>
                {ICON_OPTIONS.filter(Boolean).map((ic) => (
                  <option key={ic} value={ic}>
                    {ic}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className="mb-[15px] flex items-center gap-5">
              <label
                className="w-[90px] text-right text-[15px] text-foreground"
                htmlFor="category_color"
              >
                {t("category.color")}
              </label>
              <div className="flex flex-1 flex-wrap items-center gap-2">
                <input
                  type="color"
                  name="color"
                  id="category_color"
                  defaultValue={editing?.color ?? COLOR_PRESETS[0]}
                  className="h-[35px] w-[45px] rounded bg-background shadow-[0_0_0_1px] shadow-border outline-none"
                />
                {COLOR_PRESETS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={c}
                    onClick={(e) => {
                      const input = (
                        e.currentTarget.parentElement?.querySelector(
                          "#category_color"
                        ) as HTMLInputElement | null
                      );
                      if (input) input.value = c;
                    }}
                    className="h-6 w-6 rounded-full border border-border"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </fieldset>

            {error ? (
              <p className="mb-3 text-sm text-destructive">{error}</p>
            ) : null}

            <div className="mt-[25px] flex justify-end gap-2">
              <Dialog.Close asChild>
                <button className="inline-flex h-[35px] items-center justify-center rounded bg-muted px-[15px] font-medium leading-none text-foreground outline-none hover:bg-muted-foreground/30 focus-visible:outline-2 focus-visible:outline-foreground">
                  {t("common.cancel")}
                </button>
              </Dialog.Close>
              <Button type="submit" disabled={pending}>
                {pending && <Spinner />}
                {t("common.save")}
              </Button>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-foreground bg-muted hover:bg-muted-foreground/30 focus:shadow-[0_0_0_2px] focus:shadow-border focus:outline-none"
                aria-label="Close"
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
