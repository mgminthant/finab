import pool from "./db";

export async function getBudgets() {
  const now = new Date();
  const yangonDate = now.toLocaleString("en-CA", {
    timeZone: "Asia/Yangon",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const [year, month] = yangonDate.split("-").map(Number);

  const budgetResult = await pool.query(
    `SELECT total_budget FROM budgets WHERE EXTRACT(MONTH FROM added_date) = $1 AND EXTRACT(YEAR FROM added_date) = $2 LIMIT 1`,
    [month, year]
  );
  if (budgetResult.rowCount === 0) {
    return { error: "No budget found for current month", status: 404 };
  }
  const totalBudget = Number(budgetResult.rows[0].total_budget);

  const totalSpent = Number(
    (
      await pool.query(
        "SELECT COALESCE(SUM(price), 0) AS total_spent FROM transactions"
      )
    ).rows[0].total_spent
  );

  const totalSpentToday = Number(
    (
      await pool.query(
        `SELECT COALESCE(SUM(price), 0) AS total_spent_today FROM transactions WHERE (created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Yangon')::date = $1`,
        [yangonDate]
      )
    ).rows[0].total_spent_today
  );

  const daysInMonth = new Date(year, month, 0).getDate();
  const dailyBudget = totalBudget / daysInMonth;
  const remainingBudgetToday = dailyBudget - totalSpentToday;

  return {
    totalBudget,
    totalSpent,
    totalSpentToday,
    dailyBudget,
    remainingBudgetToday,
  };
}

export async function createMonthlyBudget(formData: FormData) {
  const budget = Number(formData.get("budget"));
  if (isNaN(budget) || budget <= 0) {
    throw new Error("Invalid budget value");
  }
  await pool.query("INSERT INTO budgets (total_budget) VALUES ($1)", [budget]);
}
