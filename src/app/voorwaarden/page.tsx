import { CalendarClock, Scale, Users } from "lucide-react";
import type { Metadata } from "next";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { PageHero } from "@/components/page-hero";
import { CONTACT_EMAIL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Voorwaarden",
  description: "De spelregels voor het gebruik van Slime Score: gratis, eerlijk en voor de lol.",
};

export default function TermsPage() {
  return (
    <main className="page-shell">
      <header className="mb-6 grid gap-4">
        <Brand />
        <PageHero
          title="Voorwaarden"
          subtitle="Slime Score is een gratis WK-poule voor de lol. Hou het sportief, dan houdt iedereen het leuk."
        />
      </header>

      <section className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <article className="panel p-5">
          <div className="flex items-center gap-3">
            <Scale aria-hidden="true" className="size-7 text-[#064ed6]" />
            <h2 className="text-2xl font-bold text-[#081634]">Eerlijk spel</h2>
          </div>
          <ul className="mt-4 grid gap-2 text-sm font-medium leading-7 text-[#48617f]">
            <li>Slime Score is gratis voor deelnemers.</li>
            <li>Eén account per persoon; geen nepaccounts om de ranglijst te beïnvloeden.</li>
            <li>Kies een nette bijnaam en teamnaam. Kwetsende namen kunnen worden verwijderd.</li>
            <li>Bij misbruik kunnen we toegang of een WK-poule-account intrekken.</li>
          </ul>
        </article>

        <article className="panel p-5">
          <div className="flex items-center gap-3">
            <CalendarClock aria-hidden="true" className="size-7 text-[#25a84a]" />
            <h2 className="text-2xl font-bold text-[#081634]">Deadlines en uitslagen</h2>
          </div>
          <ul className="mt-4 grid gap-2 text-sm font-medium leading-7 text-[#48617f]">
            <li>Voorspellingen tellen alleen mee als ze vóór de deadline zijn opgeslagen.</li>
            <li>Uitslagen en punten worden zo zorgvuldig mogelijk verwerkt.</li>
            <li>Bij een fout of onduidelijkheid beslist de organisatie; we corrigeren waar nodig.</li>
            <li>De puntentelling staat uitgelegd op de <a className="font-bold text-[#064ed6]" href="/regels">regelspagina</a>.</li>
          </ul>
        </article>

        <article className="panel p-5 lg:col-span-2">
          <div className="flex items-center gap-3">
            <Users aria-hidden="true" className="size-7 text-[#e1262f]" />
            <h2 className="text-2xl font-bold text-[#081634]">WK-poules en berichten</h2>
          </div>
          <ul className="mt-4 grid gap-2 text-sm font-medium leading-7 text-[#48617f]">
            <li>Beheerders en moderators zijn verantwoordelijk voor de berichten in hun WK-poule.</li>
            <li>Deel je geheime WK-poulecode alleen met mensen die je vertrouwt.</li>
            <li>We kunnen deze voorwaarden aanpassen; grote wijzigingen melden we in de app.</li>
            <li>
              Vragen? Mail <a className="font-bold text-[#064ed6]" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </li>
          </ul>
        </article>
      </section>

      <p className="mt-5 text-sm font-medium text-[#48617f]">
        Lees ook ons <a className="font-bold text-[#064ed6]" href="/privacy">privacybeleid</a>.
      </p>

      <BottomNav current="/voorwaarden" />
    </main>
  );
}
