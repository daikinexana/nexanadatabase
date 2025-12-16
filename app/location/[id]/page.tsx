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
          select: {
            id: true,
            name: true,
            imageUrl: true,
            country: true,
            city: true,
            address: true,
            officialLink: true,
            businessHours: true,
            hasDropin: true,
            hasNexana: true,
            hasMeetingRoom: true,
            hasPhoneBooth: true,
            hasWifi: true,
            hasParking: true,
            priceTable: true,
            rental: true,
            notes: true,
            operator: true,
            management: true,
            tenantCard1Title: true,
            tenantCard1Desc: true,
            tenantCard1Image: true,
            tenantCard2Title: true,
            tenantCard2Desc: true,
            tenantCard2Image: true,
            tenantCard3Title: true,
            tenantCard3Desc: true,
            tenantCard3Image: true,
            communityManagerImage: true,
            communityManagerTitle: true,
            communityManagerDesc: true,
            communityManagerContact: true,
            facilityCard1Title: true,
            facilityCard1Desc: true,
            facilityCard1Image: true,
            facilityCard2Title: true,
            facilityCard2Desc: true,
            facilityCard2Image: true,
            facilityCard3Title: true,
            facilityCard3Desc: true,
            facilityCard3Image: true,
            facilityCard4Title: true,
            facilityCard4Desc: true,
            facilityCard4Image: true,
            facilityCard5Title: true,
            facilityCard5Desc: true,
            facilityCard5Image: true,
            facilityCard6Title: true,
            facilityCard6Desc: true,
            facilityCard6Image: true,
            facilityCard7Title: true,
            facilityCard7Desc: true,
            facilityCard7Image: true,
            facilityCard8Title: true,
            facilityCard8Desc: true,
            facilityCard8Image: true,
            facilityCard9Title: true,
            facilityCard9Desc: true,
            facilityCard9Image: true,
            nearbyHotelTitle: true,
            nearbyHotelDesc: true,
            nearbyHotelUrl: true,
            nearbyHotelImage1: true,
            nearbyHotelImage2: true,
            nearbyHotelImage3: true,
            nearbyHotelImage4: true,
            nearbyHotelImage5: true,
            nearbyHotelImage6: true,
            nearbyHotelImage7: true,
            nearbyHotelImage8: true,
            nearbyHotelImage9: true,
            nearbyFood1Title: true,
            nearbyFood1Desc: true,
            nearbyFood1Image: true,
            nearbyFood2Title: true,
            nearbyFood2Desc: true,
            nearbyFood2Image: true,
            nearbyFood3Title: true,
            nearbyFood3Desc: true,
            nearbyFood3Image: true,
            nearbySpot1Title: true,
            nearbySpot1Desc: true,
            nearbySpot1Image: true,
            nearbySpot2Title: true,
            nearbySpot2Desc: true,
            nearbySpot2Image: true,
            nearbySpot3Title: true,
            nearbySpot3Desc: true,
            nearbySpot3Image: true,
            facilityFeatureOneLine: true,
            categoryWork: true,
            categoryConnect: true,
            categoryPrototype: true,
            categoryPilot: true,
            categoryTest: true,
            categorySupport: true,
            categoryShowcase: true,
            categoryLearn: true,
            categoryStay: true,
            hasMultipleLocations: true,
            requiresAdvanceNotice: true,
            canDoWebMeeting: true,
            hasEnglishSupport: true,
            meetsNexanaStandard: true,
            isNexanaRecommended: true,
          },
        },
      },
    });

    console.log("Location found:", !!location);
    if (location) {
      console.log("Location ID:", location.id);
      console.log("Location slug:", location.slug);
      console.log("Workspaces count:", location.workspaces?.length || 0);
      console.log("Workspaces:", location.workspaces);
    }
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
