import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const knowledge = await prisma.knowledge.findUnique({
      where: {
        id: resolvedParams.id,
      },
    });

    if (!knowledge) {
      return NextResponse.json(
        { error: "Knowledge not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(knowledge);
  } catch (error) {
    console.error("Error fetching knowledge:", error);
    return NextResponse.json(
      { error: "Failed to fetch knowledge" },
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
      publishedAt,
      website,
      categoryTag,
      area,
      isActive,
    } = body;

    const knowledge = await prisma.knowledge.update({
      where: {
        id: resolvedParams.id,
      },
      data: {
        title,
        description,
        imageUrl,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        website,
        categoryTag,
        area,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(knowledge);
  } catch (error) {
    console.error("Error updating knowledge:", error);
    return NextResponse.json(
      { error: "Failed to update knowledge" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const { isActive } = body;

    const knowledge = await prisma.knowledge.update({
      where: {
        id: resolvedParams.id,
      },
      data: {
        isActive,
      },
    });

    return NextResponse.json(knowledge);
  } catch (error) {
    console.error("Error updating knowledge status:", error);
    return NextResponse.json(
      { error: "Failed to update knowledge status" },
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
    await prisma.knowledge.delete({
      where: {
        id: resolvedParams.id,
      },
    });

    return NextResponse.json({ message: "Knowledge deleted successfully" });
  } catch (error) {
    console.error("Error deleting knowledge:", error);
    return NextResponse.json(
      { error: "Failed to delete knowledge" },
      { status: 500 }
    );
  }
}
