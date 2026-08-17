import type { Metadata } from "next";
import { WritingList } from "@/components/writing-list";
import { getAllPosts } from "@/lib/posts";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = {
  title: "writing",
  description:
    "Notes on shipping software: infrastructure, frontend performance, and the boring glue in between.",
  alternates: { canonical: "/writing" },
};

export default async function WritingPage() {
  const posts = await getAllPosts();

  const writingsPageDisplay =
    (posts.length === 0) ?
      (
        <ComingSoon
          label="writing"
          command="cat ./posts/*.md"
          message="drafts are still drafts — nothing published yet."
        />
      ) :
      (
        <div className="mx-auto max-w-266 px-8">
          <section className="pt-14 md:pt-20">
            <h1 className="m-0 text-[clamp(28px,7vw,36px)] font-semibold tracking-[-0.02em]">
              writing
            </h1>
            <p className="m-0 mt-2 max-w-160 text-[15.5px] leading-[1.6] text-pretty text-muted-foreground">
              Notes on shipping software: infrastructure, frontend performance, and the boring glue in
              between.
            </p>
            <WritingList posts={posts} />
          </section>
        </div>
      )

  return writingsPageDisplay;
}