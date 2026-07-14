"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/actions/contact";

const inputClass =
  "rounded-[9px] border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent-line";

export function ContactForm() {
  const [state, formAction, pending] = useActionState<ContactState, FormData>(submitContact, null);

  if (state?.ok) {
    return (
      <div
        role="status"
        className="flex flex-col justify-center gap-2 rounded-[9px] border border-accent-line bg-accent-soft px-5 py-8 text-center"
      >
        <span className="font-mono text-sm text-accent-ink">→ message sent</span>
        <p className="m-0 text-sm text-muted-foreground">
          Thanks for reaching out — I usually reply within a day.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <input name="name" type="text" autoComplete="name" placeholder="const name;" required className={inputClass} />
        <input name="email" autoComplete="email" type="email" placeholder="const email;" required className={inputClass} />
      </div>
      <textarea
        name="message"
        placeholder="let message = 'what're you working on?';"
        rows={4}
        required
        className={`${inputClass} resize-y`}
      />

      {/* honeypot — hidden from humans, catches bots. Name avoids "website"/"url"
          since some browsers autofill those from saved data despite autoComplete="off". */}
      <input
        type="text"
        name="hp_confirm"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute h-0 w-0 overflow-hidden opacity-0"
      />

      {state?.error && (
        <p className="m-0 text-[13px] text-[#c0392b] dark:text-[#ff8a80]">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="group relative self-start overflow-hidden rounded-[9px] bg-primary px-5.5 py-2.5 text-[14.5px] font-semibold text-white transition-transform duration-200 ease-out hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-60"
      >
        <span className="relative z-10">{pending ? "sending…" : "send message"}</span>
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-500 ease-out group-hover:translate-x-full" />
      </button>
    </form>
  );
}
