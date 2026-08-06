import { NextRequest, NextResponse } from "next/server";
import { isLocale } from "@/lib/i18n";
import { searchSite } from "@/lib/search";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const localeParam = searchParams.get("locale") ?? "en";
  const locale = isLocale(localeParam) ? localeParam : "en";

  if (!q.trim()) {
    return NextResponse.json({ results: null });
  }

  const results = await searchSite(q, locale, 5);
  return NextResponse.json({ results });
}
