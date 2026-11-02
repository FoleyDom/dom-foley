import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";
import { ProjectCard } from "@/components/project-card";
import { projects } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "work",
  description: "Side projects, open source, and other work by Dom Foley.",
  path: "/work",
});

export default function WorkPage() {
  if (projects.length === 0) {
    return (
      <ComingSoon
        label="work"
        command="ls ./projects"
        message="write-ups are mid-polish — nothing to list yet."
      />
    );
  }

  return (
    <div className="mx-auto max-w-266 px-8">
      <section className="pt-14 pb-22 md:pt-20">
        <h1 className="m-0 text-[clamp(28px,7vw,36px)] font-semibold tracking-[-0.02em]">work</h1>
        <p className="m-0 mt-2 max-w-160 text-[15.5px] leading-[1.6] text-pretty text-muted-foreground">
          Side projects, open source, and other things I&apos;ve built end to end.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
