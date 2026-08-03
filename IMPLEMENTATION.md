# Autonoma integration — implementation checklist

## Context that shapes every decision below

This app has **no database**. `Project`, `Post`, `Experience`, and `Skill` are
`const` arrays compiled into the JS bundle (`src/lib/projects.ts`, `src/lib/posts.ts`,
`src/lib/about.ts`). There is no data layer, no ORM, no creation function beyond the
literal array — editing them requires a source change and a rebuild, not a runtime
call. `ContactSubmission` is the only entity with a real runtime creation path
(`submitContact` in `src/app/actions/contact.ts`), and it has no persistence at all:
it sends a real email via Resend and checks an Upstash rate limit; there is no row to
read back.

The Autonoma SDK's `scopeField` also assumes a tenant FK (`organizationId` etc). This
app has none — the SDK docs' own guidance for non-multi-tenant apps is to add a
dedicated `testRunId` field to every model and use that as `scopeField`. Done below.

## Checklist

- [x] Branch `autonoma-integration` cut from `origin/main` (developer's untracked
      `.claude/`, `.semgrepignore`, `README.md` left alone).
- [x] Installed `@autonoma-ai/sdk`, `@autonoma-ai/server-web`, `zod`.
- [x] Generated `AUTONOMA_SIGNING_SECRET` (distinct from the pre-provisioned
      `AUTONOMA_SHARED_SECRET`), added to `.env.local` (not committed) and placeholders
      to `.env.example` (committed).
- [x] Endpoint: `POST /api/autonoma` (`src/app/api/autonoma/route.ts`) via
      `createHandler` from `@autonoma-ai/server-web`. `scopeField: "testRunId"`.
- [x] Factory: **Project** — no real creation path exists (static array). Factory
      resolves the recipe's `slug` against the real `projects` array
      (`getProject`) and returns that record; does not fabricate new projects.
      Teardown is a documented no-op (nothing was created).
- [x] Factory: **Post** — same pattern against `posts`/`getPost`.
- [x] Factory: **Experience** — same pattern, matched by `co` (company) against
      `jobs`. Note: the app currently has only **one** real Experience row
      (Best Cigar Prices); scenarios.md assumed three. The other two do not exist in
      the app's source of truth, so they are not fabricated — see note below.
- [x] Factory: **Skill** — same pattern, matched by `label` against `skillGroups`.
- [x] Factory: **ContactSubmission** — the one entity with a real creation path.
      Calls the real `submitContact` server action (validation, honeypot check,
      Upstash rate limit, Resend send) so its actual side effects run. Teardown
      best-effort deletes the Upstash rate-limit keys for that run's synthetic
      identifier. See "ContactSubmission specifics" below.
