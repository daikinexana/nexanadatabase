import { NextRequest, NextResponse } from "next/server";

/**
 * ユーザーのroleを更新（デバッグ用）
 * Clerk認証を削除したため、このエンドポイントは無効化されています
 */
export async function POST(_req: NextRequest) {
  return NextResponse.json(
    { error: "Clerk認証は削除されました。このエンドポイントは使用されません。" },
    { status: 410 } // 410 Gone
  );
}
