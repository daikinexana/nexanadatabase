import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const country = searchParams.get("country");
    const locationId = searchParams.get("locationId");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {
      isActive: true,
    };

    if (city) {
      where.city = city;
    }

    if (country) {
      where.country = country;
    }

    if (locationId) {
      where.locationId = locationId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { country: { contains: search, mode: "insensitive" } },
      ];
    }

    const workspaces = await prisma.workspace.findMany({
      where,
      orderBy: [
        { country: "asc" },
        { city: "asc" },
        { createdAt: "desc" },
      ],
    });

    const response = NextResponse.json(workspaces);
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    
    return response;
  } catch (error) {
    console.error("Error fetching workspaces:", error);
    return NextResponse.json(
      { error: "Failed to fetch workspaces" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    
    const body = await request.json();
    const {
      name,
      imageUrl,
      country,
      city,
      address,
      officialLink,
      businessHours,
      hasDropin,
      hasNexana,
      hasMeetingRoom,
      hasPhoneBooth,
      hasWifi,
      hasParking,
      priceTable,
      rental,
      notes,
      operator,
      management,
      tenantCard1Title,
      tenantCard1Desc,
      tenantCard1Image,
      tenantCard2Title,
      tenantCard2Desc,
      tenantCard2Image,
      tenantCard3Title,
      tenantCard3Desc,
      tenantCard3Image,
      communityManagerImage,
      communityManagerTitle,
      communityManagerDesc,
      communityManagerContact,
      facilityCard1Title,
      facilityCard1Desc,
      facilityCard1Image,
      facilityCard2Title,
      facilityCard2Desc,
      facilityCard2Image,
      facilityCard3Title,
      facilityCard3Desc,
      facilityCard3Image,
      facilityCard4Title,
      facilityCard4Desc,
      facilityCard4Image,
      facilityCard5Title,
      facilityCard5Desc,
      facilityCard5Image,
      facilityCard6Title,
      facilityCard6Desc,
      facilityCard6Image,
      facilityCard7Title,
      facilityCard7Desc,
      facilityCard7Image,
      facilityCard8Title,
      facilityCard8Desc,
      facilityCard8Image,
      facilityCard9Title,
      facilityCard9Desc,
      facilityCard9Image,
      nearbyHotelTitle,
      nearbyHotelDesc,
      nearbyHotelUrl,
      nearbyHotelImage1,
      nearbyHotelImage2,
      nearbyHotelImage3,
      nearbyHotelImage4,
      nearbyHotelImage5,
      nearbyHotelImage6,
      nearbyHotelImage7,
      nearbyHotelImage8,
      nearbyHotelImage9,
      nearbyFood1Title,
      nearbyFood1Desc,
      nearbyFood1Image,
      nearbyFood2Title,
      nearbyFood2Desc,
      nearbyFood2Image,
      nearbyFood3Title,
      nearbyFood3Desc,
      nearbyFood3Image,
      nearbySpot1Title,
      nearbySpot1Desc,
      nearbySpot1Image,
      nearbySpot2Title,
      nearbySpot2Desc,
      nearbySpot2Image,
      nearbySpot3Title,
      nearbySpot3Desc,
      nearbySpot3Image,
      locationId,
    } = body;

    if (!name || !country || !city) {
      return NextResponse.json(
        { error: "必須フィールドが不足しています" },
        { status: 400 }
      );
    }

    const workspace = await prisma.workspace.create({
      data: {
        name,
        imageUrl,
        country,
        city,
        address,
        officialLink,
        businessHours,
        hasDropin: hasDropin || false,
        hasNexana: hasNexana || false,
        hasMeetingRoom: hasMeetingRoom || false,
        hasPhoneBooth: hasPhoneBooth || false,
        hasWifi: hasWifi || false,
        hasParking: hasParking || false,
        priceTable,
        rental,
        notes,
        operator,
        management,
        tenantCard1Title,
        tenantCard1Desc,
        tenantCard1Image,
        tenantCard2Title,
        tenantCard2Desc,
        tenantCard2Image,
        tenantCard3Title,
        tenantCard3Desc,
        tenantCard3Image,
        communityManagerImage,
        communityManagerTitle,
        communityManagerDesc,
        communityManagerContact,
        facilityCard1Title,
        facilityCard1Desc,
        facilityCard1Image,
        facilityCard2Title,
        facilityCard2Desc,
        facilityCard2Image,
        facilityCard3Title,
        facilityCard3Desc,
        facilityCard3Image,
        facilityCard4Title,
        facilityCard4Desc,
        facilityCard4Image,
        facilityCard5Title,
        facilityCard5Desc,
        facilityCard5Image,
        facilityCard6Title,
        facilityCard6Desc,
        facilityCard6Image,
        facilityCard7Title,
        facilityCard7Desc,
        facilityCard7Image,
        facilityCard8Title,
        facilityCard8Desc,
        facilityCard8Image,
        facilityCard9Title,
        facilityCard9Desc,
        facilityCard9Image,
        nearbyHotelTitle,
        nearbyHotelDesc,
        nearbyHotelUrl,
        nearbyHotelImage1,
        nearbyHotelImage2,
        nearbyHotelImage3,
        nearbyHotelImage4,
        nearbyHotelImage5,
        nearbyHotelImage6,
        nearbyHotelImage7,
        nearbyHotelImage8,
        nearbyHotelImage9,
        nearbyFood1Title,
        nearbyFood1Desc,
        nearbyFood1Image,
        nearbyFood2Title,
        nearbyFood2Desc,
        nearbyFood2Image,
        nearbyFood3Title,
        nearbyFood3Desc,
        nearbyFood3Image,
        nearbySpot1Title,
        nearbySpot1Desc,
        nearbySpot1Image,
        nearbySpot2Title,
        nearbySpot2Desc,
        nearbySpot2Image,
        nearbySpot3Title,
        nearbySpot3Desc,
        nearbySpot3Image,
        locationId: locationId || null,
      },
    });

    return NextResponse.json(workspace, { status: 201 });
  } catch (error) {
    console.error("Error creating workspace:", error);
    
    if (error instanceof Error && error.message.includes("認証")) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }
    
    if (error instanceof Error && error.message.includes("管理者権限")) {
      return NextResponse.json(
        { error: "管理者権限が必要です" },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: "Workspaceの作成に失敗しました" },
      { status: 500 }
    );
  }
}

