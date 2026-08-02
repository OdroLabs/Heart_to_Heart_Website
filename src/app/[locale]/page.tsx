import Link from "next/link";
import {
  Heart,
  ArrowRight,
  ShieldCheck,
  Users,
  HandHeart,
  CalendarDays,
  MapPin,
  PhoneCall,
  Mail,
  Sparkles,
  Star,
  CheckCircle2,
  Building2,
  Stethoscope,
  FlaskConical,
  Baby,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s, sList, sPairs, sNum, show } from "@/lib/settings";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatCounter } from "@/components/site/stat-counter";
import { MarqueeTrustBar } from "@/components/site/marquee-trust-bar";
import { ServicesTabs } from "@/components/site/services-tabs";

/* -------------------------------------------------------------------------- */
/* Small helpers                                                                */
/* -------------------------------------------------------------------------- */

function SectionTag({
  children,
  light,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <p
      className={`inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] ${light ? "text-white/80" : "text-primary"
        }`}
    >
      <span
        className={`block h-0.5 w-6 rounded-full ${light ? "bg-white/60" : "bg-primary"}`}
      />
      {children}
    </p>
  );
}

function link(locale: string, value: string): string {
  const target = value || "/";
  if (
    /^(https?:)?\/\//.test(target) ||
    target.startsWith("mailto:") ||
    target.startsWith("tel:")
  )
    return target;
  return `/${locale}${target.startsWith("/") ? target : `/${target}`}`;
}

/* Service icon fallbacks */
const SERVICE_ICONS = [
  Stethoscope,
  Heart,
  FlaskConical,
  Baby,
  Building2,
  ShieldCheck,
  Users,
  HandHeart,
];

/* -------------------------------------------------------------------------- */
/* Page                                                                         */
/* -------------------------------------------------------------------------- */

