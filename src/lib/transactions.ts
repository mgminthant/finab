"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { SyncState, TransactionType } from "@/generated/prisma/enums";
import type { Prisma } from "@/generated/prisma/client";

const transactionInputSchema = z.object({
  title: z.string().trim().max(200).optional().default(""),
  price: z.coerce.number("Amount must be a number").positive().finite(),
  description: z.string().trim().max(500).optional().default(""),
  categoryId: z.string().trim().min(1, "Category is required"),
  type: z.enum(["INCOME", "EXPENSE"]).default("EXPENSE"),
  date: z.coerce.date().optional(),
  paymentMethod: z.string().trim().max(50).optional().default(""),
});

const transactionFiltersSchema = z.object({
  q: z.string().trim().min(1).optional(),
  type: z.enum(["INCOME", "EXPENSE"]).optional(),
  categoryId: z.string().trim().min(1).optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
});

export type TransactionFilters = {
  q?: string;
  type?: "INCOME" | "EXPENSE";
  categoryId?: string;
  dateFrom?: string;
  dateTo?: string;
};

export type TransactionSort = {
  by: "date" | "amount" | "title";
  dir: "asc" | "desc";
};

export type TransactionSummary = {
  id: string;
  title: string | null;
  amount: number;
  type: TransactionType;
  note: string | null;
  paymentMethod: string | null;
  categoryId: string;
  categoryName: string;
  date: string;
};

export async function getTransactions(
  userId: string,
  filters?: TransactionFilters,
  sort?: TransactionSort,
  limit?: number
): Promise<TransactionSummary[]> {
  const { q, type, categoryId, dateFrom, dateTo } =
    transactionFiltersSchema.parse(filters ?? {});

  const where: Prisma.TransactionWhereInput = { userId };
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { note: { contains: q, mode: "insensitive" } },
    ];
  }
  if (type) where.type = type;
  if (categoryId) where.categoryId = categoryId;
  if (dateFrom || dateTo) {
    where.date = {};
    if (dateFrom) where.date.gte = dateFrom;
    if (dateTo) where.date.lte = dateTo;
  }

  const orderBy: Prisma.TransactionOrderByWithRelationInput = !sort
    ? { date: "desc" }
    : sort.by === "amount"
      ? { amount: sort.dir }
      : sort.by === "title"
        ? { title: sort.dir }
        : { date: sort.dir };

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy,
    ...(limit ? { take: limit } : {}),
    include: { category: { select: { id: true, name: true } } },
  });

  return transactions.map((transaction) => ({
    id: transaction.id,
    title: transaction.title,
    amount: transaction.amount.toNumber(),
    type: transaction.type,
    note: transaction.note,
    paymentMethod: transaction.paymentMethod,
    categoryId: transaction.category.id,
    categoryName: transaction.category.name,
    date: transaction.date.toISOString(),
  }));
}

export type TransactionActionResult = { ok: true } | { ok: false; error: string };

export async function createTransactionAction(
  formData: FormData
): Promise<TransactionActionResult> {
  const user = await currentUser();
  if (!user) {
    return { ok: false, error: "common.unauthorized" };
  }

  const parsed = transactionInputSchema.safeParse({
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    type: formData.get("type") || undefined,
    date: formData.get("date") || undefined,
    paymentMethod: formData.get("paymentMethod") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }
  const d = parsed.data;

  const category = await prisma.category.findFirst({
    where: { id: d.categoryId, userId: user.id },
  });
  if (!category) {
    return { ok: false, error: "transaction.invalidCategory" };
  }

  await prisma.transaction.create({
    data: {
      title: d.title || null,
      type: d.type,
      amount: d.price,
      categoryId: category.id,
      date: d.date ?? new Date(),
      note: d.description,
      paymentMethod: d.paymentMethod || null,
      userId: user.id,
      syncState: SyncState.PENDING,
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function updateTransactionAction(
  id: string,
  formData: FormData
): Promise<TransactionActionResult> {
  const user = await currentUser();
  if (!user) {
    return { ok: false, error: "common.unauthorized" };
  }

  const parsed = transactionInputSchema.safeParse({
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
    categoryId: formData.get("categoryId"),
    type: formData.get("type") || undefined,
    date: formData.get("date") || undefined,
    paymentMethod: formData.get("paymentMethod") || undefined,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }
  const d = parsed.data;

  const category = await prisma.category.findFirst({
    where: { id: d.categoryId, userId: user.id },
  });
  if (!category) {
    return { ok: false, error: "transaction.invalidCategory" };
  }

  await prisma.transaction.updateMany({
    where: { id, userId: user.id },
    data: {
      title: d.title || null,
      type: d.type,
      amount: d.price,
      categoryId: category.id,
      date: d.date ?? new Date(),
      note: d.description,
      paymentMethod: d.paymentMethod || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function deleteTransactionAction(
  id: string
): Promise<TransactionActionResult> {
  const user = await currentUser();
  if (!user) {
    return { ok: false, error: "common.unauthorized" };
  }

  await prisma.transaction.deleteMany({
    where: { id, userId: user.id },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  return { ok: true };
}
