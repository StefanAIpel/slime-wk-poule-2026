import type { Metadata } from "next";
import { BookOpen, CalendarClock, Database, HelpCircle, ShieldCheck } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { PageHero } from "@/components/page-hero";
import { SlimeSoccerBanner } from "@/components/slime-soccer-banner";
import { ENTRY_DEADLINE_ISO, ENTRY_GRACE_DEADLINE_ISO, scoringRules } from "@/lib/constants";
import { localizedHref, type Locale } from "@/lib/i18n";
import { getServerLocale } from "@/lib/server-locale";

const rulesCopy = {
  nl: {
    metaTitle: "Spelregels & uitleg — zo werkt de gratis WK 2026-poule",
    metaDescription:
      "Hoe werkt een WK-poule? Punten verdienen met exacte uitslagen, knock-outvoorspellingen en bonusvragen. Lees de spelregels en veelgestelde vragen.",
    heroTitle: "Regels en uitleg",
    heroSubtitle: "Kort, duidelijk en net precies genoeg voor discussie in de groepsapp.",
    noticeTitle: "Regels in uitvoering:",
    notice:
      "we kunnen de spelregels vóór en tijdens het toernooi nog bijschaven — een poule is tenslotte nooit helemaal af. Iets belangrijks? Dan melden we het netjes in je WK-poule.",
    sideBannersLabel: "SlimeScore spellen",
    deadlinesTitle: "Deadlines",
    mainDeadlinePrefix: "Inschrijven en invullen kan t/m",
    mainDeadlineSuffix: " (de eerste WK-wedstrijd).",
    graceDeadlinePrefix: "Respijtperiode: niet-gespeelde groepswedstrijden kun je nog invullen of wijzigen tot",
    graceDeadlineSuffix: "— maar elke wedstrijd sluit altijd 30 min vóór de aftrap. Gestarte of gespeelde wedstrijden blijven dicht en leveren zonder voorspelling geen punten op.",
    lateDeadlinePrefix: "Knock-outs en bonusvragen blijven ook wijzigbaar tot",
    lateDeadlineSuffix: ". Daarna staat alles vast.",
    poolsTitle: "WK-poules",
    poolsBodyPrefix: "Naast de algemene ranglijst kun je",
    poolsBodyStrong: "subpoules",
    poolsBodySuffix: "maken of eraan meedoen — je eigen onderlinge strijd met familie, vrienden of collega’s.",
    poolItems: [
      { label: "Altijd erbij:", text: "iedereen staat sowieso in de algemene WK 2026-ranglijst." },
      { label: "Meerdere tegelijk:", text: "zit gerust in meer dan één subpoule (familie, vrienden, collega’s)." },
      { label: "Eigen deelcode:", text: "elke subpoule heeft een beheerder en een geheime code/link om aan te sluiten." },
      { label: "Beheer:", text: "de beheerder verwijdert leden en wijst moderators aan." },
      { label: "Aankleden:", text: "beheerders en moderators kleden de subpoule aan en plaatsen berichten." },
      { label: "Ranglijst:", text: "een subpoule scoort op de punten van z’n beste 4 spelers." },
    ],
    dataTitle: "Data en uitslagen",
    dataPrivateStrong: "privé tot de deadline",
    dataParagraphPrefix: "Je voorspellingen blijven",
    dataParagraphSuffix:
      "Zodra uitslagen binnenkomen rekenen we de ranglijst opnieuw door: eerst de wedstrijdpunten, daarna rondekeuzes, kampioen en bonusvragen.",
    moreInfoPrefix: "Meer weten? Lees ons",
    privacyLink: "privacybeleid",
    termsLink: "voorwaarden",
    and: "en de",
    edgeTitle: "Randgevallen",
    edgeItems: [
      { label: "Verplaatste wedstrijd:", text: "je voorspelling verhuist mee en blijft in de oorspronkelijke ronde meetellen." },
      { label: "Afgelast of gestaakt:", text: "zonder officiële eindstand geven we geen wedstrijdpunten; met een officiële eindstand gebruiken we die stand." },
      { label: "Correcties achteraf:", text: "als een officiële uitslag of toernooifeit wijzigt, herberekenen we de ranglijst." },
      { label: "Bonusstatistieken:", text: "penaltyseries tellen mee als penaltyserie, maar shoot-out-goals tellen niet mee voor totaal goals of team met meeste goals." },
      { label: "Groepsstand-tiebreak:", text: "voor jouw automatische laatste 32 sorteren we op punten, doelsaldo, goals voor, goals tegen en daarna landcode." },
      { label: "Knock-out:", text: "landen die een ronde halen tellen op basis van de officiële winnaar, dus inclusief eventuele verlenging of penalty’s." },
    ],
    scoringTitle: "Puntentelling",
    scoringItems: [
      { label: "Exacte uitslag:", text: "12 punten (het maximum per wedstrijd)." },
      { label: "Juiste winnaar of gelijkspel:", text: "6 punten, plus 2 voor het juiste doelsaldo en 2 per juist teamdoelpunt." },
      { label: "Oranje telt dubbel:", text: "wedstrijden van Nederland leveren dubbele wedstrijdpunten op (max. 24 per wedstrijd)." },
      { label: "Knock-outrondes:", text: "oplopend van de laatste 32 tot wereldkampioen — een goede eindsprint telt echt." },
      { label: "Bonusvragen:", text: "o.a. team met de meeste goals en hoe ver Oranje komt." },
    ],
    detailsSummary: "Volledige puntentelling",
    scoringDetails: scoringRules,
    pointsSuffix: "pt",
    maxPerMatch:
      "Per wedstrijd is 12 punten het maximum (Oranje-wedstrijden tellen dubbel: max 24). Bij een exacte uitslag stapelen de deelpunten niet door; bij een gedeeltelijk goede voorspelling tellen juiste richting, doelsaldo en teamgoals wél samen op.",
    exampleTitle: "Voorbeeld",
    exampleText: (
      <>
        Je voorspelt <strong>2&ndash;1</strong>, het wordt <strong>2&ndash;0</strong>. Juiste winnaar (6) + thuisploeg precies 2 goals (2) = <strong>8 punten</strong>. Exact 2&ndash;1 zou de volle <strong>12 punten</strong> zijn geweest.
      </>
    ),
    tieText: "Gelijke stand? Dan kijken we naar meeste exacte uitslagen, meeste juiste resultaten en bonuspunten.",
    faqTitle: "Veelgestelde vragen",
    faq: [
      { q: "Is meedoen gratis?", a: "Ja, helemaal gratis. Geen advertenties en geen tracking-cookies." },
      { q: "Heb ik een wachtwoord nodig?", a: "Nee. Je logt in met een eenmalige link die we naar je e-mailadres sturen." },
      {
        q: "Tot wanneer kan ik invullen?",
        a: "Je inschrijving loopt t/m donderdag 11 juni 21:00 (de eerste WK-wedstrijd). Daarna is er respijt t/m zondag 14 juni 21:00: groepswedstrijden die nog niet gespeeld zijn kun je dan nog invullen of wijzigen. Elke wedstrijd sluit wel altijd 30 minuten vóór de aftrap — wat al begonnen of gespeeld is, blijft dicht en levert zonder voorspelling geen punten op. Knock-outs en bonusvragen kun je ook wijzigen tot zondag 14 juni 21:00; daarna staat alles vast.",
      },
      { q: "Zijn mijn WK 2026-voorspellingen privé?", a: "Ja, tot de deadline. Daarna zijn ze zichtbaar voor je medespelers in dezelfde WK-poule. Je e-mailadres blijft altijd privé." },
      { q: "Hoe werkt de laatste 32?", a: "Die rekenen we automatisch uit jouw voorspelde groepsstanden: de nummers 1 en 2 plus de beste acht nummers 3." },
      { q: "Kan ik in meerdere WK-poules zitten?", a: "Ja. Maak je eigen WK-poule met een deelcode of sluit aan bij bestaande WK-poules van familie, vrienden of collega's." },
      { q: "Wat gebeurt er bij een gelijke stand?", a: "We kijken achtereenvolgens naar meeste exacte uitslagen, meeste juiste resultaten en bonuspunten. Is het dan nog gelijk, dan blijft het gewoon spannend gelijk." },
      { q: "Kan ik mijn account verwijderen?", a: "Ja, via Mijn account. Daarmee verdwijnen je profiel, voorspellingen, scores en deelnames definitief." },
    ],
  },
  en: {
    metaTitle: "Rules and explanation — how the free World Cup 2026 pool works",
    metaDescription:
      "How does a World Cup pool work? Score points with exact match scores, knockout predictions and bonus questions. Read the rules and FAQ.",
    heroTitle: "Rules and explanation",
    heroSubtitle: "Short, clear and detailed enough for friendly group-chat debates.",
    noticeTitle: "Rules in progress:",
    notice:
      "we may still fine-tune the rules before and during the tournament — a pool is never completely finished. If something important changes, we will explain it clearly in your World Cup pool.",
    sideBannersLabel: "SlimeScore games",
    deadlinesTitle: "Deadlines",
    mainDeadlinePrefix: "You can enter and edit until",
    mainDeadlineSuffix: " (the first World Cup match).",
    graceDeadlinePrefix: "Grace period: group matches that have not been played yet can still be entered or edited until",
    graceDeadlineSuffix: " — but every match always closes 30 min before kick-off. Started or played matches stay locked and score no points without a prediction.",
    lateDeadlinePrefix: "Knockouts and bonus questions also remain editable until",
    lateDeadlineSuffix: ". After that everything is locked.",
    poolsTitle: "World Cup pools",
    poolsBodyPrefix: "Besides the overall leaderboard you can create or join",
    poolsBodyStrong: "sub-pools",
    poolsBodySuffix: "— your own private battle with family, friends or colleagues.",
    poolItems: [
      { label: "Always included:", text: "everyone is also listed in the overall World Cup 2026 ranking." },
      { label: "Multiple pools:", text: "feel free to join more than one sub-pool (family, friends, colleagues)." },
      { label: "Private invite code:", text: "every sub-pool has a manager and a secret code/link to join." },
      { label: "Management:", text: "the manager can remove members and appoint moderators." },
      { label: "Custom look:", text: "managers and moderators can style the sub-pool and post messages." },
      { label: "Ranking:", text: "a sub-pool scores on the points of its best 4 players." },
    ],
    dataTitle: "Data and results",
    dataPrivateStrong: "private until the deadline",
    dataParagraphPrefix: "Your predictions stay",
    dataParagraphSuffix:
      "When results come in, we recalculate the leaderboard: first match points, then round picks, champion and bonus questions.",
    moreInfoPrefix: "Want to know more? Read our",
    privacyLink: "privacy policy",
    termsLink: "terms",
    and: "and",
    edgeTitle: "Edge cases",
    edgeItems: [
      { label: "Moved match:", text: "your prediction moves with it and still counts in the original round." },
      { label: "Cancelled or abandoned:", text: "without an official final score we award no match points; with an official final score we use that score." },
      { label: "Corrections afterwards:", text: "if an official result or tournament fact changes, we recalculate the ranking." },
      { label: "Bonus statistics:", text: "penalty shootouts count as shootouts, but shoot-out goals do not count toward total goals or team with most goals." },
      { label: "Group-standing tiebreak:", text: "for your automatic last 32 we sort by points, goal difference, goals for, goals against and then country code." },
      { label: "Knockout:", text: "countries that reach a round count based on the official winner, including extra time or penalties." },
    ],
    scoringTitle: "Scoring",
    scoringItems: [
      { label: "Exact score:", text: "12 points (the maximum per match)." },
      { label: "Correct winner or draw:", text: "6 points, plus 2 for the correct goal difference and 2 for each exact team goal." },
      { label: "Netherlands counts double:", text: "matches involving the Netherlands earn double match points (max 24 per match)." },
      { label: "Knockout rounds:", text: "increasing from the last 32 to world champion — a strong finish really counts." },
      { label: "Bonus questions:", text: "including team with most goals and how far the Netherlands will go." },
    ],
    detailsSummary: "Full scoring table",
    scoringDetails: [
      { label: "Exact score", points: scoringRules[0].points, note: "Max per match" },
      { label: "Correct winner/draw", points: scoringRules[1].points, note: "If it is not exact" },
      { label: "Correct goal difference", points: scoringRules[2].points, note: "If it is not exact" },
      { label: "Per exact team goal", points: scoringRules[3].points, note: "For example Netherlands exactly 2" },
      { label: "Country in last 32", points: scoringRules[4].points, note: "Automatic from your group standings" },
      { label: "Country in round of 16", points: scoringRules[5].points, note: "Max 16 countries" },
      { label: "Country in quarter-final", points: scoringRules[6].points, note: "Max 8 countries" },
      { label: "Country in semi-final", points: scoringRules[7].points, note: "Max 4 countries" },
      { label: "Correct finalist", points: scoringRules[8].points, note: "Max 2 countries" },
      { label: "Correct world champion", points: scoringRules[9].points, note: "Big catch-up bonus" },
      { label: "Team with most goals", points: scoringRules[10].points, note: "Exactly the right country" },
      { label: "How far the Netherlands go", points: scoringRules[11].points, note: "Close answers score less" },
      { label: "Total goals exact", points: scoringRules[12].points, note: "Close answers score less" },
      { label: "Bonus stat exact", points: scoringRules[13].points, note: "Close answers score less" },
    ],
    pointsSuffix: "pts",
    maxPerMatch:
      "Per match, 12 points is the maximum (Netherlands matches count double: max 24). With an exact score, the partial points are not stacked; with a partly correct prediction, correct direction, goal difference and team goals do add up.",
    exampleTitle: "Example",
    exampleText: (
      <>
        You predict <strong>2&ndash;1</strong>, the result is <strong>2&ndash;0</strong>. Correct winner (6) + home team exactly 2 goals (2) = <strong>8 points</strong>. Exact 2&ndash;1 would have been the full <strong>12 points</strong>.
      </>
    ),
    tieText: "Tied on points? We look at most exact scores, most correct results and bonus points.",
    faqTitle: "Frequently asked questions",
    faq: [
      { q: "Is it free to join?", a: "Yes, completely free. No ads and no tracking cookies." },
      { q: "Do I need a password?", a: "You can use a password for your account; confirmation and recovery also support email codes." },
      {
        q: "Until when can I fill in predictions?",
        a: "Entry stays open until Thursday 11 June 21:00 (the first World Cup match). After that there is a grace period until Sunday 14 June 21:00: group matches that have not been played yet can still be entered or edited. Every match still closes 30 minutes before kick-off — anything already started or played stays locked and scores no points without a prediction. Knockouts and bonus questions can also be changed until Sunday 14 June 21:00; after that everything is locked.",
      },
      { q: "Are my World Cup 2026 predictions private?", a: "Yes, until the deadline. After that they are visible to players in the same World Cup pool. Your email address always stays private." },
      { q: "How does the last 32 work?", a: "We calculate it automatically from your predicted group standings: places 1 and 2 plus the best eight third-placed teams." },
      { q: "Can I join multiple World Cup pools?", a: "Yes. Create your own World Cup pool with an invite code or join existing pools from family, friends or colleagues." },
      { q: "What happens on a tie?", a: "We look at most exact scores, most correct results and bonus points. If it is still tied, the ranking simply stays excitingly tied." },
      { q: "Can I delete my account?", a: "Yes, via My account. That permanently removes your profile, predictions, scores and pool memberships." },
    ],
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const copy = rulesCopy[locale];
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: { canonical: "/regels" },
  };
}

