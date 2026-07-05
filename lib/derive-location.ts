/**
 * 施設住所（＋任意の上書き）から、フィルタ用の country / city を導出する。
 * 日本の住所は都道府県を自動抽出。海外は住所内の国名・主要都市名から国を判定する。
 * どちらも判定できない場合は「その他」。
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

// 管理画面のエリア選択肢（OVERSEAS_AREAS）と揃えた、海外の国の正規名。
export const OVERSEAS_COUNTRIES = [
  "アメリカ", "カナダ", "イギリス", "エストニア", "オランダ", "スペイン", "ドイツ",
  "フランス", "ポルトガル", "中国", "台湾", "韓国", "インドネシア", "シンガポール",
  "タイ", "ベトナム", "インド", "UAE（ドバイ/アブダビ）", "オーストラリア",
];

// 国名（日本語・英語・略称）→ 正規の国名。住所や国フィールドの表記ゆれを吸収する。
const COUNTRY_ALIASES: { country: string; re: RegExp }[] = [
  { country: "アメリカ", re: /(アメリカ|米国|合衆国|United States|\bU\.S\.A\.?\b|\bUSA\b)/i },
  { country: "カナダ", re: /(カナダ|Canada)/i },
  { country: "イギリス", re: /(イギリス|英国|United Kingdom|\bUK\b|England|Scotland)/i },
  { country: "エストニア", re: /(エストニア|Estonia)/i },
  { country: "オランダ", re: /(オランダ|Netherlands|Holland)/i },
  { country: "スペイン", re: /(スペイン|Spain|España)/i },
  { country: "ドイツ", re: /(ドイツ|Germany|Deutschland)/i },
  { country: "フランス", re: /(フランス|France)/i },
  { country: "ポルトガル", re: /(ポルトガル|Portugal)/i },
  { country: "中国", re: /(中国|中華人民共和国|China|\bPRC\b)/i },
  { country: "台湾", re: /(台湾|臺灣|Taiwan)/i },
  { country: "韓国", re: /(韓国|大韓民国|South Korea|Korea)/i },
  { country: "インドネシア", re: /(インドネシア|Indonesia)/i },
  { country: "シンガポール", re: /(シンガポール|Singapore)/i },
  { country: "タイ", re: /(タイ王国|Thailand)/i },
  { country: "ベトナム", re: /(ベトナム|Vietnam|Viet Nam)/i },
  { country: "インド", re: /(インド(?!ネシア)|\bIndia\b(?!na))/i },
  { country: "UAE（ドバイ/アブダビ）", re: /(アラブ首長国連邦|United Arab Emirates|\bUAE\b)/i },
  { country: "オーストラリア", re: /(オーストラリア|Australia)/i },
];

// 主要都市名 → { 国, 正規の都市名(日本語) }。国名が住所に無くても都市から国を特定する。
const CITY_TO_COUNTRY: { country: string; city: string; re: RegExp }[] = [
  // アメリカ
  { country: "アメリカ", city: "サンフランシスコ", re: /(サンフランシスコ|San Francisco|シリコンバレー|Silicon Valley|Palo Alto|Mountain View|San Jose)/i },
  { country: "アメリカ", city: "ニューヨーク", re: /(ニューヨーク|New York)/i },
  { country: "アメリカ", city: "ロサンゼルス", re: /(ロサンゼルス|Los Angeles)/i },
  { country: "アメリカ", city: "ボストン", re: /(ボストン|Boston)/i },
  { country: "アメリカ", city: "シアトル", re: /(シアトル|Seattle)/i },
  { country: "アメリカ", city: "シカゴ", re: /(シカゴ|Chicago)/i },
  { country: "アメリカ", city: "オースティン", re: /(オースティン|Austin)/i },
  // カナダ
  { country: "カナダ", city: "トロント", re: /(トロント|Toronto)/i },
  { country: "カナダ", city: "バンクーバー", re: /(バンクーバー|Vancouver)/i },
  // イギリス
  { country: "イギリス", city: "ロンドン", re: /(ロンドン|London)/i },
  // フランス
  { country: "フランス", city: "パリ", re: /(パリ|Paris)/i },
  // ドイツ
  { country: "ドイツ", city: "ベルリン", re: /(ベルリン|Berlin)/i },
  { country: "ドイツ", city: "ミュンヘン", re: /(ミュンヘン|Munich|München)/i },
  // オランダ
  { country: "オランダ", city: "アムステルダム", re: /(アムステルダム|Amsterdam)/i },
  // スペイン
  { country: "スペイン", city: "バルセロナ", re: /(バルセロナ|Barcelona)/i },
  { country: "スペイン", city: "マドリード", re: /(マドリード|マドリッド|Madrid)/i },
  // ポルトガル
  { country: "ポルトガル", city: "リスボン", re: /(リスボン|Lisbon|Lisboa)/i },
  // エストニア
  { country: "エストニア", city: "タリン", re: /(タリン|Tallinn)/i },
  // シンガポール
  { country: "シンガポール", city: "シンガポール", re: /(シンガポール|Singapore)/i },
  // タイ
  { country: "タイ", city: "バンコク", re: /(バンコク|Bangkok)/i },
  // ベトナム
  { country: "ベトナム", city: "ホーチミン", re: /(ホーチミン|Ho Chi Minh)/i },
  { country: "ベトナム", city: "ハノイ", re: /(ハノイ|Hanoi)/i },
  // インドネシア
  { country: "インドネシア", city: "ジャカルタ", re: /(ジャカルタ|Jakarta)/i },
  // 韓国
  { country: "韓国", city: "ソウル", re: /(ソウル|Seoul)/i },
  // 台湾
  { country: "台湾", city: "台北", re: /(台北|臺北|Taipei)/i },
  // 中国
  { country: "中国", city: "上海", re: /(上海|Shanghai)/i },
  { country: "中国", city: "北京", re: /(北京|Beijing)/i },
  { country: "中国", city: "深セン", re: /(深セン|深圳|Shenzhen)/i },
  // UAE
  { country: "UAE（ドバイ/アブダビ）", city: "ドバイ", re: /(ドバイ|Dubai)/i },
  { country: "UAE（ドバイ/アブダビ）", city: "アブダビ", re: /(アブダビ|Abu Dhabi)/i },
  // オーストラリア
  { country: "オーストラリア", city: "シドニー", re: /(シドニー|Sydney)/i },
  { country: "オーストラリア", city: "メルボルン", re: /(メルボルン|Melbourne)/i },
  // インド
  { country: "インド", city: "バンガロール", re: /(バンガロール|ベンガルール|Bangalore|Bengaluru)/i },
  { country: "インド", city: "ムンバイ", re: /(ムンバイ|Mumbai)/i },
  { country: "インド", city: "デリー", re: /(ニューデリー|デリー|New Delhi|Delhi)/i },
];

/**
 * 任意の国名文字列（AIの出力・上書き値など）を正規の国名に寄せる。
 * 日本なら「日本」、既知の海外国ならその正規名、判別不可なら空文字。
 */
