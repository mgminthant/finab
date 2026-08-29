"use client";

import * as React from "react";
import { deleteBudgetAction } from "@/lib/budget";
import { useT } from "@/components/shared/I18nProvider";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function DeleteBudgetButton() {
  const [pending, setPending] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const t = useT();

  const handleConfirm = () => {
    setPending(true);
    deleteBudgetAction().finally(() => {
      setPending(false);
      setOpen(false);
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex h-[35px] items-center justify-center rounded bg-destructive px-[15px] font-medium leading-none text-destructive-foreground outline-none outline-offset-1 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-destructive select-none"
      >
        {t("common.delete")}
      </button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={t("budget.deleteTitle")}
        description={t("budget.deleteDescription")}
        confirmLabel={t("common.delete")}
        onConfirm={handleConfirm}
        pending={pending}
      />
    </>
  );
}
