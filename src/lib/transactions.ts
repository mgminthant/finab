"use server";

import { Transaction } from "@/types/transactions";
import pool from "./db";

export async function getTransactions() {
  const result = await pool.query("SELECT * FROM transactions");
  const transactions: Transaction[] = result.rows;
  return transactions;
}

export async function deleteTransactions(id: number) {
  const result = await pool.query("DELETE FROM transactions WHERE id = $1", [
    id,
  ]);
  return result;
}

export async function createTransaction(formData: FormData) {
  const title = formData.get("title") as string;
  const price = Number(formData.get("price"));
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;

  await pool.query(
    "INSERT INTO transactions (title, price,description,category) VALUES ($1, $2,$3,$4)",
    [title, price, description, category]
  );
}
