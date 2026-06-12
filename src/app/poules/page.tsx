import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { ImagePlus, KeyRound, Megaphone, Palette, RefreshCw, Trash2 } from "lucide-react";
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
import { PoolBoardComposer } from "@/components/pool-board-composer";
import { PoolMembers, type MatchLine, type PoolMember } from "@/components/pool-members";
import { PoolQr } from "@/components/pool-qr";
import { PoolQuickShare } from "@/components/pool-quick-share";
import { PoolTabs } from "@/components/pool-tabs";
import { ENTRY_DEADLINE, SITE_URL } from "@/lib/constants";
import { displayName, formatAmsterdam, teamNameForLocale } from "@/lib/format";
import { localizedHref, type Locale } from "@/lib/i18n";
import { compareScoresAlphabetical, withPublicRankScores, worldRankMap, type RankedScore } from "@/lib/ranking";
import { scoreMatchPrediction } from "@/lib/scoring";
import { getServerLocale } from "@/lib/server-locale";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
function poolBannerUrl(poolId: string, bannerPath?: string | null, version?: string | null) {
  const objectPath = bannerPath ?? `pools/${poolId}.webp`;
  const url = `${supabaseUrl}/storage/v1/object/public/pool-media/${objectPath}`;
  return version ? `${url}?v=${encodeURIComponent(version)}` : url;
}

/**
 * Haalt alle rijen op in pagina's van 1000, zodat de PostgREST max-rows-cap niet
 * stilletjes rijen afkapt (bijv. voorspellingen van sommige poule-leden).
 */
async function fetchAllRows<T>(page: (from: number, to: number) => PromiseLike<{ data: T[] | null }>): Promise<T[]> {
  const pageSize = 1000;
  const rows: T[] = [];
  for (let from = 0; ; from += pageSize) {
    const { data } = await page(from, from + pageSize - 1);
    if (!data?.length) break;
    rows.push(...data);
    if (data.length < pageSize) break;
  }
  return rows;
}

