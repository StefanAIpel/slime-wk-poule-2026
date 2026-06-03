import { Gamepad2 } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { GameFrames } from "@/components/game-frames";
import { SLIME_GAME_URL, SLIME_VOLLEY_URL } from "@/lib/constants";

export const metadata = { title: "Spelletjes" };

export default async function GamesPage({ searchParams }: { searchParams: Promise<{ game?: string }> }) {
  const params = await searchParams;
  return (
    <main className="page-shell">
      <header className="mb-4 grid gap-3">
        <Brand />
        <div className="flex items-center gap-2">
          <Gamepad2 aria-hidden="true" className="size-6 text-[#064ed6]" />
          <h1 className="text-2xl font-bold text-[#081634]">Slime-spelletjes</h1>
        </div>
        <p className="text-sm font-medium text-[#54657f]">
          Even opwarmen? Speel Slime Soccer of Slime Volley — gewoon hier in Slime Score.
        </p>
      </header>

      <GameFrames soccerUrl={SLIME_GAME_URL} volleyUrl={SLIME_VOLLEY_URL} initial={params.game ?? "soccer"} />

      <BottomNav current="/games" />
    </main>
  );
}
