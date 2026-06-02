"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

/** Transparante mascotte rechtsonder in de hero; verbergt zich tot het bestand bestaat. */
export function HeroArt({ src = "/slimes/mascot-hero.png", alt = "" }: { src?: string; alt?: string }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return <img className="hero-mascot" src={src} alt={alt} aria-hidden="true" onError={() => setVisible(false)} />;
}
