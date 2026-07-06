/** Header brand mark — the terminal-prompt "~/df_" monogram, per the mockup. */
export function BrandMark() {
  return (
    <span
      aria-label="dom foley"
      className="flex h-6.5 items-center rounded-lg px-2 font-mono text-[13px] font-semibold tracking-[0.02em] text-white"
      style={{
        background:
          "linear-gradient(135deg,var(--primary),color-mix(in oklch, var(--primary) 70%, #2a1a66))",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,.28),inset 0 0 0 1px rgba(255,255,255,.08),0 2px 6px -1px rgba(60,30,160,.4)",
      }}
    >
      <span className="mr-0.5 font-normal opacity-55">~/</span>
      df
      <span className="animate-[blink_1.1s_steps(1)_infinite]">_</span>
    </span>
  );
}
