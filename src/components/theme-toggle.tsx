"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Sun, Moon } from "lucide-react";

const STORAGE_KEY = "df-theme";

/** Subscribe to `.dark` class changes on <html> so the icon stays in sync. */
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  // Matches the pre-paint script's SSR default (light) so hydration is stable.
  return false;
}

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // While the user hasn't picked a theme, keep following the OS live. Toggling
  // the class here is picked up by the MutationObserver above, which updates the icon.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    function onSystemChange(e: MediaQueryListEvent) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored !== "dark" && stored !== "light") {
        document.documentElement.classList.toggle("dark", e.matches);
      }
    }
    mq.addEventListener("change", onSystemChange);
    return () => mq.removeEventListener("change", onSystemChange);
  }, []);

  function toggle() {
    const next = !document.documentElement.classList.contains("dark");
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      title="Toggle theme"
      aria-label="Toggle theme"
      className="grid h-8.5 w-8.5 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition-colors duration-200 ease-out hover:border-accent-line hover:text-foreground"
    >
      {dark ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
    </button>
  );
}
