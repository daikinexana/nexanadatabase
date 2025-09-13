"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import AdminGuard from "@/components/admin/admin-guard";
import { Building, ArrowLeft, Save, X } from "lucide-react";

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
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EditFacilityPage() {
  const router = useRouter();
  const params = useParams();
  const facilityId = params.id as string;

  const [facility, setFacility] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    isActive: true,
  });

  const fetchFacility = useCallback(async () => {
    try {
      const response = await fetch(`/api/facilities/${facilityId}`);
      if (response.ok) {
        const data = await response.json();
        setFacility(data);
        setFormData({
          title: data.title || '',
          description: data.description || '',
          imageUrl: data.imageUrl || '',
          address: data.address || '',
          area: data.area || '',
          organizer: data.organizer || '',
          organizerType: data.organizerType || '政府・自治体',
          website: data.website || '',
          targetArea: data.targetArea || '',
          facilityInfo: data.facilityInfo || '',
          targetAudience: data.targetAudience || '',
          program: data.program || '',
          isActive: data.isActive ?? true,
        });
      } else {
        alert('施設情報の取得に失敗しました');
        router.push('/admin/facilities');
      }
    } catch (error) {
      console.error('施設情報の取得に失敗しました:', error);
      alert('施設情報の取得に失敗しました');
      router.push('/admin/facilities');
    } finally {
      setLoading(false);
    }
  }, [facilityId, router]);

  useEffect(() => {
    if (facilityId) {
      fetchFacility();
    }
  }, [facilityId, fetchFacility]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/facilities/${facilityId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('施設情報が正常に更新されました');
        router.push('/admin/facilities');
      } else {
        const error = await response.json();
        alert(`エラー: ${error.error || '施設の更新に失敗しました'}`);
      }
    } catch (error) {
      console.error('施設の更新に失敗しました:', error);
      alert('施設の更新に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">読み込み中...</p>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </AdminGuard>
    );
  }

  if (!facility) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">施設が見つかりません</h1>
              <Link
                href="/admin/facilities"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                施設一覧に戻る
              </Link>
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
        
        <div className="container mx-auto px-4 py-8">
          {/* ヘッダー */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href="/admin/facilities"
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <Building className="h-8 w-8 mr-3 text-blue-600" />
                    施設を編集
                  </h1>
                  <p className="text-gray-600 mt-2">{facility.title}</p>
                </div>
              </div>
            </div>
          </div>

          {/* 編集フォーム */}
          <div className="bg-white shadow rounded-lg p-6">
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
                  <select
                    id="organizerType"
                    name="organizerType"
                    value={formData.organizerType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="政府・自治体">政府・自治体</option>
                    <option value="VC">VC</option>
                    <option value="CVC">CVC</option>
                    <option value="銀行系">銀行系</option>
                    <option value="不動産系">不動産系</option>
                    <option value="企業">企業</option>
                    <option value="企業R&D">企業R&D</option>
                    <option value="大学と研究機関">大学と研究機関</option>
                    <option value="その他">その他</option>
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
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="施設の詳細情報を入力してください"
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
                    rows={2}
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
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="提供しているプログラムを入力してください"
                  />
                </div>

                {/* 公開状態 */}
                <div className="md:col-span-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                      公開する
                    </label>
                  </div>
                </div>
              </div>

              {/* ボタン */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <Link
                  href="/admin/facilities"
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                >
                  <X className="h-4 w-4 mr-2" />
                  キャンセル
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? '保存中...' : '保存'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <Footer />
      </div>
    </AdminGuard>
  );
}
