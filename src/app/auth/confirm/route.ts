import { type EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const host = request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") ?? "http";
  const origin = host ? `${protocol}://${host}` : request.nextUrl.origin;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/?login=gelukt";
  const supabase = await createClient();

  if (tokenHash) {
    const typesToTry = Array.from(new Set([type, "signup", "magiclink", "email"].filter(Boolean) as EmailOtpType[]));
    for (const otpType of typesToTry) {
      const { error } = await supabase.auth.verifyOtp({ type: otpType, token_hash: tokenHash });
      if (!error) return NextResponse.redirect(`${origin}${next}`);
    }
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/?auth=fout`);
}
