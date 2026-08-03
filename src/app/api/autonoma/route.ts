import { createHandler } from "@autonoma-ai/server-web";
import { factories } from "./factories";

//? Autonoma Environment Factory endpoint — see AGENTS.md "Autonoma test data".
//? This app has no tenant/organization model, so testRunId (present on every
//? factory's input schema, see factories.ts) doubles as the scopeField.
//?
//? Not gated to non-production: HMAC signing (sharedSecret) is the access
//? control — unsigned requests get 401 — and Autonoma's own end-to-end tests run
//? against real deployments (including Vercel preview builds, which Next.js also
//? builds with NODE_ENV=production), so gating on NODE_ENV would block exactly
//? the environments this exists to test.
export const POST = createHandler({
  scopeField: "testRunId",
  sharedSecret: process.env.AUTONOMA_SHARED_SECRET!,
  signingSecret: process.env.AUTONOMA_SIGNING_SECRET!,
  factories,
  //? No auth system exists on this site — visitors are always anonymous, and
  //? there is no User factory, so `user` is always null. An empty result is the
  //? honest representation of that, not a placeholder.
  auth: async () => ({}),
});