export default async function HomePage({
  params,
}: {
  params: { locale: Locale };
}) {
  const locale = params.locale;
  const settings = await getSettings();
  const dict = getLabels(locale, settings);

  const servicesCount = sNum(settings, "home_services_count", 6);
  const projectsCount = sNum(settings, "home_projects_count", 4);
  const newsCount = sNum(settings, "home_news_count", 3);
  const eventsCount = sNum(settings, "home_events_count", 2);

  const [stats, services, projects, news, events, testimonials, partners] =
    await Promise.all([
      prisma.stat.findMany({ orderBy: { order: "asc" } }),
      prisma.service.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
        take: servicesCount,
      }),
      prisma.project.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
        take: projectsCount,
      }),
      prisma.news.findMany({
        where: { published: true },
        orderBy: { publishedAt: "desc" },
        take: newsCount,
      }),
      prisma.event.findMany({
        where: { published: true, startDate: { gte: new Date() } },
        orderBy: { startDate: "asc" },
        take: eventsCount,
      }),
      prisma.testimonial.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      }),
      prisma.partner.findMany({ orderBy: { order: "asc" } }),
    ]);

  /* ----------------------------- Content reads ----------------------------- */
  const siteName = s(settings, "site_name", locale);
  const phone = s(settings, "phone");
  const email = s(settings, "email");
  const address = s(settings, "address", locale);

  // Hero
  const heroImage = s(settings, "hero_image");
  const heroTitle = s(settings, "hero_title", locale);
  const heroBadge = s(settings, "hero_badge", locale);
  const heroSubtitle = s(settings, "hero_subtitle", locale);
  const heroPoints = sList(settings, "hero_points", locale);
  const heroFootnote = s(settings, "hero_footnote", locale);
  const heroCta1 = s(settings, "hero_cta1_label", locale);
  const heroCta2 = s(settings, "hero_cta2_label", locale);
  const heroStatsValue = s(settings, "hero_stats_value");
  const heroStatsLabel = s(settings, "hero_stats_label", locale);
  const heroTrustPills = sList(settings, "hero_trust_pills", locale);
  const heroTrustBadge = s(settings, "hero_trust_badge", locale);

  // Marquee
  const marqueeItems = sList(settings, "home_marquee_items", locale);

  // About
  const aboutTitle = s(settings, "home_about_title", locale);
  const aboutText = s(settings, "home_about_text", locale);
  const aboutImage = s(settings, "home_about_image");
  const aboutLinkLabel = s(settings, "home_about_link_label", locale);
  const aboutStatValue = s(settings, "home_about_stat_value");
  const aboutStatLabel = s(settings, "home_about_stat_label", locale);
  const aboutFeatures = sPairs(settings, "home_about_features", locale);

  // Stats band
  const statsTitle = s(settings, "home_stats_title", locale);
  const statsImage = s(settings, "home_stats_image");

  // Services
  const servicesTitle = s(settings, "home_services_title", locale);
  const servicesText = s(settings, "home_services_text", locale);
  const servicesCommitment = s(settings, "home_services_commitment", locale);
  const servicesImage = s(settings, "home_services_image");
  const servicesLinkLabel = s(settings, "home_services_link_label", locale);

  // Total Care Model
  const modelTitle = s(settings, "home_model_title", locale);
  const modelText = s(settings, "home_model_text", locale);
  const modelImage = s(settings, "home_model_image");
  const modelCaption = s(settings, "home_model_caption", locale);
  const modelEyebrow = s(settings, "home_model_eyebrow", locale);

  // Projects
  const projectsTitle = s(settings, "home_projects_title", locale);
  const projectsText = s(settings, "home_projects_text", locale);
  const projectsLinkLabel = s(settings, "home_projects_link_label", locale);

  // Contact
  const contactTitle = s(settings, "home_contact_title", locale);
  const contactText = s(settings, "home_contact_text", locale);
  const contactCardTitle = s(settings, "home_contact_card_title", locale);
  const contactImage = s(settings, "home_contact_image");
  const contactButton = s(settings, "home_contact_button", locale);

  // Testimonials
  const testimonialsTitle = s(settings, "home_testimonials_title", locale);

  // News
  const newsTitle = s(settings, "home_news_title", locale);

  // Events
  const eventsTitle = s(settings, "home_events_title", locale);
  const eventsLinkLabel = s(settings, "home_events_link_label", locale);

  // Partners
  const partnersTitle = s(settings, "home_partners_title", locale);

  // Donate CTA
  const donateTitle = s(settings, "home_donate_title", locale);
  const donateText = s(settings, "home_donate_text", locale);
  const donateButton = s(settings, "home_donate_button", locale);
  const donateButton2 = s(settings, "home_donate_button2", locale);

  /* ---------------------- Section visibility ------------------------------ */
  const showHero = Boolean(heroTitle || heroSubtitle || heroBadge);
  const showMarquee = show(settings, "show_home_marquee", marqueeItems);
  const showAbout = show(settings, "show_home_about", aboutText, aboutImage);
  const showStats = show(settings, "show_home_stats", stats);
  const showServices = show(settings, "show_home_services", services);
  const showModel = show(settings, "show_home_model", modelTitle, modelImage);
  const showProjects = show(settings, "show_home_projects", projects);
  const showContact = show(
    settings,
    "show_home_contact",
    contactTitle,
    contactText,
    phone,
    email
  );
  const showTestimonials = show(
    settings,
    "show_home_testimonials",
    testimonials
  );
  const showNews = show(settings, "show_home_news", news);
  const showEvents = show(settings, "show_home_events", events);
  const showNewsEvents = showNews || showEvents;
  const showPartners = show(settings, "show_home_partners", partners);
  const showDonate = show(
    settings,
    "show_home_donate",
    donateTitle,
    donateText
  );

  const featureIcons = [ShieldCheck, Heart, Users, HandHeart, CheckCircle2, Building2];

  return (
    <>
      {/* ================================================================== */}
      {/* HERO                                                                */}
      {/* ================================================================== */}
      {showHero && (
        <section id="sec-hero" className="px-3 pt-4 pb-0 md:px-5 md:pt-6">
          {/* ── Outer rounded container — sky-blue bg, fills edge-to-edge ── */}
          <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[2rem] min-h-[86svh] flex flex-col">

            {/* ── Background: image first, then teal BG fills what image doesn't ── */}
            {heroImage ? (
              <>
                {/* Full-cover image */}
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${heroImage})` }}
                />
                {/* Left gradient overlay — dark teal to transparent so white text is readable */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#1a6b5a]/90 via-[#1a6b5a]/60 to-transparent" />
                {/* Top fade for visual polish */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#1a6b5a]/30 via-transparent to-[#0d3d2e]/50" />
              </>
            ) : (
              /* No image: solid teal-green gradient background */
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a6b5a] via-[#2d8a72] to-[#3da882]" />
            )}

            {/* ── Content layer ── */}
            <div className="relative z-10 flex flex-1 flex-col px-8 py-12 md:px-14 md:py-16">

              {/* ── TOP: Trust badge + H1 + CTA button ── */}
              <div className="flex-1">
                {/* Trust avatars badge */}
                {heroTrustBadge && (
                  <div className="mb-6 inline-flex items-center gap-2.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-2 pr-4">
                    <div className="flex -space-x-2">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="h-7 w-7 rounded-full border-2 border-white/60 shadow-sm"
                          style={{
                            backgroundImage: `url(/a51664d11fccbc1767508ede1f06572f.jpg)`,
                            backgroundSize: "cover",
                            backgroundPosition: `${20 + i * 20}% center`,
                            backgroundColor: `hsl(${160 + i * 20}, 50%, ${55 - i * 5}%)`,
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-semibold text-white/90">{heroTrustBadge}</span>
                  </div>
                )}

                {/* H1 — white, large, max half the width */}
                {heroTitle && (
                  <h1 className="mb-8 max-w-[600px] text-4xl font-extrabold leading-[1.1] tracking-tight text-white drop-shadow-sm md:text-[3.5rem]">
                    {heroTitle}
                  </h1>
                )}

                {/* CTA button — white pill + teal circle arrow (matches reference "Explore Services →") */}
                {heroCta1 && (
                  <Link
                    href={link(locale, s(settings, "hero_cta1_link"))}
                    className="inline-flex items-center gap-0 rounded-full bg-white/95 pl-6 pr-1 py-1 text-sm font-bold text-navy-950 shadow-lg hover:shadow-xl hover:bg-white transition-all"
                  >
                    {heroCta1}
                    <span className="ml-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shrink-0 shadow-md">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </Link>
                )}
              </div>

              {/* ── BOTTOM row: left text block + right floating cards ── */}
              <div className="mt-auto flex flex-col gap-6 pt-10 md:flex-row md:items-end md:justify-between">

                {/* Bottom-left: "Comprehensive Care" label + paragraph — heroFootnote + heroSubtitle */}
                {(heroFootnote || heroSubtitle) && (
                  <div className="max-w-xs">
                    {heroFootnote && (
                      <p className="mb-1.5 text-sm font-bold text-white">{heroFootnote}</p>
                    )}
                    {heroSubtitle && (
                      <p className="text-sm leading-relaxed text-white/70">{heroSubtitle}</p>
                    )}
                  </div>
                )}

                {/* Bottom-right: Two frosted glass cards */}
                {(heroStatsValue || heroTrustPills.length > 0) && (
                  <div className="flex gap-3 shrink-0 flex-wrap md:flex-nowrap">

                    {/* Card 1: Stat card — "Trusted Care Rate / 97%" */}
                    {heroStatsValue && (
                      <div className="w-44 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 p-5 shadow-xl">
                        {/* Card heading from hero_trust_badge fallback */}
                        <p className="mb-2 text-xs font-semibold text-white/75 leading-tight">
                          {s(settings, "hero_stats_heading") || "Trusted Care Rate"}
                        </p>
                        <p className="font-number text-4xl font-extrabold text-white leading-none">
                          {heroStatsValue}
                        </p>
                        {heroStatsLabel && (
                          <p className="mt-2 text-[11px] leading-snug text-white/65">
                            {heroStatsLabel}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Card 2: Pill tags card — "Caring / Personalized / Reliable" */}
                    {heroTrustPills.length > 0 && (
                      <div className="w-44 rounded-3xl bg-white/15 backdrop-blur-md border border-white/25 p-5 shadow-xl">
                        <div className="grid grid-cols-2 gap-2">
                          {heroTrustPills.slice(0, 4).map((pill, i) => (
                            <span
                              key={i}
                              className={`flex items-center justify-center rounded-full px-3 py-2 text-xs font-semibold w-full ${i === 1
                                ? "col-span-2 bg-white text-navy-950 shadow-sm"
                                : "bg-white/20 text-white border border-white/30"
                                }`}
                            >
                              {pill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* MARQUEE TRUST BAR                                                   */}
      {/* ================================================================== */}
      {showMarquee && marqueeItems.length > 0 && (
        <MarqueeTrustBar items={marqueeItems} />
      )}

      {/* ================================================================== */}
      {/* ABOUT / WHO WE ARE                                                  */}
      {/* ================================================================== */}
      {showAbout && (
        <section id="sec-about" className="container py-20 md:py-28">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-16 items-start">

            {/* Left col: eyebrow + image + floating stat */}
            <div data-animate className="relative">
              {s(settings, "home_about_eyebrow", locale) && (
                <div className="mb-8">
                  <SectionTag>{s(settings, "home_about_eyebrow", locale)}</SectionTag>
                </div>
              )}

              {/* Tabs row (Our Impact) — static UI element matching reference */}
              <div className="mb-6 flex items-center gap-3">
                <button type="button" className="rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-white shadow-sm">
                  Our Impact
                </button>
              </div>

              {/* Main image */}
              <div className="relative">
                {aboutImage ? (
                  <div className="relative w-full max-w-[380px] mx-auto">
                    <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-brand-50 shadow-lg relative">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${aboutImage})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#eaf6f6]/30 to-transparent" />
                    </div>

                    {/* Floating stat card — "50+" in bottom-left */}
                    {(aboutStatValue || aboutStatLabel) && (
                      <div className="absolute -bottom-6 -left-6 z-10 rounded-3xl bg-white p-5 shadow-xl border border-border/40 max-w-[180px]">
                        {aboutStatValue && (
                          <p className="font-number text-4xl font-extrabold text-navy-950 leading-none">
                            <StatCounter value={aboutStatValue} />
                          </p>
                        )}
                        {aboutStatLabel && (
                          <p className="mt-1.5 text-[11px] leading-tight text-muted-foreground font-medium">
                            {aboutStatLabel}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Placeholder if no image */
                  <div className="w-full max-w-[380px] mx-auto aspect-[4/5] rounded-[2rem] bg-brand-50 flex items-center justify-center">
                    <Heart className="h-20 w-20 text-primary/20" />
                  </div>
                )}
              </div>
            </div>

            {/* Right col: text + feature cards */}
            <div data-animate data-delay="0.15" className="lg:pt-12">
              {/* About description */}
              {aboutText && (
                <p className="mb-10 text-lg leading-relaxed text-navy-800/80 max-w-lg">
                  {aboutText}
                </p>
              )}

              {/* 2×2 Feature cards grid — matching reference exactly */}
              {aboutFeatures.length > 0 ? (
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {aboutFeatures.slice(0, 4).map((feat, i) => {
                    const Icon = featureIcons[i % featureIcons.length];
                    return (
                      <div
                        key={i}
                        className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm hover:border-primary/30 hover:shadow-md transition-all"
                      >
                        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50">
                          <Icon className="h-4.5 w-4.5 text-primary" />
                        </div>
                        <h3 className="mb-1 text-sm font-bold text-navy-950">{feat.left}</h3>
                        {feat.right && (
                          <p className="text-xs leading-relaxed text-muted-foreground">{feat.right}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Fallback: show stats from DB as feature cards */
                stats.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {stats.slice(0, 4).map((stat) => (
                      <div
                        key={stat.id}
                        className="rounded-2xl border border-border/60 bg-white p-5 shadow-sm"
                      >
                        <p className="font-number text-2xl font-extrabold text-primary">
                          <StatCounter value={stat.value} />
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">{loc(stat, "label", locale)}</p>
                      </div>
                    ))}
                  </div>
                )
              )}

              {aboutLinkLabel && (
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-primary px-8 font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
                >
                  <Link href={`/${locale}/about`}>{aboutLinkLabel}</Link>
                </Button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* IMPACT STATS BAND                                                   */}
      {/* ================================================================== */}
      {showStats && (
        <section id="sec-stats" className="relative overflow-hidden bg-brand-50 py-16 md:py-20">
          {statsImage && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-10"
              style={{ backgroundImage: `url(${statsImage})` }}
            />
          )}
          <div className="container relative">
            {statsTitle && (
              <div data-animate className="mx-auto mb-12 max-w-2xl text-center">
                {s(settings, "home_stats_eyebrow", locale) && (
                  <SectionTag>{s(settings, "home_stats_eyebrow", locale)}</SectionTag>
                )}
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-950 md:text-4xl">
                  {statsTitle}
                </h2>
              </div>
            )}
            <div data-stagger className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.id}
                  className="rounded-3xl border border-border/60 bg-white p-7 text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <p className="font-number text-3xl font-extrabold text-primary md:text-4xl">
                    <StatCounter value={stat.value} />
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{loc(stat, "label", locale)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* SERVICES / WHY CHOOSE US                                            */}
      {/* ================================================================== */}
      {showServices && (
        <section id="sec-services" className="container py-20 md:py-28">
          <div data-animate>
            {s(settings, "home_services_eyebrow", locale) && (
              <div className="mb-4">
                <SectionTag>{s(settings, "home_services_eyebrow", locale)}</SectionTag>
              </div>
            )}
            {servicesTitle && (
              <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-navy-950 md:text-[2.4rem] leading-[1.15]">
                {servicesTitle}
              </h2>
            )}
            {servicesText && (
              <p className="mb-10 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {servicesText}
              </p>
            )}
          </div>

          <ServicesTabs
            services={services.map((svc) => ({
              id: svc.id,
              slug: svc.slug ?? null,
              title: loc(svc, "title", locale),
              description: loc(svc, "description", locale),
              icon: svc.icon ?? null,
              image: svc.image ?? null,
              href: `/${locale}/services/${svc.slug ?? svc.id}`,
            }))}
            fallbackImage={servicesImage || heroImage}
            servicesLinkLabel={servicesLinkLabel}
            servicesHref={`/${locale}/services`}
          />
        </section>
      )}

      {/* ================================================================== */}
      {/* TOTAL CARE MODEL                                                    */}
      {/* ================================================================== */}
      {showModel && (
        <section id="sec-model" className="container pb-20 md:pb-28">
          {/* Heading */}
          <div data-animate className="mx-auto mb-8 max-w-2xl text-center">
            {modelEyebrow && <SectionTag>{modelEyebrow}</SectionTag>}
            {modelTitle && (
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-950 md:text-4xl">
                {modelTitle}
              </h2>
            )}
            {modelText && (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground max-w-lg mx-auto">
                {modelText}
              </p>
            )}
          </div>

          {/* Full-width image with caption overlay */}
          {modelImage && (
            <div data-animate className="relative overflow-hidden rounded-3xl min-h-[340px] md:min-h-[440px] shadow-lg">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${modelImage})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent" />
              {modelCaption && (
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                  <p className="max-w-2xl text-sm leading-relaxed text-white/90 md:text-base">
                    {modelCaption}
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ================================================================== */}
      {/* FEATURED PROJECTS                                                   */}
      {/* ================================================================== */}
      {showProjects && (
        <section id="sec-projects" className="bg-brand-50/60 py-16 md:py-24">
          <div className="container">
            {(projectsTitle || projectsText) && (
              <div data-animate className="mb-12 max-w-3xl">
                {s(settings, "home_projects_eyebrow", locale) && (
                  <SectionTag>{s(settings, "home_projects_eyebrow", locale)}</SectionTag>
                )}
                {projectsTitle && (
                  <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-950 md:text-4xl">
                    {projectsTitle}
                  </h2>
                )}
                {projectsText && (
                  <p className="mt-3 leading-relaxed text-muted-foreground">{projectsText}</p>
                )}
              </div>
            )}
            <div data-stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/${locale}/projects/${project.slug ?? project.id}`}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm border border-border/60 transition-all hover:-translate-y-1.5 hover:shadow-md"
                >
                  {project.image && (
                    <div className="relative aspect-[5/4] overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url(${project.image})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-transparent" />
                      <Badge className="absolute left-4 top-4 rounded-full border-0 bg-white/80 text-navy-900 text-xs font-semibold capitalize backdrop-blur-sm">
                        {(dict.common as any)[project.status] ?? project.status}
                      </Badge>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <h3 className="font-bold leading-snug text-navy-950 transition-colors group-hover:text-primary">
                      {loc(project, "title", locale)}
                    </h3>
                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {loc(project, "description", locale)}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-bold text-primary">
                      {dict.common.readMore}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            {projectsLinkLabel && (
              <div data-animate className="mt-10 text-center">
                <Button asChild variant="outline" size="lg" className="rounded-full px-8 font-semibold border-border hover:border-primary hover:text-primary">
                  <Link href={`/${locale}/projects`}>{projectsLinkLabel}</Link>
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* GET IN TOUCH BAND                                                   */}
      {/* ================================================================== */}
      {showContact && (
        <section id="sec-contact" className="relative overflow-hidden bg-navy-950 py-16 text-white md:py-24">
          {contactImage && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-15"
              style={{ backgroundImage: `url(${contactImage})` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/60 via-transparent to-navy-950/60" />
          <div className="container relative grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div data-animate>
              <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-to-br from-destructive to-red-700 p-10 text-center shadow-xl">
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full bg-white/15 ring-2 ring-white/30">
                  <PhoneCall className="h-6 w-6" />
                </span>
                {contactCardTitle && (
                  <h3 className="text-2xl font-extrabold">{contactCardTitle}</h3>
                )}
                <span className="mx-auto my-4 block h-0.5 w-8 rounded-full bg-white/50" />
                {address && <p className="whitespace-pre-line text-sm text-white/90">{address}</p>}
                {phone && (
                  <a
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className="mt-4 block font-number text-xl font-bold hover:underline"
                  >
                    {phone}
                  </a>
                )}
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="mt-2 inline-flex items-center gap-1.5 text-sm text-white/90 hover:underline"
                  >
                    <Mail className="h-3.5 w-3.5" /> {email}
                  </a>
                )}
              </div>
            </div>
            <div data-animate data-delay="0.15">
              {s(settings, "home_contact_eyebrow", locale) && (
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-400">
                  {s(settings, "home_contact_eyebrow", locale)}
                </p>
              )}
              {contactTitle && (
                <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
                  {contactTitle}
                </h2>
              )}
              <span className="mt-4 flex gap-1.5">
                <span className="block h-1 w-8 rounded-full bg-destructive" />
                <span className="block h-1 w-4 rounded-full bg-destructive/60" />
              </span>
              {contactText && (
                <p className="mt-6 max-w-xl whitespace-pre-line leading-relaxed text-white/75">
                  {contactText}
                </p>
              )}
              {contactButton && (
                <Button
                  asChild
                  size="lg"
                  className="mt-8 rounded-full bg-destructive px-8 font-bold shadow-lg shadow-destructive/30 hover:bg-destructive/90"
                >
                  <Link href={`/${locale}/contact`}>
                    {contactButton} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* TESTIMONIALS — Real Stories                                         */}
      {/* ================================================================== */}
      {showTestimonials && (
        <section id="sec-testimonials" className="container py-16 md:py-24">
          {/* Centered heading */}
          <div data-animate className="mx-auto mb-14 max-w-2xl text-center">
            {s(settings, "home_testimonials_eyebrow", locale) && (
              <div className="mb-3">
                <SectionTag>{s(settings, "home_testimonials_eyebrow", locale)}</SectionTag>
              </div>
            )}
            <h2 className="text-3xl font-extrabold tracking-tight text-navy-950 md:text-[2.4rem] leading-[1.2]">
              {testimonialsTitle || "Real Stories, Real Healing — From Our Community"}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Providing patient-centered care through expert guidance, innovative solutions, and
              personalized support every step of the way.
            </p>
          </div>

          {/* 3-column testimonial cards */}
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t, i) => {
              const authorName = loc(t, "author", locale) || "Anonymous";
              const initials = authorName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);
              return (
                <div
                  key={t.id}
                  className={`flex flex-col rounded-3xl border border-border/60 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${i === 1 ? "md:mt-6" : ""
                    }`}
                >
                  {/* Review title */}
                  <p className="mb-1 text-xs font-bold uppercase tracking-wide text-primary">
                    {i === 0 ? "Friendly staff review" : i === 1 ? "Seamless experience" : "Excellent care"}
                  </p>

                  {/* Stars */}
                  <div className="mb-4 flex gap-0.5">
                    {[...Array(5)].map((_, si) => (
                      <Star key={si} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="flex-1 text-sm leading-relaxed text-navy-800/80 italic">
                    &ldquo;{loc(t, "quote", locale)}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="mt-6 flex items-center gap-3 border-t border-border/40 pt-5">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-bold text-primary">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-navy-950">{authorName}</p>
                      <p className="text-xs text-muted-foreground">Regular Patient</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* NEWS + EVENTS — "Explore Expert Insights"                           */}
      {/* ================================================================== */}
      {showNewsEvents && (
        <section id="sec-news" className="container pb-16 md:pb-24">
          {/* Section header: left heading, right subtitle — matches reference */}
          {showNews && (
            <div className="mb-12 grid gap-6 md:grid-cols-[1fr_1fr] items-end">
              <div data-animate>
                {s(settings, "home_news_eyebrow", locale) && (
                  <div className="mb-3">
                    <SectionTag>{s(settings, "home_news_eyebrow", locale)}</SectionTag>
                  </div>
                )}
                <h2 className="text-3xl font-extrabold tracking-tight text-navy-950 md:text-[2.4rem] leading-[1.2]">
                  {newsTitle || "Explore Expert Insights for a Healthier, Happier Life"}
                </h2>
              </div>
              <div data-animate data-delay="0.1">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Discover expert health insights, wellness advice, and medical updates to help you
                  make informed decisions and live a healthier life every day.
                </p>
              </div>
            </div>
          )}

          {/* 3-col news grid */}
          {showNews && (
            <div data-stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
              {news.map((item) => (
                <Link
                  key={item.id}
                  href={`/${locale}/news/${item.slug ?? item.id}`}
                  className="group flex flex-col"
                >
                  {/* Card image */}
                  <div className="mb-4 h-52 w-full overflow-hidden rounded-3xl bg-brand-100 relative">
                    {item.image ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="h-12 w-12 text-primary/20" />
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex flex-1 flex-col">
                    <h3 className="mb-2 text-base font-bold leading-snug text-navy-950 transition-colors group-hover:text-primary">
                      {loc(item, "title", locale)}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {loc(item, "excerptEn" as any, locale) || loc(item, "content" as any, locale)?.substring(0, 110)}...
                    </p>
                    <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-4">
                      <span className="flex items-center gap-1 text-sm font-bold text-primary group-hover:gap-2 transition-all">
                        Read More <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.publishedAt, locale)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Events below news */}
          {showEvents && (
            <div id="sec-events" data-animate>
              {eventsTitle && (
                <div className="mb-8">
                  {s(settings, "home_events_eyebrow", locale) && (
                    <SectionTag>{s(settings, "home_events_eyebrow", locale)}</SectionTag>
                  )}
                  <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-navy-950 md:text-3xl">
                    {eventsTitle}
                  </h2>
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <Link
                    key={event.id}
                    href={`/${locale}/events/${event.slug ?? event.id}`}
                    className="group flex gap-4 rounded-3xl border border-border/60 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-md"
                  >
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-primary text-white shadow-sm">
                      <span className="font-number text-lg font-bold leading-none">
                        {new Date(event.startDate).getDate()}
                      </span>
                      <span className="mt-0.5 text-[9px] uppercase font-medium opacity-80">
                        {new Date(event.startDate).toLocaleString("en", { month: "short" })}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold leading-snug text-navy-950 transition-colors group-hover:text-primary">
                        {loc(event, "title", locale)}
                      </h3>
                      {event.location && (
                        <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 text-primary" /> {event.location}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
              {eventsLinkLabel && (
                <div className="mt-6 text-center">
                  <Button asChild variant="outline" className="rounded-full px-8 font-semibold">
                    <Link href={`/${locale}/events`}>
                      <CalendarDays className="h-4 w-4 mr-2" /> {eventsLinkLabel}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* ================================================================== */}
      {/* PARTNERS                                                            */}
      {/* ================================================================== */}
      {showPartners && (
        <section id="sec-partners" className="container pb-16 md:pb-24">
          {(partnersTitle || s(settings, "home_partners_eyebrow", locale)) && (
            <div data-animate className="mx-auto mb-10 max-w-2xl text-center">
              {s(settings, "home_partners_eyebrow", locale) && (
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  {s(settings, "home_partners_eyebrow", locale)}
                </p>
              )}
              {partnersTitle && (
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-navy-950 md:text-3xl">
                  {partnersTitle}
                </h2>
              )}
            </div>
          )}
          <div data-stagger className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {partners.map((partner) => (
              <div
                key={partner.id}
                className="flex items-center justify-center rounded-2xl border border-border/50 bg-white px-4 py-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
              >
                {partner.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-10 w-auto object-contain opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                  />
                ) : (
                  <span className="text-sm font-semibold text-navy-800">{partner.name}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================================================================== */}
      {/* DONATE CTA                                                          */}
      {/* ================================================================== */}
      {showDonate && (
        <section id="sec-donate" className="container pb-20 md:pb-28">
          <div
            data-animate
            className="relative grid items-center gap-8 overflow-hidden rounded-[2rem] bg-gradient-to-br from-navy-900 via-brand-800 to-brand-600 p-10 text-white shadow-xl md:grid-cols-[1.2fr_auto] md:p-14"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-white/5 blur-3xl" />
            <div className="relative">
              {s(settings, "home_donate_eyebrow", locale) && (
                <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white/70">
                  <span className="block h-0.5 w-6 rounded-full bg-white/60" />
                  {s(settings, "home_donate_eyebrow", locale)}
                </p>
              )}
              {donateTitle && (
                <h2 className="mt-4 max-w-2xl text-2xl font-extrabold md:text-4xl">{donateTitle}</h2>
              )}
              {donateText && (
                <p className="mt-3 max-w-xl whitespace-pre-line leading-relaxed text-white/75">
                  {donateText}
                </p>
              )}
            </div>
            {(donateButton || donateButton2) && (
              <div className="relative flex flex-wrap gap-3">
                {donateButton && (
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full bg-white px-8 font-bold text-brand-700 shadow-xl hover:bg-white/90"
                  >
                    <Link href={`/${locale}/donate`}>
                      <Heart className="h-4 w-4 fill-destructive text-destructive" /> {donateButton}
                    </Link>
                  </Button>
                )}
                {donateButton2 && (
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full border-white/40 bg-transparent px-8 font-semibold text-white hover:border-white hover:bg-white/10 hover:text-white"
                  >
                    <Link href={`/${locale}/contact`}>{donateButton2}</Link>
                  </Button>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
