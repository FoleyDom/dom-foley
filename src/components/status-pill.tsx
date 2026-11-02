import type { Project } from "@/lib/projects";

/** Small pulsing label for unfinished work, e.g. "in progress". */
export function StatusPill({ status }: { status: NonNullable<Project["status"]> }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-[5px] border border-border px-2 py-0.5 font-mono text-[11px] font-medium text-muted-foreground">
      <span aria-hidden className="relative flex size-1.5">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-amber-500 opacity-60 motion-reduce:animate-none" />
        <span className="relative inline-flex size-1.5 rounded-full bg-amber-500" />
      </span>
      {status}
    </span>
  );
}
