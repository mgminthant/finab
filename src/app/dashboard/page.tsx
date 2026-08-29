import FinancialSummary from "@/features/dashboard/components/FinancialSummary";
import SpendingByCategory from "@/features/dashboard/components/SpendingByCategory";
import RecentTransactions from "@/features/dashboard/components/RecentTransactions";
import QuickActions from "@/features/dashboard/components/QuickActions";
import BudgetOverview from "@/features/budgets/components/BudgetOverview";
import { currentUser } from "@/lib/auth";
import { getCategories } from "@/lib/category";

export default async function DashboardPage() {
  const user = await currentUser();
  const categories = user ? await getCategories(user.id) : [];

  return (
    <div className="space-y-4">
      <FinancialSummary />
      <BudgetOverview />
      <div className="grid gap-4 lg:grid-cols-2">
        <SpendingByCategory />
        <RecentTransactions />
      </div>
      <QuickActions categories={categories} />
    </div>
  );
}
