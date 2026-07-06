import { site } from "@/lib/site";

// Posts are still in drafts (see /writing) — the feed ships with no items
// until there's real content to link to.
export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>dom foley — writing</title>
    <link>${site.url}/writing</link>
    <description>Essays on full-stack engineering, DevOps, and shipping software.</description>
    <language>en</language>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml" />
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
