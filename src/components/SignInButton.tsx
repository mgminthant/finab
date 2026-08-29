"use client";

import { signIn } from "next-auth/react";
import * as React from "react";
import Spinner from "@/components/ui/Spinner";
import { useT } from "@/components/shared/I18nProvider";

export default function SignInButton() {
  const t = useT();
  const [loading, setLoading] = React.useState(false);

  return (
    <button
      onClick={() => {
        setLoading(true);
        signIn("google");
      }}
      disabled={loading}
      className="inline-flex h-[40px] items-center justify-center gap-2 rounded bg-primary px-6 font-medium leading-none text-primary-foreground hover:opacity-90 disabled:opacity-70"
    >
      {loading && <Spinner />}
      {t("login.signInWithGoogle")}
    </button>
  );
}
