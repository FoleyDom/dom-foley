# dom foley — portfolio site

Personal site and portfolio for Dom Foley, full-stack engineer & devops expert. Built with Next.js (App Router), React 19, TypeScript, and Tailwind CSS. Live at [domfoley.com](https://domfoley.com).

## Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 4, shadcn/ui + Radix primitives, `cmdk` command palette
- **Infra:** Vercel (Analytics + Speed Insights), Upstash Redis (rate limiting), Resend (contact form email)
- **Package manager:** pnpm (a `bun.lock` is also present, but pnpm is canonical — see `pnpm-workspace.yaml`)

## Getting started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.example` to `.env.local` and fill in the values you need:

- `RESEND_API_KEY`, `CONTACT_FROM`, `CONTACT_TO` — contact form email delivery via Resend
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` — optional; contact form rate limiting (skipped in local dev if unset)
- `AUTONOMA_SHARED_SECRET`, `AUTONOMA_SIGNING_SECRET` — auth for the `/api/autonoma` test-data endpoint (see below)

## Scripts

| Command       | Description                |
| ------------- | -------------------------- |
| `pnpm dev`    | Start the dev server       |
| `pnpm build`  | Production build           |
| `pnpm start`  | Run the production build   |
| `pnpm lint`   | Lint with ESLint           |

## Project structure

```
src/
  app/            Routes (App Router): home, /work, /writing, /about, /api
  app/actions/    Server actions (e.g. contact form submission)
  app/api/        Route handlers, incl. the Autonoma test-data endpoint
  components/     UI components (site chrome + shadcn/ui primitives)
  lib/            Site config, static content (projects, posts, about), utils
```

Site-wide config (nav items, socials, contact recipients, core stack, etc.) lives in `src/lib/site.ts`. Projects, posts, and experience data are static arrays in `src/lib/*.ts` — there's no database.

## Autonoma test-data endpoint

`POST /api/autonoma` seeds and tears down realistic test data for Autonoma's end-to-end tests, through the app's own creation paths (not raw writes), via factories in `src/app/api/autonoma/factories.ts`. Every request is HMAC-verified against `AUTONOMA_SHARED_SECRET`. If you add or change a model (or the code that creates one), update the matching factory — see `AGENTS.md` and `IMPLEMENTATION.md` for details.

## CI/CD

`.github/workflows/secure-deploy.yml` runs Gitleaks (secret scanning) and Semgrep (SAST) on every push to `main`, then handles PR/auto-merge to staging. Dependabot is configured via `.github/dependabot.yml`.

## Deployment

Deployed on [Vercel](https://vercel.com). Pushing to `main` triggers the security scan and deploy workflow above.
