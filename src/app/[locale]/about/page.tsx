import { Eye, Target, Users, BookOpen, Sparkles, History, Heart } from "lucide-react";
import { type Locale, loc } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s, sPairs } from "@/lib/settings";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/site/page-hero";

export default async function AboutPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const settings = await getSettings();
  const dict = getLabels(locale, settings);

  const overviewTitle = s(settings, "about_overview_title", locale);
  const overview = s(settings, "about_overview", locale);
  const overviewImage = s(settings, "about_overview_image");

  const visionTitle = s(settings, "about_vision_title", locale);
  const vision = s(settings, "about_vision", locale);
  const missionTitle = s(settings, "about_mission_title", locale);
  const mission = s(settings, "about_mission", locale);

  const valuesTitle = s(settings, "about_values_title", locale);
  const values = sPairs(settings, "about_values", locale);

  const communityTitle = s(settings, "about_community_title", locale);
  const community = s(settings, "about_community", locale);

  const historyTitle = s(settings, "about_history_title", locale);
  const history = s(settings, "about_history", locale);
  const historyImage = s(settings, "about_history_image");

  const historyTimeline = sPairs(settings, "about_history_timeline", locale);

  const teamTitle = s(settings, "about_team_title", locale);
  const teamDescription = s(settings, "about_team_description", locale);
  const teamMembers = await (prisma.teamMember ? prisma.teamMember.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  }) : Promise.resolve([]));

  const stats = await prisma.stat.findMany({
    orderBy: { order: "asc" },
    take: 3,
  });

  const extraTitle = s(settings, "about_extra_title", locale);
  const extraText = s(settings, "about_extra_text", locale);

  // Each card only appears when it has text.
  const blocks = [
    { icon: Eye, title: visionTitle, text: vision, color: "bg-primary" },
    { icon: Target, title: missionTitle, text: mission, color: "bg-teal-600" },
  ].filter((b) => b.text);

  /** Heading + prose block, rendered only when there is text. */
  const TextBlock = ({
    id,
    icon: Icon,
    title,
    text,
    image,
  }: {
    id: string;
    icon: typeof Eye;
    title: string;
    text: string;
    image?: string;
  }) => {
    if (!text) return null;
    return (
      <section
        id={id}
        className={`grid items-start gap-8 ${image ? "lg:grid-cols-2" : "max-w-3xl"}`}
      >
        <div data-animate>
          {title && (
            <div className="mb-8">
              <p className="font-bold text-xs text-primary tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
                <span className="block h-0.5 w-6 rounded-full bg-primary"></span>
                {title}
              </p>
              <h2 className="text-3xl md:text-[2.75rem] font-extrabold leading-[1.1] tracking-tight text-navy-950">{title}</h2>
            </div>
          )}
          <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{text}</p>
        </div>
        {image && (
          <div data-animate data-delay="0.12" className="overflow-hidden rounded-3xl shadow-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={title} className="aspect-[4/3] w-full object-cover" />
          </div>
        )}
      </section>
    );
  };

  return (
    <>
      <PageHero
        title={s(settings, "about_hero_title", locale)}
        intro={s(settings, "about_hero_intro", locale)}
        image={s(settings, "about_hero_image") || undefined}
      />

      <div className="container space-y-12 py-12 md:space-y-16 md:py-16">
        {overview && (
          <section id="sec-overview" className="grid gap-12 lg:grid-cols-2 items-center mb-16 mt-8">
            {/* Left Image Side */}
            {overviewImage ? (
              <div data-animate className="relative max-w-md mx-auto lg:max-w-none">
                <div className="overflow-hidden rounded-[2.5rem] aspect-square lg:aspect-[5/4] shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={overviewImage} alt="Overview" className="h-full w-full object-cover" />
                </div>
                {/* Floating Card */}
                {/* <div className="absolute -bottom-6 -right-6 md:bottom-8 md:-right-8 lg:bottom-12 lg:-right-8 rounded-3xl bg-white p-5 shadow-xl border border-border/40 max-w-[260px] flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                  <div className="flex flex-shrink-0 items-center justify-center h-12 w-12 rounded-full bg-primary/10 text-primary">
                    <Heart className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-navy-950 text-base mb-1">Quality Healthcare</h4>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      Facilisis nulla lacus at ultrices us praesent fringilla scelerisque.
                    </p>
                  </div>
                </div> */}
              </div>
            ) : (
              <div />
            )}

            {/* Right Content Side */}
            <div data-animate data-delay="0.1" className="lg:pl-8">
              <p className="font-bold text-xs text-primary tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
                <span className="block h-0.5 w-6 rounded-full bg-primary"></span>
                About Us
              </p>
              <h2 className="text-3xl md:text-[2.5rem] font-extrabold text-navy-950 leading-[1.15] mb-6">
                {overviewTitle || "Our Practice Excellent Care, Humane Principles"}
              </h2>
              <p className="text-muted-foreground text-[15px] leading-relaxed mb-10 whitespace-pre-line">
                {overview}
              </p>

              {/* Stats */}
              {stats.length > 0 && (
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                  {stats.map((stat, i) => (
                    <div
                      key={stat.id}
                      className={`rounded-2xl p-4 md:p-5 flex flex-col justify-center transition-transform hover:-translate-y-1 ${i === 0 ? "bg-navy-950 text-white shadow-md" : "bg-muted/40 text-navy-950 border border-border/40"
                        }`}
                    >
                      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${i === 0 ? "bg-white/10 text-white" : "bg-white text-primary shadow-sm"}`}>
                        {i === 0 ? <Users className="h-5 w-5" /> : i === 1 ? <Target className="h-5 w-5" /> : <Heart className="h-5 w-5" />}
                      </div>
                      <div className="font-black text-xl md:text-2xl mb-1">{stat.value}</div>
                      <div className={`text-[11px] font-medium uppercase tracking-wider ${i === 0 ? "text-white/70" : "text-muted-foreground"}`}>
                        {loc(stat, "label", locale)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {blocks.length > 0 && (
          <div id="sec-visionmission" className="grid gap-6 md:grid-cols-2">
            {blocks.map((block) => (
              <Card key={block.title || block.text} className="overflow-hidden" data-animate>
                <CardContent className="pt-6">
                  <div
                    className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full ${block.color} text-white`}
                  >
                    <block.icon className="h-6 w-6" />
                  </div>
                  {block.title && <h3 className="mb-2 text-lg font-bold">{block.title}</h3>}
                  <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                    {block.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {values.length > 0 && (
          <section id="sec-values" data-animate>
            {valuesTitle && (
              <div className="mb-10">
                <p className="font-bold text-xs text-primary tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
                  <span className="block h-0.5 w-6 rounded-full bg-primary"></span>
                  {valuesTitle}
                </p>
                <h2 className="text-3xl md:text-[2.75rem] font-extrabold leading-[1.1] tracking-tight text-navy-950">{valuesTitle}</h2>
              </div>
            )}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {values.map((value, i) => (
                <div
                  key={i}
                  className="rounded-3xl border border-border bg-white p-6 shadow-card transition-shadow hover:shadow-card-hover"
                >
                  <span className="font-number text-sm font-bold text-primary/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-bold text-navy-900">{value.left}</h3>
                  {value.right && (
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {value.right}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <TextBlock id="sec-community" icon={Users} title={communityTitle} text={community} />

        {history && (
          <section id="sec-history" className="relative mt-24 mb-16 overflow-hidden bg-navy-950 text-white rounded-[2.5rem] shadow-xl">
            {historyImage && (
              <div
                data-parallax="5"
                className="absolute -inset-y-[20%] inset-x-0 scale-125 bg-cover bg-center opacity-40"
                style={{ backgroundImage: `url(${historyImage})` }}
              />
            )}
            <div className={`absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-900 to-brand-800 ${historyImage ? "opacity-80" : ""}`} />
            {/* <div
              className="pointer-events-none absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            /> */}

            <div className="relative px-8 py-20 md:p-24">
              <div className="max-w-3xl" data-animate>
                <p className="font-bold text-xs text-accent tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
                  <span className="block h-0.5 w-6 rounded-full bg-accent"></span>
                  Our Story
                </p>
                {historyTitle && (
                  <h2 className="text-3xl md:text-[2.75rem] font-extrabold leading-[1.1] tracking-tight mb-8 text-white">{historyTitle}</h2>
                )}
                <p className="whitespace-pre-line leading-relaxed text-white/80 md:text-lg">
                  {history}
                </p>
              </div>
            </div>
          </section>
        )}

        {historyTimeline.length > 0 && (
          <section id="sec-timeline" data-animate className="mt-12 mb-12">
            <div className="rounded-[2.5rem] bg-white p-8 md:p-12 shadow-sm ring-1 ring-border/50 relative overflow-hidden">
              <div className="absolute top-8 left-1/2 -translate-x-1/2 text-2xl font-black uppercase  text-primary select-none pointer-events-none">
                History
              </div>
              <div className="overflow-x-auto scrollbar-hide -mx-8 px-8 md:mx-0 md:px-0 pt-12">
                <div className="min-w-max flex flex-col mx-auto px-4 pb-4">
                  {/* Row 1: Top Content */}
                  <div className="flex justify-between gap-8 items-end pb-4">
                    {historyTimeline.map((item, i) => (
                      <div key={i} className="relative flex w-56 flex-col items-center justify-end h-32 shrink-0">
                        {i % 2 !== 0 && (
                          <div className="absolute bottom-0 h-20 w-px bg-primary/20 -z-10" />
                        )}
                        {i % 2 === 0 ? (
                          <div className="text-2xl font-black text-primary">{item.left}</div>
                        ) : (
                          <div className="text-center text-sm font-medium text-muted-foreground pb-12 px-4 leading-relaxed">{item.right}</div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Row 2: Circles and Line */}
                  <div className="relative flex justify-between gap-8 items-center">
                    <div className="absolute left-28 right-28 top-1/2 h-[2px] -translate-y-1/2 bg-primary/20" />
                    {historyTimeline.map((item, i) => (
                      <div key={i} className="relative z-10 flex w-56 justify-center shrink-0">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white ring-4 ring-primary/20">
                          <div className="h-2.5 w-2.5 rounded-full bg-primary" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Row 3: Bottom Content */}
                  <div className="flex justify-between gap-8 items-start pt-4">
                    {historyTimeline.map((item, i) => (
                      <div key={i} className="relative flex w-56 flex-col items-center justify-start h-32 shrink-0">
                        {i % 2 === 0 && (
                          <div className="absolute top-0 h-20 w-px bg-primary/20 -z-10" />
                        )}
                        {i % 2 === 0 ? (
                          <div className="text-center text-sm font-medium text-muted-foreground pt-12 px-4 leading-relaxed">{item.right}</div>
                        ) : (
                          <div className="text-2xl font-black text-primary">{item.left}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {teamMembers.length > 0 && (
          <section id="sec-team" data-animate className="pt-6 pb-12">
            {(teamTitle || teamDescription) && (
              <div className="mb-12 flex flex-col items-center justify-center text-center">
                <p className="font-bold text-xs text-[#2c7a5b] tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
                  <span className="block h-0.5 w-6 rounded-full bg-[#2c7a5b]"></span>
                  {teamTitle || "BOD and Staff"}
                  <span className="block h-0.5 w-6 rounded-full bg-[#2c7a5b]"></span>
                </p>
                <h2 className="text-3xl md:text-[2.75rem] font-extrabold leading-[1.1] tracking-tight text-navy-950 mb-4">{teamTitle || "BOD and Staff"}</h2>
                <p className="max-w-2xl text-[15px] text-muted-foreground leading-relaxed">
                  {teamDescription || "Meet our dedicated board of directors and professional staff who guide our mission and vision with passion and expertise."}
                </p>
              </div>
            )}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="group overflow-hidden rounded-[1.25rem] bg-white border border-border/40 shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-md">
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted/30">
                    {member.image ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url(${member.image})` }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                        <Users className="h-12 w-12 text-primary/20" />
                      </div>
                    )}
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="font-bold text-navy-950 text-base">{member.name}</h3>
                    <p className="mt-1 text-[13px] font-medium text-[#2c7a5b]">
                      {loc(member, "role", locale) || "Team Member"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {extraText && (
          <section
            id="sec-extra"
            data-animate
            className="rounded-[2rem] bg-gradient-to-br from-navy-900 via-brand-800 to-brand-600 p-10 text-white shadow-glow md:p-14"
          >
            {extraTitle && <h2 className="text-2xl font-extrabold md:text-3xl">{extraTitle}</h2>}
            <p className="mt-3 max-w-3xl whitespace-pre-line leading-relaxed text-white/80">
              {extraText}
            </p>
          </section>
        )}
      </div>
    </>
  );
}
