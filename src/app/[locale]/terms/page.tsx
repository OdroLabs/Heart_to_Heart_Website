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
    title: "Terms & Conditions",
  });
}

export default async function TermsPage({ params }: { params: { locale: Locale } }) {
  const settings = await getSettings();
  const siteName = s(settings, "site_short_name") || s(settings, "site_name") || "Heart to Heart";

  return (
    <>
      <PageHero title="Terms & Conditions" intro="Please read these terms carefully before using our website." />
      <div className="container max-w-3xl space-y-6 py-12 text-muted-foreground">
        <p className="whitespace-pre-line leading-relaxed">
          By accessing and using the {siteName} website, you agree to use this site for lawful
          purposes only and to respect the privacy and rights of the communities we serve. Content
          on this site — including text, images, and publications — belongs to {siteName} unless
          otherwise noted, and may not be reproduced without permission.
        </p>
        <p className="whitespace-pre-line leading-relaxed">
          We aim to keep the information on this site accurate and up to date, but make no
          warranties about its completeness. If you have any questions about these terms, please
          contact us via the details on our Contact page.
        </p>
      </div>
    </>
  );
}
