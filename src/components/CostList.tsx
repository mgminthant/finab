import { deleteTransaction } from "@/lib/transactions";
import { Transaction } from "@/types/transactions";
import { formatDate } from "@/utils/date";

export default function TransactionPage({
  transactions,
}: {
  transactions: Transaction[];
}) {
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Transaction List</h2>
      {transactions.map((cost: Transaction) => (
        <div className="space-y-4" key={cost.id}>
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <div>
              <h3 className="text-lg font-semibold">{cost.title}</h3>
              <p className="text-gray-600">{cost.description}</p>
              <p className="text-gray-500">Category: {cost.category}</p>
              <p className="text-gray-500">{formatDate(cost.created_at)}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-green-600">
                {cost.price} ks
              </p>
              <form
                action={async () => {
                  "use server";
                  await deleteTransaction(cost.id);
                }}
              >
                <button
                  type="submit"
                  className="mt-2 bg-red-500 text-white rounded-lg px-4 py-1"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
