import Link from "next/link";
import dynamic from "next/dynamic";
import { HeroTile } from "@/components/hero-tile";
import { StackMarquee } from "@/components/stack-marquee";
import { ContributionGraph } from "@/components/contribution-graph";
import { ComingSoonInline } from "@/components/coming-soon";
import { ArrowLink } from "@/components/arrow-link";
import { EmailLink } from "@/components/email-link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
// import { testimonials } from "@/lib/about";
import { getLatestPosts } from "@/lib/posts";
import { site } from "@/lib/site";

// Below the fold and stateful — split into its own chunk so its JS isn't
// part of the critical bundle. Still SSR'd (ssr defaults to true), so the
// markup renders in the initial HTML and nothing shifts on hydration.
const ContactForm = dynamic(() =>
  import("@/components/contact-form").then((m) => m.ContactForm),
);

export default async function Home() {
  const latestPosts = await getLatestPosts(3);

  return (
    <div className="mx-auto max-w-266 px-8">
      {/* ── hero ── */}
      <section className="grid grid-cols-1 items-stretch gap-8 py-14 md:grid-cols-[1fr_min(38vw,440px)] md:gap-14 md:pt-14 md:pb-13">
        <div className="flex max-w-180 flex-col gap-5.5">
          <div className="flex items-center gap-2 self-start rounded-full border border-border bg-card px-3 py-1.5 text-[13px] text-muted-foreground">
            <span
              className="h-1.75 w-1.75 rounded-full bg-success"
              style={{ boxShadow: "0 0 0 3px rgba(47,179,103,.18)" }}
            />
            available for full-time roles
          </div>

          <h1 className="m-0 text-[clamp(32px,9vw,44px)] font-semibold leading-[1.06] tracking-[-0.03em] md:text-[56px]">
            full-stack engineer who{" "}
            <em className="font-serif font-normal italic text-accent-ink">ships</em>, and keeps it
            running.
          </h1>

          <p className="m-0 max-w-130 text-[18px] leading-[1.6] text-pretty text-muted-foreground">
            I&apos;m Dom — a full-stack engineer who ships code and understands what it runs on. I build web products end to end: React/Next.js frontends, typed PHP/Laravel and Node.js APIs, and
            the CI/CD-driven Docker + AWS infrastructure that deploys them — 5 years in, most of it on a high-traffic e-commerce platform, plus independent open-source work on the side.
          </p>

          <div className="mt-1.5 flex flex-wrap items-center gap-3">
            <Link
              href="/work"
              className="group relative overflow-hidden rounded-[9px] bg-primary px-5 py-2.75 text-[14.5px] font-semibold text-white no-underline shadow-[--shadow] transition-transform duration-200 ease-out hover:-translate-y-0.5"
            >
              <span className="relative z-10">view work</span>
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 ease-out group-hover:translate-x-full" />
            </Link>
            <Link
              href="/about"
              className="rounded-[9px] border border-border bg-card px-5 py-2.75 text-[14.5px] font-medium text-foreground no-underline transition-[transform,background-color,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-accent-line hover:bg-accent-soft"
            >
              about me
            </Link>
            <EmailLink className="ml-1.5 text-[12.5px]" />
          </div>

          <div className="flex flex-wrap gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={site.socials.github}
                  className="rounded-[7px] border border-border bg-card px-2.75 py-1.25 font-mono text-[12px] text-muted-foreground no-underline transition-[color,border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-accent-line hover:text-accent-ink"
                >
                  github
                </a>
              </TooltipTrigger>
              <TooltipContent>github.com/FoleyDom</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={site.socials.linkedin}
                  className="rounded-[7px] border border-border bg-card px-2.75 py-1.25 font-mono text-[12px] text-muted-foreground no-underline transition-[color,border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-accent-line hover:text-accent-ink"
                >
                  linkedin
                </a>
              </TooltipTrigger>
              <TooltipContent>linkedin.com/in/domfoley</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href={encodeURI(site.resumeUrl)}
                  download="Dom-Foley-Resume.pdf"
                  className="rounded-[7px] border border-border bg-card px-2.75 py-1.25 font-mono text-[12px] text-muted-foreground no-underline transition-[color,border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-accent-line hover:text-accent-ink"
                >
                  résumé ↓
                </a>
              </TooltipTrigger>
              <TooltipContent>download PDF résumé</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Mobile: marquee, then the graph, standing in the logo's slot.
            Desktop: logo floats free (no card), top offset fixed at pill
            height + gap above the heading (so it lines up with the
            headline) plus a small extra nudge down; the graph keeps its
            own full card styling and is pinned to the column's bottom
            edge, which is the same as the social-icons row's bottom edge
            since that row is the left column's last child. */}
        <div className="flex flex-col gap-8 md:relative md:block">
          <div className="md:hidden">
            <StackMarquee />
          </div>
          <ContributionGraph className="md:hidden" />

          <div className="hidden md:absolute md:inset-x-0 md:top-[75.5px] md:flex md:justify-center">
            <HeroTile />
          </div>
          <ContributionGraph className="hidden md:absolute md:inset-x-0 md:bottom-0 md:block" />
        </div>
      </section>

      {/* ── core stack strip ── */}
      <div className="hidden md:block">
        <StackMarquee />
      </div>

      {/* ── featured work ── */}
      <section className="pt-12">
        <div className="mb-7 flex items-baseline gap-4">
          <h2 className="m-0 text-[28px] font-semibold tracking-[-0.02em]">featured work</h2>
          <ArrowLink href="/work" className="ml-auto">
            all work
          </ArrowLink>
        </div>
        <ComingSoonInline
          label="work"
          command="ls ./projects"
          message="write-ups are mid-polish — nothing to list yet."
          href="/work"
          cta="peek at the queue"
        />
      </section>

      {/* ── recent writing ── */}
      <section className="pt-18">
        <div className="mb-5 flex items-baseline gap-4">
          <h2 className="m-0 text-[28px] font-semibold tracking-[-0.02em]">recent writing</h2>
          <ArrowLink href="/writing" className="ml-auto">
            all posts
          </ArrowLink>
        </div>
        {latestPosts.length > 0 ? (
          <div className="flex flex-col">
            {latestPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/writing/${post.slug}`}
                className="grid grid-cols-[1fr_auto] items-baseline gap-x-5 gap-y-1 border-t border-border px-1 py-4.5 no-underline transition-colors hover:bg-accent-soft sm:grid-cols-[110px_1fr_auto]"
              >
                <span className="order-2 font-mono text-[12.5px] text-faint sm:order-1">
                  {post.date}
                </span>
                <span className="order-1 text-[16.5px] font-medium tracking-[-0.01em] sm:order-2">
                  {post.title}
                </span>
                <span className="order-3 font-mono text-[12px] text-faint">{post.read}</span>
              </Link>
            ))}
          </div>
        ) : (
          <ComingSoonInline
            label="writing"
            command="cat ./posts/*.md"
            message="drafts are still drafts — nothing published yet."
            href="/writing"
            cta="see what's brewing"
          />
        )}
      </section>

      {/* ── testimonials ── */}
      {/* <section className="pt-18">
        <h2 className="m-0 mb-6 text-[28px] font-semibold tracking-[-0.02em]">kind words</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {testimonials.map((q) => (
            <figure
              key={q.name}
              className="m-0 flex flex-col gap-4 rounded-[14px] border border-border bg-card px-6.5 py-6"
            >
              <blockquote className="m-0 font-serif text-[19px] italic leading-normal text-pretty">
                “{q.quote}”
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-accent-soft text-[13px] font-semibold text-accent-ink">
                  {q.initials}
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-semibold">{q.name}</span>
                  <span className="text-[12.5px] text-muted-foreground">{q.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section> */}

      {/* ── contact ── */}
      <section id="contact" className="scroll-mt-20 pt-18 pb-22">
        <div className="grid grid-cols-1 gap-10 rounded-2xl border border-border bg-card p-10 shadow-[--shadow] md:grid-cols-2">
          <div className="flex flex-col gap-3.5">
            <h2 className="m-0 text-[32px] font-semibold tracking-[-0.02em]">let&apos;s talk.</h2>
            <p className="m-0 text-[15.5px] leading-[1.6] text-pretty text-muted-foreground">
              Hiring for a product or platform team? I&apos;m happy to walk through my work, do a
              pairing session, or just chat architecture. Usually reply within a day.
            </p>
            <div className="mt-auto flex flex-col gap-1.5 font-mono text-[13px] text-muted-foreground">
              <span className="flex items-center gap-1">
                → <EmailLink className="text-[13px] text-muted-foreground" />
              </span>
              <span>→ {site.location}</span>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
