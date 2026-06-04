export const DEFAULT_AVATAR_KEY = "wk2026-international";

export const avatarOptions = [
  { key: "wk2026-international", label: "WK 2026", src: "/avatars/wk2026-international.png" },
  { key: "netherlands", label: "Nederland", src: "/avatars/netherlands.png" },
  { key: "curacao", label: "Curacao", src: "/avatars/curacao.png" },
  { key: "mexico", label: "Mexico", src: "/avatars/mexico.png" },
  { key: "brazil", label: "Brazilie", src: "/avatars/brazil.png" },
  { key: "argentina", label: "Argentinie", src: "/avatars/argentina.png" },
  { key: "france", label: "Frankrijk", src: "/avatars/france.png" },
  { key: "spain", label: "Spanje", src: "/avatars/spain.png" },
  { key: "england", label: "Engeland", src: "/avatars/england.png" },
  { key: "usa", label: "Verenigde Staten", src: "/avatars/usa.png" },
  { key: "japan-sumo", label: "Japan", src: "/avatars/japan-sumo.png" },
  { key: "morocco-fan", label: "Marokko", src: "/avatars/morocco-fan.png" },
  { key: "norway-viking", label: "Noorwegen", src: "/avatars/norway-viking.png" },
  { key: "scotland-fan", label: "Schotland", src: "/avatars/scotland-fan.png" },
  { key: "sweden-fan", label: "Zweden", src: "/avatars/sweden-fan.png" },
  { key: "switzerland-alpine", label: "Zwitserland", src: "/avatars/switzerland-alpine.png" },
  { key: "turkey-fan", label: "Turkije", src: "/avatars/turkey-fan.png" },
  { key: "oranje-president", label: "Oranje president", src: "/avatars/oranje-president.png" },
  { key: "oranje-supporter", label: "Oranje supporter", src: "/avatars/oranje-supporter.png" },
  { key: "oranje-aanvoerder", label: "Oranje aanvoerder", src: "/avatars/oranje-aanvoerder.png" },
  { key: "oranje-spelmaker", label: "Oranje spelmaker", src: "/avatars/oranje-spelmaker.png" },
  { key: "appel-slime", label: "Appel slime", src: "/avatars/appel-slime.png" },
  { key: "oranje-aanvaller", label: "Oranje aanvaller", src: "/avatars/oranje-aanvaller.png" },
  { key: "keeper", label: "Keeper", src: "/avatars/keeper.png" },
  { key: "oranje-coach", label: "Oranje coach", src: "/avatars/oranje-coach.png" },
  { key: "rode-duivel", label: "Rode duivel", src: "/avatars/rode-duivel.png" },
  { key: "duitsland", label: "Duitsland", src: "/avatars/duitsland.png" },
] as const;

export type AvatarKey = (typeof avatarOptions)[number]["key"];

const avatarMap = new Map(avatarOptions.map((avatar) => [avatar.key, avatar]));

export function isAvatarKey(value: string): value is AvatarKey {
  return avatarMap.has(value as AvatarKey);
}

export function normalizeAvatarKey(value: FormDataEntryValue | string | null | undefined): AvatarKey {
  const key = String(value ?? DEFAULT_AVATAR_KEY);
  return isAvatarKey(key) ? key : DEFAULT_AVATAR_KEY;
}

export function getAvatar(value: string | null | undefined) {
  return avatarMap.get(normalizeAvatarKey(value)) ?? avatarOptions[0];
}
