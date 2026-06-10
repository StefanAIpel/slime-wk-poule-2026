# Agent instructions for SlimeScore.com

These instructions apply to this repository (`StefanAIpel/slime-wk-poule-2026`) and production site `https://slimescore.com`.

## Product contract

- Dutch is the primary product language. Root `/` is Dutch and NL/BE visitors must stay Dutch by default.
- English lives at `/en`. International/non-NL-BE fallback may be English; `?lang=en` and `?lang=nl` set the locale cookie and redirect to the canonical route.
- Any visible UI text change must be correct in **both NL and EN**. Audit public and authenticated pages, aria-labels, forms, status bars, share copy, metadata, footer, and deep routes.
- `APP_VERSION` in `src/lib/constants.ts` drives the visible footer version. Any deploy that changes the app/UI must bump it and live verification must confirm `bèta/beta <version>`.
- Signal sharing must use native Web Share / clipboard fallback. Do not reintroduce direct `sgnl://send?text=...` links.
- SlimeScore name/nickname is fixed after signup/profile completion; team name, avatar and language may remain editable.
- Keep temporary test accounts, pools, scripts, credential helpers and local servers cleaned up before reporting done.
- Never print, store, or commit secrets (`.env.local`, Supabase service role, API keys, auth tokens, passwords). Redact as `[REDACTED]`.

## Standard workflow

> **SAFE DEPLOY — flexibel, mét vangnet.** Merge naar `main` (Vercel bouwt vanaf git)
> is de norm en de veiligste weg. Een directe/CLI productie-deploy (`vercel --prod`)
> mag als een fix snel live moet, MITS alle vier:
> 1. **Deploy main-tip, niet je lokale tree.** Eerst `git fetch origin main` en bouw
>    exact die commit. Nooit een ongesynchroniseerde/oude branch naar productie
>    (dat zette op 2026-06-10 tweemaal een verouderde branch live).
> 2. **Groen**: `npm test`, `npm run lint`, `npm run build` slagen.
> 3. **Niet over nieuwer werk heen.** Check eerst wat live staat via `/api/health`
>    (`build.sha`); is de live-sha nieuwer dan die van jou, stem eerst af.
> 4. **Vangnet bekend**: Vercel bewaart elke vorige deploy → bij problemen meteen
>    **Rollback** / promote de vorige deploy (geen rebuild nodig).
>
> Previews (`vercel` zonder `--prod`) mogen altijd. `/api/health` `build.sha: null`
> betekent dat er buiten git om is gedeployed.

1. Start from a clean, current `origin/main` or a named feature branch.
2. For code/UI changes, use branch + PR unless Stefan explicitly asks for a different flow.
3. Before commit/PR/merge, run:
   - `npm test`
   - `npm run lint`
   - `npm run build`
4. Browser-smoke the changed surface. For normal releases include at least:
   - `/` Dutch
   - `/en` English
   - relevant deep route(s)
   - mobile/compact layout where affected
   - browser console errors
   - authenticated flow when account/poule/profile/ranking behavior changed
5. After merge/deploy, wait for Vercel production success and verify the live production URL, not only local or preview.
6. If docs-only changes are made and no app/UI deploy is intended, do not bump `APP_VERSION` just for documentation.

## Repo map

- `src/app`: Next.js App Router pages, server actions, API routes, `/admin`.
- `src/components`: shared UI/client components.
- `src/lib`: domain logic, i18n, constants, ranking/scoring, Supabase helpers.
- `supabase/migrations`: database schema changes.
- `docs`: product/operation documentation.
- `tests`: regression tests via `node --test`.

## Documentation to keep in sync

- `README.md`: product overview, architecture, deploy/i18n rules.
- `docs/AGENT_BRIEF.md`: project context and agent/release instructions.
- This `AGENTS.md`: concise operational instructions for coding agents.
