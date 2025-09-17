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

    // ファイルサイズチェック（10MB制限）
    if (file.size > 10 * 1024 * 1024) {
      alert("ファイルサイズが大きすぎます（10MB以下にしてください）");
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

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onChange(result.imageUrl);
      } else {
        console.error("S3アップロードエラー:", result.error);
        // S3アップロードが失敗した場合、ローカルファイルのURLを生成
        const localUrl = URL.createObjectURL(file);
        onChange(localUrl);
        alert("S3アップロードに失敗しましたが、ローカルプレビューを表示します。保存前に画像URLを手動で設定してください。");
      }
    } catch (error) {
      console.error("アップロードエラー:", error);
      // エラーの場合もローカルプレビューを表示
      const localUrl = URL.createObjectURL(file);
      onChange(localUrl);
      alert("アップロードに失敗しましたが、ローカルプレビューを表示します。保存前に画像URLを手動で設定してください。");
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
