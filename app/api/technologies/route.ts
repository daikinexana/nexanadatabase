import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const area = searchParams.get("area");
    const providerType = searchParams.get("providerType");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const where: any = {
      isActive: true,
    };

    if (area) {
      where.area = area;
    }

    if (providerType) {
      where.providerType = providerType;
    }

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { provider: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }

    const technologies = await prisma.technology.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        createdByUser: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // タグを配列に変換
    const technologiesWithArrayTags = technologies.map(technology => ({
      ...technology,
      tags: technology.tags ? technology.tags.split(',') : []
    }));

    return NextResponse.json(technologiesWithArrayTags);
  } catch (error) {
    console.error("Error fetching technologies:", error);
    return NextResponse.json(
      { error: "Failed to fetch technologies" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 管理者権限を確認
    const user = await requireAdmin();
    
    const body = await request.json();
    const {
      title,
      description,
      content,
      imageUrl,
      category,
      area,
      provider,
      providerType,
      website,
      contact,
      tags,
    } = body;

    // バリデーション
    if (!title || !provider || !providerType || !category) {
      return NextResponse.json(
        { error: "必須フィールドが不足しています" },
        { status: 400 }
      );
    }

    const technology = await prisma.technology.create({
      data: {
        title,
        description,
        content,
        imageUrl,
        category,
        area,
        provider,
        providerType,
        website,
        contact,
        tags: tags ? tags.join(',') : null,
        createdBy: user.id,
      },
    });

    return NextResponse.json(technology, { status: 201 });
  } catch (error) {
    console.error("Error creating technology:", error);
    
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
      { error: "技術情報の作成に失敗しました" },
      { status: 500 }
    );
  }
}
