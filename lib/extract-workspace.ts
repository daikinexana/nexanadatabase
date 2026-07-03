/**
 * 施設（ワークスペース）ページのURLから登録用データをAI抽出するサーバーサイドヘルパー。
 * OpenRouter経由でLLMを呼び出し、管理フォームに流し込める構造化データを返す。
 *
 * 精度を上げるため、トップページだけでなく「アクセス/料金/施設案内」等の
 * 関連下層ページも数ページ巡回し、JSON-LD(schema.org)の構造化データも合わせて
 * LLMに渡す。写真が必要な項目（周辺情報カード等）は無理に埋めない。
 */

import { deriveCountryCity } from "@/lib/derive-location";
import { type InfoCard, normalizeInfoCards } from "@/lib/workspace-info-cards";

// 抽出結果の型（管理フォームの主要フィールドに対応）
export interface ExtractedWorkspace {
  name: string;
  description: string;
  address: string;
  area: string; // 住所から判定できない海外等の上書き用。基本は空。
  country: string;
  city: string;
  officialLink: string;
  businessHours: string;
  priceTable: string;
  operator: string;
  management: string;
  facilityFeatureOneLine: string;
  imageUrl: string;
  // 設備
  hasDropin: boolean;
  hasMeetingRoom: boolean;
  hasPhoneBooth: boolean;
  hasWifi: boolean;
  hasParking: boolean;
  // カテゴリ
  categoryWork: boolean;
  categoryConnect: boolean;
  categoryPrototype: boolean;
  categoryPilot: boolean;
  categoryTest: boolean;
  categorySupport: boolean;
  categoryShowcase: boolean;
  categoryLearn: boolean;
  categoryStay: boolean;
  // 施設情報カード（写真なしの下書き。プレビューで写真を追加する）
  infoCards: InfoCard[];
}

const DEFAULT_MODEL = "google/gemini-2.5-flash";

// 巡回する下層ページの最大数と、LLMに渡す本文の合計最大文字数
const MAX_SUBPAGES = 4;
const TOP_PAGE_CHARS = 16000;
const SUBPAGE_CHARS = 8000;
const TOTAL_TEXT_CHARS = 65000;

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

// JS/JSON文字列リテラルのエスケープを解除
function decodeJsString(s: string): string {
  return s
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\n/g, " ")
    .replace(/\\t/g, " ")
    .replace(/\\r/g, " ")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\//g, "/")
    .replace(/\\\\/g, "\\");
}

// 意味のある本文文字列かどうか（ノイズ除去）
function looksLikeContent(s: string): boolean {
  const t = s.trim();
  if (t.length < 2 || t.length > 400) return false;
  // 日本語を含む、または「単語＋スペース」を含む英文
  const hasJa = /[぀-ヿ㐀-鿿＀-￯]/.test(t);
  const hasSentence = /\s/.test(t) && /[A-Za-z]{3,}/.test(t);
  if (!hasJa && !hasSentence) return false;
  // 明らかなコード/識別子/URLのみ・記号だらけを除外
  if (/^[\s\w.\-/#:?&=%@]+$/.test(t) && !hasJa) return false;
  if (/^(https?:|data:|\/|#|function|return|var |const |let )/.test(t)) return false;
  return true;
}

/**
 * SPA（Nuxt/Next等）のハイドレーションデータやインラインJSONから
 * 人間可読な本文テキストを回収する。<script>を除去する htmlToText では
 * 消えてしまう本文（住所・設備・料金など）を拾うための補助。
 */
function harvestHydrationText(html: string): string {
  const scripts = [
    ...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi),
  ].map((m) => m[1] || "");

  const collected: string[] = [];
  const seen = new Set<string>();
  const push = (raw: string) => {
    const v = decodeJsString(raw).replace(/\s+/g, " ").trim();
    if (!looksLikeContent(v)) return;
    if (seen.has(v)) return;
    seen.add(v);
    collected.push(v);
  };

  for (const script of scripts) {
    // 本文が入っていそうな大きめ／ハイドレーション系スクリプトのみ対象
    const isHydration =
      /__NUXT__|__NEXT_DATA__|__next_f|__remixContext|window\.__|application\/json/i.test(
        script
      ) || script.length > 3000;
    if (!isHydration) continue;

    // ダブル/シングルクォートの文字列リテラルを抽出
    const strings = [
      ...script.matchAll(/"((?:\\.|[^"\\]){2,400})"/g),
      ...script.matchAll(/'((?:\\.|[^'\\]){2,400})'/g),
    ];
    for (const m of strings) push(m[1]);

    if (collected.length > 4000) break; // 安全上限
  }

  return collected.join(" ");
}