const poolCopy = {
  nl: {
    metaTitle: "Mijn WK-poules",
    metaDescription: "Bekijk, deel en beheer je SlimeScore WK 2026-poules.",
    errors: {
      code: "Die WK-poulecode klopt niet. Controleer de code.",
      rechten: "Je hebt hier geen rechten voor.",
      naam: "Kies een geldige WK-poulenaam (min. 2 tekens).",
      limiet: "Je zit al aan het maximum aantal WK-poules (20).",
      kleur: "Kies een geldige kleur.",
      rol: "Die rol kan niet worden ingesteld.",
      "bericht-kort": "Je bericht is te kort (minimaal 10 tekens).",
      "naam-bezet": "Er bestaat al een WK-poule met deze naam. Kies een nét andere naam.",
      "te-snel": "Even rustig aan — je doet dit te vaak achter elkaar. Probeer het zo nog eens.",
      afbeelding: "Kies een geldige afbeelding.",
      "afbeelding-groot": "De afbeelding is te groot (max 6 MB).",
    },
    fallbackError: "Er ging iets mis. Probeer het opnieuw.",
    updated: (params: { aangemaakt?: string; joined?: string; bijgewerkt?: string }) =>
      `Bijgewerkt${params.aangemaakt ? `: code ${params.aangemaakt}` : ""}${params.joined ? `: je doet mee met ${params.joined}` : ""}.`,
    inviteText: (poolName: string, poolCode: string) => `Doe je mee met onze 100% gratis WK-poule "${poolName}"?\n\nPoulecode: ${poolCode}\nNog geen account? Maak eerst gratis een SlimeScore-account aan; daarna kom je via deze link/code in de poule.\n\n1x ±10 min invullen. Daarna volg je het speelschema en de uitslagen.`,
    codeLabel: "Code",
    board: "Prikbord",
    boardPlaceholder: "Schrijf iets voor je WK-poule… (min. 10 tekens)",
    addEmoji: "Emoji toevoegen",
    pin: "Vastzetten bovenaan",
    posting: "Plaatsen…",
    post: "Plaats",
    pinned: "Vastgezet",
    delete: "Verwijder",
    noMessages: "Nog geen berichten.",
    shareOptions: "Deelopties & QR",
    inviteLink: "Uitnodigingslink",
    settings: "WK-poule-instellingen & opmaak (beheer)",
    dressUp: "WK-poule aankleden",
    color: "Kleur",
    groupLine: "Groepszin",
    groupLinePlaceholder: "Bijv. iedereen tegen oom Jan",
    save: "Opslaan",
    uploadBanner: "WK-poulebanner uploaden",
    uploadHint:
      "Aanbevolen: brede banner, liefst 1050 × 210 px (5:1). We slaan uploads op als .webp en tonen de banner over de volle breedte van de poulekaart.",
    uploading: "Uploaden…",
    upload: "Upload banner",
    manageCode: "Deelcode beheren",
    resetHint: "Maakt een nieuwe code; de oude uitnodigingslink werkt daarna niet meer.",
    resetTitle: "Maak een nieuwe deelcode",
    newCode: "Nieuwe code",
    manageMembers: "Leden beheren (beheer)",
    memberRole: "Deelnemer",
    roleButton: "Rol",
    noPoolsTitle: "Nog geen WK-poules",
    noPoolsText: "Maak er een aan of sluit aan met een code op de",
    homeLink: "startpagina",
    joinCreateLink: "Meedoen aan poule of maak poule",
    soccerLead: "Even pauze?",
    soccerText: "Speel een potje Slime Soccer tegen de computer of je vrienden.",
    play: "Spelen →",
    owner: "Beheerder",
    moderator: "Moderator",
    player: "Speler",
  },
  en: {
    metaTitle: "My World Cup pools",
    metaDescription: "View, share and manage your SlimeScore World Cup 2026 pools.",
    errors: {
      code: "That World Cup pool code is not correct. Please check the code.",
      rechten: "You do not have permission for this.",
      naam: "Choose a valid World Cup pool name (min. 2 characters).",
      limiet: "You have reached the maximum number of World Cup pools (20).",
      kleur: "Choose a valid colour.",
      rol: "That role cannot be set.",
      "bericht-kort": "Your message is too short (minimum 10 characters).",
      "naam-bezet": "A World Cup pool with this name already exists. Choose a slightly different name.",
      "te-snel": "Easy there — you are doing this too often. Try again in a moment.",
      afbeelding: "Choose a valid image.",
      "afbeelding-groot": "The image is too large (max 6 MB).",
    },
    fallbackError: "Something went wrong. Please try again.",
    updated: (params: { aangemaakt?: string; joined?: string; bijgewerkt?: string }) =>
      `Updated${params.aangemaakt ? `: code ${params.aangemaakt}` : ""}${params.joined ? `: you joined ${params.joined}` : ""}.`,
    inviteText: (poolName: string, poolCode: string) => `Join our 100% free World Cup pool "${poolName}"?\n\nPool code: ${poolCode}\nNo account yet? Create a free SlimeScore account first; then this link/code takes you into the pool.\n\nFill in once in about 10 minutes. Then follow the schedule and results.`,
    codeLabel: "Code",
    board: "Message board",
    boardPlaceholder: "Write something for your World Cup pool… (min. 10 characters)",
    addEmoji: "Add emoji",
    pin: "Pin to the top",
    posting: "Posting…",
    post: "Post",
    pinned: "Pinned",
    delete: "Delete",
    noMessages: "No messages yet.",
    shareOptions: "Share options & QR",
    inviteLink: "Invitation link",
    settings: "World Cup pool settings & styling (admin)",
    dressUp: "Style World Cup pool",
    color: "Colour",
    groupLine: "Group tagline",
    groupLinePlaceholder: "E.g. everyone against Uncle John",
    save: "Save",
    uploadBanner: "Upload World Cup pool banner",
    uploadHint:
      "Recommended: a wide banner, preferably 1050 × 210 px (5:1). Uploads are stored as .webp and shown across the full width of the pool card.",
    uploading: "Uploading…",
    upload: "Upload banner",
    manageCode: "Manage share code",
    resetHint: "Creates a new code; the old invitation link stops working.",
    resetTitle: "Create a new share code",
    newCode: "New code",
    manageMembers: "Manage members (admin)",
    memberRole: "Participant",
    roleButton: "Role",
    noPoolsTitle: "No World Cup pools yet",
    noPoolsText: "Create one or join with a code on the",
    homeLink: "home page",
    joinCreateLink: "Join or create a pool",
    soccerLead: "Need a break?",
    soccerText: "Play Slime Soccer against the computer or your friends.",
    play: "Play →",
    owner: "Manager",
    moderator: "Moderator",
    player: "Player",
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  return {
    title: poolCopy[locale].metaTitle,
    description: poolCopy[locale].metaDescription,
  };
}

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
    banner_path: string | null;
    banner_updated_at: string | null;
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
  const locale = await getServerLocale();
  const copy = poolCopy[locale];
  const dateLocale = locale === "en" ? "en-GB" : "nl-NL";
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(localizedHref("/", locale));

  // Meedoen vereist een complete scorekaart (naam + teamnaam, min. 4 tekens).
  const { data: ownProfile } = await supabase.from("profiles").select("nickname,team_name").eq("id", user.id).maybeSingle();
  if (!ownProfile?.nickname || !ownProfile.team_name) redirect(localizedHref("/", locale));

  const [{ data }, { data: messages }] = await Promise.all([
    supabase
      .from("pool_members")
      .select("pool_id,user_id,role,profiles(nickname,team_name,avatar_key),pools(id,name,code,owner_id,description,badge_emoji,accent_color,banner_path,banner_updated_at)")
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
    const [{ data: matchRows }, { data: scoreRows }, predictionRows] = await Promise.all([
      admin
        .from("matches")
        .select("id,starts_at,status,home_code,away_code,home_score,away_score,home:teams!matches_home_code_fkey(name_nl),away:teams!matches_away_code_fkey(name_nl)")
        .order("starts_at"),
      admin.from("scores").select("user_id,points,profiles(nickname,team_name)"),
      // Gepagineerd: bij genoeg poule-leden overschrijden de voorspellingen (tot
      // 72 per speler) de PostgREST max-rows-cap (1000). Zónder paginering zou je
      // dan niet van iedereen de voorspellingen zien.
      fetchAllRows<PredictionRow>((from, to) =>
        admin
          .from("predictions")
          .select("user_id,match_id,home_score,away_score")
          .in("user_id", memberIds)
          .order("user_id")
          .order("match_id")
          .range(from, to),
      ),
    ]);

    const realScores = (scoreRows ?? []) as Array<{ user_id: string; points: number }>;
    const rankedScores = withPublicRankScores((scoreRows ?? []) as unknown as RankedScore[]).sort(compareScoresAlphabetical);
    for (const row of realScores) {
      pointsByUser.set(row.user_id, row.points);
    }
    for (const [userId, rank] of worldRankMap(rankedScores)) {
      worldRankByUser.set(userId, rank);
    }

    for (const row of (matchRows ?? []) as unknown as Array<{
      id: number;
      starts_at: string | null;
      status: string | null;
      home_score: number | null;
      away_score: number | null;
      home_code: string | null;
      away_code: string | null;
      home: { name_nl: string | null } | null;
      away: { name_nl: string | null } | null;
    }>) {
      matchInfoById.set(row.id, {
        id: row.id,
        startsAt: row.starts_at,
        status: row.status,
        homeName: teamNameForLocale(row.home_code, row.home?.name_nl, locale),
        awayName: teamNameForLocale(row.away_code, row.away?.name_nl, locale),
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
      buildPoolMembers(pool.members, user.id, revealOthers, matchInfoById, predictionsByUser, pointsByUser, worldRankByUser, locale),
    );
  }

  const poolJoinAssets = new Map<string, { joinUrl: string; qrDataUrl: string }>();
  await Promise.all(
    pools.map(async (pool) => {
      const joinUrl = locale === "en" ? `${SITE_URL}/poules/join/${pool.code}?lang=en` : `${SITE_URL}/poules/join/${pool.code}`;
      const qrDataUrl = await QRCode.toDataURL(joinUrl, {
        errorCorrectionLevel: "M",
        margin: 1,
        width: 180,
        // Echte hex (geen CSS-var): qrcode-lib parseert dit als kleurwaarde.
        color: { dark: "#081634", light: "#ffffff" },
      });
      poolJoinAssets.set(pool.id, { joinUrl, qrDataUrl });
    }),
  );

  const tabs = pools.map((pool) => ({ id: pool.id, label: pool.name, emoji: pool.badgeEmoji }));

  return (
    <main className="page-shell poules-page-shell">
      <header className="mb-5 grid gap-4">
        <Brand locale={locale} />
      </header>

      {params.aangemaakt || params.joined || params.bijgewerkt ? (
        <div className="mb-4 rounded-lg border border-green-300 bg-green-50 p-4 font-bold text-green-800">
          {copy.updated(params)}
        </div>
      ) : null}
      {params.fout ? (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4 font-bold text-red-800">
          {copy.errors[params.fout as keyof typeof copy.errors] ?? copy.fallbackError}
        </div>
      ) : null}

      <Link href={localizedHref("/#meedoen", locale)} className="poules-join-create-link">
        <KeyRound aria-hidden="true" className="size-4" />
        {copy.joinCreateLink}
      </Link>

      <section className="mt-1">
        {pools.length ? (
          <PoolTabs tabs={tabs} initialId={params.pool} locale={locale}>
          {pools.map((pool) => {
            const currentMember = pool.members.find((member) => member.user_id === user.id);
            const isOwner = currentMember?.role === "owner";
            const isManager = currentMember?.role === "owner" || currentMember?.role === "moderator";
            const joinAssets = poolJoinAssets.get(pool.id) ?? { joinUrl: SITE_URL, qrDataUrl: "" };
            const inviteText = copy.inviteText(pool.name, pool.code);
            const poolHeroStyle = {
              "--pool-accent": pool.accentColor,
              "--pool-banner-image": `url("${poolBannerUrl(pool.id, pool.bannerPath, pool.bannerUpdatedAt)}")`,
            } as CSSProperties;
            return (
              <article key={pool.id} className="panel pool-card overflow-hidden">
                <div className="pool-card-hero text-white" style={poolHeroStyle}>
                  <div className="min-w-0">
                    <div className="pool-card-title-row">
                      <h2 className="pool-card-title"><span aria-hidden="true">{pool.badgeEmoji}</span> {pool.name}</h2>
                      <PoolQuickShare
                        joinUrl={joinAssets.joinUrl}
                        poolName={pool.name}
                        poolCode={pool.code}
                        inviteText={inviteText}
                        locale={locale}
                      />
                    </div>
                    <p className="pool-code-line">
                      {copy.codeLabel}: <span className="pool-code-pill">{pool.code}</span>
                    </p>
                    {pool.description ? <p className="pool-card-description">{pool.description}</p> : null}
                  </div>
                </div>
                <PoolMembers members={poolMembersById.get(pool.id) ?? []} locale={locale} />
                <div className="border-b border-slate-200 p-4 pool-board-section">
                  <h3 className="pool-board-titlebar">{copy.board}</h3>
                  <form action={postPoolMessage} className="mt-3 grid gap-2">
                    <input type="hidden" name="pool_id" value={pool.id} />
                    <PoolBoardComposer placeholder={copy.boardPlaceholder} addLabel={copy.addEmoji} />
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      {isManager ? (
                        <label className="flex items-center gap-2 text-sm font-medium text-[#101a2b]">
                          <input type="checkbox" name="pinned" /> {copy.pin}
                        </label>
                      ) : (
                        <span />
                      )}
                      <PendingButton className="button-primary min-h-9 px-3 text-sm" pendingText={copy.posting}>
                        <Megaphone aria-hidden="true" className="size-4" />
                        {copy.post}
                      </PendingButton>
                    </div>
                  </form>
                  <div className="mt-3 grid gap-2 pool-board-messages">
                    {(messagesByPool.get(pool.id) ?? []).slice(0, 6).map((message) => {
                      const canDelete = isManager || message.author_id === user.id;
                      return (
                        <div
                          key={message.id}
                          className={`rounded-lg border pool-board-message ${message.pinned ? "pool-board-message-pinned" : ""}`}
                        >
                          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-normal text-[#4c5a70]">
                            {message.pinned ? <span className="text-[#9a6b12]">{copy.pinned}</span> : null}
                            <span>{displayName(message.profiles)}</span>
                            <span>{new Intl.DateTimeFormat(dateLocale, { dateStyle: "short", timeStyle: "short" }).format(new Date(message.created_at))}</span>
                            {canDelete ? (
                              <form action={deletePoolMessage} className="ml-auto">
                                <input type="hidden" name="pool_id" value={pool.id} />
                                <input type="hidden" name="message_id" value={message.id} />
                                <button className="font-bold text-[#b23b46] hover:underline" type="submit">
                                  {copy.delete}
                                </button>
                              </form>
                            ) : null}
                          </div>
                          <p className="mt-1 text-sm font-medium leading-6 text-[#101a2b]">{message.body}</p>
                        </div>
                      );
                    })}
                    {!messagesByPool.get(pool.id)?.length ? (
                      <p className="text-sm font-medium text-[#4c5a70]">{copy.noMessages}</p>
                    ) : null}
                  </div>
                </div>
                <details className="pool-share-details border-b border-slate-200 bg-[#fffaf0]">
                  <summary className="cursor-pointer p-4 text-sm font-bold text-[#101a2b]">{copy.shareOptions}</summary>
                  <div className="pool-invite-strip pool-invite-strip-hidden">
                    <div className="pool-invite-copy">
                      <p className="pool-invite-kicker">{copy.inviteLink}</p>
                      <a className="pool-invite-url" href={joinAssets.joinUrl}>
                        {joinAssets.joinUrl.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                    <PoolQr qrDataUrl={joinAssets.qrDataUrl} poolName={pool.name} joinUrl={joinAssets.joinUrl} locale={locale} />
                  </div>
                </details>
                {isManager ? (
                  <details className="border-b border-slate-200 bg-slate-50">
                    <summary className="cursor-pointer p-4 text-sm font-bold text-[#101a2b]">
                      {copy.settings}
                    </summary>
                  <div className="grid items-start gap-4 p-4 pt-0 md:grid-cols-2">
                    <form action={updatePoolStyle} className="grid gap-3">
                      <input type="hidden" name="pool_id" value={pool.id} />
                      <div className="flex items-center gap-2 font-bold text-[#101a2b]">
                        <Palette aria-hidden="true" className="size-5 text-[#2c4a72]" />
                        {copy.dressUp}
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
                          {copy.color}
                          <input className="field h-[46px]" name="accent_color" type="color" defaultValue={pool.accentColor} />
                        </label>
                        <label className="grid gap-1 text-xs font-bold text-[#101a2b]">
                          {copy.groupLine}
                          <input className="field" name="description" maxLength={180} defaultValue={pool.description ?? ""} placeholder={copy.groupLinePlaceholder} />
                        </label>
                      </div>
                      <button className="button-secondary w-fit" type="submit">{copy.save}</button>
                    </form>
                    <form action={uploadPoolImage} className="grid gap-3">
                      <input type="hidden" name="pool_id" value={pool.id} />
                      <div className="flex items-center gap-2 font-bold text-[#101a2b]">
                        <ImagePlus aria-hidden="true" className="size-5 text-[#2f7a60]" />
                        {copy.uploadBanner}
                      </div>
                      <p className="text-xs font-medium text-[#4c5a70]">
                        {copy.uploadHint}
                      </p>
                      <input className="field" type="file" name="image" accept="image/*" required />
                      <PendingButton className="button-secondary w-fit" pendingText={copy.uploading}>
                        {copy.upload}
                      </PendingButton>
                    </form>
                    {isOwner ? (
                      <form action={resetPoolCode} className="grid gap-2 rounded-xl border border-slate-200 bg-white p-3 md:col-span-2">
                        <input type="hidden" name="pool_id" value={pool.id} />
                        <div className="font-bold text-[#101a2b]">{copy.manageCode}</div>
                        <p className="text-xs font-medium text-[#4c5a70]">{copy.resetHint}</p>
                        <button className="button-plain button-compact w-fit" type="submit" title={copy.resetTitle}>
                          <RefreshCw aria-hidden="true" className="size-4" />
                          {copy.newCode}
                        </button>
                      </form>
                    ) : null}
                  </div>
                  </details>
                ) : null}
                {isManager ? (
                <details className="border-b border-slate-200 bg-slate-50">
                  <summary className="cursor-pointer p-4 text-sm font-bold text-[#101a2b]">{copy.manageMembers}</summary>
                  <div className="px-4 pb-4 divide-y divide-slate-200">
                  {pool.members.map((member) => (
                    <div key={member.user_id} className="grid gap-3 py-3 md:grid-cols-[1fr_auto] md:items-center">
                      <div className="flex items-center gap-3">
                        <Avatar name={displayName(member.profiles)} avatarKey={member.profiles?.avatar_key} />
                        <div className="min-w-0">
                          <div className="truncate font-bold text-[var(--ink)]">{displayName(member.profiles)}</div>
                          <div className="text-sm font-semibold text-[var(--text-muted)]">{roleLabel(member.role, locale)}</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {isOwner && member.role !== "owner" ? (
                          <form action={setMemberRole} className="flex gap-2">
                            <input type="hidden" name="pool_id" value={pool.id} />
                            <input type="hidden" name="user_id" value={member.user_id} />
                            <select className="field min-h-11 w-auto" name="role" defaultValue={member.role}>
                              <option value="member">{copy.memberRole}</option>
                              <option value="moderator">Moderator</option>
                            </select>
                            <button className="button-secondary" type="submit">{copy.roleButton}</button>
                          </form>
                        ) : null}
                        {(isOwner || member.user_id === user.id) && member.role !== "owner" ? (
                          <form action={removeMember}>
                            <input type="hidden" name="pool_id" value={pool.id} />
                            <input type="hidden" name="user_id" value={member.user_id} />
                            <button className="button-secondary" type="submit">
                              <Trash2 aria-hidden="true" className="size-4" />
                              {copy.delete}
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
            <h2 className="text-2xl font-bold text-[var(--ink)]">{copy.noPoolsTitle}</h2>
            <p className="mt-2 font-medium text-[var(--text-muted)]">
              {copy.noPoolsText}{" "}
              <Link className="font-bold text-[var(--accent-blue)]" href={localizedHref("/", locale)}>{copy.homeLink}</Link>.
            </p>
          </div>
        )}
      </section>

      <Link href={localizedHref("/games?game=soccer", locale)} className="poule-soccer-mini">
        <span aria-hidden="true" className="poule-soccer-mini-ball">⚽</span>
        <span className="poule-soccer-mini-text">
          <strong>{copy.soccerLead}</strong> {copy.soccerText}
        </span>
        <span className="poule-soccer-mini-cta">{copy.play}</span>
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
      bannerPath: string | null;
      bannerUpdatedAt: string | null;
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
      bannerPath: row.pools.banner_path,
      bannerUpdatedAt: row.pools.banner_updated_at,
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

function roleLabel(role: MemberRow["role"], locale: Locale) {
  const copy = poolCopy[locale];
  if (role === "owner") return copy.owner;
  if (role === "moderator") return copy.moderator;
  return copy.memberRole;
}

const amsterdamDayFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Amsterdam",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function amsterdamDayKey(input: string | Date | null) {
  if (!input) return "";
  const date = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) return "";
  const parts = Object.fromEntries(amsterdamDayFormatter.formatToParts(date).map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function buildPoolMembers(
  members: MemberRow[],
  currentUserId: string,
  revealOthers: boolean,
  matchInfoById: Map<number, MatchInfo>,
  predictionsByUser: Map<string, PredictionRow[]>,
  pointsByUser: Map<string, number>,
  worldRankByUser: Map<string, number>,
  locale: Locale,
): PoolMember[] {
  const dateLocale = locale === "en" ? "en-GB" : "nl-NL";
  const playerFallback = poolCopy[locale].player;
  const todayKey = amsterdamDayKey(new Date());
  const built = members.map((member) => {
    const isYou = member.user_id === currentUserId;
    const visible = isYou || revealOthers;
    const past: MatchLine[] = [];
    const upcoming: MatchLine[] = [];
    let dailyPoints = 0;

    if (visible) {
      const predictions = (predictionsByUser.get(member.user_id) ?? [])
        .map((prediction) => ({ prediction, match: matchInfoById.get(prediction.match_id) }))
        .filter((entry): entry is { prediction: PredictionRow; match: MatchInfo } => Boolean(entry.match))
        .sort((a, b) => (a.match.startsAt ?? "").localeCompare(b.match.startsAt ?? ""));

      for (const { prediction, match } of predictions) {
        const finished = match.status === "finished" && match.homeScore !== null && match.awayScore !== null;
        const line: MatchLine = {
          matchId: match.id,
          when: formatAmsterdam(match.startsAt, dateLocale),
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
        if (finished) {
          if (amsterdamDayKey(match.startsAt) === todayKey) dailyPoints += line.points ?? 0;
          past.push(line);
        } else upcoming.push(line);
      }
      past.reverse();
    }

    return {
      userId: member.user_id,
      rank: 0,
      worldRank: worldRankByUser.get(member.user_id) ?? null,
      isOwner: member.role === "owner",
      name: member.profiles?.nickname ?? playerFallback,
      teamName: member.profiles?.team_name ?? null,
      avatarKey: member.profiles?.avatar_key ?? null,
      points: pointsByUser.get(member.user_id) ?? 0,
      dailyPoints,
      isYou,
      locked: !visible,
      past: past.slice(0, 3),
      upcoming: upcoming.slice(0, 3),
    };
  });

  return built
    .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name))
    .map((member, index) => ({ ...member, rank: index + 1 }));
}
