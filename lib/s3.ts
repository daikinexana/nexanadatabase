import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// S3クライアントの初期化を関数内で行う（エラーハンドリングのため）
function createS3Client() {
  console.log("🔧 S3クライアント初期化中...");
  console.log("🔍 環境変数チェック:", {
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ? '設定済み' : '未設定',
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ? '設定済み' : '未設定',
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME
  });
  
  try {
    const client = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    console.log("✅ S3クライアント初期化完了");
    return client;
  } catch (error) {
    console.error("❌ S3クライアント初期化エラー:", error);
    throw error;
  }
}

export async function uploadToS3(file: File, key: string): Promise<string> {
  console.log("🚀 S3アップロード開始:", { key, fileType: file.type, fileSize: file.size });
  
  // メモリ使用量を監視
  const memBefore = process.memoryUsage();
  console.log("📊 メモリ使用量（開始）:", {
    rss: Math.round(memBefore.rss / 1024 / 1024) + "MB",
    heapUsed: Math.round(memBefore.heapUsed / 1024 / 1024) + "MB",
    heapTotal: Math.round(memBefore.heapTotal / 1024 / 1024) + "MB"
  });
  
  // S3クライアントを初期化
  const s3Client = createS3Client();
  
  console.log("📦 ファイルをバッファに変換中...");
  const buffer = Buffer.from(await file.arrayBuffer());
  console.log("✅ バッファ変換完了:", buffer.length, "bytes");
  
  // バッファ変換後のメモリ使用量
  const memAfterBuffer = process.memoryUsage();
  console.log("📊 メモリ使用量（バッファ後）:", {
    rss: Math.round(memAfterBuffer.rss / 1024 / 1024) + "MB",
    heapUsed: Math.round(memAfterBuffer.heapUsed / 1024 / 1024) + "MB",
    heapTotal: Math.round(memAfterBuffer.heapTotal / 1024 / 1024) + "MB"
  });
  
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
    Body: buffer,
    ContentType: file.type,
  });

  console.log("📤 S3コマンド実行中...");
  try {
    await s3Client.send(command);
    console.log("✅ S3アップロード完了");
  } catch (error) {
    console.error("❌ S3アップロードエラー:", error);
    throw error;
  }
  
  // 最終メモリ使用量
  const memFinal = process.memoryUsage();
  console.log("📊 メモリ使用量（完了）:", {
    rss: Math.round(memFinal.rss / 1024 / 1024) + "MB",
    heapUsed: Math.round(memFinal.heapUsed / 1024 / 1024) + "MB",
    heapTotal: Math.round(memFinal.heapTotal / 1024 / 1024) + "MB"
  });
  
  const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  console.log("🔗 生成されたURL:", imageUrl);
  return imageUrl;
}

export async function deleteFromS3(key: string): Promise<void> {
  const s3Client = createS3Client();
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
  });

  await s3Client.send(command);
}

export async function getSignedUploadUrl(key: string, contentType: string): Promise<string> {
  const s3Client = createS3Client();
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
    ContentType: contentType,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export function generateImageKey(prefix: string, filename: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = filename.split('.').pop();
  return `${prefix}/${timestamp}-${randomString}.${extension}`;
}
