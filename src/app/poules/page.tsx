import { ImagePlus, Megaphone, Palette, ShieldCheck, Trash2, Users } from "lucide-react";
import { redirect } from "next/navigation";
import {
  createPool,
  deletePoolMessage,
  joinPool,
  postPoolMessage,
  removeMember,
  setMemberRole,
  updatePoolStyle,
  uploadPoolImage,
} from "@/app/actions";
import { Avatar } from "@/components/avatar";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { HeroArt } from "@/components/hero-art";
import { PendingButton } from "@/components/pending-button";
import { PoolBanner } from "@/components/pool-banner";
import { CopyButton, WhatsappShare } from "@/components/share-button";
import { SITE_URL } from "@/lib/constants";
import { displayName } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
function poolBannerUrl(poolId: string) {
  return `${supabaseUrl}/storage/v1/object/public/pool-media/pools/${poolId}.webp`;
}

const poolErrors: Record<string, string> = {
  code: "Die poulecode klopt niet. Controleer de code.",
  rechten: "Je hebt hier geen rechten voor.",
  naam: "Kies een geldige poulenaam (min. 2 tekens).",
  kleur: "Kies een geldige kleur.",
  rol: "Die rol kan niet worden ingesteld.",
  "bericht-kort": "Je bericht is te kort (minimaal 10 tekens).",
  "te-snel": "Even rustig — wacht een paar tellen voor je opnieuw post.",
  afbeelding: "Kies een geldige afbeelding.",
  "afbeelding-groot": "De afbeelding is te groot (max 6 MB).",
};

