import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Slime Score WK 2026",
    short_name: "Slime Score",
    description: "Gratis Nederlandse WK 2026-poule met groepsscores, subpoules en ranglijsten. Eén keer invullen.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f4f7fd",
    theme_color: "#ff7a00",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
