/**
 * サイト全体の公開停止フラグ。
 * true の間は管理画面以外のページ・APIを「公開停止中」表示にし、DBにも触れない。
 * 再開時は false にしてデプロイする。
 */
export const SITE_CLOSED = true;
