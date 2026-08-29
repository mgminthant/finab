"use client";

import * as React from "react";
import type { CategoryOption } from "@/types/category";
import CategoryDot from "./CategoryDot";
import CategoryDialog from "./CategoryDialog";
import DeleteCategoryDialog from "./DeleteCategoryDialog";
import { Button } from "@/components/ui/Button";
import { useT } from "@/components/shared/I18nProvider";

export default function CategoryManager({
  categories,
  usageIds,
}: {
  categories: CategoryOption[];
  usageIds: string[];
}) {
  const t = useT();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<CategoryOption | null>(null);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState<CategoryOption | null>(null);

  const usage = React.useMemo(() => new Set(usageIds), [usageIds]);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const openEdit = (c: CategoryOption) => {
    setEditing(c);
    setDialogOpen(true);
  };
  const openDelete = (c: CategoryOption) => {
    setDeleting(c);
    setDeleteOpen(true);
  };

  const expenseCats = categories.filter((c) => c.type === "EXPENSE");
  const incomeCats = categories.filter((c) => c.type === "INCOME");

  const renderGroup = (label: string, list: CategoryOption[]) => (
    <section className="mb-6">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </h2>
      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("category.empty")}</p>
      ) : (
        <ul className="divide-y divide-border rounded-md border border-border">
          {list.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between gap-2 px-3 py-2"
            >
              <CategoryDot {...{ color: c.color, icon: c.icon, name: c.name }} />
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(c)}
                  className="rounded px-2 py-1 text-sm text-foreground hover:bg-muted focus-visible:outline-2 focus-visible:outline-foreground"
                >
                  {t("common.edit")}
                </button>
                <button
                  type="button"
                  onClick={() => openDelete(c)}
                  className="rounded px-2 py-1 text-sm text-destructive hover:bg-destructive/10 focus-visible:outline-2 focus-visible:outline-destructive"
                >
                  {t("common.delete")}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );

  const siblings =
    deleting && deleting.type === "EXPENSE"
      ? expenseCats.filter((c) => c.id !== deleting.id)
      : deleting
        ? incomeCats.filter((c) => c.id !== deleting.id)
        : [];

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Button onClick={openCreate}>{t("category.add")}</Button>
      </div>

      {renderGroup(t("category.expense"), expenseCats)}
      {renderGroup(t("category.income"), incomeCats)}

      <CategoryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editing}
      />
      <DeleteCategoryDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        category={deleting}
        siblings={siblings}
        hasUsage={deleting ? usage.has(deleting.id) : false}
      />
    </div>
  );
}
