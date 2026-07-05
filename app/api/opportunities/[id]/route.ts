import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const KINDS = ["contest", "open-call", "program"] as const;

// 個別取得
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const opportunity = await prisma.opportunity.findUnique({ where: { id } });
    if (!opportunity) {
      return NextResponse.json(
        { error: "Opportunity not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(opportunity);
  } catch (error) {
    console.error("Error fetching opportunity:", error);
    return NextResponse.json(
      { error: "Failed to fetch opportunity" },
      { status: 500 }
    );
  }
}

// 更新
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();

    const missing: string[] = [];
    if (!body.title) missing.push("タイトル");
    if (!body.organizer) missing.push("主催者");
    if (!body.area) missing.push("エリア");
    if (!body.deadline) missing.push("締切日");
    if (!body.startDate) missing.push("開始日");
    if (!body.website) missing.push("リンクURL");
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `必須項目が不足しています: ${missing.join("、")}` },
        { status: 400 }
      );
    }
    if (body.kind && !(KINDS as readonly string[]).includes(body.kind)) {
      return NextResponse.json({ error: "種別（kind）が不正です" }, { status: 400 });
    }

    const deadlineDate = new Date(body.deadline);
    const start = new Date(body.startDate);
    if (isNaN(deadlineDate.getTime())) {
      return NextResponse.json({ error: "締切日が無効です" }, { status: 400 });
    }
    if (isNaN(start.getTime())) {
      return NextResponse.json({ error: "開始日が無効です" }, { status: 400 });
    }

    const updated = await prisma.opportunity.update({
      where: { id },
      data: {
        ...(body.kind ? { kind: body.kind } : {}),
        title: body.title,
        organizer: body.organizer,
        organizerType: body.organizerType || null,
        area: body.area,
        deadline: deadlineDate,
        startDate: start,
        website: body.website,
        description: body.description || null,
        imageUrl: body.imageUrl || null,
        benefit: body.benefit || null,
        targetArea: body.targetArea || null,
        targetAudience: body.targetAudience || null,
        operatingCompany: body.operatingCompany || null,
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
    });

    revalidatePath("/opportunities");
    revalidatePath("/");

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating opportunity:", error);
    if (error instanceof Error && error.message.includes("認証")) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }
    if (error instanceof Error && error.message.includes("管理者権限")) {
      return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 });
    }
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return NextResponse.json(
        { error: "オポチュニティが見つかりません" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "オポチュニティの更新に失敗しました" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  return PUT(request, ctx);
}

// 削除
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.opportunity.delete({ where: { id } });
    revalidatePath("/opportunities");
    revalidatePath("/");
    return NextResponse.json({ message: "Opportunity deleted successfully" });
  } catch (error) {
    console.error("Error deleting opportunity:", error);
    if (error instanceof Error && error.message.includes("認証")) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }
    if (error instanceof Error && error.message.includes("管理者権限")) {
      return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 });
    }
    return NextResponse.json(
      { error: "オポチュニティの削除に失敗しました" },
      { status: 500 }
    );
  }
}
