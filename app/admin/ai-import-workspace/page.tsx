"use client";

import { useState } from "react";
import Link from "next/link";
import AdminGuard from "@/components/admin/admin-guard";
import ImageUpload from "@/components/ui/image-upload";
import WorkspaceInfoCardsEditor from "@/components/ui/workspace-info-cards-editor";
import { type InfoCard, normalizeInfoCards } from "@/lib/workspace-info-cards";
import { deriveCountryCity } from "@/lib/derive-location";
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Trash2,
  ImageIcon,
} from "lucide-react";

interface Draft {
  name: string;
  description: string;
  address: string;
  area: string;
  officialLink: string;
  businessHours: string;
  priceTable: string;
  operator: string;
  management: string;
  facilityFeatureOneLine: string;
  imageUrl: string;
  hasDropin: boolean;
  hasMeetingRoom: boolean;
  hasPhoneBooth: boolean;
  hasWifi: boolean;
  hasParking: boolean;
  categoryWork: boolean;
  categoryConnect: boolean;
  categoryPrototype: boolean;
  categoryPilot: boolean;
  categoryTest: boolean;
  categorySupport: boolean;
  categoryShowcase: boolean;
  categoryLearn: boolean;
  categoryStay: boolean;
  // 施設情報・周辺情報カード（作成フォームと同じ・写真＋タイトル＋概要）
  infoCards: InfoCard[];
}

interface Item {
  sourceUrl: string;
  draft: Draft | null; // 抽出失敗時はnull
  extractError?: string;
  saving: boolean;
  savedId: string | null;
  saveError: string | null;
}

const EQUIPMENTS: { key: keyof Draft; label: string }[] = [
  { key: "hasDropin", label: "ドロップイン" },
  { key: "hasMeetingRoom", label: "会議室" },
  { key: "hasPhoneBooth", label: "フォンブース" },
  { key: "hasWifi", label: "WiFi" },
  { key: "hasParking", label: "駐車場" },
];

const CATEGORIES: { key: keyof Draft; label: string }[] = [
  { key: "categoryWork", label: "執務" },
  { key: "categoryConnect", label: "交流" },
  { key: "categoryPrototype", label: "試作" },
  { key: "categoryPilot", label: "実証" },
  { key: "categoryTest", label: "試験" },
  { key: "categorySupport", label: "支援" },
  { key: "categoryShowcase", label: "発表" },
  { key: "categoryLearn", label: "学ぶ" },
  { key: "categoryStay", label: "滞在" },
];

