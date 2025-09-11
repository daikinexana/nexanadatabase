import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// 個別イベント取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const event = await prisma.event.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

// イベント更新
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
      isActive,
    } = body;

    // バリデーション
    if (!title || !organizer || !organizerType) {
      return NextResponse.json(
        { error: "必須フィールドが不足しています" },
        { status: 400 }
      );
    }

    // 日付のバリデーション
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    
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

    const event = await prisma.event.update({
      where: {
        id: params.id,
      },
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
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error updating event:", error);
    
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
      { error: "イベントの更新に失敗しました" },
      { status: 500 }
    );
  }
}

// イベント削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 管理者権限を確認
    const user = await requireAdmin();
    
    await prisma.event.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    
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
      { error: "イベントの削除に失敗しました" },
      { status: 500 }
    );
  }
}

// イベントの公開状態切り替え
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 管理者権限を確認
    const user = await requireAdmin();
    
    const body = await request.json();
    const { isActive } = body;

    if (typeof isActive !== 'boolean') {
      return NextResponse.json(
        { error: "isActive must be a boolean" },
        { status: 400 }
      );
    }

    const event = await prisma.event.update({
      where: {
        id: params.id,
      },
      data: {
        isActive,
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error updating event status:", error);
    
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
      { error: "イベントの状態更新に失敗しました" },
      { status: 500 }
    );
  }
}
