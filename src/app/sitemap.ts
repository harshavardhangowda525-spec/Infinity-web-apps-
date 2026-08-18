import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/services",
    "/projects",
    "/about",
    "/pricing",
    "/contact",
    "/privacy",
    "/terms",
    "/login",
  ];
  const now = new Date();
  return routes.map((r) => ({
    url: `${SITE_URL}${r}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: r === "" ? 1 : 0.7,
  }));
}
