"use client";

import { useEffect, useRef } from "react";
import type { ProjectVideo } from "@/lib/projects";

/**
 * A silent, looping screen recording. It loads nothing until it scrolls into
 * view, plays only while visible, and never autoplays for people who prefer
 * reduced motion (they get the poster plus the native play control).
 */
export function DemoVideo({ video }: { video: ProjectVideo }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Autoplay can still be refused (e.g. data saver); the controls remain.
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={video.src}
      poster={video.poster}
      aria-label={video.title}
      width={video.width}
      height={video.height}
      muted
      loop
      playsInline
      controls
      preload="none"
      className="block h-auto w-full rounded-[14px] border border-border bg-card"
    />
  );
}
