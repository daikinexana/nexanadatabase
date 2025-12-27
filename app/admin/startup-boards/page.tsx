"use client";

import { useState, useEffect } from "react";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import AdminGuard from "@/components/admin/admin-guard";
import AdminNav from "@/components/ui/admin-nav";
import { Plus, Edit, Trash2, Save, X } from "lucide-react";
import ImageUpload from "@/components/ui/image-upload";

interface StartupBoard {
  id: string;
  companyLogoUrl?: string;
  companyProductImageUrl?: string;
  companyName: string;
  companyDescriptionOneLine?: string;
  companyAndProduct?: string;
  companyOverview?: string;
  corporateNumber?: string;
  establishedDate?: string;
  employeeCount?: string;
  companyUrl?: string;
  country: string;
  city: string;
  address?: string;
  listingStatus?: string;
  contact1Department?: string;
  contact1Name?: string;
  contact1Email?: string;
  contact2Department?: string;
  contact2Name?: string;
  contact2Email?: string;
  contact3Department?: string;
  contact3Name?: string;
  contact3Email?: string;
  fundingStatus?: string;
  fundingOverview?: string;
  hiringStatus?: string;
  hiringOverview?: string;
  proposalStatus?: string;
  proposalOverview?: string;
  collaborationStatus?: string;
  collaborationOverview?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Location {
  id: string;
  country: string;
  city: string;
}

export default function AdminStartupBoardsPage() {
  const [startupBoards, setStartupBoards] = useState<StartupBoard[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [formData, setFormData] = useState<Partial<StartupBoard>>({
    companyName: "",
    country: "日本",
    city: "",
    isActive: true,
  });

  useEffect(() => {
    fetchStartupBoards();
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch("/api/location", {
        cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        setLocations(data);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const fetchStartupBoards = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/startup-boards?admin=true", {
        cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        setStartupBoards(data);
      }
    } catch (error) {
      console.error("Error fetching startup boards:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({
      companyName: "",
      country: "日本",
      city: "",
      isActive: true,
    });
  };

  const handleEdit = (board: StartupBoard) => {
    setEditingId(board.id);
    setIsCreating(false);
    setFormData({
      ...board,
      establishedDate: board.establishedDate ? board.establishedDate.split('T')[0] : undefined,
    });
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({
      companyName: "",
      country: "日本",
      city: "",
      isActive: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = isCreating
        ? "/api/startup-boards"
        : `/api/startup-boards/${editingId}`;
      const method = isCreating ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchStartupBoards();
        handleCancel();
      } else {
        const error = await response.json();
        alert(error.error || "エラーが発生しました");
      }
    } catch (error) {
      console.error("Error submitting startup board:", error);
      alert("エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("本当に削除しますか？")) {
      return;
    }

    try {
      const response = await fetch(`/api/startup-boards/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchStartupBoards();
      } else {
        const error = await response.json();
        alert(error.error || "削除に失敗しました");
      }
    } catch (error) {
      console.error("Error deleting startup board:", error);
      alert("削除に失敗しました");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <AdminNav />
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">読み込み中...</div>
          </div>
          <Footer />
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <AdminNav />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">スタートアップボード管理</h1>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              新規作成
            </button>
          </div>

          {/* 作成/編集フォーム */}
          {(isCreating || editingId) && (
            <div className="mb-8 bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">
                {isCreating ? "新規作成" : "編集"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 基本情報 */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">基本情報</h3>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      企業名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName || ""}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      企業説明一言
                    </label>
                    <input
                      type="text"
                      name="companyDescriptionOneLine"
                      value={formData.companyDescriptionOneLine || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      企業と製品サービス
                    </label>
                    <textarea
                      name="companyAndProduct"
                      value={formData.companyAndProduct || ""}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      主な特徴など概要
                    </label>
                    <textarea
                      name="companyOverview"
                      value={formData.companyOverview || ""}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      法人番号
                    </label>
                    <input
                      type="text"
                      name="corporateNumber"
                      value={formData.corporateNumber || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      従業員数
                    </label>
                    <input
                      type="text"
                      name="employeeCount"
                      value={formData.employeeCount || ""}
                      onChange={handleInputChange}
                      placeholder="例: 10-50名"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      企業URL
                    </label>
                    <input
                      type="url"
                      name="companyUrl"
                      value={formData.companyUrl || ""}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      設立日
                    </label>
                    <input
                      type="date"
                      name="establishedDate"
                      value={formData.establishedDate || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      国 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country || ""}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      都道府県 <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="city"
                      value={formData.city || ""}
                      onChange={(e) => {
                        const selectedCity = e.target.value;
                        const selectedLocation = locations.find(loc => loc.city === selectedCity);
                        setFormData({
                          ...formData,
                          city: selectedCity,
                          country: selectedLocation?.country || formData.country || "日本",
                        });
                      }}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">選択してください</option>
                      {Array.from(new Set(locations.map(loc => loc.city)))
                        .sort((a, b) => a.localeCompare(b, 'ja'))
                        .map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      住所
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      上場区分
                    </label>
                    <select
                      name="listingStatus"
                      value={formData.listingStatus || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">選択してください</option>
                      <option value="上場">上場</option>
                      <option value="未上場">未上場</option>
                    </select>
                  </div>

                  {/* 画像アップロード */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      企業ロゴ画像
                    </label>
                    <ImageUpload
                      value={formData.companyLogoUrl || ""}
                      onChange={(url) => setFormData({ ...formData, companyLogoUrl: url })}
                      type="startup-boards"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      企業製品サービス画像
                    </label>
                    <ImageUpload
                      value={formData.companyProductImageUrl || ""}
                      onChange={(url) => setFormData({ ...formData, companyProductImageUrl: url })}
                      type="startup-boards"
                    />
                  </div>

                  {/* 担当者情報（表示不要だが保存） */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">担当者情報（表示不要）</h3>
                  </div>

                  {[1, 2, 3].map((num) => (
                    <div key={num} className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          担当者{num} 部署
                        </label>
                        <input
                          type="text"
                          name={`contact${num}Department`}
                          value={formData[`contact${num}Department` as keyof typeof formData] as string || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          担当者{num} 名前
                        </label>
                        <input
                          type="text"
                          name={`contact${num}Name`}
                          value={formData[`contact${num}Name` as keyof typeof formData] as string || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          担当者{num} メールアドレス
                        </label>
                        <input
                          type="email"
                          name={`contact${num}Email`}
                          value={formData[`contact${num}Email` as keyof typeof formData] as string || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  ))}

                  {/* 募集情報 */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">募集情報</h3>
                  </div>

                  {/* 調達/M&A */}
                  <div className="md:col-span-2 border-t pt-4">
                    <h4 className="font-semibold mb-3">調達/M&A</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ステータス
                        </label>
                        <select
                          name="fundingStatus"
                          value={formData.fundingStatus || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">選択してください</option>
                          <option value="調達募集中">調達募集中</option>
                          <option value="M&A募集中">M&A募集中</option>
                          <option value="なし">なし</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        概要
                      </label>
                      <textarea
                        name="fundingOverview"
                        value={formData.fundingOverview || ""}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* 採用 */}
                  <div className="md:col-span-2 border-t pt-4">
                    <h4 className="font-semibold mb-3">採用</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ステータス
                        </label>
                        <select
                          name="hiringStatus"
                          value={formData.hiringStatus || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">選択してください</option>
                          <option value="募集中">募集中</option>
                          <option value="なし">なし</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        概要
                      </label>
                      <textarea
                        name="hiringOverview"
                        value={formData.hiringOverview || ""}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* 提案 */}
                  <div className="md:col-span-2 border-t pt-4">
                    <h4 className="font-semibold mb-3">提案</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ステータス
                        </label>
                        <select
                          name="proposalStatus"
                          value={formData.proposalStatus || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">選択してください</option>
                          <option value="募集中">募集中</option>
                          <option value="なし">なし</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        提案して欲しい内容概要
                      </label>
                      <textarea
                        name="proposalOverview"
                        value={formData.proposalOverview || ""}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* 共創 */}
                  <div className="md:col-span-2 border-t pt-4">
                    <h4 className="font-semibold mb-3">共創</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ステータス
                        </label>
                        <select
                          name="collaborationStatus"
                          value={formData.collaborationStatus || ""}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">選択してください</option>
                          <option value="募集中">募集中</option>
                          <option value="なし">なし</option>
                        </select>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        共創概要（例：企業のアセット情報など）
                      </label>
                      <textarea
                        name="collaborationOverview"
                        value={formData.collaborationOverview || ""}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* 公開設定 */}
                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isActive ?? true}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">公開する</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {isSubmitting ? "保存中..." : "保存"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 一覧 */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    企業名
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    所在地
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    募集状況
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    公開
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {startupBoards.map((board) => (
                  <tr key={board.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {board.companyName}
                      </div>
                      {board.companyDescriptionOneLine && (
                        <div className="text-sm text-gray-500">
                          {board.companyDescriptionOneLine}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {board.city}, {board.country}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {board.fundingStatus && board.fundingStatus !== "なし" && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                            調達
                          </span>
                        )}
                        {board.hiringStatus === "募集中" && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                            採用
                          </span>
                        )}
                        {board.proposalStatus === "募集中" && (
                          <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                            提案
                          </span>
                        )}
                        {board.collaborationStatus === "募集中" && (
                          <span className="px-2 py-1 text-xs bg-pink-100 text-pink-800 rounded">
                            共創
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          board.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {board.isActive ? "公開" : "非公開"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(board)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(board.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Footer />
      </div>
    </AdminGuard>
  );
}


