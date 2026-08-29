"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { deleteCategoryAction } from "@/lib/category";
import type { CategoryOption } from "@/types/category";
import Spinner from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { useT } from "@/components/shared/I18nProvider";

export default function DeleteCategoryDialog({
  open,
  onOpenChange,
  category,
  siblings,
  hasUsage,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: CategoryOption | null;
  siblings: CategoryOption[];
  hasUsage: boolean;
}) {
  const t = useT();
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [reassignToId, setReassignToId] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setError(null);
      setPending(false);
      setReassignToId(siblings[0]?.id ?? "");
    }
  }, [open, siblings]);

  if (!category) return null;

  const blockReassign = hasUsage && siblings.length === 0;

  const handleConfirm = () => {
    if (blockReassign) return;
    const formData = new FormData();
    formData.set("id", category.id);
    if (hasUsage) formData.set("reassignToId", reassignToId);
    setPending(true);
    setError(null);
    deleteCategoryAction(formData)
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
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[101] w-[90vw] max-w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-card p-[25px] shadow-lg focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title className="text-[17px] font-medium text-card-foreground">
            {t("category.deleteTitle")}
          </Dialog.Title>
          <Dialog.Description className="mt-2.5 text-[15px] leading-normal text-muted-foreground">
            {hasUsage
              ? t("category.deleteDescription")
              : t("category.deleteDescriptionSimple")}
          </Dialog.Description>

          {hasUsage ? (
            <div className="my-4">
              {blockReassign ? (
                <p className="text-sm text-destructive">
                  {t("category.cannotDeleteNoTarget")}
                </p>
              ) : (
                <label className="flex flex-col gap-2 text-sm text-foreground">
                  {t("category.reassignTo")}
                  <select
                    value={reassignToId}
                    onChange={(e) => setReassignToId(e.target.value)}
                    className="inline-flex h-[35px] w-full items-center justify-center rounded px-2.5 text-[15px] leading-none text-foreground bg-background shadow-[0_0_0_1px] shadow-border outline-none focus:shadow-[0_0_0_2px] focus:shadow-foreground"
                  >
                    {siblings.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </label>
              )}
            </div>
          ) : null}

          {error ? (
            <p className="mb-3 text-sm text-destructive">{error}</p>
          ) : null}

          <div className="mt-5 flex justify-end gap-2">
            <Dialog.Close asChild>
              <button
                className="inline-flex h-[35px] items-center justify-center rounded bg-muted px-[15px] font-medium leading-none text-foreground outline-none hover:bg-muted-foreground/30 focus-visible:outline-2 focus-visible:outline-foreground"
              >
                {t("common.cancel")}
              </button>
            </Dialog.Close>
            <Button
              variant="outline"
              onClick={handleConfirm}
              disabled={pending || blockReassign}
              className="border-destructive text-destructive hover:bg-destructive/10"
            >
              {pending && <Spinner />}
              {t("common.delete")}
            </Button>
          </div>
          <Dialog.Close asChild>
            <button
              className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-foreground bg-muted hover:bg-muted-foreground/30 focus:shadow-[0_0_0_2px] focus:shadow-border focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
