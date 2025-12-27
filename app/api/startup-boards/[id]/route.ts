import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const startupBoard = await prisma.startupBoard.findUnique({
      where: { id },
      select: {
        id: true,
        companyLogoUrl: true,
        companyProductImageUrl: true,
        companyName: true,
        companyDescriptionOneLine: true,
        companyAndProduct: true,
        companyOverview: true,
        corporateNumber: true,
        establishedDate: true,
        employeeCount: true,
        companyUrl: true,
        country: true,
        city: true,
        address: true,
        listingStatus: true,
        fundingStatus: true,
        fundingOverview: true,
        hiringStatus: true,
        hiringOverview: true,
        proposalStatus: true,
        proposalOverview: true,
        collaborationStatus: true,
        collaborationOverview: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        // 担当者情報は返さない（表示不要）
      },
    });

    if (!startupBoard) {
      return NextResponse.json(
        { error: "スタートアップボードが見つかりません" },
        { status: 404 }
      );
    }

    // 公開中のもののみ表示（管理画面以外）
    const admin = new URL(request.url).searchParams.get("admin");
    if (!admin && !startupBoard.isActive) {
      return NextResponse.json(
        { error: "スタートアップボードが見つかりません" },
        { status: 404 }
      );
    }

    const response = NextResponse.json(startupBoard);
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    
    return response;
  } catch (error) {
    console.error("Error fetching startup board:", error);
    return NextResponse.json(
      { error: "Failed to fetch startup board" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 管理者権限を確認
    await requireAdmin();
    
    const { id } = await params;
    const body = await request.json();
    
    const {
      companyLogoUrl,
      companyProductImageUrl,
      companyName,
      companyDescriptionOneLine,
      companyAndProduct,
      companyOverview,
      corporateNumber,
      establishedDate,
      employeeCount,
      companyUrl,
      country,
      city,
      address,
      listingStatus,
      contact1Department,
      contact1Name,
      contact1Email,
      contact2Department,
      contact2Name,
      contact2Email,
      contact3Department,
      contact3Name,
      contact3Email,
      fundingStatus,
      fundingOverview,
      hiringStatus,
      hiringOverview,
      proposalStatus,
      proposalOverview,
      collaborationStatus,
      collaborationOverview,
      isActive,
    } = body;

    // バリデーション
    if (!companyName || !country || !city) {
      return NextResponse.json(
        { error: "必須フィールドが不足しています（企業名、国、都道府県は必須です）" },
        { status: 400 }
      );
    }

    // 日付のバリデーション
    const established = establishedDate ? new Date(establishedDate) : null;
    
    if (established && isNaN(established.getTime())) {
      return NextResponse.json(
        { error: "設立日が無効です" },
        { status: 400 }
      );
    }

    const startupBoard = await prisma.startupBoard.update({
      where: { id },
      data: {
        companyLogoUrl,
        companyProductImageUrl,
        companyName,
        companyDescriptionOneLine,
        companyAndProduct,
        companyOverview,
        corporateNumber,
        establishedDate: established,
        employeeCount,
        companyUrl,
        country,
        city,
        address,
        listingStatus,
        contact1Department,
        contact1Name,
        contact1Email,
        contact2Department,
        contact2Name,
        contact2Email,
        contact3Department,
        contact3Name,
        contact3Email,
        fundingStatus,
        fundingOverview,
        hiringStatus,
        hiringOverview,
        proposalStatus,
        proposalOverview,
        collaborationStatus,
        collaborationOverview,
        isActive,
      },
    });

    return NextResponse.json(startupBoard);
  } catch (error) {
    console.error("Error updating startup board:", error);
    
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
      { error: "スタートアップボードの更新に失敗しました" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 管理者権限を確認
    await requireAdmin();
    
    const { id } = await params;
    
    await prisma.startupBoard.delete({
      where: { id },
    });

    return NextResponse.json({ message: "スタートアップボードを削除しました" });
  } catch (error) {
    console.error("Error deleting startup board:", error);
    
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
      { error: "スタートアップボードの削除に失敗しました" },
      { status: 500 }
    );
  }
}


