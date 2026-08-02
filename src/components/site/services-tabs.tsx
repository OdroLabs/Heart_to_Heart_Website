"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                                */
/* ------------------------------------------------------------------ */
export interface ServiceTabItem {
  id: number;
  slug: string | null;
  title: string;
  description: string;
  icon: string | null;
  image: string | null;
  href: string;
}

interface ServicesTabsProps {
  services: ServiceTabItem[];
  /** Fallback image when a service has no image */
  fallbackImage?: string;
  /** CTA button label */
  servicesLinkLabel?: string;
  /** Base services listing URL, e.g. "/en/services" */
  servicesHref: string;
}

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */
export function ServicesTabs({
  services,
  fallbackImage,
  servicesLinkLabel,
  servicesHref,
}: ServicesTabsProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = services[activeIdx] ?? services[0];

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] items-start">
      {/* ─────────── Left: heading + vertical service list ─────────── */}
      <div>
        {/* Counter */}
        <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground font-semibold tracking-wider uppercase">
          <span>Services List</span>
          <span className="font-number tabular-nums">
            {String(activeIdx + 1).padStart(2, "0")}/
            {String(services.length).padStart(2, "0")}
          </span>
        </div>

        {/* Service items */}
        <div className="space-y-1 mb-10">
          {services.map((service, idx) => {
            const isActive = idx === activeIdx;
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`group flex w-full items-center justify-between rounded-2xl px-5 py-4 text-left transition-all duration-300 ${
                  isActive
                    ? "bg-white shadow-md border border-border text-primary"
                    : "hover:bg-brand-50/70 border border-transparent text-navy-800 hover:text-primary"
                }`}
              >
                <div className="flex items-center gap-3">
                  {service.icon && (
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${
                        isActive ? "bg-brand-50" : "bg-brand-50/60"
                      }`}
                    >
                      <span className="text-base">{service.icon}</span>
                    </span>
                  )}
                  <span className="text-sm font-semibold">
                    {service.title}
                  </span>
                </div>
                {isActive && (
                  <ArrowRight className="h-4 w-4 text-primary opacity-70" />
                )}
              </button>
            );
          })}
        </div>

        {/* CTA button */}
        {servicesLinkLabel && (
          <Link
            href={servicesHref}
            className="inline-flex items-center gap-0 rounded-full bg-primary pl-6 pr-1.5 py-1.5 text-sm font-bold text-white shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
          >
            {servicesLinkLabel}
            <span className="ml-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white shrink-0">
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        )}
      </div>

      {/* ─────────── Right: image + details card ─────────── */}
      <div className="grid grid-cols-2 gap-4">
        {/* Photo — transitions with each selection */}
        <div className="relative overflow-hidden rounded-3xl shadow-md min-h-[320px] bg-brand-100">
          {active.image ? (
            <div
              key={`img-${active.id}`}
              className="absolute inset-0 bg-cover bg-center animate-fade-in"
              style={{ backgroundImage: `url(${active.image})` }}
            />
          ) : fallbackImage ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${fallbackImage})` }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Heart className="h-16 w-16 text-primary/20" />
            </div>
          )}

          {/* Small floating badge showing service icon */}
          {active.icon && (
            <div className="absolute top-5 right-5 z-10 grid h-12 w-12 place-items-center rounded-2xl bg-white/80 backdrop-blur-md text-xl shadow-lg border border-white/60">
              {active.icon}
            </div>
          )}
        </div>

        {/* Details card — teal/primary card */}
        <div
          key={`card-${active.id}`}
          className="rounded-3xl bg-primary text-white p-7 flex flex-col justify-between min-h-[320px] shadow-lg animate-fade-in"
        >
          {/* Title */}
          <div>
            <h3 className="text-xl font-extrabold leading-snug mb-3">
              {active.title}
            </h3>
            <p className="text-sm leading-relaxed text-white/80 line-clamp-5">
              {active.description}
            </p>
          </div>

          {/* Bottom: service pills + Explore More button */}
          <div className="mt-auto pt-6 space-y-4">
            {/* Service name pills */}
            <div className="flex flex-wrap gap-2">
              {services.slice(0, 6).map((s_item) => (
                <span
                  key={s_item.id}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    s_item.id === active.id
                      ? "bg-white text-primary shadow-sm"
                      : "border border-white/30 bg-white/10 text-white/90 hover:bg-white/20"
                  }`}
                >
                  {s_item.title}
                </span>
              ))}
            </div>

            {/* Explore More CTA */}
            <Link
              href={active.href}
              className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 px-5 py-2.5 text-sm font-bold text-white hover:bg-white hover:text-primary transition-all duration-300 group"
            >
              Explore More
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
