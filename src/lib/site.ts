export const site = {
  name: "dom foley",
  role: "full-stack engineer & devops expert",
  email: "df@domfoley.com",
  domain: "domfoley.com",
  //* Canonical origin — single source of truth for metadata, sitemap, robots, RSS.
  url: "https://domfoley.com",
  location: "Scranton, PA · remote-friendly",
  username: "FoleyDom",
  resumeUrl: "/resume/Dom-Foley-Resume.pdf",
  socials: {
    github: "https://github.com/FoleyDom",
    linkedin: "https://www.linkedin.com/in/domfoley",
    x: "https://x.com/FoleyDom_",
    rss: "/rss.xml",
    email: "mailto:df@domfoley.com",
  },
  //* Where the contact form delivers. Override with CONTACT_TO (comma-separated).
  contactRecipients: ["domfoley.dev@gmail.com", "dom.foley@icloud.com", "df@domfoley.com"],
} as const;

export type NavItem = { label: string; href: string; hint: string };

//* Header navigation — the trailing slash matches the terminal-prompt brand.
export const navItems: NavItem[] = [
  { label: "home/", href: "/", hint: "home & contact" },
  { label: "work/", href: "/work", hint: "projects — coming soon" },
  { label: "writing/", href: "/writing", hint: "notes on shipping software" },
  { label: "about/", href: "/about", hint: "experience & résumé" },
];

//* Marquee items for the "core stack" strip.
export const coreStack = [
  "PHP",
  "Laravel",
  "PostgreSQL",
  "TypeScript",
  "Next.js",
  "React",
  "Node",
  "Go",
  "Docker",
  "Kubernetes",
  "AWS",
] as const;

function leapYear(year = new Date().getFullYear()): boolean {
  return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

/**
 * Deterministic contribution grid (52 weeks × 7 days). Mirrors the mockup's
 * sine-hash so the layout is stable between renders. Returns intensity levels
 * 0–4; the component maps them to theme-aware colors.
 */
export function contributionCells(count: number = leapYear() ? 365 : 364): number[] {
  const cells: number[] = [];
  for (let i = 0; i < count; i++) {
    const r = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
    const day = i % 7;
    let level: number;
    if (day >= 5 && r < 0.7) level = 0;
    else if (r < 0.28) level = 0;
    else if (r < 0.55) level = 1;
    else if (r < 0.78) level = 2;
    else if (r < 0.93) level = 3;
    else level = 4;
    cells.push(level);
  }
  return cells;
}

/** Theme-aware background for a contribution cell of the given intensity. */
export function cellColor(level: number): string {
  switch (level) {
    case 1:
      return "color-mix(in srgb, var(--primary) 14%, transparent)";
    case 2:
      return "color-mix(in srgb, var(--primary) 34%, transparent)";
    case 3:
      return "color-mix(in srgb, var(--primary) 62%, transparent)";
    case 4:
      return "var(--primary)";
    default:
      return "var(--line)";
  }
}
