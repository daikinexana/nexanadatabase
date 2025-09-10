import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const news = await prisma.news.findUnique({
      where: {
        id: params.id,
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

    if (!news) {
      return NextResponse.json(
        { error: "News not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      content,
      imageUrl,
      type,
      company,
      sector,
      amount,
      round,
      investors,
      publishedAt,
      source,
      sourceUrl,
      tags,
      isActive,
    } = body;

    const news = await prisma.news.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        description,
        content,
        imageUrl,
        type,
        company,
        sector,
        amount,
        round,
        investors,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        source,
        sourceUrl,
        tags,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json(
      { error: "Failed to update news" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.news.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "News deleted successfully" });
  } catch (error) {
    console.error("Error deleting news:", error);
    return NextResponse.json(
      { error: "Failed to delete news" },
      { status: 500 }
    );
  }
}
