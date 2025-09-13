import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const news = await prisma.news.findUnique({
      where: {
        id: resolvedParams.id,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
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
      isActive,
    } = body;

    const news = await prisma.news.update({
      where: {
        id: resolvedParams.id,
      },
      data: {
        title,
        description,
        imageUrl,
        type,
        company,
        sector,
        amount,
        investors,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        sourceUrl,
        area,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    await prisma.news.delete({
      where: {
        id: resolvedParams.id,
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
