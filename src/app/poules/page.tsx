import { ImagePlus, Megaphone, Palette, RefreshCw, Trash2 } from "lucide-react";
import QRCode from "qrcode";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  deletePoolMessage,
  postPoolMessage,
  removeMember,
  resetPoolCode,
  setMemberRole,
  updatePoolStyle,
  uploadPoolImage,
} from "@/app/actions";
import { Avatar } from "@/components/avatar";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { PendingButton } from "@/components/pending-button";
import { PoolBanner } from "@/components/pool-banner";
import { PoolMembers, type MatchLine, type PoolMember } from "@/components/pool-members";
import { PoolQr } from "@/components/pool-qr";
import { PoolQuickShare } from "@/components/pool-quick-share";
import { PoolTabs } from "@/components/pool-tabs";
import { ENTRY_DEADLINE, SITE_URL } from "@/lib/constants";
import { displayName, formatAmsterdam } from "@/lib/format";
import { scoreMatchPrediction } from "@/lib/scoring";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
function poolBannerUrl(poolId: string) {
  return `${supabaseUrl}/storage/v1/object/public/pool-media/pools/${poolId}.webp`;
}

const poolErrors: Record<string, string> = {
  code: "Die WK-poulecode klopt niet. Controleer de code.",
  rechten: "Je hebt hier geen rechten voor.",
  naam: "Kies een geldige WK-poulenaam (min. 2 tekens).",
  limiet: "Je zit al aan het maximum aantal WK-poules (20).",
  kleur: "Kies een geldige kleur.",
  rol: "Die rol kan niet worden ingesteld.",
  "bericht-kort": "Je bericht is te kort (minimaal 10 tekens).",
  "te-snel": "Even rustig aan — je doet dit te vaak achter elkaar. Probeer het zo nog eens.",
  afbeelding: "Kies een geldige afbeelding.",
  "afbeelding-groot": "De afbeelding is te groot (max 6 MB).",
};

type MemberRow = {
  pool_id: string;
  user_id: string;
  role: "owner" | "moderator" | "member";
  profiles: { nickname: string | null; team_name: string | null; avatar_key: string | null } | null;
  pools: {
    id: string;
    name: string;
    code: string;
    owner_id: string;
    description: string | null;
    badge_emoji: string;
    accent_color: string;
  } | null;
};

type MatchInfo = {
  id: number;
  startsAt: string | null;
  status: string | null;
  homeName: string;
  awayName: string;
  homeScore: number | null;
  awayScore: number | null;
};

type PredictionRow = { user_id: string; match_id: number; home_score: number; away_score: number };

type MessageRow = {
  id: string;
  pool_id: string;
  author_id: string;
  body: string;
  pinned: boolean;
  created_at: string;
  profiles: { nickname: string | null; team_name: string | null } | null;
};

