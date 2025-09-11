import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const openCall = await prisma.openCall.findUnique({
      where: { id: params.id },
    });

    if (!openCall) {
      return NextResponse.json(
        { error: "公募が見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(openCall);
  } catch (error) {
    console.error("Error fetching open call:", error);
    return NextResponse.json(
      { error: "公募の取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      openCallType,
      availableResources,
      isActive,
    } = body;

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

    const updateData: any = {};
    
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (deadlineDate !== undefined) updateData.deadline = deadlineDate;
    if (start !== undefined) updateData.startDate = start;
    if (area !== undefined) updateData.area = area;
    if (organizer !== undefined) updateData.organizer = organizer;
    if (organizerType !== undefined) updateData.organizerType = organizerType;
    if (website !== undefined) updateData.website = website;
    if (targetArea !== undefined) updateData.targetArea = targetArea;
    if (targetAudience !== undefined) updateData.targetAudience = targetAudience;
    if (openCallType !== undefined) updateData.openCallType = openCallType;
    if (availableResources !== undefined) updateData.availableResources = availableResources;
    if (isActive !== undefined) updateData.isActive = isActive;

    const openCall = await prisma.openCall.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(openCall);
  } catch (error) {
    console.error("Error updating open call:", error);
    
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
      { error: "公募の更新に失敗しました" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 管理者権限を確認
    await requireAdmin();
    
    await prisma.openCall.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "公募が削除されました" });
  } catch (error) {
    console.error("Error deleting open call:", error);
    
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
      { error: "公募の削除に失敗しました" },
      { status: 500 }
    );
  }
}
