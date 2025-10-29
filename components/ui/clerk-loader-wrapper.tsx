"use client";

import { useEffect, useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { CustomClerkFailed } from "./clerk-failed";

interface ClerkLoaderWrapperProps {
  children: React.ReactNode;
}

/**
 * Clerkの読み込み状態を監視し、タイムアウト時にフォールバックを表示するコンポーネント
 */
export function ClerkLoaderWrapper({ children }: ClerkLoaderWrapperProps) {
  const clerk = useClerk();
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 5秒のタイムアウトを設定（開発環境ではより短く）
    const timeoutDuration = process.env.NODE_ENV === 'development' ? 5000 : 10000;
    const timeoutId = setTimeout(() => {
      if (!clerk.loaded) {
        console.warn("Clerk loading timeout - Clerk may not be configured properly");
        console.warn("Check NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable");
        setHasTimedOut(true);
        setIsLoading(false);
      }
    }, timeoutDuration);

    // Clerkが読み込まれたら、タイムアウトをクリア
    if (clerk.loaded) {
      clearTimeout(timeoutId);
      setIsLoading(false);
      setHasTimedOut(false);
    }

    return () => clearTimeout(timeoutId);
  }, [clerk.loaded]);

  // タイムアウトした場合はフォールバックを表示
  if (hasTimedOut) {
    return <CustomClerkFailed />;
  }

  // 読み込み中の場合は子要素（ローディング画面）を表示
  return <>{children}</>;
}
