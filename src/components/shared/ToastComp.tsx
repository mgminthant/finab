"use client";
import * as React from "react";
import * as Toast from "@radix-ui/react-toast";

export default function ToastDemo({
  openToast,
  setOpenToast,
  message,
}: {
  openToast: boolean;
  setOpenToast: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
}) {
  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        className="grid grid-cols-[auto_max-content] items-center gap-x-[15px] rounded-md border border-border bg-card p-[15px] text-card-foreground shadow-lg [grid-template-areas:_'title_action'_'description_action'] data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut data-[swipe=cancel]:transition-[transform_200ms_ease-out]"
        open={openToast}
        onOpenChange={setOpenToast}
      >
        <Toast.Title className="mb-[5px] text-[15px] font-medium [grid-area:_title]">
          {message}
        </Toast.Title>
        <Toast.Description asChild />
        <Toast.Action
          className="[grid-area:_action]"
          asChild
          altText="Close"
        >
          <button className="inline-flex h-[25px] items-center justify-center rounded bg-muted px-2.5 text-xs font-medium leading-[25px] text-foreground hover:bg-muted-foreground/30">
            close
          </button>
        </Toast.Action>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-2.5 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
    </Toast.Provider>
  );
}
