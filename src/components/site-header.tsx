"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "@/lib/site";
import { BrandMark } from "@/components/brand-mark";
import { ThemeToggle } from "@/components/theme-toggle";
import { CommandPalette } from "@/components/command-palette";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function SiteHeader() {
  const pathname = usePathname();
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-[color-mix(in_srgb,var(--background)_82%,transparent)] backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-266 items-center gap-7 px-8">
        <Link href="/" className="mr-auto flex items-center gap-2.5 no-underline">
          <BrandMark />
          <span className="hidden text-[15px] font-semibold tracking-[-0.01em] min-[440px]:inline">
            dom foley
          </span>
        </Link>

        {navItems.map((item) => (
          <Tooltip key={item.href}>
            <TooltipTrigger asChild>
              <Link
                href={item.href}
                className={cn(
                  "group relative hidden font-mono text-[13px] font-medium transition-colors duration-200 ease-out hover:text-foreground md:inline-block",
                  isActive(item.href) ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {item.label}
                <span className="absolute inset-x-0 -bottom-1 h-px origin-left scale-x-0 bg-accent-ink transition-transform duration-200 ease-out group-hover:scale-x-100" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom">{item.hint}</TooltipContent>
          </Tooltip>
        ))}

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-label="Open command palette"
              className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[12.5px] text-muted-foreground transition-colors duration-200 ease-out hover:border-accent-line hover:text-foreground"
            >
              <Search size={15} strokeWidth={2} />
              <span className="rounded-[5px] border border-border bg-background px-1.5 py-px font-mono text-[11px]">
                ⌘K
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">search the site</TooltipContent>
        </Tooltip>

        <ThemeToggle />
      </nav>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </header>
  );
}
