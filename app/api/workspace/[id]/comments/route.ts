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

    // コメント一覧を取得（新しい順）
    const comments = await prisma.workspaceComment.findMany({
      where: { workspaceId: resolvedParams.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      comments: comments.map((comment) => ({
        id: comment.id,
        userName: comment.userName || "匿名ユーザー",
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "コメントの取得に失敗しました" },
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
    const body = await request.json();
    const { content, userName } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "コメント内容を入力してください" },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: "コメントは1000文字以内で入力してください" },
        { status: 400 }
      );
    }

    const userIdentifier = getUserIdentifier(request);

    // コメントを追加
    const comment = await prisma.workspaceComment.create({
      data: {
        workspaceId: resolvedParams.id,
        userIdentifier: userIdentifier,
        userName: userName || null,
        content: content.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      comment: {
        id: comment.id,
        userName: comment.userName || "匿名ユーザー",
        content: comment.content,
        createdAt: comment.createdAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "コメントの投稿に失敗しました" },
      { status: 500 }
    );
  }
}
