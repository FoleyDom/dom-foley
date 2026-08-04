# Autonoma integration — implementation checklist

## Context that shapes every decision below

This app has **no database**. `Project`, `Post`, `Job`, and `SkillGroup` are `const`
arrays compiled into the JS bundle (`src/lib/projects.ts`, `src/lib/posts.ts`,
`src/lib/about.ts`). There is no data layer, no ORM, no creation function beyond the
literal array — editing them requires a source change and a rebuild, not a runtime
call. `ContactMessage` is the only entity with a real runtime creation path
(`submitContact` in `src/app/actions/contact.ts`), and it has no persistence at all:
it sends a real email via Resend and checks an Upstash rate limit; there is no row to
read back.

The Autonoma SDK's `scopeField` also assumes a tenant FK (`organizationId` etc). This
app has none — the SDK docs' own guidance for non-multi-tenant apps is to add a
dedicated `testRunId` field to every model and use that as `scopeField`. Done below.

This checklist reflects the entity names from the current `entity-audit.md`
(`Project`, `Post`, `Job`, `SkillGroup`, `ContactMessage`) — an earlier session used
slightly different names (`Experience`, `Skill`, `ContactSubmission`) for the same
concepts; this session renamed the factory exports to match, since the SDK routes
`create` payload entries by the exact key in the `factories` registry object
(confirmed by reading the compiled SDK's `handleUp`).

## Checklist

- [x] Branch `autonoma-integration` — already existed from a prior session (with PR
      #7 already open against `main`), so this session continued on it rather than
      cutting a second branch, per the spec's explicit guidance for that case.
- [x] `@autonoma-ai/sdk`, `@autonoma-ai/server-web`, `zod` already installed
      (`pnpm install --frozen-lockfile` confirmed up to date).
- [x] `AUTONOMA_SIGNING_SECRET` / `AUTONOMA_SHARED_SECRET` present in `.env.local`.
      `AUTONOMA_SHARED_SECRET` there was stale — didn't match the canonical value
      exported in this shell's environment (what the CLI and platform actually sign
      with) — corrected this session.
- [x] Endpoint: `POST /api/autonoma` (`src/app/api/autonoma/route.ts`) via
      `createHandler` from `@autonoma-ai/server-web`. `scopeField: "testRunId"`.
- [x] Factory: **Project** — no real creation path exists (static array). Factory
      resolves the recipe's `slug` against the real `projects` array (`getProject`)
      and returns that record; does not fabricate new projects. Teardown is a
      documented no-op (nothing was created).
- [x] Factory: **Post** — same pattern against `posts`/`getPost`.
- [x] Factory: **Job** — same pattern, matched by `co` (company) against `jobs`.
      Note: the app currently has only **one** real Job row (Best Cigar Prices);
      `scenarios.md` describes three. The other two do not exist in the app's source
      of truth, so they are not fabricated — see deviations below.
- [x] Factory: **SkillGroup** — same pattern, matched by `label` against
      `skillGroups`.
- [x] Factory: **ContactMessage** — the one entity with a real creation path. Calls
      the real `submitContact` server action (validation, honeypot check, Upstash
      rate limit, Resend send) so its actual side effects run. Teardown best-effort
      deletes the Upstash rate-limit keys for that run's synthetic identifier.
- [x] Teardown scoping: no tenant to scope by (see scopeField note above); each
      entity's teardown is either a no-op (static data, nothing created) or scoped by
      the per-run synthetic identifier (`ContactMessage`'s rate-limit key,
      `autonoma-<testRunId>`).
- [x] Auth callback: app has no authentication system and no `User` model/factory —
      `user` is always `null`. Returns `{}` (anonymous visitor), which is the honest
      representation of "no login exists," not a placeholder token. Confirmed `{}` on
      every `up` response this session (entity-by-entity, full-recipe, both
      concurrent runs).
- [x] Maintenance note in `AGENTS.md` — updated this session to the current entity
      names.
- [x] `recipe.json` generated at `/Users/domfoley/.autonoma/dom-foley/recipe.json`
      from the current `scenarios.md`.
- [x] Entity-by-entity validation (up → check → down → check) via the
      `autonoma-planner sdk` CLI — all five entities passed. See "Validation notes."
- [x] Full-recipe pass — all 16 records across 5 entities created in one `up`
      (`--test-run-id full-recipe`), confirmed via the response `refs`, torn down,
      confirmed gone (Upstash key removed).
- [x] Wrong-signature rejection confirmed directly (bad HMAC and no signature both
      get `401 INVALID_SIGNATURE`).
- [x] Two-concurrent-instances proof — `concurrent-a` and `concurrent-b` both
      succeeded while overlapping (`b` brought up before `a` was torn down);
      distinct Upstash keys existed simultaneously; tearing down `a` left `b`'s key
      untouched; tearing down `b` left nothing behind.
- [x] Committed (unsigned — see note below), pushed to `origin/autonoma-integration`
      — PR #7 (already open) picks up the commit.

**Signing note**: this repo has `commit.gpgsign=true` (SSH format), but the key
wasn't loaded in `ssh-agent` (`ssh-add -l` → "The agent has no identities"), so a
signed commit blocks indefinitely on a passphrase prompt with no way to supply one
non-interactively. Asked the developer how to proceed (same blocker a prior session
hit and resolved the same way); they chose `--no-gpg-sign` for this commit rather
than have it bypassed silently. Re-sign or amend later if you'd like it signed.

## Validation notes

- **What "query the database" became**: there is no database, so validation used
  three substitutes instead: (1) the `up` response's `refs`, which shows exactly
  what each factory resolved and returned; (2) fetching the real rendered `/about`
  page — it genuinely renders the seeded `Job`/`SkillGroup` content (confirmed by
  grepping the response HTML for "Best Cigar Prices" and "infra & devops"); (3) for
  `ContactMessage`, reading the actual Upstash rate-limit keys directly via the REST
  API before/after `up`/`down` — this is the one entity with a real, inspectable
  side effect.
- **`/work` and `/writing` are not live yet** — both the list pages and their
  `[slug]` detail routes currently show "coming soon" or redirect back
  unconditionally (confirmed by reading `src/app/work/page.tsx`,
  `src/app/writing/page.tsx`, and their `[slug]` routes). So `Project` and `Post`
  content has no live page to check against right now; validation for those two
  relies on the `up` response's `refs` matching the real static records exactly
  (slug, name, all fields) — confirmed for all 5 seeded projects and all 3 seeded
  posts.
- **The SDK does not auto-inject `scopeField` into each record.** Reading the
  compiled `@autonoma-ai/sdk`'s `handleUp` showed every record is parsed directly
  against `factory.inputSchema` after token resolution — `testRunId` has to be an
  explicit field on every recipe record (`"testRunId": "{{testRunId}}"`), not
  something the SDK adds for you. The first `up` attempt failed with
  `testRunId: Invalid input: expected string, received undefined` until this was
  added to every record in `recipe.json`.
- Wrong-signature rejection confirmed directly: both a bad HMAC and a missing
  signature get `{"error":"Invalid HMAC signature","code":"INVALID_SIGNATURE"}`.
- The `up` response's `auth` field is `{}` on every run (no `User` model, no login
  system) — confirmed on the full-recipe run and both concurrent runs.
