import { Cookie, Database, Lock, Mail, ShieldCheck, Trash2 } from "lucide-react";
import type { Metadata } from "next";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { PageHero } from "@/components/page-hero";
import { APP_VERSION, COMPANY_NAME, COMPANY_URL, CONTACT_EMAIL, MAIL_FROM } from "@/lib/constants";
import { localizedHref, type Locale } from "@/lib/i18n";
import { getServerLocale } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return {
    title: locale === "en" ? "Privacy policy" : "Privacy",
    description: locale === "en"
      ? "How SlimeScore handles your data: minimal data and no tracking cookies."
      : "Hoe SlimeScore met je gegevens omgaat: minimale data en geen tracking-cookies.",
    alternates: { canonical: "/privacy" },
  };
}

const privacyCopy = {
  nl: {
    title: "Privacy",
    subtitle: "Kort en eerlijk: we vragen zo min mogelijk en volgen je niet met tracking-cookies.",
    dataTitle: "Welke gegevens",
    dataItems: [
      "Je e-mailadres, alleen om in te loggen via een eenmalige link of wachtwoord.",
      "Je bijnaam, teamnaam en gekozen avatar, zichtbaar in de ranglijst.",
      "Je WK 2026-voorspellingen, je scores en in welke WK-poules je zit.",
      "Berichten die je op het prikbord van een WK-poule plaatst.",
      "Geen telefoonnummer, geen advertentie-ID’s en geen IP-logging voor tracking.",
    ],
    purposeTitle: "Waarvoor en hoe",
    purposeItems: [
      "Alleen om de WK-poule te laten werken: inloggen, voorspellen en ranglijsten.",
      "Opgeslagen bij onze databaseleverancier Supabase, met toegangsbeveiliging.",
      "Je voorspellingen blijven privé tot de deadline.",
      "We verkopen je gegevens niet en delen ze niet met advertentienetwerken.",
    ],
    cookiesTitle: "Cookies en e-mail",
    cookiesItems: [
      "Alleen noodzakelijke cookies om je ingelogd te houden en je taalkeuze te onthouden. Geen tracking-cookies.",
      "Geen analytics die je over websites volgt.",
    ],
    mailFrom: "Inlogmails komen van",
    controlTitle: "Jouw controle",
    controlItems: ["Je kunt je account en gegevens laten verwijderen.", "Je kunt opvragen welke gegevens we van je hebben."],
    badge: "Gratis · geen onnodige data · privé",
    detailsTitle: "Details & je rechten (AVG)",
    controllerTitle: "Wie is verantwoordelijke",
    controller: "SlimeScore is een product van",
    controllerSuffix: "de verwerkingsverantwoordelijke voor je gegevens. Vragen of verzoeken? Mail",
    basisTitle: "Waarom we dit mogen verwerken (grondslag)",
    basis: "We verwerken je gegevens om de poule te kunnen leveren waar je je voor aanmeldt (uitvoering van de overeenkomst). Voor kind-accounts gebeurt dit op basis van toestemming van de ouder/verzorger, die het account aanmaakt. We gebruiken je gegevens niet voor reclame en verkopen ze nooit.",
    retentionTitle: "Hoelang we het bewaren",
    retention: "We bewaren je gegevens zolang je account bestaat. Verwijder je je account, dan wissen we je profiel, voorspellingen, scores, poule-deelnames en prikbordberichten. Inactieve accounts ruimen we uiterlijk na afloop van het toernooi op verzoek of na een redelijke periode op.",
    processorsTitle: "Met wie we gegevens delen (verwerkers)",
    processors: "We delen alleen met partijen die ons helpen de dienst te draaien, onder een verwerkersovereenkomst: Supabase (database & inloggen), Vercel (hosting) en onze e-mailverzender voor de inlogmails. Vlaggen en lettertypes serveren we vanaf onze eigen site. Sommige leveranciers verwerken (mede) in de VS; dat gebeurt onder passende waarborgen.",
    childrenTitle: "Kinderen",
    children: "Kind-accounts (inloggen met alleen een code, zonder e-mail) worden uitsluitend door een ouder/verzorger of poulebeheerder aangemaakt en beheerd. We slaan voor een kind alleen een bijnaam, teamnaam, avatar en de spelvoortgang op — geen e-mailadres. Wil je een kind-account laten verwijderen, mail ons.",
    rightsTitle: "Jouw rechten",
    rights: "Je hebt recht op inzage, correctie, verwijdering en overdracht (een kopie) van je gegevens, en je mag bezwaar maken tegen de verwerking. Het meeste regel je zelf via",
    accountLink: "Mijn account",
    rightsSuffix: "voor de rest helpen we je via",
    complaint: "Ben je het ergens niet mee eens? Je mag een klacht indienen bij de Autoriteit Persoonsgegevens.",
    seeTerms: "Zie ook onze",
    terms: "voorwaarden",
    beta: "SlimeScore is een bèta-product",
    contact: "Contact",
  },
  en: {
    title: "Privacy policy",
    subtitle: "Short and honest: we ask for as little as possible and do not use tracking cookies.",
    dataTitle: "What data",
    dataItems: [
      "Your email address, only for signing in with a one-time link or password.",
      "Your nickname, team name and chosen avatar, visible in the ranking.",
      "Your World Cup 2026 predictions, scores and the World Cup pools you joined.",
      "Messages you post on a World Cup pool message board.",
      "No phone number, no advertising IDs and no IP logging for tracking.",
    ],
    purposeTitle: "Why and how",
    purposeItems: [
      "Only to make the World Cup pool work: sign-in, predictions and rankings.",
      "Stored with our database provider Supabase, with access controls.",
      "Your predictions stay private until the deadline.",
      "We do not sell your data and do not share it with ad networks.",
    ],
    cookiesTitle: "Cookies and email",
    cookiesItems: [
      "Only necessary cookies to keep you signed in and remember your language preference. No tracking cookies.",
      "No analytics that follow you across websites.",
    ],
    mailFrom: "Sign-in emails come from",
    controlTitle: "Your control",
    controlItems: ["You can delete your account and data.", "You can request which data we have about you."],
    badge: "Free · no unnecessary data · private",
    detailsTitle: "Details & your rights (GDPR)",
    controllerTitle: "Who is responsible",
    controller: "SlimeScore is a product of",
    controllerSuffix: "the controller for your data. Questions or requests? Email",
    basisTitle: "Why we may process this data (legal basis)",
    basis: "We process your data to provide the pool you sign up for (performance of the agreement). Child accounts are created with consent from the parent/guardian or pool manager. We do not use your data for advertising and never sell it.",
    retentionTitle: "How long we keep it",
    retention: "We keep your data while your account exists. If you delete your account, we remove your profile, predictions, scores, pool memberships and message-board posts. Inactive accounts are cleaned up on request or after a reasonable period following the tournament.",
    processorsTitle: "Who we share data with (processors)",
    processors: "We only share data with parties that help us run the service under a processing agreement: Supabase (database & sign-in), Vercel (hosting) and our email sender for sign-in emails. Flags and fonts are served from our own site. Some suppliers may process data in the US under appropriate safeguards.",
    childrenTitle: "Children",
    children: "Child accounts (code-only sign-in, without email) are created and managed only by a parent/guardian or pool manager. For a child we store only a nickname, team name, avatar and game progress — no email address. Email us if you want a child account removed.",
    rightsTitle: "Your rights",
    rights: "You have the right to access, correct, delete and transfer a copy of your data, and you may object to processing. You can manage most of this yourself via",
    accountLink: "My account",
    rightsSuffix: "for anything else we help via",
    complaint: "If you disagree with something, you may file a complaint with the Dutch Data Protection Authority.",
    seeTerms: "See also our",
    terms: "terms",
    beta: "SlimeScore is a beta product",
    contact: "Contact",
  },
} satisfies Record<Locale, Record<string, string | string[]>>;

