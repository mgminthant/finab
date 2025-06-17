import { addTransaction } from "@/lib/transactions";

export default function TransactionInput() {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-4">Add New Transaction</h2>
      <form action={addTransaction} className="space-y-4">
        <input
          className="bg-white border border-gray-300 rounded-lg p-2 w-full"
          type="text"
          name="title"
          placeholder="Transaction Title"
          required
        />
        <input
          className="bg-white border border-gray-300 rounded-lg p-2 w-full"
          type="number"
          name="price"
          placeholder="Price"
          required
        />
        <input
          className="bg-white border border-gray-300 rounded-lg p-2 w-full"
          type="text"
          name="description"
          placeholder="Description"
        />
        <input
          className="bg-white border border-gray-300 rounded-lg p-2 w-full"
          type="text"
          name="category"
          placeholder="Category"
          required
        />
        <button
          className="bg-green-500 text-white rounded-lg px-4 py-2 cursor-pointer"
          type="submit"
        >
          Add Transaction
        </button>
      </form>
    </div>
  );
}
