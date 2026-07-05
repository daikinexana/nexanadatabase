import { NextRequest, NextResponse } from "next/server";
import { uploadToS3, generateImageKey, getSignedUploadUrl } from "@/lib/s3";

// Vercelでのペイロードサイズ制限を回避するための設定
export const runtime = 'nodejs';
export const maxDuration = 30;

// プリサインドURLを取得するエンドポイント
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const filename = searchParams.get('filename');

    if (!type || !filename) {
      return NextResponse.json({ error: "typeとfilenameが必要です" }, { status: 400 });
    }

    // 環境変数チェック
    if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_S3_BUCKET_NAME) {
      return NextResponse.json({ 
        success: false,
        error: "AWS S3の設定が不完全です。" 
      }, { status: 500 });
    }

    const key = generateImageKey(type, filename);
    const signedUrl = await getSignedUploadUrl(key, 'image/jpeg');

    return NextResponse.json({
      success: true,
      signedUrl,
      key,
      imageUrl: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    });

  } catch (error) {
    console.error("❌ プリサインドURL取得エラー:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "プリサインドURLの取得に失敗しました。" 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 アップロードAPI開始");
    console.log("🔍 リクエスト情報:", {
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers.entries())
    });
    
    // Content-Lengthをチェック（ローカル: 10MB、本番: 1MB）
    const maxSize = process.env.NODE_ENV === 'production' ? 4 * 1024 * 1024 : 10 * 1024 * 1024;
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > maxSize) {
      return NextResponse.json({ 
        success: false,
        error: `ファイルサイズが大きすぎます（${process.env.NODE_ENV === 'production' ? '1MB' : '10MB'}以下にしてください）\n現在のサイズ: ${(parseInt(contentLength) / 1024 / 1024).toFixed(2)}MB` 
      }, { status: 413 });
    }
    
    console.log("📦 FormDataを解析中...");
    const formData = await request.formData();
    console.log("✅ FormData解析完了");
    
    const file = formData.get("file") as File;
    const type = formData.get("type") as string;

    console.log("📋 受信データ:", { 
      fileName: file?.name, 
      fileSize: file?.size, 
      fileType: file?.type, 
      type,
      hasFile: !!file,
      hasType: !!type
    });

    if (!file) {
      console.log("エラー: ファイルが選択されていません");
      return NextResponse.json({ error: "ファイルが選択されていません" }, { status: 400 });
    }

    if (!type) {
      console.log("エラー: タイプが指定されていません");
      return NextResponse.json({ error: "タイプが指定されていません" }, { status: 400 });
    }

    // ファイルサイズチェック（環境別制限）
    if (file.size > maxSize) {
      const fileSizeMB = (file.size / 1024 / 1024).toFixed(2);
      const limitText = process.env.NODE_ENV === 'production' ? '1MB' : '10MB';
      return NextResponse.json({ 
        success: false,
        error: `ファイルサイズが大きすぎます（${limitText}以下にしてください）\n現在のサイズ: ${fileSizeMB}MB` 
      }, { status: 413 });
    }

    // ファイルタイプチェック
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      console.log("エラー: サポートされていないファイル形式", file.type);
      return NextResponse.json({ error: "サポートされていないファイル形式です（JPEG, PNG, GIF, WebPのみ）" }, { status: 400 });
    }

    // 環境変数チェック
    console.log("🔧 環境変数チェック:", {
      AWS_REGION: process.env.AWS_REGION,
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ? '設定済み' : '未設定',
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ? '設定済み' : '未設定',
      AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
      NODE_ENV: process.env.NODE_ENV,
      VERCEL: process.env.VERCEL,
      VERCEL_ENV: process.env.VERCEL_ENV
    });

    if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_S3_BUCKET_NAME) {
      console.error("❌ AWS環境変数が設定されていません");
      console.error("❌ 詳細:", {
        AWS_REGION: process.env.AWS_REGION ? '設定済み' : '未設定',
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ? '設定済み' : '未設定',
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ? '設定済み' : '未設定',
        AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME ? '設定済み' : '未設定'
      });
      return NextResponse.json({ 
        success: false,
        error: "AWS S3の設定が不完全です。管理者にお問い合わせください。" 
      }, { status: 500 });
    }

    // S3キーを生成
    const key = generateImageKey(type, file.name);
    console.log("🔑 生成されたS3キー:", key);
    
    // S3にアップロード
    console.log("🚀 S3アップロード開始");
    let imageUrl: string;
    try {
      imageUrl = await uploadToS3(file, key);
      console.log("✅ S3アップロード完了:", imageUrl);
    } catch (s3Error) {
      console.error("❌ S3アップロードでエラーが発生:", s3Error);
      console.error("❌ S3エラーの詳細:", {
        name: s3Error instanceof Error ? s3Error.name : 'Unknown',
        message: s3Error instanceof Error ? s3Error.message : String(s3Error),
        stack: s3Error instanceof Error ? s3Error.stack : undefined
      });
      throw s3Error;
    }

    const response = {
      success: true,
      imageUrl,
      key
    };
    
    console.log("📤 レスポンス送信:", response);
    return NextResponse.json(response);

  } catch (error) {
    console.error("❌ アップロードエラー:", error);
    console.error("❌ エラーの詳細:", {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    // AWS認証エラーの場合は具体的なメッセージを返す
    if (error instanceof Error) {
      if (error.message.includes("InvalidAccessKeyId")) {
        console.error("❌ AWS認証エラー: InvalidAccessKeyId");
        return NextResponse.json({ 
          success: false,
          error: "AWS認証情報が無効です。管理者にお問い合わせください。" 
        }, { status: 500 });
      }
      if (error.message.includes("NoSuchBucket")) {
        console.error("❌ S3バケットエラー: NoSuchBucket");
        return NextResponse.json({ 
          success: false,
          error: "AWS S3バケットが見つかりません。管理者にお問い合わせください。" 
        }, { status: 500 });
      }
      if (error.message.includes("AccessDenied")) {
        console.error("❌ S3アクセス拒否エラー: AccessDenied");
        return NextResponse.json({ 
          success: false,
          error: "S3バケットへのアクセスが拒否されました。管理者にお問い合わせください。" 
        }, { status: 500 });
      }
      if (error.message.includes("RequestEntityTooLarge")) {
        console.error("❌ ファイルサイズエラー: RequestEntityTooLarge");
        return NextResponse.json({ 
          success: false,
          error: "ファイルサイズが大きすぎます。管理者にお問い合わせください。" 
        }, { status: 413 });
      }
    }
    
    console.error("❌ 一般的なエラーが発生しました");
    return NextResponse.json(
      { 
        success: false,
        error: "画像のアップロードに失敗しました。管理者にお問い合わせください。" 
      },
      { status: 500 }
    );
  }
}