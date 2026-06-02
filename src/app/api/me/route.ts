import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ loggedIn: false });

  const admin = createAdminClient();
  const [{ data: profile }, { data: myScore }, { count: predictionCount }] = await Promise.all([
    supabase.from("profiles").select("nickname,team_name").eq("id", user.id).single(),
    admin.from("scores").select("points").eq("user_id", user.id).maybeSingle(),
    supabase.from("predictions").select("match_id", { count: "exact", head: true }).eq("user_id", user.id),
  ]);

  const myPoints = myScore?.points ?? 0;
  const { count: ahead } = await admin
    .from("scores")
    .select("user_id", { count: "exact", head: true })
    .gt("points", myPoints);

  return NextResponse.json({
    loggedIn: true,
    nickname: profile?.nickname ?? null,
    points: myPoints,
    rank: (ahead ?? 0) + 1,
    progress: Math.round(((predictionCount ?? 0) / 72) * 100),
  });
}
