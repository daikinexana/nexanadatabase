import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companyName, name, email, contestUrl, action, comment } = body;

    // 必須フィールドのバリデーション
    if (!name || !email || !action) {
      return NextResponse.json(
        { error: "必須フィールド（お名前、メールアドレス、希望するアクション）を入力してください" },
        { status: 400 }
      );
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "有効なメールアドレスを入力してください" },
        { status: 400 }
      );
    }

    // アクションの値チェック
    const validActions = ["add", "remove", "other"];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: "無効なアクションが選択されています" },
        { status: 400 }
      );
    }

    // データベースに保存
    try {
      await prisma.contestOrganizerInquiry.create({
        data: {
          companyName: companyName || null,
          name,
          email,
          contestUrl: contestUrl || null,
          action,
          comment: comment || null,
        },
      });

      // ログにも出力（デバッグ用）
      console.log("=== コンテスト主催者お問い合わせ（DB保存済み） ===");
      console.log("会社名:", companyName || "未入力");
      console.log("お名前:", name);
      console.log("メールアドレス:", email);
      console.log("対象のコンテストURL:", contestUrl || "未入力");
      console.log("希望するアクション:", action);
      console.log("コメント:", comment || "未入力");
      console.log("送信日時:", new Date().toISOString());
      console.log("================================");
    } catch (dbError) {
      console.error("データベース保存エラー:", dbError);
      // データベースエラーでもログには出力
      console.log("=== コンテスト主催者お問い合わせ（DB保存失敗、ログのみ） ===");
      console.log("会社名:", companyName || "未入力");
      console.log("お名前:", name);
      console.log("メールアドレス:", email);
      console.log("対象のコンテストURL:", contestUrl || "未入力");
      console.log("希望するアクション:", action);
      console.log("コメント:", comment || "未入力");
      console.log("送信日時:", new Date().toISOString());
      console.log("================================");
      
      // データベースエラーの場合は500エラーを返す
      return NextResponse.json(
        { error: "データベースへの保存に失敗しました。しばらく時間をおいて再度お試しください。" },
        { status: 500 }
      );
    }

    // 成功レスポンス
    return NextResponse.json(
      {
        success: true,
        message: "お問い合わせを受け付けました",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

