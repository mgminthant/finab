import React from "react";

export default async function DailyBudget() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/budgets`);
  const data = res.json();
  const budgets = await data;

  return (
    <>
      <h1 className="text-center text-xl font-bold my-7">
        Daily Budget :&nbsp;
        <span className={`text-2x`}>{budgets.dailyBudget}</span>
        ks
      </h1>
      <h1 className="text-center text-xl font-bold my-7 sm:flex-row justify-center flex gap-2 flex-col">
        Avaliable Budget Today :
        <div>
          <span
            className={`text-2xl p-1 rounded ${
              budgets.daily_budget < budgets.totalSpentToday
                ? "bg-red-600"
                : "bg-green-600"
            }`}
          >
            {budgets.dailyBudget - budgets.totalSpentToday} ks
          </span>
        </div>
      </h1>
      <h1 className={`text-center text-xl font-bold my-7`}>
        Spent Today : &nbsp;
        <span
          className={`text-2xl p-1 rounded ${
            budgets.daily_budget < budgets.totalSpentToday
              ? "bg-red-600"
              : "bg-green-600"
          } `}
        >
          {budgets.totalSpentToday}
        </span>
        ks
      </h1>
    </>
  );
}
