"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import AdminGuard from "@/components/admin/admin-guard";
import { Gift, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";

interface Subsidy {
  id: string;
  title: string;
  description?: string;
  deadline?: string;
  startDate?: string;
  endDate?: string;
  category: string;
  area?: string;
  organizer: string;
  organizerType: string;
  amount?: string;
  website?: string;
  contact?: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminSubsidiesPage() {
  const [subsidies, setSubsidies] = useState<Subsidy[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    imageUrl: '',
    deadline: '',
    startDate: '',
    endDate: '',
    category: 'STARTUP_SUPPORT' as const,
    area: '',
    organizer: '',
    organizerType: 'GOVERNMENT' as const,
    amount: '',
    website: '',
    contact: '',
    tags: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchSubsidies();
  }, []);

  const fetchSubsidies = async () => {
    try {
      const response = await fetch('/api/subsidies');
      if (response.ok) {
        const data = await response.json();
        setSubsidies(data);
      }
    } catch (error) {
      console.error('助成金情報の取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/subsidies/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setSubsidies(subsidies.map(subsidy => 
          subsidy.id === id 
            ? { ...subsidy, isActive: !currentStatus }
            : subsidy
        ));
      }
    } catch (error) {
      console.error('ステータスの更新に失敗しました:', error);
    }
  };

  const deleteSubsidy = async (id: string) => {
    if (!confirm('この助成金を削除しますか？')) return;

    try {
      const response = await fetch(`/api/subsidies/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSubsidies(subsidies.filter(subsidy => subsidy.id !== id));
      }
    } catch (error) {
      console.error('削除に失敗しました:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryLabel = (category: string) => {
    const categoryLabels: { [key: string]: string } = {
      STARTUP_SUPPORT: 'スタートアップ支援',
      R_AND_D: '研究開発',
      EXPORT_SUPPORT: '輸出支援',
      DIGITAL_TRANSFORMATION: 'DX支援',
      ENVIRONMENTAL: '環境',
      REGIONAL_DEVELOPMENT: '地域振興',
      EMPLOYMENT: '雇用',
      OTHER: 'その他',
    };
    return categoryLabels[category] || category;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/subsidies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newSubsidy = await response.json();
        setSubsidies([newSubsidy, ...subsidies]);
        setFormData({
          title: '',
          description: '',
          content: '',
          imageUrl: '',
          deadline: '',
          startDate: '',
          endDate: '',
          category: 'STARTUP_SUPPORT',
          area: '',
          organizer: '',
          organizerType: 'GOVERNMENT',
          amount: '',
          website: '',
          contact: '',
          tags: [],
        });
        setShowCreateForm(false);
        alert('助成金が正常に追加されました');
      } else {
        const error = await response.json();
        alert(`エラー: ${error.error || '助成金の追加に失敗しました'}`);
      }
    } catch (error) {
      console.error('助成金の追加に失敗しました:', error);
      alert('助成金の追加に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-600">読み込み中...</div>
            </div>
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
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">助成金・補助金管理</h1>
                <p className="text-gray-600">スタートアップ向けの助成金・補助金情報の管理と編集を行います</p>
              </div>
              <Link
                href="/admin"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← 管理画面に戻る
              </Link>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="mb-6">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              新しい助成金を追加
            </button>
          </div>

          {/* 助成金追加フォーム */}
          {showCreateForm && (
            <div className="mb-8 bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">新しい助成金を追加</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 助成金名 */}
                  <div className="md:col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      助成金名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="助成金名を入力してください"
                    />
                  </div>

                  {/* 説明 */}
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      説明
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="助成金の説明を入力してください"
                    />
                  </div>

                  {/* カテゴリ */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      カテゴリ <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="STARTUP_SUPPORT">スタートアップ支援</option>
                      <option value="R_AND_D">研究開発</option>
                      <option value="EXPORT_SUPPORT">輸出支援</option>
                      <option value="DIGITAL_TRANSFORMATION">DX支援</option>
                      <option value="ENVIRONMENTAL">環境</option>
                      <option value="REGIONAL_DEVELOPMENT">地域振興</option>
                      <option value="EMPLOYMENT">雇用</option>
                      <option value="OTHER">その他</option>
                    </select>
                  </div>

                  {/* 助成金額 */}
                  <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                      助成金額・規模
                    </label>
                    <input
                      type="text"
                      id="amount"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="例: 最大500万円、事業費の2/3など"
                    />
                  </div>

                  {/* 締切日 */}
                  <div>
                    <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                      締切日
                    </label>
                    <input
                      type="datetime-local"
                      id="deadline"
                      name="deadline"
                      value={formData.deadline}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* 開始日 */}
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                      開始日
                    </label>
                    <input
                      type="datetime-local"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* 終了日 */}
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                      終了日
                    </label>
                    <input
                      type="datetime-local"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* エリア */}
                  <div>
                    <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                      エリア
                    </label>
                    <input
                      type="text"
                      id="area"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="都道府県を入力してください"
                    />
                  </div>

                  {/* 主催者 */}
                  <div>
                    <label htmlFor="organizer" className="block text-sm font-medium text-gray-700 mb-2">
                      主催者 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="organizer"
                      name="organizer"
                      value={formData.organizer}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="主催者名を入力してください"
                    />
                  </div>

                  {/* 主催者タイプ */}
                  <div>
                    <label htmlFor="organizerType" className="block text-sm font-medium text-gray-700 mb-2">
                      主催者タイプ <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="organizerType"
                      name="organizerType"
                      value={formData.organizerType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="GOVERNMENT">政府・自治体</option>
                      <option value="VC">ベンチャーキャピタル</option>
                      <option value="CVC">コーポレートベンチャーキャピタル</option>
                      <option value="BANK">銀行</option>
                      <option value="REAL_ESTATE">不動産</option>
                      <option value="CORPORATION">企業</option>
                      <option value="RESEARCH_INSTITUTION">研究機関</option>
                      <option value="OTHER">その他</option>
                    </select>
                  </div>

                  {/* ウェブサイト */}
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                      ウェブサイト
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com"
                    />
                  </div>

                  {/* 連絡先 */}
                  <div>
                    <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-2">
                      連絡先
                    </label>
                    <input
                      type="text"
                      id="contact"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="電話番号やメールアドレス"
                    />
                  </div>

                  {/* 画像URL */}
                  <div className="md:col-span-2">
                    <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                      画像URL
                    </label>
                    <input
                      type="url"
                      id="imageUrl"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  {/* タグ */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      タグ
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="タグを入力してEnterキーを押すか追加ボタンをクリック"
                      />
                      <button
                        type="button"
                        onClick={handleTagAdd}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        追加
                      </button>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleTagRemove(tag)}
                              className="ml-1 text-yellow-600 hover:text-yellow-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 詳細内容 */}
                  <div className="md:col-span-2">
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                      詳細内容（Markdown）
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="助成金の詳細な説明をMarkdown形式で入力してください"
                    />
                  </div>
                </div>

                {/* ボタン */}
                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
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
                        追加中...
                      </>
                    ) : (
                      '助成金を追加'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 助成金一覧 */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">助成金一覧</h2>
            </div>
            
            {subsidies.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                助成金情報がありません
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {subsidies.map((subsidy) => (
                  <div key={subsidy.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Gift className="h-5 w-5 text-gray-400" />
                          <h3 className="text-lg font-medium text-gray-900">
                            {subsidy.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            subsidy.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {subsidy.isActive ? '公開中' : '非公開'}
                          </span>
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                            {getCategoryLabel(subsidy.category)}
                          </span>
                        </div>
                        
                        {subsidy.description && (
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {subsidy.description}
                          </p>
                        )}
                        
                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                          {subsidy.deadline && (
                            <span>締切: {formatDate(subsidy.deadline)}</span>
                          )}
                          {subsidy.startDate && (
                            <span>開始: {formatDate(subsidy.startDate)}</span>
                          )}
                          {subsidy.endDate && (
                            <span>終了: {formatDate(subsidy.endDate)}</span>
                          )}
                          {subsidy.area && (
                            <span>エリア: {subsidy.area}</span>
                          )}
                          {subsidy.amount && (
                            <span className="font-semibold text-yellow-600">金額: {subsidy.amount}</span>
                          )}
                          <span>主催者: {subsidy.organizer}</span>
                        </div>
                        
                        {subsidy.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {subsidy.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => toggleActive(subsidy.id, subsidy.isActive)}
                          className={`p-2 rounded-lg transition-colors ${
                            subsidy.isActive
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={subsidy.isActive ? '非公開にする' : '公開する'}
                        >
                          {subsidy.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        
                        <Link
                          href={`/admin/subsidies/${subsidy.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="編集"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        
                        <button
                          onClick={() => deleteSubsidy(subsidy.id)}
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
