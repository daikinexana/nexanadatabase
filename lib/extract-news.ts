/**
 * URLからニュース情報（調達・M&A・IPO・提携など）をAI抽出するサーバーサイドヘルパー。
 * OpenRouter経由でLLMを呼び出し、ニュース登録用の構造化データを返す。
 */

// ニュース種別（管理フォームのselectと一致）
export const NEWS_TYPE_OPTIONS = [
  "FUNDING",
  "M_AND_A",
  "IPO",
  "PARTNERSHIP",
  "OTHER",
] as const;

export type NewsType = (typeof NEWS_TYPE_OPTIONS)[number];

// 抽出結果の型
export interface ExtractedNews {
  title: string;
  company: string;
  type: NewsType;
  description: string;
  sector: string;
  amount: string;
  investors: string[];
  area: string | null;
  publishedAt: string | null; // ISO (YYYY-MM-DD) or null
  imageUrl: string;
  sourceUrl: string;
}

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
    "あなたはスタートアップ関連ニュースのデータベース編集者です。",
    "与えられたWebページ（ニュース記事やプレスリリース）の内容から、スタートアップ/企業に関するニュース情報を抽出し、指定されたJSON形式のみで出力します。",
    "ページに明記されている情報を最優先し、事実の創作はしないでください。ただし日付・金額・エリアはページ内の表記から可能な限り読み取り、下記フォーマットに正規化してください。",
    "",
    "出力するJSONのキーと制約:",
    "- title: ニュースの見出し（必須）。記事の主題が分かる簡潔な日本語タイトル。",
    "- company: ニュースの主役となる企業・スタートアップ名（必須）。資金調達なら調達した側、M&Aなら買収対象/被買収企業を主に。",
    '- type: 次のいずれか1つ。資金調達/出資="FUNDING"、買収/合併="M_AND_A"、上場/IPO="IPO"、業務提携/協業/パートナーシップ="PARTNERSHIP"、それ以外="OTHER"。',
    "- description: 内容の要約（日本語・80〜150字）。「どの企業が・何を・どうした」が伝わるように。",
    "- sector: 事業領域・業界（例: ヘルステック, AI・機械学習, フィンテック, SaaS, 環境）。無ければ空文字。",
    "- amount: 調達額・取引額（例: 3億円, 26億円, 1,000万ドル）。ページの表記に沿って簡潔に。無ければ空文字。",
    "- investors: 投資家・出資者・引受先の企業/ファンド名の配列（例: [\"ABC Capital\", \"XYZベンチャーズ\"]）。M&Aの買収企業もここに含めてよい。無ければ空配列。",
    "- area: 企業の所在地または対象エリア。日本の都道府県名（例: 東京都）、主要都市名、または海外国名。判別できない場合はnull。",
    "- publishedAt: ニュースの公開日・発表日。必ず YYYY-MM-DD 形式。不明ならnull。",
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

function normalizeInvestors(v: unknown): string[] {
  if (Array.isArray(v)) {
    return v.map((x) => str(x)).filter(Boolean);
  }
  const s = str(v);
  if (!s) return [];
  return s
    .split(/[,、]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

// 抽出結果を正規化（enum補正・日付整形）
function normalize(raw: Record<string, unknown>, page: FetchedPage): ExtractedNews {
  let type = str(raw.type).toUpperCase().replace(/[\s-]+/g, "_");
  if (!NEWS_TYPE_OPTIONS.includes(type as NewsType)) {
    if (/M&A|MERGER|ACQUI|買収|合併/i.test(str(raw.type))) type = "M_AND_A";
    else if (/IPO|上場/i.test(str(raw.type))) type = "IPO";
    else if (/PARTNER|提携|協業/i.test(str(raw.type))) type = "PARTNERSHIP";
    else if (/FUND|調達|出資|投資/i.test(str(raw.type))) type = "FUNDING";
    else type = "OTHER";
  }

  const pad = (n: number) => String(n).padStart(2, "0");
  const normDate = (v: unknown): string | null => {
    const s = str(v);
    if (!s) return null;
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

  return {
    title: str(raw.title) || page.title,
    company: str(raw.company),
    type: type as NewsType,
    description: str(raw.description) || page.ogDescription,
    sector: str(raw.sector),
    amount: str(raw.amount),
    investors: normalizeInvestors(raw.investors),
    area: str(raw.area) || null,
    publishedAt: normDate(raw.publishedAt),
    imageUrl: page.ogImage,
    sourceUrl: page.url,
  };
}

/**
 * URLからニュース情報を抽出する。
 * @throws OPENROUTER_API_KEY未設定・取得失敗・AI応答エラー時
 */
export async function extractNewsFromUrl(url: string): Promise<ExtractedNews> {
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
      "X-Title": "Nexana Database AI Import (News)",
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
