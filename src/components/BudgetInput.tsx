"use client";
import React from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { createBudgetHandler } from "@/lib/budget";
import ToastDemo from "./ToastComp";

export default function BudgetInput() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [openToast, setOpenToast] = React.useState(false);

  const handleCreateBudget = (event: React.FormEvent<HTMLFormElement> ) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    createBudgetHandler(formData).then((data) => console.log(data));
    setOpen(false);
    setOpenToast(true);
    router.refresh();
  };
  return (
    <>
    
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="mb-5 inline-flex h-[35px] items-center justify-center rounded bg-slate-800 px-[15px] font-medium leading-none text-white outline-none outline-offset-1 hover:bg-slate-900 focus-visible:outline-2 focus-visible:outline-violet6 select-none">
          Add Budget
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-blackA6 data-[state=open]:animate-overlayShow" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray1 p-[25px] shadow-[var(--shadow-6)] focus:outline-none data-[state=open]:animate-contentShow">
          <Dialog.Title className="m-0 text-[17px] font-medium text-mauve12">
            Add Budget
          </Dialog.Title>
          <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-mauve11">
            Add a budget to your account. Click save when you&apos;re done.
          </Dialog.Description>
          <form onSubmit={handleCreateBudget}>
            <fieldset className="mb-[15px] flex items-center gap-5">
              <label
                className="w-[90px] text-right text-[15px] text-black"
                htmlFor="Price"
              >
                Total Budgets
              </label>
              <input
                type="number"
                className="inline-flex h-[35px] w-full flex-1 items-center justify-center rounded px-2.5 text-[15px] leading-none text-black shadow-[0_0_0_1px] shadow-slate-950 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
                id="budget"
                name="budget"
              />
            </fieldset>
            <div className="mt-[25px] flex justify-end">
              <button
                type="submit"
                className="inline-flex h-[35px] items-center justify-center rounded bg-slate-600 px-[15px] font-medium leading-none text-white outline-none outline-offset-1 hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-green6 select-none"
              >
                Add
              </button>
            </div>
            <Dialog.Close asChild>
              <button
                className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full text-black bg-gray3 hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-slate-950 focus:outline-none"
                aria-label="Close"
              >
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
    <ToastDemo
        openToast={openToast}
        setOpenToast={setOpenToast}
        message={"Budget Added"}
      />
    </>
  );
}
