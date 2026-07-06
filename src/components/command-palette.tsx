"use client";

import { useRouter } from "next/navigation";
import { House, User, Mail, type LucideIcon } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { site } from "@/lib/site";

export type SearchItem = { label: string; href: string; hint?: string; keywords?: string[] };

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();

  // work/ and writing/ are left out while those sections are still coming soon.
  const pages: (SearchItem & { icon: LucideIcon })[] = [
    { label: "home", href: "/", hint: "hero", icon: House },
    { label: "about / résumé", href: "/about", hint: "experience", icon: User, keywords: ["resume"] },
    { label: "contact", href: "/#contact", hint: site.email, icon: Mail, keywords: ["email"] },
  ];

  function go(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  function renderItem(item: SearchItem, Icon: LucideIcon) {
    return (
      <CommandItem
        key={item.href}
        value={`${item.label} ${item.keywords?.join(" ") ?? ""}`}
        onSelect={() => go(item.href)}
        className="gap-3 py-2.5"
      >
        <Icon size={16} strokeWidth={2} className="shrink-0 text-accent-ink" />
        <span className="truncate font-medium">{item.label}</span>
        {item.hint && <span className="ml-auto shrink-0 text-xs text-faint">{item.hint}</span>}
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