// JSON-LD(schema.org)から住所・営業時間・電話・価格などの手掛かりを抽出
function extractJsonLdHints(html: string): string {
  const blocks = [
    ...html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
    ),
  ];
  const hints: string[] = [];

  const walk = (node: unknown) => {
    if (!node || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    const obj = node as Record<string, unknown>;

    // 住所（PostalAddress or 文字列）
    const addr = obj.address;
    if (addr) {
      if (typeof addr === "string") {
        hints.push(`住所: ${addr}`);
      } else if (typeof addr === "object") {
        const a = addr as Record<string, unknown>;
        const parts = [
          a.postalCode,
          a.addressRegion,
          a.addressLocality,
          a.streetAddress,
        ]
          .filter((v) => typeof v === "string" && v.trim())
          .join(" ");
        if (parts) hints.push(`住所: ${parts}`);
      }
    }
    if (typeof obj.telephone === "string") hints.push(`電話: ${obj.telephone}`);
    if (typeof obj.priceRange === "string") hints.push(`価格帯: ${obj.priceRange}`);
    // 営業時間
    if (typeof obj.openingHours === "string") {
      hints.push(`営業時間: ${obj.openingHours}`);
    } else if (Array.isArray(obj.openingHours)) {
      hints.push(`営業時間: ${obj.openingHours.filter((x) => typeof x === "string").join(", ")}`);
    }
    const ohs = obj.openingHoursSpecification;
    if (Array.isArray(ohs)) {
      const specs = ohs
        .map((s) => {
          if (!s || typeof s !== "object") return "";
          const o = s as Record<string, unknown>;
          const day = Array.isArray(o.dayOfWeek)
            ? o.dayOfWeek.join("/")
            : typeof o.dayOfWeek === "string"
            ? o.dayOfWeek
            : "";
          const open = typeof o.opens === "string" ? o.opens : "";
          const close = typeof o.closes === "string" ? o.closes : "";
          return [day, open && close ? `${open}-${close}` : ""].filter(Boolean).join(" ");
        })
        .filter(Boolean);
      if (specs.length) hints.push(`営業時間: ${specs.join(", ")}`);
    }

    // ネストした値も走査
    for (const v of Object.values(obj)) {
      if (v && typeof v === "object") walk(v);
    }
  };

  for (const b of blocks) {
    const raw = b[1]?.trim();
    if (!raw) continue;
    try {
      walk(JSON.parse(raw));
    } catch {
      // 壊れたJSON-LDは無視
    }
  }
  // 重複除去
  return [...new Set(hints)].join("\n");
}

// リンク先が「詳細が載っていそうなページ」かのスコア（高いほど優先）
const SUBPAGE_KEYWORDS: { re: RegExp; score: number }[] = [
  { re: /(access|map|所在地|アクセス|地図|来館|行き方|visit)/i, score: 5 },
  { re: /(price|plan|fee|ryokin|料金|プラン|費用|利用料|会員|membership)/i, score: 5 },
  {
    re: /(facilit|equip|設備|施設|館内|room|会議室|ドロップイン|drop.?in|floor|フロア|rental|space|guide.?tour|tour)/i,
    score: 4,
  },
  { re: /(hour|time|営業|利用時間|オープン|open)/i, score: 3 },
  { re: /(about|information|概要|案内|company|会社|運営|info)/i, score: 2 },
];

function keywordScore(haystack: string): number {
  let score = 0;
  for (const k of SUBPAGE_KEYWORDS) if (k.re.test(haystack)) score += k.score;
  return score;
}

/**
 * アクセス/料金/施設案内など、詳細が載っていそうな同一ドメインの下層リンクを収集する。
 * 生HTMLの <a> と、Jinaレンダリング後のmarkdownリンク [label](url) の両方を対象にするため、
 * JS描画サイト（生HTMLにリンクが無い）でも内部ページを発見できる。
 */
