"use client";
import { deleteTransactionAction } from "@/lib/transactions";
import { Transaction } from "@/types/transactions";
import type { CategoryOption } from "@/types/category";
import { formatCurrency } from "@/utils/currency";
import { formatDate } from "@/utils/date";
import { useMemo, useState } from "react";
import ToastDemo from "@/components/shared/ToastComp";
import { useT } from "@/components/shared/I18nProvider";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import EditTransactionDialog from "./EditTransactionDialog";
import CategoryDot from "@/features/categories/components/CategoryDot";

export default function TransactionPage({
  transactions,
  categories,
}: {
  transactions: Transaction[];
  categories: CategoryOption[];
}) {
  const [openToast, setOpenToast] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useT();

  const catMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c])),
    [categories]
  );

  const handleConfirmDelete = (id: string) => {
    setPending(true);
    deleteTransactionAction(id)
      .then((res) => {
        setPending(false);
        setOpenId(null);
        if (res.ok) {
          setOpenToast(true);
        } else {
          setError(t(res.error));
        }
      })
      .catch(() => {
        setPending(false);
        setOpenId(null);
        setError(t("common.formError"));
      });
  };

  return (
    <div className="bg-card shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">
        {transactions.length > 0 ? "Transactions" : ""}
      </h2>
      {transactions.map((cost: Transaction) => (
        <div className="space-y-4" key={cost.id}>
          <div className="flex justify-between items-center p-4 border-b border-border">
            <div>
              <h3 className="text-lg font-semibold">
                {cost.title || cost.note || "No title"}
              </h3>
              <p className="flex items-center gap-1 text-muted-foreground">
                Category:{" "}
                <CategoryDot
                  color={catMap[cost.categoryId]?.color ?? null}
                  icon={catMap[cost.categoryId]?.icon ?? null}
                  name={cost.categoryName}
                />
              </p>
              <p className="text-muted-foreground">{formatDate(cost.date)}</p>
            </div>
            <div className="text-right">
              <p
                className={`text-xl font-bold ${
                  cost.type === "INCOME" ? "text-success" : "text-destructive"
                }`}
              >
                {formatCurrency(cost.amount)}
              </p>

              <div className="mt-2 flex gap-2 justify-end">
                <EditTransactionDialog
                  transaction={cost}
                  categories={categories}
                />
                <button
                  onClick={() => setOpenId(cost.id)}
                  className="bg-destructive text-destructive-foreground rounded-lg px-4 py-1"
                >
                  {t("common.delete")}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      {error ? (
        <p className="mb-3 text-sm text-destructive">{error}</p>
      ) : null}
      <ToastDemo
        openToast={openToast}
        setOpenToast={setOpenToast}
        message={t("transactions.deleted")}
      />
      <ConfirmDialog
        open={openId !== null}
        onOpenChange={(o) => !o && setOpenId(null)}
        title={t("transactions.deleteTitle")}
        description={t("transactions.deleteDescription")}
        confirmLabel={t("common.delete")}
        pending={pending}
        onConfirm={() => openId && handleConfirmDelete(openId)}
      />
    </div>
  );
}
