import Link from "next/link";
import { ArrowLink } from "@/components/arrow-link";

/** The terminal-window card shared by the full-page and inline placeholders. */
function ComingSoonCard({
  label,
  command,
  message,
}: {
  label: string;
  command: string;
  message: string;
}) {
  return (
    <div
      className="w-full max-w-125 overflow-hidden rounded-2xl border border-border bg-card text-left shadow-[--shadow]"
      style={{ animation: "rise .5s ease both" }}
    >
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
        <span className="ml-3 font-mono text-[11.5px] text-faint">~/df — {label}</span>
      </div>
      <div className="flex flex-col gap-2 px-5 py-6 font-mono text-[13.5px] leading-[1.7]">
        <p className="m-0 text-muted-foreground">
          <span className="text-accent-ink">~/df</span> {command}
        </p>
        <p className="m-0 text-muted-foreground">{message}</p>
        <p className="m-0">
          <span className="text-accent-ink">status</span> → building
          <span className="animate-[blink_1.1s_steps(1)_infinite]">_</span>
        </p>
      </div>
    </div>
  );
}

/**
 * Full-page placeholder shown on routes whose content isn't ready yet (work, writing).
 * Mirrors the terminal-prompt aesthetic used elsewhere (BrandMark, HeroTile).
 */
export function ComingSoon({
  label,
  command,
  message,
}: {
  label: string;
  command: string;
  message: string;
}) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-180 flex-col items-center justify-center px-8 py-22 text-center">
      <ComingSoonCard label={label} command={command} message={message} />

      <div className="mt-9 flex flex-col items-center gap-2.5">
        <h1 className="m-0 text-[36px] font-semibold tracking-[-0.02em]">
          {label}{" "}
          <em className="font-serif font-normal italic text-accent-ink">coming soon</em>
        </h1>
        <p className="m-0 max-w-110 text-[15.5px] leading-[1.6] text-pretty text-muted-foreground">
          This section isn&apos;t built yet. Say hello in the meantime — I reply fast.
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="group relative overflow-hidden rounded-[9px] bg-primary px-5 py-2.75 text-[14.5px] font-semibold text-white no-underline transition-transform duration-200 ease-out hover:-translate-y-0.5"
          >
            <span className="relative z-10">back home</span>
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 ease-out group-hover:translate-x-full" />
          </Link>
          <Link
            href="/about"
            className="rounded-[9px] border border-border bg-card px-5 py-2.75 text-[14.5px] font-medium text-foreground no-underline transition-[transform,background-color,border-color] duration-200 ease-out hover:-translate-y-0.5 hover:border-accent-line hover:bg-accent-soft"
          >
            about me
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Compact inline placeholder for embedding within a section of another page
 * (e.g. where "featured work" / "recent writing" sit on the home page).
 * Shares the terminal-card look of the full-page ComingSoon.
 */
export function ComingSoonInline({
  label,
  command,
  message,
  href,
  cta,
}: {
  label: string;
  command: string;
  message: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-accent-line px-6 py-9">
      <ComingSoonCard label={label} command={command} message={message} />
      <ArrowLink href={href} className="text-[13.5px]">
        {cta}
      </ArrowLink>
    </div>
  );
}
