"use client";

import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import AdminGuard from "@/components/admin/admin-guard";
import AdminNav from "@/components/ui/admin-nav";
import { Plus, Edit, Trash2, Save } from "lucide-react";
import SimpleImage from "@/components/ui/simple-image";
import ImageUpload from "@/components/ui/image-upload";

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
  const [editingId, setEditingId] = useState<string | null>(null);
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
  // ページネーション用の状態
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit] = useState(50); // 1ページあたりの件数
  // const [investorInput, setInvestorInput] = useState('');

  useEffect(() => {
    fetchNews();
  }, [currentPage]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/news?page=${currentPage}&limit=${limit}`);
      if (response.ok) {
        const result = await response.json();
        // APIは { data: [...], pagination: {...} } の形式で返す
        if (result.data && Array.isArray(result.data)) {
          setNews(result.data);
          setTotalPages(result.pagination?.totalPages || 1);
          setTotalCount(result.pagination?.totalCount || 0);
        } else if (Array.isArray(result)) {
          // 後方互換性: 直接配列が返される場合
          setNews(result);
          setTotalPages(1);
          setTotalCount(result.length);
        } else {
          setNews([]);
          setTotalPages(1);
          setTotalCount(0);
        }
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews([]);
      setTotalPages(1);
      setTotalCount(0);
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
    setEditingId(newsItem.id);
    setIsCreating(false);
    setFormData({
      ...newsItem,
      publishedAt: newsItem.publishedAt ? newsItem.publishedAt.split('T')[0] : "",
      area: newsItem.area || "",
      amount: newsItem.amount || "",
      sector: newsItem.sector || "",
      investors: newsItem.investors || [],
      sourceUrl: newsItem.sourceUrl || "",
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
        setEditingId(null);
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
    setEditingId(null);
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

  // ページネーション用のハンドラー
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
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

          {/* ニュース追加フォーム - 新規作成時のみ表示 */}
          {isCreating && (
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
                      value={formData.title || ""}
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
                      value={formData.company || ""}
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
                      value={formData.type || "FUNDING"}
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
                    value={formData.description || ""}
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
                      value={formData.sector || ""}
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
                      value={formData.amount || ""}
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
                      value={formData.area || ""}
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
                    value={formData.publishedAt || ""}
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
                    value={formData.investors?.join(', ') || ""}
                    onChange={(e) => handleInvestorChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 画像アップロード */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    画像
                  </label>
                  <ImageUpload
                    value={formData.imageUrl || ''}
                    onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                    type="news"
                  />
                  <div className="mt-2">
                    <label className="block text-xs text-gray-500 mb-1">または直接URLを入力</label>
                    <input
                      type="url"
                      value={formData.imageUrl || ""}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                {/* ソースURL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ソースURL
                  </label>
                  <input
                    type="url"
                    value={formData.sourceUrl || ""}
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
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  ニュース一覧 ({totalCount.toLocaleString()}件)
                </h2>
                <div className="text-sm text-gray-500">
                  ページ {currentPage} / {totalPages} ({limit}件/ページ)
                </div>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">読み込み中...</p>
              </div>
            ) : news.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                ニュース情報がありません
              </div>
            ) : (
              <div className="space-y-4">
                    {news.map((newsItem) => (
                  <div key={newsItem.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    {/* ニュースアイテムカード */}
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                            {/* 画像プレビュー */}
                          <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                              {newsItem.imageUrl ? (
                                <SimpleImage
                                  src={newsItem.imageUrl.trim()}
                                  alt={newsItem.title}
                                width={64}
                                height={64}
                                className="w-16 h-16 object-cover"
                                />
                              ) : (
                              <div className="w-16 h-16 bg-gray-100 flex items-center justify-center">
                                <div className="w-8 h-8 bg-gray-300 rounded"></div>
                                </div>
                              )}
                          </div>
                          
                          {/* コンテンツ */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                              {newsItem.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2">
                              <span className="font-medium">{newsItem.company}</span>
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                            {newsItem.type === 'FUNDING' ? '投資' : 
                             newsItem.type === 'M_AND_A' ? 'M&A' :
                             newsItem.type === 'IPO' ? 'IPO' :
                                 newsItem.type === 'PARTNERSHIP' ? 'パートナーシップ' : newsItem.type}
                          </span>
                              {newsItem.area && (
                                <span>{newsItem.area}</span>
                              )}
                              {newsItem.amount && (
                                <span>{newsItem.amount}</span>
                              )}
                            </div>
                            {newsItem.description && (
                              <p className="text-sm text-gray-600 overflow-hidden" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical'}}>
                                {newsItem.description}
                              </p>
                            )}
                          </div>
                          </div>
                        
                        {/* アクションボタン */}
                        <div className="flex items-center gap-2 ml-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            newsItem.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                            {newsItem.isActive ? "公開" : "非公開"}
                          </span>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => handleEdit(newsItem)}
                              className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                              title="編集"
                              type="button"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(newsItem.id)}
                              className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50 transition-colors cursor-pointer"
                              title="削除"
                              type="button"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 編集フォーム - 該当アイテムの下に表示 */}
                    {editingId === newsItem.id && (
                      <div className="border-t border-gray-200 bg-gray-50 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          ニュースを編集
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* タイトル */}
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                タイトル *
                              </label>
                              <input
                                type="text"
                                required
                                value={formData.title || ""}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="ニュースのタイトルを入力"
                              />
                            </div>

                            {/* 会社名 */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                会社名 *
                              </label>
                              <input
                                type="text"
                                required
                                value={formData.company || ""}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="会社名を入力"
                              />
                            </div>

                            {/* タイプ */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                タイプ *
                              </label>
                              <select
                                value={formData.type || "FUNDING"}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="FUNDING">投資</option>
                                <option value="M_AND_A">M&A</option>
                                <option value="IPO">IPO</option>
                                <option value="PARTNERSHIP">パートナーシップ</option>
                              </select>
                            </div>
                          </div>

                          {/* 説明 */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              説明
                            </label>
                            <textarea
                              value={formData.description || ""}
                              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="ニュースの詳細説明を入力"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                セクター
                              </label>
                              <input
                                type="text"
                                value={formData.sector || ""}
                                onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="テクノロジー、ヘルスケアなど"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                金額
                              </label>
                              <input
                                type="text"
                                value={formData.amount || ""}
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
                                value={formData.area || ""}
                                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="東京、シリコンバレーなど"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                公開日
                              </label>
                              <input
                                type="date"
                                value={formData.publishedAt || ""}
                                onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              投資家
                            </label>
                            <input
                              type="text"
                              value={formData.investors?.join(', ') || ""}
                              onChange={(e) => handleInvestorChange(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="投資家名をカンマ区切りで入力"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              画像設定
                            </label>
                            
                            {/* 画像アップロード */}
                            <div className="mb-2">
                              <ImageUpload
                                value={formData.imageUrl || ''}
                                onChange={(imageUrl) => setFormData({ ...formData, imageUrl })}
                                type="news"
                                className="w-full"
                              />
                            </div>
                            
                            {/* または画像URLを直接入力 */}
                            <div className="relative">
                              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                                <div className="w-full border-t border-gray-300" />
                              </div>
                              <div className="relative flex justify-center text-xs">
                                <span className="px-2 bg-white text-gray-500">または</span>
                              </div>
                            </div>
                            
                            <div className="mt-2">
                              <input
                                type="url"
                                value={formData.imageUrl || ""}
                                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://example.com/image.jpg"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              ソースURL
                            </label>
                            <input
                              type="url"
                              value={formData.sourceUrl || ""}
                              onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="https://example.com/news"
                            />
                          </div>

                          <div className="flex items-center">
                            <input
                              id="isActive"
                              type="checkbox"
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
                                  更新中...
                                </>
                              ) : (
                                <>
                                  <Save className="h-4 w-4" />
                                  ニュースを更新
                                </>
                              )}
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* ページネーション */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    {totalCount > 0 && (
                      <>
                        {(currentPage - 1) * limit + 1} - {Math.min(currentPage * limit, totalCount)}件を表示
                        （全{totalCount.toLocaleString()}件中）
                      </>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {/* 前のページボタン */}
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      前へ
                    </button>
                    
                    {/* ページ番号 */}
                    <div className="flex items-center space-x-1">
                      {/* 最初のページ */}
                      {currentPage > 3 && (
                        <>
                          <button
                            onClick={() => handlePageChange(1)}
                            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            1
                          </button>
                          {currentPage > 4 && (
                            <span className="px-2 text-gray-500">...</span>
                          )}
                        </>
                      )}
                      
                      {/* 現在のページ周辺 */}
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const startPage = Math.max(1, currentPage - 2);
                        const pageNum = startPage + i;
                        if (pageNum > totalPages) return null;
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                              pageNum === currentPage
                                ? "text-blue-600 bg-blue-50 border border-blue-300"
                                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      {/* 最後のページ */}
                      {currentPage < totalPages - 2 && (
                        <>
                          {currentPage < totalPages - 3 && (
                            <span className="px-2 text-gray-500">...</span>
                          )}
                          <button
                            onClick={() => handlePageChange(totalPages)}
                            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>
                    
                    {/* 次のページボタン */}
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      次へ
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </AdminGuard>
  );
}
