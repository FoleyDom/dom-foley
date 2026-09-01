"use client";

import { usePathname, useRouter } from "next/navigation";
import { House, Briefcase, PenLine, User, Mail, type LucideIcon } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { navItems, site } from "@/lib/site";

export type SearchItem = { label: string; href: string; hint?: string; keywords?: string[] };

const PAGE_ICONS: Record<string, LucideIcon> = {
  "/": House,
  "/work": Briefcase,
  "/writings": PenLine,
  "/about": User,
};

const PAGE_KEYWORDS: Record<string, string[]> = {
  "/work": ["projects", "build in public", "learning", "open source"],
  "/writings": ["blog", "posts", "writing"],
  "/about": ["resume", "résumé"],
};

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // Pulled from the same navItems the header nav renders, so the palette
  // never drifts out of sync with what's actually in the header again.
  const pages: (SearchItem & { icon: LucideIcon })[] = [
    ...navItems.map((item) => ({
      label: item.label.replace(/\/$/, ""),
      href: item.href,
      hint: item.hint,
      icon: PAGE_ICONS[item.href] ?? House,
      keywords: PAGE_KEYWORDS[item.href],
    })),
    { label: "contact", href: "/#contact", hint: site.email, icon: Mail, keywords: ["email"] },
  ];

  function isCurrent(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  function go(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  function renderItem(item: SearchItem, Icon: LucideIcon) {
    const current = isCurrent(item.href);
    return (
      <CommandItem
        key={item.href}
        value={`${item.label} ${item.keywords?.join(" ") ?? ""}`}
        onSelect={() => go(item.href)}
        className="gap-3 py-2.5"
      >
        <Icon size={16} strokeWidth={2} className="shrink-0 text-accent-ink" />
        <span className={cn("truncate font-medium", current && "text-accent-ink")}>{item.label}</span>
        {current ? (
          <CommandShortcut className="tracking-normal text-accent-ink">current page</CommandShortcut>
        ) : (
          item.hint && <CommandShortcut className="tracking-normal text-faint">{item.hint}</CommandShortcut>
        )}
      </CommandItem>
    );
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} className="max-w-130">
      <CommandInput placeholder="Jump to…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="pages">
          {pages.map((item) => renderItem(item, item.icon))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
