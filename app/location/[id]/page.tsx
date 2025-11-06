import { notFound } from "next/navigation";
import ClientHeader from "@/components/ui/client-header";
import Footer from "@/components/ui/footer";
import LocationDetailClient from "@/components/ui/location-detail-client";
import { Metadata } from "next";

interface LocationDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: LocationDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const location = await getLocation(resolvedParams.id);

  if (!location) {
    return {
      title: "Location Not Found | Nexana Database",
    };
  }

  return {
    title: `${location.city} | Nexana Database`,
    description: `${location.country} ${location.city}のロケーション情報、ワークスペース情報を掲載`,
    keywords: `${location.city}, ${location.country}, ロケーション, ワークスペース, 地域情報`,
    alternates: {
      canonical: `https://db.nexanahq.com/location/${location.slug}`,
    },
    openGraph: {
      title: `${location.city} | Nexana Database`,
      description: `${location.country} ${location.city}のロケーション情報`,
      type: "website",
      url: `https://db.nexanahq.com/location/${location.slug}`,
    },
  };
}

async function getLocation(idOrSlug: string) {
  try {
    console.log("getLocation called with:", idOrSlug);
    
    // 動的インポートを使用
    const prismaModule = await import("@/lib/prisma");
    console.log("Prisma module imported:", !!prismaModule);
    console.log("Prisma client:", !!prismaModule.prisma);
    console.log("Prisma location:", !!prismaModule.prisma?.location);
    
    const { prisma } = prismaModule;
    
    if (!prisma) {
      console.error("Prisma client is undefined");
      return null;
    }
    
    if (!prisma.location) {
      console.error("Prisma location is undefined");
      return null;
    }
    
    // IDまたはSlugで検索
    const location = await prisma.location.findFirst({
      where: {
        isActive: true,
        OR: [
          { id: idOrSlug },
          { slug: idOrSlug },
        ],
      },
      select: {
        id: true,
        slug: true,
        country: true,
        city: true,
        description: true,
        topImageUrl: true,
        mapImageUrl: true,
        companyCard1Image: true,
        companyCard1Name: true,
        companyCard1DescTop: true,
        companyCard1DescBottom: true,
        companyCard2Image: true,
        companyCard2Name: true,
        companyCard2DescTop: true,
        companyCard2DescBottom: true,
        companyCard3Image: true,
        companyCard3Name: true,
        companyCard3DescTop: true,
        companyCard3DescBottom: true,
        experienceCard1Image: true,
        experienceCard1Title: true,
        experienceCard1Url: true,
        experienceCard2Image: true,
        experienceCard2Title: true,
        experienceCard2Url: true,
        experienceCard3Image: true,
        experienceCard3Title: true,
        experienceCard3Url: true,
        sightseeingCard1Image: true,
        sightseeingCard1Title: true,
        sightseeingCard2Image: true,
        sightseeingCard2Title: true,
        sightseeingCard3Image: true,
        sightseeingCard3Title: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        workspaces: {
          where: { isActive: true },
        },
      },
    });

    console.log("Location found:", !!location);
    return location;
  } catch (error) {
    console.error("Error fetching location:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return null;
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default async function LocationDetailPage({ params }: LocationDetailPageProps) {
  const resolvedParams = await params;
  const location = await getLocation(resolvedParams.id);

  if (!location) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <ClientHeader />
      <LocationDetailClient location={location} />
      <Footer />
    </div>
  );
}
