"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value?: string;
  onChange: (imageUrl: string) => void;
  type: string; // contest, event, news, etc.
  className?: string;
}

export default function ImageUpload({ value, onChange, type, className = "" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // ファイルサイズチェック（2MB制限 - Vercel制限対応）
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      alert(`ファイルサイズが大きすぎます（2MB以下にしてください）\n現在のサイズ: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return;
    }

    // ファイルタイプチェック
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("サポートされていないファイル形式です（JPEG, PNG, GIF, WebPのみ）");
      return;
    }

    setIsUploading(true);

    try {
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
        const localUrl = URL.createObjectURL(file);
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
            <Image
              src={value}
              alt="アップロードされた画像"
              fill
              className="w-full h-full object-cover"
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
                  JPEG, PNG, GIF, WebP（最大2MB）
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
