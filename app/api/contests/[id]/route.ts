import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const contest = await prisma.contest.findUnique({
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

    if (!contest) {
      return NextResponse.json(
        { error: "Contest not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(contest);
  } catch (error) {
    console.error("Error fetching contest:", error);
    return NextResponse.json(
      { error: "Failed to fetch contest" },
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
      deadline,
      startDate,
      endDate,
      area,
      organizer,
      organizerType,
      category,
      tags,
      website,
      amount,
      isActive,
    } = body;

    const contest = await prisma.contest.update({
      where: {
        id: params.id,
      },
      data: {
        title,
        description,
        content,
        imageUrl,
        deadline: deadline ? new Date(deadline) : null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        area,
        organizer,
        organizerType,
        category,
        tags,
        website,
        amount,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json(contest);
  } catch (error) {
    console.error("Error updating contest:", error);
    return NextResponse.json(
      { error: "Failed to update contest" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { isActive } = body;

    const contest = await prisma.contest.update({
      where: {
        id: params.id,
      },
      data: {
        isActive,
      },
    });

    return NextResponse.json(contest);
  } catch (error) {
    console.error("Error updating contest status:", error);
    return NextResponse.json(
      { error: "Failed to update contest status" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.contest.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "Contest deleted successfully" });
  } catch (error) {
    console.error("Error deleting contest:", error);
    return NextResponse.json(
      { error: "Failed to delete contest" },
      { status: 500 }
    );
  }
}
