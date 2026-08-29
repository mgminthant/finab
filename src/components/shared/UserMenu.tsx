"use client";

import { signOut } from "next-auth/react";
import { useT } from "./I18nProvider";

export type UserMenuUser = {
  id: string | null;
  name: string | null;
  email: string | null;
  image: string | null;
};

export default function UserMenu({ user }: { user: UserMenuUser | null }) {
  const t = useT();
  if (!user) {
    return (
      <a
        href="/login"
        className="inline-flex h-[35px] items-center justify-center rounded bg-primary px-[15px] font-medium leading-none text-primary-foreground hover:opacity-90"
      >
        {t("common.signIn")}
      </a>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-foreground sm:inline">{user.name ?? user.email}</span>
      <button
        onClick={() => signOut()}
        className="inline-flex h-[35px] items-center justify-center rounded bg-primary px-[15px] font-medium leading-none text-primary-foreground hover:opacity-90"
      >
        {t("common.signOut")}
      </button>
    </div>
  );
}
