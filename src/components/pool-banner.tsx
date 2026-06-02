"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

/** Toont de poulebanner; verbergt zichzelf als er (nog) geen afbeelding is. */
export function PoolBanner({ src, alt }: { src: string; alt: string }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <img
      className="pool-banner"
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setVisible(false)}
    />
  );
}
