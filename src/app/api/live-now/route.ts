import { NextResponse } from "next/server";
import { getWcFixtures, isLiveStatus } from "@/lib/apifootball-live";

export const dynamic = "force-dynamic";

/**
 * Klein publiek endpoint voor de LIVE-indicator in het hoofdmenu: hoeveel
 * WK-wedstrijden zijn nú echt bezig. Leunt op de 30s fetch-cache van
 * getWcFixtures, dus dit kost geen extra API-Football-verkeer.
 */
export async function GET() {
  const all = await getWcFixtures();
  const liveCount = (all ?? []).filter((fixture) => !fixture.friendly && isLiveStatus(fixture.statusShort)).length;
  return NextResponse.json(
    { liveCount },
    { headers: { "Cache-Control": "public, max-age=30, s-maxage=30, stale-while-revalidate=60" } },
  );
}
