"use server";
export async function createBudgetHandler(formData: FormData) {
  const res = await fetch(`${process.env.BASE_API}/budgets`, {
    method: "POST",
    body: formData,
  });
  const data = res.json();
  return data;
}
