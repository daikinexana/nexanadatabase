import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const KINDS = ["contest", "open-call"] as const;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const kind = searchParams.get("kind");
    const area = searchParams.get("area");
    const search = searchParams.get("search");
    const admin = searchParams.get("admin"); // 管理画面用フラグ

    const where: Record<string, unknown> = {};

    // 管理画面以外では公開中のみ
    if (!admin) {
      where.isActive = true;
    }

    if (kind && (KINDS as readonly string[]).includes(kind)) {
      where.kind = kind;
    }

    if (area) {
      where.area = area;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { organizer: { contains: search, mode: "insensitive" } },
        { targetArea: { contains: search, mode: "insensitive" } },
        { targetAudience: { contains: search, mode: "insensitive" } },
        { benefit: { contains: search, mode: "insensitive" } },
      ];
    }

    const opportunities = await prisma.opportunity.findMany({
      where,
      orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
    });

    const response = NextResponse.json(opportunities);
    response.headers.set(
      "Cache-Control",
      "public, s-maxage=3600, stale-while-revalidate=86400"
    );
    return response;
  } catch (error) {
    console.error("Error fetching opportunities:", error);
    return NextResponse.json(
      { error: "Failed to fetch opportunities" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const body = await request.json();
    const {
      kind,
      title,
      organizer,
      organizerType,
      area,
      deadline,
      startDate,
      website,
      description,
      imageUrl,
      benefit,
      targetArea,
      targetAudience,
      operatingCompany,
    } = body;

    // 必須フィールドのバリデーション
    const missing: string[] = [];
    if (!title) missing.push("タイトル");
    if (!organizer) missing.push("主催者");
    if (!area) missing.push("エリア");
    if (!deadline) missing.push("締切日");
    if (!startDate) missing.push("開始日");
    if (!website) missing.push("リンクURL");
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `必須項目が不足しています: ${missing.join("、")}` },
        { status: 400 }
      );
    }

    if (!(KINDS as readonly string[]).includes(kind)) {
      return NextResponse.json(
        { error: "種別（kind）が不正です" },
        { status: 400 }
      );
    }

    const deadlineDate = new Date(deadline);
    const start = new Date(startDate);
    if (isNaN(deadlineDate.getTime())) {
      return NextResponse.json({ error: "締切日が無効です" }, { status: 400 });
    }
    if (isNaN(start.getTime())) {
      return NextResponse.json({ error: "開始日が無効です" }, { status: 400 });
    }

    const opportunity = await prisma.opportunity.create({
      data: {
        kind,
        title,
        organizer,
        organizerType: organizerType || null,
        area,
        deadline: deadlineDate,
        startDate: start,
        website,
        description: description || null,
        imageUrl: imageUrl || null,
        benefit: benefit || null,
        targetArea: targetArea || null,
        targetAudience: targetAudience || null,
        operatingCompany: operatingCompany || null,
      },
    });

    return NextResponse.json(opportunity, { status: 201 });
  } catch (error) {
    console.error("Error creating opportunity:", error);

    if (error instanceof Error && error.message.includes("認証")) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }
    if (error instanceof Error && error.message.includes("管理者権限")) {
      return NextResponse.json(
        { error: "管理者権限が必要です" },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { error: "オポチュニティの作成に失敗しました" },
      { status: 500 }
    );
  }
}
