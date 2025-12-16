import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ユーザー識別子を取得する関数（IPアドレスとUser-Agentの組み合わせ）
function getUserIdentifier(request: NextRequest): string {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || 
             request.headers.get("x-real-ip") || 
             "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  // localStorageのユニークIDがリクエストヘッダーに含まれている場合はそれを使用
  const clientId = request.headers.get("x-client-id");
  
  if (clientId) {
    return clientId;
  }
  
  // フォールバック: IP + User-Agentのハッシュ
  return `${ip}-${userAgent}`.substring(0, 100); // 長さ制限
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const userIdentifier = getUserIdentifier(request);

    // いいね数を取得
    const likeCount = await prisma.workspaceLike.count({
      where: { workspaceId: resolvedParams.id },
    });

    // 現在のユーザーがいいねしているかチェック
    const userLike = await prisma.workspaceLike.findUnique({
      where: {
        workspaceId_userIdentifier: {
          workspaceId: resolvedParams.id,
          userIdentifier: userIdentifier,
        },
      },
    });

    return NextResponse.json({
      likeCount,
      isLiked: !!userLike,
    });
  } catch (error) {
    console.error("Error fetching likes:", error);
    return NextResponse.json(
      { error: "いいね情報の取得に失敗しました" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const userIdentifier = getUserIdentifier(request);

    // 既存のいいねをチェック
    const existingLike = await prisma.workspaceLike.findUnique({
      where: {
        workspaceId_userIdentifier: {
          workspaceId: resolvedParams.id,
          userIdentifier: userIdentifier,
        },
      },
    });

    if (existingLike) {
      // 既にいいねしている場合は削除（トグル）
      await prisma.workspaceLike.delete({
        where: {
          id: existingLike.id,
        },
      });

      const likeCount = await prisma.workspaceLike.count({
        where: { workspaceId: resolvedParams.id },
      });

      return NextResponse.json({
        success: true,
        isLiked: false,
        likeCount,
      });
    } else {
      // いいねを追加
      await prisma.workspaceLike.create({
        data: {
          workspaceId: resolvedParams.id,
          userIdentifier: userIdentifier,
        },
      });

      const likeCount = await prisma.workspaceLike.count({
        where: { workspaceId: resolvedParams.id },
      });

      return NextResponse.json({
        success: true,
        isLiked: true,
        likeCount,
      });
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "いいねの処理に失敗しました" },
      { status: 500 }
    );
  }
}
