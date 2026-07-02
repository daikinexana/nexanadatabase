/**
 * ワークスペースの「施設情報・周辺情報」カード（可変リスト）の共通定義。
 * カテゴリを選んで写真・タイトル・概要を入力し、いくつでも追加できる。
 * DBには Workspace.infoCards (Json) として配列で保存する。
 */

export type InfoCardCategory = "facility" | "hotel" | "food" | "spot";

export interface InfoCard {
  category: InfoCardCategory;
  imageUrl: string;
  title: string;
  description: string;
}

export const INFO_CARD_CATEGORIES: { value: InfoCardCategory; label: string }[] = [
  { value: "facility", label: "施設情報" },
  { value: "hotel", label: "周辺ホテル" },
  { value: "food", label: "周辺Food" },
  { value: "spot", label: "周辺スポット" },
];

const VALID_CATEGORIES = new Set<string>(["facility", "hotel", "food", "spot"]);

export function infoCardCategoryLabel(category: string): string {
  return INFO_CARD_CATEGORIES.find((c) => c.value === category)?.label ?? category;
}

export function emptyInfoCard(category: InfoCardCategory = "facility"): InfoCard {
  return { category, imageUrl: "", title: "", description: "" };
}

/**
 * 任意の値（DBのJson・APIボディ等）を安全に InfoCard[] へ正規化する。
 * 中身が空（写真・タイトル・概要すべて空）のカードは除外する。
 */
export function normalizeInfoCards(value: unknown): InfoCard[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((v): v is Record<string, unknown> => !!v && typeof v === "object")
    .map((v) => {
      const category = VALID_CATEGORIES.has(String(v.category))
        ? (String(v.category) as InfoCardCategory)
        : "facility";
      return {
        category,
        imageUrl: typeof v.imageUrl === "string" ? v.imageUrl : "",
        title: typeof v.title === "string" ? v.title : "",
        description: typeof v.description === "string" ? v.description : "",
      };
    })
    .filter((c) => c.title.trim() || c.description.trim() || c.imageUrl.trim());
}
