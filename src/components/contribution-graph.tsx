import { cellColor, contributionCells, site } from "@/lib/site";
import { ArrowLink } from "@/components/arrow-link";

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
    const days = data.contributions ?? [];
    if (days.length === 0) throw new Error("no contributions");

    // Pad the leading partial week so weekday rows line up (0 = Sunday).
    const firstDay = new Date(days[0].date + "T00:00:00Z").getUTCDay();
    const pad: Cell[] = Array.from({ length: firstDay }, () => ({ level: -1 }));
    const cells: Cell[] = [
      ...pad,
      ...days.map((d) => ({ level: d.level, date: d.date, count: d.count })),
    ];
    const total = Object.values(data.total ?? {}).reduce((a, b) => a + b, 0) || null;
    return { cells, total, live: true };
  } catch {
    return {
      cells: contributionCells().map((level) => ({ level })),
      total: 1284,
      live: false,
    };
  }
}

export async function ContributionGraph() {
  const { cells, total, live } = await getContributions();

  return (
    <div className="flex flex-col gap-4 rounded-[14px] border border-border bg-card px-6.5 py-6">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="text-[15px] font-semibold">open source, most days</span>
        <span className="font-mono text-[12px] text-faint">
          {total ? total.toLocaleString() : "—"} contributions · last 12 months
          {live ? "" : " · sample"}
        </span>
        <ArrowLink
          href={site.socials.github}
          target="_blank"
          rel="noreferrer"
          className="ml-auto text-[13px]"
        >
          github.com/{site.username}
        </ArrowLink>
      </div>
      {/* dir="rtl" makes the scrollable area anchor to its end (the most
          recent weeks) by default without JS; dir="ltr" on the inner grid
          keeps the cells themselves in normal chronological order. */}
      <div className="overflow-x-auto" dir="rtl">
        <div
          dir="ltr"
          className="grid w-max grid-flow-col gap-0.75"
          style={{ gridTemplateRows: "repeat(7, 10px)", gridAutoColumns: "10px" }}
        >
          {cells.map((cell, i) => (
            <span
              key={i}
              title={cell.date ? `${cell.count} on ${cell.date}` : undefined}
              className="h-2.5 w-2.5 rounded-[2.5px]"
              style={{ background: cell.level < 0 ? "transparent" : cellColor(cell.level) }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
