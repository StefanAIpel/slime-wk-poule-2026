import { LiveAutoRefresh } from "@/components/live-auto-refresh";
import { getWcFixtures, isLiveStatus, splitFixtures, type LiveFixture } from "@/lib/apifootball-live";

export const revalidate = 30;

function kickoff(iso: string) {
  return new Intl.DateTimeFormat("nl-NL", { timeZone: "Europe/Amsterdam", weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

function statusLabel(fixture: LiveFixture) {
  if (isLiveStatus(fixture.statusShort)) {
    if (fixture.statusShort === "HT") return "Rust";
    return fixture.elapsed !== null ? `${fixture.elapsed}'` : "Live";
  }
  if (["FT", "AET", "PEN"].includes(fixture.statusShort)) return fixture.statusShort === "FT" ? "Afgelopen" : fixture.statusShort;
  return kickoff(fixture.date);
}

function FixtureRow({ fixture }: { fixture: LiveFixture }) {
  const live = isLiveStatus(fixture.statusShort);
  const played = live || ["FT", "AET", "PEN"].includes(fixture.statusShort);
  return (
    <a href={`/live/match/${fixture.id}`} className="live-row">
      <span className={live ? "live-row-status is-live" : "live-row-status"}>{statusLabel(fixture)}</span>
      <span className="live-row-teams">
        <span className="live-row-team">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={fixture.home.logo} alt="" aria-hidden="true" className="live-row-logo" loading="lazy" />
          <span className="live-row-name">{fixture.home.name}</span>
        </span>
        <span className="live-row-score">{played ? `${fixture.home.goals ?? 0} - ${fixture.away.goals ?? 0}` : "–"}</span>
        <span className="live-row-team live-row-team-away">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={fixture.away.logo} alt="" aria-hidden="true" className="live-row-logo" loading="lazy" />
          <span className="live-row-name">{fixture.away.name}</span>
        </span>
      </span>
    </a>
  );
}

function Section({ title, subtitle, fixtures, empty }: { title: string; subtitle?: string; fixtures: LiveFixture[]; empty: string }) {
  return (
    <section className="panel overflow-hidden">
      <header className="standing-card-header">
        <span>{title}</span>
        {subtitle ? <span className="text-xs font-bold text-[#48617f]">{subtitle}</span> : null}
      </header>
      {fixtures.length ? (
        <div className="divide-y divide-slate-200">{fixtures.map((f) => <FixtureRow key={f.id} fixture={f} />)}</div>
      ) : (
        <p className="p-4 text-sm font-bold text-[#48617f]">{empty}</p>
      )}
    </section>
  );
}

export default async function LivePage() {
  const all = await getWcFixtures();

  if (!all) {
    return (
      <div className="grid gap-4">
        <h1 className="text-2xl font-black text-[#081634]">Live</h1>
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm font-bold leading-6 text-[#8a5a00]">
          Live-data wordt binnenkort geactiveerd. Zodra de WK-koppeling actief is verschijnen hier de lopende wedstrijd,
          de laatste uitslagen en de aankomende duels.
        </div>
      </div>
    );
  }

  const { live, recent, upcoming } = splitFixtures(all);

  return (
    <div className="grid gap-4">
      <LiveAutoRefresh seconds={30} />
      <div className="grid gap-1">
        <h1 className="text-2xl font-black text-[#081634]">Live</h1>
        <p className="text-sm font-medium text-[#48617f]">WK 2026 — tik een wedstrijd voor opstellingen en statistieken.</p>
      </div>
      <Section title="Nu bezig" subtitle={live.length ? `${live.length} live` : undefined} fixtures={live} empty="Op dit moment is er geen WK-wedstrijd bezig." />
      <Section title="Laatste uitslagen" fixtures={recent} empty="Nog geen gespeelde wedstrijden." />
      <Section title="Aankomend" fixtures={upcoming} empty="Geen geplande wedstrijden gevonden." />
    </div>
  );
}
