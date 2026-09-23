import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { getSettings, s } from "@/lib/settings";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/page-hero";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const settings = await getSettings();
  return pageMetadata(settings, params.locale, {
    title: s(settings, "privacy_hero_title", params.locale),
    description: s(settings, "privacy_hero_intro", params.locale),
  });
}

export default async function PrivacyPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const settings = await getSettings();
  const body = s(settings, "privacy_body", locale);
  const updated = s(settings, "privacy_updated", locale);

  return (
    <>
      <PageHero
        title={s(settings, "privacy_hero_title", locale)}
        intro={s(settings, "privacy_hero_intro", locale)}
        image={s(settings, "privacy_hero_image") || undefined}
      />
      {body && (
        <div className="container max-w-3xl py-12 md:py-16">
          {updated && (
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
              {updated}
            </p>
          )}
          <div className="whitespace-pre-line leading-relaxed text-muted-foreground">
            {body}
          </div>
        </div>
      )}
    </>
  );
}
