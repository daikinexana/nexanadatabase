"use client";

import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import AdminGuard from "@/components/admin/admin-guard";
import AdminNav from "@/components/ui/admin-nav";
import { Plus, Edit, Trash2, Save, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

interface Knowledge {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  website?: string;
  categoryTag?: string;
  area?: string;
  publishedAt?: string;
  isActive: boolean;
  isChecked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminKnowledgePage() {
  // const router = useRouter();
  const [knowledge, setKnowledge] = useState<Knowledge[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKnowledge, setEditingKnowledge] = useState<Knowledge | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Knowledge>>({
    title: "",
    description: "",
    imageUrl: "",
    website: "",
    categoryTag: "",
    area: "",
    publishedAt: "",
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const fetchKnowledge = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/knowledge");
      if (response.ok) {
        const data = await response.json();
        setKnowledge(data);
      }
    } catch (error) {
      console.error("Error fetching knowledge:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingKnowledge(null);
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      website: "",
      categoryTag: "",
      area: "",
      publishedAt: "",
      isActive: true,
    });
  };

  const handleEdit = (knowledgeItem: Knowledge) => {
    setEditingKnowledge(knowledgeItem);
    setIsCreating(false);
      setFormData({
        ...knowledgeItem,
        title: knowledgeItem.title || "",
        description: knowledgeItem.description || "",
        imageUrl: knowledgeItem.imageUrl || "",
        website: knowledgeItem.website || "",
        categoryTag: knowledgeItem.categoryTag || "",
        area: knowledgeItem.area || "",
        publishedAt: knowledgeItem.publishedAt ? knowledgeItem.publishedAt.split('T')[0] : "",
      });
  };

  const handleDelete = async (id: string) => {
    if (confirm("本当に削除しますか？")) {
      try {
        const response = await fetch(`/api/knowledge/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          await fetchKnowledge();
        }
      } catch (error) {
        console.error("Error deleting knowledge:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = isCreating ? "/api/knowledge" : `/api/knowledge/${editingKnowledge?.id}`;
      const method = isCreating ? "POST" : "PUT";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newKnowledge = await response.json();
        if (isCreating) {
          setKnowledge([newKnowledge, ...knowledge]);
        } else {
          await fetchKnowledge();
        }
        setEditingKnowledge(null);
        setIsCreating(false);
        setFormData({
          title: "",
          description: "",
          imageUrl: "",
          website: "",
          categoryTag: "",
          publishedAt: "",
          isActive: true,
        });
        alert(isCreating ? 'ナレッジが正常に追加されました' : 'ナレッジが正常に更新されました');
      } else {
        const error = await response.json();
        alert(`エラー: ${error.error || 'ナレッジの保存に失敗しました'}`);
      }
    } catch (error) {
      console.error("Error saving knowledge:", error);
      alert('ナレッジの保存に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditingKnowledge(null);
    setIsCreating(false);
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      website: "",
      categoryTag: "",
      area: "",
      publishedAt: "",
      isActive: true,
    });
  };


  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/knowledge/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setKnowledge(knowledge.map(knowledgeItem => 
          knowledgeItem.id === id 
            ? { ...knowledgeItem, isActive: !currentStatus }
            : knowledgeItem
        ));
      }
    } catch (error) {
      console.error('ステータスの更新に失敗しました:', error);
    }
  };

  // const toggleChecked = (id: string) => {
  //   setKnowledge(knowledge.map(knowledgeItem => 
  //     knowledgeItem.id === id 
  //       ? { ...knowledgeItem, isChecked: !knowledgeItem.isChecked }
  //       : knowledgeItem
  //   ));
  // };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <AdminNav />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">ナレッジ管理</h1>
                <p className="text-gray-600">技術ナレッジ、研究レポート、業界分析などのナレッジ情報の管理と編集を行います</p>
              </div>
              <button
                onClick={handleCreate}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                新しいナレッジを追加
              </button>
            </div>
          </div>

          {/* ナレッジ追加フォーム */}
          {(isCreating || editingKnowledge) && (
            <div className="mb-8 bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {isCreating ? "新しいナレッジを追加" : "ナレッジを編集"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* タイトル */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      タイトル <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title || ""}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="ナレッジのタイトルを入力してください"
                    />
                  </div>

                  {/* ウェブサイト */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ウェブサイト
                    </label>
                    <input
                      type="url"
                      value={formData.website || ""}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com"
                    />
                  </div>

                  {/* カテゴリータグ */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      カテゴリータグ
                    </label>
                    <input
                      type="text"
                      value={formData.categoryTag || ""}
                      onChange={(e) => setFormData({ ...formData, categoryTag: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="AI, ディープテック, バイオテックなど"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* エリア */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      エリア
                    </label>
                    <input
                      type="text"
                      value={formData.area || ""}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="東京、大阪、オンラインなど"
                    />
                  </div>
                </div>

                {/* 説明 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    説明
                  </label>
                  <textarea
                    value={formData.description || ""}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ナレッジの説明を入力してください"
                  />
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      公開日
                    </label>
                    <input
                      type="date"
                      value={formData.publishedAt || ""}
                      onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      画像URL
                    </label>
                    <input
                      type="url"
                      value={formData.imageUrl || ""}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="画像のURLを入力してください"
                    />
                  </div>
                </div>


                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive || false}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    公開する
                  </label>
                </div>

                {/* ボタン */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {isCreating ? '追加中...' : '更新中...'}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        {isCreating ? 'ナレッジを追加' : 'ナレッジを更新'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ナレッジ一覧 */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">読み込み中...</p>
              </div>
            ) : knowledge.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                ナレッジ情報がありません
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {knowledge.map((knowledgeItem) => (
                  <div key={knowledgeItem.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 flex gap-4">
                        {/* 画像 */}
                        {knowledgeItem.imageUrl && (
                          <div className="flex-shrink-0">
                            <Image
                              src={knowledgeItem.imageUrl}
                              alt={knowledgeItem.title}
                              width={80}
                              height={80}
                              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        
                        {/* ナレッジ情報 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                              {knowledgeItem.title}
                            </h3>
                            <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${
                              knowledgeItem.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {knowledgeItem.isActive ? '公開中' : '非公開'}
                            </span>
                            {knowledgeItem.categoryTag && (
                              <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 flex-shrink-0">
                                {knowledgeItem.categoryTag}
                              </span>
                            )}
                          </div>
                          
                          {knowledgeItem.description && (
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                              {knowledgeItem.description}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            {knowledgeItem.area && (
                              <span>エリア: {knowledgeItem.area}</span>
                            )}
                            {knowledgeItem.publishedAt && (
                              <span>公開日: {new Date(knowledgeItem.publishedAt).toLocaleDateString("ja-JP")}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                        <button
                          onClick={() => toggleActive(knowledgeItem.id, knowledgeItem.isActive)}
                          className={`p-2 rounded-lg transition-colors ${
                            knowledgeItem.isActive
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={knowledgeItem.isActive ? '非公開にする' : '公開する'}
                        >
                          {knowledgeItem.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        
                        <button
                          onClick={() => handleEdit(knowledgeItem)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="編集"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(knowledgeItem.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="削除"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </AdminGuard>
  );
}
