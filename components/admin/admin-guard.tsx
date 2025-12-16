"use client";

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * AdminGuardコンポーネント
 * Clerk認証を削除したため、常にchildrenを返す
 * 本番環境ではmiddlewareでadminページへのアクセスをブロック
 */
export default function AdminGuard({ children }: AdminGuardProps) {
  // 認証チェックなしで常にchildrenを返す
  // 本番環境ではmiddlewareでadminページへのアクセスがブロックされる
  return <>{children}</>;
}
