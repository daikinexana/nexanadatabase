import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const area = searchParams.get("area");
    const search = searchParams.get("search");
    const admin = searchParams.get("admin"); // 管理画面用フラグ

    const where: Record<string, unknown> = {};

    // 管理画面以外では公開中のコンテストのみ表示
    if (!admin) {
      where.isActive = true;
    }

    if (area) {
      where.area = area;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { organizer: { contains: search, mode: "insensitive" } },
        { targetArea: { contains: search, mode: "insensitive" } },
        { targetAudience: { contains: search, mode: "insensitive" } },
        { incentive: { contains: search, mode: "insensitive" } },
        { operatingCompany: { contains: search, mode: "insensitive" } },
      ];
    }

    const contests = await prisma.contest.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(contests);
  } catch (error) {
    console.error("Error fetching contests:", error);
    return NextResponse.json(
      { error: "Failed to fetch contests" },
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
      incentive,
      operatingCompany,
      isPopular,
    } = body;

    // バリデーション
    if (!title || !organizer) {
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

    const contest = await prisma.contest.create({
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
        incentive,
        operatingCompany,
        isPopular,
      },
    });

    return NextResponse.json(contest, { status: 201 });
  } catch (error) {
    console.error("Error creating contest:", error);
    
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
      { error: "コンテストの作成に失敗しました" },
      { status: 500 }
    );
  }
}
