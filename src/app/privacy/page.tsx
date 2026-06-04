import { Cookie, Database, Lock, Mail, ShieldCheck, Trash2 } from "lucide-react";
import type { Metadata } from "next";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { PageHero } from "@/components/page-hero";
import { APP_VERSION, COMPANY_NAME, COMPANY_URL, CONTACT_EMAIL, MAIL_FROM } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Hoe Slime Score met je gegevens omgaat: minimale data en geen tracking-cookies.",
  alternates: { canonical: "/privacy" },
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
            <h2 className="text-2xl font-bold text-[#081634]">Welke gegevens</h2>
          </div>
          <ul className="mt-4 grid gap-2 text-sm font-medium leading-7 text-[#48617f]">
            <li>Je e-mailadres, alleen om in te loggen via een eenmalige link.</li>
            <li>Je bijnaam, teamnaam en gekozen avatar, zichtbaar in de ranglijst.</li>
            <li>Je WK 2026-voorspellingen, je scores en in welke WK-poules je zit.</li>
            <li>Berichten die je op het prikbord van een WK-poule plaatst.</li>
            <li>Geen wachtwoorden, geen telefoonnummer, geen advertentie-ID&rsquo;s, geen IP-logging voor tracking.</li>
          </ul>
        </article>

        <article className="panel p-5">
          <div className="flex items-center gap-3">
            <Lock aria-hidden="true" className="size-7 text-[#25a84a]" />
            <h2 className="text-2xl font-bold text-[#081634]">Waarvoor en hoe</h2>
          </div>
          <ul className="mt-4 grid gap-2 text-sm font-medium leading-7 text-[#48617f]">
            <li>Alleen om de WK-poule te laten werken: inloggen, voorspellen en ranglijsten.</li>
            <li>Opgeslagen bij onze databaseleverancier Supabase, met toegangsbeveiliging.</li>
            <li>Je voorspellingen blijven privé tot de deadline.</li>
            <li>We verkopen je gegevens niet en delen ze niet met advertentienetwerken.</li>
          </ul>
        </article>

        <article className="panel p-5">
          <div className="flex items-center gap-3">
            <Cookie aria-hidden="true" className="size-7 text-[#e1262f]" />
            <h2 className="text-2xl font-bold text-[#081634]">Cookies en e-mail</h2>
          </div>
          <ul className="mt-4 grid gap-2 text-sm font-medium leading-7 text-[#48617f]">
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
            <h2 className="text-2xl font-bold text-[#081634]">Jouw controle</h2>
          </div>
          <ul className="mt-4 grid gap-2 text-sm font-medium leading-7 text-[#48617f]">
            <li>Je kunt je account en gegevens laten verwijderen.</li>
            <li>Je kunt opvragen welke gegevens we van je hebben.</li>
            <li className="flex items-center gap-2">
              <Mail aria-hidden="true" className="size-4 text-[#064ed6]" />
              <a className="font-bold text-[#064ed6]" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
          <p className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#f4fbf0] px-3 py-2 text-sm font-bold text-[#137c35]">
            <ShieldCheck aria-hidden="true" className="size-5" />
            Gratis · geen onnodige data · privé
          </p>
        </article>
      </section>

      <section className="panel mt-4 p-5">
        <div className="flex items-center gap-3">
          <ShieldCheck aria-hidden="true" className="size-7 text-[#064ed6]" />
          <h2 className="text-2xl font-bold text-[#081634]">Details &amp; je rechten (AVG)</h2>
        </div>
        <div className="mt-4 grid gap-4 text-sm font-medium leading-7 text-[#48617f]">
          <div>
            <h3 className="font-bold text-[#081634]">Wie is verantwoordelijke</h3>
            <p>
              Slime Score is een product van {COMPANY_NAME} (
              <a className="font-semibold text-[#064ed6]" href={COMPANY_URL} target="_blank" rel="noopener noreferrer">
                {COMPANY_URL.replace("https://", "")}
              </a>
              ), de verwerkingsverantwoordelijke voor je gegevens. Vragen of verzoeken? Mail{" "}
              <a className="font-bold text-[#064ed6]" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-[#081634]">Waarom we dit mogen verwerken (grondslag)</h3>
            <p>
              We verwerken je gegevens om de poule te kunnen leveren waar je je voor aanmeldt (uitvoering van de
              overeenkomst). Voor kind-accounts gebeurt dit op basis van toestemming van de ouder/verzorger, die het
              account aanmaakt. We gebruiken je gegevens niet voor reclame en verkopen ze nooit.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-[#081634]">Hoelang we het bewaren</h3>
            <p>
              We bewaren je gegevens zolang je account bestaat. Verwijder je je account, dan wissen we je profiel,
              voorspellingen, scores, poule-deelnames en prikbordberichten. Inactieve accounts ruimen we uiterlijk na
              afloop van het toernooi op verzoek of na een redelijke periode op.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-[#081634]">Met wie we gegevens delen (verwerkers)</h3>
            <p>
              We delen alleen met partijen die ons helpen de dienst te draaien, onder een verwerkersovereenkomst:
              <strong className="text-[#081634]"> Supabase</strong> (database &amp; inloggen),
              <strong className="text-[#081634]"> Vercel</strong> (hosting) en onze
              e-mailverzender voor de inlogmails. Vlaggen en lettertypes serveren we vanaf onze eigen site, dus daarbij
              gaat geen data naar derden. Sommige van deze leveranciers verwerken (mede) in de VS; dat gebeurt onder
              passende waarborgen (EU-VS Data Privacy Framework of standaardcontractbepalingen).
            </p>
          </div>
          <div>
            <h3 className="font-bold text-[#081634]">Kinderen</h3>
            <p>
              Kind-accounts (inloggen met alleen een code, zonder e-mail) worden uitsluitend door een ouder/verzorger
              of poulebeheerder aangemaakt en beheerd. We slaan voor een kind alleen een bijnaam, teamnaam, avatar en
              de spelvoortgang op — geen e-mailadres. Wil je een kind-account laten verwijderen, mail ons.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-[#081634]">Jouw rechten</h3>
            <p>
              Je hebt recht op inzage, correctie, verwijdering en overdracht (een kopie) van je gegevens, en je mag
              bezwaar maken tegen de verwerking. Het meeste regel je zelf via{" "}
              <a className="font-bold text-[#064ed6]" href="/account">Mijn account</a>; voor de rest helpen we je via{" "}
              <a className="font-bold text-[#064ed6]" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Ben je het
              ergens niet mee eens? Je mag een klacht indienen bij de{" "}
              <a
                className="font-bold text-[#064ed6]"
                href="https://www.autoriteitpersoonsgegevens.nl"
                target="_blank"
                rel="noopener noreferrer"
              >
                Autoriteit Persoonsgegevens
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <p className="mt-5 text-sm font-medium text-[#48617f]">
        Zie ook onze <a className="font-bold text-[#064ed6]" href="/voorwaarden">voorwaarden</a>.
      </p>
      <p className="mt-2 text-xs font-medium text-[#7a879b]">
        Slime Score is een bèta-product (v{APP_VERSION}) van{" "}
        <a className="font-semibold text-[#064ed6]" href={COMPANY_URL} target="_blank" rel="noopener noreferrer">
          {COMPANY_NAME}
        </a>
        . Contact: <a className="font-semibold text-[#064ed6]" href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      <BottomNav current="/privacy" />
    </main>
  );
}
