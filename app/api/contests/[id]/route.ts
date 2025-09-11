import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// 個別コンテスト取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contest = await prisma.contest.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!contest) {
      return NextResponse.json(
        { error: "Contest not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(contest);
  } catch (error) {
    console.error("Error fetching contest:", error);
    return NextResponse.json(
      { error: "Failed to fetch contest" },
      { status: 500 }
    );
  }
}

// コンテスト更新
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 管理者権限を確認
    const user = await requireAdmin();
    
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
      isActive,
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

    const contest = await prisma.contest.update({
      where: {
        id: params.id,
      },
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
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(contest);
  } catch (error) {
    console.error("Error updating contest:", error);
    
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
      { error: "コンテストの更新に失敗しました" },
      { status: 500 }
    );
  }
}

// コンテスト削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 管理者権限を確認
    const user = await requireAdmin();
    
    await prisma.contest.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "Contest deleted successfully" });
  } catch (error) {
    console.error("Error deleting contest:", error);
    
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
      { error: "コンテストの削除に失敗しました" },
      { status: 500 }
    );
  }
}