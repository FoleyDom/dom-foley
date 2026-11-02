import Image from "next/image";
import Link from "next/link";
import { StatusPill } from "@/components/status-pill";
import type { Project } from "@/lib/projects";

/** The featured-work card shared by the home page and the /work grid. */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/work/${project.slug}`}
      className="flex flex-col overflow-hidden rounded-[14px] border border-border bg-card no-underline transition-[transform,border-color] duration-150 hover:-translate-y-0.5 hover:border-accent-line"
    >
      {project.cover ? (
        <div className="relative h-45 overflow-hidden border-b border-border bg-accent-soft">
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover object-top"
          />
        </div>
      ) : (
        <div
          className="grid h-45 place-items-center border-b border-border"
          style={{
            background:
              "repeating-linear-gradient(-45deg,var(--accent-soft) 0 8px,transparent 8px 16px)",
          }}
        >
          <span className="rounded-md border border-border bg-card px-2.25 py-0.75 font-mono text-[11.5px] text-muted-foreground">
            {project.imgLabel}
          </span>
        </div>
      )}
      <div className="flex flex-col gap-2 px-5.5 pb-5.5 pt-5">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
          <span className="font-mono text-[16px] font-semibold">{project.name}</span>
          <span className="rounded-[5px] bg-accent-soft px-2 py-0.5 text-[11.5px] font-semibold text-accent-ink">
            {project.badge}
          </span>
          {project.status && <StatusPill status={project.status} />}
        </div>
        <p className="m-0 text-[14.5px] leading-[1.55] text-muted-foreground">{project.blurb}</p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {project.tags.map((t) => (
            <span
              key={t}
              className="rounded-[5px] border border-border px-1.75 py-0.5 font-mono text-[11px] text-faint"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
