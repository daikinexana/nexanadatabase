"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import AdminGuard from "@/components/admin/admin-guard";
import { Building, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";

interface Facility {
  id: string;
  title: string;
  description?: string;
  address?: string;
  area?: string;
  organizer: string;
  organizerType: string;
  website?: string;
  targetArea?: string;
  facilityInfo?: string;
  targetAudience?: string;
  program?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminFacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    address: '',
    area: '',
    organizer: '',
    organizerType: '政府・自治体',
    website: '',
    targetArea: '',
    facilityInfo: '',
    targetAudience: '',
    program: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const response = await fetch('/api/facilities');
      if (response.ok) {
        const data = await response.json();
        setFacilities(data);
      }
    } catch (error) {
      console.error('施設情報の取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/facilities/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setFacilities(facilities.map(facility => 
          facility.id === id 
            ? { ...facility, isActive: !currentStatus }
            : facility
        ));
      }
    } catch (error) {
      console.error('ステータスの更新に失敗しました:', error);
    }
  };

  const deleteFacility = async (id: string) => {
    if (!confirm('この施設情報を削除しますか？')) return;

    try {
      const response = await fetch(`/api/facilities/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFacilities(facilities.filter(facility => facility.id !== id));
      }
    } catch (error) {
      console.error('削除に失敗しました:', error);
    }
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
      const response = await fetch('/api/facilities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newFacility = await response.json();
        setFacilities([newFacility, ...facilities]);
        setFormData({
          title: '',
          description: '',
          imageUrl: '',
          address: '',
          area: '',
          organizer: '',
          organizerType: '政府・自治体',
          website: '',
          targetArea: '',
          facilityInfo: '',
          targetAudience: '',
          program: '',
        });
        setShowCreateForm(false);
        alert('施設が正常に追加されました');
      } else {
        const error = await response.json();
        alert(`エラー: ${error.error || '施設の追加に失敗しました'}`);
      }
    } catch (error) {
      console.error('施設の追加に失敗しました:', error);
      alert('施設の追加に失敗しました');
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">施設紹介管理</h1>
                <p className="text-gray-600">スタートアップ支援施設の管理と編集を行います</p>
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
              新しい施設を追加
            </button>
          </div>

          {/* 施設追加フォーム */}
          {showCreateForm && (
            <div className="mb-8 bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">新しい施設を追加</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 施設名 */}
                  <div className="md:col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      施設名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="施設名を入力してください"
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
                      placeholder="施設の説明を入力してください"
                    />
                  </div>

                  {/* 住所 */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      住所
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="住所を入力してください"
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

                  {/* 運営者 */}
                  <div>
                    <label htmlFor="organizer" className="block text-sm font-medium text-gray-700 mb-2">
                      運営者 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="organizer"
                      name="organizer"
                      value={formData.organizer}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="運営者名を入力してください"
                    />
                  </div>

                  {/* 運営者タイプ */}
                  <div>
                    <label htmlFor="organizerType" className="block text-sm font-medium text-gray-700 mb-2">
                      運営者タイプ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="organizerType"
                      name="organizerType"
                      value={formData.organizerType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="運営者タイプを入力してください"
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
                      placeholder="対象領域を入力してください"
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

                  {/* 施設情報 */}
                  <div className="md:col-span-2">
                    <label htmlFor="facilityInfo" className="block text-sm font-medium text-gray-700 mb-2">
                      施設情報
                    </label>
                    <textarea
                      id="facilityInfo"
                      name="facilityInfo"
                      value={formData.facilityInfo}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="施設の詳細な情報を入力してください"
                    />
                  </div>

                  {/* 対象者 */}
                  <div className="md:col-span-2">
                    <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700 mb-2">
                      対象者
                    </label>
                    <textarea
                      id="targetAudience"
                      name="targetAudience"
                      value={formData.targetAudience}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="対象者を入力してください"
                    />
                  </div>

                  {/* プログラム */}
                  <div className="md:col-span-2">
                    <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-2">
                      プログラム
                    </label>
                    <textarea
                      id="program"
                      name="program"
                      value={formData.program}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="提供しているプログラムを入力してください"
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
                      '施設を追加'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 施設一覧 */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">施設一覧</h2>
            </div>
            
            {facilities.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                施設情報がありません
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {facilities.map((facility) => (
                  <div key={facility.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <Building className="h-5 w-5 text-gray-400" />
                          <h3 className="text-lg font-medium text-gray-900">
                            {facility.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            facility.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {facility.isActive ? '公開中' : '非公開'}
                          </span>
                        </div>
                        
                        {facility.description && (
                          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                            {facility.description}
                          </p>
                        )}
                        
                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                          {facility.area && (
                            <span>エリア: {facility.area}</span>
                          )}
                          <span>主催者: {facility.organizer}</span>
                          <span>更新日: {new Date(facility.updatedAt).toLocaleDateString('ja-JP')}</span>
                        </div>
                        
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => toggleActive(facility.id, facility.isActive)}
                          className={`p-2 rounded-lg transition-colors ${
                            facility.isActive
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={facility.isActive ? '非公開にする' : '公開する'}
                        >
                          {facility.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        
                        <Link
                          href={`/admin/facilities/${facility.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="編集"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        
                        <button
                          onClick={() => deleteFacility(facility.id)}
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
