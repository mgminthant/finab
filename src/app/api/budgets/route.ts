import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    const budgetResult = await pool.query(
      'SELECT total_budget FROM budgets LIMIT 1'
    );
    if (budgetResult.rowCount === 0) {
      return NextResponse.json({ error: 'No budget found' }, { status: 404 });
    }
    const totalBudget = Number(budgetResult.rows[0].total_budget);

    const sumResult = await pool.query(
      'SELECT COALESCE(SUM(price), 0) AS total_spent FROM transactions'
    );
    const totalSpent = Number(sumResult.rows[0].total_spent);

    const currentBudget = totalBudget - totalSpent;

    return NextResponse.json({
      total_budget: totalBudget,
      total_spent: totalSpent,
      current_budget: currentBudget,
    });
  } catch (e) {
    return NextResponse.json({ error: 'Server error'+e}, { status: 500 });
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const budgets = formData.get("budget");

  await pool.query("INSERT INTO budgets (total_budget) VALUES ($1)", [budgets]);

  return NextResponse.json({ message: `Budget Added`, status: 201 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  await pool.query("DELETE FROM budgets WHERE id = $1", [id]);
  return NextResponse.json({
    message: `Deleted budget ${id}`,
    status: 203,
  });
}