function discoverSubpageLinks(
  html: string,
  renderedMarkdown: string,
  baseUrl: string
): string[] {
  const base = new URL(baseUrl);
  const normalizedBase = baseUrl.replace(/\/$/, "");
  const scored = new Map<string, number>();

  const consider = (href: string, label: string) => {
    if (!href) return;
    if (/^(#|mailto:|tel:|javascript:)/i.test(href)) return;
    let abs: URL;
    try {
      abs = new URL(href, baseUrl);
    } catch {
      return;
    }
    if (abs.origin !== base.origin) return; // 同一ドメインのみ
    if (/\.(pdf|jpg|jpeg|png|gif|webp|zip|mp4|doc|docx|xls|xlsx)$/i.test(abs.pathname)) return;
    const haystack = `${href} ${label}`; // ハッシュ(#access等)も手掛かりに使う
    abs.hash = "";
    const key = abs.toString();
    if (key === baseUrl || key.replace(/\/$/, "") === normalizedBase) return;
    const score = keywordScore(haystack);
    if (score <= 0) return;
    scored.set(key, Math.max(scored.get(key) ?? 0, score));
  };

  // 生HTMLの <a href>
  for (const m of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    consider(m[1], htmlToText(m[2] || ""));
  }
  // レンダリング後markdownの [label](url)
  if (renderedMarkdown) {
    for (const m of renderedMarkdown.matchAll(/\[([^\]]{0,100})\]\((https?:\/\/[^)\s]+)\)/g)) {
      consider(m[2], m[1]);
    }
  }

  return [...scored.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_SUBPAGES)
    .map(([url]) => url);
}

interface FetchedHtml {
  url: string;
  html: string;
}

async function fetchHtml(url: string, timeoutMs = 15000): Promise<FetchedHtml | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
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
    if (!res.ok) return null;
    const html = await res.text();
    return { url, html };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * JS描画サイト向けフォールバック。Jina Reader(r.jina.ai)経由で
 * JavaScript実行後のテキストを取得する。format="markdown"はリンク付き（内部リンク発見用）、
 * "text"はリンク無しの本文のみ。JINA_API_KEY があればレート上限が上がる（無くても匿名可）。
 */
async function fetchRendered(
  url: string,
  format: "text" | "markdown" = "text",
  timeoutMs = 45000
): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const headers: Record<string, string> = {
      "User-Agent": "Mozilla/5.0 (compatible; NexanaBot/1.0)",
      Accept: "text/plain",
    };
    if (format === "text") headers["X-Return-Format"] = "text";
    if (process.env.JINA_API_KEY) {
      headers.Authorization = `Bearer ${process.env.JINA_API_KEY}`;
    }
    const res = await fetch(`https://r.jina.ai/${url}`, {
      signal: controller.signal,
      headers,
    });
    if (!res.ok) return null;
    const text = await res.text();
    return text && text.trim().length > 40 ? text : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

// 1つの下層ページの本文テキストを取得（生HTMLが薄いSPAならJinaで描画後テキストを取得）
async function fetchSubpageText(
  url: string
): Promise<{ url: string; text: string; jsonLd: string }> {
  const f = await fetchHtml(url, 12000);
  if (!f) {
    const r = await fetchRendered(url, "text", 30000);
    return { url, text: r || "", jsonLd: "" };
  }
  const dom = htmlToText(f.html);
  const jsonLd = extractJsonLdHints(f.html);
  if (dom.length >= 800) return { url, text: dom, jsonLd };
  const [r] = await Promise.all([fetchRendered(url, "text", 30000)]);
  const hyd = harvestHydrationText(f.html);
  return { url, text: [r || "", hyd, dom].filter(Boolean).join("\n\n"), jsonLd };
}

interface CollectedContent {
  url: string;
  title: string;
  ogImage: string;
  ogDescription: string;
  jsonLd: string;
  combinedText: string;
}

