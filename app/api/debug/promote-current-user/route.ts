import { NextResponse } from "next/server";

/**
 * 現在ログインしているユーザーをADMINに昇格させる（デバッグ用）
 * Clerk認証を削除したため、このエンドポイントは無効化されています
 */
export async function GET() {
  return NextResponse.json(
    { error: "Clerk認証は削除されました。このエンドポイントは使用されません。" },
    { status: 410 } // 410 Gone
  );
}

