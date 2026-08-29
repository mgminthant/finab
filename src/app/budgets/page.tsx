import BudgetOverview from "@/features/budgets/components/BudgetOverview";
import CategoryBudgets from "@/features/budgets/components/CategoryBudgets";
import BudgetInput from "@/features/budgets/components/BudgetInput";

export default function BudgetsPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <BudgetInput />
      </div>
      <BudgetOverview />
      <CategoryBudgets />
    </div>
  );
}