type MemberRow = {
  pool_id: string;
  user_id: string;
  role: "owner" | "moderator" | "member";
  profiles: { nickname: string | null; team_name: string | null } | null;
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
  searchParams: Promise<{ aangemaakt?: string; joined?: string; fout?: string; bijgewerkt?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const [{ data }, { data: messages }] = await Promise.all([
    supabase
      .from("pool_members")
      .select("pool_id,user_id,role,profiles(nickname,team_name),pools(id,name,code,owner_id,description,badge_emoji,accent_color)")
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

  return (
    <main className="page-shell">
      <header className="mb-5 grid gap-4">
        <Brand />
        <div
          className="hero-band hero-band-visual"
          style={{ "--hero-image": "url('/assets/Hero-bg.webp')" } as React.CSSProperties}
        >
          <div className="hero-content">
            <h1 className="text-2xl font-extrabold leading-tight text-white md:text-3xl">
              Speel samen — maak of join je poule
            </h1>
            <p className="mt-1 text-sm font-semibold leading-6 text-blue-50 md:text-base">
              Daag vrienden, familie of collega&rsquo;s uit, vul je scores in en strijd om de eerste plek.
            </p>
          </div>
          <HeroArt src="/assets/slime-05-ikea.png" />
        </div>
      </header>

      {params.aangemaakt || params.joined || params.bijgewerkt ? (
        <div className="mb-4 rounded-lg border border-green-300 bg-green-50 p-4 font-black text-green-800">
          Bijgewerkt{params.aangemaakt ? `: code ${params.aangemaakt}` : ""}{params.joined ? `: je doet mee met ${params.joined}` : ""}.
        </div>
      ) : null}
      {params.fout ? (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-4 font-extrabold text-red-800">
          {poolErrors[params.fout] ?? "Er ging iets mis. Probeer het opnieuw."}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2">
        <form action={createPool} className="panel grid gap-3 p-4">
          <div className="flex items-center gap-3">
            <ShieldCheck aria-hidden="true" className="size-7 text-[#064ed6]" />
            <h2 className="text-2xl font-black text-[#081634]">Nieuwe poule</h2>
          </div>
          <label className="grid gap-2 text-sm font-black text-[#081634]">
            Naam van je poule
            <input className="field" name="name" required minLength={2} maxLength={50} placeholder="Familie Dijkstra" />
          </label>
          <button className="button-primary" type="submit">
            Poule maken
          </button>
        </form>

        <form action={joinPool} className="panel grid gap-3 p-4">
          <div className="flex items-center gap-3">
            <Users aria-hidden="true" className="size-7 text-[#25a84a]" />
            <h2 className="text-2xl font-black text-[#081634]">Meedoen met code</h2>
          </div>
          <label className="grid gap-2 text-sm font-black text-[#081634]">
            Poulecode
            <input className="field uppercase" name="code" required minLength={6} maxLength={10} placeholder="SLIME26" />
          </label>
          <button className="button-primary" type="submit">
            Aansluiten
          </button>
        </form>
      </section>

      <section className="mt-5 grid gap-4">
        {pools.length ? (
          pools.map((pool) => {
            const currentMember = pool.members.find((member) => member.user_id === user.id);
            const isOwner = currentMember?.role === "owner";
            const isManager = currentMember?.role === "owner" || currentMember?.role === "moderator";
            const shareText = `Doe mee met onze gratis WK 2026-poule "${pool.name}"! Vul code ${pool.code} in op`;
            return (
              <article key={pool.id} className="panel overflow-hidden">
                <PoolBanner src={poolBannerUrl(pool.id)} alt={`Banner van ${pool.name}`} />
                <div className="grid gap-3 p-4 text-white md:grid-cols-[1fr_auto] md:items-center" style={{ background: pool.accentColor }}>
                  <div>
                    <h2 className="text-2xl font-black"><span aria-hidden="true">{pool.badgeEmoji}</span> {pool.name}</h2>
                    <p className="mt-1 font-semibold text-white/85">Code: <span className="font-black text-white">{pool.code}</span></p>
                    {pool.description ? <p className="mt-2 max-w-2xl text-sm font-semibold text-white/90">{pool.description}</p> : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <WhatsappShare text={shareText} url={SITE_URL} label="Deel via WhatsApp" />
                    <CopyButton value={pool.code} label={`Code ${pool.code}`} />
                  </div>
                </div>
                {isManager ? (
                  <div className="grid gap-4 border-b border-slate-200 bg-slate-50 p-4 lg:grid-cols-2">
                    <form action={updatePoolStyle} className="grid gap-3">
                      <input type="hidden" name="pool_id" value={pool.id} />
                      <div className="flex items-center gap-2 font-black text-[#101a2b]">
                        <Palette aria-hidden="true" className="size-5 text-[#2c4a72]" />
                        Poule aankleden
                      </div>
                      <div className="grid gap-2 sm:grid-cols-[72px_110px_1fr]">
                        <label className="grid gap-1 text-xs font-black text-[#101a2b]">
                          Emoji
                          <input className="field" name="badge_emoji" defaultValue={pool.badgeEmoji} maxLength={8} />
                        </label>
                        <label className="grid gap-1 text-xs font-black text-[#101a2b]">
                          Kleur
                          <input className="field h-[46px]" name="accent_color" type="color" defaultValue={pool.accentColor} />
                        </label>
                        <label className="grid gap-1 text-xs font-black text-[#101a2b]">
                          Groepszin
                          <input className="field" name="description" maxLength={180} defaultValue={pool.description ?? ""} placeholder="Bijv. iedereen tegen oom Jan" />
                        </label>
                      </div>
                      <button className="button-secondary w-fit" type="submit">Opslaan</button>
                    </form>
                    <form action={uploadPoolImage} className="grid gap-3">
                      <input type="hidden" name="pool_id" value={pool.id} />
                      <div className="flex items-center gap-2 font-black text-[#101a2b]">
                        <ImagePlus aria-hidden="true" className="size-5 text-[#2f7a60]" />
                        Poulebanner uploaden
                      </div>
                      <input className="field" type="file" name="image" accept="image/*" required />
                      <p className="text-xs font-semibold text-[#4c5a70]">
                        Wordt automatisch bijgesneden en geoptimaliseerd (WebP). Max 6 MB.
                      </p>
                      <PendingButton className="button-secondary w-fit" pendingText="Uploaden…">
                        Upload banner
                      </PendingButton>
                    </form>
                  </div>
                ) : null}
                <div className="border-b border-slate-200 p-4">
                  <h3 className="text-lg font-black text-[#101a2b]">Prikbord</h3>
                  <form action={postPoolMessage} className="mt-3 grid gap-2">
                    <input type="hidden" name="pool_id" value={pool.id} />
                    <textarea
                      className="field min-h-20"
                      name="body"
                      minLength={10}
                      maxLength={500}
                      required
                      placeholder="Schrijf iets voor je poule… (min. 10 tekens)"
                    />
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      {isManager ? (
                        <label className="flex items-center gap-2 text-sm font-semibold text-[#101a2b]">
                          <input type="checkbox" name="pinned" /> Vastzetten bovenaan
                        </label>
                      ) : (
                        <span />
                      )}
                      <PendingButton className="button-primary min-h-10 px-4" pendingText="Plaatsen…">
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
                          className={`rounded-lg border p-3 ${message.pinned ? "border-[#e0b23a] bg-amber-50" : "border-slate-200 bg-white"}`}
                        >
                          <div className="flex flex-wrap items-center gap-2 text-xs font-black uppercase tracking-normal text-[#4c5a70]">
                            {message.pinned ? <span className="text-[#9a6b12]">Vastgezet</span> : null}
                            <span>{displayName(message.profiles)}</span>
                            <span>{new Intl.DateTimeFormat("nl-NL", { dateStyle: "short", timeStyle: "short" }).format(new Date(message.created_at))}</span>
                            {canDelete ? (
                              <form action={deletePoolMessage} className="ml-auto">
                                <input type="hidden" name="pool_id" value={pool.id} />
                                <input type="hidden" name="message_id" value={message.id} />
                                <button className="font-black text-[#b23b46] hover:underline" type="submit">
                                  Verwijder
                                </button>
                              </form>
                            ) : null}
                          </div>
                          <p className="mt-1 text-sm font-semibold leading-6 text-[#101a2b]">{message.body}</p>
                        </div>
                      );
                    })}
                    {!messagesByPool.get(pool.id)?.length ? (
                      <p className="text-sm font-semibold text-[#4c5a70]">Nog geen berichten.</p>
                    ) : null}
                  </div>
                </div>
                <div className="divide-y divide-slate-200">
                  {pool.members.map((member) => (
                    <div key={member.user_id} className="grid gap-3 p-4 md:grid-cols-[1fr_auto] md:items-center">
                      <div className="flex items-center gap-3">
                        <Avatar name={displayName(member.profiles)} />
                        <div className="min-w-0">
                          <div className="truncate font-black text-[#081634]">{displayName(member.profiles)}</div>
                          <div className="text-sm font-bold text-[#48617f]">{roleLabel(member.role)}</div>
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
              </article>
            );
          })
        ) : (
          <div className="panel p-5">
            <h2 className="text-2xl font-black text-[#081634]">Nog geen poules</h2>
            <p className="mt-2 font-semibold text-[#48617f]">Maak er een aan of vraag een code aan je groep.</p>
          </div>
        )}
      </section>

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
