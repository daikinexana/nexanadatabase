import { NextResponse } from "next/server";

/**
 * Clerkユーザー取得API
 * Clerk認証を削除したため、このエンドポイントは無効化されています
 */
export async function GET() {
  return NextResponse.json(
    { error: "Clerk認証は削除されました。このエンドポイントは使用されません。" },
    { status: 410 } // 410 Gone
  );
}
