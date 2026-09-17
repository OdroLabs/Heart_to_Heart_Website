"use client";

import { useState } from "react";
import { Heart, Lock, ShieldCheck, RefreshCw, Landmark } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/dictionaries";

const DEFAULT_PRESETS = [1000, 2500, 5000, 10000, 25000];
const USD_RATE = 310; // Indicative exchange rate (~310 LKR = 1 USD)

export function DonationForm({
  locale,
  dict,
  /** Suggested amounts from Site Settings → Donation Page. */
  presets,
  /** Dynamic purpose headings from Why Donate point headings. */
  purposes,
  /** Triggered when the payment gateway is unconfigured or failed. */
  paymentUnconfigured,
}: {
  locale: string;
  dict: Dictionary;
  presets?: number[];
  purposes?: string[];
  paymentUnconfigured?: boolean;
}) {
  const d = dict.donate;
  const PRESETS = presets && presets.length > 0 ? presets : DEFAULT_PRESETS;
  const [frequency, setFrequency] = useState<"one_time" | "monthly">("one_time");
  const [amount, setAmount] = useState<string>(String(PRESETS[Math.min(1, PRESETS.length - 1)]));
  const [showErrorModal, setShowErrorModal] = useState<boolean>(Boolean(paymentUnconfigured));

  const purposeOptions =
    purposes && purposes.length > 0
      ? purposes.map((p) => ({ value: p, label: p }))
      : [
          { value: "general", label: d.purposeGeneral },
          { value: "health", label: d.purposeHealth },
          { value: "education", label: d.purposeEducation },
          { value: "community", label: d.purposeCommunity },
        ];

  const handleModalOk = () => {
    setShowErrorModal(false);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("payment_unconfigured");
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.toString());

      const bankSec = document.getElementById("sec-bank");
      if (bankSec) {
        bankSec.scrollIntoView({ behavior: "smooth", block: "center" });
        bankSec.classList.add("ring-4", "ring-primary", "ring-offset-4", "transition-all", "duration-700", "scale-[1.02]");
        setTimeout(() => {
          bankSec.classList.remove("scale-[1.02]");
        }, 600);
        setTimeout(() => {
          bankSec.classList.remove("ring-4", "ring-primary", "ring-offset-4");
        }, 3500);
      }
    }
  };

  return (
    <>
      {/* Unconfigured / Error Modal Popup */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-2xl border border-border animate-in zoom-in-95 duration-200">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-8 ring-primary/5">
              <Landmark className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-navy-950 mb-3">Notice</h3>
            <p className="text-sm leading-relaxed text-muted-foreground mb-6">
              Online Payments are not configured yet. Please use the Bank Transfer method for your donation.
            </p>
            <Button
              type="button"
              onClick={handleModalOk}
              size="lg"
              className="w-full rounded-full bg-primary font-bold text-white shadow-md hover:bg-primary/90"
            >
              OK
            </Button>
          </div>
        </div>
      )}

      <form action="/api/donate" method="POST" className="space-y-7">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="frequency" value={frequency} />

        {/* Frequency toggle */}
        <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-muted p-1.5" role="group" aria-label={d.purpose}>
          {(
            [
              { key: "one_time", label: d.oneTime, Icon: Heart },
              { key: "monthly", label: d.monthly, Icon: RefreshCw },
            ] as const
          ).map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFrequency(key)}
              aria-pressed={frequency === key}
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-200",
                frequency === key
                  ? "bg-white text-primary shadow-md shadow-navy-950/[0.08]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>

        {/* Amount */}
        <div className="space-y-3">
          <Label className="text-sm font-bold text-navy-900">{d.chooseAmount} *</Label>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {PRESETS.map((p) => {
              const approxUsd = Math.round(p / USD_RATE);
              const isSelected = amount === String(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setAmount(String(p))}
                  aria-pressed={isSelected}
                  className={cn(
                    "flex flex-col items-center justify-center rounded-2xl border-2 p-3 text-center transition-all duration-200 motion-safe:active:scale-95",
                    isSelected
                      ? "border-primary bg-primary text-white shadow-md shadow-primary/25"
                      : "border-border bg-white text-navy-900 hover:border-primary/50 hover:text-primary"
                  )}
                >
                  <span className="text-sm font-bold leading-tight">
                    LKR {p.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span
                    className={cn(
                      "text-[11px] font-medium mt-1 leading-none",
                      isSelected ? "text-white/80" : "text-muted-foreground"
                    )}
                  >
                    Approx ~ USD {approxUsd}
                  </span>
                  {frequency === "monthly" && (
                    <span className="block text-[10px] font-medium opacity-70 mt-1">{d.perMonth}</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="space-y-1.5 pt-1">
            <Label htmlFor="d-amount" className="text-xs text-muted-foreground">
              {d.customAmount} ({d.amount})
            </Label>
            <Input
              id="d-amount"
              name="amount"
              type="number"
              min="100"
              step="50"
              required
              placeholder="2500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-11 rounded-xl text-base font-semibold"
            />
            {amount && Number(amount) > 0 && (
              <p className="text-xs text-muted-foreground pt-0.5">
                Approx ~ USD {Math.round(Number(amount) / USD_RATE)}
              </p>
            )}
          </div>

          {/* Notice Box */}
          <div className="rounded-2xl border border-border/70 bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
            <p className="flex items-start gap-2 leading-relaxed">
              <span className="text-primary font-bold text-base leading-none">•</span>
              <span>
                Donations are processed in <strong className="font-bold text-foreground">LKR</strong>. International equivalents are indicative only.
              </span>
            </p>
          </div>
        </div>

        {/* Purpose */}
        <div className="space-y-1.5">
          <Label htmlFor="d-purpose" className="text-sm font-bold text-navy-900">
            {d.purpose}
          </Label>
          <select
            id="d-purpose"
            name="purpose"
            defaultValue={purposeOptions[0]?.value}
            className="h-11 w-full rounded-xl border border-input bg-white px-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {purposeOptions.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        {/* Donor details */}
        <div className="space-y-4">
          <p className="text-sm font-bold text-navy-900">{d.yourDetails}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="d-name">{dict.common.name} *</Label>
              <Input id="d-name" name="name" required className="h-11 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="d-email">{dict.common.email} *</Label>
              <Input id="d-email" name="email" type="email" required className="h-11 rounded-xl" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="d-phone">
              {dict.common.phone}{" "}
              <span className="font-normal text-muted-foreground">({dict.common.optional})</span>
            </Label>
            <Input id="d-phone" name="phone" className="h-11 rounded-xl" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="d-message">
              {dict.common.message}{" "}
              <span className="font-normal text-muted-foreground">({dict.common.optional})</span>
            </Label>
            <Textarea id="d-message" name="message" rows={3} className="rounded-xl" />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="h-13 w-full rounded-full bg-destructive py-6 text-base font-bold shadow-lg shadow-destructive/25 hover:bg-destructive/90"
        >
          <Heart className="h-5 w-5 fill-current" />
          {d.donateNow}
          {amount && Number(amount) > 0 && (
            <span className="font-number">
              — Rs. {Number(amount).toLocaleString()}
              {frequency === "monthly" ? d.perMonth : ""}
            </span>
          )}
        </Button>

        <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
            <Lock className="h-3 w-3" /> SSL
          </span>
          <ShieldCheck className="h-4 w-4 text-emerald-600" /> {d.securePayment}
        </p>
      </form>
    </>
  );
}
