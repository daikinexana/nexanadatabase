"use client";

import { Plus, Trash2 } from "lucide-react";
import ImageUpload from "@/components/ui/image-upload";
import {
  type InfoCard,
  type InfoCardCategory,
  INFO_CARD_CATEGORIES,
  emptyInfoCard,
} from "@/lib/workspace-info-cards";

interface Props {
  value: InfoCard[];
  onChange: (cards: InfoCard[]) => void;
}

/**
 * 施設情報・周辺情報カードの可変リスト編集UI。
 * カテゴリを選び、写真・タイトル・概要を入力。「カードを追加」でいくつでも増やせる。
 */
export default function WorkspaceInfoCardsEditor({ value, onChange }: Props) {
  const cards = Array.isArray(value) ? value : [];

  const update = (index: number, patch: Partial<InfoCard>) => {
    onChange(cards.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  };

  const add = () => {
    onChange([...cards, emptyInfoCard()]);
  };

  const remove = (index: number) => {
    onChange(cards.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {cards.length === 0 && (
        <p className="text-sm text-gray-400">
          まだカードがありません。「カードを追加」から施設情報や周辺情報を登録できます。
        </p>
      )}

      {cards.map((card, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-4 bg-gray-50/60 space-y-3"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1">
                カテゴリ
              </label>
              <select
                value={card.category}
                onChange={(e) =>
                  update(index, { category: e.target.value as InfoCardCategory })
                }
                className="w-full sm:w-56 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
              >
                {INFO_CARD_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => remove(index)}
              className="mt-5 inline-flex items-center gap-1 text-red-500 hover:text-red-700 text-sm"
              title="このカードを削除"
            >
              <Trash2 className="w-4 h-4" />
              削除
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              写真
            </label>
            <ImageUpload
              value={card.imageUrl}
              onChange={(imageUrl) => update(index, { imageUrl })}
              type="workspaces"
              className="w-full"
            />
            <input
              type="url"
              value={card.imageUrl}
              onChange={(e) => update(index, { imageUrl: e.target.value })}
              placeholder="またはURLを直接入力: https://example.com/image.jpg"
              className="mt-2 w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              タイトル
            </label>
            <input
              type="text"
              value={card.title}
              onChange={(e) => update(index, { title: e.target.value })}
              placeholder="例: コワーキングエリア / 〇〇ホテル"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">
              概要
            </label>
            <textarea
              value={card.description}
              onChange={(e) => update(index, { description: e.target.value })}
              rows={3}
              placeholder="内容の説明を入力"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-2 px-4 py-2 border border-dashed border-gray-400 text-gray-600 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors text-sm"
      >
        <Plus className="w-4 h-4" />
        カードを追加
      </button>
    </div>
  );
}
