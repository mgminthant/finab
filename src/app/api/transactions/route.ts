import pool from "../../../lib/db";

import { Transaction } from "@/types/transactions";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await pool.query("SELECT * FROM transactions");
  const transactions: Transaction[] = result.rows;
  return NextResponse.json(transactions);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const price = Number(formData.get("price"));
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;

  await pool.query(
    "INSERT INTO transactions (title, price,description,category) VALUES ($1, $2,$3,$4)",
    [title, price, description, category]
  );

  return NextResponse.json({ message: `Transaction Created`, status: 201 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  await pool.query("DELETE FROM transactions WHERE id = $1", [id]);
  return NextResponse.json({
    message: `Deleted transaction ${id}`,
    status: 203,
  });
}
