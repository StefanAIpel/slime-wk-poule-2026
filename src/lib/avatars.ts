// Slime-avatars uit /public/avatars. Spelers kunnen zelf kiezen; zonder keuze
// krijgen ze automatisch een vaste slime op basis van hun naam.

export type AvatarOption = { key: string; label: string };

export const avatarOptions: AvatarOption[] = [
  { key: "wk2026-international", label: "WK 2026" },
  { key: "netherlands", label: "Nederland" },
  { key: "ueda-slime", label: "Ueda" },
  { key: "oranje-aanvoerder", label: "Aanvoerder" },
  { key: "oranje-spelmaker", label: "Spelmaker" },
  { key: "oranje-aanvaller", label: "Aanvaller" },
  { key: "oranje-coach", label: "Coach" },
  { key: "oranje-supporter", label: "Supporter" },
  { key: "oranje-president", label: "President" },
  { key: "keeper", label: "Keeper" },
  { key: "appel-slime", label: "Appel" },
  { key: "brazil", label: "Brazilië" },
  { key: "argentina", label: "Argentinië" },
  { key: "portugal-slime", label: "Portugal" },
  { key: "seychellen-slime", label: "Seychellen" },
  { key: "koe-slime", label: "Koe" },
  { key: "scheidsrechter-slime", label: "Scheidsrechter" },
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
  { key: "fc-den-bosch-slime", label: "FC Den Bosch" },
  { key: "ajax-slime", label: "Ajax" },
];

// Legacy keys blijven geldig voor bestaande profielen, maar staan niet meer in de picker
// zodat visuele dubbelen en kapotte/oude picks uit de keuzelijst verdwijnen.
const legacyAvatarKeys = ["messi-slime", "wk-slime", "memphis-slime", "virgil-slime", "ronaldo-slime"];
const avatarKeys = Array.from(new Set([...avatarOptions.map((option) => option.key), ...legacyAvatarKeys]));
const webpAvatarKeys = new Set([
  "ajax-slime",
  "argentina",
  "brazil",
  "curacao",
  "duitsland",
  "england",
  "fc-den-bosch-slime",
  "france",
  "japan-sumo",
  "keeper",
  "koe-slime",
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
  "portugal-slime",
  "rode-duivel",
  "ronaldo-slime",
  "scheidsrechter-slime",
  "scotland-fan",
  "seychellen-slime",
  "spain",
  "sweden-fan",
  "switzerland-alpine",
  "trump-slime",
  "turkey-fan",
  "ueda-slime",
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
  return avatarOptions[hash % avatarOptions.length].key;
}

/** Kies de expliciet gekozen avatar, of val terug op de vaste naam-avatar. */
export function resolveAvatarSrc(name: string, avatarKey?: string | null) {
  return avatarSrcForKey(isAvatarKey(avatarKey) ? avatarKey : avatarKeyForName(name));
}
