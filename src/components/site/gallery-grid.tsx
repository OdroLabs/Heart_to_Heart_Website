"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, X } from "lucide-react";

export type GalleryItem = {
  id: number;
  image: string;
  type: string;
  videoUrl: string | null;
  caption: string;
};

/** Builds a proper autoplaying iframe embed URL for the platforms that support it. */
function toEmbedUrl(url: string): string | null {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return null;
  }

  if (u.hostname.includes("youtube.com")) {
    const id = u.searchParams.get("v");
    if (id) return `https://www.youtube.com/embed/${id}?autoplay=1`;
    const parts = u.pathname.split("/").filter(Boolean);
    if ((parts[0] === "shorts" || parts[0] === "embed") && parts[1]) {
      return `https://www.youtube.com/embed/${parts[1]}?autoplay=1`;
    }
  }
  if (u.hostname === "youtu.be") {
    const id = u.pathname.slice(1);
    if (id) return `https://www.youtube.com/embed/${id}?autoplay=1`;
  }
  if (u.hostname.includes("vimeo.com")) {
    const id = u.pathname.split("/").filter(Boolean).pop();
    if (id) return `https://player.vimeo.com/video/${id}?autoplay=1`;
  }
  return null;
}

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState<GalleryItem | null>(null);
  const embedSrc = active?.videoUrl ? toEmbedUrl(active.videoUrl) ?? active.videoUrl : null;

  return (
    <>
      <div data-stagger className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {items.map((item) => {
          const isVideo = item.type === "video" && !!item.videoUrl;
          return (
            <figure
              key={item.id}
              className="group relative aspect-square overflow-hidden rounded-xl"
            >
              {isVideo ? (
                <button
                  type="button"
                  onClick={() => setActive(item)}
                  aria-label={item.caption ? `Play video: ${item.caption}` : "Play video"}
                  className="absolute inset-0 h-full w-full"
                >
                  <Image
                    src={item.image}
                    alt={item.caption}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors group-hover:bg-black/35">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg">
                      <Play className="ml-0.5 h-5 w-5 text-primary" fill="currentColor" />
                    </span>
                  </span>
                </button>
              ) : (
                <Image
                  src={item.image}
                  alt={item.caption}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              )}
              {item.caption && (
                <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-black/60 p-2 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {item.caption}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActive(null)}
        >
          <div
            className="relative aspect-video w-full max-w-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setActive(null)}
              className="absolute -top-10 right-0 text-white/80 transition-colors hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
            {embedSrc && (
              <iframe
                src={embedSrc}
                title={active.caption || "Video"}
                className="h-full w-full rounded-lg bg-black"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            )}
            <a
              href={active.videoUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-navy-950 shadow transition-colors hover:bg-white"
            >
              Open original ↗
            </a>
          </div>
        </div>
      )}
    </>
  );
}
