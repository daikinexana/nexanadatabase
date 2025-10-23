import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryTag = searchParams.get("categoryTag");
    const area = searchParams.get("area");
    const search = searchParams.get("search");
    
    // ページネーションパラメータ
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      isActive: true,
    };

    if (categoryTag) {
      where.categoryTag = categoryTag;
    }

    if (area) {
      where.area = area;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { categoryTag: { contains: search, mode: "insensitive" } },
      ];
    }

    // 総件数を取得
    const totalCount = await prisma.knowledge.count({ where });

    // ページネーション付きでナレッジを取得
    const knowledge = await prisma.knowledge.findMany({
      where,
      orderBy: {
        publishedAt: "desc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        publishedAt: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        categoryTag: true,
        website: true,
        area: true,
      },
      skip,
      take: limit,
    });

    // ページネーション情報を含めて返す
    const totalPages = Math.ceil(totalCount / limit);
    
    const response = NextResponse.json({
      data: knowledge,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
    
    // キャッシュヘッダーを設定（5分間キャッシュ）
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    
    return response;
  } catch (error) {
    console.error("Error fetching knowledge:", error);
    return NextResponse.json(
      { error: "Failed to fetch knowledge" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Received knowledge data:", body);
    
    const {
      title,
      description,
      imageUrl,
      publishedAt,
      website,
      categoryTag,
      area,
      isActive,
    } = body;

    // バリデーション
    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const knowledge = await prisma.knowledge.create({
      data: {
        title,
        description: description || null,
        imageUrl: imageUrl || null,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        website: website || null,
        categoryTag: categoryTag || null,
        area: area || null,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(knowledge, { status: 201 });
  } catch (error) {
    console.error("Error creating knowledge:", error);
    return NextResponse.json(
      { error: `Failed to create knowledge: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}
