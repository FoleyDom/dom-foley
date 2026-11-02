import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { projects } from "@/lib/projects";
import { site } from "@/lib/site";

/** The newest of a set of ISO dates, or undefined when there are none. */
function latest(dates: string[]): Date | undefined {
  const times = dates.map((d) => new Date(d).getTime()).filter((t) => !Number.isNaN(t));
  return times.length > 0 ? new Date(Math.max(...times)) : undefined;
}

// lastModified uses real content dates (or is left out) rather than the build
// time: a date that changes on every deploy tells crawlers nothing.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const workUpdated = latest(projects.map((p) => p.updated));
  const writingUpdated = latest(posts.map((p) => p.dateISO));
  const homeUpdated = latest([...projects.map((p) => p.updated), ...posts.map((p) => p.dateISO)]);

  return [
    { url: site.url, lastModified: homeUpdated, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/work`, lastModified: workUpdated, changeFrequency: "monthly", priority: 0.8 },
    { url: `${site.url}/writings`, lastModified: writingUpdated, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/about`, changeFrequency: "monthly", priority: 0.7 },
    ...projects.map((project) => ({
      url: `${site.url}/work/${project.slug}`,
      lastModified: new Date(project.updated),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...posts.map((post) => ({
      url: `${site.url}/writings/${post.slug}`,
      lastModified: new Date(post.dateISO),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
