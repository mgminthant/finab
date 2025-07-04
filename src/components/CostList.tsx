"use client";
import { deleteTransactionHandler } from "@/lib/transactionsHandler";
import { Transaction } from "@/types/transactions";
import { formatDate } from "@/utils/date";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ToastDemo from "./ToastComp";
export default function TransactionPage({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const router = useRouter();
  const [openToast, setOpenToast] = useState(false);

  const handleOnDelete = (id: number) => {
    deleteTransactionHandler(id).then(() => {
      setOpenToast(true);
      router.refresh();
    });
  };
  return (
    <div className="bg-slate-800 shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Transaction List</h2>
      {transactions.map((cost: Transaction) => (
        <div className="space-y-4" key={cost.id}>
          <div className="flex justify-between items-center p-4 border-b border-white">
            <div>
              <h3 className="text-lg font-semibold">{cost.title}</h3>
              <p className="text-white">{cost.description}</p>
              <p className="text-gray-200">Category: {cost.category}</p>
              <p className="text-gray-300">{formatDate(cost.created_at)}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-green-600">
                {cost.price} ks
              </p>

              <button
                onClick={() => handleOnDelete(cost.id)}
                className="mt-2 bg-red-500 text-white rounded-lg px-4 py-1"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
      <ToastDemo
        openToast={openToast}
        setOpenToast={setOpenToast}
        message={"Transaction Deleted"}
      />
    </div>
  );
}
