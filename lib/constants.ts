// エリア（国・地域）- ニュース・ナレッジ用
export const AREAS = [
  "日本",
  // アジア
  "中国", "台湾", "韓国", "インドネシア", "シンガポール", "タイ", "ベトナム", "インド",
  // 北米
  "アメリカ", "カナダ",
  // ヨーロッパ
  "イギリス", "ドイツ", "フランス", "オランダ", "スペイン", "ポルトガル", "エストニア",
  // 中東・アフリカ
  "UAE（ドバイ/アブダビ）",
  // オセアニア
  "オーストラリア",
  // その他
  "その他"
] as const;

// エリア（都道府県）- コンテスト・施設紹介・展示会・公募用
export const PREFECTURE_AREAS = [
  "全国",
  // 北海道・東北
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  // 関東
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  // 中部
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県",
  // 近畿
  "三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  // 中国
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  // 四国
  "徳島県", "香川県", "愛媛県", "高知県",
  // 九州・沖縄
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
  // 海外
  "海外"
] as const;

// 主催者タイプ
export const ORGANIZER_TYPES = [
  { value: "行政", label: "行政" },
  { value: "VC", label: "VC" },
  { value: "CVC", label: "CVC" },
  { value: "銀行系", label: "銀行系" },
  { value: "不動産系", label: "不動産系" },
  { value: "企業", label: "企業" },
  { value: "企業R&D", label: "企業R&D" },
  { value: "大学と研究機関", label: "大学と研究機関" },
  { value: "その他", label: "その他" }
] as const;

// コンテストカテゴリ
export const CONTEST_CATEGORIES = [
  { value: "STARTUP_CONTEST", label: "スタートアップコンテスト" },
  { value: "INNOVATION_CHALLENGE", label: "イノベーションチャレンジ" },
  { value: "HACKATHON", label: "ハッカソン" },
  { value: "PITCH_CONTEST", label: "ピッチコンテスト" },
  { value: "BUSINESS_PLAN", label: "ビジネスプラン" },
  { value: "OTHER", label: "その他" }
] as const;

// 公募カテゴリ
export const GRANT_CATEGORIES = [
  { value: "SUBSIDY", label: "補助金" },
  { value: "GRANT", label: "助成金" },
  { value: "PARTNERSHIP", label: "パートナーシップ" },
  { value: "COLLABORATION", label: "協業" },
  { value: "ASSET_PROVISION", label: "アセット提供" },
  { value: "TECHNOLOGY_PROVISION", label: "技術提供" },
  { value: "OTHER", label: "その他" }
] as const;

// ニュースタイプ
export const NEWS_TYPES = [
  { value: "FUNDING", label: "資金調達" },
  { value: "M_AND_A", label: "M&A" }
] as const;

// ナレッジカテゴリ
export const KNOWLEDGE_CATEGORIES = [
  { value: "AI", label: "AI" },
  { value: "DEEPTECH", label: "Deeptech" },
  { value: "BIOTECH", label: "Biotech" },
  { value: "CLEANTECH", label: "Cleantech" },
  { value: "FINTECH", label: "Fintech" },
  { value: "HEALTHTECH", label: "Healthtech" },
  { value: "EDUTECH", label: "Edutech" },
  { value: "OTHER", label: "その他" }
] as const;

// よく使われるタグ
export const COMMON_TAGS = [
  "スタートアップ", "イノベーション", "テクノロジー", "AI", "DX", "SDGs",
  "地方創生", "ヘルスケア", "フィンテック", "エドテック", "グリーンテック",
  "バイオテック", "クリーンテック", "ディープテック", "Web3", "メタバース",
  "IoT", "5G", "量子コンピューティング", "ブロックチェーン", "AR/VR"
] as const;

// 8地方区分の定義
export const REGION_ORDER = [
  '北海道',
  '東北',
  '関東',
  '中部',
  '近畿',
  '中国',
  '四国',
  '九州・沖縄'
] as const;

// 都道府県から地方区分へのマッピング
export const PREFECTURE_TO_REGION: Record<string, string> = {
  '北海道': '北海道',
  '青森県': '東北',
  '岩手県': '東北',
  '宮城県': '東北',
  '秋田県': '東北',
  '山形県': '東北',
  '福島県': '東北',
  '茨城県': '関東',
  '栃木県': '関東',
  '群馬県': '関東',
  '埼玉県': '関東',
  '千葉県': '関東',
  '東京都': '関東',
  '神奈川県': '関東',
  '新潟県': '中部',
  '富山県': '中部',
  '石川県': '中部',
  '福井県': '中部',
  '山梨県': '中部',
  '長野県': '中部',
  '岐阜県': '中部',
  '静岡県': '中部',
  '愛知県': '中部',
  '三重県': '近畿',
  '滋賀県': '近畿',
  '京都府': '近畿',
  '大阪府': '近畿',
  '兵庫県': '近畿',
  '奈良県': '近畿',
  '和歌山県': '近畿',
  '鳥取県': '中国',
  '島根県': '中国',
  '岡山県': '中国',
  '広島県': '中国',
  '山口県': '中国',
  '徳島県': '四国',
  '香川県': '四国',
  '愛媛県': '四国',
  '高知県': '四国',
  '福岡県': '九州・沖縄',
  '佐賀県': '九州・沖縄',
  '長崎県': '九州・沖縄',
  '熊本県': '九州・沖縄',
  '大分県': '九州・沖縄',
  '宮崎県': '九州・沖縄',
  '鹿児島県': '九州・沖縄',
  '沖縄県': '九州・沖縄'
} as const;
