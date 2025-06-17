"use server";

import pool from "./db";
import { revalidatePath } from "next/cache";

export async function addTransaction(formData: FormData) {
  const title = formData.get("title") as string;
  const price = Number(formData.get("price"));
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;

  await pool.query(
    "INSERT INTO transactions (title, price,description,category) VALUES ($1, $2,$3,$4)",
    [title, price, description, category]
  );
  revalidatePath("/");
}

export async function getTransactions() {
  const result = await pool.query("SELECT * FROM transactions");
  return result.rows;
}

export async function deleteTransaction(id: number) {
  await pool.query("DELETE FROM transactions WHERE id = $1", [id]);
  revalidatePath("/");
}
