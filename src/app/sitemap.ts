import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const routes = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/pesan-aki", priority: 0.94, changeFrequency: "weekly" },
  { path: "/layanan", priority: 0.86, changeFrequency: "monthly" },
  { path: "/lokasi", priority: 0.84, changeFrequency: "monthly" },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
