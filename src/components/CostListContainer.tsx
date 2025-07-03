import { Transaction } from "@/types/transactions";
import React from "react";
import CostList from "./CostList";

export default async function CostListContainer() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/transactions`);
  const transactions: Transaction[] = await res.json();
  return (
    <>
      {transactions.length > 0 ? (
        <CostList transactions={transactions} />
      ) : (
        <h2 className="text-center text-2xl font-semibold mt-4">
          No transactions Yet!
        </h2>
      )}
    </>
  );
}
