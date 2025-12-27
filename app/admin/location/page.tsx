"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import AdminGuard from "@/components/admin/admin-guard";
import AdminNav from "@/components/ui/admin-nav";
import { MapPin, Plus, Edit, Trash2, Save, X } from "lucide-react";
import ImageUpload from "@/components/ui/image-upload";

interface Location {
  id: string;
  slug: string;
  country: string;
  city: string;
  description?: string;
  topImageUrl?: string;
  mapImageUrl?: string;
  companyCard1Image?: string;
  companyCard1Name?: string;
  companyCard1DescTop?: string;
  companyCard1DescBottom?: string;
  companyCard2Image?: string;
  companyCard2Name?: string;
  companyCard2DescTop?: string;
  companyCard2DescBottom?: string;
  companyCard3Image?: string;
  companyCard3Name?: string;
  companyCard3DescTop?: string;
  companyCard3DescBottom?: string;
  experienceCard1Image?: string;
  experienceCard1Title?: string;
  experienceCard1Url?: string;
  experienceCard2Image?: string;
  experienceCard2Title?: string;
  experienceCard2Url?: string;
  experienceCard3Image?: string;
  experienceCard3Title?: string;
  experienceCard3Url?: string;
  sightseeingCard1Image?: string;
  sightseeingCard1Title?: string;
  sightseeingCard2Image?: string;
  sightseeingCard2Title?: string;
  sightseeingCard3Image?: string;
  sightseeingCard3Title?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminLocationPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<Location>>({});
  const [formData, setFormData] = useState({
    slug: '',
    country: '',
    city: '',
    description: '',
    topImageUrl: '',
    mapImageUrl: '',
    companyCard1Image: '',
    companyCard1Name: '',
    companyCard1DescTop: '',
    companyCard1DescBottom: '',
    companyCard2Image: '',
    companyCard2Name: '',
    companyCard2DescTop: '',
    companyCard2DescBottom: '',
    companyCard3Image: '',
    companyCard3Name: '',
    companyCard3DescTop: '',
    companyCard3DescBottom: '',
    experienceCard1Image: '',
    experienceCard1Title: '',
    experienceCard1Url: '',
    experienceCard2Image: '',
    experienceCard2Title: '',
    experienceCard2Url: '',
    experienceCard3Image: '',
    experienceCard3Title: '',
    experienceCard3Url: '',
    sightseeingCard1Image: '',
    sightseeingCard1Title: '',
    sightseeingCard2Image: '',
    sightseeingCard2Title: '',
    sightseeingCard3Image: '',
    sightseeingCard3Title: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const response = await fetch(`/api/location?_t=${timestamp}&_r=${random}`, {
        cache: 'no-store',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Request-ID': `${timestamp}-${random}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const sortedData = data.sort((a: Location, b: Location) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setLocations(sortedData);
      }
    } catch (error) {
      console.error('ロケーション情報の取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteLocation = async (id: string) => {
    if (!confirm('このロケーション情報を削除しますか？')) return;

    try {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const response = await fetch(`/api/location/${id}?_t=${timestamp}&_r=${random}`, {
        method: 'DELETE',
        cache: 'no-store',
        credentials: 'include',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Request-ID': `${timestamp}-${random}`,
        },
      });

      if (response.ok) {
        await fetchLocations();
      }
    } catch (error) {
      console.error('削除に失敗しました:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const startEditing = (location: Location) => {
    setEditingId(location.id);
    setEditingData({
      slug: location.slug,
      country: location.country,
      city: location.city,
      description: location.description,
      topImageUrl: location.topImageUrl,
      mapImageUrl: location.mapImageUrl,
      companyCard1Image: location.companyCard1Image,
      companyCard1Name: location.companyCard1Name,
      companyCard1DescTop: location.companyCard1DescTop,
      companyCard1DescBottom: location.companyCard1DescBottom,
      companyCard2Image: location.companyCard2Image,
      companyCard2Name: location.companyCard2Name,
      companyCard2DescTop: location.companyCard2DescTop,
      companyCard2DescBottom: location.companyCard2DescBottom,
      companyCard3Image: location.companyCard3Image,
      companyCard3Name: location.companyCard3Name,
      companyCard3DescTop: location.companyCard3DescTop,
      companyCard3DescBottom: location.companyCard3DescBottom,
      experienceCard1Image: location.experienceCard1Image,
      experienceCard1Title: location.experienceCard1Title,
      experienceCard1Url: location.experienceCard1Url,
      experienceCard2Image: location.experienceCard2Image,
      experienceCard2Title: location.experienceCard2Title,
      experienceCard2Url: location.experienceCard2Url,
      experienceCard3Image: location.experienceCard3Image,
      experienceCard3Title: location.experienceCard3Title,
      experienceCard3Url: location.experienceCard3Url,
      sightseeingCard1Image: location.sightseeingCard1Image,
      sightseeingCard1Title: location.sightseeingCard1Title,
      sightseeingCard2Image: location.sightseeingCard2Image,
      sightseeingCard2Title: location.sightseeingCard2Title,
      sightseeingCard3Image: location.sightseeingCard3Image,
      sightseeingCard3Title: location.sightseeingCard3Title,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingData({});
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveEdit = async (id: string) => {
    try {
      // undefinedのフィールドのみ削除（空文字列は許可）
      const dataToSend = Object.fromEntries(
        Object.entries(editingData).filter(([, value]) => value !== undefined)
      );

      console.log('更新データ:', dataToSend);
      console.log('更新データのキー:', Object.keys(dataToSend));

      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const response = await fetch(`/api/location/${id}?_t=${timestamp}&_r=${random}`, {
        method: 'PUT',
        cache: 'no-store',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Request-ID': `${timestamp}-${random}`,
        },
        body: JSON.stringify(dataToSend),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        await fetchLocations();
        setEditingId(null);
        setEditingData({});
        alert('ロケーションが正常に更新されました');
      } else {
        let responseText = '';
        try {
          responseText = await response.text();
          console.error('エラーレスポンス:', {
            status: response.status,
            statusText: response.statusText,
            responseText: responseText,
          });
        } catch (textError) {
          console.error('レスポンステキストの読み取りエラー:', textError);
          responseText = '';
        }

        let errorMessage = 'ロケーションの更新に失敗しました';
        let errorDetails = '';

        if (responseText) {
          try {
            const error = JSON.parse(responseText);
            console.error('パースされたエラー:', error);
            errorMessage = error.error || error.message || errorMessage;
            errorDetails = error.details || error.detail || '';
          } catch (e) {
            console.error('JSONパースエラー:', e);
            errorMessage = `エラー: ${response.status} ${response.statusText}`;
            errorDetails = responseText.substring(0, 200) || '';
          }
        } else {
          errorMessage = `エラー: ${response.status} ${response.statusText}`;
        }

        const fullErrorMessage = errorDetails
          ? `エラー: ${errorMessage}\n詳細: ${errorDetails}\nステータス: ${response.status}`
          : `エラー: ${errorMessage}\nステータス: ${response.status}`;

        console.error('最終エラーメッセージ:', fullErrorMessage);
        alert(fullErrorMessage);
      }
    } catch (error) {
      console.error('ロケーションの更新に失敗しました:', error);
      if (error instanceof Error) {
        console.error('エラーメッセージ:', error.message);
        alert(`ロケーションの更新に失敗しました: ${error.message}`);
      } else {
        alert('ロケーションの更新に失敗しました');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('送信するフォームデータ:', formData);
      
      // 必須フィールドのチェック
      if (!formData.slug || !formData.country || !formData.city) {
        alert('必須フィールド（Slug、国名、City名）を入力してください');
        setIsSubmitting(false);
        return;
      }

      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const response = await fetch(`/api/location?_t=${timestamp}&_r=${random}`, {
        method: 'POST',
        cache: 'no-store',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Request-ID': `${timestamp}-${random}`,
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('成功レスポンス:', data);
        await fetchLocations();
        setFormData({
          slug: '',
          country: '',
          city: '',
          description: '',
          topImageUrl: '',
          mapImageUrl: '',
          companyCard1Image: '',
          companyCard1Name: '',
          companyCard1DescTop: '',
          companyCard1DescBottom: '',
          companyCard2Image: '',
          companyCard2Name: '',
          companyCard2DescTop: '',
          companyCard2DescBottom: '',
          companyCard3Image: '',
          companyCard3Name: '',
          companyCard3DescTop: '',
          companyCard3DescBottom: '',
          experienceCard1Image: '',
          experienceCard1Title: '',
          experienceCard1Url: '',
          experienceCard2Image: '',
          experienceCard2Title: '',
          experienceCard2Url: '',
          experienceCard3Image: '',
          experienceCard3Title: '',
          experienceCard3Url: '',
          sightseeingCard1Image: '',
          sightseeingCard1Title: '',
          sightseeingCard2Image: '',
          sightseeingCard2Title: '',
          sightseeingCard3Image: '',
          sightseeingCard3Title: '',
        });
        setShowCreateForm(false);
        alert('ロケーションが正常に追加されました');
      } else {
        let responseText = '';
        try {
          responseText = await response.text();
          console.error('エラーレスポンス:', {
            status: response.status,
            statusText: response.statusText,
            responseText: responseText,
            responseTextLength: responseText.length,
            headers: Object.fromEntries(response.headers.entries())
          });
        } catch (textError) {
          console.error('レスポンステキストの読み取りエラー:', textError);
          responseText = '';
        }
        
        let errorMessage = 'ロケーションの追加に失敗しました';
        let errorDetails = '';
        
        if (responseText) {
          try {
            const error = JSON.parse(responseText);
            console.error('パースされたエラー:', error);
            console.error('エラーオブジェクトのキー:', Object.keys(error));
            errorMessage = error.error || error.message || errorMessage;
            errorDetails = error.details || error.detail || '';
          } catch (e) {
            console.error('JSONパースエラー:', e);
            console.error('レスポンステキスト（生）:', responseText);
            errorMessage = `エラー: ${response.status} ${response.statusText}`;
            errorDetails = responseText.substring(0, 200) || '';
          }
        } else {
          errorMessage = `エラー: ${response.status} ${response.statusText}`;
          errorDetails = 'レスポンスが空です';
        }
        
        const fullErrorMessage = errorDetails 
          ? `エラー: ${errorMessage}\n詳細: ${errorDetails}\nステータス: ${response.status}`
          : `エラー: ${errorMessage}\nステータス: ${response.status}`;
        
        console.error('最終エラーメッセージ:', fullErrorMessage);
        alert(fullErrorMessage);
      }
    } catch (error) {
      console.error('ロケーションの追加に失敗しました:', error);
      alert('ロケーションの追加に失敗しました');
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">ロケーション管理</h1>
                <p className="text-gray-600">ロケーション情報の管理と編集を行います</p>
              </div>
              <Link
                href="/admin"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← 管理画面に戻る
              </Link>
            </div>
          </div>

          <div className="mb-6">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              新しいロケーションを追加
            </button>
          </div>

          {showCreateForm && (
            <div className="mb-8 bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">新しいロケーションを追加</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="tokyo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      国名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="日本"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City名（都道府県） <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="東京都"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      説明文（カード上部の日本語テキスト）
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="ルスツリゾートの山頂に佇む建築"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Top画像
                    </label>
                    <ImageUpload
                      value={formData.topImageUrl}
                      onChange={(imageUrl) => setFormData({ ...formData, topImageUrl: imageUrl })}
                      type="locations"
                      className="w-full"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      地図画像
                    </label>
                    <ImageUpload
                      value={formData.mapImageUrl}
                      onChange={(imageUrl) => setFormData({ ...formData, mapImageUrl: imageUrl })}
                      type="locations"
                      className="w-full"
                    />
                  </div>

                  {/* 企業カード1 */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">企業カード1</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">画像</label>
                        <ImageUpload
                          value={formData.companyCard1Image}
                          onChange={(imageUrl) => setFormData({ ...formData, companyCard1Image: imageUrl })}
                          type="locations"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">企業名</label>
                        <input
                          type="text"
                          name="companyCard1Name"
                          value={formData.companyCard1Name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">説明文（写真上）</label>
                        <textarea
                          name="companyCard1DescTop"
                          value={formData.companyCard1DescTop}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">説明文（写真下）</label>
                        <textarea
                          name="companyCard1DescBottom"
                          value={formData.companyCard1DescBottom}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 企業カード2 */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">企業カード2</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">画像</label>
                        <ImageUpload
                          value={formData.companyCard2Image}
                          onChange={(imageUrl) => setFormData({ ...formData, companyCard2Image: imageUrl })}
                          type="locations"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">企業名</label>
                        <input
                          type="text"
                          name="companyCard2Name"
                          value={formData.companyCard2Name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">説明文（写真上）</label>
                        <textarea
                          name="companyCard2DescTop"
                          value={formData.companyCard2DescTop}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">説明文（写真下）</label>
                        <textarea
                          name="companyCard2DescBottom"
                          value={formData.companyCard2DescBottom}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 企業カード3 */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">企業カード3</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">画像</label>
                        <ImageUpload
                          value={formData.companyCard3Image}
                          onChange={(imageUrl) => setFormData({ ...formData, companyCard3Image: imageUrl })}
                          type="locations"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">企業名</label>
                        <input
                          type="text"
                          name="companyCard3Name"
                          value={formData.companyCard3Name}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">説明文（写真上）</label>
                        <textarea
                          name="companyCard3DescTop"
                          value={formData.companyCard3DescTop}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">説明文（写真下）</label>
                        <textarea
                          name="companyCard3DescBottom"
                          value={formData.companyCard3DescBottom}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 体験ブログカード */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">体験ブログカード1</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">画像</label>
                        <ImageUpload
                          value={formData.experienceCard1Image}
                          onChange={(imageUrl) => setFormData({ ...formData, experienceCard1Image: imageUrl })}
                          type="locations"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">タイトル</label>
                        <input
                          type="text"
                          name="experienceCard1Title"
                          value={formData.experienceCard1Title}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                        <input
                          type="url"
                          name="experienceCard1Url"
                          value={formData.experienceCard1Url}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 体験ブログカード2 */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">体験ブログカード2</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">画像</label>
                        <ImageUpload
                          value={formData.experienceCard2Image}
                          onChange={(imageUrl) => setFormData({ ...formData, experienceCard2Image: imageUrl })}
                          type="locations"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">タイトル</label>
                        <input
                          type="text"
                          name="experienceCard2Title"
                          value={formData.experienceCard2Title}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                        <input
                          type="url"
                          name="experienceCard2Url"
                          value={formData.experienceCard2Url}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 体験ブログカード3 */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">体験ブログカード3</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">画像</label>
                        <ImageUpload
                          value={formData.experienceCard3Image}
                          onChange={(imageUrl) => setFormData({ ...formData, experienceCard3Image: imageUrl })}
                          type="locations"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">タイトル</label>
                        <input
                          type="text"
                          name="experienceCard3Title"
                          value={formData.experienceCard3Title}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                        <input
                          type="url"
                          name="experienceCard3Url"
                          value={formData.experienceCard3Url}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 観光地カード */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">観光地カード1</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">画像</label>
                        <ImageUpload
                          value={formData.sightseeingCard1Image}
                          onChange={(imageUrl) => setFormData({ ...formData, sightseeingCard1Image: imageUrl })}
                          type="locations"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">タイトル</label>
                        <input
                          type="text"
                          name="sightseeingCard1Title"
                          value={formData.sightseeingCard1Title}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 観光地カード2 */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">観光地カード2</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">画像</label>
                        <ImageUpload
                          value={formData.sightseeingCard2Image}
                          onChange={(imageUrl) => setFormData({ ...formData, sightseeingCard2Image: imageUrl })}
                          type="locations"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">タイトル</label>
                        <input
                          type="text"
                          name="sightseeingCard2Title"
                          value={formData.sightseeingCard2Title}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 観光地カード3 */}
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-semibold mb-4">観光地カード3</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">画像</label>
                        <ImageUpload
                          value={formData.sightseeingCard3Image}
                          onChange={(imageUrl) => setFormData({ ...formData, sightseeingCard3Image: imageUrl })}
                          type="locations"
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">タイトル</label>
                        <input
                          type="text"
                          name="sightseeingCard3Title"
                          value={formData.sightseeingCard3Title}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>

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
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? '追加中...' : 'ロケーションを追加'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ロケーション一覧 */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">ロケーション一覧</h2>
            </div>
            
            {locations.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                ロケーション情報がありません
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {locations.map((location) => (
                  <div key={location.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {editingId === location.id ? (
                          // 編集モード
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  Slug <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  name="slug"
                                  value={editingData.slug || ''}
                                  onChange={handleEditInputChange}
                                  required
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  国名 <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  name="country"
                                  value={editingData.country || ''}
                                  onChange={handleEditInputChange}
                                  required
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                  City名 <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  name="city"
                                  value={editingData.city || ''}
                                  onChange={handleEditInputChange}
                                  required
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-700 mb-1">説明文（カード上部の日本語テキスト）</label>
                                <input
                                  type="text"
                                  name="description"
                                  value={editingData.description || ''}
                                  onChange={handleEditInputChange}
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="ルスツリゾートの山頂に佇む建築"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-700 mb-1">Top画像</label>
                                <ImageUpload
                                  value={editingData.topImageUrl || ''}
                                  onChange={(imageUrl) => setEditingData(prev => ({ ...prev, topImageUrl: imageUrl }))}
                                  type="locations"
                                  className="w-full"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-700 mb-1">地図画像</label>
                                <ImageUpload
                                  value={editingData.mapImageUrl || ''}
                                  onChange={(imageUrl) => setEditingData(prev => ({ ...prev, mapImageUrl: imageUrl }))}
                                  type="locations"
                                  className="w-full"
                                />
                              </div>
                              
                              {/* 企業カード1 */}
                              <div className="md:col-span-2">
                                <h4 className="text-sm font-semibold mb-2">企業カード1</h4>
                                <div className="space-y-2">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">画像</label>
                                    <ImageUpload
                                      value={editingData.companyCard1Image || ''}
                                      onChange={(imageUrl) => setEditingData(prev => ({ ...prev, companyCard1Image: imageUrl }))}
                                      type="locations"
                                      className="w-full"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">企業名</label>
                                    <input
                                      type="text"
                                      name="companyCard1Name"
                                      value={editingData.companyCard1Name || ''}
                                      onChange={handleEditInputChange}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">説明文（写真上）</label>
                                    <textarea
                                      name="companyCard1DescTop"
                                      value={editingData.companyCard1DescTop || ''}
                                      onChange={handleEditInputChange}
                                      rows={2}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">説明文（写真下）</label>
                                    <textarea
                                      name="companyCard1DescBottom"
                                      value={editingData.companyCard1DescBottom || ''}
                                      onChange={handleEditInputChange}
                                      rows={2}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              {/* 企業カード2 */}
                              <div className="md:col-span-2">
                                <h4 className="text-sm font-semibold mb-2">企業カード2</h4>
                                <div className="space-y-2">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">画像</label>
                                    <ImageUpload
                                      value={editingData.companyCard2Image || ''}
                                      onChange={(imageUrl) => setEditingData(prev => ({ ...prev, companyCard2Image: imageUrl }))}
                                      type="locations"
                                      className="w-full"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">企業名</label>
                                    <input
                                      type="text"
                                      name="companyCard2Name"
                                      value={editingData.companyCard2Name || ''}
                                      onChange={handleEditInputChange}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">説明文（写真上）</label>
                                    <textarea
                                      name="companyCard2DescTop"
                                      value={editingData.companyCard2DescTop || ''}
                                      onChange={handleEditInputChange}
                                      rows={2}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">説明文（写真下）</label>
                                    <textarea
                                      name="companyCard2DescBottom"
                                      value={editingData.companyCard2DescBottom || ''}
                                      onChange={handleEditInputChange}
                                      rows={2}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              {/* 企業カード3 */}
                              <div className="md:col-span-2">
                                <h4 className="text-sm font-semibold mb-2">企業カード3</h4>
                                <div className="space-y-2">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">画像</label>
                                    <ImageUpload
                                      value={editingData.companyCard3Image || ''}
                                      onChange={(imageUrl) => setEditingData(prev => ({ ...prev, companyCard3Image: imageUrl }))}
                                      type="locations"
                                      className="w-full"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">企業名</label>
                                    <input
                                      type="text"
                                      name="companyCard3Name"
                                      value={editingData.companyCard3Name || ''}
                                      onChange={handleEditInputChange}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">説明文（写真上）</label>
                                    <textarea
                                      name="companyCard3DescTop"
                                      value={editingData.companyCard3DescTop || ''}
                                      onChange={handleEditInputChange}
                                      rows={2}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">説明文（写真下）</label>
                                    <textarea
                                      name="companyCard3DescBottom"
                                      value={editingData.companyCard3DescBottom || ''}
                                      onChange={handleEditInputChange}
                                      rows={2}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              {/* 体験ブログカード1 */}
                              <div className="md:col-span-2">
                                <h4 className="text-sm font-semibold mb-2">体験ブログカード1</h4>
                                <div className="space-y-2">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">画像</label>
                                    <ImageUpload
                                      value={editingData.experienceCard1Image || ''}
                                      onChange={(imageUrl) => setEditingData(prev => ({ ...prev, experienceCard1Image: imageUrl }))}
                                      type="locations"
                                      className="w-full"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">タイトル</label>
                                    <input
                                      type="text"
                                      name="experienceCard1Title"
                                      value={editingData.experienceCard1Title || ''}
                                      onChange={handleEditInputChange}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">URL</label>
                                    <input
                                      type="url"
                                      name="experienceCard1Url"
                                      value={editingData.experienceCard1Url || ''}
                                      onChange={handleEditInputChange}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              {/* 体験ブログカード2 */}
                              <div className="md:col-span-2">
                                <h4 className="text-sm font-semibold mb-2">体験ブログカード2</h4>
                                <div className="space-y-2">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">画像</label>
                                    <ImageUpload
                                      value={editingData.experienceCard2Image || ''}
                                      onChange={(imageUrl) => setEditingData(prev => ({ ...prev, experienceCard2Image: imageUrl }))}
                                      type="locations"
                                      className="w-full"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">タイトル</label>
                                    <input
                                      type="text"
                                      name="experienceCard2Title"
                                      value={editingData.experienceCard2Title || ''}
                                      onChange={handleEditInputChange}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">URL</label>
                                    <input
                                      type="url"
                                      name="experienceCard2Url"
                                      value={editingData.experienceCard2Url || ''}
                                      onChange={handleEditInputChange}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              {/* 体験ブログカード3 */}
                              <div className="md:col-span-2">
                                <h4 className="text-sm font-semibold mb-2">体験ブログカード3</h4>
                                <div className="space-y-2">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">画像</label>
                                    <ImageUpload
                                      value={editingData.experienceCard3Image || ''}
                                      onChange={(imageUrl) => setEditingData(prev => ({ ...prev, experienceCard3Image: imageUrl }))}
                                      type="locations"
                                      className="w-full"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">タイトル</label>
                                    <input
                                      type="text"
                                      name="experienceCard3Title"
                                      value={editingData.experienceCard3Title || ''}
                                      onChange={handleEditInputChange}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">URL</label>
                                    <input
                                      type="url"
                                      name="experienceCard3Url"
                                      value={editingData.experienceCard3Url || ''}
                                      onChange={handleEditInputChange}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              {/* 観光地カード1 */}
                              <div className="md:col-span-2">
                                <h4 className="text-sm font-semibold mb-2">観光地カード1</h4>
                                <div className="space-y-2">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">画像</label>
                                    <ImageUpload
                                      value={editingData.sightseeingCard1Image || ''}
                                      onChange={(imageUrl) => setEditingData(prev => ({ ...prev, sightseeingCard1Image: imageUrl }))}
                                      type="locations"
                                      className="w-full"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">タイトル</label>
                                    <input
                                      type="text"
                                      name="sightseeingCard1Title"
                                      value={editingData.sightseeingCard1Title || ''}
                                      onChange={handleEditInputChange}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              {/* 観光地カード2 */}
                              <div className="md:col-span-2">
                                <h4 className="text-sm font-semibold mb-2">観光地カード2</h4>
                                <div className="space-y-2">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">画像</label>
                                    <ImageUpload
                                      value={editingData.sightseeingCard2Image || ''}
                                      onChange={(imageUrl) => setEditingData(prev => ({ ...prev, sightseeingCard2Image: imageUrl }))}
                                      type="locations"
                                      className="w-full"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">タイトル</label>
                                    <input
                                      type="text"
                                      name="sightseeingCard2Title"
                                      value={editingData.sightseeingCard2Title || ''}
                                      onChange={handleEditInputChange}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                    />
                                  </div>
                                </div>
                              </div>
                              
                              {/* 観光地カード3 */}
                              <div className="md:col-span-2">
                                <h4 className="text-sm font-semibold mb-2">観光地カード3</h4>
                                <div className="space-y-2">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">画像</label>
                                    <ImageUpload
                                      value={editingData.sightseeingCard3Image || ''}
                                      onChange={(imageUrl) => setEditingData(prev => ({ ...prev, sightseeingCard3Image: imageUrl }))}
                                      type="locations"
                                      className="w-full"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">タイトル</label>
                                    <input
                                      type="text"
                                      name="sightseeingCard3Title"
                                      value={editingData.sightseeingCard3Title || ''}
                                      onChange={handleEditInputChange}
                                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // 表示モード
                          <div className="flex items-center gap-3">
                            <MapPin className="h-5 w-5 text-gray-400" />
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {location.city} ({location.country})
                              </h3>
                              <p className="text-sm text-gray-500">Slug: {location.slug}</p>
                              <p className="text-xs text-gray-400 mt-1">
                                更新日: {new Date(location.updatedAt).toLocaleDateString('ja-JP')}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                        {editingId === location.id ? (
                          // 編集モードのボタン
                          <>
                            <button
                              onClick={() => saveEdit(location.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="保存"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                              title="キャンセル"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          // 表示モードのボタン
                          <>
                            <button
                              onClick={() => startEditing(location)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="編集"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <Link
                              href={`/workspace/${location.slug}`}
                              target="_blank"
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="プレビュー"
                            >
                              <MapPin className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => deleteLocation(location.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="削除"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </>
                        )}
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

