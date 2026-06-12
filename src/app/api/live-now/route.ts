import { NextResponse } from "next/server";
import { getWcFixtures, isLiveStatus, isStartingSoon, type LiveFixture } from "@/lib/apifootball-live";

export const dynamic = "force-dynamic";

type LiveMatch = {
  id: number;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  minute: number | null;
};

type NextMatch = { home: string; away: string; kickoff: string };

/** 3-letter code voor de compacte weergave (MEX, RSA), met nette fallback. */
function shortCode(fixture: LiveFixture, side: "home" | "away") {
  const team = fixture[side];
  return (team.code ?? team.name.slice(0, 3)).toUpperCase();
}

/**
 * Klein publiek endpoint voor de LIVE-indicator in het hoofdmenu: welke
 * WK-wedstrijden zijn nú bezig (met stand) en — als er niets live is — wanneer de
 * eerstvolgende begint. Leunt op de 30s fetch-cache van getWcFixtures, dus dit
 * kost geen extra API-Football-verkeer.
 */
export async function GET() {
  const all = await getWcFixtures();
  const now = Date.now();
  // "Live" = echt bezig óf binnen 30 min vóór aftrap (zelfde promotie als de
  // live-pagina), zodat de badge meteen "LIVE KOR - CZE 0-0" toont.
  const matches: LiveMatch[] = (all ?? [])
    .filter((fixture) => !fixture.friendly && (isLiveStatus(fixture.statusShort) || isStartingSoon(fixture, now)))
    .map((fixture) => ({
      id: fixture.id,
      home: shortCode(fixture, "home"),
      away: shortCode(fixture, "away"),
      homeScore: fixture.home.goals ?? 0,
      awayScore: fixture.away.goals ?? 0,
      minute: fixture.elapsed,
    }));

  const upcoming = (all ?? [])
    .filter((fixture) => !fixture.friendly && fixture.statusShort === "NS" && !isStartingSoon(fixture, now))
    .sort((a, b) => a.date.localeCompare(b.date))[0];
  const next: NextMatch | null = upcoming
    ? { home: shortCode(upcoming, "home"), away: shortCode(upcoming, "away"), kickoff: upcoming.date }
    : null;

  return NextResponse.json(
    { liveCount: matches.length, matches, next },
    { headers: { "Cache-Control": "public, max-age=30, s-maxage=30, stale-while-revalidate=60" } },
  );
}
