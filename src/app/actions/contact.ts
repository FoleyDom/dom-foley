"use server";

import { headers } from "next/headers";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { site } from "@/lib/site";

export type ContactState = { ok: boolean; error?: string } | null;

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Rate limiting is optional — without UPSTASH_REDIS_REST_URL/TOKEN configured
// (e.g. in local dev) the form just skips the check rather than failing.
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "10 m"),
      prefix: "contact-form",
    })
  : null;

/**
 * Contact form handler. Delivers via the Resend HTTP API (no SDK dependency).
 * Configure with env vars — see .env.example:
 *   RESEND_API_KEY               (required to actually send)
 *   CONTACT_FROM                 (defaults to Resend's shared test sender)
 *   CONTACT_TO                   (comma-separated; defaults to site.contactRecipients)
 *   UPSTASH_REDIS_REST_URL/TOKEN (optional; enables rate limiting)
 */
export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "")
    .trim()
    .replace(/[\x00-\x1f\x7f]/g, "")
    .slice(0, 100);
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const honeypot = String(formData.get("hp_confirm") ?? "").trim();

  // Bots fill the hidden field — pretend success and drop it.
  if (honeypot) return { ok: true };

  // Validate before spending a rate-limit slot, so garbage submissions from a
  // shared IP (office, school, VPN egress) can't lock out real visitors on it.
  if (!name || !email || !message) return { ok: false, error: "Please fill in every field." };
  if (!isEmail(email)) return { ok: false, error: "That email doesn't look right." };
  if (message.length > 5000) return { ok: false, error: "That message is a little too long." };

  if (ratelimit) {
    const hdrs = await headers();
    // Trustworthy as-is on Vercel, which overwrites client-supplied
    // X-Forwarded-For rather than forwarding it — see Vercel's request-header
    // docs. Re-check this ordering if this ever moves off Vercel.
    const ip =
      hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      hdrs.get("cf-connecting-ip") ||
      "unknown";
    try {
      const { success } = await ratelimit.limit(ip);
      if (!success) {
        return { ok: false, error: "Too many messages sent recently — try again in a bit." };
      }
    } catch (err) {
      // Fail open — an Upstash hiccup shouldn't block a real submission.
      console.error("Rate limit check failed", err);
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return {
      ok: false,
      error: "Email delivery isn't wired up yet — email me directly: df@domfoley.com",
    };
  }

  const to =
    process.env.CONTACT_TO?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) ?? [...site.contactRecipients];
  const from = process.env.CONTACT_FROM ?? "dom foley <df@domfoley.com>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: email,
        subject: `Portfolio contact from ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("Resend error", res.status, detail);
      return { ok: false, error: "Something went wrong sending that — email df@domfoley.com instead?" };
    }
    return { ok: true };
  } catch (err) {
    console.error("Contact submit failed", err);
    return { ok: false, error: "Couldn't reach the mail service. Try again, or email df@domfoley.com." };
  }
}
