// エリア（国・地域）
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
