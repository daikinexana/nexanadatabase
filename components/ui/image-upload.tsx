"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (imageUrl: string) => void;
  type: string; // contest, event, news, etc.
  className?: string;
}

/**
 * アップロード前にブラウザ側で画像を縮小・圧縮する。
 * 本番のアップロード上限（1MB）を超える写真でも確実に通るようにするのが目的。
 * - 長辺を maxDimension までリサイズ
 * - JPEG(quality)で書き出し、targetBytes を超える間は品質を段階的に下げる
 * GIF はアニメーションが失われるため圧縮せずそのまま返す。
 */
async function compressImage(
  file: File,
  { maxDimension = 1920, targetBytes = 900 * 1024 }: { maxDimension?: number; targetBytes?: number } = {}
): Promise<File> {
  if (file.type === "image/gif") return file;
  // すでに十分小さくリサイズも不要なら、そのまま使う
  if (file.size <= targetBytes) {
    // 念のため大きすぎる寸法はリサイズしたいので、寸法チェックは続行する
  }

  const dataUrl: string = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("画像の読み込みに失敗しました"));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("画像のデコードに失敗しました"));
    image.src = dataUrl;
  });

  const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
  const targetW = Math.max(1, Math.round(img.width * scale));
  const targetH = Math.max(1, Math.round(img.height * scale));

  // リサイズ不要かつ元が十分小さければ、そのまま返す（再エンコードによる劣化を避ける）
  if (scale === 1 && file.size <= targetBytes) return file;

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  // 透過PNGを白背景で塗ってからJPEG化（真っ黒背景になるのを防ぐ）
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, targetW, targetH);
  ctx.drawImage(img, 0, 0, targetW, targetH);

  const toBlob = (quality: number) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));

  let quality = 0.85;
  let blob = await toBlob(quality);
  while (blob && blob.size > targetBytes && quality > 0.4) {
    quality -= 0.15;
    blob = await toBlob(quality);
  }
  if (!blob) return file;

  const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], newName, { type: "image/jpeg", lastModified: file.lastModified });
}

export default function ImageUpload({ value, onChange, type, className = "" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (inputFile: File) => {
    if (!inputFile) return;

    // ファイルタイプチェック（圧縮前の元ファイルで判定）
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(inputFile.type)) {
      alert("サポートされていないファイル形式です（JPEG, PNG, GIF, WebPのみ）");
      return;
    }

    setIsUploading(true);

    try {
      // アップロード前にブラウザ側でリサイズ・圧縮し、本番の1MB制限に収める
      let file = inputFile;
      try {
        file = await compressImage(inputFile);
        console.log("🗜️ 圧縮結果:", {
          before: `${(inputFile.size / 1024 / 1024).toFixed(2)}MB`,
          after: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
        });
      } catch (compressError) {
        console.warn("⚠️ 圧縮に失敗したため元画像を使用します:", compressError);
        file = inputFile;
      }

      // 圧縮後もサーバー上限を超える場合のみ弾く（GIF等）
      const maxSize = process.env.NODE_ENV === 'production' ? 4 * 1024 * 1024 : 10 * 1024 * 1024;
      const limitText = process.env.NODE_ENV === 'production' ? '4MB' : '10MB';
      if (file.size > maxSize) {
        alert(`ファイルサイズが大きすぎます（${limitText}以下にしてください）\n現在のサイズ: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
        setIsUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      console.log("🚀 アップロード開始:", { fileName: file.name, fileSize: file.size, fileType: file.type, type });
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      console.log("📡 レスポンス受信:", { 
        status: response.status, 
        ok: response.ok, 
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ HTTPエラー:", errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }
      
      const result = await response.json();
      console.log("📋 レスポンス結果:", result);
      console.log("🔍 結果の詳細:", {
        success: result.success,
        hasImageUrl: !!result.imageUrl,
        imageUrl: result.imageUrl,
        key: result.key
      });

      console.log("🎯 条件チェック開始:");
      console.log("  - result.success:", result.success);
      console.log("  - result.imageUrl:", result.imageUrl);
      console.log("  - result.success && result.imageUrl:", result.success && result.imageUrl);

      if (result.success && result.imageUrl) {
        console.log("✅ 成功条件を満たしています");
        onChange(result.imageUrl);
        console.log("✅ S3アップロード成功:", result.imageUrl);
        // 成功時は静かに処理（アラートは表示しない）
        return; // 成功時は早期リターン
      } else {
        console.log("❌ 失敗条件に該当:");
        console.log("  - success:", result.success);
        console.log("  - imageUrl:", result.imageUrl);
        console.log("  - error:", result.error);
        
        console.error("❌ S3アップロードエラー:", result.error);
        
        // 本番環境ではローカルblob URLを使用しない
        const isProduction = window.location.hostname !== 'localhost';
        
        if (!isProduction) {
          // 開発環境でのみローカルプレビューを表示
          const localUrl = URL.createObjectURL(file);
          onChange(localUrl);
        }
        
        // より詳細なエラーメッセージを表示
        const errorMessage = result.error || "アップロードに失敗しました";
        alert(`画像のアップロードに失敗しました: ${errorMessage}\n\n${isProduction ? '画像URLを手動で設定してください。' : 'ローカルプレビューを表示しますが、保存前に画像URLを手動で設定してください。'}`);
      }
    } catch (error) {
      console.error("❌ アップロードエラー:", error);
      
      // 本番環境ではローカルblob URLを使用しない
      const isProduction = window.location.hostname !== 'localhost';
      
      if (!isProduction) {
        // 開発環境でのみローカルプレビューを表示
        const localUrl = URL.createObjectURL(inputFile);
        onChange(localUrl);
      }

      // ネットワークエラーやその他のエラーの場合
      const errorMessage = error instanceof Error ? error.message : "不明なエラーが発生しました";
      console.error("エラー詳細:", errorMessage);
      alert(`画像のアップロードに失敗しました: ${errorMessage}\n\n${isProduction ? '画像URLを手動で設定してください。' : 'ローカルプレビューを表示しますが、保存前に画像URLを手動で設定してください。'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const removeImage = () => {
    onChange("");
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* 現在の画像表示 */}
      {value && (
        <div className="relative">
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            {/* アップロード中のデータURLや http/外部URLなど任意のsrcを扱うため next/image は使わない */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="アップロードされた画像"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <button
              onClick={removeImage}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* アップロードエリア */}
      {!value && (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${dragOver 
              ? "border-blue-500 bg-blue-50" 
              : "border-gray-300 hover:border-gray-400"
            }
            ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={isUploading}
          />
          
          {isUploading ? (
            <div className="space-y-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-sm text-gray-600">アップロード中...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="h-8 w-8 text-gray-400 mx-auto" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  画像をドラッグ&ドロップするか、クリックして選択
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPEG, PNG, GIF, WebP（最大10MB）
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* アップロードボタン（画像がある場合） */}
      {value && (
        <button
          onClick={handleClick}
          disabled={isUploading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          type="button"
        >
          <ImageIcon className="h-4 w-4" />
          {isUploading ? "アップロード中..." : "画像を変更"}
        </button>
      )}
    </div>
  );
}
