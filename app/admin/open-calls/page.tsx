"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import AdminGuard from "@/components/admin/admin-guard";
import AdminNav from "@/components/ui/admin-nav";
import { Handshake, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

interface OpenCall {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  deadline?: string;
  startDate?: string;
  area?: string;
  organizer: string;
  organizerType: string;
  website?: string;
  targetArea?: string;
  targetAudience?: string;
  openCallType?: string;
  availableResources?: string;
  resourceType?: string;
  operatingCompany?: string;
  isActive: boolean;
  isChecked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminOpenCallsPage() {
  const [openCalls, setOpenCalls] = useState<OpenCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    deadline: '',
    startDate: '',
    area: '',
    organizer: '',
    organizerType: '',
    website: '',
    targetArea: '',
    targetAudience: '',
    openCallType: '',
    availableResources: '',
    resourceType: '',
    operatingCompany: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchOpenCalls();
  }, []);

  const fetchOpenCalls = async () => {
    try {
      const response = await fetch('/api/open-calls');
        if (response.ok) {
          const data = await response.json();
          // 作成日時で降順ソート（新しいものが上に来る）
          const sortedData = data.sort((a: OpenCall, b: OpenCall) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setOpenCalls(sortedData);
        }
    } catch (error) {
      console.error('公募情報の取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/open-calls/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setOpenCalls(openCalls.map(openCall => 
          openCall.id === id 
            ? { ...openCall, isActive: !currentStatus }
            : openCall
        ));
      }
    } catch (error) {
      console.error('ステータスの更新に失敗しました:', error);
    }
  };

  // const toggleChecked = (id: string) => {
  //   setOpenCalls(openCalls.map(openCall => 
  //     openCall.id === id 
  //       ? { ...openCall, isChecked: !openCall.isChecked }
  //       : openCall
  //   ));
  // };

  const deleteOpenCall = async (id: string) => {
    if (!confirm('この公募を削除しますか？')) return;

    try {
      const response = await fetch(`/api/open-calls/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setOpenCalls(openCalls.filter(openCall => openCall.id !== id));
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


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/open-calls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newOpenCall = await response.json();
        setOpenCalls([newOpenCall, ...openCalls]);
        setFormData({
          title: '',
          description: '',
          imageUrl: '',
          deadline: '',
          startDate: '',
          area: '',
          organizer: '',
          organizerType: '',
          website: '',
          targetArea: '',
          targetAudience: '',
          openCallType: '',
          availableResources: '',
          resourceType: '',
          operatingCompany: '',
        });
        setShowCreateForm(false);
        alert('公募が正常に追加されました');
      } else {
        const error = await response.json();
        alert(`エラー: ${error.error || '公募の追加に失敗しました'}`);
      }
    } catch (error) {
      console.error('公募の追加に失敗しました:', error);
      alert('公募の追加に失敗しました');
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
        <AdminNav />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">公募管理</h1>
                <p className="text-gray-600">課題解決パートナー募集などの公募情報の管理と編集を行います</p>
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
              新しい公募を追加
            </button>
          </div>

          {/* 公募追加フォーム */}
          {showCreateForm && (
            <div className="mb-8 bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">新しい公募を追加</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 公募名 */}
                  <div className="md:col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      公募名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="公募名を入力してください"
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
                      placeholder="公募の説明を入力してください"
                    />
                  </div>

                  {/* 対象領域 */}
                  <div>
                    <label htmlFor="targetArea" className="block text-sm font-medium text-gray-700 mb-2">
                      対象領域
                    </label>
                    <input
                      type="text"
                      id="targetArea"
                      name="targetArea"
                      value={formData.targetArea}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="例: AI、IoT、バイオテクノロジーなど"
                    />
                  </div>

                  {/* 対象者 */}
                  <div>
                    <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-2">
                      対象者
                    </label>
                    <input
                      type="text"
                      id="targetAudience"
                      name="targetAudience"
                      value={formData.targetAudience}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="例: スタートアップ、中小企業、研究機関など"
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

                  {/* 公募タイプ */}
                  <div>
                    <label htmlFor="openCallType" className="block text-sm font-medium text-gray-700 mb-2">
                      公募タイプ
                    </label>
                    <input
                      type="text"
                      id="openCallType"
                      name="openCallType"
                      value={formData.openCallType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="例: 助成金、補助金、コンテスト、パートナーシップなど"
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
                    <input
                      type="text"
                      id="organizerType"
                      name="organizerType"
                      value={formData.organizerType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="例: 政府・自治体、企業、研究機関など"
                    />
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

                  {/* 提供可能なリソース/技術 */}
                  <div>
                    <label htmlFor="availableResources" className="block text-sm font-medium text-gray-700 mb-2">
                      提供可能なリソース/技術
                    </label>
                    <input
                      type="text"
                      id="availableResources"
                      name="availableResources"
                      value={formData.availableResources}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="例: 資金、技術支援、ネットワーク、施設など"
                    />
                  </div>

                  {/* 提供可能なリソース/技術タイプ */}
                  <div>
                    <label htmlFor="resourceType" className="block text-sm font-medium text-gray-700 mb-2">
                      提供可能なリソース/技術タイプ
                    </label>
                    <input
                      type="text"
                      id="resourceType"
                      name="resourceType"
                      value={formData.resourceType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="例: 資金提供、技術支援、人材派遣、施設提供など"
                    />
                  </div>

                  {/* 運営企業 */}
                  <div>
                    <label htmlFor="operatingCompany" className="block text-sm font-medium text-gray-700 mb-2">
                      運営企業
                    </label>
                    <input
                      type="text"
                      id="operatingCompany"
                      name="operatingCompany"
                      value={formData.operatingCompany}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="例: 株式会社○○、NPO法人○○など"
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
                      '公募を追加'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 公募一覧 */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">公募一覧</h2>
            </div>
            
            {openCalls.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                公募情報がありません
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {openCalls.map((openCall) => (
                  <div key={openCall.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 flex gap-4">
                        {/* 画像 */}
                        {openCall.imageUrl && (
                          <div className="flex-shrink-0">
                            <Image
                              src={openCall.imageUrl}
                              alt={openCall.title}
                              width={80}
                              height={80}
                              className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                        
                        {/* 公募情報 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                            <Handshake className="h-5 w-5 text-gray-400 flex-shrink-0" />
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                              {openCall.title}
                            </h3>
                            <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${
                              openCall.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {openCall.isActive ? '公開中' : '非公開'}
                            </span>
                            {openCall.openCallType && (
                              <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 flex-shrink-0">
                                {openCall.openCallType}
                              </span>
                            )}
                          </div>
                          
                          {openCall.description && (
                            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                              {openCall.description}
                            </p>
                          )}
                        
                          <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                            {openCall.deadline && (
                              <span>締切: {formatDate(openCall.deadline)}</span>
                            )}
                            {openCall.startDate && (
                              <span>開始: {formatDate(openCall.startDate)}</span>
                            )}
                            {openCall.area && (
                              <span>エリア: {openCall.area}</span>
                            )}
                            {openCall.targetArea && (
                              <span>対象領域: {openCall.targetArea}</span>
                            )}
                            {openCall.targetAudience && (
                              <span>対象者: {openCall.targetAudience}</span>
                            )}
                            <span>主催者: {openCall.organizer}</span>
                          </div>
                          
                          {openCall.availableResources && (
                            <div className="mt-2">
                              <span className="text-sm text-gray-600">
                                <strong>提供リソース:</strong> {openCall.availableResources}
                              </span>
                            </div>
                          )}
                          {openCall.resourceType && (
                            <div className="mt-1">
                              <span className="text-sm text-gray-600">
                                <strong>リソースタイプ:</strong> {openCall.resourceType}
                              </span>
                            </div>
                          )}
                          {openCall.operatingCompany && (
                            <div className="mt-1">
                              <span className="text-sm text-gray-600">
                                <strong>運営企業:</strong> {openCall.operatingCompany}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                        <button
                          onClick={() => toggleActive(openCall.id, openCall.isActive)}
                          className={`p-2 rounded-lg transition-colors ${
                            openCall.isActive
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={openCall.isActive ? '非公開にする' : '公開する'}
                        >
                          {openCall.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        
                        <Link
                          href={`/admin/open-calls/${openCall.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="編集"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        
                        <button
                          onClick={() => deleteOpenCall(openCall.id)}
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
