import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, FileText, Download, Calendar, Tag } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings } from "@/lib/settings";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const categoryLabels: Record<string, string> = {
  research: "Research",
  report: "Report",
  annual: "Annual Report",
  other: "Other",
};

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; id: string };
}): Promise<Metadata> {
  const { id } = params;
  const pub = await prisma.publication.findUnique({
    where: { id: parseInt(id) },
  });

  if (!pub) return { title: "Not Found" };

  return {
    title: `${loc(pub, "title", params.locale)} | Publications`,
    description: loc(pub, "description", params.locale),
  };
}

export default async function PublicationDetailPage({
  params,
}: {
  params: { locale: Locale; id: string };
}) {
  const { locale, id } = params;
  const parsedId = parseInt(id);

  if (isNaN(parsedId)) {
    notFound();
  }

  const [settings, pub] = await Promise.all([
    getSettings(),
    prisma.publication.findUnique({ where: { id: parsedId } }),
  ]);

  if (!pub || !pub.published) {
    notFound();
  }

  const dict = getLabels(locale, settings);
  const title = loc(pub, "title", locale);
  const description = loc(pub, "description", locale);
  const category = categoryLabels[pub.category] ?? pub.category;

  return (
    <main className="min-h-screen bg-muted/20 py-20 lg:py-24">
      <div className="container max-w-4xl px-4 md:px-8">
        
        {/* Back Link */}
        <Link 
          href={`/${locale}/publications`} 
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Publications
        </Link>

        {/* Content Container */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-border/50 overflow-hidden">
          {/* Cover Image */}
          {pub.coverImage ? (
            <div className="relative w-full aspect-[21/9] md:aspect-[3/1] bg-muted/40">
              <Image 
                src={pub.coverImage} 
                alt={title} 
                fill 
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex h-32 md:h-48 items-center justify-center bg-muted/30">
              <FileText className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}

          {/* Details */}
          <div className="p-8 md:p-12 lg:p-16">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-1.5 text-sm font-semibold text-primary bg-brand-50 border border-brand-200/50 px-3 py-1 rounded-full">
                <Tag className="h-4 w-4" />
                {category}
              </div>
              <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formatDate(pub.publishedAt, locale)}
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-navy-950 mb-6 tracking-tight leading-[1.1]">
              {title}
            </h1>

            {description && (
              <div className="prose prose-navy max-w-none prose-lg text-muted-foreground leading-relaxed whitespace-pre-line mb-10">
                {description}
              </div>
            )}

            {pub.fileUrl && (
              <div className="pt-8 border-t border-border/60">
                <Button asChild size="lg" className="w-full sm:w-auto font-semibold">
                  <a href={pub.fileUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-5 w-5" /> Download Document
                  </a>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
