import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const area = searchParams.get("area");
    const organizerType = searchParams.get("organizerType");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const where: any = {
      isActive: true,
    };

    if (area) {
      where.area = area;
    }

    if (organizerType) {
      where.organizerType = organizerType;
    }

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { author: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }

    const knowledge = await prisma.knowledge.findMany({
      where,
      orderBy: {
        publishedAt: "desc",
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
    const knowledgeWithArrayTags = knowledge.map(knowledgeItem => ({
      ...knowledgeItem,
      tags: knowledgeItem.tags ? knowledgeItem.tags.split(',') : []
    }));

    return NextResponse.json(knowledgeWithArrayTags);
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
      content,
      imageUrl,
      category,
      author,
      publishedAt,
      tags,
      isActive,
    } = body;

    // バリデーション
    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }

    // まずユーザーを取得または作成
    let user;
    try {
      user = await prisma.user.findFirst({
        where: { role: "ADMIN" }
      });
      
      if (!user) {
        // 管理者ユーザーが存在しない場合は作成
        user = await prisma.user.create({
          data: {
            clerkId: "admin_user",
            email: "admin@example.com",
            name: "Admin User",
            role: "ADMIN"
          }
        });
      }
    } catch (userError) {
      console.error("Error with user:", userError);
      return NextResponse.json(
        { error: "User setup failed" },
        { status: 500 }
      );
    }

    const knowledge = await prisma.knowledge.create({
      data: {
        title,
        description: description || null,
        content: content || "",
        imageUrl: imageUrl || null,
        category,
        author: author || null,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        tags: tags && tags.length > 0 ? tags.join(',') : null,
        isActive: isActive ?? true,
        createdBy: user.id,
      },
    });

    return NextResponse.json(knowledge, { status: 201 });
  } catch (error) {
    console.error("Error creating knowledge:", error);
    return NextResponse.json(
      { error: `Failed to create knowledge: ${error.message}` },
      { status: 500 }
    );
  }
}