export default function AiImportWorkspacePage() {
  const [urlsText, setUrlsText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [topError, setTopError] = useState<string | null>(null);
  const [invalidUrls, setInvalidUrls] = useState<string[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [savingAll, setSavingAll] = useState(false);

  const parsedUrls = urlsText
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const updateDraft = (index: number, patch: Partial<Draft>) => {
    setItems((prev) =>
      prev.map((it, i) =>
        i === index && it.draft
          ? { ...it, draft: { ...it.draft, ...patch }, savedId: null, saveError: null }
          : i === index
          ? { ...it, savedId: null, saveError: null }
          : it
      )
    );
  };

  const handleAnalyze = async () => {
    if (parsedUrls.length === 0) return;
    setAnalyzing(true);
    setTopError(null);
    setInvalidUrls([]);
    setItems([]);
    try {
      const res = await fetch("/api/ai-import-workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: parsedUrls }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "解析に失敗しました");
      }
      setInvalidUrls(data.invalid ?? []);
      const nextItems: Item[] = (data.results ?? []).map(
        (r: {
          url: string;
          ok: boolean;
          data?: Draft;
          error?: string;
        }): Item => ({
          sourceUrl: r.url,
          // AIが拾えた施設情報カードは下書きとして入れ、写真等はプレビューで追加する。
          draft:
            r.ok && r.data
              ? { ...r.data, infoCards: normalizeInfoCards(r.data.infoCards) }
              : null,
          extractError: r.ok ? undefined : r.error,
          saving: false,
          savedId: null,
          saveError: null,
        })
      );
      setItems(nextItems);
    } catch (e) {
      setTopError(e instanceof Error ? e.message : "解析に失敗しました");
    } finally {
      setAnalyzing(false);
    }
  };

  const buildPayload = (draft: Draft) => {
    const { country, city } = deriveCountryCity(draft.address, draft.area);
    return {
      ...draft,
      country,
      city,
      locationId: null,
    };
  };

  const saveItem = async (index: number): Promise<boolean> => {
    const item = items[index];
    if (!item?.draft) return false;
    if (!item.draft.name.trim()) {
      setItems((prev) =>
        prev.map((it, i) =>
          i === index ? { ...it, saveError: "施設名は必須です" } : it
        )
      );
      return false;
    }

    setItems((prev) =>
      prev.map((it, i) =>
        i === index ? { ...it, saving: true, saveError: null } : it
      )
    );

    try {
      const res = await fetch("/api/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildPayload(item.draft)),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "保存に失敗しました");
      }
      setItems((prev) =>
        prev.map((it, i) =>
          i === index
            ? { ...it, saving: false, savedId: data.id ?? "ok", saveError: null }
            : it
        )
      );
      return true;
    } catch (e) {
      setItems((prev) =>
        prev.map((it, i) =>
          i === index
            ? {
                ...it,
                saving: false,
                saveError: e instanceof Error ? e.message : "保存に失敗しました",
              }
            : it
        )
      );
      return false;
    }
  };

  const saveAll = async () => {
    setSavingAll(true);
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (it.draft && !it.savedId) {
        // eslint-disable-next-line no-await-in-loop
        await saveItem(i);
      }
    }
    setSavingAll(false);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const successCount = items.filter((it) => it.savedId).length;
  const pendingCount = items.filter((it) => it.draft && !it.savedId).length;

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/admin/workspace"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            ワークスペース管理に戻る
          </Link>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                AIで施設をURL取込
              </h1>
            </div>
            <p className="text-gray-600 text-sm">
              施設ページのURLを貼り付けると、AIが内容を解析して登録用データを自動生成します（1行に1つ、複数可）。
              <br />
              テキストから確実に読み取れる項目のみを自動入力します。写真・施設カード・周辺情報などは、保存後に
              <Link href="/admin/workspace" className="underline">
                ワークスペース管理
              </Link>
              から手動で追加してください。
            </p>
          </div>

          {/* URL入力 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              取り込む施設ページのURL（1行に1つ・最大10件）
            </label>
            <textarea
              value={urlsText}
              onChange={(e) => setUrlsText(e.target.value)}
              rows={5}
              placeholder={"https://example.com/facility-a\nhttps://example.com/facility-b"}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-900 font-mono"
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-xs text-gray-500">
                {parsedUrls.length > 0 ? `${parsedUrls.length}件のURL` : "URL未入力"}
              </span>
              <button
                onClick={handleAnalyze}
                disabled={analyzing || parsedUrls.length === 0}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:from-indigo-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-[44px]"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    解析中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    AIで解析
                  </>
                )}
              </button>
            </div>
          </div>

          {topError && (
            <div className="mb-6 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{topError}</span>
            </div>
          )}

          {invalidUrls.length > 0 && (
            <div className="mb-6 flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <span>
                無効なURLをスキップしました: {invalidUrls.join(", ")}
              </span>
            </div>
          )}

          {/* 一括操作バー */}
          {items.length > 0 && (
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 bg-white rounded-lg border border-gray-200 px-4 py-3">
              <span className="text-sm text-gray-600">
                抽出 {items.length}件 / 保存済み {successCount}件 / 未保存 {pendingCount}件
              </span>
              <button
                onClick={saveAll}
                disabled={savingAll || pendingCount === 0}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-all"
              >
                {savingAll ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    保存中...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    未保存をすべて保存（{pendingCount}）
                  </>
                )}
              </button>
            </div>
          )}

          {/* 抽出結果リスト */}
          <div className="space-y-5">
            {items.map((item, index) => (
              <div
                key={`${item.sourceUrl}-${index}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-indigo-600 underline break-all"
                  >
                    {item.sourceUrl}
                  </a>
                  <button
                    onClick={() => removeItem(index)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors shrink-0"
                    title="このカードを一覧から除く"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {!item.draft ? (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>解析に失敗しました: {item.extractError}</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* 施設写真（アップロード） */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <label className="block text-xs font-semibold text-gray-600">
                          施設写真
                        </label>
                        <a
                          href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(
                            item.draft.name
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          title="施設名でGoogle画像検索"
                          className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                        >
                          <ImageIcon className="w-3 h-3" />
                          画像検索
                        </a>
                      </div>
                      <ImageUpload
                        value={item.draft.imageUrl}
                        onChange={(imageUrl) => updateDraft(index, { imageUrl })}
                        type="workspaces"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="施設名 *">
                        <input
                          value={item.draft.name}
                          onChange={(e) => updateDraft(index, { name: e.target.value })}
                          className={inputCls}
                        />
                      </Field>
                      <Field label="施設特徴ひとこと">
                        <input
                          value={item.draft.facilityFeatureOneLine}
                          onChange={(e) =>
                            updateDraft(index, { facilityFeatureOneLine: e.target.value })
                          }
                          className={inputCls}
                        />
                      </Field>
                    </div>

                    <Field label="施設の説明">
                      <textarea
                        value={item.draft.description}
                        onChange={(e) => updateDraft(index, { description: e.target.value })}
                        rows={3}
                        className={inputCls}
                      />
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="住所（→ 国・都道府県を自動判定）">
                        <input
                          value={item.draft.address}
                          onChange={(e) => updateDraft(index, { address: e.target.value })}
                          className={inputCls}
                        />
                      </Field>
                      <Field label="エリア（住所で判定できない場合のみ）">
                        <input
                          value={item.draft.area}
                          onChange={(e) => updateDraft(index, { area: e.target.value })}
                          placeholder="例: シンガポール"
                          className={inputCls}
                        />
                      </Field>
                    </div>

                    <div className="text-xs text-gray-500">
                      判定エリア:{" "}
                      <span className="font-medium text-gray-700">
                        {(() => {
                          const { country, city } = deriveCountryCity(
                            item.draft.address,
                            item.draft.area
                          );
                          return `${country} / ${city}`;
                        })()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="営業時間">
                        <input
                          value={item.draft.businessHours}
                          onChange={(e) =>
                            updateDraft(index, { businessHours: e.target.value })
                          }
                          className={inputCls}
                        />
                      </Field>
                      <Field label="公式リンク">
                        <input
                          value={item.draft.officialLink}
                          onChange={(e) =>
                            updateDraft(index, { officialLink: e.target.value })
                          }
                          className={inputCls}
                        />
                      </Field>
                    </div>

                    <Field label="料金表">
                      <textarea
                        value={item.draft.priceTable}
                        onChange={(e) => updateDraft(index, { priceTable: e.target.value })}
                        rows={2}
                        className={inputCls}
                      />
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="主体">
                        <input
                          value={item.draft.operator}
                          onChange={(e) => updateDraft(index, { operator: e.target.value })}
                          className={inputCls}
                        />
                      </Field>
                      <Field label="運営">
                        <input
                          value={item.draft.management}
                          onChange={(e) =>
                            updateDraft(index, { management: e.target.value })
                          }
                          className={inputCls}
                        />
                      </Field>
                    </div>

                    <div>
                      <span className="block text-xs font-semibold text-gray-600 mb-2">
                        設備
                      </span>
                      <div className="flex flex-wrap gap-x-5 gap-y-2">
                        {EQUIPMENTS.map((eq) => (
                          <label key={eq.key} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={Boolean(item.draft?.[eq.key])}
                              onChange={(e) =>
                                updateDraft(index, { [eq.key]: e.target.checked } as Partial<Draft>)
                              }
                              className="h-4 w-4 text-blue-600"
                            />
                            <span className="text-gray-700">{eq.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="block text-xs font-semibold text-gray-600 mb-2">
                        カテゴリ
                      </span>
                      <div className="flex flex-wrap gap-x-5 gap-y-2">
                        {CATEGORIES.map((cat) => (
                          <label key={cat.key} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={Boolean(item.draft?.[cat.key])}
                              onChange={(e) =>
                                updateDraft(index, { [cat.key]: e.target.checked } as Partial<Draft>)
                              }
                              className="h-4 w-4 text-blue-600"
                            />
                            <span className="text-gray-700">{cat.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* 施設情報・周辺情報カード（作成フォームと同じ。AI未収集でもここで追加可能） */}
                    <div className="border-t pt-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        施設情報・周辺情報カード
                      </h3>
                      <p className="text-xs text-gray-500 mb-3">
                        カテゴリ（施設情報 / 周辺ホテル / 周辺Food / 周辺スポット）を選び、写真・タイトル・概要を登録。いくつでも追加できます。
                      </p>
                      <WorkspaceInfoCardsEditor
                        value={normalizeInfoCards(item.draft.infoCards)}
                        onChange={(infoCards) => updateDraft(index, { infoCards })}
                      />
                    </div>

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        onClick={() => saveItem(index)}
                        disabled={item.saving || Boolean(item.savedId)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-all"
                      >
                        {item.saving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            保存中...
                          </>
                        ) : item.savedId ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            保存済み
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            この施設を保存
                          </>
                        )}
                      </button>
                      {item.saveError && (
                        <span className="flex items-center gap-1 text-sm text-red-600">
                          <AlertCircle className="w-4 h-4" />
                          {item.saveError}
                        </span>
                      )}
                      {item.savedId && (
                        <Link
                          href="/admin/workspace"
                          className="text-sm text-emerald-700 underline"
                        >
                          管理画面で確認 →
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}

const inputCls =
  "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-900";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}
