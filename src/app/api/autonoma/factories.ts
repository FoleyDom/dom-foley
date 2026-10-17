import { z } from "zod";
import { defineFactory } from "@autonoma-ai/sdk";
import { getProject, projects } from "@/lib/projects";
import { getPost, posts } from "@/lib/posts";
import { jobs, skillGroups } from "@/lib/about";
import { submitContact, clearRateLimit } from "@/app/actions/contact";

//? testRunId doubles as the SDK's scopeField (see route.ts) — this app has no
//? tenant/organization concept, so every factory's input schema carries it.
const scoped = { testRunId: z.string() };

//? Project/Post/Job/SkillGroup are `const` arrays compiled into the bundle
//? (src/lib/projects.ts, posts.ts, about.ts) — there is no runtime creation path,
//? so these factories resolve the recipe's key field against the real, permanent
//? content instead of fabricating new rows. Teardown is a no-op: nothing was
//? created, so there is nothing to delete. See IMPLEMENTATION.md for why.

export const Project = defineFactory({
  inputSchema: z.object({ ...scoped, slug: z.string() }),
  create: async (data) => {
    const project = getProject(data.slug);
    if (!project) {
      throw new Error(
        `No such project "${data.slug}" — Project has no runtime creation path, ` +
        `so the recipe must reference one of: ${projects.map((p) => p.slug).join(", ")}`,
      );
    }
    return { id: project.slug, ...project };
  },
  teardown: () => {},
});

export const Post = defineFactory({
  inputSchema: z.object({ ...scoped, slug: z.string() }),
  create: async (data) => {
    const post = getPost(data.slug);
    if (!post) {
      throw new Error(
        `No such post "${data.slug}" — Post has no runtime creation path, ` +
        `so the recipe must reference one of: ${posts.map((p) => p.slug).join(", ")}`,
      );
    }
    return { id: post.slug, ...post };
  },
  teardown: () => {},
});

export const Job = defineFactory({
  inputSchema: z.object({ ...scoped, co: z.string() }),
  create: async (data) => {
    const job = jobs.find((j) => j.co === data.co);
    if (!job) {
      throw new Error(
        `No such job "${data.co}" — Job has no runtime creation path, ` +
        `so the recipe must reference one of: ${jobs.map((j) => j.co).join(", ")}`,
      );
    }
    return { id: job.co, ...job };
  },
  teardown: () => {},
});

export const SkillGroup = defineFactory({
  inputSchema: z.object({ ...scoped, label: z.string() }),
  create: async (data) => {
    const group = skillGroups.find((g) => g.label === data.label);
    if (!group) {
      throw new Error(
        `No such skill group "${data.label}" — SkillGroup has no runtime creation path, ` +
        `so the recipe must reference one of: ${skillGroups.map((g) => g.label).join(", ")}`,
      );
    }
    return { id: group.label, ...group };
  },
  teardown: () => {},
});

//? ContactMessage is the one entity with a real creation path: it goes through
//? the same submitContact() the live form calls, so validation, the honeypot check,
//? Upstash rate limiting, and the real Resend send all run for real. There is no
//? row to read back afterward (the app persists nothing) — the observable effect is
//? the email itself. Each test run gets its own synthetic rate-limit identifier
//? (autonoma-<testRunId>) so concurrent runs never contend for the same bucket, and
//? teardown clears that identifier's buckets rather than any real visitor's.
export const ContactMessage = defineFactory({
  inputSchema: z.object({
    ...scoped,
    name: z.string(),
    email: z.string(),
    message: z.string(),
    hp_confirm: z.string().optional(),
  }),
  create: async (data, ctx) => {
    const form = new FormData();
    form.set("name", data.name);
    form.set("email", data.email);
    form.set("message", data.message);
    form.set("hp_confirm", data.hp_confirm ?? "");
    const ip = `autonoma-${ctx.testRunId}`;

    const result = await submitContact(null, form, ip);
    if (!result?.ok) {
      throw new Error(`submitContact rejected the seeded record: ${result?.error ?? "unknown error"}`);
    }
    return {
      id: `${ctx.testRunId}:${data.email}`,
      name: data.name,
      email: data.email,
      testRunId: data.testRunId,
      _rateLimitIp: ip,
    };
  },
  teardown: async (record) => {
    await clearRateLimit(record._rateLimitIp as string);
  },
});

export const factories = {
  Project,
  Post,
  Job,
  SkillGroup,
  ContactMessage,
};
