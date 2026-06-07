import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Brand } from "@/components/brand";
import { LoginForm } from "@/components/login-form";
import { localizedHref, type Locale } from "@/lib/i18n";
import { getServerLocale } from "@/lib/server-locale";
import { createClient } from "@/lib/supabase/server";

const aanmeldenCopy = {
  nl: {
    back: "Terug naar home",
    progress: "Stap 1 van 3",
    title: "Aanmelden",
    expired: "Deze bevestigingslink is verlopen. Maak hieronder opnieuw een account aan of vraag een nieuwe bevestigingsmail aan.",
    note: "Na aanmelden vul je je poule in.",
  },
  en: {
    back: "Back to home",
    progress: "Step 1 of 3",
    title: "Sign up",
    expired: "This confirmation link has expired. Create an account again below or request a new confirmation email.",
    note: "After signing up, fill in your pool predictions.",
  },
} satisfies Record<Locale, Record<string, string>>;

export default async function AanmeldenPage({
  searchParams,
}: {
  searchParams: Promise<{ auth?: string }>;
}) {
  const locale = await getServerLocale();
  const copy = aanmeldenCopy[locale];
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect(localizedHref("/voorspellingen", locale));

  return (
    <main className="auth-flow-shell min-h-screen">
      <div className="auth-flow-bg" aria-hidden="true" />
      <section className="auth-flow-panel">
        <Link href={localizedHref("/", locale)} className="auth-flow-back" aria-label={copy.back}>
          <ArrowLeft aria-hidden="true" className="size-5" />
        </Link>
        <div className="auth-flow-progress" aria-label={copy.progress}>
          <span className="is-active" />
          <span />
          <span />
        </div>
        <Brand locale={locale} />
        <h1 className="pl-1.5 text-3xl font-black leading-tight text-white sm:text-4xl">{copy.title}</h1>

        <div className="auth-flow-card">
          {params.auth === "fout" ? (
            <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-800">
              {copy.expired}
            </div>
          ) : null}
          <LoginForm surface="inline" initialMode="login" locale={locale} />
        </div>

        <div className="auth-flow-note">
          <CheckCircle2 aria-hidden="true" className="size-5" />
          <span>{copy.note}</span>
        </div>
      </section>
    </main>
  );
}
