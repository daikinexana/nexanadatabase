import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return null;
    }

    // まずデータベースからユーザーを検索
    let user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    // ユーザーが存在しない場合、Clerkから情報を取得して作成
    if (!user) {
      try {
        const clerkUser = await currentUser();
        
        if (clerkUser) {
          user = await prisma.user.create({
            data: {
              clerkId: clerkUser.id,
              email: clerkUser.emailAddresses[0]?.emailAddress || "",
              name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
              role: "MEMBER", // デフォルトでメンバー権限を付与
            },
          });
          
          console.log(`User created automatically: ${user.email}`);
        }
      } catch (error) {
        console.error("Error creating user automatically:", error);
      }
    }

    return user;
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return null;
  }
}

export async function getClerkUser() {
  try {
    return await currentUser();
  } catch (error) {
    console.error("Error in getClerkUser:", error);
    return null;
  }
}

export async function requireAuth() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      throw new Error("認証が必要です");
    }

    const user = await getCurrentUser();
    
    if (!user) {
      throw new Error("ユーザーが見つかりません");
    }

    return user;
  } catch (error) {
    console.error("Error in requireAuth:", error);
    throw error;
  }
}

export async function requireAdmin() {
  try {
    const user = await requireAuth();
    
    if (user.role !== "ADMIN") {
      throw new Error("管理者権限が必要です");
    }

    return user;
  } catch (error) {
    console.error("Error in requireAdmin:", error);
    throw error;
  }
}
