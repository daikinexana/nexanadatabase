import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ユーザー識別子を取得する関数（より厳密な識別）
function getUserIdentifier(request: NextRequest, startupBoardId: string): string {
  // 1. Cookieから取得（最優先）
  const cookieId = request.cookies.get('nexana_user_id')?.value;
  if (cookieId && cookieId.startsWith('user_')) {
    return cookieId;
  }
  
  // 2. リクエストヘッダーから取得（localStorage経由）
  const clientId = request.headers.get("x-client-id");
  if (clientId && clientId.startsWith('user_')) {
    return clientId;
  }
  
  // 3. IPアドレスとUser-Agentの組み合わせ（フォールバック）
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || 
             request.headers.get("x-real-ip") || 
             "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  
  // IPアドレスベースの識別子を生成（同じIP+User-Agent+スタートアップボードIDの組み合わせで制限）
  const ipBasedId = `ip_${ip}_${userAgent.substring(0, 50)}_${startupBoardId}`.substring(0, 150);
  
  return ipBasedId;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const userIdentifier = getUserIdentifier(request, resolvedParams.id);

    // いいね数を取得
    const likeCount = await prisma.startupBoardLike.count({
      where: { startupBoardId: resolvedParams.id },
    });

    // 現在のユーザーがいいねしているかチェック
    const userLike = await prisma.startupBoardLike.findUnique({
      where: {
        startupBoardId_userIdentifier: {
          startupBoardId: resolvedParams.id,
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
    const userIdentifier = getUserIdentifier(request, resolvedParams.id);

    // CookieにユーザーIDが設定されていない場合は、レスポンスでCookieを設定
    const cookieId = request.cookies.get('nexana_user_id')?.value;
    const clientId = request.headers.get("x-client-id");
    
    // 既存のいいねをチェック
    const existingLike = await prisma.startupBoardLike.findUnique({
      where: {
        startupBoardId_userIdentifier: {
          startupBoardId: resolvedParams.id,
          userIdentifier: userIdentifier,
        },
      },
    });

    // レスポンスを作成（Cookie設定用）
    const createResponse = (data: { success: boolean; isLiked: boolean; likeCount: number }) => {
      const response = NextResponse.json(data);
      
      // CookieとlocalStorageのIDを同期（クライアントIDがある場合）
      if (clientId && clientId.startsWith('user_') && cookieId !== clientId) {
        response.cookies.set('nexana_user_id', clientId, {
          maxAge: 365 * 24 * 60 * 60, // 1年間
          path: '/',
          sameSite: 'lax',
          httpOnly: false, // クライアント側からも読み取り可能
        });
      }
      
      return response;
    };

    if (existingLike) {
      // 既にいいねしている場合は削除（トグル）
      await prisma.startupBoardLike.delete({
        where: {
          id: existingLike.id,
        },
      });

      const likeCount = await prisma.startupBoardLike.count({
        where: { startupBoardId: resolvedParams.id },
      });

      return createResponse({
        success: true,
        isLiked: false,
        likeCount,
      });
    } else {
      // いいねを追加（ユニーク制約で1人1回を保証）
      try {
        await prisma.startupBoardLike.create({
          data: {
            startupBoardId: resolvedParams.id,
            userIdentifier: userIdentifier,
          },
        });
      } catch (createError: unknown) {
        // ユニーク制約エラー（既にいいねが存在する場合）を無視
        if (createError && typeof createError === 'object' && 'code' in createError && createError.code === 'P2002') {
          // 既にいいねが存在する場合は、既存のいいねを取得
          const existingLike = await prisma.startupBoardLike.findUnique({
            where: {
              startupBoardId_userIdentifier: {
                startupBoardId: resolvedParams.id,
                userIdentifier: userIdentifier,
              },
            },
          });
          
          if (existingLike) {
            // 既にいいねが存在する場合は、そのまま返す
            const likeCount = await prisma.startupBoardLike.count({
              where: { startupBoardId: resolvedParams.id },
            });
            
            return createResponse({
              success: true,
              isLiked: true,
              likeCount,
            });
          }
        }
        throw createError;
      }

      const likeCount = await prisma.startupBoardLike.count({
        where: { startupBoardId: resolvedParams.id },
      });

      return createResponse({
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