export default async function PrivacyPage() {
  const locale = await getServerLocale();
  const copy = privacyCopy[locale];
  const dataItems = copy.dataItems as string[];
  const purposeItems = copy.purposeItems as string[];
  const cookiesItems = copy.cookiesItems as string[];
  const controlItems = copy.controlItems as string[];

  return (
    <main className="page-shell">
      <header className="mb-6 grid gap-4">
        <Brand locale={locale} />
        <PageHero title={copy.title as string} subtitle={copy.subtitle as string} />
      </header>

      <section className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <article className="panel p-5">
          <div className="flex items-center gap-3">
            <Database aria-hidden="true" className="size-7 text-[var(--accent-blue)]" />
            <h2 className="text-2xl font-bold text-[var(--ink)]">{copy.dataTitle as string}</h2>
          </div>
          <ul className="mt-4 grid gap-2 text-sm font-medium leading-7 text-[var(--text-muted)]">
            {dataItems.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>

        <article className="panel p-5">
          <div className="flex items-center gap-3">
            <Lock aria-hidden="true" className="size-7 text-[#25a84a]" />
            <h2 className="text-2xl font-bold text-[var(--ink)]">{copy.purposeTitle as string}</h2>
          </div>
          <ul className="mt-4 grid gap-2 text-sm font-medium leading-7 text-[var(--text-muted)]">
            {purposeItems.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>

        <article className="panel p-5">
          <div className="flex items-center gap-3">
            <Cookie aria-hidden="true" className="size-7 text-[#e1262f]" />
            <h2 className="text-2xl font-bold text-[var(--ink)]">{copy.cookiesTitle as string}</h2>
          </div>
          <ul className="mt-4 grid gap-2 text-sm font-medium leading-7 text-[var(--text-muted)]">
            {cookiesItems.map((item) => <li key={item}>{item}</li>)}
            <li>{copy.mailFrom as string} <strong className="text-[var(--ink)]">{MAIL_FROM}</strong>.</li>
          </ul>
        </article>

        <article className="panel p-5">
          <div className="flex items-center gap-3">
            <Trash2 aria-hidden="true" className="size-7 text-[var(--accent-blue)]" />
            <h2 className="text-2xl font-bold text-[var(--ink)]">{copy.controlTitle as string}</h2>
          </div>
          <ul className="mt-4 grid gap-2 text-sm font-medium leading-7 text-[var(--text-muted)]">
            {controlItems.map((item) => <li key={item}>{item}</li>)}
            <li className="flex items-center gap-2">
              <Mail aria-hidden="true" className="size-4 text-[var(--accent-blue)]" />
              <a className="font-bold text-[var(--accent-blue)]" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </li>
          </ul>
          <p className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#f4fbf0] px-3 py-2 text-sm font-bold text-[#137c35]">
            <ShieldCheck aria-hidden="true" className="size-5" />
            {copy.badge as string}
          </p>
        </article>
      </section>

      <section className="panel mt-4 p-5">
        <div className="flex items-center gap-3">
          <ShieldCheck aria-hidden="true" className="size-7 text-[var(--accent-blue)]" />
          <h2 className="text-2xl font-bold text-[var(--ink)]">{copy.detailsTitle as string}</h2>
        </div>
        <div className="mt-4 grid gap-4 text-sm font-medium leading-7 text-[var(--text-muted)]">
          <div><h3 className="font-bold text-[var(--ink)]">{copy.controllerTitle as string}</h3><p>{copy.controller as string} {COMPANY_NAME} (<a className="font-semibold text-[var(--accent-blue)]" href={COMPANY_URL} target="_blank" rel="noopener noreferrer">{COMPANY_URL.replace("https://", "")}</a>), {copy.controllerSuffix as string} <a className="font-bold text-[var(--accent-blue)]" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</p></div>
          <div><h3 className="font-bold text-[var(--ink)]">{copy.basisTitle as string}</h3><p>{copy.basis as string}</p></div>
          <div><h3 className="font-bold text-[var(--ink)]">{copy.retentionTitle as string}</h3><p>{copy.retention as string}</p></div>
          <div><h3 className="font-bold text-[var(--ink)]">{copy.processorsTitle as string}</h3><p>{copy.processors as string}</p></div>
          <div><h3 className="font-bold text-[var(--ink)]">{copy.childrenTitle as string}</h3><p>{copy.children as string}</p></div>
          <div>
            <h3 className="font-bold text-[var(--ink)]">{copy.rightsTitle as string}</h3>
            <p>
              {copy.rights as string} <a className="font-bold text-[var(--accent-blue)]" href={localizedHref("/account", locale)}>{copy.accountLink as string}</a>; {copy.rightsSuffix as string} <a className="font-bold text-[var(--accent-blue)]" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. {copy.complaint as string}
            </p>
          </div>
        </div>
      </section>

      <p className="mt-5 text-sm font-medium text-[var(--text-muted)]">
        {copy.seeTerms as string} <a className="font-bold text-[var(--accent-blue)]" href={localizedHref("/voorwaarden", locale)}>{copy.terms as string}</a>.
      </p>
      <p className="mt-2 text-xs font-medium text-[#7a879b]">
        {copy.beta as string} (v{APP_VERSION}) van{" "}
        <a className="font-semibold text-[var(--accent-blue)]" href={COMPANY_URL} target="_blank" rel="noopener noreferrer">{COMPANY_NAME}</a>.
        {" "}{copy.contact as string}: <a className="font-semibold text-[var(--accent-blue)]" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <BottomNav current="/privacy" />
    </main>
  );
}
