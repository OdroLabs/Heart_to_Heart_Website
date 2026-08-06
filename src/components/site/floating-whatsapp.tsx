import { MessageCircle } from "lucide-react";

/**
 * Global floating WhatsApp button.
 *
 * Rendered directly in the locale layout — outside <main>, the header and any
 * GSAP-animated or transformed container — so `position: fixed` always
 * resolves against the viewport. z-index sits above the header (z-40) and the
 * mobile menu, below only the scroll progress bar (z-90).
 */
export function FloatingWhatsApp({
  number,
  label,
  message,
}: {
  /** International format without +, e.g. 94112534838. */
  number: string;
  label: string;
  /** Optional prefilled chat message. */
  message?: string;
}) {
  const digits = number.replace(/\D/g, "");
  if (!digits) return null;

  const href = `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

  return (
    <div
      className="pointer-events-none fixed right-4 z-[80] md:bottom-6 md:right-6"
      style={{ bottom: "max(1rem, calc(0.75rem + env(safe-area-inset-bottom)))" }}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="group pointer-events-auto relative flex items-center gap-2.5 rounded-full bg-[#25D366] py-3 pl-4 pr-5 text-sm font-bold text-white shadow-xl shadow-[#25D366]/35 ring-1 ring-white/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#20bd5a] hover:shadow-2xl hover:shadow-[#25D366]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white motion-safe:active:scale-95"
      >
        <span className="relative grid h-6 w-6 place-items-center">
          <span className="absolute inline-flex h-full w-full rounded-full bg-white/30 motion-safe:animate-ping [animation-duration:2.2s]" />
          <MessageCircle className="relative h-4 w-4 fill-current" />
        </span>
        {label}
      </a>
    </div>
  );
}
