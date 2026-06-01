import { BookOpen, CalendarClock, Database, ShieldCheck } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { ENTRY_DEADLINE_ISO, POST_GROUP_DEADLINE_ISO, scoringRules, SLIME_GAME_URL } from "@/lib/constants";

export default function RulesPage() {
  return (
    <main className="page-shell">
      <header className="mb-6 grid gap-4 md:max-w-3xl">
        <Brand />
        <div>
          <h1 className="text-4xl font-black leading-none text-white">Regels en uitleg</h1>
          <p className="mt-2 max-w-2xl text-base font-semibold leading-7 text-blue-100">
            Kort genoeg om te lezen, precies genoeg om discussie in de groepsapp te voorkomen.
          </p>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <article className="panel p-5">
          <div className="flex items-center gap-3">
            <CalendarClock aria-hidden="true" className="size-7 text-[#064ed6]" />
            <h2 className="text-2xl font-black text-[#081634]">Deadlines</h2>
          </div>
          <div className="mt-4 grid gap-3 text-sm font-semibold leading-7 text-[#48617f]">
            <p>
              Alle hoofdvoorspellingen sluiten op{" "}
              <strong className="text-[#081634]">
                {new Intl.DateTimeFormat("nl-NL", {
                  timeZone: "Europe/Amsterdam",
                  dateStyle: "full",
                  timeStyle: "short",
                }).format(new Date(ENTRY_DEADLINE_ISO))}
              </strong>
              .
            </p>
            <p>
              Op 28 juni is er tot{" "}
              <strong className="text-[#081634]">
                {new Intl.DateTimeFormat("nl-NL", {
                  timeZone: "Europe/Amsterdam",
                  dateStyle: "full",
                  timeStyle: "short",
                }).format(new Date(POST_GROUP_DEADLINE_ISO))}
              </strong>{" "}
              een optionele update voor finalisten, kampioen en knock-outstatistieken.
            </p>
          </div>
        </article>

        <article className="panel p-5">
          <div className="flex items-center gap-3">
            <BookOpen aria-hidden="true" className="size-7 text-[#25a84a]" />
            <h2 className="text-2xl font-black text-[#081634]">Puntentelling</h2>
          </div>
          <div className="mt-4 grid gap-2">
            {scoringRules.map((rule) => (
              <div key={rule.label} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3 text-[#081634]">
                <span className="font-bold">{rule.label}</span>
                <span className="font-black">{rule.points} pt</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm font-semibold leading-7 text-[#48617f]">
            Per wedstrijd is 12 punten het maximum. Bij een exacte uitslag stapelen de deelpunten niet door; bij een
            gedeeltelijk goede voorspelling tellen juiste richting, doelsaldo en teamgoals wel samen op.
          </p>
          <p className="mt-3 text-sm font-semibold leading-7 text-[#48617f]">
            De laatste 32 worden automatisch berekend uit je voorspelde groepsstanden: nummers 1 en 2 plus de beste
            acht nummers 3. De kampioen blijft onder 8% van het totale puntenpakket.
          </p>
          <p className="mt-3 text-sm font-semibold leading-7 text-[#48617f]">
            Gelijke stand? Dan kijken we achtereenvolgens naar meeste exacte uitslagen, meeste juiste resultaten,
            bonuspunten en daarna vroegste volledige inzending.
          </p>
        </article>

        <article className="panel p-5">
          <div className="flex items-center gap-3">
            <ShieldCheck aria-hidden="true" className="size-7 text-[#064ed6]" />
            <h2 className="text-2xl font-black text-[#081634]">Poules</h2>
          </div>
          <ul className="mt-4 grid gap-2 text-sm font-semibold leading-7 text-[#48617f]">
            <li>Iedereen doet mee in de algemene ranglijst.</li>
            <li>Je kunt in meerdere subpoules zitten.</li>
            <li>Een subpoule heeft een beheerder en een geheime code.</li>
            <li>Beheerders kunnen deelnemers verwijderen en moderators aanwijzen.</li>
            <li>Beheerders en moderators kunnen de poule aankleden en berichten plaatsen.</li>
            <li>Subpoules krijgen een ranglijst op de score van hun beste 4 spelers.</li>
          </ul>
        </article>

        <article className="panel p-5">
          <div className="flex items-center gap-3">
            <Database aria-hidden="true" className="size-7 text-[#e1262f]" />
            <h2 className="text-2xl font-black text-[#081634]">Data en uitslagen</h2>
          </div>
          <p className="mt-4 text-sm font-semibold leading-7 text-[#48617f]">
            Je voorspellingen zijn privé tot de deadline. Zodra uitslagen binnenkomen, wordt de ranglijst opnieuw
            berekend: eerst de wedstrijdpunten, daarna rondekeuzes, kampioen en bonusvragen.
          </p>
          <a className="button-secondary mt-4" href={SLIME_GAME_URL} target="_blank" rel="noopener noreferrer">
            Bonusgame openen
          </a>
        </article>
      </section>

      <BottomNav current="/regels" />
    </main>
  );
}
