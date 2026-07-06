import { site } from "@/lib/site";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const footerLinks = [
  { href: site.socials.github, label: "github", hint: "github.com/FoleyDom" },
  { href: site.socials.linkedin, label: "linkedin", hint: "linkedin.com/in/domfoley" },
  { href: site.socials.rss, label: "rss", hint: "subscribe to the feed" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-266 flex-wrap items-center gap-5 px-8 py-7 text-[13px] text-faint">
        <span>© {new Date().getFullYear()} dom foley</span>
        <span className="font-mono text-[12px]">
          Built with Next.js · Tailwind · shadcn/ui · Radix · Lucide · MDX
        </span>
        <span className="ml-auto flex gap-4">
          {footerLinks.map((link) => (
            <Tooltip key={link.href}>
              <TooltipTrigger asChild>
                <a
                  href={link.href}
                  className="text-faint no-underline transition-[color,text-shadow] duration-200 ease-out hover:text-accent-ink hover:[text-shadow:0_0_12px_var(--accent-line)]"
                >
                  {link.label}
                </a>
              </TooltipTrigger>
              <TooltipContent side="top">{link.hint}</TooltipContent>
            </Tooltip>
          ))}
        </span>
      </div>
    </footer>
  );
}
