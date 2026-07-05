/**
 * URLからコンテスト/公募情報をAI抽出するサーバーサイドヘルパー。
 * OpenRouter経由でLLMを呼び出し、カード表示用の構造化データを返す。
 */

// 抽出結果の型（コンテスト/公募の共通スキーマ）
export interface ExtractedOpportunity {
  kind: "contest" | "open-call" | "program";
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

// JS描画サイト（SPA）対策: 可視HTMLの本文が薄い場合に、ページに埋め込まれた
// SSRシリアライズJSON（Nuxtの __NUXT_DATA__ / Next.js の __NEXT_DATA__ /
// JSON-LD / window.__NUXT__ 等）から人間可読なテキストを回収して本文の代替とする。
// STUDIO・Nuxt・Next製の公募/キャンペーンページは本文がJSで描画されるため、
// 通常のHTML除去では中身が取れないが、これらのJSONには募集タイトルや説明が入っている。
function extractEmbeddedJsonText(html: string): string {
  const chunks: string[] = [];
  const scriptRe = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = scriptRe.exec(html)) !== null) {
    const attrs = m[1] || "";
    const body = m[2] || "";
    const isJsonLd = /type=["']application\/(ld\+)?json["']/i.test(attrs);
    const isDataScript = /__NUXT_DATA__|__NEXT_DATA__/.test(attrs);
    const isStateAssign = /window\.__(NUXT|NEXT_DATA|INITIAL_STATE|APP|APOLLO_STATE)__/.test(body);
    if (isJsonLd || isDataScript || isStateAssign) chunks.push(body);
  }
  if (chunks.length === 0) return "";

  const joined = chunks.join(" ");
  const seen = new Set<string>();
  const out: string[] = [];
  // JSON中のクオート文字列を回収し、意味のあるテキストのみ残す
  const strRe = /"((?:[^"\\]|\\.){4,})"/g;
  let s: RegExpExecArray | null;
  while ((s = strRe.exec(joined)) !== null) {
    let val = s[1];
    try {
      val = JSON.parse(`"${val}"`); // JSONエスケープ（　等）を復元
    } catch {
      /* エスケープ不整合はそのまま使う */
    }
    val = val.trim();
    if (!val) continue;
    // URL・パス・識別子・ファイル名・CSS値などノイズは除外
    if (/^(https?:\/\/|\/|#|[a-z0-9_-]+\.[a-z]{2,4}$)/i.test(val)) continue;
    if (!/\p{L}/u.test(val)) continue;
    // 日本語(CJK)を含む、または英単語が3語以上つながる自然文のみ採用
    const hasCJK = /[　-鿿＀-￯]/.test(val);
    const wordish = val.split(/\s+/).length >= 3;
    if (!hasCJK && !wordish) continue;
    if (val.length > 300) val = val.slice(0, 300);
    if (seen.has(val)) continue;
    seen.add(val);
    out.push(val);
    if (out.length >= 200) break;
  }
  return out.join("\n");
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

// 募集要項・スケジュール・賞金など、詳細が載っていそうな関連ページを見分けるためのキーワード
const RELEVANT_LINK_KEYWORDS = [
  "募集", "要項", "応募", "エントリー", "entry", "apply", "application",
  "概要", "outline", "about", "detail", "guideline", "guide",
  "テーマ", "課題", "theme", "スケジュール", "schedule", "flow", "流れ", "選考",
  "賞", "prize", "award", "特典", "benefit", "支援", "副賞",
  "対象", "参加", "program", "プログラム", "recruit", "faq",
];

// サイト共通のボイラープレート（募集情報と無関係）を追跡しないための除外パターン。
// これらを取り込むと、運営会社を主催者と誤認する等の悪影響が出るため除外する。
const BOILERPLATE_LINK_RE =
  /(privacy|policy|terms|law|login|logout|sign-?in|sign-?up|register|mypage|account|sitemap|cart|inquiry|contact|corporate|\/company|\/members|プライバシー|利用規約|運営会社|会員登録|ログイン|お問い合わせ|会社概要|採用情報)/i;

interface PageLink {
  url: string;
  text: string;
  score: number;
}

// ホストから登録可能ドメイン（eTLD+1相当）をざっくり求める。
// 例: auba.eiicon.net / corp.eiicon.net / eiicon.net → いずれも "eiicon.net"
function registrableDomain(host: string): string {
  const parts = host.toLowerCase().split(".").filter(Boolean);
  if (parts.length <= 2) return parts.join(".");
  const secondLevel = new Set(["co", "ne", "or", "ac", "go", "gr", "ed", "lg", "com", "org", "net", "gov", "edu"]);
  return secondLevel.has(parts[parts.length - 2])
    ? parts.slice(-3).join(".")
    : parts.slice(-2).join(".");
}

// メインページ内のリンクから、詳細調査に値する関連ページ（同一ドメイン・募集関連）を抽出・スコアリング
function extractRelevantLinks(html: string, baseUrl: string): PageLink[] {
  let base: URL;
  try {
    base = new URL(baseUrl);
  } catch {
    return [];
  }
  const baseDomain = registrableDomain(base.host);
  const map = new Map<string, PageLink>();
  const re = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const rawHref = m[1];
    const anchor = htmlToText(m[2]).slice(0, 80);
    if (!rawHref || /^(#|mailto:|tel:|javascript:)/i.test(rawHref)) continue;

    let abs: URL;
    try {
      abs = new URL(rawHref, baseUrl);
    } catch {
      continue;
    }
    if (!/^https?:$/.test(abs.protocol)) continue;
    // 同一の登録可能ドメイン（サブドメイン違いは許容）のみ追跡
    if (registrableDomain(abs.host) !== baseDomain) continue;
    // バイナリ/画像/文書などHTML以外は追跡しない
    if (/\.(pdf|jpe?g|png|gif|svg|webp|zip|docx?|xlsx?|pptx?|mp4|mov)$/i.test(abs.pathname)) continue;

    abs.hash = "";
    const key = abs.toString();
    if (key === base.toString()) continue; // 自ページは除外

    const hay = `${decodeURIComponent(abs.pathname)} ${decodeURIComponent(abs.search)} ${anchor}`;
    if (BOILERPLATE_LINK_RE.test(hay)) continue; // 共通フッター等は除外

    const lower = hay.toLowerCase();
    let score = 0;
    for (const kw of RELEVANT_LINK_KEYWORDS) {
      if (lower.includes(kw.toLowerCase())) score += 1;
    }
    // メインページと同じディレクトリ配下（詳細ページの可能性が高い）は加点
    if (abs.pathname.startsWith(base.pathname.replace(/[^/]*$/, ""))) score += 1;
    if (score <= 0) continue;

    const prev = map.get(key);
    if (!prev || score > prev.score) {
      map.set(key, { url: key, text: anchor, score });
    }
  }
  return [...map.values()].sort((a, b) => b.score - a.score);
}

interface FetchedPage {
  url: string;
  title: string;
  ogImage: string;
  ogDescription: string;
  text: string;
  links: PageLink[];
}

async function fetchPage(url: string, maxTextLength = 12000): Promise<FetchedPage> {
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
    const contentType = res.headers.get("content-type") || "";
    if (contentType && !/text\/html|application\/xhtml/i.test(contentType)) {
      throw new Error(`HTML以外のコンテンツです (${contentType})`);
    }
    const html = await res.text();
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const ogImage = extractMeta(html, "og:image");
    const ogDescription =
      extractMeta(html, "og:description") || extractMeta(html, "description");

    const bodyText = htmlToText(html);
    let text = bodyText.slice(0, maxTextLength);
    // 可視本文が薄い（JS描画SPAの疑い）場合は、埋め込みJSON+OG説明で補完する
    if (bodyText.length < 200) {
      const embedded = extractEmbeddedJsonText(html);
      if (embedded || ogDescription) {
        text = [bodyText, ogDescription, embedded]
          .filter(Boolean)
          .join("\n")
          .slice(0, maxTextLength);
      }
    }

    return {
      url,
      title: extractMeta(html, "og:title") || (titleMatch?.[1]?.trim() ?? ""),
      ogImage: toAbsoluteUrl(ogImage, url),
      ogDescription,
      text,
      links: extractRelevantLinks(html, url),
    };
  } finally {
    clearTimeout(timeout);
  }
}

function buildPrompt(
  main: FetchedPage,
  extras: { anchor: string; page: FetchedPage }[]
): { system: string; user: string } {
  const system = [
    "あなたはスタートアップ向けデータベースの編集者です。",
    "与えられたWebページの内容から、コンテスト・公募・プログラム（オープンイノベーション募集や育成プログラム）の情報を抽出し、指定されたJSON形式のみで出力します。",
    "入力には「メインページ」に加えて、同一サイト内の関連ページ（募集要項・応募概要・スケジュール・テーマ・賞金/特典など）の本文が複数含まれることがあります。",
    "各フィールドは、メインページと関連ページのすべてを突き合わせて、可能な限り具体的に埋めてください。関連ページに詳細（締切日・対象領域・応募対象・賞金など）が書かれていることが多いので、必ず全セクションを確認すること。",
    "ページに明記されている情報を最優先し、事実の創作はしないでください。ただし日付・エリアはページ内の表記から可能な限り読み取り、下記フォーマットに正規化してください。矛盾する情報がある場合は、募集要項/応募概要など詳細ページの記載を優先します。",
    "",
    "出力するJSONのキーと制約:",
    '- kind: 次の3つから最も適切なものを1つ。 "contest"（コンテスト・ピッチ・ハッカソン・アワード等、審査で優劣を competition 形式で競い賞を与える応募型）／ "open-call"（企業/行政/大学がパートナー・協業・実証・課題解決先を募集する公募型）／ "program"（アクセラレーション・インキュベーション・育成/支援プログラム等、採択後に一定期間の継続的な支援〈メンタリング・資金・オフィス・事業連携など〉を提供するプログラム型）。判断基準: 賞金/順位を競うなら contest、協業/課題解決の相手を探すなら open-call、採択者に継続的な育成・支援を行うなら program。アクセラ/インキュベーションは原則 program とする。',
    "- title: イベント/募集の正式名称（必須）。",
    "- organizer: 主催者・運営組織名（必須）。「主催」の記載を最優先し、無ければ「運営」「事務局」。共催が複数ある場合は主となる組織1つ。",
    `- organizerType: 主催者の種別を次のいずれか1つ [${ORGANIZER_TYPE_OPTIONS.join(", ")}]。株式会社・有限会社・合同会社などの会社、インフラ運営会社・鉄道/道路会社・銀行なども "企業"。国・省庁・自治体・公社・独立行政法人など公的機関は "行政"、大学・高専・研究機関は "大学"、VC/CVCは "CV"。上記に当てはまらない場合のみ "その他"。`,
    "- description: 内容の要約（日本語・80〜150字）。「誰向けの・何を募集する・どんな機会か」が伝わるように。",
    `- area: 開催/対象エリア。日本の都道府県名、または[${["全国", ...OVERSEAS_AREAS].join(", ")}]から最も近いものを1つ。実証フィールド・会場・実施主体の所在地が特定の都道府県に限定される場合（例: 会場や実証場所が東京都内→「東京都」）は、その都道府県を優先する。応募自体は全国から可能というだけでは「全国」にせず、物理的な実施地域を優先すること。実施地域が全国各地・オンライン中心・特定地域に絞れない場合のみ「全国」。判別できない場合のみnull。`,
    "- deadline: 応募・エントリーの締切日。「応募締切」「エントリー期限」「募集終了」「〆切」等を探す。期間表記（例:「2026年6月1日〜7月14日」）なら終了日を採用。二次締切など複数ある場合は最終の締切。必ず YYYY-MM-DD 形式。不明ならnull。",
    "- startDate: 募集開始日または開催日。「募集開始」「エントリー開始」「受付開始」「開催日」等を探す。期間表記なら開始日を採用。必ず YYYY-MM-DD 形式。不明ならnull。",
    "- targetArea: 対象領域・テーマ（例: ヘルスケア, モビリティ, ディープテック, 環境, DX）。募集テーマ・課題領域から抽出。複数はカンマ区切り。無ければ空文字。",
    "- targetAudience: 応募対象（例: スタートアップ, 学生, 個人, 中小企業, 研究者, 法人）。応募資格・参加条件から抽出。無ければ空文字。",
    "- benefit: 賞金・特典・副賞、または提供リソース（資金/メンタリング/オフィス/実証フィールド/事業会社との連携等）。金額や内容を簡潔に。無ければ空文字。",
    "",
    "日付ルール: 西暦4桁に統一し、和暦（令和等）や「YYYY年M月D日」「YYYY/M/D」表記もすべて YYYY-MM-DD に変換する。年が省略されている場合は文脈（他の日付や開催年度）から最も妥当な年を補う。",
    "JSONオブジェクトのみを出力し、前後に説明文やコードフェンス（```）を付けないこと。",
  ].join("\n");

  const sections: string[] = [
    `メインページURL: ${main.url}`,
    `メインページタイトル: ${main.title}`,
    main.ogDescription ? `OG説明: ${main.ogDescription}` : "",
    "",
    "【メインページ本文】",
    main.text,
  ];

  for (const { anchor, page } of extras) {
    sections.push(
      "",
      `【関連ページ: ${anchor || page.title || "詳細"}（${page.url}）】`,
      page.text
    );
  }

  return { system, user: sections.filter(Boolean).join("\n") };
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
  const rawKind = str(raw.kind);
  const kind: ExtractedOpportunity["kind"] =
    rawKind === "open-call" ? "open-call" : rawKind === "program" ? "program" : "contest";

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
    kind,
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
      "ページ本文を取得できませんでした（JavaScriptで描画されるサイトで、埋め込みデータからも情報を取得できませんでした）。お手数ですが手動で入力してください。"
    );
  }

  // 関連ページ（募集要項・スケジュール・賞金など）を最大4件まで追加取得して、
  // 抽出精度を上げる。取得失敗・本文が薄いページは無視する。
  const MAX_SUBPAGES = 4;
  const candidates = page.links.slice(0, MAX_SUBPAGES);
  const fetchedExtras = await Promise.all(
    candidates.map(async (link) => {
      try {
        const sub = await fetchPage(link.url, 8000);
        if (!sub.text || sub.text.length < 80) return null;
        return { anchor: link.text, page: sub };
      } catch {
        return null;
      }
    })
  );
  const extras = fetchedExtras.filter(
    (e): e is { anchor: string; page: FetchedPage } => e !== null
  );

  const { system, user } = buildPrompt(page, extras);
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
