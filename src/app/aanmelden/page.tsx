import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Brand } from "@/components/brand";
import { LoginForm } from "@/components/login-form";
import { createClient } from "@/lib/supabase/server";

export default async function AanmeldenPage({
  searchParams,
}: {
  searchParams: Promise<{ auth?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/voorspellingen");

  return (
    <main className="auth-flow-shell min-h-screen">
      <div className="auth-flow-bg" aria-hidden="true" />
      <section className="auth-flow-panel">
        <Link href="/" className="auth-flow-back" aria-label="Terug naar home">
          <ArrowLeft aria-hidden="true" className="size-5" />
        </Link>
        <div className="auth-flow-progress" aria-label="Stap 1 van 3">
          <span className="is-active" />
          <span />
          <span />
        </div>
        <Brand />
        <h1 className="pl-1.5 text-3xl font-black leading-tight text-white sm:text-4xl">Aanmelden</h1>

        <div className="auth-flow-card">
          {params.auth === "fout" ? (
            <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-800">
              Deze bevestigingslink is verlopen. Maak hieronder opnieuw een account aan of vraag een nieuwe bevestigingsmail aan.
            </div>
          ) : null}
          <LoginForm surface="inline" initialMode="login" />
        </div>

        <div className="auth-flow-note">
          <CheckCircle2 aria-hidden="true" className="size-5" />
          <span>Na aanmelden vul je direct je scores en WK-poule in.</span>
        </div>
      </section>
    </main>
  );
}
