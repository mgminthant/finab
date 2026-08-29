import * as React from "react";

type Variant = "primary" | "ghost" | "outline";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:opacity-90 focus-visible:outline-primary",
  ghost: "text-foreground hover:bg-muted focus-visible:outline-foreground",
  outline:
    "border border-border text-foreground hover:bg-muted focus-visible:outline-foreground",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={`inline-flex h-[35px] items-center justify-center rounded px-[15px] text-sm font-medium leading-none outline-none outline-offset-1 focus-visible:outline-2 disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
      {...props}
    />
  );
}
