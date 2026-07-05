/**
 * 保存時の重複検知（コンテスト/公募/プログラム・News・施設 共通）。
 *
 * 方針:
 *  1) 決定的ルールで候補を絞り込む（正規化した文字列一致・URL一致・期間/金額の条件）
 *  2) 「表記ゆれ（少し違うタイトル/誤字）」の取りこぼしを、AIの意味的類似判定で補う
 *  3) 判定はあくまで「警告」。呼び出し側で確認後、confirmDuplicate=true で保存を継続できる
 *
 * 正当な重複（毎年開催・同一企業の複数回調達など）は許可するため、
 *  - コンテスト等: 開始日の「年」が違えば別物
 *  - News: 調達額 or 掲載時期が違えば別ラウンド
 * として扱う。
 */

import { prisma } from "@/lib/prisma";

export interface DuplicateMatch {
  id: string;
  title: string; // 表示名（タイトル/施設名）
  subtitle: string; // 主催者/会社/都市 など
  meta: string; // 日付・金額・リンク等の補足
  strength: "exact" | "likely"; // 完全一致相当 / 類似（要確認）
  reason: string; // なぜ重複とみなしたか
}

// ---- 文字列正規化・類似度 ----

/** NFKC正規化＋小文字化＋空白圧縮（全角半角・大文字小文字の揺れを吸収） */
function norm(s: string | null | undefined): string {
  return (s ?? "").normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
}

