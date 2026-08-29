"use client";

import { useT } from "@/components/shared/I18nProvider";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useT();
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
      <h2 className="text-xl font-semibold text-foreground">{t("errors.title")}</h2>
      <p className="max-w-sm text-sm text-muted-foreground">{t("errors.description")}</p>
      {error.digest ? (
        <p className="text-xs text-muted-foreground">Ref: {error.digest}</p>
      ) : null}
      <Button onClick={reset}>{t("errors.retry")}</Button>
    </div>
  );
}
