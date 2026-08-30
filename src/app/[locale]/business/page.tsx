import type { Metadata } from "next";
import Image from "next/image";
import { ShoppingBag, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { loc, type Locale } from "@/lib/i18n";
import { getLabels } from "@/lib/labels";
import { getSettings, s } from "@/lib/settings";
import { pageMetadata } from "@/lib/seo";
import { formatMoney } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/page-hero";
import { EmptyState } from "@/components/site/empty-state";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const settings = await getSettings();
  return pageMetadata(settings, params.locale, {
    title: s(settings, "business_hero_title", params.locale),
    description: s(settings, "business_hero_intro", params.locale),
  });
}

export default async function BusinessPage({ params }: { params: { locale: Locale } }) {
  const { locale } = params;
  const [products, settings] = await Promise.all([
    prisma.product.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    getSettings(),
  ]);
  const dict = getLabels(locale, settings);
  const whatsapp = s(settings, "whatsapp").replace(/\D/g, "");

  return (
    <>
      <PageHero
        title={s(settings, "business_hero_title", locale)}
        intro={s(settings, "business_hero_intro", locale)}
        image={s(settings, "business_hero_image") || undefined}
      />
      
      {/* Main Services & Shop Me Button Section */}
      <section className="bg-white py-12 md:py-16 border-b border-border/40">
        <div className="container max-w-5xl text-center">
          <h2 className="text-3xl font-bold text-navy-950 mb-6">Our Main Services</h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Heart to Heart Community Business provides high-quality products and services that directly support our charitable initiatives. 
            By choosing us, you are contributing to our mission to uplift the community.
          </p>
          <div className="flex justify-center">
            <Button asChild size="lg" className="rounded-full px-8 text-base font-bold shadow-md hover:-translate-y-0.5 transition-transform">
              <a href="https://shop.hearttoheart.lk" target="_blank" rel="noopener noreferrer">
                Shop Me <ShoppingBag className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>
      <div className="container grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const name = loc(product, "name", locale);
          const waText = encodeURIComponent(`Hello, I would like to order: ${name}`);
          return (
            <Card key={product.id} className="flex flex-col overflow-hidden">
              {product.image ? (
                <div className="relative h-52 w-full">
                  <Image src={product.image} alt={name} fill className="object-cover" />
                </div>
              ) : (
                <div className="flex h-40 items-center justify-center bg-muted">
                  <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
                </div>
              )}
              <CardContent className="flex flex-1 flex-col pt-5">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h2 className="font-bold leading-snug">{name}</h2>
                  {!product.inStock && <Badge variant="outline">{dict.common.outOfStock}</Badge>}
                </div>
                {product.price != null && (
                  <p className="mb-2 font-bold text-primary">
                    {formatMoney(product.price.toString())}
                  </p>
                )}
                <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                  {loc(product, "description", locale)}
                </p>
                {whatsapp && product.inStock && (
                  <Button asChild variant="secondary" size="sm" className="mt-auto w-fit">
                    <a
                      href={`https://wa.me/${whatsapp}?text=${waText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4" /> {dict.common.orderNow}
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
        {products.length === 0 && (
          <EmptyState
            message={s(settings, "business_empty_text", locale)}
          />
        )}
      </div>
    </>
  );
}
