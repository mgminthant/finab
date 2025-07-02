import React from "react";

export default async function TotalBudget() {
  const res = await fetch(`${process.env.BASE_API}/budgets`);
  const budgets = await res.json();
  
  return (
    <div>
      <h1 className="text-xl font-bold">
        Total Budget :
        <span className={`text-2xl p-1 ${budgets.total_spent > budgets.total_budget ? "bg-red-600" : "bg-green-600"} rounded`}>
          {budgets.current_budget} 
        </span>
        <span className="text-3xl"> ks</span>
      </h1>
    </div>
  );
}
