const palette = ["#0866e8", "#128f47", "#e1262f", "#ff7a00", "#7b2ff7", "#0a3ea0", "#d4860b"];

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function colorFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return palette[hash % palette.length];
}

/** Ronde initialen-avatar met een vaste kleur per naam. */
export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const label = name?.trim() || "Anoniem";
  return (
    <span
      className="avatar"
      aria-hidden="true"
      style={{ width: size, height: size, background: colorFor(label), fontSize: Math.round(size * 0.4) }}
    >
      {initials(label)}
    </span>
  );
}
