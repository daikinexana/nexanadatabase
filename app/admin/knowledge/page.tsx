"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import AdminGuard from "@/components/admin/admin-guard";
import { Plus, Edit, Trash2, Save, X, Eye, EyeOff } from "lucide-react";

interface Knowledge {
  id: string;
  title: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  category: string;
  author: string;
  publishedAt?: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminKnowledgePage() {
  const router = useRouter();
  const [knowledge, setKnowledge] = useState<Knowledge[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingKnowledge, setEditingKnowledge] = useState<Knowledge | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Knowledge>>({
    title: "",
    description: "",
    content: "# ナレッジタイトル\n\nここに詳細な内容をMarkdown形式で記述してください。",
    imageUrl: "",
    category: "AI",
    author: "",
    publishedAt: "",
    tags: [],
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');

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
      content: "# ナレッジタイトル\n\nここに詳細な内容をMarkdown形式で記述してください。",
      imageUrl: "",
      category: "AI",
      author: "",
      publishedAt: "",
      tags: [],
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
      content: knowledgeItem.content || "",
      imageUrl: knowledgeItem.imageUrl || "",
      author: knowledgeItem.author || "",
      publishedAt: knowledgeItem.publishedAt ? knowledgeItem.publishedAt.split('T')[0] : "",
      tags: knowledgeItem.tags || [],
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
          content: "# ナレッジタイトル\n\nここに詳細な内容をMarkdown形式で記述してください。",
          imageUrl: "",
          category: "AI",
          author: "",
          publishedAt: "",
          tags: [],
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
      content: "# ナレッジタイトル\n\nここに詳細な内容をMarkdown形式で記述してください。",
      imageUrl: "",
      category: "AI",
      author: "",
      publishedAt: "",
      tags: [],
      isActive: true,
    });
  };

  const handleTagChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData({ ...formData, tags });
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
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

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
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

                  {/* 著者 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      著者 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.author || ""}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="著者名を入力してください"
                    />
                  </div>

                  {/* カテゴリ */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      カテゴリ <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category || "AI"}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="AI">AI</option>
                      <option value="DEEPTECH">ディープテック</option>
                      <option value="BIOTECH">バイオテック</option>
                      <option value="FINTECH">フィンテック</option>
                      <option value="HEALTHTECH">ヘルステック</option>
                      <option value="EDTECH">エドテック</option>
                      <option value="CLIMATETECH">クライメートテック</option>
                      <option value="SPACETECH">スペーステック</option>
                      <option value="QUANTUM">量子技術</option>
                      <option value="BLOCKCHAIN">ブロックチェーン</option>
                      <option value="OTHER">その他</option>
                    </select>
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

                {/* 詳細内容 */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    詳細内容（Markdown） <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.content || ""}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ナレッジの詳細な内容をMarkdown形式で入力してください"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    タグ（カンマ区切り）
                  </label>
                  <input
                    type="text"
                    value={formData.tags?.join(', ') || ""}
                    onChange={(e) => handleTagChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="タグをカンマ区切りで入力してください"
                  />
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
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">読み込み中...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        タイトル
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        著者
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        カテゴリ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        公開日
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ステータス
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {knowledge.map((knowledgeItem) => (
                      <tr key={knowledgeItem.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {knowledgeItem.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{knowledgeItem.author}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                            {knowledgeItem.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {knowledgeItem.publishedAt ? new Date(knowledgeItem.publishedAt).toLocaleDateString("ja-JP") : "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            knowledgeItem.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {knowledgeItem.isActive ? "公開中" : "非公開"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => toggleActive(knowledgeItem.id, knowledgeItem.isActive)}
                              className={`${
                                knowledgeItem.isActive 
                                  ? "text-green-600 hover:text-green-900" 
                                  : "text-gray-400 hover:text-gray-600"
                              }`}
                              title={knowledgeItem.isActive ? "非公開にする" : "公開する"}
                            >
                              {knowledgeItem.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => handleEdit(knowledgeItem)}
                              className="text-blue-600 hover:text-blue-900"
                              title="編集"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(knowledgeItem.id)}
                              className="text-red-600 hover:text-red-900"
                              title="削除"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </AdminGuard>
  );
}
