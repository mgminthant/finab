"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useT } from "@/components/shared/I18nProvider";
import Spinner from "@/components/ui/Spinner";

export default function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  pending = false,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel: string;
  onConfirm: () => void;
  pending?: boolean;
}) {
  const t = useT();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/60 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[101] w-[90vw] max-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-card p-[25px] shadow-lg focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title className="text-[17px] font-medium text-card-foreground">
            {title}
          </Dialog.Title>
          {description ? (
            <Dialog.Description className="mt-2.5 text-[15px] leading-normal text-muted-foreground">
              {description}
            </Dialog.Description>
          ) : null}
          <div className="mt-5 flex justify-end gap-2">
            <Dialog.Close asChild>
              <button className="inline-flex h-[35px] items-center justify-center rounded bg-muted px-[15px] font-medium leading-none text-foreground outline-none hover:bg-muted-foreground/30 focus-visible:outline-2 focus-visible:outline-foreground">
                {t("common.cancel")}
              </button>
            </Dialog.Close>
            <button
              onClick={onConfirm}
              disabled={pending}
              className="inline-flex h-[35px] items-center justify-center gap-2 rounded bg-destructive px-[15px] font-medium leading-none text-destructive-foreground outline-none hover:opacity-90 focus-visible:outline-2 focus-visible:outline-destructive disabled:opacity-60"
            >
              {pending && <Spinner />}
              {confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
