import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const area = searchParams.get("area");
    const organizerType = searchParams.get("organizerType");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const where: any = {
      isActive: true,
    };

    if (area) {
      where.area = area;
    }

    if (organizerType) {
      where.organizerType = organizerType;
    }

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { organizer: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }

    const openCalls = await prisma.openCall.findMany({
      where,
      orderBy: {
        deadline: "asc",
      },
      include: {
        createdByUser: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // タグを配列に変換
    const openCallsWithArrayTags = openCalls.map(openCall => ({
      ...openCall,
      tags: openCall.tags ? openCall.tags.split(',') : []
    }));

    return NextResponse.json(openCallsWithArrayTags);
  } catch (error) {
    console.error("Error fetching open calls:", error);
    return NextResponse.json(
      { error: "Failed to fetch open calls" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 管理者権限を確認
    const user = await requireAdmin();
    
    const body = await request.json();
    const {
      title,
      description,
      content,
      imageUrl,
      deadline,
      startDate,
      endDate,
      category,
      area,
      organizer,
      organizerType,
      amount,
      website,
      contact,
      tags,
    } = body;

    // バリデーション
    if (!title || !organizer || !organizerType || !category) {
      return NextResponse.json(
        { error: "必須フィールドが不足しています" },
        { status: 400 }
      );
    }

    // 日付のバリデーション
    const deadlineDate = deadline ? new Date(deadline) : null;
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
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

    if (end && isNaN(end.getTime())) {
      return NextResponse.json(
        { error: "終了日が無効です" },
        { status: 400 }
      );
    }

    if (start && end && end < start) {
      return NextResponse.json(
        { error: "終了日は開始日より後である必要があります" },
        { status: 400 }
      );
    }

    const openCall = await prisma.openCall.create({
      data: {
        title,
        description,
        content,
        imageUrl,
        deadline: deadlineDate,
        startDate: start,
        endDate: end,
        category,
        area,
        organizer,
        organizerType,
        amount,
        website,
        contact,
        tags: tags ? tags.join(',') : null,
        createdBy: user.id,
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
