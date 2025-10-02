import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// 個別コンテスト取得
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const contest = await prisma.contest.findUnique({
      where: {
        id: resolvedParams.id,
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

// コンテスト更新
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("=== Starting contest update ===");
    
    const resolvedParams = await params;
    const contestId = resolvedParams.id;
    console.log("Contest ID:", contestId);
    
    if (!contestId) {
      return NextResponse.json(
        { error: "コンテストIDが指定されていません" },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    console.log("Request body:", JSON.stringify(body, null, 2));
    
    // 必須フィールドのチェック
    if (!body.title) {
      return NextResponse.json(
        { error: "タイトルは必須です" },
        { status: 400 }
      );
    }
    
    if (!body.organizer) {
      return NextResponse.json(
        { error: "主催者は必須です" },
        { status: 400 }
      );
    }
    
    // 日付の処理
    const deadlineDate = body.deadline ? new Date(body.deadline) : null;
    const startDate = body.startDate ? new Date(body.startDate) : null;
    
    console.log("Processed dates:", { deadlineDate, startDate });
    
    // データベース接続テスト
    console.log("Testing database connection...");
    try {
      const testQuery = await prisma.contest.findFirst();
      console.log("Database connection successful, found contest:", testQuery?.id || "No contests found");
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
      return NextResponse.json(
        { error: "データベース接続エラー", details: dbError instanceof Error ? dbError.message : 'Unknown database error' },
        { status: 500 }
      );
    }
    
    // データベース更新
    console.log("Updating database...");
    const updatedContest = await prisma.contest.update({
      where: { id: contestId },
      data: {
        title: body.title,
        description: body.description || null,
        imageUrl: body.imageUrl || null,
        deadline: deadlineDate,
        startDate: startDate,
        area: body.area || null,
        organizer: body.organizer,
        organizerType: body.organizerType || null,
        website: body.website || null,
        targetArea: body.targetArea || null,
        targetAudience: body.targetAudience || null,
        incentive: body.incentive || null,
        operatingCompany: body.operatingCompany || null,
        isActive: body.isActive !== undefined ? body.isActive : true,
        isPopular: body.isPopular,
      },
    });
    
    console.log("Contest updated successfully:", updatedContest?.id || "No ID");
    console.log("Updated contest object:", updatedContest);
    console.log("=== Update completed ===");
    
    if (!updatedContest) {
      return NextResponse.json(
        { error: "更新されたコンテストが返されませんでした" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(updatedContest);
    
  } catch (error) {
    console.error("=== Error in PUT ===");
    console.error("Error type:", typeof error);
    console.error("Error message:", error instanceof Error ? error.message : String(error));
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack");
    
    // データベースエラーの場合
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return NextResponse.json(
        { error: "コンテストが見つかりません", details: "指定されたIDのコンテストが存在しません" },
        { status: 404 }
      );
    }
    
    // その他のエラー
    return NextResponse.json(
      { 
        error: "コンテストの更新に失敗しました", 
        details: error instanceof Error ? error.message : "Unknown error",
        type: typeof error
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return PUT(request, { params });
}

// コンテスト削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 管理者権限を確認
    await requireAdmin();
    
    const resolvedParams = await params;
    
    await prisma.contest.delete({
      where: {
        id: resolvedParams.id,
      },
    });

    return NextResponse.json({ message: "Contest deleted successfully" });
  } catch (error) {
    console.error("Error deleting contest:", error);
    
    if (error instanceof Error && error.message.includes("認証")) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }
    
    if (error instanceof Error && error.message.includes("管理者権限")) {
      return NextResponse.json(
        { error: "管理者権限が必要です" },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: "コンテストの削除に失敗しました" },
      { status: 500 }
    );
  }
}