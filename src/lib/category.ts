"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { currentUser } from "@/lib/auth";
import { CategoryType } from "@/generated/prisma/enums";
import type { CategoryOption } from "@/types/category";

const DEFAULT_EXPENSE_CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Education",
  "Entertainment",
  "Health",
  "Travel",
  "Other",
];

const DEFAULT_INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Business",
  "Allowance",
  "Gift",
  "Other",
];

async function ensureDefaultCategories(userId: string) {
  const count = await prisma.category.count({ where: { userId } });
  if (count > 0) return;
  await prisma.category.createMany({
    data: [
      ...DEFAULT_EXPENSE_CATEGORIES.map((name) => ({
        name,
        type: CategoryType.EXPENSE,
        userId,
      })),
      ...DEFAULT_INCOME_CATEGORIES.map((name) => ({
        name,
        type: CategoryType.INCOME,
        userId,
      })),
    ],
  });
}

export async function getCategories(
  userId: string,
  type?: CategoryType,
): Promise<CategoryOption[]> {
  await ensureDefaultCategories(userId);
  const categories = await prisma.category.findMany({
    where: type ? { userId, type } : { userId },
    orderBy: { name: "asc" },
    select: { id: true, name: true, type: true, icon: true, color: true },
  });
  return categories;
}

const categorySchema = z.object({
  name: z.string().trim().min(1, "category.nameRequired").max(40),
  type: z.enum(["EXPENSE", "INCOME"]),
  icon: z.string().trim().max(8).optional().default(""),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "category.invalidColor")
    .optional()
    .default(""),
});

type CategoryActionResult = { ok: true } | { error: string };

function revalidateCategoryPaths() {
  revalidatePath("/categories");
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  revalidatePath("/budgets");
  revalidatePath("/analytics");
}

export async function createCategoryAction(
  formData: FormData
): Promise<CategoryActionResult> {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    icon: formData.get("icon") ?? "",
    color: formData.get("color") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const { name, type, icon, color } = parsed.data;

  const taken = await prisma.category.findFirst({
    where: { userId: user.id, name, type },
  });
  if (taken) return { error: "category.exists" };

  await prisma.category.create({
    data: {
      name,
      type,
      icon: icon || null,
      color: color || null,
      userId: user.id,
    },
  });

  revalidateCategoryPaths();
  return { ok: true };
}

export async function updateCategoryAction(
  formData: FormData
): Promise<CategoryActionResult> {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const id = String(formData.get("id") ?? "");
  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    type: formData.get("type"),
    icon: formData.get("icon") ?? "",
    color: formData.get("color") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }
  const { name, type, icon, color } = parsed.data;

  const existing = await prisma.category.findFirst({
    where: { id, userId: user.id },
  });
  if (!existing) return { error: "category.notFound" };

  const taken = await prisma.category.findFirst({
    where: {
      userId: user.id,
      name,
      type,
      ...(id ? { id: { not: id } } : {}),
    },
  });
  if (taken) return { error: "category.exists" };

  await prisma.category.update({
    where: { id },
    data: { name, type, icon: icon || null, color: color || null },
  });

  revalidateCategoryPaths();
  return { ok: true };
}

export async function deleteCategoryAction(
  formData: FormData
): Promise<CategoryActionResult> {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const id = String(formData.get("id") ?? "");
  const reassignToId = String(formData.get("reassignToId") ?? "");

  const category = await prisma.category.findFirst({
    where: { id, userId: user.id },
  });
  if (!category) return { error: "category.notFound" };

  const usage = await prisma.transaction.count({
    where: { userId: user.id, categoryId: id },
  });
  const budgetUsage = await prisma.budget.count({
    where: { userId: user.id, categoryId: id },
  });

  if (usage > 0 || budgetUsage > 0) {
    if (!reassignToId) {
      return { error: "category.reassignRequired" };
    }
    const target = await prisma.category.findFirst({
      where: { id: reassignToId, userId: user.id, type: category.type },
    });
    if (!target) return { error: "category.invalidReassign" };

    try {
      await prisma.$transaction([
        prisma.transaction.updateMany({
          where: { userId: user.id, categoryId: id },
          data: { categoryId: reassignToId },
        }),
        prisma.budget.updateMany({
          where: { userId: user.id, categoryId: id },
          data: { categoryId: reassignToId },
        }),
        prisma.recurringTransaction.updateMany({
          where: { userId: user.id, categoryId: id },
          data: { categoryId: reassignToId },
        }),
        prisma.category.delete({ where: { id } }),
      ]);
    } catch (e) {
      if (
        e &&
        typeof e === "object" &&
        "code" in e &&
        (e as { code?: string }).code === "P2002"
      ) {
        return { error: "category.reassignBudgetConflict" };
      }
      throw e;
    }
  } else {
    await prisma.category.delete({ where: { id } });
  }

  revalidateCategoryPaths();
  return { ok: true };
}
