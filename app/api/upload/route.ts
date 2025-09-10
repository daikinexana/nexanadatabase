import { NextRequest, NextResponse } from "next/server";
import { uploadToS3, generateImageKey } from "@/lib/s3";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string; // contest, event, news, etc.

    if (!file) {
      return NextResponse.json({ error: "ファイルが選択されていません" }, { status: 400 });
    }

    if (!type) {
      return NextResponse.json({ error: "タイプが指定されていません" }, { status: 400 });
    }

    // ファイルサイズチェック（10MB制限）
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "ファイルサイズが大きすぎます（10MB以下にしてください）" }, { status: 400 });
    }

    // ファイルタイプチェック
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "サポートされていないファイル形式です（JPEG, PNG, GIF, WebPのみ）" }, { status: 400 });
    }

    // S3にアップロード
    const key = generateImageKey(type, file.name);
    const imageUrl = await uploadToS3(file, key);

    return NextResponse.json({ 
      success: true, 
      imageUrl,
      key 
    });

  } catch (error) {
    console.error("画像アップロードエラー:", error);
    return NextResponse.json(
      { error: "画像のアップロードに失敗しました" },
      { status: 500 }
    );
  }
}