export default async function RulesPage() {
  const locale = await getServerLocale();
  const copy = rulesCopy[locale];
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: copy.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <main className="page-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <header className="mb-6 grid gap-4">
        <Brand locale={locale} />
        <PageHero
          title={copy.heroTitle}
          subtitle={copy.heroSubtitle}
          slime="/assets/regels-koeslime-transparant-640.webp"
          className="hero-title-mascot-large"
          mascotClassName="hero-mascot-field hero-mascot-regels"
        />
      </header>

      <p className="mb-4 rounded-xl border border-[#f3dcc0] bg-[#fff7ec] px-4 py-2.5 text-sm leading-6 text-balance text-[#7a5a2a]">
        <strong className="font-bold text-[#8a5712]">{copy.noticeTitle}</strong> {copy.notice}
      </p>

      <section className="grid gap-4 lg:grid-cols-2 lg:items-start">
        {/* Links: poule- en datablokken. */}
        <div className="grid gap-4">
          <article className="panel p-5">
            <div className="flex items-center gap-3">
              <CalendarClock aria-hidden="true" className="size-7 text-[var(--accent-blue)]" />
              <h2 className="text-2xl font-bold text-[var(--ink)]">{copy.deadlinesTitle}</h2>
            </div>
            <div className="mt-4 grid gap-2 text-sm leading-6 text-[#2f3d57]">
              <p>
                {copy.mainDeadlinePrefix} <strong className="text-[var(--ink)]">{formatDeadline(ENTRY_DEADLINE_ISO, locale)}</strong>{copy.mainDeadlineSuffix}
              </p>
              <p>
                {copy.graceDeadlinePrefix} <strong className="text-[var(--ink)]">{formatDeadline(ENTRY_GRACE_DEADLINE_ISO, locale)}</strong>{copy.graceDeadlineSuffix}
              </p>
              <p>
                {copy.lateDeadlinePrefix} <strong className="text-[var(--ink)]">{formatDeadline(ENTRY_GRACE_DEADLINE_ISO, locale)}</strong>{copy.lateDeadlineSuffix}
              </p>
            </div>
          </article>

          <article className="panel p-5">
            <div className="flex items-center gap-3">
              <ShieldCheck aria-hidden="true" className="size-7 text-[var(--accent-blue)]" />
              <h2 className="text-2xl font-bold text-[var(--ink)]">{copy.poolsTitle}</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#2f3d57]">
              {copy.poolsBodyPrefix} <strong className="text-[var(--ink)]">{copy.poolsBodyStrong}</strong> {copy.poolsBodySuffix}
            </p>
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-[#2f3d57]">
              {copy.poolItems.map((item) => (
                <li key={item.label}><strong className="text-[var(--ink)]">{item.label}</strong> {item.text}</li>
              ))}
            </ul>
          </article>

          <article className="panel p-5">
            <div className="flex items-center gap-3">
              <Database aria-hidden="true" className="size-7 text-[#e1262f]" />
              <h2 className="text-2xl font-bold text-[var(--ink)]">{copy.dataTitle}</h2>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#2f3d57]">
              {copy.dataParagraphPrefix} <strong className="font-semibold text-[var(--ink)]">{copy.dataPrivateStrong}</strong>. {copy.dataParagraphSuffix}
            </p>
            <p className="mt-3 text-sm leading-6 text-[#2f3d57]">
              {copy.moreInfoPrefix} <a className="font-bold text-[var(--accent-blue)]" href={localizedHref("/privacy", locale)}>{copy.privacyLink}</a> {copy.and}{" "}
              <a className="font-bold text-[var(--accent-blue)]" href={localizedHref("/voorwaarden", locale)}>{copy.termsLink}</a>.
            </p>
          </article>

          <article className="panel p-5">
            <div className="flex items-center gap-3">
              <HelpCircle aria-hidden="true" className="size-7 text-[#f26a1b]" />
              <h2 className="text-2xl font-bold text-[var(--ink)]">{copy.edgeTitle}</h2>
            </div>
            <ul className="mt-4 grid gap-2 text-sm leading-6 text-[#2f3d57]">
              {copy.edgeItems.map((item) => (
                <li key={item.label}><strong className="text-[var(--ink)]">{item.label}</strong> {item.text}</li>
              ))}
            </ul>
          </article>
        </div>

        {/* Rechts: puntentelling + FAQ + banners. */}
        <div className="grid gap-4">
          <article className="panel p-5">
            <div className="flex items-center gap-3">
              <BookOpen aria-hidden="true" className="size-7 text-[#25a84a]" />
              <h2 className="text-2xl font-bold text-[var(--ink)]">{copy.scoringTitle}</h2>
            </div>
            <ul className="mt-4 grid gap-2 text-sm leading-6 text-[#2f3d57]">
              {copy.scoringItems.map((item) => (
                <li key={item.label}><strong className="text-[var(--ink)]">{item.label}</strong> {item.text}</li>
              ))}
            </ul>

            <details className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
              <summary className="cursor-pointer text-sm font-bold text-[var(--ink)]">{copy.detailsSummary}</summary>
              <div className="mt-3 grid gap-2">
                {copy.scoringDetails.map((rule) => (
                  <div key={rule.label} className="grid gap-1 rounded-lg border border-slate-200 bg-white p-3 text-[var(--ink)] sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                      <span className="font-semibold">{rule.label}</span>
                      <span className="mt-1 block text-xs font-medium text-[var(--text-muted)]">{rule.note}</span>
                    </div>
                    <span className="font-bold">{rule.points} {copy.pointsSuffix}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-sm leading-6 text-[#2f3d57]">{copy.maxPerMatch}</p>
              <div className="mt-3 rounded-lg border border-[#bcd4f5] bg-[#eef4ff] p-3 text-sm font-medium leading-7 text-[#1c3a66]">
                <p className="font-bold text-[#0b1f4d]">{copy.exampleTitle}</p>
                <p className="mt-1">{copy.exampleText}</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#2f3d57]">{copy.tieText}</p>
            </details>
          </article>

          <article className="panel p-5">
            <div className="flex items-center gap-3">
              <HelpCircle aria-hidden="true" className="size-7 text-[var(--accent-blue)]" />
              <h2 className="text-2xl font-bold text-[var(--ink)]">{copy.faqTitle}</h2>
            </div>
            <div className="mt-4 grid gap-2">
              {copy.faq.map((item) => (
                <details key={item.q} className="rounded-lg border border-slate-200 p-3">
                  <summary className="cursor-pointer text-sm font-bold text-[var(--ink)]">{item.q}</summary>
                  <p className="mt-2 text-sm leading-6 text-[#2f3d57]">{item.a}</p>
                </details>
              ))}
            </div>
          </article>

          <section className="rules-side-banners" aria-label={copy.sideBannersLabel}>
            <SlimeSoccerBanner includeWk />
          </section>
        </div>
      </section>

      <BottomNav current="/regels" className="bottom-nav-hide-mobile" />
    </main>
  );
}

function formatDeadline(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "nl-NL", {
    timeZone: "Europe/Amsterdam",
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date(iso));
}
