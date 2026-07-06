"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { postTags, type PostTag } from "@/lib/posts";

export type PostSummary = {
  slug: string;
  title: string;
  date: string;
  dateISO: string;
  tag: PostTag;
  read: string;
  summary: string;
};

export function WritingList({ posts }: { posts: PostSummary[] }) {
  const [active, setActive] = useState<"all" | PostTag>("all");
  const visible = active === "all" ? posts : posts.filter((p) => p.tag === active);

  return (
    <>
      <div className="mt-1.5 flex flex-wrap gap-2">
        {postTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActive(tag)}
            className={cn(
              "rounded-full px-3.5 py-1.25 text-[13px] transition-colors",
              active === tag
                ? "bg-primary font-semibold text-white"
                : "border border-border bg-card font-medium text-muted-foreground hover:border-accent-line hover:text-foreground",
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      <section className="flex flex-col pt-9 pb-22">
        {visible.map((post) => (
          <Link
            key={post.slug}
            href={`/writing/${post.slug}`}
            className="flex flex-col gap-2 border-t border-border px-1 py-6.5 no-underline transition-colors hover:bg-accent-soft"
          >
            <div className="flex items-baseline gap-3 font-mono text-[12.5px] text-faint">
              <time dateTime={post.dateISO}>{post.date}</time>
              <span className="text-accent-ink">{post.tag}</span>
              <span className="ml-auto">{post.read}</span>
            </div>
            <span className="text-[21px] font-semibold tracking-[-0.015em]">{post.title}</span>
            <p className="m-0 max-w-160 text-[15px] leading-[1.6] text-pretty text-muted-foreground">
              {post.summary}
            </p>
          </Link>
        ))}
      </section>
    </>
  );
}
