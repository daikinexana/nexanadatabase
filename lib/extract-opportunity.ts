/**
 * URLからコンテスト/公募情報をAI抽出するサーバーサイドヘルパー。
 * OpenRouter経由でLLMを呼び出し、カード表示用の構造化データを返す。
 */

// 抽出結果の型（コンテスト/公募の共通スキーマ）
export interface ExtractedOpportunity {
  kind: "contest" | "open-call";
  title: string;
  organizer: string;
  organizerType: string; // 企業 / 行政 / 大学 / CV / その他
  description: string;
  area: string | null;
  deadline: string | null; // ISO (YYYY-MM-DD) or null
  startDate: string | null; // ISO (YYYY-MM-DD) or null
  website: string;
  targetArea: string;
  targetAudience: string;
  benefit: string; // 賞金・特典 / 提供リソースを統一
  imageUrl: string;
}

// 主催者タイプの選択肢（管理フォームと一致）
export const ORGANIZER_TYPE_OPTIONS = ["企業", "行政", "大学", "CV", "その他"];

// エリア選択肢
export const JAPAN_AREAS = [
  "全国", "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県",
  "三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
];
export const OVERSEAS_AREAS = [
  "アメリカ", "カナダ", "イギリス", "エストニア", "オランダ", "スペイン", "ドイツ",
  "フランス", "ポルトガル", "中国", "台湾", "韓国", "インドネシア", "シンガポール",
  "タイ", "ベトナム", "インド", "UAE（ドバイ/アブダビ）", "オーストラリア", "海外", "その他",
];

const DEFAULT_MODEL = "google/gemini-2.5-flash";

// og:metaや特定タグの抽出
function extractMeta(html: string, property: string): string {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return m[1].trim();
  }
  return "";
}

// HTMLからテキスト本文を抽出（scriptやstyleを除去）
function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

// 相対URLを絶対URLに変換
function toAbsoluteUrl(maybeUrl: string, base: string): string {
  if (!maybeUrl) return "";
  try {
    return new URL(maybeUrl, base).toString();
  } catch {
    return maybeUrl;
  }
}

interface FetchedPage {
  url: string;
  title: string;
  ogImage: string;
  ogDescription: string;
  text: string;
}

async function fetchPage(url: string): Promise<FetchedPage> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "ja,en;q=0.8",
      },
    });
    if (!res.ok) {
      throw new Error(`ページの取得に失敗しました (HTTP ${res.status})`);
    }
    const html = await res.text();
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const ogImage = extractMeta(html, "og:image");
    return {
      url,
      title: extractMeta(html, "og:title") || (titleMatch?.[1]?.trim() ?? ""),
      ogImage: toAbsoluteUrl(ogImage, url),
      ogDescription: extractMeta(html, "og:description") || extractMeta(html, "description"),
      text: htmlToText(html).slice(0, 12000),
    };
  } finally {
    clearTimeout(timeout);
  }
}

function buildPrompt(page: FetchedPage): { system: string; user: string } {
  const system = [
    "あなたはスタートアップ向けデータベースの編集者です。",
    "与えられたWebページの内容から、コンテストまたは公募（オープンイノベーション募集）の情報を抽出し、指定されたJSON形式のみで出力します。",
    "ページに明記されている情報を最優先し、事実の創作はしないでください。ただし日付・エリアはページ内の表記から可能な限り読み取り、下記フォーマットに正規化してください。",
    "",
    "出力するJSONのキーと制約:",
    '- kind: "contest"（コンテスト・ピッチ・ハッカソン・アクセラ・アワード等の応募型）か "open-call"（企業/行政/大学がパートナー・協業・実証・課題解決先を募集する公募型）のどちらか。',
    "- title: イベント/募集の正式名称（必須）。",
    "- organizer: 主催者・運営組織名（必須）。共催が複数ある場合は主となる組織。",
    `- organizerType: 次のいずれか1つ [${ORGANIZER_TYPE_OPTIONS.join(", ")}]。VC/CVCは "CV"。判別不能なら "その他"。`,
    "- description: 内容の要約（日本語・80〜150字）。「誰向けの・何を募集する・どんな機会か」が伝わるように。",
    `- area: 開催/対象エリア。日本の都道府県名、または[${["全国", ...OVERSEAS_AREAS].join(", ")}]から最も近いものを1つ。全国規模・オンライン中心・複数地域なら「全国」。どうしても判別できない場合のみnull。`,
    "- deadline: 応募・エントリーの締切日。「応募締切」「エントリー期限」「募集終了」等を探す。期間表記（例:「2026年6月1日〜7月14日」）なら終了日を採用。必ず YYYY-MM-DD 形式。不明ならnull。",
    "- startDate: 募集開始日または開催日。「募集開始」「エントリー開始」「開催日」等を探す。期間表記なら開始日を採用。必ず YYYY-MM-DD 形式。不明ならnull。",
    "- targetArea: 対象領域・テーマ（例: ヘルスケア, ディープテック, 環境, DX）。複数はカンマ区切り。無ければ空文字。",
    "- targetAudience: 応募対象（例: スタートアップ, 学生, 個人, 中小企業, 研究者）。無ければ空文字。",
    "- benefit: 賞金・特典・副賞、または提供リソース（資金/メンタリング/オフィス/実証フィールド等）。金額や内容を簡潔に。無ければ空文字。",
    "",
    "日付ルール: 西暦4桁に統一し、和暦（令和等）や「YYYY年M月D日」「YYYY/M/D」表記もすべて YYYY-MM-DD に変換する。年が省略されている場合は文脈から最も妥当な年を補う。",
    "JSONオブジェクトのみを出力し、前後に説明文やコードフェンス（```）を付けないこと。",
  ].join("\n");

  const user = [
    `URL: ${page.url}`,
    `ページタイトル: ${page.title}`,
    page.ogDescription ? `OG説明: ${page.ogDescription}` : "",
    "",
    "本文テキスト:",
    page.text,
  ]
    .filter(Boolean)
    .join("\n");

  return { system, user };
}

