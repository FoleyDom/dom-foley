import Link from "next/link";
import { HeroTile } from "@/components/hero-tile";
import { StackMarquee } from "@/components/stack-marquee";
import { ContributionGraph } from "@/components/contribution-graph";
import { ContactForm } from "@/components/contact-form";
import { ComingSoonInline } from "@/components/coming-soon";
import { ArrowLink } from "@/components/arrow-link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
// import { testimonials } from "@/lib/about";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <div className="mx-auto max-w-266 px-8">
      {/* ── hero ── */}
      <section className="grid grid-cols-1 items-center gap-8 py-14 md:grid-cols-[1fr_280px] md:gap-14 md:pt-24 md:pb-18">
        <div className="flex max-w-180 flex-col gap-5.5">
          <div className="flex items-center gap-2 self-start rounded-full border border-border bg-card px-3 py-1.5 text-[13px] text-muted-foreground">
            <span
              className="h-1.75 w-1.75 rounded-full bg-[#2fb367]"
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
            <span className="ml-1.5 font-mono text-[12.5px] text-faint">{site.email}</span>
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
                  download="Dominique Foley Resume.pdf"
                  className="rounded-[7px] border border-border bg-card px-2.75 py-1.25 font-mono text-[12px] text-muted-foreground no-underline transition-[color,border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-accent-line hover:text-accent-ink"
                >
                  résumé ↓
                </a>
              </TooltipTrigger>
              <TooltipContent>download PDF résumé</TooltipContent>
            </Tooltip>
          </div>
        </div>

        <HeroTile />
      </section>

      {/* ── core stack strip ── */}
      <StackMarquee />

      {/* ── featured work ── */}
      <section className="pt-18">
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

      {/* ── github graph ── */}
      <section className="pt-18">
        <ContributionGraph />
      </section>

      {/* ── recent writing ── */}
      <section className="pt-18">
        <div className="mb-5 flex items-baseline gap-4">
          <h2 className="m-0 text-[28px] font-semibold tracking-[-0.02em]">recent writing</h2>
          <ArrowLink href="/writing" className="ml-auto">
            all posts
          </ArrowLink>
        </div>
        <ComingSoonInline
          label="writing"
          command="cat ./posts/*.md"
          message="drafts are still drafts — nothing published yet."
          href="/writing"
          cta="see what's brewing"
        />
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
              <span>→ {site.email}</span>
              <span>→ {site.location}</span>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
