"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center text-foreground">
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        {error.digest ? (
          <p className="text-xs text-muted-foreground">Ref: {error.digest}</p>
        ) : null}
        <button
          onClick={reset}
          className="inline-flex h-[40px] items-center justify-center rounded bg-primary px-6 font-medium leading-none text-primary-foreground hover:opacity-90"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
