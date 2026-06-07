import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

const publicRoutes = ["", "/en", "/schema", "/schema/groepen", "/schema/knockout", "/ranglijst", "/regels", "/games", "/privacy", "/voorwaarden"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return publicRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: route === "" || route === "/en" ? "daily" : "weekly",
    priority: route === "" || route === "/en" ? 1 : route === "/schema" || route === "/ranglijst" ? 0.8 : 0.6,
    alternates:
      route === "" || route === "/en"
        ? {
            languages: {
              nl: SITE_URL,
              en: `${SITE_URL}/en`,
              "x-default": `${SITE_URL}/en`,
            },
          }
        : undefined,
  }));
}
