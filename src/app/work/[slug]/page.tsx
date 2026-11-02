import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { CodeBlock } from "@/components/code-block";
import { DemoVideo } from "@/components/demo-video";
import { ScreenshotGallery } from "@/components/screenshot-gallery";
import { StatusPill } from "@/components/status-pill";
import { getPost } from "@/lib/posts";
import { getProject, projects } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return pageMetadata({
    title: project.name,
    // The blurb is short enough for a search snippet; the summary gets truncated.
    description: project.blurb,
    path: `/work/${project.slug}`,
    type: "article",
    image: project.cover && {
      url: project.cover.src,
      width: project.cover.width,
      height: project.cover.height,
      alt: project.cover.alt,
    },
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  // Old mixed-case links (e.g. /work/EasyScores) land on the canonical URL.
  if (slug !== project.slug) permanentRedirect(`/work/${project.slug}`);

  // A write-up post only gets linked once it's actually published in synapse,
  // so a draft never produces a dead "read the write-up" button.
  const writeupSlug = project.links.writeup?.match(/^\/writings\/([^/?#]+)/)?.[1];
  const writeup = writeupSlug
    ? (await getPost(writeupSlug)) && project.links.writeup
    : project.links.writeup;
  const links = { ...project.links, writeup: writeup || undefined };

  const demo = project.media?.demo;
  const videoJsonLd = demo && {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${project.name} demo`,
    description: demo.title,
    thumbnailUrl: `${site.url}${demo.poster}`,
    contentUrl: `${site.url}${demo.src}`,
    uploadDate: demo.uploaded,
  };

  return (
    <div className="mx-auto max-w-160 px-8">
      <article className="pt-14 pb-22 md:pt-20">
        <Link
          href="/work"
          className="inline-flex w-fit items-center gap-1 text-sm font-medium text-accent-ink no-underline hover:underline"
        >
          ← all work
        </Link>

        <div className="mt-7 flex flex-wrap items-baseline gap-x-3 gap-y-2 font-mono text-[12.5px] text-faint">
          <span className="rounded-[5px] bg-accent-soft px-2 py-0.5 font-mono text-[11.5px] font-semibold text-accent-ink">
            {project.badge}
          </span>
          {project.status && <StatusPill status={project.status} />}
          <span className="ml-auto">{project.meta}</span>
        </div>

        <h1 className="m-0 mt-3 text-[clamp(28px,6vw,38px)] font-semibold leading-[1.15] tracking-[-0.02em]">
          {project.name}
        </h1>
        <p className="m-0 mt-4 font-serif text-[19px] italic leading-normal text-pretty text-muted-foreground">
          {project.summary}
        </p>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-[5px] border border-border px-1.75 py-0.5 font-mono text-[11px] text-faint"
            >
              {t}
            </span>
          ))}
        </div>

        {(links.github || links.demo || links.writeup) && (
          <div className="mt-5 flex flex-wrap gap-3">
            {links.demo && (
              <a
                href={links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-[9px] bg-primary px-4 py-2 text-[13.5px] font-semibold text-white no-underline transition-transform duration-200 ease-out hover:-translate-y-0.5"
              >
                view live
              </a>
            )}
            {links.github && (
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-[9px] border border-border bg-card px-4 py-2 text-[13.5px] font-medium text-foreground no-underline transition-[transform,background-color,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-accent-line hover:bg-accent-soft"
              >
                github
              </a>
            )}
            {links.writeup && (
              <Link
                href={links.writeup}
                className="rounded-[9px] border border-border bg-card px-4 py-2 text-[13.5px] font-medium text-foreground no-underline transition-[transform,background-color,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-accent-line hover:bg-accent-soft"
              >
                read the write-up
              </Link>
            )}
          </div>
        )}

        {project.stats.length > 0 && (
          <div className="mt-9 grid gap-4 sm:grid-cols-2">
            {project.stats.map((s) => (
              <div
                key={s.label}
                className="rounded-[14px] border border-border bg-card px-5 py-4.5"
              >
                <div className="font-mono text-[20px] font-semibold text-accent-ink">
                  {s.value}
                </div>
                <div className="mt-1 text-[13.5px] leading-[1.5] text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-9 flex flex-col gap-8">
          {project.sections.map((section) => (
            <section key={section.heading} className="flex flex-col gap-2.5">
              <h2 className="m-0 text-[15px] font-semibold uppercase tracking-[0.03em] text-accent-ink">
                {section.heading}
              </h2>
              <p className="m-0 text-[15.5px] leading-[1.7] text-pretty text-muted-foreground">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        {project.media && (
          <section className="mt-10 flex flex-col gap-4">
            <h2 className="m-0 text-[15px] font-semibold uppercase tracking-[0.03em] text-accent-ink">
              in action
            </h2>
            {demo && (
              <>
                <DemoVideo video={demo} />
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd).replace(/</g, "\\u003c") }}
                />
              </>
            )}
            {project.media.screenshots.length > 0 && (
              <>
                <ScreenshotGallery images={project.media.screenshots} />
                <p className="m-0 font-mono text-[12px] text-faint">select a screenshot to enlarge it · scroll sideways for more</p>
              </>
            )}
          </section>
        )}

        {project.code && (
          <div className="mt-9">
            <CodeBlock lang={project.code.lang} code={project.code.code} />
          </div>
        )}
      </article>
    </div>
  );
}
