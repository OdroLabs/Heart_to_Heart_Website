import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  FileText,
  FolderKanban,
  Newspaper,
  Search,
  ShoppingBag,
  Stethoscope,
} from "lucide-react";
import { getSettings } from "@/lib/settings";
import { getLabels } from "@/lib/labels";
import { type Locale } from "@/lib/i18n";
import { searchSite, totalCount, type SearchResultType } from "@/lib/search";
import { formatDate } from "@/lib/utils";

const TYPE_ICON: Record<SearchResultType, typeof Newspaper> = {
  news: Newspaper,
  events: CalendarDays,
  projects: FolderKanban,
  services: Stethoscope,
  publications: FileText,
  products: ShoppingBag,
};

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { q?: string };
}) {
  const { locale } = params;
  const q = (searchParams.q ?? "").trim();
  const settings = await getSettings();
  const dict = getLabels(locale, settings);

  const typeLabel: Record<SearchResultType, string> = {
    news: dict.nav.news,
    events: dict.nav.events,
    projects: dict.nav.projects,
    services: dict.nav.services,
    publications: dict.nav.publications,
    products: dict.nav.business,
  };

  const results = q ? await searchSite(q, locale, 24) : null;
  const groups = results
    ? (Object.entries(results) as [SearchResultType, (typeof results)[SearchResultType]][]).filter(
        ([, items]) => items.length > 0
      )
    : [];
  const count = results ? totalCount(results) : 0;

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-600 py-16 text-white md:py-20">
        <div className="container relative">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent">
            <Search className="h-4 w-4" /> {dict.common.search}
          </p>
          <h1 className="max-w-2xl text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
            {q ? `${dict.common.searchResultsFor} “${q}”` : dict.common.search}
          </h1>

          <form action={`/${locale}/search`} className="mt-8 max-w-xl">
            <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 shadow-lg">
              <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder={dict.common.searchPlaceholder}
                className="w-full bg-transparent text-sm font-medium text-navy-950 outline-none placeholder:text-muted-foreground/70"
              />
            </div>
          </form>
        </div>
      </section>

      <div className="container py-12 md:py-16">
        {!q && <p className="text-sm text-muted-foreground">{dict.common.typeToSearch}</p>}

        {q && count === 0 && (
          <p className="text-sm text-muted-foreground">{dict.common.noSearchResults}</p>
        )}

        <div className="space-y-12">
          {groups.map(([type, items]) => {
            const Icon = TYPE_ICON[type];
            return (
              <div key={type}>
                <h2 className="mb-5 flex items-center gap-2 text-lg font-extrabold tracking-tight">
                  <Icon className="h-5 w-5 text-primary" /> {typeLabel[type]}
                </h2>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <Link
                      key={`${type}-${item.id}`}
                      href={item.url}
                      className="group flex gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                        {item.image ? (
                          <Image src={item.image} alt="" fill className="object-cover" />
                        ) : (
                          <div className="grid h-full w-full place-items-center">
                            <Icon className="h-5 w-5 text-muted-foreground/40" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-1 font-bold group-hover:text-primary">
                          {item.title}
                        </p>
                        {item.excerpt && (
                          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                            {item.excerpt}
                          </p>
                        )}
                        <div className="mt-2 flex items-center justify-between">
                          {item.date ? (
                            <span className="text-xs text-muted-foreground">
                              {formatDate(item.date, locale)}
                            </span>
                          ) : (
                            <span />
                          )}
                          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