/** 比較キー（空白・記号を除去。日本語はそのまま残す） */
function key(s: string | null | undefined): string {
  return norm(s).replace(/[\s!-/:-@[-`{-~、。・「」（）()［］【】〜~ー―–—]/g, "");
}

/** 文字bigramのDice係数（日本語にも有効な軽量類似度, 0..1） */
function similarity(a: string, b: string): number {
  const ka = key(a);
  const kb = key(b);
  if (!ka || !kb) return 0;
  if (ka === kb) return 1;
  if (ka.length < 2 || kb.length < 2) return ka === kb ? 1 : 0;
  const bigrams = (s: string) => {
    const m = new Map<string, number>();
    for (let i = 0; i < s.length - 1; i++) {
      const g = s.slice(i, i + 2);
      m.set(g, (m.get(g) ?? 0) + 1);
    }
    return m;
  };
  const ma = bigrams(ka);
  const mb = bigrams(kb);
  let inter = 0;
  for (const [g, c] of ma) {
    const c2 = mb.get(g);
    if (c2) inter += Math.min(c, c2);
  }
  return (2 * inter) / (ka.length - 1 + (kb.length - 1));
}

/** URLを比較しやすい形へ（プロトコル/末尾スラッシュ/wwwを無視、クエリは保持） */
function normUrl(u: string | null | undefined): string {
  const s = (u ?? "").trim();
  if (!s) return "";
  try {
    const url = new URL(s);
    const host = url.host.replace(/^www\./, "");
    const path = url.pathname.replace(/\/+$/, "");
    return `${host}${path}${url.search}`.toLowerCase();
  } catch {
    return s.toLowerCase().replace(/\/+$/, "");
  }
}

function yearRange(d: Date): { gte: Date; lte: Date } {
  const y = d.getUTCFullYear();
  return {
    gte: new Date(Date.UTC(y, 0, 1, 0, 0, 0)),
    lte: new Date(Date.UTC(y, 11, 31, 23, 59, 59)),
  };
}

function daysBetween(a: Date, b: Date): number {
  return Math.abs(a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24);
}

const TITLE_SIM_THRESHOLD = 0.6; // これ以上でAI確認の候補に含める
const AI_FALLBACK_SIM = 0.86; // AI不使用時に「重複」と確定する高類似のしきい値

// ---- AIによる意味的な重複確認（OpenRouter） ----

interface AiCandidate {
  id: string;
  text: string; // 候補の要約テキスト
}

/**
 * 決定的ルールで拾った「類似候補」を、AIに「本当に同じか？」判定させて絞り込む。
 * APIキー未設定・失敗時は例外を投げず、呼び出し側のフォールバックに委ねる。
 * @returns 同一と判定された候補IDの集合。判定できなければ null。
 */
async function aiPickDuplicates(
  domainRule: string,
  newItemText: string,
  candidates: AiCandidate[]
): Promise<Set<string> | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || candidates.length === 0) return null;

  const model = process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash";
  const system = [
    "あなたはデータベースの重複チェック担当です。",
    "「新規データ」と「既存候補」を比較し、実質的に同一のものだけを重複として選びます。",
    "表記ゆれ・略称・誤字・句読点や英日の違いは同一とみなします。",
    domainRule,
    "出力は JSON オブジェクトのみ。形式: {\"duplicateIds\": [\"id1\", ...]}。同一が無ければ空配列。",
    "確信が持てないものは含めないでください。",
  ].join("\n");
  const user = [
    "【新規データ】",
    newItemText,
    "",
    "【既存候補】",
    ...candidates.map((c) => `- id=${c.id}: ${c.text}`),
  ].join("\n");

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_BASE_URL || "https://db.nexanahq.com",
        "X-Title": "Nexana Database Duplicate Check",
      },
      body: JSON.stringify({
        model,
        temperature: 0,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    }).finally(() => clearTimeout(timeout));

    if (!res.ok) return null;
    const data = await res.json();
    const content: string = data?.choices?.[0]?.message?.content ?? "";
    if (!content) return null;
    const start = content.indexOf("{");
    const end = content.lastIndexOf("}");
    const json = start !== -1 && end !== -1 ? content.slice(start, end + 1) : content;
    const parsed = JSON.parse(json) as { duplicateIds?: unknown };
    const ids = Array.isArray(parsed.duplicateIds)
      ? parsed.duplicateIds.filter((x): x is string => typeof x === "string")
      : [];
    return new Set(ids);
  } catch {
    return null;
  }
}

// 内部: 決定的な「確定重複」と「類似候補」を仕分けしてから、候補だけAI確認する共通処理
async function finalize(
  exacts: DuplicateMatch[],
  likelies: { match: DuplicateMatch; sim: number }[],
  domainRule: string,
  newItemText: string,
  toText: (m: DuplicateMatch) => string
): Promise<DuplicateMatch[]> {
  const result = [...exacts];
  if (likelies.length > 0) {
    const picked = await aiPickDuplicates(
      domainRule,
      newItemText,
      likelies.map((l) => ({ id: l.match.id, text: toText(l.match) }))
    );
    for (const l of likelies) {
      const isDup = picked ? picked.has(l.match.id) : l.sim >= AI_FALLBACK_SIM;
      if (isDup) result.push(l.match);
    }
  }
  // exact を先頭に、重複IDは除外
  const seen = new Set<string>();
  return result
    .sort((a, b) => (a.strength === b.strength ? 0 : a.strength === "exact" ? -1 : 1))
    .filter((m) => (seen.has(m.id) ? false : (seen.add(m.id), true)));
}

// ---- コンテスト/公募/プログラム（Opportunity） ----

export interface OpportunityDupInput {
  title: string;
  organizer: string;
  website: string;
  startDate: Date;
  deadline?: Date | null;
}

export async function findOpportunityDuplicates(
  input: OpportunityDupInput
): Promise<DuplicateMatch[]> {
  const { gte, lte } = yearRange(input.startDate);
  // 同じ年（開始日）に開催されるもの、または同一URLのものを候補に取得（最小カラム）
  const rows = await prisma.opportunity.findMany({
    where: {
      OR: [{ startDate: { gte, lte } }, { website: { equals: input.website } }],
    },
    select: {
      id: true,
      title: true,
      organizer: true,
      website: true,
      startDate: true,
      deadline: true,
    },
    take: 300,
  });

  const sameYear = (d: Date | null) =>
    !!d && d.getUTCFullYear() === input.startDate.getUTCFullYear();

  const exacts: DuplicateMatch[] = [];
  const likelies: { match: DuplicateMatch; sim: number }[] = [];

  for (const r of rows) {
    // 別年度は「毎年開催」の正当な重複として許可
    if (!sameYear(r.startDate)) continue;

    const toMatch = (strength: DuplicateMatch["strength"], reason: string): DuplicateMatch => ({
      id: r.id,
      title: r.title,
      subtitle: r.organizer,
      meta: `開始 ${r.startDate.toISOString().slice(0, 10)}${r.website ? " / " + r.website : ""}`,
      strength,
      reason,
    });

    const urlEqual = !!input.website && normUrl(r.website) === normUrl(input.website);
    const titleEqual = key(r.title) === key(input.title);
    const orgEqual = key(r.organizer) === key(input.organizer);

    if ((urlEqual && sameYear(r.startDate)) || (titleEqual && orgEqual)) {
      exacts.push(toMatch("exact", urlEqual ? "同じURL・同じ年" : "主催者とタイトルが一致（同年）"));
      continue;
    }
    const titleSim = similarity(r.title, input.title);
    const orgSim = similarity(r.organizer, input.organizer);
    if (titleSim >= TITLE_SIM_THRESHOLD && (orgSim >= 0.5 || orgEqual)) {
      likelies.push({ match: toMatch("likely", "タイトル・主催者が類似（同年）"), sim: titleSim });
    }
  }

  const rule =
    "対象はコンテスト/公募/プログラム。主催者と催しが同じなら同一。ただし開催年が異なる場合（毎年開催の別年度）は別物として扱い、選ばないこと。";
  const newText = `タイトル: ${input.title} / 主催者: ${input.organizer} / 開始: ${input.startDate
    .toISOString()
    .slice(0, 10)} / URL: ${input.website}`;
  return finalize(exacts, likelies, rule, newText, (m) => `${m.title}（${m.subtitle}） ${m.meta}`);
}

// ---- News ----

export interface NewsDupInput {
  title: string;
  company: string;
  amount?: string | null;
  sourceUrl?: string | null;
  publishedAt?: Date | null;
}

export async function findNewsDuplicates(input: NewsDupInput): Promise<DuplicateMatch[]> {
  const rows = await prisma.news.findMany({
    where: {
      OR: [
        { company: { equals: input.company, mode: "insensitive" } },
        ...(input.sourceUrl ? [{ sourceUrl: { equals: input.sourceUrl } }] : []),
      ],
    },
    select: {
      id: true,
      title: true,
      company: true,
      amount: true,
      sourceUrl: true,
      publishedAt: true,
    },
    take: 200,
  });

  const exacts: DuplicateMatch[] = [];
  const likelies: { match: DuplicateMatch; sim: number }[] = [];

  const WINDOW_DAYS = 120; // これより離れた掲載日は別ラウンドとみなす
  const inDate = input.publishedAt ?? null;

  for (const r of rows) {
    const toMatch = (strength: DuplicateMatch["strength"], reason: string): DuplicateMatch => ({
      id: r.id,
      title: r.title,
      subtitle: r.company,
      meta: [r.amount, r.publishedAt ? r.publishedAt.toISOString().slice(0, 10) : "", r.sourceUrl]
        .filter(Boolean)
        .join(" / "),
      strength,
      reason,
    });

    // 同一ソースURLは事故確定
    if (input.sourceUrl && normUrl(r.sourceUrl) === normUrl(input.sourceUrl) && normUrl(input.sourceUrl)) {
      exacts.push(toMatch("exact", "同じソースURL"));
      continue;
    }

    const companyEqual = key(r.company) === key(input.company);
    if (!companyEqual && similarity(r.company, input.company) < 0.7) continue; // 会社が違えば対象外

    // 掲載時期が離れていれば別ラウンドとして許可
    const closeInTime =
      !inDate || !r.publishedAt ? true : daysBetween(inDate, r.publishedAt) <= WINDOW_DAYS;
    if (!closeInTime) continue;

    const amountEqual =
      !!input.amount && !!r.amount && key(r.amount) === key(input.amount);

    if (companyEqual && amountEqual) {
      exacts.push(toMatch("exact", "会社・調達額・時期が一致"));
      continue;
    }
    const titleSim = similarity(r.title, input.title);
    if (companyEqual && titleSim >= TITLE_SIM_THRESHOLD) {
      likelies.push({ match: toMatch("likely", "会社が一致しタイトルが類似（近い時期）"), sim: titleSim });
    }
  }

  const rule =
    "対象は資金調達等のNews。同じ会社でも、調達額や掲載時期が異なれば別ラウンド（別News）として扱い、選ばないこと。会社・時期・金額・内容が実質同じもののみ同一とみなす。";
  const newText = `タイトル: ${input.title} / 会社: ${input.company} / 金額: ${input.amount ?? "不明"} / 掲載: ${
    inDate ? inDate.toISOString().slice(0, 10) : "不明"
  }`;
  return finalize(exacts, likelies, rule, newText, (m) => `${m.title}（${m.subtitle}） ${m.meta}`);
}

// ---- 施設（Workspace） ----

export interface WorkspaceDupInput {
  name: string;
  city: string;
  address?: string | null;
  officialLink?: string | null;
}

export async function findWorkspaceDuplicates(
  input: WorkspaceDupInput
): Promise<DuplicateMatch[]> {
  const rows = await prisma.workspace.findMany({
    where: {
      OR: [
        { city: { equals: input.city, mode: "insensitive" } },
        ...(input.officialLink ? [{ officialLink: { equals: input.officialLink } }] : []),
      ],
    },
    select: { id: true, name: true, city: true, address: true, officialLink: true },
    take: 300,
  });

  const exacts: DuplicateMatch[] = [];
  const likelies: { match: DuplicateMatch; sim: number }[] = [];

  for (const r of rows) {
    const toMatch = (strength: DuplicateMatch["strength"], reason: string): DuplicateMatch => ({
      id: r.id,
      title: r.name,
      subtitle: [r.city, r.address].filter(Boolean).join(" "),
      meta: r.officialLink ?? "",
      strength,
      reason,
    });

    const linkEqual =
      !!input.officialLink && normUrl(r.officialLink) === normUrl(input.officialLink) && normUrl(input.officialLink);
    const nameEqual = key(r.name) === key(input.name);
    const cityEqual = key(r.city) === key(input.city);

    if (linkEqual || (nameEqual && cityEqual)) {
      exacts.push(toMatch("exact", linkEqual ? "同じ公式リンク" : "同じ都市の同名施設"));
      continue;
    }
    const nameSim = similarity(r.name, input.name);
    if (nameSim >= TITLE_SIM_THRESHOLD && cityEqual) {
      likelies.push({ match: toMatch("likely", "同じ都市で施設名が類似"), sim: nameSim });
    }
  }

  const rule =
    "対象はコワーキング/施設。同じ施設名でも別都市なら別物。名称・所在地が実質同じものだけ同一とみなす。";
  const newText = `施設名: ${input.name} / 都市: ${input.city} / 住所: ${input.address ?? ""} / 公式: ${
    input.officialLink ?? ""
  }`;
  return finalize(exacts, likelies, rule, newText, (m) => `${m.title}（${m.subtitle}） ${m.meta}`);
}

/** 呼び出し側で 409 レスポンスに載せる共通メッセージ */
export function duplicateMessage(count: number): string {
  return `似た既存データが${count}件あります。内容を確認し、重複でなければ「それでも保存」を押してください。`;
}
