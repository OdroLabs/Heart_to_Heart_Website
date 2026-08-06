"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  X,
  Loader2,
  Newspaper,
  CalendarDays,
  FolderKanban,
  Stethoscope,
  FileText,
  ShoppingBag,
} from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import type { SearchResults, SearchResultType } from "@/lib/search";

const TYPE_ICON: Record<SearchResultType, typeof Newspaper> = {
  news: Newspaper,
  events: CalendarDays,
  projects: FolderKanban,
  services: Stethoscope,
  publications: FileText,
  products: ShoppingBag,
};

export function SearchOverlay({ locale, dict }: { locale: string; dict: Dictionary }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const typeLabel: Record<SearchResultType, string> = {
    news: dict.nav.news,
    events: dict.nav.events,
    projects: dict.nav.projects,
    services: dict.nav.services,
    publications: dict.nav.publications,
    products: dict.nav.business,
  };

  // Focus the input as soon as the overlay opens
  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
    setQuery("");
    setResults(null);
  }, [open]);

  // Lock body scroll while open, close on Escape
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Debounced live search
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(q)}&locale=${locale}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setResults(data.results);
      } catch {
        // Ignore aborted/failed requests — a newer keystroke superseded this one.
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, locale]);

  function goToFullResults() {
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    router.push(`/${locale}/search?q=${encodeURIComponent(q)}`);
  }

  const groups = results
    ? (Object.entries(results) as [SearchResultType, SearchResults[SearchResultType]][]).filter(
        ([, items]) => items.length > 0
      )
    : [];
  const hasQuery = query.trim().length > 0;
  const hasResults = groups.length > 0;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={dict.common.search}
        className="grid h-10 w-10 place-items-center rounded-full transition-colors hover:bg-muted"
      >
        <Search className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-20 md:pt-28">
          {/* Backdrop */}
          <div
            aria-hidden
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm"
          />

          {/* Panel */}
          <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") goToFullResults();
                }}
                placeholder={dict.common.searchPlaceholder}
                className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/70"
              />
              {loading && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />}
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-3">
              {!hasQuery && (
                <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                  {dict.common.typeToSearch}
                </p>
              )}

              {hasQuery && !loading && !hasResults && (
                <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                  {dict.common.noSearchResults}
                </p>
              )}

              {groups.map(([type, items]) => {
                const Icon = TYPE_ICON[type];
                return (
                  <div key={type} className="mb-2 last:mb-0">
                    <p className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                      <Icon className="h-3.5 w-3.5" /> {typeLabel[type]}
                    </p>
                    <ul>
                      {items.map((item) => (
                        <li key={`${type}-${item.id}`}>
                          <Link
                            href={item.url}
                            onClick={() => setOpen(false)}
                            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted"
                          >
                            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-muted">
                              {item.image ? (
                                <Image src={item.image} alt="" fill className="object-cover" />
                              ) : (
                                <div className="grid h-full w-full place-items-center">
                                  <Icon className="h-4 w-4 text-muted-foreground/40" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="line-clamp-1 text-sm font-semibold group-hover:text-primary">
                                {item.title}
                              </p>
                              {item.excerpt && (
                                <p className="line-clamp-1 text-xs text-muted-foreground">
                                  {item.excerpt}
                                </p>
                              )}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {hasQuery && hasResults && (
              <button
                type="button"
                onClick={goToFullResults}
                className="block w-full border-t border-border px-5 py-3.5 text-center text-sm font-bold text-primary transition-colors hover:bg-muted"
              >
                {dict.common.viewAllResults} →
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
