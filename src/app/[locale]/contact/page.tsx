import { Phone, Mail, MapPin, Clock } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { buildSocials } from "@/lib/nav";
import { getSettings, s, show } from "@/lib/settings";
import { PageHero } from "@/components/site/page-hero";
import { ContactForm } from "@/components/site/contact-form";

export default async function ContactPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const settings = await getSettings();
  const dict = getLabels(locale, settings);

  let mapEmbed = s(settings, "map_embed");
  if (mapEmbed.includes("<iframe") && mapEmbed.includes("src=")) {
    const match = mapEmbed.match(/src="([^"]+)"/);
    if (match) mapEmbed = match[1];
  }

  const socials = buildSocials(settings);

  // Blank values drop out of the details panel entirely.
  const items = [
    { icon: MapPin, label: dict.contact.address, value: s(settings, "address", locale) },
    { icon: Phone, label: dict.common.phone, value: s(settings, "phone") },
    { icon: Phone, label: dict.common.phone, value: s(settings, "phone2") },
    { icon: Mail, label: dict.common.email, value: s(settings, "email") },
    { icon: Mail, label: dict.common.email, value: s(settings, "email2") },
    { icon: Clock, label: dict.contact.hours, value: s(settings, "office_hours", locale) },
  ].filter((item) => item.value);

  const contactTitle = "Get In Touch";
  const contactIntro = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet accumsan eros, sit amet auctor nunc. Nullam ac purus.";
  
  const formTitle = s(settings, "contact_form_title", locale) || "Send a Message";
  const formNote = s(settings, "contact_form_note", locale);
  const successMessage = s(settings, "contact_success_message", locale);

  const showDetails = show(settings, "show_contact_details", items, socials);
  const showForm = show(settings, "show_contact_form");
  const showMap = show(settings, "show_contact_map", mapEmbed);

  return (
    <div className="bg-[#e9e9e9]/30 min-h-screen flex flex-col">
      <PageHero
        title={s(settings, "contact_hero_title", locale)}
        intro={s(settings, "contact_hero_intro", locale)}
        image={s(settings, "contact_hero_image") || undefined}
      />
      <div className="container py-16 md:py-24 flex-grow">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-16 items-start max-w-6xl mx-auto">
          
          {/* Left Column: Details */}
          <div className="space-y-8 lg:pr-8" data-animate>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-navy-950 mb-4">
                {contactTitle}
              </h1>
              <p className="text-[15px] text-muted-foreground leading-relaxed whitespace-pre-line max-w-md">
                {contactIntro}
              </p>
            </div>

            {showDetails && (
              <div className="space-y-6 pt-2">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center gap-5">
                    <div className="flex-shrink-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-sm">
                        <item.icon className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-navy-950 text-[15px]">{item.label}</h3>
                      <p className="text-sm text-muted-foreground mt-0.5 whitespace-pre-line">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Social Links */}
            {showDetails && socials.length > 0 && (
              <div className="pt-8 mt-8 border-t border-border/50 max-w-md">
                <p className="font-bold text-navy-950 mb-5">{dict.contact.followUs || "Follow Us:"}</p>
                <div className="flex flex-wrap items-center gap-4">
                  {socials.map((social) => (
                    <a
                      key={social.key}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 transition-transform hover:-translate-y-0.5 shadow-sm"
                      title={social.label}
                    >
                      <span className="text-sm font-bold">{social.label.charAt(0)}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Form */}
          {showForm && (
            <div className="w-full max-w-[500px] mx-auto lg:mx-0 lg:ml-auto" data-animate data-delay="0.1">
              <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-border/20">
                <h2 className="text-2xl md:text-3xl font-medium text-navy-950 mb-8 font-serif">
                  {formTitle}
                </h2>
                {formNote && (
                  <p className="mb-6 text-sm text-muted-foreground">{formNote}</p>
                )}
                <ContactForm dict={dict} successMessage={successMessage} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map Section */}
      {showMap && (
        <div id="sec-map" className="w-full mt-12" data-animate>
          <iframe
            src={mapEmbed}
            className="h-[350px] md:h-[450px] w-full border-0 filter grayscale contrast-125 opacity-90"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Map"
          />
        </div>
      )}
    </div>
  );
}
