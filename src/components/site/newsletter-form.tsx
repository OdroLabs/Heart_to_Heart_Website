"use client";

import { useState } from "react";
import { subscribeNewsletter } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/dictionaries";

export function NewsletterForm({ dict, dark }: { dict: Dictionary; dark?: boolean }) {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <p className={`flex items-center gap-2 text-sm font-medium ${dark ? "text-primary" : "text-green-600"}`}>
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white text-xs">✓</span>
        {dict.home.subscribed}
      </p>
    );
  }

  return (
    <form
      action={async (fd) => {
        const res = await subscribeNewsletter(fd);
        if (res.ok) setDone(true);
      }}
      className="flex gap-2"
    >
      <Input
        name="email"
        type="email"
        required
        placeholder={dict.home.emailPlaceholder}
        className={
          dark
            ? "h-10 rounded-full border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:border-primary/50 focus:ring-primary/20"
            : "h-10 rounded-full border-border bg-white text-navy-950 placeholder:text-muted-foreground"
        }
      />
      <Button
        type="submit"
        className={
          dark
            ? "h-10 shrink-0 rounded-full bg-primary px-5 text-sm font-bold text-white hover:bg-primary/90"
            : "h-10 shrink-0 rounded-full bg-primary px-5 text-sm font-bold text-white hover:bg-primary/90"
        }
      >
        {dict.home.subscribe}
      </Button>
    </form>
  );
}
