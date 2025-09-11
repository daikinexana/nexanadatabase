"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import AdminGuard from "@/components/admin/admin-guard";
import ImageUpload from "@/components/ui/image-upload";
import { ArrowLeft, Save, X } from "lucide-react";

interface Event {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  startDate: string;
  endDate?: string;
  venue?: string;
  area?: string;
  organizer: string;
  organizerType: string;
  website?: string;
  targetArea?: string;
  targetAudience?: string;
  operatingCompany?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    startDate: '',
    endDate: '',
    venue: '',
    area: '',
    organizer: '',
    organizerType: '',
    website: '',
    targetArea: '',
    targetAudience: '',
    operatingCompany: '',
    isActive: true,
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/events/${resolvedParams.id}`);
        if (response.ok) {
          const data = await response.json();
          setEvent(data);
          setFormData({
            title: data.title || '',
            description: data.description || '',
            imageUrl: data.imageUrl || '',
            startDate: data.startDate ? new Date(data.startDate).toISOString().slice(0, 16) : '',
            endDate: data.endDate ? new Date(data.endDate).toISOString().slice(0, 16) : '',
            venue: data.venue || '',
            area: data.area || '',
            organizer: data.organizer || '',
            organizerType: data.organizerType || '',
            website: data.website || '',
            targetArea: data.targetArea || '',
            targetAudience: data.targetAudience || '',
            operatingCompany: data.operatingCompany || '',
            isActive: data.isActive,
          });
        } else {
          console.error("Failed to fetch event");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [resolvedParams.id]);

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
      const response = await fetch(`/api/events/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('イベントが正常に更新されました');
        router.push('/admin/events');
      } else {
        const error = await response.json();
        alert(`エラー: ${error.error || 'イベントの更新に失敗しました'}`);
      }
    } catch (error) {
      console.error('Error updating event:', error);
      alert('イベントの更新に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (url: string) => {
    setFormData(prev => ({
      ...prev,
      imageUrl: url
    }));
  };

  if (loading) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-600">読み込み中...</div>
            </div>
          </div>
          <Footer />
        </div>
      </AdminGuard>
    );
  }

  if (!event) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">イベントが見つかりません</h1>
              <Link
                href="/admin/events"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← イベント一覧に戻る
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
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* ヘッダー */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link
                href="/admin/events"
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                イベント一覧に戻る
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">イベント編集</h1>
            <p className="text-gray-600 mt-2">イベント情報を編集します</p>
          </div>

          {/* フォーム */}
          <div className="bg-white shadow rounded-lg">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* イベント名 */}
                <div className="md:col-span-2">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    イベント名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="イベント名を入力してください"
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
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="イベントの説明を入力してください"
                  />
                </div>

                {/* 開始日 */}
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                    開始日 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
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

                {/* 会場 */}
                <div>
                  <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-2">
                    会場
                  </label>
                  <input
                    type="text"
                    id="venue"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="会場名を入力してください"
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
                    <option value="">選択してください</option>
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
                    placeholder="対象となる領域を入力してください"
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
                    placeholder="対象となる人を入力してください"
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
                    placeholder="運営企業名を入力してください"
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

                {/* 画像アップロード */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    画像アップロード
                  </label>
                  <ImageUpload
                    value={formData.imageUrl}
                    onChange={handleImageUpload}
                    type="event"
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
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                      公開する
                    </label>
                  </div>
                </div>
              </div>

              {/* ボタン */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <Link
                  href="/admin/events"
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  キャンセル
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {isSubmitting ? '更新中...' : '更新する'}
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
