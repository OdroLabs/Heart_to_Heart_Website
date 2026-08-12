import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FileText, Download } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s } from "@/lib/settings";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-hero";
import { EmptyState } from "@/components/site/empty-state";

const categoryLabels: Record<string, string> = {
  research: "Research",
  report: "Report",
  annual: "Annual Report",
  other: "Other",
};

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const settings = await getSettings();
  return pageMetadata(settings, params.locale, {
    title: s(settings, "publications_hero_title", params.locale),
    description: s(settings, "publications_hero_intro", params.locale),
  });
}

export default async function PublicationsPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const [settings, publications] = await Promise.all([
    getSettings(),
    prisma.publication.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } }),
  ]);
  const dict = getLabels(locale, settings);

  return (
    <>
      <PageHero
        title={s(settings, "publications_hero_title", locale)}
        intro={s(settings, "publications_hero_intro", locale)}
        image={s(settings, "publications_hero_image") || undefined}
      />
      <div className="container grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {publications.map((pub) => (
          <Card key={pub.id} className="group flex flex-col overflow-hidden">
            {pub.coverImage ? (
              <Link href={`/${locale}/publications/${pub.id}`} className="relative h-44 w-full block overflow-hidden">
                <Image src={pub.coverImage} alt="" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              </Link>
            ) : (
              <Link href={`/${locale}/publications/${pub.id}`} className="flex h-32 items-center justify-center bg-muted transition-colors hover:bg-muted/80">
                <FileText className="h-10 w-10 text-muted-foreground/40" />
              </Link>
            )}
            <CardContent className="flex flex-1 flex-col pt-5">
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="secondary">{categoryLabels[pub.category] ?? pub.category}</Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDate(pub.publishedAt, locale)}
                </span>
              </div>
              <Link href={`/${locale}/publications/${pub.id}`} className="hover:underline hover:text-primary transition-colors">
                <h2 className="mb-2 font-bold leading-snug">{loc(pub, "title", locale)}</h2>
              </Link>
              <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                {loc(pub, "description", locale)}
              </p>
              <div className="mt-auto flex flex-wrap items-center gap-3">
                <Button asChild variant="default" size="sm" className="w-fit">
                  <Link href={`/${locale}/publications/${pub.id}`}>
                    {dict.common.readMore || "Read More"}
                  </Link>
                </Button>
                {pub.fileUrl && (
                  <Button asChild variant="outline" size="sm" className="w-fit">
                    <a href={pub.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" /> <span className="hidden sm:inline">{dict.common.download}</span>
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {publications.length === 0 && (
          <EmptyState
            message={s(settings, "publications_empty_text", locale)}
          />
        )}
      </div>
    </>
  );
}
