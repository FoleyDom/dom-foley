const COMMENT_PREFIXES = ["#", "//", "--"];

function isComment(line: string) {
  const t = line.trimStart();
  return COMMENT_PREFIXES.some((p) => t.startsWith(p));
}

/**
 * The dark code panel from the mockup. Full syntax highlighting can be added
 * later (shiki / rehype-pretty-code); for now comment lines are dimmed so the
 * snippets keep their shape without a highlighter dependency.
 */
export function CodeBlock({ code }: { lang?: string; code: string }) {
  const lines = code.replace(/\n$/, "").split("\n");
  return (
    <pre
      className="overflow-auto rounded-xl border border-border px-5.5 py-5 font-mono text-[13px] leading-[1.7]"
      style={{ background: "var(--code-bg)", color: "#d6d2e8" }}
    >
      <code>
        {lines.map((line, i) => (
          <span key={i} style={isComment(line) ? { color: "#615a78" } : undefined}>
            {line || " "}
            {i < lines.length - 1 ? "\n" : ""}
          </span>
        ))}
      </code>
    </pre>
  );
}
