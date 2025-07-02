import { NextResponse } from "next/server";
import pool from "../../../lib/db";

export async function GET() {
  try {
    const currentDate = new Date();
    const currentDateString = new Date().toLocaleString("en-CA", {
      timeZone: "Asia/Yangon",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const currentMonth = Number(currentDateString.split("-")[1]);

    const budgetResult = await pool.query(
      `SELECT total_budget FROM budgets WHERE EXTRACT(MONTH FROM added_date) = $1 LIMIT 1`,
      [currentMonth]
    );

    if (budgetResult.rowCount === 0) {
      return NextResponse.json(
        { error: "No budget found for current month" },
        { status: 404 }
      );
    }

    const totalBudget = Number(budgetResult.rows[0].total_budget);

    const sumResult = await pool.query(
      `SELECT COALESCE(SUM(price), 0) AS total_spent_today FROM transactions WHERE DATE(created_at) = $1`,
      [currentDateString]
    );

    const totalSpentToday = Number(sumResult.rows[0].total_spent_today);

    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentMonth,
      0
    ).getDate();
    const dailyBudget = totalBudget / daysInMonth;

    const remainingBudgetToday = dailyBudget - totalSpentToday;

    return NextResponse.json({
      total_budget: totalBudget,
      total_spent_today: totalSpentToday,
      daily_budget: dailyBudget,
      remaining_budget_today: remainingBudgetToday,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error" + error },
      { status: 500 }
    );
  }
}
