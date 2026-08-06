"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function getLocalLink(locale: string, value: string): string {
  const target = value || "/";
  if (
    /^(https?:)?\/\//.test(target) ||
    target.startsWith("mailto:") ||
    target.startsWith("tel:")
  )
    return target;
  return `/${locale}${target.startsWith("/") ? target : `/${target}`}`;
}

export function DonationSlider({
  donationCards,
  locale,
}: {
  donationCards: any[];
  locale: string;
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
      
      const index = Math.round(scrollLeft / clientWidth);
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    checkScroll();
    // Check initially and on window resize
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [donationCards]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -scrollContainerRef.current.clientWidth, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: scrollContainerRef.current.clientWidth, behavior: "smooth" });
    }
  };

  const scrollTo = (index: number) => {
    if (scrollContainerRef.current) {
      const clientWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({ left: clientWidth * index, behavior: "smooth" });
    }
  };

  if (!donationCards || donationCards.length === 0) return null;

  return (
    <section id="sec-donation-card" className="container py-12 md:pb-20 relative">
      <div 
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-2 px-1 -mx-1 hide-scrollbar mt-4 md:mt-0"
      >
        {donationCards.map((card) => (
          <div 
            key={card.id} 
            className="flex flex-col lg:flex-row overflow-hidden rounded-[2rem] border border-border/60 bg-white shadow-sm hover:shadow-md transition-all group shrink-0 w-[95%] lg:w-[100%] snap-center relative"
          >
            {/* Image Section */}
            <div className="lg:w-[40%] min-h-[300px] lg:min-h-[auto] relative bg-brand-50 overflow-hidden">
              {card.image ? (
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${card.image})` }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                  <Heart className="h-16 w-16 text-primary/20" />
                </div>
              )}
              {card.title && (
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent flex items-end p-8">
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-8 lg:p-10 lg:w-[60%] flex flex-col justify-between bg-white relative z-10">
              <div>
                {card.category && (
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                    <span className="block h-px w-4 bg-muted-foreground/40"></span>
                    {card.category}
                  </p>
                )}
                <h3 className="text-2xl lg:text-3xl font-extrabold text-navy-950 mb-2 leading-tight pr-12 lg:pr-0">
                  {card.title}
                </h3>
                {card.author && (
                  <p className="text-sm font-semibold text-navy-800 mb-5">
                    {card.author}
                  </p>
                )}
                <p className="text-sm lg:text-base text-navy-800/80 leading-relaxed mb-8 max-w-2xl whitespace-pre-line">
                  {card.description}
                  {card.linkText && card.linkUrl && (
                    <Link href={getLocalLink(locale, card.linkUrl)} className="text-primary font-bold ml-2 hover:underline inline-flex items-center gap-1">
                      {card.linkText} <ArrowRight className="h-3 w-3" />
                    </Link>
                  )}
                </p>
              </div>

              {/* Progress and Action Section */}
              <div className="mt-2">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm font-bold text-navy-950 flex items-baseline gap-1.5">
                      <span className="text-primary text-2xl">${Number(card.raised).toLocaleString()}</span>
                      <span className="text-muted-foreground font-medium text-xs uppercase tracking-wide">raised of ${Number(card.goal).toLocaleString()} goal</span>
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-8 items-center">
                  {/* Progress Bar */}
                  <div className="flex-1 w-full">
                    <div className="h-3 w-full bg-brand-50 rounded-full overflow-hidden shadow-inner border border-brand-100/50">
                      <div 
                        className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
                        style={{ width: `${Math.min(100, (Number(card.raised) / Number(card.goal)) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center shrink-0 w-full sm:w-auto">
                    <div className="flex w-full sm:w-auto border border-border/80 rounded-full overflow-hidden h-12 shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all bg-white">
                      <span className="flex items-center pl-5 pr-2 text-sm font-bold text-muted-foreground bg-transparent">
                        $
                      </span>
                      <input 
                        type="number" 
                        placeholder="Amount" 
                        className="w-24 sm:w-28 px-2 text-sm outline-none font-bold text-navy-950 bg-transparent placeholder:text-muted-foreground/50" 
                      />
                      <Button asChild className="h-full rounded-none rounded-r-full bg-primary hover:bg-primary/90 text-white font-bold px-8 uppercase text-xs tracking-wider transition-colors">
                        <Link href={`/${locale}/donate`}>
                          Donate
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination Controls */}
      {donationCards.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-primary/20 text-primary/40 transition-all hover:border-primary hover:text-primary disabled:opacity-50 disabled:hover:border-primary/20 disabled:hover:text-primary/40 disabled:cursor-not-allowed"
            aria-label="Previous donation card"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-2.5">
            {donationCards.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === activeIndex 
                    ? "w-8 bg-primary" 
                    : "w-2.5 bg-primary/20 hover:bg-primary/50"
                }`}
              />
            ))}
          </div>

          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-primary text-primary transition-all hover:bg-primary/10 disabled:opacity-50 disabled:border-primary/20 disabled:text-primary/40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
            aria-label="Next donation card"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </section>
  );
}
