// Slime-avatars uit /public/avatars. Spelers kunnen zelf kiezen; zonder keuze
// krijgen ze automatisch een vaste slime op basis van hun naam.

export type AvatarOption = { key: string; label: string };

export const avatarOptions: AvatarOption[] = [
  { key: "wk2026-international", label: "WK 2026" },
  { key: "wk-slime", label: "WK slime" },
  { key: "netherlands", label: "Nederland" },
  { key: "memphis-slime", label: "Memphis" },
  { key: "virgil-slime", label: "Virgil" },
  { key: "ronaldo-slime", label: "Ronaldo" },
  { key: "oranje-aanvoerder", label: "Aanvoerder" },
  { key: "oranje-spelmaker", label: "Spelmaker" },
  { key: "oranje-aanvaller", label: "Aanvaller" },
  { key: "oranje-coach", label: "Coach" },
  { key: "oranje-supporter", label: "Supporter" },
  { key: "oranje-president", label: "President" },
  { key: "keeper", label: "Keeper" },
  { key: "appel-slime", label: "Appel" },
  { key: "brazil", label: "Brazilië" },
  { key: "messi-slime", label: "Messi" },
  { key: "argentina", label: "Argentinië" },
  { key: "france", label: "Frankrijk" },
  { key: "spain", label: "Spanje" },
  { key: "england", label: "Engeland" },
  { key: "usa", label: "VS" },
  { key: "mexico", label: "Mexico" },
  { key: "japan-sumo", label: "Japan" },
  { key: "morocco-fan", label: "Marokko" },
  { key: "norway-viking", label: "Noorwegen" },
  { key: "scotland-fan", label: "Schotland" },
  { key: "sweden-fan", label: "Zweden" },
  { key: "switzerland-alpine", label: "Zwitserland" },
  { key: "turkey-fan", label: "Turkije" },
  { key: "curacao", label: "Curaçao" },
  { key: "duitsland", label: "Duitsland" },
  { key: "rode-duivel", label: "België" },
];

const avatarKeys = avatarOptions.map((option) => option.key);
const webpAvatarKeys = new Set([
  "argentina",
  "brazil",
  "curacao",
  "duitsland",
  "england",
  "france",
  "japan-sumo",
  "keeper",
  "memphis-slime",
  "messi-slime",
  "mexico",
  "morocco-fan",
  "netherlands",
  "norway-viking",
  "oranje-aanvaller",
  "oranje-aanvoerder",
  "oranje-coach",
  "oranje-president",
  "oranje-spelmaker",
  "oranje-supporter",
  "rode-duivel",
  "scotland-fan",
  "spain",
  "sweden-fan",
  "switzerland-alpine",
  "trump-slime",
  "turkey-fan",
  "usa",
  "virgil-slime",
  "wk-slime",
  "appel-slime",
]);

export function avatarSrcForKey(key: string) {
  return `/avatars/${key}.${webpAvatarKeys.has(key) ? "webp" : "png"}`;
}

export function isAvatarKey(key: string | null | undefined): key is string {
  return Boolean(key) && avatarKeys.includes(key as string);
}

/** Vaste slime op basis van de naam (fallback zonder eigen keuze). */
export function avatarKeyForName(name: string) {
  const label = name?.trim() || "Speler";
  let hash = 0;
  for (let i = 0; i < label.length; i += 1) hash = (hash * 31 + label.charCodeAt(i)) >>> 0;
  return avatarKeys[hash % avatarKeys.length];
}

/** Kies de expliciet gekozen avatar, of val terug op de vaste naam-avatar. */
export function resolveAvatarSrc(name: string, avatarKey?: string | null) {
  return avatarSrcForKey(isAvatarKey(avatarKey) ? avatarKey : avatarKeyForName(name));
}
