import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const routes = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/home", priority: 0.95, changeFrequency: "weekly" },
  { path: "/home/pesan-aki", priority: 0.90, changeFrequency: "weekly" },
  { path: "/home/layanan", priority: 0.85, changeFrequency: "monthly" },
  { path: "/home/lokasi", priority: 0.85, changeFrequency: "monthly" },
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
