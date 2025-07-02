import BudgetInput from "@/components/BudgetInput";
import CostListContainer from "@/components/CostListContainer";

export default function page() {
  return (
    <div className="min-h-screen sm:p-8 p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Dashboard</h1>
      <BudgetInput/>
      <CostListContainer />
    </div>
  );
}
