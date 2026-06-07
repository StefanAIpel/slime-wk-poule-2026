import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SlimeScore",
    short_name: "SlimeScore",
    description: "Gratis WK 2026-poule en free World Cup 2026 prediction pool met groepsscores, vriendenpoules en ranglijsten.",
    start_url: "/",
    id: "/",
    scope: "/",
    display: "standalone",
    background_color: "#f4f7fd",
    theme_color: "#ff7a00",
    icons: [
      {
        src: "/icons/slimescore-app-icon-v4-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/slimescore-app-icon-v4-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/slimescore-app-icon-v4-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/slimescore-app-icon-v4-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/slimescore-apple-touch-icon-v4-180.png",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