export default async function PoolsPage({
  searchParams,
}: {
  searchParams: Promise<{ aangemaakt?: string; joined?: string; fout?: string; bijgewerkt?: string; pool?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  // Meedoen vereist een complete scorekaart (naam + teamnaam, min. 4 tekens).
  const { data: ownProfile } = await supabase.from("profiles").select("nickname,team_name").eq("id", user.id).maybeSingle();
  if (!ownProfile?.nickname || !ownProfile.team_name) redirect("/");

  const [{ data }, { data: messages }] = await Promise.all([
    supabase
      .from("pool_members")
      .select("pool_id,user_id,role,profiles(nickname,team_name,avatar_key),pools(id,name,code,owner_id,description,badge_emoji,accent_color)")
      .order("joined_at"),
    supabase
      .from("pool_messages")
      .select("id,pool_id,author_id,body,pinned,created_at,profiles(nickname,team_name)")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const pools = groupMembers((data ?? []) as unknown as MemberRow[]);
  const messagesByPool = groupMessages((messages ?? []) as unknown as MessageRow[]);

  // Stand + voorspellingen per subpoule. Voorspellingen van anderen worden pas
  // na de invuldeadline onthuld; je eigen voorspellingen zie je altijd.
  const memberIds = Array.from(new Set(pools.flatMap((pool) => pool.members.map((member) => member.user_id))));
  const revealOthers = new Date() >= ENTRY_DEADLINE;
  const admin = createAdminClient();
  const matchInfoById = new Map<number, MatchInfo>();
  const predictionsByUser = new Map<string, PredictionRow[]>();
  const pointsByUser = new Map<string, number>();
  // Wereldrang = positie in de algemene ranglijst (alle deelnemers), zodat je
  // in een subpoule meteen ziet hoe iemand er landelijk voor staat.
  const worldRankByUser = new Map<string, number>();

  if (memberIds.length) {
    const [{ data: matchRows }, { data: predictionRows }, { data: scoreRows }] = await Promise.all([
      admin
        .from("matches")
        .select("id,starts_at,status,home_score,away_score,home:teams!matches_home_code_fkey(name_nl),away:teams!matches_away_code_fkey(name_nl)")
        .order("starts_at"),
      admin.from("predictions").select("user_id,match_id,home_score,away_score").in("user_id", memberIds),
      admin.from("scores").select("user_id,points").order("points", { ascending: false }),
    ]);

    // Competition ranking (1,2,2,4): gelijke punten = gelijke wereldrang.
    let lastPoints: number | null = null;
    let lastRank = 0;
    (scoreRows ?? []).forEach((row, index) => {
      pointsByUser.set(row.user_id, row.points);
      const rank = row.points === lastPoints ? lastRank : index + 1;
      lastPoints = row.points;
      lastRank = rank;
      worldRankByUser.set(row.user_id, rank);
    });

    for (const row of (matchRows ?? []) as unknown as Array<{
      id: number;
      starts_at: string | null;
      status: string | null;
      home_score: number | null;
      away_score: number | null;
      home: { name_nl: string | null } | null;
      away: { name_nl: string | null } | null;
    }>) {
      matchInfoById.set(row.id, {
        id: row.id,
        startsAt: row.starts_at,
        status: row.status,
        homeName: row.home?.name_nl ?? "?",
        awayName: row.away?.name_nl ?? "?",
        homeScore: row.home_score,
        awayScore: row.away_score,
      });
    }
    for (const row of (predictionRows ?? []) as PredictionRow[]) {
      predictionsByUser.set(row.user_id, [...(predictionsByUser.get(row.user_id) ?? []), row]);
    }
  }

  const poolMembersById = new Map<string, PoolMember[]>();
  for (const pool of pools) {
    poolMembersById.set(
      pool.id,
      buildPoolMembers(pool.members, user.id, revealOthers, matchInfoById, predictionsByUser, pointsByUser, worldRankByUser),
    );
  }

  const poolJoinAssets = new Map<string, { joinUrl: string; qrDataUrl: string }>();
  await Promise.all(
    pools.map(async (pool) => {
      const joinUrl = `${SITE_URL}/poules/join/${pool.code}`;
      const qrDataUrl = await QRCode.toDataURL(joinUrl, {
        errorCorrectionLevel: "M",
        margin: 1,
        width: 180,
        color: { dark: "#081634", light: "#ffffff" },
      });
      poolJoinAssets.set(pool.id, { joinUrl, qrDataUrl });
    }),
  );

  const tabs = pools.map((pool) => ({ id: pool.id, label: pool.name, emoji: pool.badgeEmoji }));

  return (
    <main className="page-shell poules-page-shell">
      <header className="mb-5 grid gap-4">
        <Brand />
      </header>

      {params.aangemaakt || params.joined || params.bijgewerkt ? (
        <div className="mb-4 rounded-lg border border-green-300 bg-green-50 p-4 font-bold text-green-800">
          Bijgewerkt{params.aangemaakt ? `: code ${params.aangemaakt}` : ""}{params.joined ? `: je doet mee met ${params.joined}` : ""}.
        </div>
      ) : null}
      {params.fout ? (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4 font-bold text-red-800">
          {poolErrors[params.fout] ?? "Er ging iets mis. Probeer het opnieuw."}
        </div>
      ) : null}

      <section className="mt-1">
        {pools.length ? (
          <PoolTabs tabs={tabs} initialId={params.pool}>
          {pools.map((pool) => {
            const currentMember = pool.members.find((member) => member.user_id === user.id);
            const isOwner = currentMember?.role === "owner";
            const isManager = currentMember?.role === "owner" || currentMember?.role === "moderator";
            const joinAssets = poolJoinAssets.get(pool.id) ?? { joinUrl: SITE_URL, qrDataUrl: "" };
            const inviteText = `Doe je mee met onze gratis WK 2026-poule "${pool.name}"? 1 keer ~10 minuten invullen en je strijdt het hele WK mee. 👇`;
            return (
              <article key={pool.id} className="panel pool-card overflow-hidden">
                <PoolBanner src={poolBannerUrl(pool.id)} alt={`Banner van ${pool.name}`} />
                <div className="pool-card-hero text-white" style={{ background: pool.accentColor }}>
                  <div className="min-w-0">
                    <h2 className="pool-card-title"><span aria-hidden="true">{pool.badgeEmoji}</span> {pool.name}</h2>
                    <p className="pool-code-line">
                      Code: <span className="pool-code-pill">{pool.code}</span>
                    </p>
                    {pool.description ? <p className="pool-card-description">{pool.description}</p> : null}
                  </div>
                  <PoolQuickShare joinUrl={joinAssets.joinUrl} qrDataUrl={joinAssets.qrDataUrl} poolName={pool.name} inviteText={inviteText} />
                </div>
                <PoolMembers members={poolMembersById.get(pool.id) ?? []} />
                <div className="border-b border-slate-200 p-4 pool-board-section">
                  <h3 className="text-lg font-bold text-[#101a2b]">Prikbord</h3>
                  <form action={postPoolMessage} className="mt-3 grid gap-2">
                    <input type="hidden" name="pool_id" value={pool.id} />
                    <textarea
                      className="field min-h-20 pool-board-textarea"
                      name="body"
                      minLength={10}
                      maxLength={500}
                      required
                      placeholder="Schrijf iets voor je WK-poule… (min. 10 tekens)"
                    />
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      {isManager ? (
                        <label className="flex items-center gap-2 text-sm font-medium text-[#101a2b]">
                          <input type="checkbox" name="pinned" /> Vastzetten bovenaan
                        </label>
                      ) : (
                        <span />
                      )}
                      <PendingButton className="button-primary min-h-9 px-3 text-sm" pendingText="Plaatsen…">
                        <Megaphone aria-hidden="true" className="size-4" />
                        Plaats
                      </PendingButton>
                    </div>
                  </form>
                  <div className="mt-3 grid gap-2">
                    {(messagesByPool.get(pool.id) ?? []).slice(0, 6).map((message) => {
                      const canDelete = isManager || message.author_id === user.id;
                      return (
                        <div
                          key={message.id}
                          className={`rounded-lg border p-3 pool-board-message ${message.pinned ? "border-[#e0b23a] bg-amber-50" : "border-slate-200 bg-white"}`}
                        >
                          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-normal text-[#4c5a70]">
                            {message.pinned ? <span className="text-[#9a6b12]">Vastgezet</span> : null}
                            <span>{displayName(message.profiles)}</span>
                            <span>{new Intl.DateTimeFormat("nl-NL", { dateStyle: "short", timeStyle: "short" }).format(new Date(message.created_at))}</span>
                            {canDelete ? (
                              <form action={deletePoolMessage} className="ml-auto">
                                <input type="hidden" name="pool_id" value={pool.id} />
                                <input type="hidden" name="message_id" value={message.id} />
                                <button className="font-bold text-[#b23b46] hover:underline" type="submit">
                                  Verwijder
                                </button>
                              </form>
                            ) : null}
                          </div>
                          <p className="mt-1 text-sm font-medium leading-6 text-[#101a2b]">{message.body}</p>
                        </div>
                      );
                    })}
                    {!messagesByPool.get(pool.id)?.length ? (
                      <p className="text-sm font-medium text-[#4c5a70]">Nog geen berichten.</p>
                    ) : null}
                  </div>
                </div>
                <details className="pool-share-details border-b border-slate-200 bg-[#fffaf0]">
                  <summary className="cursor-pointer p-4 text-sm font-bold text-[#101a2b]">Deelopties &amp; QR</summary>
                  <div className="pool-invite-strip pool-invite-strip-hidden">
                    <div className="pool-invite-copy">
                      <p className="pool-invite-kicker">Uitnodigingslink</p>
                      <a className="pool-invite-url" href={joinAssets.joinUrl}>
                        {joinAssets.joinUrl.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                    <PoolQr qrDataUrl={joinAssets.qrDataUrl} poolName={pool.name} joinUrl={joinAssets.joinUrl} />
                  </div>
                </details>
                {isManager ? (
                  <details className="border-b border-slate-200 bg-slate-50">
                    <summary className="cursor-pointer p-4 text-sm font-bold text-[#101a2b]">
                      WK-poule-instellingen &amp; opmaak (beheer)
                    </summary>
                  <div className="grid items-start gap-4 p-4 pt-0 md:grid-cols-2">
                    <form action={updatePoolStyle} className="grid gap-3">
                      <input type="hidden" name="pool_id" value={pool.id} />
                      <div className="flex items-center gap-2 font-bold text-[#101a2b]">
                        <Palette aria-hidden="true" className="size-5 text-[#2c4a72]" />
                        WK-poule aankleden
                      </div>
                      <div className="grid gap-2 sm:grid-cols-[72px_110px_1fr]">
                        <label className="grid gap-1 text-xs font-bold text-[#101a2b]">
                          Emoji
                          <input className="field" name="badge_emoji" defaultValue={pool.badgeEmoji} maxLength={8} list={`emoji-${pool.id}`} />
                          <datalist id={`emoji-${pool.id}`}>
                            {["🏆", "⚽", "🥅", "🧡", "🔥", "🐮", "🦁", "🎯", "🍻", "🎉", "🥇", "🇳🇱"].map((e) => (
                              <option key={e} value={e} />
                            ))}
                          </datalist>
                        </label>
                        <label className="grid gap-1 text-xs font-bold text-[#101a2b]">
                          Kleur
                          <input className="field h-[46px]" name="accent_color" type="color" defaultValue={pool.accentColor} />
                        </label>
                        <label className="grid gap-1 text-xs font-bold text-[#101a2b]">
                          Groepszin
                          <input className="field" name="description" maxLength={180} defaultValue={pool.description ?? ""} placeholder="Bijv. iedereen tegen oom Jan" />
                        </label>
                      </div>
                      <button className="button-secondary w-fit" type="submit">Opslaan</button>
                    </form>
                    <form action={uploadPoolImage} className="grid gap-3">
                      <input type="hidden" name="pool_id" value={pool.id} />
                      <div className="flex items-center gap-2 font-bold text-[#101a2b]">
                        <ImagePlus aria-hidden="true" className="size-5 text-[#2f7a60]" />
                        WK-poulebanner uploaden
                      </div>
                      <input className="field" type="file" name="image" accept="image/*" required />
                      <p className="text-xs font-medium text-[#4c5a70]">
                        Wordt automatisch bijgesneden en verkleind. Max 6 MB.
                      </p>
                      <PendingButton className="button-secondary w-fit" pendingText="Uploaden…">
                        Upload banner
                      </PendingButton>
                    </form>
                    {isOwner ? (
                      <form action={resetPoolCode} className="grid gap-2 rounded-xl border border-slate-200 bg-white p-3 md:col-span-2">
                        <input type="hidden" name="pool_id" value={pool.id} />
                        <div className="font-bold text-[#101a2b]">Deelcode beheren</div>
                        <p className="text-xs font-medium text-[#4c5a70]">Maakt een nieuwe code; de oude uitnodigingslink werkt daarna niet meer.</p>
                        <button className="button-plain button-compact w-fit" type="submit" title="Maak een nieuwe deelcode">
                          <RefreshCw aria-hidden="true" className="size-4" />
                          Nieuwe code
                        </button>
                      </form>
                    ) : null}
                  </div>
                  </details>
                ) : null}
                {isManager ? (
                <details className="border-b border-slate-200 bg-slate-50">
                  <summary className="cursor-pointer p-4 text-sm font-bold text-[#101a2b]">Leden beheren (beheer)</summary>
                  <div className="px-4 pb-4 divide-y divide-slate-200">
                  {pool.members.map((member) => (
                    <div key={member.user_id} className="grid gap-3 py-3 md:grid-cols-[1fr_auto] md:items-center">
                      <div className="flex items-center gap-3">
                        <Avatar name={displayName(member.profiles)} avatarKey={member.profiles?.avatar_key} />
                        <div className="min-w-0">
                          <div className="truncate font-bold text-[#081634]">{displayName(member.profiles)}</div>
                          <div className="text-sm font-semibold text-[#48617f]">{roleLabel(member.role)}</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {isOwner && member.role !== "owner" ? (
                          <form action={setMemberRole} className="flex gap-2">
                            <input type="hidden" name="pool_id" value={pool.id} />
                            <input type="hidden" name="user_id" value={member.user_id} />
                            <select className="field min-h-11 w-auto" name="role" defaultValue={member.role}>
                              <option value="member">Deelnemer</option>
                              <option value="moderator">Moderator</option>
                            </select>
                            <button className="button-secondary" type="submit">Rol</button>
                          </form>
                        ) : null}
                        {(isOwner || member.user_id === user.id) && member.role !== "owner" ? (
                          <form action={removeMember}>
                            <input type="hidden" name="pool_id" value={pool.id} />
                            <input type="hidden" name="user_id" value={member.user_id} />
                            <button className="button-secondary" type="submit">
                              <Trash2 aria-hidden="true" className="size-4" />
                              Verwijder
                            </button>
                          </form>
                        ) : null}
                      </div>
                    </div>
                  ))}
                  </div>
                </details>
                ) : null}
              </article>
            );
          })}
          </PoolTabs>
        ) : (
          <div className="panel p-5">
            <h2 className="text-2xl font-bold text-[#081634]">Nog geen WK-poules</h2>
            <p className="mt-2 font-medium text-[#48617f]">
              Maak er een aan of sluit aan met een code op de{" "}
              <Link className="font-bold text-[#064ed6]" href="/">startpagina</Link>.
            </p>
          </div>
        )}
      </section>

      <Link href="/games?game=soccer" className="poule-soccer-mini">
        <span aria-hidden="true" className="poule-soccer-mini-ball">⚽</span>
        <span className="poule-soccer-mini-text">
          <strong>Even pauze?</strong> Speel een potje Slime Soccer tegen de computer of je vrienden.
        </span>
        <span className="poule-soccer-mini-cta">Spelen →</span>
      </Link>

      <BottomNav current="/poules" />
    </main>
  );
}

function groupMembers(rows: MemberRow[]) {
  const map = new Map<
    string,
    {
      id: string;
      name: string;
      code: string;
      description: string | null;
      badgeEmoji: string;
      accentColor: string;
      members: MemberRow[];
    }
  >();

  for (const row of rows) {
    if (!row.pools) continue;
    const existing = map.get(row.pool_id) ?? {
      id: row.pools.id,
      name: row.pools.name,
      code: row.pools.code,
      description: row.pools.description,
      badgeEmoji: row.pools.badge_emoji,
      accentColor: row.pools.accent_color,
      members: [],
    };
    existing.members.push(row);
    map.set(row.pool_id, existing);
  }

  return Array.from(map.values());
}

function groupMessages(rows: MessageRow[]) {
  const map = new Map<string, MessageRow[]>();
  for (const row of rows) {
    map.set(row.pool_id, [...(map.get(row.pool_id) ?? []), row]);
  }
  return map;
}

function roleLabel(role: MemberRow["role"]) {
  if (role === "owner") return "Beheerder";
  if (role === "moderator") return "Moderator";
  return "Deelnemer";
}

function buildPoolMembers(
  members: MemberRow[],
  currentUserId: string,
  revealOthers: boolean,
  matchInfoById: Map<number, MatchInfo>,
  predictionsByUser: Map<string, PredictionRow[]>,
  pointsByUser: Map<string, number>,
  worldRankByUser: Map<string, number>,
): PoolMember[] {
  const built = members.map((member) => {
    const isYou = member.user_id === currentUserId;
    const visible = isYou || revealOthers;
    const past: MatchLine[] = [];
    const upcoming: MatchLine[] = [];

    if (visible) {
      const predictions = (predictionsByUser.get(member.user_id) ?? [])
        .map((prediction) => ({ prediction, match: matchInfoById.get(prediction.match_id) }))
        .filter((entry): entry is { prediction: PredictionRow; match: MatchInfo } => Boolean(entry.match))
        .sort((a, b) => (a.match.startsAt ?? "").localeCompare(b.match.startsAt ?? ""));

      for (const { prediction, match } of predictions) {
        const finished = match.status === "finished" && match.homeScore !== null && match.awayScore !== null;
        const line: MatchLine = {
          matchId: match.id,
          when: formatAmsterdam(match.startsAt),
          home: match.homeName,
          away: match.awayName,
          predHome: prediction.home_score,
          predAway: prediction.away_score,
          resultHome: match.homeScore,
          resultAway: match.awayScore,
          points: finished
            ? scoreMatchPrediction({
                predictedHome: prediction.home_score,
                predictedAway: prediction.away_score,
                actualHome: match.homeScore,
                actualAway: match.awayScore,
              }).points
            : null,
        };
        if (finished) past.push(line);
        else upcoming.push(line);
      }
      past.reverse();
    }

    return {
      userId: member.user_id,
      rank: 0,
      worldRank: worldRankByUser.get(member.user_id) ?? null,
      isOwner: member.role === "owner",
      name: member.profiles?.nickname ?? "Speler",
      teamName: member.profiles?.team_name ?? null,
      avatarKey: member.profiles?.avatar_key ?? null,
      points: pointsByUser.get(member.user_id) ?? 0,
      isYou,
      locked: !visible,
      past,
      upcoming,
    };
  });

  return built
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name))
    .map((member, index) => ({ ...member, rank: index + 1 }));
}
