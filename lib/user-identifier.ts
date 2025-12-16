/**
 * クライアント側でユーザー識別子を取得する関数
 * localStorageにユニークIDを保存して使用
 */
export function getClientIdentifier(): string {
  if (typeof window === 'undefined') {
    return 'server';
  }

  const STORAGE_KEY = 'nexana_user_id';
  let userId = localStorage.getItem(STORAGE_KEY);

  if (!userId) {
    // 新しいユニークIDを生成
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(STORAGE_KEY, userId);
  }

  return userId;
}
