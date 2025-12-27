"use client";

import { useState } from "react";
import Modal from "./modal";
import { Loader2, Info } from "lucide-react";

interface OpenCallOrganizerFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OpenCallOrganizerForm({
  isOpen,
  onClose,
}: OpenCallOrganizerFormProps) {
  const [formData, setFormData] = useState({
    companyName: "",
    name: "",
    email: "",
    openCallUrl: "",
    action: "",
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact/open-call-organizer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("お問い合わせありがとうございます。内容を確認次第、ご連絡いたします。");
        setFormData({
          companyName: "",
          name: "",
          email: "",
          openCallUrl: "",
          action: "",
          comment: "",
        });
        onClose();
      } else {
        const error = await response.json();
        alert(`エラー: ${error.error || "送信に失敗しました"}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("送信に失敗しました。しばらく時間をおいて再度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="公募を主催される方へ">
      <div className="p-4 sm:p-6">
        {/* 掲載基準に関する説明 */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <Info className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                掲載について
              </h3>
              <p className="text-sm text-blue-800 leading-relaxed">
                ご送信いただいた公募情報につきましては、当社の掲載基準に基づき審査を行わせていただきます。
                すべての公募が掲載可能というわけではございませんが、基準を満たす公募については、
                データベースへの追加を検討させていただきます。審査結果につきましては、内容を確認の上、
                ご連絡先にメールにてご返信いたします。ご理解のほど、よろしくお願いいたします。
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 会社名 */}
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              会社名
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="株式会社○○"
            />
          </div>

          {/* お名前 */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              お名前 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="山田 太郎"
            />
          </div>

          {/* メールアドレス */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="example@example.com"
            />
          </div>

          {/* 対象の公募URL */}
          <div>
            <label
              htmlFor="openCallUrl"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              対象の公募URL
            </label>
            <input
              type="url"
              id="openCallUrl"
              name="openCallUrl"
              value={formData.openCallUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://example.com/open-call"
            />
          </div>

          {/* 希望するアクション */}
          <div>
            <label
              htmlFor="action"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              希望するアクション <span className="text-red-500">*</span>
            </label>
            <select
              id="action"
              name="action"
              value={formData.action}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">選択してください</option>
              <option value="add">Databaseに無料で追加する</option>
              <option value="remove">Databaseから削除を希望する</option>
              <option value="other">その他</option>
            </select>
          </div>

          {/* コメント */}
          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              コメント
            </label>
            <textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="ご質問やご要望がございましたら、こちらにご記入ください"
            />
          </div>

          {/* 送信ボタン */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              キャンセル
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              送信
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}




