import { Cookie, Database, Lock, Mail, ShieldCheck, Trash2 } from "lucide-react";
import type { Metadata } from "next";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { PageHero } from "@/components/page-hero";
import { APP_VERSION, COMPANY_NAME, COMPANY_URL, CONTACT_EMAIL, MAIL_FROM } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Hoe Slime Score met je gegevens omgaat: minimale data en geen tracking-cookies.",
};

export default function PrivacyPage() {
  return (
    <main className="page-shell">
      <header className="mb-6 grid gap-4">
        <Brand />
        <PageHero
          title="Privacy"
          subtitle="Kort en eerlijk: we vragen zo min mogelijk en volgen je niet met tracking-cookies."
        />
      </header>

      <section className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <article className="panel p-5">
          <div className="flex items-center gap-3">
            <Database aria-hidden="true" className="size-7 text-[#064ed6]" />
            <h2 className="text-2xl font-black text-[#081634]">Welke gegevens</h2>
          </div>
          <ul className="mt-4 grid gap-2 text-sm font-semibold leading-7 text-[#48617f]">
            <li>Je e-mailadres, alleen om in te loggen via een eenmalige link.</li>
            <li>Je bijnaam en teamnaam, zichtbaar in de ranglijst.</li>
            <li>Je voorspellingen en in welke poules je zit.</li>
            <li>Geen wachtwoorden, geen telefoonnummer, geen advertentie-ID&rsquo;s.</li>
          </ul>
        </article>

        <article className="panel p-5">
          <div className="flex items-center gap-3">
            <Lock aria-hidden="true" className="size-7 text-[#25a84a]" />
            <h2 className="text-2xl font-black text-[#081634]">Waarvoor en hoe</h2>
          </div>
          <ul className="mt-4 grid gap-2 text-sm font-semibold leading-7 text-[#48617f]">
            <li>Alleen om de poule te laten werken: inloggen, voorspellen en ranglijsten.</li>
            <li>Opgeslagen bij onze databaseleverancier Supabase, met toegangsbeveiliging.</li>
            <li>Je voorspellingen blijven privé tot de deadline.</li>
            <li>We verkopen je gegevens niet en delen ze niet met advertentienetwerken.</li>
          </ul>
        </article>

        <article className="panel p-5">
          <div className="flex items-center gap-3">
            <Cookie aria-hidden="true" className="size-7 text-[#e1262f]" />
            <h2 className="text-2xl font-black text-[#081634]">Cookies en e-mail</h2>
          </div>
          <ul className="mt-4 grid gap-2 text-sm font-semibold leading-7 text-[#48617f]">
            <li>Alleen noodzakelijke cookies om je ingelogd te houden. Geen tracking-cookies.</li>
            <li>Geen analytics die je over websites volgt.</li>
            <li>
              Inlogmails komen van <strong className="text-[#081634]">{MAIL_FROM}</strong>. Antwoorden hoeft niet.
            </li>
          </ul>
        </article>

        <article className="panel p-5">
          <div className="flex items-center gap-3">
            <Trash2 aria-hidden="true" className="size-7 text-[#064ed6]" />
            <h2 className="text-2xl font-black text-[#081634]">Jouw controle</h2>
          </div>
          <ul className="mt-4 grid gap-2 text-sm font-semibold leading-7 text-[#48617f]">
            <li>Je kunt je account en gegevens laten verwijderen.</li>
            <li>Je kunt opvragen welke gegevens we van je hebben.</li>
            <li className="flex items-center gap-2">
              <Mail aria-hidden="true" className="size-4 text-[#064ed6]" />
              <a className="font-black text-[#064ed6]" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
          <p className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#f4fbf0] px-3 py-2 text-sm font-black text-[#137c35]">
            <ShieldCheck aria-hidden="true" className="size-5" />
            Gratis · geen onnodige data · privé
          </p>
        </article>
      </section>

      <p className="mt-5 text-sm font-semibold text-[#48617f]">
        Zie ook onze <a className="font-extrabold text-[#064ed6]" href="/voorwaarden">voorwaarden</a>.
      </p>
      <p className="mt-2 text-xs font-semibold text-[#7a879b]">
        Slime Score is een bèta-product (v{APP_VERSION}) van{" "}
        <a className="font-bold text-[#064ed6]" href={COMPANY_URL} target="_blank" rel="noopener noreferrer">
          {COMPANY_NAME}
        </a>
        . Contact: <a className="font-bold text-[#064ed6]" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <BottomNav current="/privacy" showPrivate={false} />
    </main>
  );
}
