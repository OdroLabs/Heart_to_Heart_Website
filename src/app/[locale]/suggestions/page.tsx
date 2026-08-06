import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s } from "@/lib/settings";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/page-hero";
import { SuggestionForm } from "@/components/site/suggestion-form";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const settings = await getSettings();
  return pageMetadata(settings, params.locale, {
    title: s(settings, "suggestions_hero_title", params.locale),
    description: s(settings, "suggestions_hero_intro", params.locale),
  });
}

export default async function SuggestionsPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const settings = await getSettings();
  const dict = getLabels(locale, settings);

  return (
    <>
      <PageHero
        title={s(settings, "suggestions_hero_title", locale)}
        intro={s(settings, "suggestions_hero_intro", locale)}
        image={s(settings, "suggestions_hero_image") || undefined}
      />
      <div className="container max-w-2xl py-12">
        <SuggestionForm
          dict={dict}
          successMessage={s(settings, "suggestions_success_message", locale)}
        />
      </div>
    </>
  );
}
