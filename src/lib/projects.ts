export type ProjectBadge = "open source" | "product" | "cli" | "infra" | "tooling";

export type ProjectStat = { value: string; label: string };

export type ProjectSection = { heading: string; body: string };

export type CodeSample = { lang: string; code: string };

export type Project = {
  slug: string;
  name: string;
  /** small right-aligned label on cards, e.g. "★ 2.1k" or "client" */
  stars: string;
  badge: ProjectBadge;
  /** label shown inside the striped screenshot placeholder */
  imgLabel: string;
  /** one-line card blurb */
  blurb: string;
  /** short tech tags on cards */
  tags: string[];
  featured: boolean;

  // ── detail page ──
  /** longer intro paragraph on the detail page */
  summary: string;
  /** tech row on the detail page */
  tech: string[];
  /** right side of the tech row, e.g. "★ 2.1k · MIT" */
  meta: string;
  sections: ProjectSection[];
  code?: CodeSample;
  stats: ProjectStat[];
  links: { github?: string; demo?: string; writeup?: string };
};

export const projects: Project[] = [
  {
    slug: "shipwright",
    name: "shipwright",
    stars: "★ 2.1k",
    badge: "open source",
    imgLabel: "dashboard screenshot",
    blurb:
      "Self-hosted deploy orchestrator: preview envs, canary rollouts, and one-command rollback on plain Kubernetes.",
    tags: ["Go", "Kubernetes", "Next.js"],
    featured: true,
    summary:
      "A self-hosted deploy orchestrator for small teams — preview environments, canary rollouts, and one-command rollback on plain Kubernetes, without the platform-team price tag.",
    tech: ["Go", "Kubernetes", "Next.js dashboard", "Postgres"],
    meta: "★ 2.1k · MIT",
    sections: [
      {
        heading: "the problem",
        body: "Teams under ~15 engineers can't justify a dedicated platform team, but still want preview environments per PR and safe production rollouts. Existing options were either SaaS (expensive, data leaves your VPC) or raw ArgoCD (powerful, but a full-time job to run).",
      },
      {
        heading: "what i built",
        body: "A single Go binary that watches your registry, applies declarative rollout plans, and exposes a small Next.js dashboard. Canary analysis uses Prometheus queries you already have. Rollback is one command — or automatic when the error budget burns.",
      },
    ],
    code: {
      lang: "yaml",
      code: `# rollout.yaml
strategy: canary
steps:
  - weight: 10   # 10% of traffic
  - analyze: p99_latency < 250ms
  - weight: 100
on_failure: rollback`,
    },
    stats: [
      { value: "14 min → 90 s", label: "deploy time at my last team" },
      { value: "2.1k ★", label: "GitHub stars, 40+ contributors" },
      { value: "0 → 1", label: "designed, built & documented solo" },
    ],
    links: { github: "#", demo: "#", writeup: "/writing/preview-environments-on-a-budget" },
  },
  {
    slug: "pgpulse",
    name: "pgpulse",
    stars: "★ 640",
    badge: "open source",
    imgLabel: "metrics UI screenshot",
    blurb:
      "Postgres observability in one binary — slow-query heatmaps, index advice, and lock-graph visualisation.",
    tags: ["Rust", "Postgres", "React"],
    featured: true,
    summary:
      "Postgres observability in a single binary — slow-query heatmaps, index advice, and lock-graph visualisation, with no agents to babysit and sub-1% overhead on production.",
    tech: ["Rust", "Postgres", "React", "WebGL"],
    meta: "★ 640 · Apache-2.0",
    sections: [
      {
        heading: "the problem",
        body: "Every Postgres shop eventually hits a slow query it can't explain from the dashboards it has. The good tooling is either a heavyweight APM you pay per host for, or a pile of pg_stat_statements queries nobody remembers.",
      },
      {
        heading: "what i built",
        body: "A single Rust binary that samples pg_stat views, correlates them into slow-query heatmaps, and renders a live lock graph in the browser. It suggests missing indexes from the actual query shapes it sees — and tells you which existing ones are dead weight.",
      },
    ],
    code: {
      lang: "sql",
      code: `-- what pgpulse flags automatically
SELECT relname, idx_scan, pg_size_pretty(pg_relation_size(indexrelid))
FROM pg_stat_user_indexes
WHERE idx_scan = 0          -- never used
ORDER BY pg_relation_size(indexrelid) DESC;`,
    },
    stats: [
      { value: "< 1%", label: "sampling overhead on production" },
      { value: "640 ★", label: "GitHub stars, and climbing" },
      { value: "1 binary", label: "no agent, no sidecar, no queue" },
    ],
    links: { github: "#", demo: "#" },
  },
  {
    slug: "relay-notes",
    name: "relay-notes",
    stars: "client",
    badge: "product",
    imgLabel: "app screenshot",
    blurb:
      "Realtime collaborative notes for support teams. CRDT sync, offline-first, 12k DAU at handoff.",
    tags: ["Next.js", "tRPC", "Yjs"],
    featured: false,
    summary:
      "Realtime collaborative notes for support teams — CRDT sync, offline-first, and 12k daily actives by the time I handed it off. I was the second engineer and owned the collaboration core end to end.",
    tech: ["Next.js", "tRPC", "Yjs", "Postgres", "AWS"],
    meta: "client · 12k DAU",
    sections: [
      {
        heading: "the problem",
        body: "Support teams live in a dozen tabs and lose context between them. Relay wanted a shared, realtime scratchpad that kept working when the coffee-shop wifi didn't — and stayed consistent when three agents edited the same note at once.",
      },
      {
        heading: "what i built",
        body: "The realtime core on Yjs (CRDTs), an offline-first sync layer, presence, and the billing + AWS/Terraform footprint underneath it. Conflict-free by construction, so there was never a 'whose version wins' bug to triage.",
      },
    ],
    stats: [
      { value: "12k DAU", label: "at handoff" },
      { value: "offline-first", label: "conflict-free CRDT sync" },
      { value: "2nd eng", label: "built the collaboration core" },
    ],
    links: { demo: "#" },
  },
  {
    slug: "cratecheck",
    name: "cratecheck",
    stars: "★ 310",
    badge: "cli",
    imgLabel: "terminal capture",
    blurb:
      "CI action that diffs your Docker image against CVE feeds and fails the build with a fix-first report.",
    tags: ["TypeScript", "GitHub Actions"],
    featured: false,
    summary:
      "A CI action that diffs your Docker image against live CVE feeds and fails the build with a fix-first report — the fix comes before the noise, so people actually read it.",
    tech: ["TypeScript", "GitHub Actions", "OSV", "Docker"],
    meta: "★ 310 · MIT",
    sections: [
      {
        heading: "the problem",
        body: "Most image scanners dump a wall of CVEs sorted by scary color, with the one thing you can act on buried at the bottom. Teams learn to ignore the whole report, which defeats the point.",
      },
      {
        heading: "what i built",
        body: "A GitHub Action that resolves your image layers against the OSV database, then leads with the remediation: bump this base image, pin that package. Only unfixable-today issues get the wall-of-text treatment.",
      },
    ],
    stats: [
      { value: "fix-first", label: "remediation before the noise" },
      { value: "310 ★", label: "GitHub stars" },
      { value: "~4 s", label: "typical CI overhead" },
    ],
    links: { github: "#" },
  },
  {
    slug: "homelab-iac",
    name: "homelab-iac",
    stars: "★ 180",
    badge: "infra",
    imgLabel: "architecture diagram",
    blurb:
      "My entire home lab as code: Proxmox, k3s, Tailscale, and GitOps for the dishwasher (almost).",
    tags: ["Terraform", "Ansible", "k3s"],
    featured: false,
    summary:
      "My entire home lab, reproducible from an empty disk: Proxmox VMs, a k3s cluster, a Tailscale mesh, and GitOps wired deep enough that I've (almost) automated the dishwasher.",
    tech: ["Terraform", "Ansible", "k3s", "Tailscale", "Flux"],
    meta: "★ 180 · MIT",
    sections: [
      {
        heading: "the problem",
        body: "A home lab that isn't in code is a home lab you're scared to touch. I wanted to be able to nuke a node on a Saturday and have everything back by dinner — and to try infra ideas here before they touch a real cluster at work.",
      },
      {
        heading: "what i built",
        body: "Terraform provisions the Proxmox VMs, Ansible configures them, Flux reconciles a k3s cluster from this repo, and Tailscale stitches it together. It doubles as a public reference for anyone doing the same on a budget.",
      },
    ],
    stats: [
      { value: "empty disk → cluster", label: "one bootstrap command" },
      { value: "180 ★", label: "used as a reference build" },
      { value: "GitOps", label: "the repo is the source of truth" },
    ],
    links: { github: "#" },
  },
  {
    slug: "perfbudget",
    name: "perfbudget",
    stars: "★ 95",
    badge: "tooling",
    imgLabel: "report screenshot",
    blurb:
      "Lighthouse budgets as PR comments — blocks merges that regress Core Web Vitals past your thresholds.",
    tags: ["Node", "Lighthouse CI"],
    featured: false,
    summary:
      "Performance budgets that live where the work happens: perfbudget runs Lighthouse on every PR, comments the deltas inline, and blocks the merge when Core Web Vitals regress past your thresholds.",
    tech: ["Node", "Lighthouse CI", "GitHub Actions"],
    meta: "★ 95 · MIT",
    sections: [
      {
        heading: "the problem",
        body: "Performance is everyone's job until it regresses, at which point it's nobody's. Dashboards catch it a week late; by then the offending PR is three deploys back.",
      },
      {
        heading: "what i built",
        body: "A Node action that runs Lighthouse against the preview deploy, diffs the metrics against a committed budget, and posts a compact comment with the numbers that moved. Over budget, the check goes red — the conversation happens on the PR, not in a retro.",
      },
    ],
    stats: [
      { value: "on every PR", label: "budgets where the work is" },
      { value: "95 ★", label: "GitHub stars" },
      { value: "red = blocked", label: "regressions can't sneak in" },
    ],
    links: { github: "#" },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export const featuredProjects = projects.filter((p) => p.featured).slice(0, 2);
