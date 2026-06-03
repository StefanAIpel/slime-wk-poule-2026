import { BookOpen, CalendarClock, Database, HelpCircle, ShieldCheck } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { PageHero } from "@/components/page-hero";
import { ENTRY_DEADLINE_ISO, POST_GROUP_DEADLINE_ISO, scoringRules } from "@/lib/constants";

const faq: { q: string; a: string }[] = [
  { q: "Is meedoen gratis?", a: "Ja, helemaal gratis. Geen advertenties en geen tracking-cookies." },
  { q: "Heb ik een wachtwoord nodig?", a: "Nee. Je logt in met een eenmalige link die we naar je e-mailadres sturen." },
  {
    q: "Tot wanneer kan ik invullen?",
    a: "Je groepswedstrijden en de meeste bonusvragen sluiten bij de aftrap op 11 juni 21:00. Wereldkampioen, finalisten, penaltyseries en 'hoe ver komt Oranje' blijf je aanpassen t/m 28 juni 21:00.",
  },
  { q: "Zijn mijn voorspellingen privé?", a: "Ja, tot de deadline. Daarna zijn ze zichtbaar voor je medespelers in dezelfde subpoule. Je e-mailadres blijft altijd privé." },
  { q: "Hoe werkt de laatste 32?", a: "Die rekenen we automatisch uit jouw voorspelde groepsstanden: de nummers 1 en 2 plus de beste acht nummers 3." },
  { q: "Kan ik in meerdere subpoules zitten?", a: "Ja. Maak je eigen subpoule met een deelcode of sluit aan bij bestaande poules van familie, vrienden of collega's." },
  { q: "Wat gebeurt er bij een gelijke stand?", a: "We kijken achtereenvolgens naar meeste exacte uitslagen, meeste juiste resultaten, bonuspunten en daarna de vroegste volledige inzending." },
  { q: "Kan ik mijn account verwijderen?", a: "Ja, via Mijn account. Daarmee verdwijnen je profiel, voorspellingen, scores en deelnames definitief." },
];

