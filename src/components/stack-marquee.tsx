import { coreStack } from "@/lib/site";

/** Infinite marquee of the core stack. The list is duplicated so the loop seams. */
export function StackMarquee() {
  const items = [...coreStack, ...coreStack];
  return (
    <section className="flex items-center gap-5 overflow-hidden border-y border-border py-4.5">
      <span className="flex-none font-mono text-[11.5px] uppercase tracking-[0.08em] text-faint">
        Core stack
      </span>
      <div
        className="group flex-1 overflow-hidden"
        style={{ maskImage: "linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)" }}
      >
        <div className="flex w-fit animate-[marquee_28s_linear_infinite] group-hover:paused">
          {items.map((s, i) => (
            <span
              key={i}
              className="mr-3 flex-none whitespace-nowrap rounded-full border border-border bg-card px-3 py-1.25 font-mono text-[12.5px] text-muted-foreground transition-[transform,color,border-color,background-color] duration-200 ease-out hover:scale-105 hover:border-primary hover:bg-primary hover:text-white"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
