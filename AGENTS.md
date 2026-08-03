# AGENTS.md

## Autonoma test data

`POST /api/autonoma` (`src/app/api/autonoma/route.ts`) is the Autonoma Environment
Factory endpoint — it seeds and tears down realistic test data for Autonoma's
end-to-end tests, through this app's own creation paths (not raw writes), via
factories in `src/app/api/autonoma/factories.ts`. Every request is HMAC-verified
against `AUTONOMA_SHARED_SECRET`; there's no other auth in front of it.

If you add or change a model, or the code that creates one, update the matching
factory in `factories.ts`. Four of the five factories (`Project`, `Post`,
`Experience`, `Skill`) resolve against the static arrays in `src/lib/*.ts` rather
than creating anything — there's no database, so if you add a new static entry
worth seeding for a scenario, add it there too. `ContactSubmission` is the one
factory with a real side effect (it calls `submitContact`); if that action's
signature or behavior changes, keep the factory in sync. See `IMPLEMENTATION.md`
for the full reasoning behind these choices.
