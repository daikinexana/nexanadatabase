"use client";

import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import AdminGuard from "@/components/admin/admin-guard";
import AdminNav from "@/components/ui/admin-nav";
import { Plus, Edit, Trash2, Save } from "lucide-react";
import SimpleImage from "@/components/ui/simple-image";

interface News {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  type: string;
  company: string;
  sector?: string;
  amount?: string;
  investors: string[];
  publishedAt?: string;
  sourceUrl?: string;
  area?: string;
  isActive: boolean;
  isChecked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminNewsPage() {
  // const router = useRouter();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<News>>({
    title: "",
    description: "",
    imageUrl: "",
    type: "FUNDING",
    company: "",
    sector: "",
    amount: "",
    investors: [],
    publishedAt: "",
    sourceUrl: "",
    area: "",
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [investorInput, setInvestorInput] = useState('');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/news");
      if (response.ok) {
        const data = await response.json();
        setNews(data);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingNews(null);
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      type: "FUNDING",
      company: "",
      sector: "",
      amount: "",
      investors: [],
      publishedAt: "",
      sourceUrl: "",
      area: "",
      isActive: true,
    });
  };

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem);
    setIsCreating(false);
    setFormData({
      ...newsItem,
      publishedAt: newsItem.publishedAt ? newsItem.publishedAt.split('T')[0] : "",
      area: newsItem.area || "",
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("本当に削除しますか？")) {
      try {
        const response = await fetch(`/api/news/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          await fetchNews();
        }
      } catch (error) {
        console.error("Error deleting news:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = isCreating ? "/api/news" : `/api/news/${editingNews?.id}`;
      const method = isCreating ? "POST" : "PUT";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newNews = await response.json();
        if (isCreating) {
          setNews([newNews, ...news]);
        } else {
          await fetchNews();
        }
        setEditingNews(null);
        setIsCreating(false);
        setFormData({
          title: "",
          description: "",
          imageUrl: "",
          type: "FUNDING",
          company: "",
          sector: "",
          amount: "",
          investors: [],
          publishedAt: "",
          sourceUrl: "",
          isActive: true,
        });
        alert(isCreating ? 'ニュースが正常に追加されました' : 'ニュースが正常に更新されました');
      } else {
        const error = await response.json();
        alert(`エラー: ${error.error || 'ニュースの保存に失敗しました'}`);
      }
    } catch (error) {
      console.error("Error saving news:", error);
      alert('ニュースの保存に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditingNews(null);
    setIsCreating(false);
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      type: "FUNDING",
      company: "",
      sector: "",
      amount: "",
      investors: [],
      publishedAt: "",
      sourceUrl: "",
      area: "",
      isActive: true,
    });
  };

  const handleInvestorChange = (value: string) => {
    const investors = value.split(',').map(investor => investor.trim()).filter(investor => investor);
    setFormData({ ...formData, investors });
  };

  // const handleInvestorAdd = () => {
  //   if (investorInput.trim() && !formData.investors?.includes(investorInput.trim())) {
  //     setFormData(prev => ({
  //       ...prev,
  //       investors: [...(prev.investors || []), investorInput.trim()]
  //     }));
  //     setInvestorInput('');
  //   }
  // };

  // const handleInvestorRemove = (investorToRemove: string) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     investors: prev.investors?.filter(investor => investor !== investorToRemove) || []
  //   }));
  // };

  // const toggleActive = async (id: string, currentStatus: boolean) => {
  //   try {
  //     const response = await fetch(`/api/news/${id}`, {
  //       method: 'PATCH',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ isActive: !currentStatus }),
  //     });

  //     if (response.ok) {
  //       setNews(news.map(newsItem => 
  //         newsItem.id === id 
  //           ? { ...newsItem, isActive: !currentStatus }
  //           : newsItem
  //       ));
  //     }
  //   } catch (error) {
  //     console.error('ステータスの更新に失敗しました:', error);
  //   }
  // };

  // const toggleChecked = (id: string) => {
  //   setNews(news.map(newsItem => 
  //     newsItem.id === id 
  //       ? { ...newsItem, isChecked: !newsItem.isChecked }
  //       : newsItem
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">ニュース管理</h1>
                <p className="text-gray-600">投資、M&A、IPO、パートナーシップなどのニュース情報の管理と編集を行います</p>
              </div>
              <button
                onClick={handleCreate}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                新しいニュースを追加
              </button>
            </div>
          </div>

          {/* ニュース追加フォーム */}
          {(isCreating || editingNews) && (
            <div className="mb-8 bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {isCreating ? "新しいニュースを追加" : "ニュースを編集"}
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
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="ニュースのタイトルを入力してください"
                    />
                  </div>

                  {/* 企業名 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      企業名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="企業名を入力してください"
                    />
                  </div>

                  {/* タイプ */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      タイプ <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="FUNDING">投資</option>
                      <option value="M_AND_A">M&A</option>
                      <option value="IPO">IPO</option>
                      <option value="PARTNERSHIP">パートナーシップ</option>
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
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="ニュースの説明を入力してください"
                  />
                </div>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      領域
                    </label>
                    <input
                      type="text"
                      value={formData.sector}
                      onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ヘルステック、AI・機械学習など"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      金額
                    </label>
                    <input
                      type="text"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="3億円、26億円など"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      エリア
                    </label>
                    <input
                      type="text"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="東京、大阪、オンラインなど"
                    />
                  </div>
                </div>

                {/* 公開日 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    公開日
                  </label>
                  <input
                    type="date"
                    value={formData.publishedAt}
                    onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    投資家（カンマ区切り）
                  </label>
                  <input
                    type="text"
                    value={formData.investors?.join(', ')}
                    onChange={(e) => handleInvestorChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 画像URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    画像URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* ソースURL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ソースURL
                  </label>
                  <input
                    type="url"
                    value={formData.sourceUrl}
                    onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/news-article"
                  />
                </div>


                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
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
                        {isCreating ? 'ニュースを追加' : 'ニュースを更新'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ニュース一覧 */}
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
                        企業
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        タイプ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        エリア
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        金額
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
                    {news.map((newsItem) => (
                      <tr key={newsItem.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {/* 画像 */}
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                              {newsItem.imageUrl ? (
                                <SimpleImage
                                  src={newsItem.imageUrl.trim()}
                                  alt={newsItem.title}
                                  width={48}
                                  height={48}
                                  className="w-12 h-12 object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-100 flex items-center justify-center">
                                  <div className="w-6 h-6 bg-gray-300 rounded"></div>
                                </div>
                              )}
                            </div>
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              {newsItem.title}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{newsItem.company}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {newsItem.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{newsItem.area || "-"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{newsItem.amount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            newsItem.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {newsItem.isActive ? "公開中" : "非公開"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(newsItem)}
                              className="text-blue-600 hover:text-blue-900"
                              title="編集"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(newsItem.id)}
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
