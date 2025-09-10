import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// 施設の詳細取得
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const facility = await prisma.facility.findUnique({
      where: { id: params.id },
    });

    if (!facility) {
      return NextResponse.json(
        { error: "施設が見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(facility);
  } catch (error) {
    console.error("Error fetching facility:", error);
    return NextResponse.json(
      { error: "Failed to fetch facility" },
      { status: 500 }
    );
  }
}

// 施設の更新
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
      address,
      area,
      organizer,
      organizerType,
      website,
      targetArea,
      facilityInfo,
      targetAudience,
      program,
      isActive,
    } = body;

    // バリデーション
    if (!title || !organizer || !organizerType) {
      return NextResponse.json(
        { error: "必須フィールドが不足しています" },
        { status: 400 }
      );
    }

    // 施設が存在するか確認
    const existingFacility = await prisma.facility.findUnique({
      where: { id: params.id },
    });

    if (!existingFacility) {
      return NextResponse.json(
        { error: "施設が見つかりません" },
        { status: 404 }
      );
    }

    const facility = await prisma.facility.update({
      where: { id: params.id },
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
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(facility);
  } catch (error) {
    console.error("Error updating facility:", error);
    
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
      { error: "施設の更新に失敗しました" },
      { status: 500 }
    );
  }
}

// 施設の削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 管理者権限を確認
    const user = await requireAdmin();
    
    // 施設が存在するか確認
    const existingFacility = await prisma.facility.findUnique({
      where: { id: params.id },
    });

    if (!existingFacility) {
      return NextResponse.json(
        { error: "施設が見つかりません" },
        { status: 404 }
      );
    }

    await prisma.facility.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "施設が削除されました" });
  } catch (error) {
    console.error("Error deleting facility:", error);
    
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
      { error: "施設の削除に失敗しました" },
      { status: 500 }
    );
  }
}

// 施設のステータス更新（公開/非公開）
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 管理者権限を確認
    const user = await requireAdmin();
    
    const body = await request.json();
    const { isActive } = body;

    // 施設が存在するか確認
    const existingFacility = await prisma.facility.findUnique({
      where: { id: params.id },
    });

    if (!existingFacility) {
      return NextResponse.json(
        { error: "施設が見つかりません" },
        { status: 404 }
      );
    }

    const facility = await prisma.facility.update({
      where: { id: params.id },
      data: { isActive },
    });

    return NextResponse.json(facility);
  } catch (error) {
    console.error("Error updating facility status:", error);
    
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
      { error: "施設のステータス更新に失敗しました" },
      { status: 500 }
    );
  }
}
