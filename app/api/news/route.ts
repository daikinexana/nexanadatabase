import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const area = searchParams.get("area");
    const organizerType = searchParams.get("organizerType");
    const type = searchParams.get("type");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {
      isActive: true,
    };

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
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { company: { contains: search, mode: "insensitive" } },
        { sector: { contains: search, mode: "insensitive" } },
      ];
    }

    const news = await prisma.news.findMany({
      where,
      orderBy: {
        publishedAt: "desc",
      },
    });

    // 投資家を配列に変換
    const newsWithArrayInvestors = news.map(newsItem => ({
      ...newsItem,
      investors: newsItem.investors ? newsItem.investors.split(',') : []
    }));

    return NextResponse.json(newsWithArrayInvestors);
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

    return NextResponse.json(news, { status: 201 });
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
