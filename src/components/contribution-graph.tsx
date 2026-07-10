import { cellColor, contributionCells, site } from "@/lib/site";
import { ArrowLink } from "@/components/arrow-link";
import { cn } from "@/lib/utils";

//* ~6 months, rounded up to a whole number of weeks so the grid stays rectangular.
const WINDOW_DAYS = 182;

type Cell = { level: number; date?: string; count?: number };

type ContribData = {
  cells: Cell[];
  total: number | null;
  live: boolean;
};

/**
 * Real GitHub contributions via the public jogruber API, cached for a day.
 * Falls back to the deterministic mock grid if the fetch fails.
 */
async function getContributions(): Promise<ContribData> {
  try {
    const res = await fetch(
      `https://github-contributions-api.jogruber.de/v4/${site.username}?y=last`,
      { next: { revalidate: 86400 } },
    );
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = (await res.json()) as {
      total: Record<string, number>;
      contributions: { date: string; count: number; level: number }[];
    };
    const days = (data.contributions ?? []).slice(-WINDOW_DAYS);
    if (days.length === 0) throw new Error("no contributions");

    // Pad the leading partial week so weekday rows line up (0 = Sunday).
    const firstDay = new Date(days[0].date + "T00:00:00Z").getUTCDay();
    const pad: Cell[] = Array.from({ length: firstDay }, () => ({ level: -1 }));
    const cells: Cell[] = [
      ...pad,
      ...days.map((d) => ({ level: d.level, date: d.date, count: d.count })),
    ];
    const total = days.reduce((sum, d) => sum + d.count, 0);
    return { cells, total, live: true };
  } catch {
    return {
      cells: contributionCells(WINDOW_DAYS).map((level) => ({ level })),
      total: 642,
      live: false,
    };
  }
}

export async function ContributionGraph({
  className,
  bordered = true,
}: {
  className?: string;
  /** Set false when nesting inside another card frame that already owns the border/radius/background. */
  bordered?: boolean;
}) {
  const { cells, total, live } = await getContributions();
  const weeks = Math.ceil(cells.length / 7);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 px-4 py-4",
        bordered && "rounded-[12px] border border-border bg-card",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[13px] font-semibold">open source, most days</span>
        <ArrowLink
          href={site.socials.github}
          target="_blank"
          rel="noreferrer"
          className="text-[12px]"
        >
          {site.username}
        </ArrowLink>
      </div>
      <span className="font-mono text-[11px] text-faint">
        {total ? total.toLocaleString() : "—"} contributions · last 6 months
        {live ? "" : " · sample"}
      </span>
      {/* Columns are weeks, rows are weekdays. `1fr` tracks on both axes plus
          a matching aspect-ratio keep every cell square while the grid
          stretches to fill the card — no fixed px cell size, no horizontal
          scroll, scales smoothly from mobile to wide desktop. */}
      <div
        className="grid w-full gap-[2px]"
        style={{
          gridTemplateColumns: `repeat(${weeks}, 1fr)`,
          gridTemplateRows: "repeat(7, 1fr)",
          gridAutoFlow: "column",
          aspectRatio: `${weeks} / 7`,
        }}
      >
        {cells.map((cell, i) => (
          <span
            key={i}
            title={cell.date ? `${cell.count} on ${cell.date}` : undefined}
            className="rounded-[2.5px]"
            style={{ background: cell.level < 0 ? "transparent" : cellColor(cell.level) }}
          />
        ))}
      </div>
    </div>
  );
}
