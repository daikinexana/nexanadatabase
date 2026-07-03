/**
 * 管理画面の簡易パスワード保護の共通処理。
 * Cookieには生パスワードではなくSHA-256トークンを保存する。
 * middleware(Edge)とAPIルート(Node)の両方から使うため、Web Crypto(globalThis.crypto)のみ使用。
 */

export const ADMIN_COOKIE = "nx_admin";

const SALT = "nexana-admin-gate-v1";

// パスワードから決定的なトークン（16進SHA-256）を生成
export async function computeToken(password: string): Promise<string> {
  const data = new TextEncoder().encode(`${password}|${SALT}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
