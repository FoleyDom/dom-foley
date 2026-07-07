import Image from "next/image";

/**
 * The hero brand tile — the real df logo PNG, gently floating, framed by a
 * slowly rotating dashed ring and an orbiting dot for a sense of life.
 */
export function HeroTile() {
  return (
    <div className="mx-auto w-full max-w-44 md:mx-0 md:max-w-70">
      <div
        className="relative aspect-square animate-[float_6s_ease-in-out_infinite]"
        style={{ filter: "drop-shadow(0 16px 40px rgba(109,74,255,.35))" }}
      >
        {/* the actual logo image */}
        <Image
          priority
          src="/brand/df-logo-512.png"
          alt="dom foley — ~/df logo"
          loading="eager"
          fill
          unoptimized
          sizes="(max-width: 768px) 176px, 280px"
          className="rounded-[24px]"
        />

        {/* rotating dashed ring framing the logo */}
        <span className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="h-[116%] w-[116%] animate-[spin_60s_linear_infinite] rounded-full border border-dashed border-white/30" />
        </span>

        {/* orbiting dot riding the outer ring */}
        <span className="pointer-events-none absolute inset-0 grid place-items-center">
          <span className="relative h-[116%] w-[116%] animate-[spin_24s_linear_infinite]">
            <span
              className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
              style={{ boxShadow: "0 0 10px 2px rgba(255, 255, 255, 0.6)" }}
            />
          </span>
        </span>
      </div>
    </div>
  );
}
