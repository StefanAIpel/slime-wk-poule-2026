import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  // Alleen publieke pagina's; de privé-app (/voorspellingen, /poules, /account)
  // blijft bewust buiten de sitemap en wordt geweerd via robots.ts.
  const high = ["", "/schema", "/schema/groepen", "/schema/knockout", "/ranglijst", "/regels", "/games"];
  const low = ["/privacy", "/voorwaarden"];
  return [
    ...high.map((route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: now,
      changeFrequency: (route === "" ? "daily" : "weekly") as "daily" | "weekly",
      priority: route === "" ? 1 : 0.7,
    })),
    ...low.map((route) => ({
      url: `${SITE_URL}${route}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    })),
  ];
}
