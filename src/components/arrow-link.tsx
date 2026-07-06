import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/** A "label →" link with an animated underline and an arrow that slides on hover. */
export function ArrowLink({ className, children, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "group relative inline-flex w-fit items-center gap-1 text-sm font-medium text-accent-ink no-underline",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-1">
        →
      </span>
      <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-accent-ink transition-transform duration-200 ease-out group-hover:scale-x-100" />
    </Link>
  );
}
