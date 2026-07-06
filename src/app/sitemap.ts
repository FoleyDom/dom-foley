import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// work/[slug] and writing/[slug] redirect to their index while those sections
// are still "coming soon" — leave per-slug URLs out of the sitemap until then.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: site.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/work`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/writing`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];
}
