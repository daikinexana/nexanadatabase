/**
 * 認証関連の関数
 * Clerk認証を削除したため、これらの関数は常に成功するダミー実装
 * 本番環境ではmiddlewareでadminページへのアクセスがブロックされる
 */

// ダミーユーザーオブジェクト（開発環境用）
const dummyUser = {
  id: "local-dev-user",
  clerkId: "local-dev-clerk",
  email: "dev@localhost",
  name: "Local Developer",
  role: "ADMIN" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export async function getCurrentUser() {
  // 認証チェックなしで常にダミーユーザーを返す
  return dummyUser;
}

export async function getClerkUser() {
  // Clerk認証を削除したため、nullを返す
  return null;
}

export async function requireAuth() {
  // 認証チェックなしで常にダミーユーザーを返す
  return dummyUser;
}

export async function requireAdmin() {
  // 認証チェックなしで常にダミーユーザーを返す
  return dummyUser;
}
