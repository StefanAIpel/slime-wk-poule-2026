import { createHash } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { isValidChoice, type PollChoice } from "@/lib/live-poll";
import { logError } from "@/lib/log";
import { rateLimit } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

/** Stem-identiteit op basis van IP (gehasht), zodat één persoon niet via meerdere
 *  browsers dubbel stemt. Bewust grof (gedeeld IP = 1 stem) — prima voor een poll. */
function voterIdFromRequest(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "";
  const ip = forwarded.split(",")[0]?.trim() || "unknown";
  return createHash("sha256").update(`slimepoll:${ip}`).digest("hex").slice(0, 32);
}

type ActivePoll = { id: string; question: string; option_a: string; option_b: string; option_c: string | null };

async function getActivePoll(admin: ReturnType<typeof createAdminClient>) {
  const { data } = await admin
    .from("live_polls")
    .select("id,question,option_a,option_b,option_c")
    .eq("active", true)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as ActivePoll | null) ?? null;
}

async function countsFor(admin: ReturnType<typeof createAdminClient>, pollId: string) {
  const choiceCount = (choice: PollChoice) =>
    admin.from("live_poll_votes").select("voter_id", { count: "exact", head: true }).eq("poll_id", pollId).eq("choice", choice);
  const [{ count: a }, { count: b }, { count: c }] = await Promise.all([choiceCount("a"), choiceCount("b"), choiceCount("c")]);
  return { a: a ?? 0, b: b ?? 0, c: c ?? 0 };
}

function pollPayload(poll: ActivePoll, counts: { a: number; b: number; c: number }, yourChoice: PollChoice | null) {
  return {
    poll: { id: poll.id, question: poll.question, optionA: poll.option_a, optionB: poll.option_b, optionC: poll.option_c },
    counts,
    yourChoice,
  };
}

/** Huidige actieve poll + stemmen + jouw keuze (op IP). Per gebruiker, no-store. */
export async function GET(request: NextRequest) {
  const admin = createAdminClient();
  const poll = await getActivePoll(admin);
  if (!poll) return NextResponse.json({ poll: null }, { headers: { "Cache-Control": "no-store" } });

  const voterId = voterIdFromRequest(request);
  const { data } = await admin.from("live_poll_votes").select("choice").eq("poll_id", poll.id).eq("voter_id", voterId).maybeSingle();
  const yourChoice = (data?.choice as PollChoice | undefined) ?? null;
  return NextResponse.json(pollPayload(poll, await countsFor(admin, poll.id), yourChoice), { headers: { "Cache-Control": "no-store" } });
}

/** Stem uitbrengen (1 per IP; nogmaals stemmen past je keuze aan). */
export async function POST(request: NextRequest) {
  const admin = createAdminClient();
  const poll = await getActivePoll(admin);
  if (!poll) return NextResponse.json({ poll: null }, { status: 409 });

  const body = (await request.json().catch(() => ({}))) as { choice?: unknown };
  if (!isValidChoice(body.choice, Boolean(poll.option_c))) {
    return NextResponse.json({ error: "choice" }, { status: 400 });
  }
  const choice = body.choice;

  const voterId = voterIdFromRequest(request);
  if (!(await rateLimit(admin, `live_poll_vote:${voterId}`, 30, 60))) {
    return NextResponse.json({ error: "te-snel" }, { status: 429 });
  }

  const { error } = await admin.from("live_poll_votes").upsert({ poll_id: poll.id, voter_id: voterId, choice });
  if (error) {
    logError("livePollVote.upsert", error, { pollId: poll.id });
    return NextResponse.json({ error: "opslaan" }, { status: 500 });
  }

  return NextResponse.json(pollPayload(poll, await countsFor(admin, poll.id), choice));
}
