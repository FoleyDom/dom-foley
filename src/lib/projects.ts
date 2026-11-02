export type ProjectBadge = "open source" | "product" | "cli" | "infra" | "tooling";

export type ProjectStat = { value: string; label: string };

export type ProjectSection = { heading: string; body: string };

export type CodeSample = { lang: string; code: string };

/**
 * Images live under /public; width/height are the intrinsic pixel size.
 * title/details are shown when a screenshot is opened in the gallery.
 */
export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  title?: string;
  details?: string;
};

/** A muted, looping screen recording; poster is shown until it plays. */
export type ProjectVideo = {
  src: string;
  poster: string;
  title: string;
  width: number;
  height: number;
  /** ISO date the recording was made, for VideoObject structured data. */
  uploaded: string;
};

export type ProjectMedia = { demo?: ProjectVideo; screenshots: ProjectImage[] };

export type Project = {
  slug: string;
  name: string;
  stars: string;
  badge: ProjectBadge;
  imgLabel: string;
  /** Card thumbnail; falls back to the striped placeholder with imgLabel. */
  cover?: ProjectImage;
  blurb: string;
  tags: string[];
  featured: boolean;
  /** Set for work that isn't finished yet; shown as a label on the card and page. */
  status?: "in progress";
  /** ISO date this write-up last changed; feeds the sitemap's lastModified. */
  updated: string;

  // ── detail page ──
  summary: string;
  tech: string[];
  meta: string;
  sections: ProjectSection[];
  code?: CodeSample;
  stats: ProjectStat[];
  media?: ProjectMedia;
  links: { github?: string; demo?: string; writeup?: string };
};

