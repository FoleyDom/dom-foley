import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostBody } from "@/components/post-body";
import { getAllPosts, getPost } from "@/lib/posts";
import { site } from "@/lib/site";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: post.canonicalUrl ?? `${site.url}/writings/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      publishedTime: post.dateISO,
      url: post.canonicalUrl ?? `${site.url}/writings/${post.slug}`,
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-160 px-8">
      <article className="pt-14 pb-22 md:pt-20">
        <Link
          href="/writings"
          className="inline-flex w-fit items-center gap-1 text-sm font-medium text-accent-ink no-underline hover:underline"
        >
          ← all posts
        </Link>

        <div className="mt-7 flex items-baseline gap-3 font-mono text-[12.5px] text-faint">
          <time dateTime={post.dateISO}>{post.date}</time>
          <span className="text-accent-ink">{post.tag}</span>
          <span className="ml-auto">{post.read}</span>
        </div>

        <h1 className="m-0 mt-3 text-[clamp(28px,6vw,38px)] font-semibold leading-[1.15] tracking-[-0.02em]">
          {post.title}
        </h1>
        <p className="m-0 mt-4 font-serif text-[19px] italic leading-normal text-pretty text-muted-foreground">
          {post.lede}
        </p>

        <div className="mt-9 flex flex-col gap-5">
          <PostBody content={post.content} />
        </div>

        {post.canonicalUrl ? (
          <p className="mt-10 font-mono text-[12.5px] text-faint">
            originally published at{" "}
            <Link href={post.canonicalUrl} className="text-accent-ink no-underline hover:underline">
              {post.canonicalUrl.replace(/^https?:\/\//, "")}
            </Link>
          </p>
        ) : null}
      </article>
    </div>
  );
}