- Concurrency proof specifics: `ContactMessage.email` is tokenized with
  `{{testRunId}}` and the factory's rate-limit identifier is
  `autonoma-<testRunId>`, so `concurrent-a` and `concurrent-b` never contended for
  the same Upstash bucket — verified both keys
  (`contact-form:autonoma-concurrent-a:*` / `...-b:*`) existed simultaneously, and
  each `down` removed only its own run's key.
- Validation runs used `CONTACT_TO=delivered@resend.dev` (Resend's non-delivering
  test sink) as a local dev-server environment override, to avoid sending real email
  to the developer's inbox across the many `up` calls this validation loop requires.
  This was not committed — it's a runtime override, not a `.env.local` change.
  Production/staging deployments send real email per submission, exactly as the live
  site does today.

## Deviations from the spec, and why

1. **"Query the DATABASE directly" is not possible — there is no database.** The
   substitutes used throughout validation are listed above (response `refs`,
   rendered `/about` HTML, direct Upstash reads).
2. **No unique-constraint enumeration for Project/Post/Job/SkillGroup** — there is no
   schema and no DB, so there are no unique constraints to enumerate or to defend
   with a `{{testRunId}}` token. Recipe records for these four entities use the real,
   permanent slugs/labels already in the source files (untokenized) — a token in the
   lookup key would make the factory fail to resolve, since these factories match
   against fixed content rather than writing new rows.
3. **Job has only 1 real row, not 3.** `scenarios.md` describes three jobs (Best
   Cigar Prices, Ferrostat, Startup Inc) but `src/lib/about.ts`'s `jobs` array
   currently has only the first. The other two are not real app data, and there is
   no creation path to fabricate them (no DB, and `/about` is statically rendered
   from this array at build time — a runtime mutation wouldn't even be visible), so
   the recipe seeds only the one that exists.
4. **`submitContact` has an optional third parameter (`overrideIp`)**, added by a
   prior session — used only by the `ContactMessage` factory to give each test run
   its own rate-limit identifier (`autonoma-<testRunId>`) instead of sharing the real
   `x-forwarded-for`-derived IP across concurrent runs. Real traffic is unaffected —
   the parameter defaults to the existing header-based extraction.
5. **`ContactMessage`'s two records send real email through the live Resend key.**
   That is the actual side effect being tested, not a bug — see the `CONTACT_TO`
   override note above for how validation avoided spamming the real inbox.
