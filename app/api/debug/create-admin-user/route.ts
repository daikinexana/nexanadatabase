import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { clerkId, email, name } = await req.json();
    
    if (!clerkId || !email) {
      return NextResponse.json(
        { error: "clerkIdとemailが必要です" },
        { status: 400 }
      );
    }

    // 管理者ユーザーを作成
    const adminUser = await prisma.user.create({
      data: {
        clerkId: clerkId,
        email: email,
        name: name || "Admin User",
        role: "ADMIN",
      },
    });

    return NextResponse.json({
      message: "管理者ユーザーが作成されました",
      user: {
        id: adminUser.id,
        clerkId: adminUser.clerkId,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
      },
    });
  } catch (error) {
    console.error("Error creating admin user:", error);
    return NextResponse.json(
      { error: "管理者ユーザーの作成に失敗しました" },
      { status: 500 }
    );
  }
}
