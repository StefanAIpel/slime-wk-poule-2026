import { CalendarClock, Scale, Users } from "lucide-react";
import type { Metadata } from "next";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { PageHero } from "@/components/page-hero";
import { CONTACT_EMAIL } from "@/lib/constants";
import { localizedHref, type Locale } from "@/lib/i18n";
import { getServerLocale } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return {
    title: locale === "en" ? "Terms of use" : "Voorwaarden",
    description: locale === "en"
      ? "The rules for using Slime Score: free, fair and for fun."
      : "De spelregels voor het gebruik van Slime Score: gratis, eerlijk en voor de lol.",
    alternates: { canonical: "/voorwaarden" },
  };
}

const termsCopy = {
  nl: {
    title: "Voorwaarden",
    subtitle: "Slime Score is een gratis WK-poule voor de lol. Hou het sportief, dan houdt iedereen het leuk.",
    fairTitle: "Eerlijk spel",
    fairItems: [
      "Slime Score is gratis voor deelnemers.",
      "Eén account per persoon; geen nepaccounts om de ranglijst te beïnvloeden.",
      "Kies een nette bijnaam en teamnaam. Kwetsende namen kunnen worden verwijderd.",
      "Bij misbruik kunnen we toegang of een WK-poule-account intrekken.",
    ],
    deadlinesTitle: "Deadlines en uitslagen",
    deadlinesItems: [
      "Voorspellingen tellen alleen mee als ze vóór de deadline zijn opgeslagen.",
      "Uitslagen en punten worden zo zorgvuldig mogelijk verwerkt.",
      "Bij een fout of onduidelijkheid beslist de organisatie; we corrigeren waar nodig.",
    ],
    scoringBefore: "De puntentelling staat uitgelegd op de",
    scoringLink: "regelspagina",
    poolsTitle: "WK-poules en berichten",
    poolItems: [
      "Beheerders en moderators zijn verantwoordelijk voor de berichten in hun WK-poule.",
      "Deel je geheime WK-poulecode alleen met mensen die je vertrouwt.",
      "We kunnen deze voorwaarden aanpassen; grote wijzigingen melden we in de app.",
    ],
    questions: "Vragen? Mail",
    readPrivacy: "Lees ook ons",
    privacy: "privacybeleid",
  },
  en: {
    title: "Terms of use",
    subtitle: "Slime Score is a free World Cup pool for fun. Keep it sporty so everyone can enjoy it.",
    fairTitle: "Fair play",
    fairItems: [
      "Slime Score is free for participants.",
      "One account per person; no fake accounts to influence the ranking.",
      "Choose a decent nickname and team name. Offensive names may be removed.",
      "In case of abuse, we may revoke access or a World Cup pool account.",
    ],
    deadlinesTitle: "Deadlines and results",
    deadlinesItems: [
      "Predictions count only if they are saved before the deadline.",
      "Results and points are processed as carefully as possible.",
      "If there is an error or ambiguity, the organisation decides; we correct where needed.",
    ],
    scoringBefore: "The scoring system is explained on the",
    scoringLink: "rules page",
    poolsTitle: "World Cup pools and messages",
    poolItems: [
      "Managers and moderators are responsible for the messages in their World Cup pool.",
      "Share your secret World Cup pool code only with people you trust.",
      "We may update these terms; major changes are announced in the app.",
    ],
    questions: "Questions? Email",
    readPrivacy: "Also read our",
    privacy: "privacy policy",
  },
} satisfies Record<Locale, Record<string, string | string[]>>;

export default async function TermsPage() {
  const locale = await getServerLocale();
  const copy = termsCopy[locale];
  const fairItems = copy.fairItems as string[];
  const deadlinesItems = copy.deadlinesItems as string[];
  const poolItems = copy.poolItems as string[];

  return (
    <main className="page-shell">
      <header className="mb-6 grid gap-4">
        <Brand locale={locale} />
        <PageHero title={copy.title as string} subtitle={copy.subtitle as string} />
      </header>

      <section className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <article className="panel p-5">
          <div className="flex items-center gap-3">
            <Scale aria-hidden="true" className="size-7 text-[var(--accent-blue)]" />
            <h2 className="text-2xl font-bold text-[var(--ink)]">{copy.fairTitle as string}</h2>
          </div>
          <ul className="mt-4 grid gap-2 text-sm font-medium leading-7 text-[var(--text-muted)]">
            {fairItems.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>

        <article className="panel p-5">
          <div className="flex items-center gap-3">
            <CalendarClock aria-hidden="true" className="size-7 text-[#25a84a]" />
            <h2 className="text-2xl font-bold text-[var(--ink)]">{copy.deadlinesTitle as string}</h2>
          </div>
          <ul className="mt-4 grid gap-2 text-sm font-medium leading-7 text-[var(--text-muted)]">
            {deadlinesItems.map((item) => <li key={item}>{item}</li>)}
            <li>{copy.scoringBefore as string} <a className="font-bold text-[var(--accent-blue)]" href={localizedHref("/regels", locale)}>{copy.scoringLink as string}</a>.</li>
          </ul>
        </article>

        <article className="panel p-5 lg:col-span-2">
          <div className="flex items-center gap-3">
            <Users aria-hidden="true" className="size-7 text-[#e1262f]" />
            <h2 className="text-2xl font-bold text-[var(--ink)]">{copy.poolsTitle as string}</h2>
          </div>
          <ul className="mt-4 grid gap-2 text-sm font-medium leading-7 text-[var(--text-muted)]">
            {poolItems.map((item) => <li key={item}>{item}</li>)}
            <li>{copy.questions as string} <a className="font-bold text-[var(--accent-blue)]" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</li>
          </ul>
        </article>
      </section>

      <p className="mt-5 text-sm font-medium text-[var(--text-muted)]">
        {copy.readPrivacy as string} <a className="font-bold text-[var(--accent-blue)]" href={localizedHref("/privacy", locale)}>{copy.privacy as string}</a>.
      </p>

      <BottomNav current="/voorwaarden" />
    </main>
  );
}
