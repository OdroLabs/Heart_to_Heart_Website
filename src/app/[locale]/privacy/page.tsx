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
    title: "Privacy Policy",
  });
}

export default async function PrivacyPage({ params }: { params: { locale: Locale } }) {
  const settings = await getSettings();
  const siteName = s(settings, "site_short_name") || s(settings, "site_name") || "Heart to Heart";

  return (
    <>
      <PageHero title="Privacy Policy" intro="How we collect, use, and protect your information." />
      <div className="container max-w-3xl space-y-6 py-12 text-muted-foreground">
        <p className="whitespace-pre-line leading-relaxed">
          {siteName} respects your privacy. Information you share with us — such as through the
          contact form, donations, or newsletter sign-up — is used only to respond to you, process
          donations, and keep you informed about our work. We do not sell or share your personal
          information with third parties, except where required to process a donation or comply
          with the law.
        </p>
        <p className="whitespace-pre-line leading-relaxed">
          Given the sensitive nature of our work with marginalized communities, we take extra care
          to keep any information shared with us confidential. If you have questions about how
          your data is handled, please contact us via the details on our Contact page.
        </p>
      </div>
    </>
  );
}
