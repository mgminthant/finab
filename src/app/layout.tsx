import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { getCategories } from "@/lib/category";
import { getDictionary } from "@/lib/i18n";
import { ThemeProvider } from "@/components/ThemeProvider";
import { I18nProvider } from "@/components/shared/I18nProvider";
import AppFrame from "@/components/shared/AppFrame";
import RegisterSW from "@/components/shared/RegisterSW";
import type { UserMenuUser } from "@/components/shared/UserMenu";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Budget Tracker",
  description: "Personal budget tracker",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Budget Tracker",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d9488",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();
  const pathname = (await headers()).get("x-pathname") ?? "";
  if (!user && pathname !== "/login") redirect("/login");

  const categories = user ? await getCategories(user.id) : [];
  const dict = await getDictionary();

  const menuUser: UserMenuUser | null = user
    ? {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      }
    : null;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme')||'system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();",
          }}
        />
        <ThemeProvider>
          <I18nProvider dict={dict}>
            <AppFrame user={menuUser} categories={categories}>
              {children}
            </AppFrame>
          </I18nProvider>
          <RegisterSW />
        </ThemeProvider>
      </body>
    </html>
  );
}
