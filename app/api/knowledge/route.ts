import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryTag = searchParams.get("categoryTag");
    const search = searchParams.get("search");

    const where: any = {
      isActive: true,
    };

    if (categoryTag) {
      where.categoryTag = categoryTag;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { categoryTag: { contains: search, mode: "insensitive" } },
      ];
    }

    const knowledge = await prisma.knowledge.findMany({
      where,
      orderBy: {
        publishedAt: "desc",
      },
    });

    return NextResponse.json(knowledge);
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
      { error: `Failed to create knowledge: ${error.message}` },
      { status: 500 }
    );
  }
}
