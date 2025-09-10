import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { clerkId, role } = await req.json();
    
    if (!clerkId || !role) {
      return NextResponse.json(
        { error: "clerkIdとroleが必要です" },
        { status: 400 }
      );
    }

    // ユーザーのroleを更新
    const updatedUser = await prisma.user.update({
      where: {
        clerkId: clerkId,
      },
      data: {
        role: role,
      },
    });

    return NextResponse.json({
      message: "ユーザーのroleが更新されました",
      user: {
        id: updatedUser.id,
        clerkId: updatedUser.clerkId,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "ユーザーのrole更新に失敗しました" },
      { status: 500 }
    );
  }
}
