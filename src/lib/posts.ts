export type PostTag = "devops" | "frontend" | "career";

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "code"; lang: string; code: string };

export type Post = {
  slug: string;
  title: string;
  //* display date, e.g. "Jun 12, 2026"
  date: string;
  //* machine date for <time> + sorting
  dateISO: string;
  tag: PostTag;
  //* reading time, e.g. "9 min"
  read: string;
  //* card summary
  summary: string;
  //* serif italic subtitle on the post page
  lede: string;
  body: Block[];
};

export const posts: Post[] = [
  {
    slug: "preview-environments-on-a-budget",
    title: "preview environments on a budget: what we learned running 400 of them",
    date: "Jun 12, 2026",
    dateISO: "2026-06-12",
    tag: "devops",
    read: "9 min",
    summary:
      "Ephemeral environments are the best DX upgrade a team can buy — until the cloud bill arrives. How we cut ours by 70% with scale-to-zero and TTLs.",
    lede: "Ephemeral environments are the best DX upgrade a team can buy — until the cloud bill arrives. Here's how we cut ours by 70%.",
    body: [
      {
        type: "p",
        text: "When we rolled out per-PR preview environments, adoption was instant. Designers reviewed real builds, PMs stopped asking “is it on staging?”, and QA moved earlier. Then finance asked why our Kubernetes bill doubled in a quarter.",
      },
      {
        type: "p",
        text: "The core insight: preview environments are idle 96% of their lifetime. You're paying for compute that exists so a URL doesn't 404. So we stopped keeping them warm.",
      },
      { type: "h2", text: "Scale to zero, wake on request" },
      {
        type: "p",
        text: "Every preview gets a tiny ingress shim. On first request it scales the deployment from zero and holds the connection — a cold start costs about four seconds, which reviewers barely notice.",
      },
      {
        type: "code",
        lang: "ts",
        code: `// wake the deployment, then proxy
await scale(deploy, { replicas: 1 });
await waitReady(deploy, { timeout: 10_000 });
return proxy(req, upstream);`,
      },
      {
        type: "p",
        text: "Combine that with a 48-hour TTL after the last commit and spot instances for the node pool, and the bill dropped 70% with zero complaints. The full config is on GitHub — link at the end.",
      },
      { type: "quote", text: "Idle compute is the tax you pay for not measuring. Measure." },
      {
        type: "p",
        text: "If you're running more than a handful of previews, do the math on idle time this week. It's probably your cheapest infrastructure win of the year.",
      },
    ],
  },
  {
    slug: "server-components-nextjs-structure",
    title: "server components changed how I structure Next.js apps",
    date: "May 03, 2026",
    dateISO: "2026-05-03",
    tag: "frontend",
    read: "7 min",
    summary:
      "Two years in: where the server/client boundary actually wants to live, and the folder structure that stopped fighting me.",
    lede: "Two years into React Server Components, the structure I fight with the least looks almost nothing like where I started.",
    body: [
      {
        type: "p",
        text: "The mistake I made early was treating “use client” like a file-level tax — one directive at the top of a page and everything below it shipped to the browser. The boundary isn't a page. It's a leaf.",
      },
      { type: "h2", text: "Push the boundary down" },
      {
        type: "p",
        text: "Fetch on the server, render on the server, and drop “use client” only on the specific interactive leaf — the dropdown, the form, the toggle. Everything above stays a Server Component and stays out of the bundle.",
      },
      {
        type: "code",
        lang: "tsx",
        code: `// page.tsx — a Server Component
export default async function Page() {
  const posts = await getPosts();        // runs on the server
  return <PostList posts={posts} />;     // client island lives inside
}`,
      },
      {
        type: "p",
        text: "Do that consistently and the folder structure stops fighting you: server components read top-down like a template, and the client islands are small enough to reason about at a glance.",
      },
    ],
  },
  {
    slug: "postgres-is-your-job-queue",
    title: "postgres is your job queue, cache, and message bus (until it isn’t)",
    date: "Mar 21, 2026",
    dateISO: "2026-03-21",
    tag: "devops",
    read: "6 min",
    summary:
      "A field guide to how far one database can take a small team — and the specific signals that tell you it’s time to reach for Redis or Kafka.",
    lede: "How far can one Postgres take a small team? Further than you'd think — and here's exactly where it stops.",
    body: [
      {
        type: "p",
        text: "Before you add Redis, Kafka, or a hosted queue to a small system, it's worth asking how far one Postgres can take you. The answer is usually “further than you'd think,” and the second answer is “here's exactly where it stops.”",
      },
      { type: "h2", text: "One database, three jobs" },
      {
        type: "p",
        text: "SELECT ... FOR UPDATE SKIP LOCKED turns a table into a perfectly good job queue. LISTEN/NOTIFY is a message bus. An unlogged table is a cache. For a team of five, that's three fewer moving parts to run, monitor, and page someone about.",
      },
      {
        type: "code",
        lang: "sql",
        code: `-- claim the next job without blocking other workers
SELECT * FROM jobs
WHERE status = 'pending'
ORDER BY created_at
FOR UPDATE SKIP LOCKED
LIMIT 1;`,
      },
      {
        type: "p",
        text: "The signal to graduate isn't “we feel fancy.” It's measurable: queue depth you can't drain, NOTIFY payloads you're outgrowing, or a cache that's evicting your real working set. Until then, boring wins.",
      },
    ],
  },
  {
    slug: "what-full-stack-should-mean",
    title: 'what "full-stack" should mean on your résumé',
    date: "Feb 08, 2026",
    dateISO: "2026-02-08",
    tag: "career",
    read: "5 min",
    summary:
      "Hiring managers read that word 50 times a day. Here’s how to make it concrete instead of vague — with examples from both sides of the table.",
    lede: "Hiring managers read “full-stack” fifty times a day. By lunchtime it means nothing. Let's fix that.",
    body: [
      {
        type: "p",
        text: "Anyone can list React and Postgres. What a hiring manager is actually buying is your ability to own a feature across the seam between them — to trace a slow request from a component through an API to a query plan and fix it wherever it actually lives.",
      },
      { type: "h2", text: "Show the seam, not the stack" },
      {
        type: "p",
        text: "Write the résumé around outcomes that crossed that seam: the incident you debugged from browser to database, the migration you shipped end to end, the feature nobody had to hand off midway.",
      },
      {
        type: "quote",
        text: "“Full-stack” isn't a list of technologies. It's the willingness to follow a bug wherever it goes.",
      },
      {
        type: "p",
        text: "The stack is context; the ownership is the point. Lead with the ownership and the same six technologies suddenly read very differently.",
      },
    ],
  },
  {
    slug: "chasing-a-40ms-interaction",
    title: "chasing a 40ms interaction: a profiling walkthrough",
    date: "Dec 15, 2025",
    dateISO: "2025-12-15",
    tag: "frontend",
    read: "8 min",
    summary:
      "A single slow dropdown, traced end to end through React re-renders, layout thrash, and one very guilty useEffect.",
    lede: "A single dropdown felt cheap — maybe 200ms to open. Nobody filed a bug. Here's tracing it under 40ms.",
    body: [
      {
        type: "p",
        text: "Nobody had filed a bug; the dropdown just felt sluggish. That's the worst kind of performance problem — the kind you have to go looking for. So I opened the profiler instead of guessing.",
      },
      { type: "h2", text: "Profile before you guess" },
      {
        type: "p",
        text: "The React Profiler pointed at a parent re-render fanning out to two hundred children on every keystroke. Under it, a layout thrash: reading offsetHeight in a loop that also wrote styles. And, of course, one guilty useEffect recomputing the whole list.",
      },
      {
        type: "code",
        lang: "tsx",
        code: `const Row = memo(function Row({ item }: { item: Item }) {
  return <li>{item.label}</li>;
});

const visible = useMemo(() => filter(items, query), [items, query]);`,
      },
      {
        type: "p",
        text: "Memoize the row, hoist the measurement out of the loop, and give the effect an honest dependency array. The interaction dropped from ~200ms to 38ms — and it was the profiler, not intuition, that found each one.",
      },
    ],
  },
  {
    slug: "terraform-monorepos",
    title: "terraform monorepos that don’t make you cry",
    date: "Oct 30, 2025",
    dateISO: "2025-10-30",
    tag: "devops",
    read: "10 min",
    summary:
      "Module layout, state boundaries, and the plan-review workflow that let five engineers share one repo without stepping on each other.",
    lede: "Five engineers, one Terraform repo, and nobody crying. It's possible — if you're deliberate about three things.",
    body: [
      {
        type: "p",
        text: "Five engineers, one Terraform repo, and nobody crying. It's possible, but only if you're deliberate about three things: module layout, state boundaries, and the plan-review workflow.",
      },
      { type: "h2", text: "State boundaries are team boundaries" },
      {
        type: "p",
        text: "The blast radius of a terraform apply is exactly the size of its state file. Split state along the lines your team already respects — per service, per environment — and a bad apply can only hurt one thing at a time.",
      },
      {
        type: "code",
        lang: "hcl",
        code: `# one state file per service/environment
terraform {
  backend "s3" {
    key = "services/api/production.tfstate"
  }
}`,
      },
      {
        type: "p",
        text: "Then make terraform plan a PR artifact, not a thing people run locally and paraphrase. When the plan is in the diff, review is real, and five people can share one repo without stepping on each other.",
      },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export const latestPosts = posts.slice(0, 3);

export const postTags: ("all" | PostTag)[] = ["all", "devops", "frontend", "career"];
