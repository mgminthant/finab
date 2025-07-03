"use server";
export async function createTransactionHandler(formData: FormData) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/transactions`, {
    method: "POST",
    body: formData,
  });
  const data = res.json();
  return data;
}

export async function deleteTransactionHandler(id: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/transactions?id=${id}`, {
    method: "DELETE",
  });
  const data = res.json();
  return data;
}
