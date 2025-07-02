import TotalBudget from "@/components/TotalBudget";
import TransactionInput from "@/components/TransactionInput";
import Link from "next/link";

export default async function HomePage() {
  return (
    <div className="min-h-screen sm:p-8 p-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Transaction Management
      </h1>
      <div className="flex justify-between align-middle">
        <TransactionInput />
        <TotalBudget />
        <Link href="/dashboard">
          <button className="mb-5 inline-flex h-[35px] items-center justify-center rounded bg-slate-800 px-[15px] font-medium leading-none text-white outline-none outline-offset-1 hover:bg-slate-900 focus-visible:outline-2 focus-visible:outline-violet6 select-none">
            Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
}
