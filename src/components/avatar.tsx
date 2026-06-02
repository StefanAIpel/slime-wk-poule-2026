/* eslint-disable @next/next/no-img-element */

// Slime-avatars uit /public/avatars. Elke speler krijgt vast dezelfde slime
// op basis van zijn naam, zodat de ranglijst herkenbaar en speels blijft.
const slimeAvatars = [
  "/avatars/wk2026-international.png",
  "/avatars/netherlands.png",
  "/avatars/oranje-aanvoerder.png",
  "/avatars/oranje-spelmaker.png",
  "/avatars/oranje-aanvaller.png",
  "/avatars/oranje-coach.png",
  "/avatars/oranje-supporter.png",
  "/avatars/oranje-president.png",
  "/avatars/keeper.png",
  "/avatars/appel-slime.png",
  "/avatars/brazil.png",
  "/avatars/argentina.png",
  "/avatars/france.png",
  "/avatars/spain.png",
  "/avatars/england.png",
  "/avatars/usa.png",
  "/avatars/mexico.png",
  "/avatars/japan-sumo.png",
  "/avatars/morocco-fan.png",
  "/avatars/norway-viking.png",
  "/avatars/scotland-fan.png",
  "/avatars/sweden-fan.png",
  "/avatars/switzerland-alpine.png",
  "/avatars/turkey-fan.png",
  "/avatars/curacao.png",
  "/avatars/duitsland.png",
  "/avatars/rode-duivel.png",
];

function avatarFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return slimeAvatars[hash % slimeAvatars.length];
}

/** Ronde slime-avatar, vast gekozen op basis van de naam. */
export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const label = name?.trim() || "Speler";
  return (
    <img
      className="avatar-img"
      src={avatarFor(label)}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      loading="lazy"
      style={{ width: size, height: size }}
    />
  );
}
