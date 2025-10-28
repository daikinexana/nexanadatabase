"use client";

import { useEffect, useState } from "react";
import { useClerk } from "@clerk/nextjs";

export function useClerkTimeout() {
  const [isTimeout, setIsTimeout] = useState(false);
  const clerk = useClerk();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!clerk.loaded) {
        setIsTimeout(true);
        console.warn("Clerk loading timeout - switching to fallback mode");
      }
    }, 10000); // 10秒のタイムアウト

    if (clerk.loaded) {
      clearTimeout(timeoutId);
      setIsTimeout(false);
    }

    return () => clearTimeout(timeoutId);
  }, [clerk.loaded]);

  return { isTimeout, clerkLoaded: clerk.loaded };
}
