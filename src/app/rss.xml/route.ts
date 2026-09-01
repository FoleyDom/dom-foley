import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getAllPosts();

  const items = posts
    .map((post) => {
      const link = post.canonicalUrl ?? `${site.url}/writings/${post.slug}`;
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(post.summary)}</description>
      <pubDate>${new Date(post.dateISO).toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `
    <?xml version="1.0" encoding="UTF-8"?>
      <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
        <channel>
          <title>dom foley — writing</title>
          <link>${site.url}/writings</link>
          <description>Essays on full-stack engineering, DevOps, and shipping software.</description>
          <language>en</language>
          <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml" />
      ${items}
        </channel>
      </rss>
  `;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
