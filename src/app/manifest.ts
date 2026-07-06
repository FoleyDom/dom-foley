import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dom Foley — Full-Stack Engineer",
    short_name: "dom foley",
    description: "Portfolio of Dom Foley — full-stack engineer (PHP/Laravel, React/TypeScript) who ships code and understands what it runs on.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f0e14",
    theme_color: "#6d4aff",
    icons: [
      { src: "/brand/df-logo-400.png", sizes: "400x400", type: "image/png" },
      { src: "/brand/df-logo-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
