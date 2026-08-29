export type Transaction = {
  id: string;
  title: string | null;
  amount: number;
  type: "INCOME" | "EXPENSE";
  note: string | null;
  paymentMethod: string | null;
  categoryId: string;
  categoryName: string;
  date: string;
};
