import { NextResponse } from "next/server";
import { createMonthlyBudget, getBudgets } from "@/lib/budget";

export async function GET() {
  try {
    const budgets = await getBudgets();

    if (budgets) {
      return NextResponse.json({
        ...budgets,
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Server error" + error },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    await createMonthlyBudget(formData);
    return NextResponse.json({ message: `Budget Added`, status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error" + error },
      { status: 500 }
    );
  }
}

// export async function DELETE(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const id = searchParams.get("id");
//   await pool.query("DELETE FROM budgets WHERE id = $1", [id]);
//   return NextResponse.json({
//     message: `Deleted budget ${id}`,
//     status: 203,
//   });
// }
