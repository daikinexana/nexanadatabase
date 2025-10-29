import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * 現在ログインしているユーザーをADMINに昇格させる（デバッグ用）
 * GET /api/debug/promote-current-user
 */
export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: "認証されていません" },
        { status: 401 }
      );
    }

    // ユーザーのroleをADMINに更新
    const updatedUser = await prisma.user.update({
      where: {
        clerkId: user.clerkId,
      },
      data: {
        role: "ADMIN",
      },
    });

    return NextResponse.json({
      message: "ユーザーがADMINに昇格しました",
      user: {
        id: updatedUser.id,
        clerkId: updatedUser.clerkId,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Error promoting user to ADMIN:", error);
    return NextResponse.json(
      { error: "ユーザーの昇格に失敗しました", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

