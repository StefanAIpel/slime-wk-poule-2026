import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Slime Score WK 2026",
    short_name: "Slime Score",
    description: "Nederlandstalige WK 2026 poule met groepsscores, subpoules en ranglijsten.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#06132f",
    theme_color: "#ff7a00",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
