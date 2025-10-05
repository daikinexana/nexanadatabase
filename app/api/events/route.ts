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
      const searchConditions = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { organizer: { contains: search, mode: "insensitive" } },
        { venue: { contains: search, mode: "insensitive" } },
        { targetArea: { contains: search, mode: "insensitive" } },
        { targetAudience: { contains: search, mode: "insensitive" } },
        { operatingCompany: { contains: search, mode: "insensitive" } },
        { organizerType: { contains: search, mode: "insensitive" } },
        { area: { contains: search, mode: "insensitive" } },
      ];

      where.OR = searchConditions;
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: {
        startDate: "asc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        startDate: true,
        endDate: true,
        venue: true,
        area: true,
        organizer: true,
        website: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        organizerType: true,
        operatingCompany: true,
        targetArea: true,
        targetAudience: true,
      },
    });

    const response = NextResponse.json(events);
    
    // キャッシュヘッダーを設定（5分間キャッシュ）
    response.headers.set('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=20');
    
    return response;
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
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
      startDate,
      endDate,
      venue,
      area,
      organizer,
      organizerType,
      website,
      targetArea,
      targetAudience,
      operatingCompany,
    } = body;

    // バリデーション
    if (!title || !organizer || !organizerType || !startDate) {
      return NextResponse.json(
        { error: "必須フィールドが不足しています" },
        { status: 400 }
      );
    }

    // 日付のバリデーション
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;
    
    if (isNaN(start.getTime())) {
      return NextResponse.json(
        { error: "開始日が無効です" },
        { status: 400 }
      );
    }

    if (end && isNaN(end.getTime())) {
      return NextResponse.json(
        { error: "終了日が無効です" },
        { status: 400 }
      );
    }

    if (end && end < start) {
      return NextResponse.json(
        { error: "終了日は開始日より後である必要があります" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        imageUrl,
        startDate: start,
        endDate: end,
        venue,
        area,
        organizer,
        organizerType,
        website,
        targetArea,
        targetAudience,
        operatingCompany,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    
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
      { error: "イベントの作成に失敗しました" },
      { status: 500 }
    );
  }
}
