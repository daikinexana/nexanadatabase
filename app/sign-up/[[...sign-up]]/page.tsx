import { notFound } from "next/navigation";

/**
 * Sign-upページ
 * Clerk認証を削除したため、404を返す
 */
export default function Page() {
  notFound();
}
