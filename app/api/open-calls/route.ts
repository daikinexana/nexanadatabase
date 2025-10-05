import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const area = searchParams.get("area");
    const organizerType = searchParams.get("organizerType");
    // const category = searchParams.get("category");
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
        { targetArea: { contains: search, mode: "insensitive" } },
        { targetAudience: { contains: search, mode: "insensitive" } },
        { availableResources: { contains: search, mode: "insensitive" } },
        { operatingCompany: { contains: search, mode: "insensitive" } },
      ];
    }

    const openCalls = await prisma.openCall.findMany({
      where,
      orderBy: {
        deadline: "asc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        deadline: true,
        startDate: true,
        area: true,
        organizer: true,
        website: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        organizerType: true,
        targetArea: true,
        targetAudience: true,
        availableResources: true,
        operatingCompany: true,
      },
    });

    // デバッグ用ログ
    console.log("Fetched open calls:", openCalls.length);
    if (openCalls.length > 0) {
      console.log("First open call:", JSON.stringify(openCalls[0], null, 2));
    }

    const response = NextResponse.json(openCalls);
    
    // キャッシュヘッダーを設定（5分間キャッシュ）
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    
    return response;
  } catch (error) {
    console.error("Error fetching open calls:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    return NextResponse.json(
      { error: "Failed to fetch open calls", details: error instanceof Error ? error.message : 'Unknown error' },
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
      deadline,
      startDate,
      area,
      organizer,
      organizerType,
      website,
      targetArea,
      targetAudience,
        availableResources,
        operatingCompany,
      } = body;

    // バリデーション
    if (!title || !organizer || !organizerType) {
      return NextResponse.json(
        { error: "必須フィールドが不足しています" },
        { status: 400 }
      );
    }

    // 日付のバリデーション
    const deadlineDate = deadline ? new Date(deadline) : null;
    const start = startDate ? new Date(startDate) : null;
    
    if (deadlineDate && isNaN(deadlineDate.getTime())) {
      return NextResponse.json(
        { error: "締切日が無効です" },
        { status: 400 }
      );
    }

    if (start && isNaN(start.getTime())) {
      return NextResponse.json(
        { error: "開始日が無効です" },
        { status: 400 }
      );
    }

    const openCall = await prisma.openCall.create({
      data: {
        title,
        description,
        imageUrl,
        deadline: deadlineDate,
        startDate: start,
        area,
        organizer,
        organizerType,
        website,
        targetArea,
        targetAudience,
        availableResources,
        operatingCompany,
        },
    });

    return NextResponse.json(openCall, { status: 201 });
  } catch (error) {
    console.error("Error creating open call:", error);
    
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
      { error: "公募の作成に失敗しました" },
      { status: 500 }
    );
  }
}
