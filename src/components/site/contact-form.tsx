"use client";

import { useState } from "react";
import { submitContact } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/dictionaries";

export function ContactForm({
  dict,
  successMessage,
}: {
  dict: Dictionary;
  successMessage?: string;
}) {
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="rounded-2xl border border-brand-500/30 bg-brand-50/50 p-8 text-center text-brand-700 font-medium">
        <div className="mb-3 flex justify-center text-brand-500">
          <svg
            className="h-10 w-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        {successMessage || dict.common.thankYou}
      </div>
    );
  }

  return (
    <form
      action={async (fd) => {
        const res = await submitContact(fd);
        if (res.ok) setDone(true);
      }}
      className="space-y-5"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label
            htmlFor="c-name"
            className="text-[13px] text-muted-foreground font-medium"
          >
            Full Name
          </Label>
          <Input
            id="c-name"
            name="name"
            placeholder="Enter full name"
            className="bg-white border-border/80 rounded-xl h-12 shadow-sm focus-visible:ring-brand-500"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor="c-phone"
            className="text-[13px] text-muted-foreground font-medium"
          >
            Phone
          </Label>
          <Input
            id="c-phone"
            name="phone"
            placeholder="Enter phone number"
            className="bg-white border-border/80 rounded-xl h-12 shadow-sm focus-visible:ring-brand-500"
          />
        </div>
      </div>
      <div className="">
        <div className="space-y-1.5">
          <Label
            htmlFor="c-email"
            className="text-[13px] text-muted-foreground font-medium"
          >
            Email
          </Label>
          <Input
            id="c-email"
            name="email"
            type="email"
            placeholder="Enter email"
            className="bg-white border-border/80 rounded-xl h-12 shadow-sm focus-visible:ring-brand-500"
            required
          />
        </div>
      </div>
      <div className="space-y-1.5 pb-2">
        <Label
          htmlFor="c-subject"
          className="text-[13px] text-muted-foreground font-medium"
        >
          Subject
        </Label>
        <Input
          id="c-subject"
          name="subject"
          placeholder="Enter subject"
          className="bg-white border-border/80 rounded-xl h-12 shadow-sm focus-visible:ring-brand-500"
          required
        />
      </div>
      <div className="space-y-1.5 pb-2">
        <Label
          htmlFor="c-message"
          className="text-[13px] text-muted-foreground font-medium"
        >
          Message
        </Label>
        <Textarea
          id="c-message"
          name="message"
          placeholder="Enter your message here ..."
          className="bg-white border-border/80 rounded-xl shadow-sm focus-visible:ring-brand-500 resize-none"
          required
          rows={4}
        />
      </div>
      <Button
        type="submit"
        className="w-full h-14 bg-gradient-to-r from-brand-950 via-brand-800 to-ocean hover:opacity-95 text-white rounded-[1.25rem] text-lg font-bold shadow-lg shadow-brand-950/25 border-b-[3px] border-brand-900 transition-all hover:translate-y-[1px] hover:shadow-md"
      >
        Send Message
      </Button>
    </form>
  );
}
