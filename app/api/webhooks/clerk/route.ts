import { NextRequest, NextResponse } from "next/server";

/**
 * Clerk Webhook API
 * Clerk認証を削除したため、このエンドポイントは無効化されています
 */
export async function POST(_req: NextRequest) {
  // Clerk認証を削除したため、このエンドポイントは使用されません
  return NextResponse.json(
    { error: "Clerk認証は削除されました。このエンドポイントは使用されません。" },
    { status: 410 } // 410 Gone
  );
}
