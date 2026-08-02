"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Save } from "lucide-react";
import { saveLabels } from "@/lib/actions";
import { useToast } from "./toast";
import { labelGroups } from "@/lib/labels";
import type { SettingsMap } from "@/lib/settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const langs = [
  { code: "en", suffix: "valueEn", label: "English" },
  { code: "si", suffix: "valueSi", label: "සිංහල (Sinhala)" },
  { code: "ta", suffix: "valueTa", label: "தமிழ் (Tamil)" },
] as const;

export function LabelsForm({ settings }: { settings: SettingsMap }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [group, setGroup] = useState(labelGroups[0]?.group ?? "");
  const { toast, update } = useToast();
  const router = useRouter();

  async function handleSave(fd: FormData) {
    setSaving(true);
    setSaved(false);
    const id = toast({ title: "Saving labels…", variant: "loading" });
    try {
      const result = await saveLabels(fd);
      if (result.ok) {
        update(id, {
          title: "Saved ✓",
          description: "Labels and translations are live on the site.",
          variant: "success",
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        router.refresh();
      } else {
        update(id, { title: "Not saved", description: result.error, variant: "error" });
      }
    } catch {
      update(id, {
        title: "Not saved",
        description: "Could not reach the server. Check your connection and try again.",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form action={handleSave} className="space-y-5">
      <div className="flex flex-wrap gap-1.5">
        {labelGroups.map((g) => (
          <button
            key={g.group}
            type="button"
            onClick={() => setGroup(g.group)}
            className={
              g.group === group
                ? "rounded-full bg-navy-900 px-3 py-1 text-xs font-semibold text-white"
                : "rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
            }
          >
            {g.title}
          </button>
        ))}
      </div>

      {/* All groups stay mounted so a single save covers every label. */}
      {labelGroups.map((g) => (
        <Card key={g.group} className={g.group === group ? "" : "hidden"}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{g.title}</CardTitle>
            {g.description && (
              <p className="text-xs text-muted-foreground">{g.description}</p>
            )}
          </CardHeader>
          <CardContent className="space-y-5">
            {g.items.map((item) => {
              const row = settings[item.key];
              return (
                <div key={item.key}>
                  <Label className="mb-1.5 block text-sm font-semibold">{item.label}</Label>
                  <p className="mb-2 text-xs text-muted-foreground">
                    Default: <span className="font-medium">{item.defaultEn}</span>
                  </p>
                  <div className="grid gap-3 lg:grid-cols-3">
                    {langs.map((lang) => {
                      const name = `${item.key}__${lang.code}`;
                      const value = row?.[lang.suffix] ?? "";
                      return (
                        <div key={lang.code} className="space-y-1">
                          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                            {lang.label}
                          </p>
                          {item.multiline ? (
                            <Textarea name={name} rows={3} defaultValue={value} />
                          ) : (
                            <Input name={name} defaultValue={value} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}

      <div className="sticky bottom-0 -mx-1 border-t bg-white/80 px-1 py-3 backdrop-blur shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
        <Button
          type="submit"
          size="lg"
          disabled={saving || saved}
          className={`min-w-[160px] transition-all ${
            saved
              ? "bg-green-600 hover:bg-green-600 cursor-default"
              : saving
              ? "opacity-80 cursor-not-allowed"
              : ""
          }`}
        >
          {saving ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
          ) : saved ? (
            <><span className="text-base">✓</span> Saved!</>
          ) : (
            <><Save className="h-4 w-4" /> Save All Labels</>
          )}
        </Button>
      </div>
    </form>
  );
}