export function normalizeCountry(input: string): string {
  const s = (input || "").trim();
  if (!s) return "";
  if (/^(日本|Japan)$/i.test(s)) return "日本";
  if (OVERSEAS_COUNTRIES.includes(s)) return s;
  for (const a of COUNTRY_ALIASES) {
    if (a.re.test(s)) return a.country;
  }
  return "";
}

/**
 * 住所と任意の上書き値から country / city を求める。
 * 優先順位:
 * 1. 上書き値（日本の都道府県名 or 海外の国名として解釈）
 * 2. 住所内の日本の都道府県名
 * 3. 住所内の海外の主要都市名（国＋都市を特定）
 * 4. 住所内の海外の国名
 * 5. どれも無ければ「その他」
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
    // 上書きが海外の国名なら正規化して country=city=国
    const normalized = normalizeCountry(ov);
    if (normalized && normalized !== "日本") {
      return { country: normalized, city: normalized };
    }
    return { country: ov, city: ov };
  }

  const addr = (address || "").trim();

  // 日本の都道府県
  const pref = JAPAN_PREFECTURES.find((p) => addr.includes(p));
  if (pref) {
    return { country: "日本", city: pref };
  }

  // 海外の主要都市（国＋都市を特定できる）
  for (const c of CITY_TO_COUNTRY) {
    if (c.re.test(addr)) {
      return { country: c.country, city: c.city };
    }
  }

  // 海外の国名（都市までは分からないので city=国名）
  for (const a of COUNTRY_ALIASES) {
    if (a.re.test(addr)) {
      return { country: a.country, city: a.country };
    }
  }

  return { country: "その他", city: "その他" };
}