// トップページ + 関連下層ページを取得して、LLMに渡す本文を構築する
async function collectContent(url: string): Promise<CollectedContent> {
  const top = await fetchHtml(url);
  if (!top) {
    throw new Error(`ページの取得に失敗しました`);
  }
  const html = top.html;
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const ogImage = extractMeta(html, "og:image");
  const jsonLdTop = extractJsonLdHints(html);

  // トップページ本文。DOM本文が薄い＝JSで描画するSPAなので、
  // Jina Reader でJS実行後テキスト（フッターの住所・営業時間等を含む）を取得して主本文にする。
  // markdownで取得すると内部リンクも得られ、下層ページ発見に使える。
  const domText = htmlToText(html);
  const isSpa = domText.length < 800;
  let topText: string;
  let renderedMarkdown = "";
  if (!isSpa) {
    topText = domText;
  } else {
    renderedMarkdown = (await fetchRendered(top.url, "markdown")) || "";
    const hyd = harvestHydrationText(html);
    topText = [renderedMarkdown, hyd, domText].filter(Boolean).join("\n\n");
  }

  // 生HTMLの<a>＋レンダリング後markdownのリンクから、関連下層ページを発見して並行取得。
  const subLinks = discoverSubpageLinks(html, renderedMarkdown, top.url);
  const subPages = await Promise.all(subLinks.map((u) => fetchSubpageText(u)));

  const jsonLdParts = [jsonLdTop];
  const textParts: string[] = [
    `【トップページ】${topText.slice(0, Math.max(TOP_PAGE_CHARS, 30000))}`,
  ];
  for (const sub of subPages) {
    const t = sub.text.slice(0, SUBPAGE_CHARS);
    if (t.length > 40) textParts.push(`【関連ページ: ${sub.url}】${t}`);
    if (sub.jsonLd) jsonLdParts.push(sub.jsonLd);
  }

  const combinedText = textParts.join("\n\n").slice(0, TOTAL_TEXT_CHARS);
  const jsonLd = [...new Set(jsonLdParts.filter(Boolean).join("\n").split("\n"))].join("\n");

  return {
    url: top.url,
    title: extractMeta(html, "og:title") || (titleMatch?.[1]?.trim() ?? ""),
    ogImage: toAbsoluteUrl(ogImage, top.url),
    ogDescription: extractMeta(html, "og:description") || extractMeta(html, "description"),
    jsonLd,
    combinedText,
  };
}

