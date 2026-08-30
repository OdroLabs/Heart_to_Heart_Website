import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Users } from "lucide-react";
import { type Locale, loc } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; slug: string };
}): Promise<Metadata> {
  const { slug } = params;
  const member = await prisma.teamMember.findUnique({
    where: { slug },
  });

  if (!member) {
    return { title: "Not Found" };
  }

  return {
    title: `${member.name} | Heart to Heart`,
    description: member.roleEn || member.roleSi || member.roleTa || "Team Member",
  };
}

export default async function TeamMemberPage({
  params,
}: {
  params: { locale: Locale; slug: string };
}) {
  const { locale, slug } = params;

  const member = await prisma.teamMember.findUnique({
    where: { slug },
  });

  if (!member) {
    notFound();
  }

  const role = loc(member, "role", locale) || "Team Member";
  const bio = loc(member, "bio", locale) || "Biography is currently unavailable.";
  const categoryLabel = member.category === "BOD" ? "Board of Directors" : "Our Staff";

  return (
    <main className="min-h-screen bg-muted/20 py-20 lg:py-24">
      <div className="container max-w-5xl px-4 md:px-8">
        
        {/* Back Link */}
        <Link 
          href={`/${locale}/about#sec-${member.category === "BOD" ? "bod" : "staff"}`} 
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Team
        </Link>

        {/* Profile Card */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-border/50 overflow-hidden flex flex-col md:flex-row">
          
          {/* Image Section */}
          <div className="w-full md:w-5/12 lg:w-1/3 relative aspect-[3/4] md:aspect-auto md:min-h-[500px] bg-muted/40">
            {member.image ? (
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${member.image})` }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Users className="h-20 w-20 text-primary/20" />
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-8 md:p-12 lg:p-16 w-full md:w-7/12 lg:w-2/3 flex flex-col justify-center">
            
            <p className="font-bold text-xs md:text-sm text-primary tracking-widest uppercase mb-3 md:mb-4 flex items-center gap-2">
              <span className="block h-0.5 w-6 rounded-full bg-primary"></span>
              {categoryLabel}
            </p>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-navy-950 mb-3 md:mb-4 tracking-tight leading-none">
              {member.name}
            </h1>
            
            <p className="text-xl md:text-2xl font-medium text-muted-foreground mb-8">
              {role}
            </p>
            
            <div className="prose prose-navy max-w-none prose-lg text-muted-foreground leading-relaxed whitespace-pre-line">
              {bio}
            </div>
            
          </div>
        </div>
      </div>
    </main>
  );
}
