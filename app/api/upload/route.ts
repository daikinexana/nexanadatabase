import { NextRequest, NextResponse } from "next/server";
import { uploadToS3, generateImageKey } from "@/lib/s3";

export async function POST(request: NextRequest) {
  try {
    console.log("アップロードAPI開始");
    
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;

    console.log("受信データ:", { 
      fileName: file?.name, 
      fileSize: file?.size, 
      fileType: file?.type, 
      type 
    });

    if (!file) {
      console.log("エラー: ファイルが選択されていません");
      return NextResponse.json({ error: "ファイルが選択されていません" }, { status: 400 });
    }

    if (!type) {
      console.log("エラー: タイプが指定されていません");
      return NextResponse.json({ error: "タイプが指定されていません" }, { status: 400 });
    }

    // ファイルサイズチェック（10MB制限）
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "ファイルサイズが大きすぎます（10MB以下にしてください）" }, { status: 400 });
    }

    // ファイルタイプチェック
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      console.log("エラー: サポートされていないファイル形式", file.type);
      return NextResponse.json({ error: "サポートされていないファイル形式です（JPEG, PNG, GIF, WebPのみ）" }, { status: 400 });
    }

    // 環境変数チェック
    console.log("環境変数チェック:", {
      AWS_REGION: process.env.AWS_REGION,
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ? '設定済み' : '未設定',
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ? '設定済み' : '未設定',
      AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME
    });

    if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_S3_BUCKET_NAME) {
      console.log("エラー: AWS環境変数が設定されていません");
      return NextResponse.json({ 
        success: false,
        error: "AWS S3の設定が不完全です。.env.localファイルでAWS認証情報を設定してください。" 
      }, { status: 500 });
    }

    // S3キーを生成
    const key = generateImageKey(type, file.name);
    console.log("生成されたS3キー:", key);
    
    // S3にアップロード
    console.log("S3アップロード開始");
    const imageUrl = await uploadToS3(file, key);
    console.log("S3アップロード完了:", imageUrl);

    return NextResponse.json({
      success: true,
      imageUrl,
      key
    });

  } catch (error) {
    console.error("アップロードエラー:", error);
    
    // AWS認証エラーの場合は具体的なメッセージを返す
    if (error instanceof Error) {
      if (error.message.includes("InvalidAccessKeyId")) {
        return NextResponse.json({ error: "AWS認証情報が無効です。ローカルアップロードに切り替えます。" }, { status: 500 });
      }
      if (error.message.includes("NoSuchBucket")) {
        return NextResponse.json({ error: "AWS S3バケットが見つかりません。ローカルアップロードに切り替えます。" }, { status: 500 });
      }
    }
    
    return NextResponse.json(
      { error: "画像のアップロードに失敗しました" },
      { status: 500 }
    );
  }
}
