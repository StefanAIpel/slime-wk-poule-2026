export function formatAmsterdam(value: string | Date | null | undefined) {
  if (!value) return "Nog niet bekend";

  return new Intl.DateTimeFormat("nl-NL", {
    timeZone: "Europe/Amsterdam",
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function displayName(profile?: { nickname: string | null; team_name: string | null } | null) {
  if (!profile) return "Anoniem";
  if (profile.team_name && profile.nickname) return `${profile.team_name} (${profile.nickname})`;
  return profile.team_name || profile.nickname || "Anoniem";
}

export function clampInt(value: FormDataEntryValue | null, fallback = 0, min = 0, max = 20) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
}
