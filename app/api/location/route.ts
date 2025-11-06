import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { country: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
      ];
    }

    // descriptionカラムを取得（マイグレーション済み）
    const locations = await prisma.location.findMany({
      where,
      select: {
        id: true,
        slug: true,
        country: true,
        city: true,
        description: true,
        topImageUrl: true,
          mapImageUrl: true,
          companyCard1Image: true,
          companyCard1Name: true,
          companyCard1DescTop: true,
          companyCard1DescBottom: true,
          companyCard2Image: true,
          companyCard2Name: true,
          companyCard2DescTop: true,
          companyCard2DescBottom: true,
          companyCard3Image: true,
          companyCard3Name: true,
          companyCard3DescTop: true,
          companyCard3DescBottom: true,
          experienceCard1Image: true,
          experienceCard1Title: true,
          experienceCard1Url: true,
          experienceCard2Image: true,
          experienceCard2Title: true,
          experienceCard2Url: true,
          experienceCard3Image: true,
          experienceCard3Title: true,
          experienceCard3Url: true,
          sightseeingCard1Image: true,
          sightseeingCard1Title: true,
          sightseeingCard2Image: true,
          sightseeingCard2Title: true,
          sightseeingCard3Image: true,
          sightseeingCard3Title: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          workspaces: {
            where: { isActive: true },
            select: {
              id: true,
              name: true,
              imageUrl: true,
              city: true,
              country: true,
            },
          },
        },
        orderBy: [
          { country: "asc" },
          { city: "asc" },
          { createdAt: "desc" },
        ],
      });

    const response = NextResponse.json(locations);
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    
    return response;
  } catch (error) {
    console.error("Error fetching locations:", error);
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("Location作成API開始");
    
    try {
      await requireAdmin();
      console.log("認証チェック完了");
    } catch (authError) {
      console.error("認証エラー:", authError);
      const errorMessage = authError instanceof Error ? authError.message : "認証エラー";
      if (errorMessage.includes("認証が必要")) {
        return NextResponse.json(
          { error: "認証が必要です", details: errorMessage },
          { status: 401 }
        );
      }
      if (errorMessage.includes("管理者権限")) {
        return NextResponse.json(
          { error: "管理者権限が必要です", details: errorMessage },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { error: "認証エラーが発生しました", details: errorMessage },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    console.log("リクエストボディ:", {
      slug: body.slug,
      country: body.country,
      city: body.city,
      hasTopImage: !!body.topImageUrl,
      hasMapImage: !!body.mapImageUrl,
    });
    
    const {
      slug,
      country,
      city,
      description,
      topImageUrl,
      mapImageUrl,
      companyCard1Image,
      companyCard1Name,
      companyCard1DescTop,
      companyCard1DescBottom,
      companyCard2Image,
      companyCard2Name,
      companyCard2DescTop,
      companyCard2DescBottom,
      companyCard3Image,
      companyCard3Name,
      companyCard3DescTop,
      companyCard3DescBottom,
      experienceCard1Image,
      experienceCard1Title,
      experienceCard1Url,
      experienceCard2Image,
      experienceCard2Title,
      experienceCard2Url,
      experienceCard3Image,
      experienceCard3Title,
      experienceCard3Url,
      sightseeingCard1Image,
      sightseeingCard1Title,
      sightseeingCard2Image,
      sightseeingCard2Title,
      sightseeingCard3Image,
      sightseeingCard3Title,
    } = body;

    if (!slug || !country || !city) {
      console.error("必須フィールド不足:", { slug, country, city });
      return NextResponse.json(
        { error: "必須フィールドが不足しています", details: `slug: ${slug}, country: ${country}, city: ${city}` },
        { status: 400 }
      );
    }

    console.log("PrismaでLocation作成開始");
    const locationData: Prisma.LocationCreateInput = {
      slug,
      country,
      city,
      description,
      topImageUrl,
      mapImageUrl,
      companyCard1Image,
      companyCard1Name,
      companyCard1DescTop,
      companyCard1DescBottom,
      companyCard2Image,
      companyCard2Name,
      companyCard2DescTop,
      companyCard2DescBottom,
      companyCard3Image,
      companyCard3Name,
      companyCard3DescTop,
      companyCard3DescBottom,
      experienceCard1Image,
      experienceCard1Title,
      experienceCard1Url,
      experienceCard2Image,
      experienceCard2Title,
      experienceCard2Url,
      experienceCard3Image,
      experienceCard3Title,
      experienceCard3Url,
      sightseeingCard1Image,
      sightseeingCard1Title,
      sightseeingCard2Image,
      sightseeingCard2Title,
      sightseeingCard3Image,
      sightseeingCard3Title,
    };

    const location = await prisma.location.create({
      data: locationData,
    });

    console.log("Location作成成功:", location.id);
    return NextResponse.json(location, { status: 201 });
  } catch (error) {
    console.error("Error creating location:", error);
    console.error("Error type:", typeof error);
    console.error("Error is Error:", error instanceof Error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    if (error && typeof error === 'object') {
      console.error("Error keys:", Object.keys(error));
      if ('code' in error) {
        console.error("Prisma error code:", (error as { code: string }).code);
      }
    }
    
    // Prisma Clientが正しく初期化されているか確認
    console.error("Prisma client check:", {
      hasPrisma: !!prisma,
      hasLocation: prisma && 'location' in prisma,
      prismaKeys: prisma ? Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')) : []
    });
    
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

    // Prismaのエラーをチェック
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as { code: string; meta?: { target?: string[] } };
      if (prismaError.code === 'P2002') {
        // ユニーク制約違反
        const field = prismaError.meta?.target?.[0] || 'フィールド';
        return NextResponse.json(
          { error: `${field}が既に存在します。別の値を入力してください。` },
          { status: 400 }
        );
      }
    }
    
    // より詳細なエラー情報を返す
    const errorDetails = error instanceof Error 
      ? error.message 
      : typeof error === 'object' && error !== null
      ? JSON.stringify(error, Object.getOwnPropertyNames(error))
      : String(error);
    
    return NextResponse.json(
      { 
        error: "Locationの作成に失敗しました",
        details: errorDetails,
        errorType: typeof error,
        isErrorInstance: error instanceof Error
      },
      { status: 500 }
    );
  }
}

