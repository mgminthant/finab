import React from "react";

export default async function TotalBudget() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/budgets`);
  const budgets = await res.json();

  return (
    <h1 className="text-xl text-center font-bold">
      Monthly Budget :
      <span
        className={`md:text-2xl text-xl p-1 ${
          budgets.total_spent > budgets.total_budget
            ? "bg-red-600"
            : "bg-green-600"
        } rounded`}
      >
        {budgets.current_budget}
      </span>
      <span className="md:text-3xl text-2xl"> ks</span>
    </h1>
  );
}
