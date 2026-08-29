import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDictionary, getT } from "@/lib/i18n";
import SignInButton from "@/components/SignInButton";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  const t = getT(await getDictionary());

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-lg border border-border bg-card p-8 text-center text-card-foreground shadow-lg">
        <h1 className="mb-2 text-2xl font-bold">{t("app.name")}</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          {t("login.subtitle")}
        </p>
        <SignInButton />
      </div>
    </div>
  );
}