function safeParseJson(content: string): Record<string, unknown> {
  const cleaned = content
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    // 最初の { から最後の } までを抜き出して再試行
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end !== -1) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }
    throw new Error("AIの応答をJSONとして解釈できませんでした");
  }
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

// 抽出結果を正規化（enum補正・日付整形）
function normalize(raw: Record<string, unknown>, page: FetchedPage): ExtractedOpportunity {
  const kind = str(raw.kind) === "open-call" ? "open-call" : str(raw.kind) === "contest" ? "contest" : "contest";

  let organizerType = str(raw.organizerType);
  if (!ORGANIZER_TYPE_OPTIONS.includes(organizerType)) {
    if (/vc|cvc|ベンチャーキャピタル/i.test(organizerType)) organizerType = "CV";
    else organizerType = "その他";
  }

  const pad = (n: number) => String(n).padStart(2, "0");
  const normDate = (v: unknown): string | null => {
    const s = str(v);
    if (!s) return null;
    // 「YYYY年M月D日」「YYYY/M/D」「YYYY.M.D」「YYYY-M-D」などを広く許容
    const m = s.match(/(\d{4})\D{1,3}(\d{1,2})\D{1,3}(\d{1,2})/);
    if (m) {
      const y = Number(m[1]);
      const mo = Number(m[2]);
      const da = Number(m[3]);
      if (mo >= 1 && mo <= 12 && da >= 1 && da <= 31) {
        return `${y}-${pad(mo)}-${pad(da)}`;
      }
    }
    const d = new Date(s);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().slice(0, 10);
  };

  let area: string | null = str(raw.area) || null;
  if (area && ![...JAPAN_AREAS, ...OVERSEAS_AREAS].includes(area)) {
    // 既知エリアに一致しなければ、含有チェックでゆるく補正
    const hit = [...JAPAN_AREAS, ...OVERSEAS_AREAS].find(
      (a) => area && (area.includes(a) || a.includes(area))
    );
    area = hit ?? null;
  }

  return {
    kind: kind as "contest" | "open-call",
    title: str(raw.title) || page.title,
    organizer: str(raw.organizer),
    organizerType,
    description: str(raw.description) || page.ogDescription,
    area,
    deadline: normDate(raw.deadline),
    startDate: normDate(raw.startDate),
    website: page.url,
    targetArea: str(raw.targetArea),
    targetAudience: str(raw.targetAudience),
    benefit: str(raw.benefit ?? raw.incentive),
    imageUrl: page.ogImage,
  };
}

/**
 * URLからコンテスト/公募情報を抽出する。
 * @throws OPENROUTER_API_KEY未設定・取得失敗・AI応答エラー時
 */
export async function extractOpportunityFromUrl(
  url: string
): Promise<ExtractedOpportunity> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY が設定されていません");
  }

  const page = await fetchPage(url);
  if (!page.text || page.text.length < 40) {
    throw new Error(
      "ページ本文を取得できませんでした（JavaScriptで描画されるサイトの可能性があります）"
    );
  }

  const { system, user } = buildPrompt(page);
  const model = process.env.OPENROUTER_MODEL || DEFAULT_MODEL;

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_BASE_URL || "https://db.nexanahq.com",
      "X-Title": "Nexana Database AI Import",
    },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`AIリクエストに失敗しました (HTTP ${res.status}) ${detail.slice(0, 200)}`);
  }

  const data = await res.json();
  const content: string = data?.choices?.[0]?.message?.content ?? "";
  if (!content) {
    throw new Error("AIから有効な応答が得られませんでした");
  }

  const parsed = safeParseJson(content);
  return normalize(parsed, page);
}
