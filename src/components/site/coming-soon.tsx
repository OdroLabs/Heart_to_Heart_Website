import { s, type SettingsMap } from "@/lib/settings";
import type { Dictionary } from "@/lib/dictionaries";
import { ComingSoonScene } from "./coming-soon-scene";

const DEFAULT_HEADLINE = "Something Amazing\nIs Coming Soon.";
const DEFAULT_MESSAGE = "We're creating something special. Stay tuned.";

/**
 * Full-page takeover shown to visitors while Coming Soon Mode is on
 * (Site Settings → Coming Soon Mode). Signed-in admins never see this —
 * the locale layout only renders it for everyone else.
 *
 * Deliberately minimal, per the design brief: logo, small "coming soon"
 * label, headline, one line of supporting copy — nothing else. No
 * countdown, newsletter signup, contact form or social links.
 */
export function ComingSoon({
  locale,
  dict,
  settings,
}: {
  locale: string;
  dict: Dictionary;
  settings: SettingsMap;
}) {
  const siteName = s(settings, "site_name", locale) || s(settings, "site_short_name");
  const logoImage = s(settings, "logo_image");
  const logoLetter = s(settings, "logo_letter");
  const headline = s(settings, "coming_soon_title", locale) || DEFAULT_HEADLINE;
  const message = s(settings, "coming_soon_message", locale) || DEFAULT_MESSAGE;
  const backgroundImage = s(settings, "coming_soon_image");

  const lines = headline.split("\n").map((line) => line.trim()).filter(Boolean);

  return (
    <ComingSoonScene
      logoImage={logoImage || undefined}
      logoLetter={logoLetter}
      siteName={siteName}
      eyebrow={dict.common.comingSoon}
      lines={lines}
      message={message}
      backgroundImage={backgroundImage || undefined}
    />
  );
}