- [x] Teardown scoping: no tenant to scope by (see scopeField note above); each
      entity's teardown is either a no-op (static data, nothing created) or scoped by
      the per-run synthetic identifier (ContactSubmission's rate-limit key).
- [x] Auth callback: app has no authentication system and no `User` model/factory —
      `user` is always `null`. Returns `{}` (anonymous visitor), which is the honest
      representation of "no login exists," not a placeholder token.
- [x] Maintenance note appended to `AGENTS.md` (created at repo root — none existed).
- [x] `recipe.json` generated at `/Users/domfoley/.autonoma/dom-foley/recipe.json`.
- [x] Entity-by-entity validation (up → check → down → check) — see "Validation
      notes" below for what "DB" means here. All five entities passed.
- [x] Full-recipe pass — all 16 records across 5 entities created in one `up`,
      confirmed, torn down, confirmed gone.
- [x] Two-concurrent-instances proof — both `concurrent-a` and `concurrent-b`
      succeeded while overlapping; tearing down `a` left `b`'s data untouched;
      tearing down `b` left nothing behind. See "Validation notes" for what this
      caught.
- [x] Committed (unsigned — see note below), pushed, PR opened.

**Signing note**: this repo has `commit.gpgsign=true` (SSH format,
`~/.ssh/github_signing_key`), but the key wasn't loaded in `ssh-agent`
(`ssh-add -l` → "The agent has no identities"), so a signed commit would block on
a passphrase prompt with no way to supply one non-interactively. Asked the
developer how to proceed; they chose to commit this one unsigned
(`--no-gpg-sign`) rather than have me bypass it silently. Re-sign or amend later
if you'd like this commit signed.

## Validation notes

- **What "query the database" became**: there is no database, so validation used
  three substitutes instead: (1) the `up` response's `refs`, which shows exactly
  what each factory resolved and returned; (2) fetching the real rendered pages —
  `/about` genuinely renders the seeded `Experience`/`Skill` content (confirmed by
  grepping the response HTML for "Best Cigar Prices", "Laravel", "infra & devops");
  (3) for `ContactSubmission`, reading the actual Upstash rate-limit keys directly
  via the REST API before/after `up`/`down` — this is the one entity with a real,
  inspectable side effect.
- **`/work` and `/writing` are not live yet** — both the list pages and their
  `[slug]` detail routes currently show "coming soon" or redirect back
  unconditionally (confirmed via `curl`, matching what `AUTONOMA.md` already
  documented). So `Project` and `Post` content has no live page to check against
  right now; validation for those two relies on the `up` response's `refs` matching
  the real static records exactly (slug, name, all fields) — confirmed for
  `shipwright`, `pgpulse`, `relay-notes`, `cratecheck`, `homelab-iac`,
  `preview-environments-on-a-budget`, `server-components-nextjs-structure`,
  `what-full-stack-should-mean`, `postgres-is-your-job-queue`.
- **A real integration bug the concurrency proof would have caught**: `proxy.ts`
  middleware rejects any `/api/*` request with no `Origin` header (a bot/curl
  defense) — that would have 401'd every Autonoma request, including the CLI's.
  Fixed by exempting `/api/autonoma` specifically (it already authenticates via
  HMAC, which is a stronger check than an Origin header). Caught during the very
  first `discover` smoke test, before any factory code ran.
- **A second real bug the concurrency proof caught**: the first version of the
  `ContactSubmission` factory called `submitContact` without the `overrideIp`
  fallback wired through — both `concurrent-a` and `concurrent-b`'s "Alice Smith"
  submission would have shared the rate-limit bucket keyed by `x-forwarded-for`
  (both requests come from the same loopback caller with no forwarded-for header,
  i.e. `"unknown"`), so run B's submission would have been spuriously rate-limited
  by run A's. Fixed by threading `autonoma-<testRunId>` through as the identifier
  (deviation #4 above). Verified directly: both runs' Upstash keys
  (`contact-form:autonoma-concurrent-a:*` / `...-b:*`) existed simultaneously and
  distinctly, and each `down` removed only its own run's key.
- **`AUTONOMA_SHARED_SECRET` in `.env.local` was stale** — it didn't match the value
  actually provisioned in this environment (found by comparing against the shell's
  exported `AUTONOMA_SHARED_SECRET`, which is what the CLI and the real platform
  use). Corrected in `.env.local`.
- Wrong-signature rejection confirmed directly: a request signed with a bogus
  secret gets `{"error":"Invalid HMAC signature","code":"INVALID_SIGNATURE"}`.
- The `up` response's `auth` field is `{}` on every run (no `User` model, no login
  system) — confirmed on both the full-recipe run and both concurrent runs.

## Deviations from the spec, and why

1. **"Query the DATABASE directly" is not possible — there is no database.** The
   substitute used throughout validation: `fetch` the rendered `/`, `/work`,
   `/work/[slug]`, `/writing`, `/about` HTML and assert the expected content appears
   (or, for teardown, no longer appears where applicable). For the static entities
   nothing ever needs to stop appearing, since nothing was created.
2. **No unique-constraint enumeration for Project/Post/Experience/Skill** — there is
   no schema and no DB, so there are no unique constraints to enumerate or to defend
   with a `{{testRunId}}` token. Recipe records for these four entities use the real,
   permanent slugs/labels already in the source files; no token is needed because
   nothing is written.
3. **Experience has only 1 real row, not 3.** `scenarios.md` describes three jobs
   (Best Cigar Prices, TechFlow Systems, Creative Code Agency) but
   `src/lib/about.ts`'s `jobs` array currently has only the first. The other two are
   not real app data, so the recipe seeds only the one that exists.
4. **`submitContact` gained an optional third parameter (`overrideIp`)** — used only
   by the `ContactSubmission` factory to give each test run its own rate-limit
   identifier (`autonoma-<testRunId>`) instead of sharing the real
   `x-forwarded-for`-derived IP across concurrent runs (which would make the second
   concurrent run's 3rd+ submission spuriously rate-limited, or interfere with a real
   visitor from the same office/VPN egress). Real traffic is unaffected — the
   parameter defaults to the existing header-based extraction.
5. **`ContactSubmission`'s "Alice Smith" record sends a real email through the live
   Resend key.** That is the actual side effect being tested, not a bug — but during
   my own validation runs I started the dev server with
   `CONTACT_TO=delivered@resend.dev` (Resend's non-delivering test sink) to avoid
   spamming the developer's real inboxes across the many `up` calls the validation
   loop requires. Production/staging deployments will send real email per submission,
   exactly as the live site does today. The "Recruiter Bot" record (honeypot filled)
   short-circuits before any send or rate-limit check, so it is always safe to run.
