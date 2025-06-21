"use client";
import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { addTransaction } from "@/lib/transactions";

const TransactionInput = () => {
  const [open, setOpen] = React.useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button onClick={() => setOpen(true)} className="mb-5 inline-flex h-[35px] items-center justify-center rounded bg-green-500 px-[15px] font-medium leading-none text-white outline-none outline-offset-1 hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-violet6 select-none">
          Add Transaction
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-blackA6 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray1 p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title className="m-0 text-[17px] font-medium text-mauve12">
            Save Transaction
          </Dialog.Title>
          <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-mauve11">
            Add a new transaction to your account. Click save when you&apos;re done.
          </Dialog.Description>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
             addTransaction(new FormData(e.currentTarget)).then(()=>{
               setOpen(false);
               alert("Transaction Added!");
             }).catch(()=>{
                alert('Something went wrong');
             })
            }}
          >
            <fieldset className="mb-[15px] flex items-center gap-5">
              <label
                className="w-[90px] text-right text-[15px] text-violet11"
                htmlFor="Transaction Title"
              >
                Title
              </label>
              <input
                className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                id="transaction_title"
                name="title"
              />
            </fieldset>
            <fieldset className="mb-[15px] flex items-center gap-5">
              <label
                className="w-[90px] text-right text-[15px] text-violet11"
                htmlFor="Price"
              >
                Price
              </label>
              <input
                type="number"
                className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                id="price"
                name="price"
              />
            </fieldset>
            <fieldset className="mb-[15px] flex items-center gap-5">
              <label
                className="w-[90px] text-right text-[15px] text-violet11"
                htmlFor="Description"
              >
                Description
              </label>
              <input
                className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                id="description"
                name="description"
              />
            </fieldset>
            <fieldset className="mb-[15px] flex items-center gap-5">
              <label
                className="w-[90px] text-right text-[15px] text-violet11"
                htmlFor="Category"
              >
                Category
              </label>
              <input
                className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-violet11 shadow-[0_0_0_1px] shadow-violet7 outline-none focus:shadow-[0_0_0_2px] focus:shadow-violet8"
                id="category"
                name="category"
              />
            </fieldset>
            <div className="mt-[25px] flex justify-end">
              <button
                type="submit"
                className="inline-flex h-[35px] items-center justify-center rounded bg-green-500 px-[15px] font-medium leading-none text-white outline-none outline-offset-1 hover:bg-green5 focus-visible:outline-2 focus-visible:outline-green6 select-none"
              >
                Add
              </button>
            </div>
            <Dialog.Close asChild>
              <button
                className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-violet11 bg-gray3 hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
                aria-label="Close"
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default TransactionInput;
