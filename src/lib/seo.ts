import type { Metadata } from "next";
import { s, type SettingsMap } from "./settings";

/**
 * Builds a page's <title>/description/Open Graph metadata.
 *
 * Every page passes its own title/description/image (usually the page's hero
 * heading + intro, or — for detail pages — the item's own title/excerpt).
 * Blank values fall back to the site-wide defaults from Site Settings →
 * General → Search engines & sharing, so every page still gets *something*
 * even before an editor fills in page-specific copy.
 *
 * The site name is appended to page titles (but not to the homepage's own
 * title) so each page's title differs from the others.
 */
export function pageMetadata(
  settings: SettingsMap,
  locale: string,
  opts: { title?: string; description?: string; image?: string } = {}
): Metadata {
  const siteName = s(settings, "site_name", locale) || s(settings, "site_short_name");
  const defaultTitle = s(settings, "seo_title", locale) || siteName;
  const defaultDescription =
    s(settings, "seo_description", locale) || s(settings, "site_tagline", locale);
  const defaultImage = s(settings, "og_image");

  const pageTitle = (opts.title || "").trim();
  const description = (opts.description || defaultDescription || "").trim();
  const image = opts.image || defaultImage;

  const title =
    pageTitle && pageTitle !== siteName
      ? siteName
        ? `${pageTitle} | ${siteName}`
        : pageTitle
      : defaultTitle;

  return {
    title: title || undefined,
    description: description || undefined,
    openGraph: {
      title: title || undefined,
      description: description || undefined,
      siteName: siteName || undefined,
      images: image ? [image] : undefined,
    },
  };
}
