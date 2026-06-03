"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";

/**
 * Toont een slime-afbeelding met fallback: als de eerste bron (nog) niet bestaat
 * — bijv. een nieuwe scheidsrechter-slime — valt hij terug op de volgende.
 */
export function SlimeImage({
  candidates,
  className,
  alt = "",
}: {
  candidates: string[];
  className?: string;
  alt?: string;
}) {
  const [index, setIndex] = useState(0);
  if (index >= candidates.length) return null;
  return (
    <img
      className={className}
      src={candidates[index]}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      onError={() => setIndex((current) => current + 1)}
    />
  );
}
