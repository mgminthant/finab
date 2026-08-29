"use client";
import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { updateTransactionAction } from "@/lib/transactions";
import type { Transaction } from "@/types/transactions";
import type { CategoryOption } from "@/types/category";
import ToastDemo from "@/components/shared/ToastComp";
import Spinner from "@/components/ui/Spinner";
import { useT } from "@/components/shared/I18nProvider";

function toDateInputValue(iso: string) {
  return new Date(iso).toLocaleDateString("en-CA");
}

export default function EditTransactionDialog({
  transaction,
  categories,
}: {
  transaction: Transaction;
  categories: CategoryOption[];
}) {
  const [open, setOpen] = React.useState(false);
  const [openToast, setOpenToast] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const t = useT();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    setPending(true);
    updateTransactionAction(transaction.id, formData)
      .then((res) => {
        setPending(false);
        if (!res.ok) {
          setError(t(res.error));
          return;
        }
        setOpen(false);
        setOpenToast(true);
      })
      .catch(() => {
        setPending(false);
        setError(t("common.formError"));
      });
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button className="bg-primary text-primary-foreground rounded-lg px-4 py-1">
            {t("common.edit")}
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/60 data-[state=open]:animate-overlayShow" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[101] max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-card p-[25px] shadow-lg focus:outline-none data-[state=open]:animate-contentShow">
            <Dialog.Title className="m-0 text-[17px] font-medium text-card-foreground">
              {t("transaction.editTitle")}
            </Dialog.Title>
            <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-muted-foreground">
              {t("transaction.saveTransaction")}
            </Dialog.Description>
            <form onSubmit={handleSubmit}>
              <fieldset className="mb-[15px] flex items-center gap-5">
                <label className="w-[90px] text-right text-[15px] text-foreground" htmlFor="title">
                  {t("common.title")}
                </label>
                <input
                  className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-foreground bg-background shadow-[0_0_0_1px] shadow-border outline-none focus:shadow-[0_0_0_2px] focus:shadow-foreground"
                  id="title"
                  name="title"
                  maxLength={200}
                  defaultValue={transaction.title ?? ""}
                />
              </fieldset>
              <fieldset className="mb-[15px] flex items-center gap-5">
                <label className="w-[90px] text-right text-[15px] text-foreground" htmlFor="price">
                  {t("common.amount")}
                </label>
                <input
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-foreground bg-background shadow-[0_0_0_1px] shadow-border outline-none focus:shadow-[0_0_0_2px] focus:shadow-foreground"
                  id="price"
                  name="price"
                  defaultValue={transaction.amount}
                />
              </fieldset>
              <fieldset className="mb-[15px] flex items-center gap-5">
                <label className="w-[90px] text-right text-[15px] text-foreground" htmlFor="description">
                  {t("common.description")}
                </label>
                <textarea
                  className="flex-1 w-full inline-flex resize-none appearance-none items-center justify-center rounded h-[70px] p-2.5 text-[15px] leading-none text-foreground bg-background shadow-[0_0_0_1px] shadow-border outline-none selection:bg-primary/30 selection:text-foreground hover:shadow-[0_0_0_1px] hover:shadow-foreground focus:shadow-[0_0_0_2px] focus:shadow-foreground"
                  id="description"
                  name="description"
                  maxLength={500}
                  defaultValue={transaction.note ?? ""}
                />
              </fieldset>
              <fieldset className="mb-[15px] flex items-center gap-5">
                <label className="w-[90px] text-right text-[15px] text-foreground" htmlFor="category">
                  {t("common.category")}
                </label>
                <select
                  className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-foreground bg-background shadow-[0_0_0_1px] shadow-border outline-none focus:shadow-[0_0_0_2px] focus:shadow-foreground"
                  id="category"
                  name="categoryId"
                  required
                  defaultValue={transaction.categoryId}
                >
                  {categories
                    .filter((c) => c.type === transaction.type)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </fieldset>
              <fieldset className="mb-[15px] flex items-center gap-5">
                <label className="w-[90px] text-right text-[15px] text-foreground" htmlFor="type">
                  {t("common.type")}
                </label>
                <select
                  className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-foreground bg-background shadow-[0_0_0_1px] shadow-border outline-none focus:shadow-[0_0_0_2px] focus:shadow-foreground"
                  id="type"
                  name="type"
                  defaultValue={transaction.type}
                >
                  <option value="EXPENSE">{t("common.expense")}</option>
                  <option value="INCOME">{t("common.income")}</option>
                </select>
              </fieldset>
              <fieldset className="mb-[15px] flex items-center gap-5">
                <label className="w-[90px] text-right text-[15px] text-foreground" htmlFor="date">
                  {t("common.date")}
                </label>
                <input
                  type="date"
                  className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-foreground bg-background shadow-[0_0_0_1px] shadow-border outline-none focus:shadow-[0_0_0_2px] focus:shadow-foreground dark:color-scheme-dark"
                  id="date"
                  name="date"
                  defaultValue={toDateInputValue(transaction.date)}
                />
              </fieldset>
              <fieldset className="mb-[15px] flex items-center gap-5">
                <label className="w-[90px] text-right text-[15px] text-foreground" htmlFor="paymentMethod">
                  {t("common.paymentMethod")}
                </label>
                <input
                  className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-foreground bg-background shadow-[0_0_0_1px] shadow-border outline-none focus:shadow-[0_0_0_2px] focus:shadow-foreground"
                  id="paymentMethod"
                  name="paymentMethod"
                  maxLength={50}
                  defaultValue={transaction.paymentMethod ?? ""}
                />
              </fieldset>
              {error ? (
                <p className="mb-3 text-sm text-destructive">{error}</p>
              ) : null}
              <div className="mt-[25px] flex justify-end">
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex h-[35px] items-center justify-center gap-2 rounded bg-primary px-[15px] font-medium leading-none text-primary-foreground outline-none outline-offset-1 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-primary select-none disabled:opacity-60"
                >
                  {pending && <Spinner />}
                  {t("common.save")}
                </button>
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
      <ToastDemo
        openToast={openToast}
        setOpenToast={setOpenToast}
        message={t("transaction.updated")}
      />
    </>
  );
}
