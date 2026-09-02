import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "@/components/code-block";

//* one gap value (from the article's flex container) governs spacing between
//* every block, headings included — so headings differentiate by size/weight
//* only, not by extra margin, keeping vertical rhythm uniform.
const textClass = "text-[16px] leading-[1.7] text-pretty text-foreground";
const h1Class = "m-0 text-[26px] font-semibold tracking-[-0.02em]";
const h2Class = "m-0 text-[22px] font-semibold tracking-[-0.015em]";
const h3Class = "m-0 text-[19px] font-semibold tracking-[-0.01em]";
const h4Class = "m-0 text-[17px] font-semibold";

const components: Components = {
  h1: ({ children }) => <h2 className={h1Class}>{children}</h2>,
  h2: ({ children }) => <h2 className={h2Class}>{children}</h2>,
  h3: ({ children }) => <h3 className={h3Class}>{children}</h3>,
  h4: ({ children }) => <h4 className={h4Class}>{children}</h4>,
  h5: ({ children }) => <h5 className={h4Class}>{children}</h5>,
  h6: ({ children }) => <h6 className={h4Class}>{children}</h6>,
  p: ({ children }) => <p className={`m-0 ${textClass}`}>{children}</p>,
  blockquote: ({ children }) => (
    <blockquote className="m-0 flex flex-col gap-3 border-l-2 border-accent-line pl-5 font-serif text-[19px] italic leading-normal text-pretty">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => <ul className={`m-0 flex list-disc flex-col gap-2 pl-5 ${textClass}`}>{children}</ul>,
  ol: ({ children }) => <ol className={`m-0 flex list-decimal flex-col gap-2 pl-5 ${textClass}`}>{children}</ol>,
  li: ({ children, className }) => {
    const isTask = className?.includes("task-list-item");
    return <li className={isTask ? "-ml-5 flex list-none items-start gap-2" : "pl-1"}>{children}</li>;
  },
  input: ({ checked }) => (
    // `disabled` makes browsers ignore author background/border/accent-color
    // and force the native gray "disabled control" rendering — readOnly +
    // pointer-events-none keeps it visually inert without losing styling.
    <input
      type="checkbox"
      checked={!!checked}
      readOnly
      tabIndex={-1}
      aria-disabled="true"
      className={`mt-1 size-4 shrink-0 rounded-sm border pointer-events-none ${
        checked ? "border-success bg-success accent-success" : "border-accent-line accent-accent-line"
      }`}
    />
  ),
  del: ({ children }) => <del className="text-muted-foreground line-through decoration-2">{children}</del>,
  a: ({ href, children }) => (
    <Link
      href={href ?? "#"}
      className="text-accent-ink underline decoration-accent-line underline-offset-2 hover:decoration-accent-ink"
    >
      {children}
    </Link>
  ),
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  img: ({ src, alt }) =>
    typeof src === "string" ? (
      // eslint-disable-next-line @next/next/no-img-element -- remote, author-controlled markdown source; not known to next/image at build time
      <img src={src} alt={alt ?? ""} loading="lazy" className="w-full rounded-xl" />
    ) : null,
  hr: () => <hr className="m-0 border-t border-accent-line" />,
  table: ({ children }) => (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full border-collapse text-[15px]">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="border-b border-border">{children}</thead>,
  tbody: ({ children }) => (
    <tbody className="[&>tr:not(:last-child)]:border-b [&>tr:not(:last-child)]:border-border">{children}</tbody>
  ),
  th: ({ children }) => <th className="px-3 py-2 text-left font-semibold">{children}</th>,
  td: ({ children }) => <td className="px-3 py-2 align-top">{children}</td>,
  pre: ({ children }) => <>{children}</>,
  code: ({ className, children }) => {
    const match = /language-([\w-]+)/.exec(className ?? "");
    if (match) {
      return <CodeBlock lang={match[1]} code={String(children).replace(/\n$/, "")} />;
    }
    return (
      <code className="rounded border border-border bg-code px-1.5 py-0.5 font-mono text-[0.9em] text-accent-ink">
        {children}
      </code>
    );
  },
};

export function PostBody({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {content}
    </ReactMarkdown>
  );
}