function buildPrompt(page: CollectedContent): { system: string; user: string } {
  const system = [
    "あなたはコワーキング/ワークスペース施設データベースの編集者です。",
    "与えられたWebページ（複数ページの本文＋構造化データ）から施設情報を抽出し、指定されたJSON形式のみで出力します。",
    "事実の創作はしないでください。ただし、本文や構造化データに手掛かりがある項目は積極的に読み取ってください（『記載されているのに空欄』を避ける）。本当に情報が無い項目のみ空文字/false/空配列にします。",
    "",
    "出力するJSONのキーと制約:",
    "- name: 施設の正式名称（必須）。",
    "- description: 施設の概要・特徴の要約（日本語・100〜200字）。どんな空間で誰向けかが伝わるように。",
    "- address: 施設の所在地。『住所』『所在地』『アクセス』や構造化データの住所から、都道府県〜番地・建物名まで拾う。郵便番号があれば含めてよい。不明なら空文字。",
    "- officialLink: 施設公式ページのURL。基本は与えられたトップページURLでよい。",
    "- businessHours: 営業時間・利用時間。『営業時間』『利用時間』『OPEN』や構造化データから拾う（例:「平日 9:00-22:00 / 土日祝 10:00-18:00」）。不明なら空文字。",
    "- priceTable: 料金・プラン。ドロップイン/月額/会員種別など、価格に関する記載を要約（例:「ドロップイン 1,100円/時, 月額会員 22,000円」）。不明なら空文字。",
    "- operator: 施設の運営主体（企業・団体名）。『運営』『運営会社』『Operated by』『会社概要』等から拾う。不明なら空文字。",
    "- management: 実際の運営者・運営会社名。operatorと同じなら同じ値でよい。不明なら空文字。",
    "- facilityFeatureOneLine: 施設の特徴を表す短いキャッチコピー（20字以内・例:「海が見える開放的な空間」）。",
    "- 設備フラグ（明記または強い示唆があればtrue、なければfalse）:",
    "  - hasDropin: ドロップイン/一時利用/時間貸し/ビジター利用。",
    "  - hasMeetingRoom: 会議室/ミーティングルーム/貸会議室/カンファレンスルーム。",
    "  - hasPhoneBooth: フォンブース/電話ブース/防音ブース/Web会議ブース。",
    "  - hasWifi: Wi-Fi/無線LAN/インターネット完備。",
    "  - hasParking: 駐車場/パーキング/駐車可。",
    "- カテゴリフラグ（用途が明確ならtrue、確信がなければfalse）: categoryWork(執務), categoryConnect(交流), categoryPrototype(試作), categoryPilot(実証), categoryTest(試験), categorySupport(支援), categoryShowcase(発表), categoryLearn(学ぶ), categoryStay(滞在)。",
    "- infoCards: 施設内の設備・空間や特徴を説明する『施設情報カード』の配列（写真は付けない）。各要素は { \"category\": \"facility\", \"title\": 短い見出し, \"description\": 1〜2文の説明 }。ページ内で個別に紹介されている部屋・設備・特徴があれば最大6件まで作成。無ければ空配列 []。周辺ホテル/Food/スポットは推測せず作らない。",
    "",
    "JSONオブジェクトのみを出力し、前後に説明文やコードフェンス（```）を付けないこと。",
  ].join("\n");

  const user = [
    `URL: ${page.url}`,
    `ページタイトル: ${page.title}`,
    page.ogDescription ? `OG説明: ${page.ogDescription}` : "",
    page.jsonLd ? `\n構造化データ(JSON-LD)から抽出した手掛かり:\n${page.jsonLd}` : "",
    "",
    "本文テキスト（複数ページ結合）:",
    page.combinedText,
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

function bool(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return /^(true|yes|1|有|あり)$/i.test(v.trim());
  return false;
}

// 抽出結果を正規化
function normalize(raw: Record<string, unknown>, page: CollectedContent): ExtractedWorkspace {
  const address = str(raw.address);
  const { country, city } = deriveCountryCity(address, "");

  // infoCardsはfacilityカテゴリのみ許可（周辺系の推測を除外）
  const rawCards = normalizeInfoCards(raw.infoCards).map((c) => ({
    ...c,
    category: "facility" as const,
  }));

  return {
    name: str(raw.name) || page.title,
    description: str(raw.description) || page.ogDescription,
    address,
    area: "",
    country,
    city,
    officialLink: str(raw.officialLink) || page.url,
    businessHours: str(raw.businessHours),
    priceTable: str(raw.priceTable),
    operator: str(raw.operator),
    management: str(raw.management),
    facilityFeatureOneLine: str(raw.facilityFeatureOneLine),
    imageUrl: page.ogImage,
    hasDropin: bool(raw.hasDropin),
    hasMeetingRoom: bool(raw.hasMeetingRoom),
    hasPhoneBooth: bool(raw.hasPhoneBooth),
    hasWifi: bool(raw.hasWifi),
    hasParking: bool(raw.hasParking),
    categoryWork: bool(raw.categoryWork),
    categoryConnect: bool(raw.categoryConnect),
    categoryPrototype: bool(raw.categoryPrototype),
    categoryPilot: bool(raw.categoryPilot),
    categoryTest: bool(raw.categoryTest),
    categorySupport: bool(raw.categorySupport),
    categoryShowcase: bool(raw.categoryShowcase),
    categoryLearn: bool(raw.categoryLearn),
    categoryStay: bool(raw.categoryStay),
    infoCards: rawCards,
  };
}

/**
 * URLから施設情報を抽出する。
 * @throws OPENROUTER_API_KEY未設定・取得失敗・AI応答エラー時
 */
export async function extractWorkspaceFromUrl(
  url: string
): Promise<ExtractedWorkspace> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY が設定されていません");
  }

  const page = await collectContent(url);
  const hasSignal =
    (page.combinedText && page.combinedText.length >= 60) ||
    page.ogDescription.length >= 20 ||
    page.jsonLd.length > 0;
  if (!hasSignal) {
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
      "X-Title": "Nexana Database AI Import (Workspace)",
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
