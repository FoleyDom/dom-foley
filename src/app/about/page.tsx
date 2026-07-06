import type { Metadata } from "next";
import { bio, jobs, skillGroups } from "@/lib/about";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "about",
  description:
    "Dom Foley — a full-stack engineer with a platform habit. Experience, skills, and résumé.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-210 px-8">
      <section className="grid items-start gap-11 pt-18 md:grid-cols-[1fr_220px]">
        <div className="flex flex-col gap-4">
          <h1 className="m-0 text-[44px] font-semibold tracking-[-0.03em]">about</h1>
          {bio.map((para, i) => (
            <p
              key={i}
              className="m-0 text-[16.5px] leading-[1.7] text-pretty text-muted-foreground"
            >
              {para}
            </p>
          ))}
          <a
            href={encodeURI(site.resumeUrl)}
            download="Dominique Foley Resume.pdf"
            className="group relative mt-1 self-start overflow-hidden rounded-[9px] bg-primary px-5 py-2.5 text-sm font-semibold text-white no-underline transition-transform duration-200 ease-out hover:-translate-y-0.5"
          >
            <span className="relative z-10">download résumé (pdf)</span>
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 ease-out group-hover:translate-x-full" />
          </a>
        </div>
        {/* <div
          className="hidden aspect-square place-items-center rounded-2xl border border-border md:grid"
          style={{
            background:
              "repeating-linear-gradient(45deg,var(--accent-soft) 0 10px,transparent 10px 20px),var(--card)",
          }}
        >
          <span className="rounded-md border border-border bg-card px-2.25 py-0.75 font-mono text-[11.5px] text-muted-foreground">
            photo
          </span>
        </div> */}
      </section>

      <section className="pt-14">
        <h2 className="m-0 mb-6 text-[26px] font-semibold tracking-[-0.02em]">experience</h2>
        <div className="flex flex-col">
          {jobs.map((j) => (
            <div
              key={`${j.co}-${j.years}`}
              className="grid gap-2 border-t border-border py-5 sm:grid-cols-[150px_1fr] sm:gap-6"
            >
              <span className="font-mono text-[12.5px] text-faint sm:pt-0.75">{j.years}</span>
              <div className="flex flex-col gap-1.5">
                <div className="flex flex-wrap items-baseline gap-2.5">
                  <span className="text-[16.5px] font-semibold">{j.role}</span>
                  <span className="text-sm font-medium text-accent-ink">{j.co}</span>
                </div>
                <p className="m-0 text-[14.5px] leading-[1.6] text-pretty text-muted-foreground">
                  {j.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="pt-12 pb-22">
        <h2 className="m-0 mb-6 text-[26px] font-semibold tracking-[-0.02em]">skills</h2>
        <div className="flex flex-col">
          {skillGroups.map((g) => (
            <div
              key={g.label}
              className="grid gap-2 border-t border-border py-4 sm:grid-cols-[150px_1fr] sm:gap-6"
            >
              <span className="font-mono text-[12.5px] uppercase tracking-[0.06em] text-faint sm:pt-1">
                {g.label}
              </span>
              <div className="flex flex-wrap gap-2">
                {g.items.map((it) => (
                  <span
                    key={it}
                    className="cursor-default rounded-[7px] border border-border bg-card px-2.25 py-1 font-mono text-[12.5px] text-muted-foreground [transition:transform_300ms_cubic-bezier(0.34,1.56,0.64,1),color_200ms_ease-out,border-color_200ms_ease-out,background-color_200ms_ease-out] hover:scale-110 hover:border-accent-line hover:bg-accent-soft hover:text-accent-ink"
                  >
                    {it}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
