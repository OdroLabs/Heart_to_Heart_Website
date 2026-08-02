import type { Metadata } from "next";
import { getSettings, s } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteName = s(settings, "site_short_name") || s(settings, "site_name") || "Heart to Heart";
  const favicon = s(settings, "favicon");

  return {
    title: `${siteName} Admin`,
    icons: favicon ? { icon: favicon } : undefined,
  };
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
