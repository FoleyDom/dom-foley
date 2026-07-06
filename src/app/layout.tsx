import type { Metadata, Viewport } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TooltipProvider } from "@/components/ui/tooltip";
import { site } from "@/lib/site";

const sans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const siteUrl = site.url;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dom Foley — Full-Stack Engineer",
    template: "%s · dom foley",
  },
  description:
    "Dom Foley — full-stack engineer building web products end to end: React/Next.js frontends, typed PHP/Laravel APIs, and the AWS/Docker infrastructure that runs them.",
  alternates: { canonical: "/", types: { "application/rss+xml": "/rss.xml" } },
  keywords: [
    "full-stack engineer",
    "PHP",
    "Laravel",
    "React",
    "TypeScript",
    "Next.js",
    "Node",
    "Docker",
    "Kubernetes",
    "AWS",
    "DevOps",
    "portfolio",
  ],
  authors: [{ name: "Dom Foley", url: siteUrl }],
  creator: "Dom Foley",
  publisher: "Dom Foley",
  applicationName: "dom foley",
  category: "technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Dom Foley — Full-Stack Engineer",
    description:
      "Full-stack engineer who ships, and keeps it running. Web products end to end — frontend, typed APIs, and the infrastructure that deploys them.",
    siteName: "dom foley",
    images: [{ url: "/brand/df-banner-linkedin.png", width: 1200, height: 627, alt: "dom foley" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@FoleyDom_",
    creator: "@FoleyDom_",
    title: "Dom Foley — Full-Stack Engineer",
    description:
      "Full-stack engineer who ships, and keeps it running. Web products end to end — frontend, typed APIs, and the infrastructure that deploys them.",
    images: ["/brand/df-banner-x.png"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0e14" },
  ],
};

// Sets the theme class before first paint to avoid a flash of the wrong theme.
// No stored preference → follow the OS ("system" is the default). Must run
// render-blocking and inline (next/script's beforeInteractive is NOT early
// enough — it runs via a client-injected tag, after first paint).
const themeScript = `(function(){try{var t=localStorage.getItem('df-theme');var d=t==='dark'||t==='light'?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Structured data helps search engines render a rich Person/site result.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: "Dom Foley",
        url: siteUrl,
        jobTitle: "Full-stack engineer",
        email: `mailto:${site.email}`,
        sameAs: [site.socials.github, site.socials.linkedin, site.socials.x],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "dom foley",
        description:
          "Portfolio of Dom Foley — full-stack engineer who ships and keeps it running. React/Next.js frontends, typed APIs, and the CI/CD + infrastructure that deploys them.",
        publisher: { "@id": `${siteUrl}/#person` },
      },
    ],
  };

  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${sans.variable} ${serif.variable} ${mono.variable} h-full`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <TooltipProvider delayDuration={200}>
          <SiteHeader />
          <main className="flex-1 w-full">{children}</main>
          <SiteFooter />
        </TooltipProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