export const projects: Project[] = [
  {
    slug: "easyscores",
    updated: "2026-11-01",
    name: "EasyScores",
    stars: "★",
    badge: "product",
    imgLabel: "scores screenshot",
    cover: { src: "/projects/easyscores/demo-poster.jpg", alt: "EasyScores My teams screen on desktop, showing followed teams with their next and last games", width: 1456, height: 828 },
    blurb:
      "A mobile-first, stats-first sports tracker for NBA, NFL and MLB: live scores, standings, your teams, and a personal bet tracker.",
    tags: ["Laravel", "Inertia", "React", "TypeScript", "Tailwind CSS", "Laravel Cloud"],
    featured: true,
    summary:
      "EasyScores is a mobile-first sports tracker for the NBA, NFL and MLB. It leads with what fans actually check: live scores, linescores, leaders and box scores, standings, and a home screen built around your favorite teams. Heads-Ups surface finals and close games late for the teams you follow, and a bet tracker sits quietly under Extras.",
    tech: ["Laravel", "Inertia.js", "React", "TypeScript", "Tailwind CSS", "Fortify", "PHPStan", "Laravel Cloud"],
    meta: "★ · live on Laravel Cloud",
    sections: [
      {
        heading: "the problem",
        body: "Mainstream sports apps bury the score under video, news and betting promos. Checking how your team is doing should take one tap, work well on a phone, and not hammer a rate-limited data provider every time someone refreshes.",
      },
      {
        heading: "what i built",
        body: "A Laravel + Inertia/React app backed by ESPN's public API behind a provider-agnostic SportsProvider interface. A shared cache layer sets lifetimes from the games themselves: live games refresh on a short interval, upcoming games refresh every half hour or so until tip-off to keep odds current, finished data is held for a week. Concurrent requests share one provider call, and the last good response is served if the provider fails. On top of that: favorite teams, team season pages, game detail pages, Heads-Ups, watched games, and a bet tracker, with a bottom tab bar on phones and a sidebar on desktop.",
      },
    ],
    code: {
      lang: "php",
      code: `// cache lifetimes follow the games themselves
foreach ($games as $game) 
{
    if ($game->status->isFinished()) 
    {
        continue;
    }

    $start = $game->startTime();

    // live, or due to have started: refresh on the live interval
    if ($game->status->isLive() || $start === null || $start->isPast()) 
    {
        return $this->liveTtl();
    }

    $nextStart = $nextStart === null ? $start : $nextStart->min($start);
}

// nothing live: hold until the next game starts
return $this->untilStart($nextStart);`,
    },
    stats: [
      { value: "3 leagues", label: "NBA, NFL and MLB, with a new league one enum case away" },
      { value: "1 call", label: "shared across concurrent requests, with stale-on-failure fallback" },
      { value: "0 → 1", label: "designed, built & deployed solo" },
    ],
    media: {
      demo: {
        src: "/projects/easyscores/demo.mp4",
        poster: "/projects/easyscores/demo-poster.jpg",
        title: "EasyScores demo: my teams, a team page, the scoreboard, a game's box score and standings",
        width: 1456,
        height: 828,
        uploaded: "2026-11-01",
      },
      screenshots: [
        {
          src: "/projects/easyscores/my-teams.jpg",
          alt: "My teams home with a Heads-Up for a finished Thunder game",
          width: 400,
          height: 676,
          title: "My teams",
          details:
            "The home screen is built around the teams you follow: next game, last result, standing and streak. Heads-Ups up top call out finals and close games late, and swipe away once read.",
        },
        {
          src: "/projects/easyscores/scores.jpg",
          alt: "Scores page with the latest NBA final and league tabs",
          width: 400,
          height: 676,
          title: "Scores",
          details:
            "Every game for a league on a given day, with the latest final pinned above. Live games refresh on a short interval and upcoming games show the odds.",
        },
        {
          src: "/projects/easyscores/game.jpg",
          alt: "Game page for Thunder at Rockets with the final score and linescore",
          width: 400,
          height: 676,
          title: "Game page",
          details:
            "Leads with the score and linescore, then game leaders, team stats and a full box score. Odds and your bets sit in a collapsed section further down.",
        },
        {
          src: "/projects/easyscores/team.jpg",
          alt: "Oklahoma City Thunder team page with upcoming games",
          width: 400,
          height: 676,
          title: "Team page",
          details:
            "A team's season at a glance: upcoming games, record splits, key players and results, with this season and last season tabs.",
        },
        {
          src: "/projects/easyscores/standings.jpg",
          alt: "NBA standings for the Atlantic division",
          width: 400,
          height: 676,
          title: "Standings",
          details:
            "Division standings for the NBA, NFL and MLB, with each league's own columns: wins, losses (and ties for the NFL), win percentage, games back and streak, plus last-10 form for the NBA and MLB.",
        },
      ],
    },
    links: {
      demo: "https://easyscores.laravel.cloud/",
      // Shown only once this post is published in synapse (see the project page).
      writeup: "/writings/easyscores-a-scoreboard-that-leads-with-the-score",
    },
  },
  {
    slug: "cashtrakd",
    updated: "2026-11-01",
    name: "CashTrakd",
    stars: "wip",
    badge: "product",
    imgLabel: "dashboard screenshot",
    cover: { src: "/projects/cashtrakd/dashboard.jpg", alt: "CashTrakd dashboard with net worth, account balances, monthly budgets and goals", width: 1456, height: 828 },
    blurb:
      "A friendly budgeting app with streaks and goals, built as a Laravel API and a Next.js front end. Still being built.",
    tags: ["Laravel", "Next.js", "PostgreSQL", "Sanctum", "Docker", "GitHub Actions"],
    featured: true,
    status: "in progress",
    summary:
      "CashTrakd is a budgeting app for people who would rather not think about spreadsheets: accounts, budgets, goals and spending in one calm overview, with streaks and badges to make checking in feel good. It's still being built: the API, auth and accounts are real, and the rest of the dashboard is designed but not wired up yet.",
    tech: ["Laravel", "Sanctum", "PostgreSQL", "Next.js", "React", "Tailwind CSS", "Docker", "GitHub Actions"],
    meta: "Laravel API · Next.js",
    sections: [
      {
        heading: "the problem",
        body: "Most budgeting apps either drown you in charts or nag you with red numbers, so people stop opening them. CashTrakd aims for a clear picture of your money and small wins (streaks, badges, goals you can see moving) that make coming back a habit instead of a chore.",
      },
      {
        heading: "how it's built",
        body: "Two separate apps. A Laravel API, versioned under /api/v1, with Postgres and Redis running in Docker via Sail, models for accounts, categories, budgets, transactions and transfers, account numbers stored hashed, and tests running in GitHub Actions. And a Next.js front end that talks to it with Sanctum's cookie-based SPA auth, so the session lives in an httpOnly cookie and every state-changing request carries a CSRF token.",
      },
      {
        heading: "where it's at",
        body: "Working today: register, sign in and out, protected routes, and a dashboard whose accounts and net worth come from the API. Budgets, goals and recent activity are on screen as designed but still use sample data while their endpoints are built. Next up: transactions, budgets and goals end to end, then bank sync and a hosted release.",
      },
    ],
    code: {
      lang: "typescript",
      code: `// apiFetch(): every call from the Next.js app to the Laravel API
// only state-changing requests need the CSRF handshake
if (isMutation) {
  await ensureCsrfCookie();
  requestHeaders.set("X-XSRF-TOKEN", readXsrfTokenFromCookie());
}

const response = await fetch(\`\${API_URL}\${path}\`, {
  ...init,
  method,
  credentials: "include", // always send the Sanctum session cookie
  headers: requestHeaders,
  body: body === undefined ? undefined : sendsRawBody ? body : JSON.stringify(body),
  signal: combineSignals(init.signal, timeoutSignal),
});`,
    },
    stats: [
      { value: "2 apps", label: "Laravel API + Next.js front end, built as separate apps" },
      { value: "cookie auth", label: "Sanctum SPA sessions with CSRF, no tokens in localStorage" },
      { value: "5 resources", label: "accounts, categories, budgets, transactions and transfers in the v1 API" },
    ],
    media: {
      screenshots: [
        {
          src: "/projects/cashtrakd/dashboard.jpg",
          alt: "CashTrakd dashboard with net worth, accounts, budgets, recent activity and goals",
          width: 1456,
          height: 828,
          title: "Dashboard",
          details:
            "Net worth and the account cards come from the Laravel API's accounts endpoint (sample accounts shown here). Budgets, recent activity and goals are laid out as designed but still use placeholder data until their endpoints ship.",
        },
        {
          src: "/projects/cashtrakd/landing.jpg",
          alt: "CashTrakd landing page hero: Money, minus the boring part",
          width: 1456,
          height: 828,
          title: "Landing page",
          details:
            "The marketing page: a friendly pitch, a preview card of the dashboard, and a gradient brand that carries through the whole app.",
        },
        {
          src: "/projects/cashtrakd/features.jpg",
          alt: "CashTrakd landing page features and streaks section",
          width: 1456,
          height: 828,
          title: "Features and streaks",
          details:
            "Bank sync, budgets that adapt and goals, plus the streaks and badges that reward checking in. Bank sync is on the roadmap and not built yet.",
        },
        {
          src: "/projects/cashtrakd/login.jpg",
          alt: "CashTrakd sign-in screen",
          width: 1456,
          height: 828,
          title: "Sign in and create account",
          details:
            "Working auth against the Laravel API using Sanctum's cookie-based SPA sessions. The session lives in an httpOnly cookie and every state-changing request carries a CSRF token.",
        },
      ],
    },
    links: {},
  },
//   {
//     slug: "pgpulse",
//     name: "pgpulse",
//     stars: "★ 640",
//     badge: "open source",
//     imgLabel: "metrics UI screenshot",
//     blurb:
//       "Postgres observability in one binary — slow-query heatmaps, index advice, and lock-graph visualisation.",
//     tags: ["Rust", "Postgres", "React"],
//     featured: true,
//     summary:
//       "Postgres observability in a single binary — slow-query heatmaps, index advice, and lock-graph visualisation, with no agents to babysit and sub-1% overhead on production.",
//     tech: ["Rust", "Postgres", "React", "WebGL"],
//     meta: "★ 640 · Apache-2.0",
//     sections: [
//       {
//         heading: "the problem",
//         body: "Every Postgres shop eventually hits a slow query it can't explain from the dashboards it has. The good tooling is either a heavyweight APM you pay per host for, or a pile of pg_stat_statements queries nobody remembers.",
//       },
//       {
//         heading: "what i built",
//         body: "A single Rust binary that samples pg_stat views, correlates them into slow-query heatmaps, and renders a live lock graph in the browser. It suggests missing indexes from the actual query shapes it sees — and tells you which existing ones are dead weight.",
//       },
//     ],
//     code: {
//       lang: "sql",
//       code: `-- what pgpulse flags automatically
// SELECT relname, idx_scan, pg_size_pretty(pg_relation_size(indexrelid))
// FROM pg_stat_user_indexes
// WHERE idx_scan = 0          -- never used
// ORDER BY pg_relation_size(indexrelid) DESC;`,
//     },
//     stats: [
//       { value: "< 1%", label: "sampling overhead on production" },
//       { value: "640 ★", label: "GitHub stars, and climbing" },
//       { value: "1 binary", label: "no agent, no sidecar, no queue" },
//     ],
//     links: { github: "#", demo: "#" },
//   },
//   {
//     slug: "relay-notes",
//     name: "relay-notes",
//     stars: "client",
//     badge: "product",
//     imgLabel: "app screenshot",
//     blurb:
//       "Realtime collaborative notes for support teams. CRDT sync, offline-first, 12k DAU at handoff.",
//     tags: ["Next.js", "tRPC", "Yjs"],
//     featured: false,
//     summary:
//       "Realtime collaborative notes for support teams — CRDT sync, offline-first, and 12k daily actives by the time I handed it off. I was the second engineer and owned the collaboration core end to end.",
//     tech: ["Next.js", "tRPC", "Yjs", "Postgres", "AWS"],
//     meta: "client · 12k DAU",
//     sections: [
//       {
//         heading: "the problem",
//         body: "Support teams live in a dozen tabs and lose context between them. Relay wanted a shared, realtime scratchpad that kept working when the coffee-shop wifi didn't — and stayed consistent when three agents edited the same note at once.",
//       },
//       {
//         heading: "what i built",
//         body: "The realtime core on Yjs (CRDTs), an offline-first sync layer, presence, and the billing + AWS/Terraform footprint underneath it. Conflict-free by construction, so there was never a 'whose version wins' bug to triage.",
//       },
//     ],
//     stats: [
//       { value: "12k DAU", label: "at handoff" },
//       { value: "offline-first", label: "conflict-free CRDT sync" },
//       { value: "2nd eng", label: "built the collaboration core" },
//     ],
//     links: { demo: "#" },
//   },
//   {
//     slug: "cratecheck",
//     name: "cratecheck",
//     stars: "★ 310",
//     badge: "cli",
//     imgLabel: "terminal capture",
//     blurb:
//       "CI action that diffs your Docker image against CVE feeds and fails the build with a fix-first report.",
//     tags: ["TypeScript", "GitHub Actions"],
//     featured: false,
//     summary:
//       "A CI action that diffs your Docker image against live CVE feeds and fails the build with a fix-first report — the fix comes before the noise, so people actually read it.",
//     tech: ["TypeScript", "GitHub Actions", "OSV", "Docker"],
//     meta: "★ 310 · MIT",
//     sections: [
//       {
//         heading: "the problem",
//         body: "Most image scanners dump a wall of CVEs sorted by scary color, with the one thing you can act on buried at the bottom. Teams learn to ignore the whole report, which defeats the point.",
//       },
//       {
//         heading: "what i built",
//         body: "A GitHub Action that resolves your image layers against the OSV database, then leads with the remediation: bump this base image, pin that package. Only unfixable-today issues get the wall-of-text treatment.",
//       },
//     ],
//     stats: [
//       { value: "fix-first", label: "remediation before the noise" },
//       { value: "310 ★", label: "GitHub stars" },
//       { value: "~4 s", label: "typical CI overhead" },
//     ],
//     links: { github: "#" },
//   },
//   {
//     slug: "homelab-iac",
//     name: "homelab-iac",
//     stars: "★ 180",
//     badge: "infra",
//     imgLabel: "architecture diagram",
//     blurb:
//       "My entire home lab as code: Proxmox, k3s, Tailscale, and GitOps for the dishwasher (almost).",
//     tags: ["Terraform", "Ansible", "k3s"],
//     featured: false,
//     summary:
//       "My entire home lab, reproducible from an empty disk: Proxmox VMs, a k3s cluster, a Tailscale mesh, and GitOps wired deep enough that I've (almost) automated the dishwasher.",
//     tech: ["Terraform", "Ansible", "k3s", "Tailscale", "Flux"],
//     meta: "★ 180 · MIT",
//     sections: [
//       {
//         heading: "the problem",
//         body: "A home lab that isn't in code is a home lab you're scared to touch. I wanted to be able to nuke a node on a Saturday and have everything back by dinner — and to try infra ideas here before they touch a real cluster at work.",
//       },
//       {
//         heading: "what i built",
//         body: "Terraform provisions the Proxmox VMs, Ansible configures them, Flux reconciles a k3s cluster from this repo, and Tailscale stitches it together. It doubles as a public reference for anyone doing the same on a budget.",
//       },
//     ],
//     stats: [
//       { value: "empty disk → cluster", label: "one bootstrap command" },
//       { value: "180 ★", label: "used as a reference build" },
//       { value: "GitOps", label: "the repo is the source of truth" },
//     ],
//     links: { github: "#" },
//   },
//   {
//     slug: "perfbudget",
//     name: "perfbudget",
//     stars: "★ 95",
//     badge: "tooling",
//     imgLabel: "report screenshot",
//     blurb:
//       "Lighthouse budgets as PR comments — blocks merges that regress Core Web Vitals past your thresholds.",
//     tags: ["Node", "Lighthouse CI"],
//     featured: false,
//     summary:
//       "Performance budgets that live where the work happens: perfbudget runs Lighthouse on every PR, comments the deltas inline, and blocks the merge when Core Web Vitals regress past your thresholds.",
//     tech: ["Node", "Lighthouse CI", "GitHub Actions"],
//     meta: "★ 95 · MIT",
//     sections: [
//       {
//         heading: "the problem",
//         body: "Performance is everyone's job until it regresses, at which point it's nobody's. Dashboards catch it a week late; by then the offending PR is three deploys back.",
//       },
//       {
//         heading: "what i built",
//         body: "A Node action that runs Lighthouse against the preview deploy, diffs the metrics against a committed budget, and posts a compact comment with the numbers that moved. Over budget, the check goes red — the conversation happens on the PR, not in a retro.",
//       },
//     ],
//     stats: [
//       { value: "on every PR", label: "budgets where the work is" },
//       { value: "95 ★", label: "GitHub stars" },
//       { value: "red = blocked", label: "regressions can't sneak in" },
//     ],
//     links: { github: "#" },
//   },
];

/** Case-insensitive so /work/EasyScores still finds "easyscores"; the page redirects to the canonical slug. */
export function getProject(slug: string): Project | undefined {
  const wanted = slug.toLowerCase();
  return projects.find((p) => p.slug.toLowerCase() === wanted);
}

export const featuredProjects = projects.filter((p) => p.featured).slice(0, 2);
