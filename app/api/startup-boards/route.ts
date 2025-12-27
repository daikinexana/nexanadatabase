import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country");
    const city = searchParams.get("city");
    const search = searchParams.get("search");
    const fundingStatus = searchParams.get("fundingStatus");
    const hiringStatus = searchParams.get("hiringStatus");
    const proposalStatus = searchParams.get("proposalStatus");
    const collaborationStatus = searchParams.get("collaborationStatus");
    const admin = searchParams.get("admin"); // 管理画面用フラグ

    const where: Record<string, unknown> = {};

    // 管理画面以外では公開中のスタートアップのみ表示
    if (!admin) {
      where.isActive = true;
    }

    if (country) {
      where.country = country;
    }

    if (city) {
      where.city = city;
    }

    if (fundingStatus) {
      where.fundingStatus = fundingStatus;
    }

    if (hiringStatus) {
      where.hiringStatus = hiringStatus;
    }

    if (proposalStatus) {
      where.proposalStatus = proposalStatus;
    }

    if (collaborationStatus) {
      where.collaborationStatus = collaborationStatus;
    }

    if (search) {
      // 複数フィールドで部分一致検索
      where.OR = [
        { companyName: { contains: search, mode: "insensitive" } },
        { companyDescriptionOneLine: { contains: search, mode: "insensitive" } },
        { companyAndProduct: { contains: search, mode: "insensitive" } },
        { companyOverview: { contains: search, mode: "insensitive" } },
        { series: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { country: { contains: search, mode: "insensitive" } },
        { fundingOverview: { contains: search, mode: "insensitive" } },
        { hiringOverview: { contains: search, mode: "insensitive" } },
        { proposalOverview: { contains: search, mode: "insensitive" } },
        { collaborationOverview: { contains: search, mode: "insensitive" } },
      ];
    }

    const startupBoards = await prisma.startupBoard.findMany({
      where,
      orderBy: [
        { createdAt: "desc" },
      ],
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

    const response = NextResponse.json(startupBoards);
    
    // キャッシュヘッダーを設定
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    
    return response;
  } catch (error) {
    console.error("Error fetching startup boards:", error);
    return NextResponse.json(
      { error: "Failed to fetch startup boards" },
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

    const startupBoard = await prisma.startupBoard.create({
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
      },
    });

    return NextResponse.json(startupBoard, { status: 201 });
  } catch (error) {
    console.error("Error creating startup board:", error);
    
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
      { error: "スタートアップボードの作成に失敗しました" },
      { status: 500 }
    );
  }
}


