import type { Metadata } from "next";
import { site } from "@/lib/site";

export type ShareImage = { url: string; width: number; height: number; alt: string };

/** The site-wide banners from the root layout, used when a page has no image of its own. */
const DEFAULT_OG_IMAGE: ShareImage = {
  url: "/brand/df-banner-linkedin.png",
  width: 1200,
  height: 627,
  alt: site.name,
};
const DEFAULT_TWITTER_IMAGE = "/brand/df-banner-x.png";

/**
 * Page-level metadata with canonical, Open Graph and Twitter tags that all
 * agree. Next.js replaces (not merges) a parent's `openGraph`/`twitter`
 * objects, so a page that sets only `title`/`description` would otherwise
 * share the home page's URL, title and description on social cards.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
}: {
  /** Short page title; the root layout's template adds " · dom foley". */
  title: string;
  description: string;
  /** Absolute URL or a site path such as "/work". */
  path: string;
  image?: ShareImage;
  type?: "website" | "article";
  publishedTime?: string;
}): Metadata {
  const url = path.startsWith("http") ? path : `${site.url}${path}`;
  const shareTitle = `${title} · ${site.name}`;
  const og = image ?? DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type,
      siteName: site.name,
      title: shareTitle,
      description,
      url,
      images: [og],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      site: "@FoleyDom_",
      creator: "@FoleyDom_",
      title: shareTitle,
      description,
      images: [image ? image.url : DEFAULT_TWITTER_IMAGE],
    },
  };
}
