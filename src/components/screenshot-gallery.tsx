"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Dialog as DialogPrimitive } from "radix-ui";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import { DialogOverlay, DialogPortal } from "@/components/ui/dialog";
import type { ProjectImage } from "@/lib/projects";

const THUMB_HEIGHT = 300;
const SWIPE_PX = 50;
const LIGHTBOX_SIZES = "(min-width: 1232px) 1200px, 100vw";

const thumbWidth = (img: ProjectImage) => Math.round((THUMB_HEIGHT * img.width) / img.height);

/**
 * A sideways-scrolling strip of screenshots. Selecting one opens it full size
 * with its title and details; buttons, ← / → / Home / End, or a swipe step
 * through the set, and closing returns focus to the last one viewed.
 */
export function ScreenshotGallery({ images }: { images: ProjectImage[] }) {
  const total = images.length;
  const [isOpen, setIsOpen] = useState(false);
  // Kept after closing so the dialog can animate out with its content intact.
  const [index, setIndex] = useState(0);
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);
  const strip = useRef<HTMLDivElement>(null);
  const swipeStart = useRef<number | null>(null);
  const [edges, setEdges] = useState({ start: false, end: false });

  const go = useCallback((next: number) => setIndex(((next % total) + total) % total), [total]);

  // Fade whichever edge of the strip has more screenshots past it.
  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    const update = () =>
      setEdges({
        start: el.scrollLeft > 4,
        end: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
      });
    update();
    el.addEventListener("scroll", update, { passive: true });
    const resize = new ResizeObserver(update);
    resize.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      resize.disconnect();
    };
  }, []);

  const current = images[index];
  const neighbours = total > 1 ? [images[(index + 1) % total], images[(index - 1 + total) % total]] : [];

  const fade = [
    edges.start ? "transparent, black 40px" : "black",
    edges.end ? "black calc(100% - 40px), transparent" : "black",
  ].join(", ");

  return (
    <>
      <div
        ref={strip}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2"
        style={{ maskImage: `linear-gradient(to right, ${fade})` }}
      >
        {images.map((shot, i) => (
          <button
            key={shot.src}
            ref={(el) => {
              thumbs.current[i] = el;
            }}
            type="button"
            onClick={() => {
              setIndex(i);
              setIsOpen(true);
            }}
            aria-label={`Enlarge screenshot ${i + 1} of ${total}: ${shot.title ?? shot.alt}`}
            className="group relative shrink-0 cursor-zoom-in snap-start overflow-hidden rounded-[14px] border border-border p-0 transition-[border-color,transform] duration-150 hover:-translate-y-0.5 hover:border-accent-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-ink"
            style={{ width: thumbWidth(shot) }}
          >
            <Image
              src={shot.src}
              alt={shot.alt}
              width={shot.width}
              height={shot.height}
              sizes={`${thumbWidth(shot)}px`}
              className="block h-auto w-full"
            />
            {shot.title && (
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 to-transparent px-3 pt-7 pb-2.5 text-left text-[12.5px] font-medium text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100"
              >
                {shot.title}
              </span>
            )}
          </button>
        ))}
      </div>

      <DialogPrimitive.Root open={isOpen} onOpenChange={setIsOpen}>
        <DialogPortal>
          <DialogOverlay className="bg-black/80 supports-backdrop-filter:backdrop-blur-sm" />
          <DialogPrimitive.Content
            onCloseAutoFocus={(e) => {
              // Return to the screenshot last viewed, not the one first opened.
              const thumb = thumbs.current[index];
              if (!thumb) return;
              e.preventDefault();
              thumb.focus({ preventScroll: true });
              thumb.scrollIntoView({ inline: "center", block: "nearest" });
            }}
            onKeyDown={(e) => {
              const keys: Record<string, number> = {
                ArrowRight: index + 1,
                ArrowLeft: index - 1,
                Home: 0,
                End: total - 1,
              };
              if (e.key in keys && total > 1) {
                e.preventDefault();
                go(keys[e.key]);
              }
            }}
            className="fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[min(1200px,calc(100%-2rem))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-border bg-card outline-none duration-150 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
          >
            {/* First in the DOM so it receives focus on open and sits first in tab order. */}
            <DialogPrimitive.Close
              aria-label="Close"
              className="absolute top-3 right-3 z-10 grid size-11 place-items-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-white"
            >
              <XIcon className="size-5" />
            </DialogPrimitive.Close>

            <div
              className="relative flex h-[min(calc(100dvh-12rem),760px)] touch-pan-y items-center justify-center bg-black/40 px-3 py-14 sm:px-16 sm:py-4"
              onPointerDown={(e) => {
                swipeStart.current = e.clientX;
              }}
              onPointerUp={(e) => {
                if (swipeStart.current === null || total < 2) return;
                const dx = e.clientX - swipeStart.current;
                swipeStart.current = null;
                if (Math.abs(dx) >= SWIPE_PX) go(index + (dx < 0 ? 1 : -1));
              }}
              onPointerCancel={() => {
                swipeStart.current = null;
              }}
            >
              <Image
                key={current.src}
                src={current.src}
                alt={current.alt}
                width={current.width}
                height={current.height}
                sizes={LIGHTBOX_SIZES}
                draggable={false}
                className="block h-full w-auto max-w-full rounded-md object-contain ring-1 ring-white/10 select-none"
              />
              {/* Warm the cache for the neighbours so stepping doesn't flash. */}
              {isOpen &&
                neighbours.map((n) => (
                  <Image
                    key={`pre-${n.src}`}
                    src={n.src}
                    alt=""
                    aria-hidden
                    width={n.width}
                    height={n.height}
                    sizes={LIGHTBOX_SIZES}
                    loading="eager"
                    className="hidden"
                  />
                ))}
              {total > 1 && (
                <>
                  <NavButton side="left" label="Previous screenshot" onClick={() => go(index - 1)} />
                  <NavButton side="right" label="Next screenshot" onClick={() => go(index + 1)} />
                </>
              )}
            </div>

            <div className="flex items-start gap-4 border-t border-border px-5 py-4">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <DialogPrimitive.Title className="m-0 text-[15px] font-semibold">
                  {current.title ?? current.alt}
                </DialogPrimitive.Title>
                <DialogPrimitive.Description className="m-0 text-[13.5px] leading-[1.55] text-pretty text-muted-foreground">
                  {current.details ?? current.alt}
                </DialogPrimitive.Description>
              </div>
              <span className="shrink-0 pt-0.5 font-mono text-[12px] text-faint" aria-hidden>
                {index + 1} / {total}
              </span>
            </div>
            <p className="sr-only" aria-live="polite">
              {isOpen ? `Screenshot ${index + 1} of ${total}: ${current.title ?? current.alt}` : ""}
            </p>
          </DialogPrimitive.Content>
        </DialogPortal>
      </DialogPrimitive.Root>
    </>
  );
}

function NavButton({
  side,
  label,
  onClick,
}: {
  side: "left" | "right";
  label: string;
  onClick: () => void;
}) {
  const Icon = side === "left" ? ChevronLeftIcon : ChevronRightIcon;
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      className={`absolute top-1/2 ${side === "left" ? "left-2 sm:left-3" : "right-2 sm:right-3"} grid size-11 -translate-y-1/2 place-items-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80 focus-visible:outline-2 focus-visible:outline-white`}
    >
      <Icon className="size-5" />
    </button>
  );
}
