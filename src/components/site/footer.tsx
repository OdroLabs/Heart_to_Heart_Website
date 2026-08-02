import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Heart,
  Facebook,
  Youtube,
  Instagram,
  Twitter,
  Linkedin,
  Music2,
} from "lucide-react";
import type { Dictionary } from "@/lib/dictionaries";
import { buildNav, buildSocials } from "@/lib/nav";
import { s, show, type SettingsMap } from "@/lib/settings";
import { NewsletterForm } from "./newsletter-form";

const SOCIAL_ICONS: Record<string, typeof Facebook> = {
  facebook: Facebook,
  youtube: Youtube,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  tiktok: Music2,
};

export function SiteFooter({
  locale,
  dict,
  settings,
}: {
  locale: string;
  dict: Dictionary;
  settings: SettingsMap;
}) {
  const year = new Date().getFullYear();
  const nav = buildNav(settings, dict);
  const socials = buildSocials(settings);

  const shortName = s(settings, "site_short_name");
  const siteName = s(settings, "site_name", locale);
  const logoImage = s(settings, "logo_image");
  const logoLetter = s(settings, "logo_letter");
  const tagline = s(settings, "site_tagline", locale);

  const about = s(settings, "footer_about", locale);
  const address = s(settings, "address", locale);
  const phones = [s(settings, "phone"), s(settings, "phone2")].filter(Boolean);
  const emails = [s(settings, "email"), s(settings, "email2")].filter(Boolean);

  const newsletterTitle = s(settings, "footer_newsletter_title", locale);
  const newsletterText = s(settings, "footer_newsletter_text", locale);
  const copyright = s(settings, "footer_copyright", locale);
  const credit = s(settings, "footer_credit", locale);

  const showExplore = show(settings, "show_footer_explore", nav.explore);
  const showInvolved = show(settings, "show_footer_involved", nav.involved);
  const showSocial = show(settings, "show_footer_social", socials);
  const showNewsletter = show(settings, "show_footer_newsletter", newsletterTitle);

  return (
    <footer id="sec-footer" className="relative bg-navy-950 text-white">

      {/* Main footer body */}
      <div className="container relative py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">

          {/* ── Col 1: Brand + tagline + newsletter ──────────────────── */}
          <div>
            {/* Logo */}
            <Link href={`/${locale}`} className="mb-5 flex items-center gap-2.5 group">
              {logoImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoImage}
                  alt={shortName || siteName}
                  className="h-10 w-auto max-w-[170px] object-contain brightness-0 invert"
                />
              ) : (
                logoLetter && (
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent text-lg font-bold shadow-md">
                    {logoLetter}
                  </span>
                )
              )}
              {!logoImage && (shortName || siteName) && (
                <span className="leading-tight">
                  {shortName && (
                    <span className="block text-lg font-extrabold tracking-tight text-white">
                      {shortName}
                    </span>
                  )}
                  {siteName && (
                    <span className="block max-w-[220px] truncate text-[10px] text-white/60">
                      {siteName}
                    </span>
                  )}
                </span>
              )}
            </Link>

            {/* Tagline / About */}
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-white/55">
              {about || tagline || "Connecting communities with compassionate, accessible healthcare."}
            </p>

            {/* Newsletter form — matches "Stay ahead of your health journey" in reference */}
            {showNewsletter && (
              <div>
                {newsletterTitle && (
                  <p className="mb-1 text-sm font-bold text-white">{newsletterTitle}</p>
                )}
                {newsletterText && (
                  <p className="mb-3 text-xs text-white/55">{newsletterText}</p>
                )}
                <NewsletterForm dict={dict} dark />
              </div>
            )}

            {/* Social icons */}
            {showSocial && (
              <div className="mt-6 flex items-center gap-2">
                {socials.map((social) => {
                  const Icon = SOCIAL_ICONS[social.key] ?? Heart;
                  return (
                    <a
                      key={social.key}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all hover:border-primary/50 hover:bg-primary/15 hover:text-primary"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Col 2: Quick Links ──────────────────────────────────── */}
          {showExplore && (
            <div>
              <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.15em] text-white/90">
                {dict.footer.explore}
              </h4>
              <ul className="space-y-3">
                {nav.explore.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={`/${locale}${l.href}`}
                      className="text-sm text-white/55 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Col 3: Our Services / Get Involved ─────────────────── */}
          {showInvolved && (
            <div>
              <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.15em] text-white/90">
                {dict.footer.getInvolved}
              </h4>
              <ul className="space-y-3">
                {nav.involved.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={`/${locale}${l.href}`}
                      className="text-sm text-white/55 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Col 4: Contact Details ─────────────────────────────── */}
          {(address || phones.length > 0 || emails.length > 0) && (
            <div>
              <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.15em] text-white/90">
                {dict.nav.contact}
              </h4>
              <ul className="space-y-3 text-sm text-white/55">
                {address && (
                  <li className="flex items-start gap-2.5">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="whitespace-pre-line leading-relaxed">{address}</span>
                  </li>
                )}
                {phones.map((phone) => (
                  <li key={phone}>
                    <a
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="flex items-center gap-2.5 transition-colors hover:text-white"
                    >
                      <Phone className="h-4 w-4 shrink-0 text-primary" /> {phone}
                    </a>
                  </li>
                ))}
                {emails.map((email) => (
                  <li key={email}>
                    <a
                      href={`mailto:${email}`}
                      className="flex items-center gap-2.5 transition-colors hover:text-white"
                    >
                      <Mail className="h-4 w-4 shrink-0 text-primary" /> {email}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────────────── */}
      <div id="sec-footer-bottom" className="border-t border-white/[0.07]">
        <div className="container flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/35 sm:flex-row">
          <p className="flex items-center gap-1.5">
            © {year}
            {copyright ? ` ${copyright}` : siteName ? ` ${siteName}. All rights reserved.` : ""}
            <Heart className="h-3 w-3 fill-primary/60 text-primary/60" />
          </p>
          {credit && <p>{credit}</p>}
        </div>
      </div>
    </footer>
  );
}
