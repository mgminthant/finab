import { NextResponse } from "next/server";

import {
  createTransaction,
  deleteTransactions,
  getTransactions,
} from "@/lib/transactions";

export async function GET() {
  try {
    const transactions = await getTransactions();
    return NextResponse.json(transactions);
  } catch (e) {
    return NextResponse.json({ error: "Server error" + e }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    await createTransaction(formData);

    return NextResponse.json({ message: `Transaction Created`, status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Server error" + e }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "No id found" }, { status: 404 });
    }
    await deleteTransactions(Number(id));

    return NextResponse.json({
      message: `Deleted transaction ${id}`,
      status: 203,
    });
  } catch (e) {
    return NextResponse.json({ error: "Server error" + e }, { status: 500 });
  }
}
