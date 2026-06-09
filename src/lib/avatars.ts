// Slime-avatars uit /public/avatars. Spelers kunnen zelf kiezen; zonder keuze
// krijgen ze automatisch een vaste slime op basis van hun naam.

export type AvatarOption = { key: string; label: string; src?: string };

export const avatarOptions: AvatarOption[] = [
  { key: "wk2026-international", label: "WK 2026" },
  { key: "netherlands", label: "Nederland" },
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
  { key: "memphis-slime", label: "Memphis", src: "/avatars/slime-pack-2026/04-memphis-slime.webp" },
  { key: "virgil-slime", label: "Virgil", src: "/avatars/slime-pack-2026/09-virgil-slime.webp" },
  { key: "scheidsrechter-slime", label: "Scheidsrechter", src: "/avatars/slime-pack-2026/05-scheidsrechter-slime.webp" },
  { key: "vader-kind-slime", label: "Vader en kind", src: "/avatars/slime-pack-2026/06-vader-kind-slime.webp" },
  { key: "oranje-keeper-slime", label: "Oranje keeper", src: "/avatars/slime-pack-2026/11-oranje-keeper-slime.webp" },
  { key: "oranje-voetbal-slime", label: "Oranje voetbal", src: "/avatars/slime-pack-2026/12-oranje-voetbal-slime.webp" },
  { key: "oranje-fruit-slime", label: "Oranje fruit", src: "/avatars/slime-pack-2026/14-oranje-fruit-slime.webp" },
  { key: "oranje-bier-slime", label: "Oranje bier", src: "/avatars/slime-pack-2026/15-oranje-bier-slime.webp" },
  { key: "nederland-slime", label: "Nederland slime", src: "/avatars/slime-pack-2026/24-nederland-slime.webp" },
  { key: "argentina-messi-slime", label: "Argentinië Messi", src: "/avatars/slime-pack-2026/01_argentina_messi_slime.webp" },
  { key: "argentina-trophy-slime", label: "Argentinië beker", src: "/avatars/slime-pack-2026/07_argentina_trophy_slime.webp" },
  { key: "england-kane-slime", label: "Engeland Kane", src: "/avatars/slime-pack-2026/02_england_kane_slime.webp" },
  { key: "england-slime", label: "Engeland slime", src: "/avatars/slime-pack-2026/10_england_slime.webp" },
  { key: "france-wk-slime", label: "Frankrijk WK", src: "/avatars/slime-pack-2026/04_france_slime.webp" },
  { key: "france-slime", label: "Frankrijk slime", src: "/avatars/slime-pack-2026/09_france_slime.webp" },
  { key: "germany-slime", label: "Duitsland slime", src: "/avatars/slime-pack-2026/03_germany_slime.webp" },
  { key: "duitsland-slime", label: "Duitsland supporter", src: "/avatars/slime-pack-2026/01-duitsland-slime.webp" },
  { key: "duitsland-duim-slime", label: "Duitsland duim", src: "/avatars/slime-pack-2026/10-duitsland-duim-voetbal-slime.webp" },
  { key: "duitsland-bier-slime", label: "Duitsland bier", src: "/avatars/slime-pack-2026/16-duitsland-bier-slime.webp" },
  { key: "dortmund-bier-slime", label: "Dortmund bier", src: "/avatars/slime-pack-2026/17-dortmund-bier-slime.webp" },
  { key: "spain-slime", label: "Spanje slime", src: "/avatars/slime-pack-2026/05_spain_slime.webp" },
  { key: "belgium-red-devil-slime", label: "Rode duivel", src: "/avatars/slime-pack-2026/06_belgium_red_devil_slime.webp" },
  { key: "belgian-keeper-slime", label: "Belgische keeper", src: "/avatars/slime-pack-2026/03_belgian_red_devil_keeper_slime.webp" },
  { key: "brazil-slime", label: "Brazilië slime", src: "/avatars/slime-pack-2026/04_brazil_slime.webp" },
  { key: "croatia-slime", label: "Kroatië slime", src: "/avatars/slime-pack-2026/05_croatia_slime.webp" },
  { key: "curacao-coach-slime", label: "Curaçao coach", src: "/avatars/slime-pack-2026/06_curacao_coach_slime.webp" },
  { key: "curacao-slime", label: "Curaçao slime", src: "/avatars/slime-pack-2026/27-curacao-slime.webp" },
  { key: "feyenoord-ueda-slime", label: "Feyenoord Ueda", src: "/avatars/slime-pack-2026/01_feyenoord_ueda_slime.webp" },
  { key: "senegal-slime", label: "Senegal slime", src: "/avatars/slime-pack-2026/02_senegal_slime.webp" },
  { key: "mexico-slime", label: "Mexico slime", src: "/avatars/slime-pack-2026/07_mexico_slime.webp" },
  { key: "usa-slime", label: "USA slime", src: "/avatars/slime-pack-2026/08_usa_slime.webp" },
  { key: "usa-pak-slime", label: "USA pak", src: "/avatars/slime-pack-2026/19-usa-pak-slime.webp" },
  { key: "zwitserland-slime", label: "Zwitserland slime", src: "/avatars/slime-pack-2026/20-zwitserland-slime.webp" },
  { key: "portugal-slime", label: "Portugal slime", src: "/avatars/slime-pack-2026/21-portugal-slime.webp" },
  { key: "japan-sumo-slime", label: "Japan sumo", src: "/avatars/slime-pack-2026/23-japan-sumo-slime.webp" },
  { key: "turkije-slime", label: "Turkije slime", src: "/avatars/slime-pack-2026/25-turkije-slime.webp" },
  { key: "noorwegen-slime", label: "Noorwegen slime", src: "/avatars/slime-pack-2026/26-noorwegen-slime.webp" },
  { key: "schotland-slime", label: "Schotland slime", src: "/avatars/slime-pack-2026/28-schotland-slime.webp" },
  { key: "marokko-slime", label: "Marokko slime", src: "/avatars/slime-pack-2026/29-marokko-slime.webp" },
  { key: "seychellen-slime", label: "Seychellen slime", src: "/avatars/slime-pack-2026/30-seychellen-slime.webp" },
  { key: "zweden-bouw-slime", label: "Zweedse bouwer", src: "/avatars/slime-pack-2026/02-zweeds-bouwen-slime.webp" },
  { key: "zweden-bouw-slime-2", label: "Zweedse bouwer 2", src: "/avatars/slime-pack-2026/22-zweeds-bouwen-slime-2.webp" },
  { key: "koe-man-slime", label: "Koe-man slime", src: "/avatars/slime-pack-2026/03-koe-man-slime.webp" },
  { key: "duivel-slime", label: "Duivel slime", src: "/avatars/slime-pack-2026/07-duivel-slime.webp" },
  { key: "trump-slime", label: "Trump slime", src: "/avatars/slime-pack-2026/08-trump-slime.webp" },
  { key: "trump-slime-2", label: "Trump slime 2", src: "/avatars/slime-pack-2026/13-trump-slime-2.webp" },
  { key: "regenboog-pride-slime", label: "Regenboog pride", src: "/avatars/slime-pack-2026/18-regenboog-pride-slime.webp" },
];

const avatarKeys = avatarOptions.map((option) => option.key);
const avatarSrcMap = new Map(avatarOptions.map((option) => [option.key, option.src ?? `/avatars/${option.key}.png`]));

export function avatarSrcForKey(key: string) {
  return avatarSrcMap.get(key) ?? `/avatars/${key}.png`;
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
