// エリア（国・都道府県）
export const AREAS = [
  // 全国
  "全国",
  
  // 都道府県
  "北海道",
  "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県",
  "三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
  
  // 国外
  "アメリカ", "カナダ",
  "イギリス", "エストニア", "オランダ", "スペイン", "ドイツ", "フランス", "ポルトガル",
  "中国", "台湾", "韓国",
  "インドネシア", "シンガポール", "タイ", "ベトナム",
  "インド",
  "UAE（ドバイ/アブダビ）",
  "オーストラリア"
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
  { value: "FUNDING", label: "投資" },
  { value: "M_AND_A", label: "M&A" },
  { value: "IPO", label: "IPO" },
  { value: "PARTNERSHIP", label: "パートナーシップ" },
  { value: "OTHER", label: "その他" }
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
