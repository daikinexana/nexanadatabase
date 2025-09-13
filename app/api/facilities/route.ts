import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const area = searchParams.get("area");
    const organizerType = searchParams.get("organizerType");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {
      isActive: true,
    };

    if (area) {
      where.area = area;
    }

    if (organizerType) {
      where.organizerType = organizerType;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { organizer: { contains: search, mode: "insensitive" } },
        { address: { contains: search, mode: "insensitive" } },
        { targetArea: { contains: search, mode: "insensitive" } },
        { facilityInfo: { contains: search, mode: "insensitive" } },
        { targetAudience: { contains: search, mode: "insensitive" } },
        { program: { contains: search, mode: "insensitive" } },
      ];
    }

    const facilities = await prisma.facility.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(facilities);
  } catch (error) {
    console.error("Error fetching facilities:", error);
    return NextResponse.json(
      { error: "Failed to fetch facilities" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 管理者権限を確認
    await requireAdmin();
    
    const body = await request.json();
    const {
      title,
      description,
      imageUrl,
      address,
      area,
      organizer,
      organizerType,
      website,
      targetArea,
      facilityInfo,
      targetAudience,
      program,
    } = body;

    // バリデーション
    if (!title || !organizer || !organizerType) {
      return NextResponse.json(
        { error: "必須フィールドが不足しています" },
        { status: 400 }
      );
    }

    const facility = await prisma.facility.create({
      data: {
        title,
        description,
        imageUrl,
        address,
        area,
        organizer,
        organizerType,
        website,
        targetArea,
        facilityInfo,
        targetAudience,
        program,
      },
    });

    return NextResponse.json(facility, { status: 201 });
  } catch (error) {
    console.error("Error creating facility:", error);
    
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
      { error: "施設の作成に失敗しました" },
      { status: 500 }
    );
  }
}
