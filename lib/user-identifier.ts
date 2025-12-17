/**
 * クライアント側でユーザー識別子を取得する関数
 * CookieとlocalStorageの両方を使用してより厳密に識別
 */
export function getClientIdentifier(): string {
  if (typeof window === 'undefined') {
    return 'server';
  }

  const COOKIE_KEY = 'nexana_user_id';
  const STORAGE_KEY = 'nexana_user_id';
  
  // まずCookieから取得を試みる（より永続的）
  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  };

  const setCookie = (name: string, value: string, days: number = 365) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  };

  // Cookieから取得を試みる
  let userId = getCookie(COOKIE_KEY);
  
  // Cookieにない場合はlocalStorageから取得
  if (!userId) {
    userId = localStorage.getItem(STORAGE_KEY);
  }

  // どちらにもない場合は新しいIDを生成
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    // 両方に保存（Cookieは1年間有効、localStorageは永続的）
    setCookie(COOKIE_KEY, userId, 365);
    localStorage.setItem(STORAGE_KEY, userId);
  } else {
    // 既存のIDがある場合、CookieとlocalStorageを同期
    if (!getCookie(COOKIE_KEY)) {
      setCookie(COOKIE_KEY, userId, 365);
    }
    if (!localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, userId);
    }
  }

  return userId;
}
