"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Heart } from "lucide-react";

/**
 * The full Coming Soon hero — logo, headline, message and the ambient
 * background (blobs, ring, grid, grain, cursor glow) — as one client
 * component so GSAP can own refs on every piece it animates.
 *
 * Everything here is visible in the initial server-rendered HTML (no
 * opacity-0 defaults), so the page reads fine with JavaScript off or with
 * `prefers-reduced-motion` set; the effects below only ever add motion on
 * top of that baseline, never gate visibility on it.
 */
export function ComingSoonScene({
  logoImage,
  logoLetter,
  siteName,
  eyebrow,
  lines,
  message,
  backgroundImage,
}: {
  logoImage?: string;
  logoLetter?: string;
  siteName: string;
  eyebrow: string;
  lines: string[];
  message?: string;
  backgroundImage?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const lineWrapRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const messageRef = useRef<HTMLParagraphElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    let cleanupMove: (() => void) | undefined;

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      const lineEls = lineWrapRefs.current.filter(Boolean) as HTMLSpanElement[];

      gsap.set(bgRef.current, { opacity: 0 });
      gsap.set(logoRef.current, { opacity: 0, y: 22 });
      gsap.set(eyebrowRef.current, { opacity: 0, y: 14 });
      gsap.set(lineEls, { yPercent: 110, opacity: 0 });
      if (messageRef.current) gsap.set(messageRef.current, { opacity: 0, y: 14 });

      tl.to(bgRef.current, { opacity: 1, duration: 1.6, ease: "power1.out" }, 0)
        .to(logoRef.current, { opacity: 1, y: 0, duration: 0.9 }, 0.15)
        .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.7 }, 0.4)
        .to(lineEls, { yPercent: 0, opacity: 1, duration: 1, stagger: 0.14, ease: "power4.out" }, 0.55);
      if (messageRef.current) {
        tl.to(messageRef.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.4");
      }

      // Desktop-only cursor-follow glow + very subtle parallax drift on the
      // ambient blobs. Touch devices skip this entirely.
      const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (canHover && glowRef.current) {
        const glowX = gsap.quickTo(glowRef.current, "x", { duration: 0.7, ease: "power3" });
        const glowY = gsap.quickTo(glowRef.current, "y", { duration: 0.7, ease: "power3" });
        const blobs = blobRefs.current.filter(Boolean) as HTMLDivElement[];
        const blobSetters = blobs.map((el, i) => ({
          x: gsap.quickTo(el, "x", { duration: 1.2, ease: "power3" }),
          y: gsap.quickTo(el, "y", { duration: 1.2, ease: "power3" }),
          strength: 10 + i * 6,
        }));

        const onMove = (e: MouseEvent) => {
          const rect = root.getBoundingClientRect();
          glowX(e.clientX - rect.left);
          glowY(e.clientY - rect.top);
          const nx = (e.clientX / window.innerWidth) * 2 - 1;
          const ny = (e.clientY / window.innerHeight) * 2 - 1;
          blobSetters.forEach((b) => {
            b.x(nx * b.strength);
            b.y(ny * b.strength);
          });
        };
        root.addEventListener("mousemove", onMove);
        gsap.to(glowRef.current, { opacity: 1, duration: 1, delay: 0.6 });
        cleanupMove = () => root.removeEventListener("mousemove", onMove);
      }

      return () => {
        tl.kill();
        cleanupMove?.();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-navy-950 px-6 py-20 text-center text-white"
    >
      {/* Cursor-follow glow (desktop only, positioned by GSAP quickTo) */}
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-0 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-[100px] motion-reduce:hidden"
        style={{ background: "radial-gradient(circle, rgba(181,35,178,0.35), transparent 70%)" }}
      />

      {/* Ambient background layer */}
      <div ref={bgRef} className="absolute inset-0 motion-reduce:opacity-100">
        {backgroundImage ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center opacity-25 motion-safe:animate-zoom-slow"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-navy-950/85 via-navy-950/90 to-navy-950" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-navy-950 via-[#1a0219] to-brand-950" />
        )}

        {/* Large blurred ambient shapes, gently drifting */}
        <div
          ref={(el) => { blobRefs.current[0] = el; }}
          className="absolute -left-32 -top-24 h-[34rem] w-[34rem] rounded-full bg-brand-500/25 blur-[110px] motion-safe:animate-drift-1"
        />
        <div
          ref={(el) => { blobRefs.current[1] = el; }}
          className="absolute -bottom-40 -right-24 h-[38rem] w-[38rem] rounded-full bg-accent/20 blur-[120px] motion-safe:animate-drift-2"
        />
        <div
          ref={(el) => { blobRefs.current[2] = el; }}
          className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-300/10 blur-[100px]"
        />

        {/* Thin rotating geometric ring — subtle, behind the headline */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 motion-safe:animate-spin-slow md:h-[42rem] md:w-[42rem]"
        />
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.07] [animation-direction:reverse] motion-safe:animate-spin-slow md:h-[32rem] md:w-[32rem]"
        />

        {/* Film grain — static SVG turbulence, gently jittered */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-[10%] opacity-[0.05] mix-blend-overlay motion-safe:animate-grain"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex max-w-3xl flex-col items-center">
        <div ref={logoRef} className="mb-9">
          {logoImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoImage} alt={siteName} className="h-12 w-auto object-contain md:h-14" />
          ) : (
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-700 via-brand-600 to-accent text-2xl font-bold shadow-lg shadow-brand-600/25">
              {logoLetter || <Heart className="h-6 w-6 fill-current" />}
            </span>
          )}
        </div>

        <p
          ref={eyebrowRef}
          className="mb-5 text-xs font-bold uppercase tracking-[0.45em] text-accent md:text-sm"
        >
          {eyebrow}
        </p>

        <h1 className="mb-7 font-extrabold leading-[1.05] tracking-tight text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
          {lines.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <span
                ref={(el) => { lineWrapRefs.current[i] = el; }}
                className="inline-block"
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        {message && (
          <p
            ref={messageRef}
            className="max-w-md text-balance text-sm leading-relaxed text-white/60 md:text-base"
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
