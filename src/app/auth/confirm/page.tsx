import { Brand } from "@/components/brand";
import { AuthConfirmClient } from "./client";

export default function AuthConfirmPage() {
  return (
    <main className="page-shell grid min-h-screen content-center gap-5">
      <Brand />
      <section className="panel grid gap-3 p-5">
        <div className="inline-flex w-fit rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-[#0f7a39]">
          Bevestiging geopend
        </div>
        <h1 className="text-3xl font-bold leading-none text-[#081634]">We bevestigen je account</h1>
        <p className="text-sm font-medium leading-6 text-[#48617f]">
          Je registratie wordt veilig afgerond. Duurt dit langer dan een paar seconden, vraag dan een nieuwe
          bevestigingsmail aan.
        </p>
        <AuthConfirmClient />
      </section>
    </main>
  );
}
