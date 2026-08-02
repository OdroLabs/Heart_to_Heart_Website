"use client";

import { useRef, useEffect } from "react";

interface MarqueeProps {
  items: string[];
}

export function MarqueeTrustBar({ items }: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  // Pure CSS animation — no GSAP needed for a simple marquee
  const doubled = [...items, ...items]; // duplicate for seamless loop

  return (
    <section id="sec-marquee" className="overflow-hidden border-y border-border/60 bg-white py-4">
      <div
        ref={trackRef}
        className="flex items-center gap-10 whitespace-nowrap"
        style={{
          animation: "marquee-scroll 30s linear infinite",
          width: "max-content",
        }}
      >
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-3 text-sm font-semibold text-navy-800/70">
            <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
            {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
