import CostList from "@/components/CostList";
import { getTransactions } from "@/lib/transactions";
import TransactionInput from "@/components/TransactionInput";
import { Transaction } from "@/types/transactions";

export default async function HomePage() {
  const transactions:Transaction[] = await getTransactions();

  return (
    <div className="min-h-screen bg-gray-100 sm:p-8 p-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Transaction Management
      </h1>
      <TransactionInput />
      <CostList transactions={transactions} />
    </div>
  );
}
