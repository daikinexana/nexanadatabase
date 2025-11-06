import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("Location GET API called");
    const resolvedParams = await params;
    console.log("Location ID/Slug:", resolvedParams.id);
    
    // Try to find by ID first, then by slug
    const selectFields = {
      id: true,
      slug: true,
      country: true,
      city: true,
      description: true,
      topImageUrl: true,
      mapImageUrl: true,
      companyCard1Image: true,
      companyCard1Name: true,
      companyCard1DescTop: true,
      companyCard1DescBottom: true,
      companyCard2Image: true,
      companyCard2Name: true,
      companyCard2DescTop: true,
      companyCard2DescBottom: true,
      companyCard3Image: true,
      companyCard3Name: true,
      companyCard3DescTop: true,
      companyCard3DescBottom: true,
      experienceCard1Image: true,
      experienceCard1Title: true,
      experienceCard1Url: true,
      experienceCard2Image: true,
      experienceCard2Title: true,
      experienceCard2Url: true,
      experienceCard3Image: true,
      experienceCard3Title: true,
      experienceCard3Url: true,
      sightseeingCard1Image: true,
      sightseeingCard1Title: true,
      sightseeingCard2Image: true,
      sightseeingCard2Title: true,
      sightseeingCard3Image: true,
      sightseeingCard3Title: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
      workspaces: {
        where: { isActive: true },
      },
    };

    let location = await prisma.location.findUnique({
      where: { id: resolvedParams.id },
      select: selectFields,
    });

    if (!location) {
      console.log("Not found by ID, trying slug");
      location = await prisma.location.findUnique({
        where: { slug: resolvedParams.id },
        select: selectFields,
      });
    }

    if (!location) {
      console.log("Location not found:", resolvedParams.id);
      return NextResponse.json(
        { error: "Locationが見つかりません" },
        { status: 404 }
      );
    }

    console.log("Location found:", location.id);
    return NextResponse.json(location);
  } catch (error) {
    console.error("Error fetching location:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      { 
        error: "Failed to fetch location",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    
    const resolvedParams = await params;
    const body = await request.json();

    console.log("Location更新API開始:", resolvedParams.id);
    console.log("更新データ:", Object.keys(body));
    console.log("更新データの内容:", body);

    // undefinedとnullのフィールドのみ削除（空文字列は許可してnullに変換）
    const dataToUpdate = Object.fromEntries(
      Object.entries(body)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(([key, value]) => [key, value === '' ? null : value])
    );

    console.log("更新するデータ（フィルタ後）:", Object.keys(dataToUpdate));
    console.log("更新するデータの内容:", dataToUpdate);

    const location = await prisma.location.update({
      where: { id: resolvedParams.id },
      data: dataToUpdate,
    });

    console.log("Location更新成功:", location.id);
    return NextResponse.json(location);
  } catch (error) {
    console.error("Error updating location:", error);
    console.error("Error type:", typeof error);
    
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    
    if (error && typeof error === 'object') {
      console.error("Error keys:", Object.keys(error));
      if ('code' in error) {
        console.error("Prisma error code:", (error as { code: string }).code);
      }
    }
    
    if (error instanceof Error && error.message.includes("認証")) {
      return NextResponse.json(
        { error: "認証が必要です", details: error.message },
        { status: 401 }
      );
    }
    
    if (error instanceof Error && error.message.includes("管理者権限")) {
      return NextResponse.json(
        { error: "管理者権限が必要です", details: error.message },
        { status: 403 }
      );
    }

    // Prismaのエラーをチェック
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as { code: string; meta?: { target?: string[] } };
      
      if (prismaError.code === 'P2002') {
        // ユニーク制約違反
        const field = prismaError.meta?.target?.[0] || 'フィールド';
        return NextResponse.json(
          { error: `${field}が既に存在します。別の値を入力してください。`, details: prismaError.meta },
          { status: 400 }
        );
      }
      
      if (prismaError.code === 'P2025') {
        // レコードが見つからない
        return NextResponse.json(
          { error: "Locationが見つかりません", details: "指定されたIDのLocationが存在しません" },
          { status: 404 }
        );
      }
    }
    
    // より詳細なエラー情報を返す
    const errorDetails = error instanceof Error 
      ? error.message 
      : typeof error === 'object' && error !== null
      ? JSON.stringify(error, Object.getOwnPropertyNames(error))
      : String(error);
    
    return NextResponse.json(
      { 
        error: "Locationの更新に失敗しました",
        details: errorDetails,
        errorType: typeof error,
        isErrorInstance: error instanceof Error
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    
    const resolvedParams = await params;
    
    await prisma.location.update({
      where: { id: resolvedParams.id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting location:", error);
    
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
      { error: "Locationの削除に失敗しました" },
      { status: 500 }
    );
  }
}

