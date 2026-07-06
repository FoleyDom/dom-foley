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
            value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.resend.com",
          },
          // Disable client-side caching for sensitive pages (optional, apply selectively)
          // Uncomment for sensitive routes: { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, proxy-revalidate" }
        ],
      },
      // Stricter policy for API routes (optional)
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
