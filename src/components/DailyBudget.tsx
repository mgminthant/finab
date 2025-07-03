import React from "react";

export default async function DailyBudget() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/dailyBudgets`);
  const data = res.json();
  const budgets = await data;

  return (
    <>
      <h1 className="text-center text-xl font-bold my-7">
        Daily Budget :&nbsp;{" "}
        <span className={`text-2x`}>{budgets.daily_budget}</span>
        ks
      </h1>
      <h1 className="text-center text-xl font-bold my-7 sm:flex-row justify-center flex gap-2 flex-col">
        Avaliable Budget Today :
        <div>
          <span
            className={`text-2xl p-1 rounded ${
              budgets.daily_budget < budgets.total_spent_today
                ? "bg-red-600"
                : "bg-green-600"
            }`}
          >
            {budgets.daily_budget - budgets.total_spent_today} ks
          </span>
        </div>
      </h1>
      <h1 className={`text-center text-xl font-bold my-7`}>
        Spent Today : &nbsp;
        <span
          className={`text-2xl p-1 rounded ${
            budgets.daily_budget < budgets.total_spent_today
              ? "bg-red-600"
              : "bg-green-600"
          } `}
        >
          {budgets.total_spent_today}
        </span>
        ks
      </h1>
    </>
  );
}
