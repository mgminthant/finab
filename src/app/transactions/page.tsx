import CostListContainer from "@/features/transactions/components/CostListContainer";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  return (
    <div className="space-y-4">
      <CostListContainer searchParams={sp} />
    </div>
  );
}