export default function RulesPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <main className="page-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <header className="mb-6 grid gap-4">
        <Brand />
        <PageHero
          title="Regels en uitleg"
          subtitle="Kort, duidelijk en net precies genoeg voor discussie in de groepsapp."
          slime="/assets/slime-08-scheidsrechter.webp"
        />
      </header>

      <section className="grid gap-4 lg:grid-cols-2 lg:items-start">
        {/* Links: poule- en datablokken. */}
        <div className="grid gap-4">
          <article className="panel p-5">
            <div className="flex items-center gap-3">
              <CalendarClock aria-hidden="true" className="size-7 text-[#064ed6]" />
              <h2 className="text-2xl font-bold text-[#081634]">Deadlines</h2>
            </div>
            <div className="mt-4 grid gap-2 text-sm font-medium leading-7 text-[#48617f]">
              <p>
                Hoofdvoorspellingen sluiten bij de aftrap op{" "}
                <strong className="text-[#081634]">{formatDeadline(ENTRY_DEADLINE_ISO)}</strong>.
              </p>
              <p>
                Wereldkampioen, finalisten, penaltyseries en &ldquo;hoe ver komt Oranje&rdquo; blijven wijzigbaar t/m{" "}
                <strong className="text-[#081634]">{formatDeadline(POST_GROUP_DEADLINE_ISO)}</strong>.
              </p>
            </div>
          </article>

          <article className="panel p-5">
            <div className="flex items-center gap-3">
              <ShieldCheck aria-hidden="true" className="size-7 text-[#064ed6]" />
              <h2 className="text-2xl font-bold text-[#081634]">Subpoules</h2>
            </div>
            <ul className="mt-4 grid gap-2 text-sm font-medium leading-7 text-[#48617f]">
              <li>Iedereen doet mee in de algemene ranglijst.</li>
              <li>Je kunt in meerdere subpoules zitten (familie, vrienden, collega&rsquo;s).</li>
              <li>Een subpoule heeft een beheerder en een geheime deelcode.</li>
              <li>Beheerders kunnen leden verwijderen en moderators aanwijzen.</li>
              <li>Beheerders en moderators kunnen de poule aankleden en berichten plaatsen.</li>
              <li>Subpoules krijgen een ranglijst op de score van hun beste 4 spelers.</li>
            </ul>
          </article>

          <article className="panel p-5">
            <div className="flex items-center gap-3">
              <Database aria-hidden="true" className="size-7 text-[#e1262f]" />
              <h2 className="text-2xl font-bold text-[#081634]">Data en uitslagen</h2>
            </div>
            <p className="mt-4 text-sm font-medium leading-7 text-[#48617f]">
              Je voorspellingen zijn privé tot de deadline. Zodra uitslagen binnenkomen wordt de ranglijst opnieuw
              berekend: eerst de wedstrijdpunten, daarna rondekeuzes, kampioen en bonusvragen.
            </p>
            <p className="mt-3 text-sm font-medium leading-7 text-[#48617f]">
              Meer weten? Lees ons <a className="font-bold text-[#064ed6]" href="/privacy">privacybeleid</a> en de{" "}
              <a className="font-bold text-[#064ed6]" href="/voorwaarden">voorwaarden</a>.
            </p>
          </article>
        </div>

        {/* Rechts: puntentelling + FAQ. */}
        <div className="grid gap-4">
          <article className="panel p-5">
            <div className="flex items-center gap-3">
              <BookOpen aria-hidden="true" className="size-7 text-[#25a84a]" />
              <h2 className="text-2xl font-bold text-[#081634]">Puntentelling</h2>
            </div>
            <ul className="mt-4 grid gap-2 text-sm font-medium leading-7 text-[#48617f]">
              <li><strong className="text-[#081634]">Exacte uitslag:</strong> 12 punten (het maximum per wedstrijd).</li>
              <li><strong className="text-[#081634]">Juiste winnaar of gelijkspel:</strong> 6 punten, plus 2 voor het juiste doelsaldo en 2 per juist teamdoelpunt.</li>
              <li><strong className="text-[#081634]">Knock-outrondes:</strong> oplopend van de laatste 32 tot wereldkampioen — een goede eindsprint telt echt.</li>
              <li><strong className="text-[#081634]">Bonusvragen:</strong> o.a. team met de meeste goals en hoe ver Oranje komt.</li>
            </ul>

            <details className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <summary className="cursor-pointer text-sm font-bold text-[#081634]">Volledige puntentelling</summary>
              <div className="mt-3 grid gap-2">
                {scoringRules.map((rule) => (
                  <div key={rule.label} className="grid gap-1 rounded-lg border border-slate-200 bg-white p-3 text-[#081634] sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                      <span className="font-semibold">{rule.label}</span>
                      <span className="mt-1 block text-xs font-medium text-[#48617f]">{rule.note}</span>
                    </div>
                    <span className="font-bold">{rule.points} pt</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-sm font-medium leading-7 text-[#48617f]">
                Per wedstrijd is 12 punten het maximum. Bij een exacte uitslag stapelen de deelpunten niet door; bij een
                gedeeltelijk goede voorspelling tellen juiste richting, doelsaldo en teamgoals wél samen op.
              </p>
              <div className="mt-3 rounded-lg border border-[#bcd4f5] bg-[#eef4ff] p-3 text-sm font-medium leading-7 text-[#1c3a66]">
                <p className="font-bold text-[#0b1f4d]">Voorbeeld</p>
                <p className="mt-1">
                  Je voorspelt <strong>2&ndash;1</strong>, het wordt <strong>2&ndash;0</strong>. Juiste winnaar (6) + thuisploeg
                  precies 2 goals (2) = <strong>8 punten</strong>. Exact 2&ndash;1 zou de volle <strong>12 punten</strong> zijn geweest.
                </p>
              </div>
              <p className="mt-3 text-sm font-medium leading-7 text-[#48617f]">
                Gelijke stand? Dan kijken we naar meeste exacte uitslagen, meeste juiste resultaten, bonuspunten en
                daarna de vroegste volledige inzending.
              </p>
            </details>
          </article>

          <article className="panel p-5">
            <div className="flex items-center gap-3">
              <HelpCircle aria-hidden="true" className="size-7 text-[#064ed6]" />
              <h2 className="text-2xl font-bold text-[#081634]">Veelgestelde vragen</h2>
            </div>
            <div className="mt-4 grid gap-2">
              {faq.map((item) => (
                <details key={item.q} className="rounded-lg border border-slate-200 p-3">
                  <summary className="cursor-pointer text-sm font-bold text-[#081634]">{item.q}</summary>
                  <p className="mt-2 text-sm font-medium leading-7 text-[#48617f]">{item.a}</p>
                </details>
              ))}
            </div>
          </article>
        </div>
      </section>

      <BottomNav current="/regels" />
    </main>
  );
}

function formatDeadline(iso: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    timeZone: "Europe/Amsterdam",
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(iso));
}
