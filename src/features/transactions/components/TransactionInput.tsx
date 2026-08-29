"use client";
import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { createTransactionAction } from "@/lib/transactions";
import type { CategoryOption } from "@/types/category";
import ToastDemo from "@/components/shared/ToastComp";
import Spinner from "@/components/ui/Spinner";
import { useT } from "@/components/shared/I18nProvider";

export default function TransactionInput({
  categories,
  fab = false,
  variant = "button",
}: {
  categories: CategoryOption[];
  fab?: boolean;
  variant?: "button" | "link";
}) {
  const [open, setOpen] = React.useState(false);
  const [openToast, setOpenToast] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [type, setType] = React.useState<"INCOME" | "EXPENSE">("EXPENSE");
  const t = useT();

  const filtered = categories.filter((c) => c.type === type);

  const handleCreateTransaction = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    setPending(true);
    createTransactionAction(formData)
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

  const trigger = fab ? (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={t("nav.addTransaction")}
      className="z-10 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl leading-none text-primary-foreground shadow-lg hover:opacity-90 focus-visible:outline-2 focus-visible:outline-primary"
    >
      +
    </button>
  ) : variant === "link" ? (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="inline-flex h-[35px] items-center justify-center font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-primary select-none"
    >
      {t("nav.addTransaction")}
    </button>
  ) : (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="inline-flex h-[35px] items-center justify-center rounded bg-primary px-[15px] font-medium leading-none text-primary-foreground outline-none outline-offset-1 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-primary select-none"
    >
      {t("nav.addTransaction")}
    </button>
  );

  return (
    <>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[100] bg-black/60 data-[state=open]:animate-overlayShow" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[101] max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-md bg-card p-[25px] shadow-lg focus:outline-none data-[state=open]:animate-contentShow">
            <Dialog.Title className="m-0 text-[17px] font-medium text-card-foreground">
              {t("transaction.addTitle")}
            </Dialog.Title>
            <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-muted-foreground">
              {t("transaction.saveTransaction")}
            </Dialog.Description>
            <form onSubmit={handleCreateTransaction}>
              <fieldset className="mb-[15px] flex items-center gap-5">
                <label className="w-[90px] text-right text-[15px] text-foreground" htmlFor="title">
                  {t("common.title")}
                </label>
                <input
                  className="inline-flex h-[60px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-foreground bg-background shadow-[0_0_0_1px] shadow-border outline-none focus:shadow-[0_0_0_2px] focus:shadow-foreground"
                  id="transaction_title"
                  name="title"
                  maxLength={200}
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
                />
              </fieldset>
              <fieldset className="mb-[15px] flex items-center gap-5">
                <label className="w-[90px] text-right text-[15px] text-foreground" htmlFor="Category">
                  {t("common.category")}
                </label>
                <select
                  key={type}
                  name="categoryId"
                  defaultValue=""
                  required
                  className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-foreground bg-background shadow-[0_0_0_1px] shadow-border outline-none focus:shadow-[0_0_0_2px] focus:shadow-foreground"
                >
                  <option value="" disabled>
                    {t("common.selectCategory")}
                  </option>
                  {filtered.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </fieldset>
              <fieldset className="mb-[15px] flex items-center gap-5">
                <label className="w-[90px] text-right text-[15px] text-foreground" htmlFor="Type">
                  {t("common.type")}
                </label>
                <select
                  name="type"
                  value={type}
                  onChange={(e) => setType(e.target.value as "INCOME" | "EXPENSE")}
                  className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-foreground bg-background shadow-[0_0_0_1px] shadow-border outline-none focus:shadow-[0_0_0_2px] focus:shadow-foreground"
                >
                  <option value="EXPENSE">{t("common.expense")}</option>
                  <option value="INCOME">{t("common.income")}</option>
                </select>
              </fieldset>
              <fieldset className="mb-[15px] flex items-center gap-5">
                <label className="w-[90px] text-right text-[15px] text-foreground" htmlFor="Date">
                  {t("common.date")}
                </label>
                <input
                  type="date"
                  className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-foreground bg-background shadow-[0_0_0_1px] shadow-border outline-none focus:shadow-[0_0_0_2px] focus:shadow-foreground dark:color-scheme-dark"
                  id="date"
                  name="date"
                />
              </fieldset>
              <fieldset className="mb-[15px] flex items-center gap-5">
                <label className="w-[90px] text-right text-[15px] text-foreground" htmlFor="Payment Method">
                  {t("common.paymentMethod")}
                </label>
                <input
                  className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-foreground bg-background shadow-[0_0_0_1px] shadow-border outline-none focus:shadow-[0_0_0_2px] focus:shadow-foreground"
                  id="paymentMethod"
                  name="paymentMethod"
                  maxLength={50}
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
        message={t("transaction.added")}
      />
    </>
  );
}
