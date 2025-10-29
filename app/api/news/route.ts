import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// 常に動的に実行されるように設定（キャッシュを完全に無効化）
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const area = searchParams.get("area");
    const organizerType = searchParams.get("organizerType");
    const type = searchParams.get("type");
    const search = searchParams.get("search");
    
    // ページネーションパラメータ
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    // 管理者かどうかを確認（エラーが発生しても続行）
    let isAdmin = false;
    try {
      await requireAdmin();
      isAdmin = true;
    } catch {
      // 管理者でない場合は通常ユーザーとして処理
      isAdmin = false;
    }

    const where: Record<string, unknown> = {};
    
    // 管理者でない場合のみ isActive フィルターを適用
    if (!isAdmin) {
      where.isActive = true;
    }

    if (area) {
      where.area = area;
    }

    if (organizerType) {
      where.organizerType = organizerType;
    }

    if (type) {
      where.type = type;
    }

    if (search) {
      const searchConditions = [
        { type: { contains: search, mode: "insensitive" } },
        { area: { contains: search, mode: "insensitive" } },
        { sector: { contains: search, mode: "insensitive" } },
        { investors: { contains: search, mode: "insensitive" } },
      ];

      where.OR = searchConditions;
    }

    // 総件数を取得
    const totalCount = await prisma.news.count({ where });

    // ページネーション付きでニュースを取得
    const news = await prisma.news.findMany({
      where,
      orderBy: {
        publishedAt: "desc",
      },
      skip,
      take: limit,
    });

    // 投資家を配列に変換
    const newsWithArrayInvestors = news.map(newsItem => ({
      ...newsItem,
      investors: newsItem.investors ? newsItem.investors.split(',') : []
    }));

    // ページネーション情報を含めて返す
    const totalPages = Math.ceil(totalCount / limit);
    
    return NextResponse.json(
      {
        data: newsWithArrayInvestors,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      },
      {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
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
      type,
      company,
      sector,
      amount,
      investors,
      publishedAt,
      sourceUrl,
      area,
    } = body;

    // バリデーション
    if (!title || !company || !type) {
      return NextResponse.json(
        { error: "必須フィールドが不足しています" },
        { status: 400 }
      );
    }

    const news = await prisma.news.create({
      data: {
        title,
        description,
        imageUrl,
        type,
        company,
        sector,
        amount,
        investors: investors ? investors.join(',') : null,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        sourceUrl,
        area,
      },
    });

    return NextResponse.json(
      news,
      {
        status: 201,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    console.error("Error creating news:", error);
    
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
      { error: "ニュースの作成に失敗しました" },
      { status: 500 }
    );
  }
}
