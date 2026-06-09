import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, SearchX, Wrench } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import { Brand } from "@/components/brand";
import { SLIME_GAME_URL } from "@/lib/constants";

const VOLLEY_GAME_URL = "https://volley.slimescore.com";

export default function NotFound() {
  return (
    <>
      <main className="page-shell grid min-h-screen content-center gap-5">
        <Brand />

        <section className="hero-band overflow-hidden p-5 md:grid-cols-[1fr_minmax(260px,0.8fr)] md:p-7">
          <div className="grid content-center gap-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/16 px-3 py-2 text-sm font-black uppercase tracking-normal text-yellow-100 ring-1 ring-white/20">
              <SearchX aria-hidden="true" className="size-4" />
              Gangpad 404
            </div>
            <div>
              <h1 className="text-4xl font-black leading-none md:text-6xl">Deze link ligt nog in onderdelen.</h1>
              <p className="mt-4 max-w-2xl text-lg font-semibold leading-7 text-blue-50">
                Onze Zweedse Slime is bezig met tijdelijk onderhoud. Er mist waarschijnlijk alleen een schroefje,
                een voorspelling of een geldige URL.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/" className="button-primary">
                <ArrowLeft aria-hidden="true" className="size-5" />
                Terug naar de WK-poule
              </Link>
              <a href={SLIME_GAME_URL} className="button-secondary" target="_blank" rel="noopener noreferrer">
                Slime Soccer
                <ExternalLink aria-hidden="true" className="size-4" />
              </a>
              <a href={VOLLEY_GAME_URL} className="button-secondary" target="_blank" rel="noopener noreferrer">
                Slime Volley
                <ExternalLink aria-hidden="true" className="size-4" />
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[420px] self-end pt-2 md:pt-0">
            <div className="absolute inset-x-8 bottom-2 h-12 rounded-full bg-black/22 blur-2xl" />
            <Image
              className="relative z-10 h-auto w-full drop-shadow-2xl"
              src="/slimes/ikea-maintenance-slime-404.webp"
              alt="Zweedse Slime met een stapelbed-bouwpakket"
              width={720}
              height={720}
              priority
            />
          </div>
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          <div className="panel p-4">
            <div className="flex items-center gap-2 text-lg font-black text-[var(--ink)]">
              <Wrench aria-hidden="true" className="size-5 text-[#ff7a00]" />
              Handleiding kwijt?
            </div>
            <p className="mt-2 text-sm font-semibold leading-6 text-[var(--text-muted)]">
              Check de spelling of ga terug naar de startpagina. De WK-poule staat nog gewoon stevig in elkaar.
            </p>
          </div>
          <a className="panel p-4 no-underline transition hover:-translate-y-0.5 hover:shadow-xl" href={SLIME_GAME_URL} target="_blank" rel="noopener noreferrer">
            <div className="text-lg font-black text-[var(--ink)]">/soccer</div>
            <p className="mt-2 text-sm font-semibold leading-6 text-[var(--text-muted)]">
              Direct door naar Slime Soccer voor even rammen tegen de bal.
            </p>
          </a>
          <a className="panel p-4 no-underline transition hover:-translate-y-0.5 hover:shadow-xl" href={VOLLEY_GAME_URL} target="_blank" rel="noopener noreferrer">
            <div className="text-lg font-black text-[var(--ink)]">/volley</div>
            <p className="mt-2 text-sm font-semibold leading-6 text-[var(--text-muted)]">
              Direct door naar Slime Volley als je liever over het net kliedert.
            </p>
          </a>
        </section>
      </main>
      <BottomNav current="/" />
    </>
  );
}
