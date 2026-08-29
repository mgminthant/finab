"use client";
import { usePathname } from "next/navigation";
import * as React from "react";
import Sidebar from "./Sidebar";
import AppHeader from "./AppHeader";
import BottomNavigation from "./BottomNavigation";
import InstallPrompt from "./InstallPrompt";
import type { CategoryOption } from "@/types/category";
import type { UserMenuUser } from "./UserMenu";

export default function AppFrame({
  user,
  categories,
  children,
}: {
  user: UserMenuUser | null;
  categories: CategoryOption[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  if (isLogin) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  return (
    <>
      <InstallPrompt />
      <div className="flex min-h-screen">
        <Sidebar categories={categories} />
        <div className="flex flex-1 flex-col">
          <AppHeader user={user} />
          <main className="flex-1 p-4 pb-24 md:pb-4">{children}</main>
        </div>
      </div>
      <BottomNavigation categories={categories} />
    </>
  );
}
