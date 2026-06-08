import type { Metadata } from "next";
import { Gamepad2 } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { GameFrames } from "@/components/game-frames";
import { SITE_URL, SLIME_GAME_URL, SLIME_VOLLEY_URL } from "@/lib/constants";
import type { Locale } from "@/lib/i18n";
import { getServerLocale } from "@/lib/server-locale";

const gamesCopy = {
  nl: {
    title: "Slime-spelletjes",
    description: "Speel Slime Soccer en Slime Volley naast je gratis WK 2026-poule.",
  },
  en: {
    title: "Slime games",
    description: "Play Slime Soccer and Slime Volley alongside your free World Cup 2026 pool.",
  },
} as const;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const copy = gamesCopy[locale];
  return {
    title: copy.title,
    description: copy.description,
    keywords:
      locale === "en"
        ? ["Slime Soccer", "Slime Volley", "World Cup football game", "soccer browser game", "World Cup 2026 pool"]
        : ["Slime Soccer", "Slime Volley", "WK spelletjes", "voetbal browsergame", "WK 2026 poule"],
    alternates: {
      canonical: `${SITE_URL}/games`,
      languages: {
        nl: `${SITE_URL}/games`,
        en: `${SITE_URL}/games?lang=en`,
      },
    },
    openGraph: {
      title: copy.title,
      description: copy.description,
      url: `${SITE_URL}/games`,
      locale: locale === "en" ? "en_GB" : "nl_NL",
    },
  };
}

export default async function GamesPage({ searchParams }: { searchParams: Promise<{ game?: string }> }) {
  const params = await searchParams;
  const locale: Locale = await getServerLocale();
  const copy = gamesCopy[locale];
  return (
    <main className="page-shell game-page-shell">
      <header className="mb-4 grid gap-3">
        <Brand locale={locale} />
        <div className="game-page-heading flex items-center gap-2">
          <Gamepad2 aria-hidden="true" className="size-6 text-[#064ed6]" />
          <h1 className="text-2xl font-bold text-[#081634]">{copy.title}</h1>
        </div>
      </header>

      <GameFrames soccerUrl={SLIME_GAME_URL} volleyUrl={SLIME_VOLLEY_URL} initial={params.game ?? "soccer"} locale={locale} />

      <BottomNav current="/games" className="bottom-nav-hide-mobile" />
    </main>
  );
}
