/**
 * Generieke laad-skeleton voor data-pagina's (force-dynamic). Verschijnt alleen
 * tijdens het laadmoment via loading.tsx; wijzigt niets aan de echte pagina.
 */
export function PageSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <main className="page-shell" aria-hidden="true">
      <div className="mb-5 grid gap-3">
        <div className="h-8 w-44 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-4 w-64 max-w-[80%] animate-pulse rounded bg-slate-200" />
      </div>
      <div className="grid gap-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="panel p-4">
            <div className="h-5 w-1/3 animate-pulse rounded bg-slate-200" />
            <div className="mt-3 grid gap-2">
              <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-4/6 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
