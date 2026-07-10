import { Mail, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

/**
 * The email address as a mailto: link — the mail icon morphs into a
 * paper plane and the address "types out" a blinking cursor on hover,
 * echoing the terminal-prompt motif used elsewhere on the site.
 */
export function EmailLink({ className }: { className?: string }) {
  return (
    <a
      href={`mailto:${site.email}`}
      className={cn(
        "group relative inline-flex w-fit items-center gap-1.5 font-mono text-faint no-underline transition-colors duration-200 ease-out hover:text-accent-ink",
        className,
      )}
    >
      <span className="relative inline-block h-3 w-3 shrink-0">
        <Mail className="absolute inset-0 h-3 w-3 scale-100 opacity-100 transition-all duration-200 ease-out group-hover:-translate-y-1 group-hover:scale-75 group-hover:opacity-0" />
        <Send className="absolute inset-0 h-3 w-3 -rotate-45 translate-y-1 scale-75 opacity-0 transition-all duration-200 ease-out group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100" />
      </span>
      <span className="relative">
        {site.email}
        <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent-ink transition-transform duration-200 ease-out group-hover:scale-x-100" />
      </span>
      <span className="w-0 animate-[blink_1.1s_steps(1)_infinite] overflow-hidden opacity-0 transition-opacity duration-150 ease-out group-hover:w-auto group-hover:opacity-100">
        _
      </span>
    </a>
  );
}
