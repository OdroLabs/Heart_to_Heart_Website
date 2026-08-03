import { prisma } from "./prisma";
import { loc } from "./i18n";

export type SearchResultType =
  | "news"
  | "events"
  | "projects"
  | "services"
  | "publications"
  | "products";

export interface SearchResult {
  type: SearchResultType;
  id: number;
  title: string;
  excerpt: string;
  image: string | null;
  url: string;
  date: Date | null;
}

export type SearchResults = Record<SearchResultType, SearchResult[]>;

const EMPTY_RESULTS: SearchResults = {
  news: [],
  events: [],
  projects: [],
  services: [],
  publications: [],
  products: [],
};

/** Case-insensitive OR filter across every locale variant of the given fields. */
function textFilter(fields: string[], q: string) {
  return {
    OR: fields.map((field) => ({
      [field]: { contains: q, mode: "insensitive" as const },
    })),
  };
}

const TEXT_FIELDS = ["En", "Si", "Ta"] as const;
const withLocales = (prefix: string) => TEXT_FIELDS.map((suffix) => `${prefix}${suffix}`);

function url(locale: string, path: string, slugOrId: string | number | null | undefined) {
  return `/${locale}/${path}/${slugOrId ?? ""}`.replace(/\/$/, "");
}

/**
 * Searches every public content type — News, Events, Projects, Services,
 * Publications and Community Business products — for the given query.
 * Only published items are considered. Results are capped per type via
 * `limitPerType` so the live search overlay stays fast; pass a higher limit
 * (or Infinity via a large number) for the full `/search` results page.
 */
export async function searchSite(
  query: string,
  locale: string,
  limitPerType = 5
): Promise<SearchResults> {
  const q = query.trim();
  if (!q) return EMPTY_RESULTS;

  const [news, events, projects, services, publications, products] = await Promise.all([
    prisma.news.findMany({
      where: {
        published: true,
        ...textFilter([...withLocales("title"), ...withLocales("excerpt"), "contentEn"], q),
      },
      orderBy: { publishedAt: "desc" },
      take: limitPerType,
    }),
    prisma.event.findMany({
      where: {
        published: true,
        ...textFilter([...withLocales("title"), ...withLocales("description")], q),
      },
      orderBy: { startDate: "desc" },
      take: limitPerType,
    }),
    prisma.project.findMany({
      where: {
        published: true,
        ...textFilter([...withLocales("title"), ...withLocales("description")], q),
      },
      orderBy: { order: "asc" },
      take: limitPerType,
    }),
    prisma.service.findMany({
      where: {
        published: true,
        ...textFilter([...withLocales("title"), ...withLocales("description")], q),
      },
      orderBy: { order: "asc" },
      take: limitPerType,
    }),
    prisma.publication.findMany({
      where: {
        published: true,
        ...textFilter([...withLocales("title"), ...withLocales("description")], q),
      },
      orderBy: { publishedAt: "desc" },
      take: limitPerType,
    }),
    prisma.product.findMany({
      where: {
        published: true,
        ...textFilter([...withLocales("name"), ...withLocales("description")], q),
      },
      orderBy: { order: "asc" },
      take: limitPerType,
    }),
  ]);

  return {
    news: news.map((n) => ({
      type: "news",
      id: n.id,
      title: loc(n, "title", locale),
      excerpt: loc(n, "excerpt", locale),
      image: n.image,
      url: url(locale, "news", n.slug ?? n.id),
      date: n.publishedAt,
    })),
    events: events.map((e) => ({
      type: "events",
      id: e.id,
      title: loc(e, "title", locale),
      excerpt: loc(e, "description", locale),
      image: e.image,
      url: url(locale, "events", e.slug ?? e.id),
      date: e.startDate,
    })),
    projects: projects.map((p) => ({
      type: "projects",
      id: p.id,
      title: loc(p, "title", locale),
      excerpt: loc(p, "description", locale),
      image: p.image,
      url: url(locale, "projects", p.slug ?? p.id),
      date: p.startDate,
    })),
    services: services.map((s) => ({
      type: "services",
      id: s.id,
      title: loc(s, "title", locale),
      excerpt: loc(s, "description", locale),
      image: s.image,
      url: url(locale, "services", s.slug ?? s.id),
      date: null,
    })),
    publications: publications.map((p) => ({
      type: "publications",
      id: p.id,
      title: loc(p, "title", locale),
      excerpt: loc(p, "description", locale),
      image: p.coverImage,
      url: `/${locale}/publications`,
      date: p.publishedAt,
    })),
    products: products.map((p) => ({
      type: "products",
      id: p.id,
      title: loc(p, "name", locale),
      excerpt: loc(p, "description", locale),
      image: p.image,
      url: `/${locale}/business`,
      date: null,
    })),
  };
}

export function totalCount(results: SearchResults): number {
  return Object.values(results).reduce((sum, arr) => sum + arr.length, 0);
}
