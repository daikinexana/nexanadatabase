"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import AdminGuard from "@/components/admin/admin-guard";
import ImageUpload from "@/components/ui/image-upload";
import { ArrowLeft, Save, X } from "lucide-react";

interface Contest {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  deadline?: string;
  startDate?: string;
  area?: string;
  organizer: string;
  organizerType?: string;
  website?: string;
  targetArea?: string;
  targetAudience?: string;
  incentive?: string;
  operatingCompany?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EditContestPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [contest, setContest] = useState<Contest | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    incentive: '',
    operatingCompany: '',
    isActive: true,
  });

  useEffect(() => {
    const fetchContest = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/contests/${resolvedParams.id}`);
        if (response.ok) {
          const data = await response.json();
          setContest(data);
          setFormData({
            title: data.title || '',
            description: data.description || '',
            imageUrl: data.imageUrl || '',
            deadline: data.deadline ? new Date(data.deadline).toISOString().slice(0, 16) : '',
            startDate: data.startDate ? new Date(data.startDate).toISOString().slice(0, 16) : '',
            area: data.area || '',
            organizer: data.organizer || '',
            organizerType: data.organizerType || '',
            website: data.website || '',
            targetArea: data.targetArea || '',
            targetAudience: data.targetAudience || '',
            incentive: data.incentive || '',
            operatingCompany: data.operatingCompany || '',
            isActive: data.isActive,
          });
        } else {
          console.error("Failed to fetch contest");
        }
      } catch (error) {
        console.error("Error fetching contest:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
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
      const response = await fetch(`/api/contests/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/contests');
      } else {
        const errorData = await response.json();
        console.error('Error updating contest:', errorData);
        alert('コンテストの更新に失敗しました');
      }
    } catch (error) {
      console.error('Error updating contest:', error);
      alert('コンテストの更新に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">コンテストが見つかりません</h1>
            <Link
              href="/admin/contests"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>一覧に戻る</span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* ヘッダー */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Link
                href="/admin/contests"
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">コンテスト編集</h1>
            </div>
            <p className="text-gray-600">コンテストの情報を編集できます</p>
          </div>

          {/* フォーム */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">基本情報</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    コンテスト名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="コンテスト名を入力"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    主催者 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="主催者を入力"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    主催者タイプ
                  </label>
                  <input
                    type="text"
                    name="organizerType"
                    value={formData.organizerType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="例: 行政、企業、研究機関、VC、CVC、銀行、不動産、その他"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    説明
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="コンテストの説明を入力"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    開始日
                  </label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    締切日
                  </label>
                  <input
                    type="datetime-local"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    エリア
                  </label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="エリアを入力"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    ウェブサイト
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">詳細情報</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    対象領域
                  </label>
                  <input
                    type="text"
                    name="targetArea"
                    value={formData.targetArea}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="対象領域を入力"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    対象者
                  </label>
                  <input
                    type="text"
                    name="targetAudience"
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="対象者を入力"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    インセンティブ
                  </label>
                  <textarea
                    name="incentive"
                    value={formData.incentive}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="インセンティブを入力（改行で箇条書きにできます）"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    運営企業
                  </label>
                  <input
                    type="text"
                    name="operatingCompany"
                    value={formData.operatingCompany}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="運営企業を入力"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">画像・設定</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    画像
                  </label>
                  <ImageUpload
                    value={formData.imageUrl}
                    onChange={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                    type="contests"
                  />
                  <div className="mt-2">
                    <label className="block text-xs text-gray-500 mb-1">または直接URLを入力</label>
                    <input
                      type="url"
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="text-sm font-semibold text-gray-700">
                    公開状態
                  </label>
                </div>
              </div>
            </div>

            {/* ボタン */}
            <div className="flex items-center justify-end space-x-4">
              <Link
                href="/admin/contests"
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>キャンセル</span>
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>{isSubmitting ? '保存中...' : '保存'}</span>
              </button>
            </div>
          </form>
        </div>

        <Footer />
      </div>
    </AdminGuard>
  );
}
