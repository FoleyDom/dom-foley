import matter from "gray-matter";
import { cache } from "react";

const NUM_POSTS_TO_SHOW: number = 5;

export type PostTag = "devops" | "frontend" | "career";

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
  //* raw markdown body (post-frontmatter) — rendered with react-markdown
  content: string;
  //* original source of truth — used for canonical <link> tags
  canonicalUrl?: string;
};

export const postTags: ("all" | PostTag)[] = ["all", "devops", "frontend", "career"];

//* synapse config — set these in .env.local to point to your own repo/branch/token if you want to test locally with a different source of truth.
const SYNAPSE_REPO: string = process.env.SYNAPSE_GITHUB_REPO ?? "FoleyDom/synapse";
const SYNAPSE_BRANCH: string = process.env.SYNAPSE_GITHUB_BRANCH ?? "main";
const SYNAPSE_TOKEN: string | undefined = process.env.SYNAPSE_GITHUB_TOKEN;
const WRITINGS_DIR: string = "drafts";

type GithubContentEntry = {
  name: string;
  path: string;
  type: "file" | "dir";
};

function githubHeaders(accept: string) {
  const headers: Record<string, string> = {
    Accept: accept,
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (SYNAPSE_TOKEN) headers.Authorization = `Bearer ${SYNAPSE_TOKEN}`;
  return headers;
}

//* Loud on purpose: a broken repo/token/branch is a config problem that
//* should fail the build, not silently ship a site with zero posts.
async function listWritingsFiles(): Promise<GithubContentEntry[]> {
  const url = `https://api.github.com/repos/${SYNAPSE_REPO}/contents/${WRITINGS_DIR}?ref=${SYNAPSE_BRANCH}`;
  const res = await fetch(url, {
    headers: githubHeaders("application/vnd.github+json"),
    next: { revalidate: 3600 },
  });

  if (res.status === 404) {
    //* writings/ doesn't exist yet (e.g. nothing published) — that's a valid
    //* empty state, not an error.
    return [];
  }
  if (!res.ok) {
    throw new Error(
      `[posts] failed to list ${SYNAPSE_REPO}/${WRITINGS_DIR} (${res.status} ${res.statusText}). ` +
      `Check SYNAPSE_GITHUB_REPO/SYNAPSE_GITHUB_BRANCH/SYNAPSE_GITHUB_TOKEN.`,
    );
  }

  const entries = (await res.json()) as GithubContentEntry[];
  return entries.filter((e) => e.type === "file" && e.name.toLowerCase().endsWith(".md"));
}

async function fetchRawFile(name: string): Promise<string> {
  const url = `https://raw.githubusercontent.com/${SYNAPSE_REPO}/${SYNAPSE_BRANCH}/${WRITINGS_DIR}/${encodeURIComponent(name)}`;
  const res = await fetch(url, {
    headers: SYNAPSE_TOKEN ? { Authorization: `Bearer ${SYNAPSE_TOKEN}` } : undefined,
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`[posts] failed to fetch ${name} (${res.status} ${res.statusText})`);
  }
  return res.text();
}

//* frontmatter -> Post
function normalizeDateISO(value: string | Date): string | null {
  //* Unquoted YAML dates (date: 2026-07-10) get auto-parsed into a JS Date
  //* by the underlying YAML parser — handle both that and a plain string.
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  return null;
}

const DISPLAY_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDisplayDate(dateISO: string): string {
  const [y, m, d] = dateISO.split("-").map(Number);
  return `${DISPLAY_MONTHS[m - 1]} ${d}, ${y}`;
}

//* build category values
function buildCategorysValues(): Record<string, PostTag> {
  const values: Record<string, PostTag> = {};

  for (const tag of postTags) {
    if (tag !== "all") values[tag] = tag;
  }

  return values;
}

const CATEGORY_VALUES: Record<string, PostTag> = buildCategorysValues();

function parsePost(fileName: string, raw: string): Post | null {
  const { data, content } = matter(raw);
  const fail = (reason: string, consoleLogFails: boolean = process.env.NODE_ENV === "development") => {
    if (consoleLogFails) {
      console.warn(`[posts] skipping "${fileName}": ${reason}`);
    }
    return null;
  };

  for (const field of ["title", "slug", "description"] as const) {
    if (typeof data[field] !== "string" || !data[field].trim()) {
      return fail(`missing or empty required frontmatter field "${field}"`);
    }
  }

  const dateISO = normalizeDateISO(data.date);
  if (!dateISO) return fail(`"date" must be a YYYY-MM-DD date (got ${JSON.stringify(data.date)})`);

  if (!CATEGORY_VALUES[data.category]) {
    fail(
      `"category" must be one of ${Object.keys(CATEGORY_VALUES).join(", ")} (got ${JSON.stringify(data.category)}) — ` +
      `this is separate from "tags", which is freeform and only used for cross-posting`,
    );
  }

  if (typeof data.reading_time !== "number" || data.reading_time <= 0) {
    return fail(`"reading_time" must be a positive number (got ${JSON.stringify(data.reading_time)})`);
  }

  const body = content.trim();
  if (!body) return fail("post body is empty");

  return {
    slug: data.slug,
    title: data.title,
    date: formatDisplayDate(dateISO),
    dateISO,
    tag: data.category,
    read: `${data.reading_time} min`,
    summary: data.description,
    lede: typeof data.lede === "string" && data.lede.trim() ? data.lede : data.description,
    content: body,
    canonicalUrl: typeof data.canonical_url === "string" ? data.canonical_url : undefined,
  };
}

//* public API
export const getAllPosts = cache(async (): Promise<Post[]> => {
  const files = await listWritingsFiles();

  const parsed = await Promise.all(
    files.map(async (file) => {
      try {
        const raw = await fetchRawFile(file.name);
        return parsePost(file.name, raw);
      } catch (err) {
        console.warn(`[posts] skipping "${file.name}": ${(err as Error).message}`);
        return null;
      }
    }),
  );

  const seenSlugs = new Set<string>();
  const posts: Post[] = [];
  for (const post of parsed) {
    if (!post) continue;
    if (seenSlugs.has(post.slug)) {
      console.warn(`[posts] duplicate slug "${post.slug}" — keeping the first one found, skipping the rest`);
      continue;
    }
    seenSlugs.add(post.slug);
    posts.push(post);
  }

  return posts.sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1));
});

export async function getPost(slug: string): Promise<Post | undefined> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug === slug);
}

export async function getLatestPosts(count: number = NUM_POSTS_TO_SHOW): Promise<Post[]> {
  const posts = await getAllPosts();
  return posts.slice(0, count);
}
