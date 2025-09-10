"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isCheckingRole, setIsCheckingRole] = useState(true);
  const fetchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 既存のタイムアウトをクリア
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    if (isLoaded && !user) {
      router.push("/sign-in");
      return;
    }
    
    if (isLoaded && user) {
      // デバウンス機能を追加（500ms待機）
      fetchTimeoutRef.current = setTimeout(() => {
        // データベースからユーザー情報を取得
        fetch("/api/user/me")
          .then(res => {
            if (!res.ok) {
              if (res.status === 401) {
                // 認証されていない場合はサインインページにリダイレクト
                router.push("/sign-in");
                return;
              }
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then(data => {
            if (data.user) {
              setUserRole(data.user.role);
            }
            setIsCheckingRole(false);
          })
          .catch(error => {
            console.error("Error fetching user role:", error);
            // エラーの場合はサインインページにリダイレクト
            router.push("/sign-in");
            setIsCheckingRole(false);
          });
      }, 500);
    }

    // クリーンアップ関数
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [isLoaded, user, router]);

  if (!isLoaded || isCheckingRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (userRole !== "ADMIN") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">アクセス拒否</h1>
          <p className="text-gray-600 mb-4">管理者権限が必要です</p>
          <p className="text-sm text-gray-500 mb-4">現在の権限: {userRole || "不明"}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
