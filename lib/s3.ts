import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(file: File, key: string): Promise<string> {
  console.log("🚀 S3アップロード開始:", { key, fileType: file.type, fileSize: file.size });
  console.log("🔧 環境変数チェック:", {
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ? '設定済み' : '未設定',
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ? '設定済み' : '未設定',
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME
  });
  
  // メモリ効率を改善するため、ストリーミング処理を使用
  console.log("📦 ファイルをストリームで処理中...");
  
  // ファイルをUint8Arrayとして読み込み（メモリ効率が良い）
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  
  console.log("✅ ストリーム変換完了:", uint8Array.length, "bytes");
  
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
    Body: uint8Array,
    ContentType: file.type,
  });

  console.log("📤 S3コマンド実行中...");
  console.log("🔍 S3コマンド詳細:", {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    ContentType: file.type,
    BodySize: uint8Array.length
  });
  
  try {
    await s3Client.send(command);
    console.log("✅ S3アップロード完了");
  } catch (error) {
    console.error("❌ S3アップロードエラー:", error);
    throw error;
  } finally {
    // メモリを明示的に解放
    arrayBuffer.byteLength = 0;
  }
  
  const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  console.log("🔗 生成されたURL:", imageUrl);
  return imageUrl;
}

export async function deleteFromS3(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: key,
  });

  await s3Client.send(command);
}

export async function getSignedUploadUrl(key: string, contentType: string): Promise<string> {
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