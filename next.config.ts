import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          // HTTPS enforcement
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          // Clickjacking protection
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // MIME type sniffing prevention
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // XSS protection (legacy browsers)
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // Referrer information control
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Browser feature/capability restrictions
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=(), xr-spatial-tracking=()",
          },
          // Prevent cross-domain policy exploitation
          {
            key: "X-Permitted-Cross-Domain-Policies",
            value: "none",
          },
          // Enhanced Content Security Policy.
          // script-src/style-src allow 'unsafe-inline': Next.js App Router
          // streams hydration data through per-request inline
          // `<script>self.__next_f.push(...)</script>` tags (content differs
          // per page, so a static hash/nonce can't cover it without opting the
          // whole site into per-request dynamic rendering), and this codebase
          // uses inline `style={{...}}` extensively for CSS custom-property
          // values (hundreds of call sites — style-src has no nonce mechanism
          // at all, only 'unsafe-inline' or per-value hashes). Without this,
          // hydration fails silently in every browser (contact form, ⌘K
          // palette, and the theme toggle all stop responding to input) and
          // most inline-styled visuals (contribution graph, hero glow,
          // gradients, code blocks) don't render. Realistic risk here is low:
          // no user input is ever reflected unescaped into the page (the
          // contact form is a server action, not rendered back).
          {
            key: "Content-Security-Policy",
            // 'unsafe-eval' is added to script-src only in development: React's
            // dev-mode overlay uses eval() to reconstruct component stack
            // traces across module boundaries (Turbopack HMR). It's dev-only —
            // React never calls eval() in a production build — so prod stays
            // on the stricter policy without it.
            value: `default-src 'self'; img-src 'self' data: https:; media-src 'self' https:; font-src 'self' https: data:; connect-src 'self' https://vercel.live wss://ws-us3.pusher.com; script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""} https://vercel.live https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline' https://vercel.live; frame-src https://vercel.live; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`,
          },
          // Disable client-side caching for sensitive pages (optional, apply selectively)
          // Uncomment for sensitive routes: { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, proxy-revalidate" }
        ],
      },
      //* Stricter policy for API routes
      {
        source: "/api/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Cache-Control",
            value: "no-store",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
