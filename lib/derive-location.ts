/**
 * 施設住所（＋任意の上書き）から、フィルタ用の country / city を導出する。
 * 日本の住所は都道府県を自動抽出し、判定できない場合（海外など）は上書き欄を使う。
 */

export const JAPAN_PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県",
  "三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
];

/**
 * 住所と任意の上書き値から country / city を求める。
 * 優先順位:
 * 1. 上書き値がある場合はそれを優先（日本の都道府県名なら country=日本）
 * 2. 住所内に日本の都道府県名があれば抽出（country=日本, city=都道府県）
 * 3. どちらもなければ「その他」
 */
export function deriveCountryCity(
  address: string,
  override?: string
): { country: string; city: string } {
  const ov = (override || "").trim();
  if (ov) {
    if (JAPAN_PREFECTURES.includes(ov)) {
      return { country: "日本", city: ov };
    }
    return { country: ov, city: ov };
  }

  const addr = (address || "").trim();
  const pref = JAPAN_PREFECTURES.find((p) => addr.includes(p));
  if (pref) {
    return { country: "日本", city: pref };
  }

  return { country: "その他", city: "その他" };
}
