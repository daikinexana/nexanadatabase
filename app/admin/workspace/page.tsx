"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import AdminGuard from "@/components/admin/admin-guard";
import AdminNav from "@/components/ui/admin-nav";
import { Briefcase, Plus, Edit, Trash2, Save, X } from "lucide-react";
import SimpleImage from "@/components/ui/simple-image";
import ImageUpload from "@/components/ui/image-upload";

interface Workspace {
  id: string;
  name: string;
  imageUrl?: string;
  country: string;
  city: string;
  address?: string;
  officialLink?: string;
  businessHours?: string;
  hasDropin: boolean;
  hasNexana: boolean;
  hasMeetingRoom: boolean;
  hasPhoneBooth: boolean;
  hasWifi: boolean;
  hasParking: boolean;
  priceTable?: string;
  rental?: string;
  notes?: string;
  operator?: string;
  management?: string;
  tenantCard1Title?: string;
  tenantCard1Desc?: string;
  tenantCard1Image?: string;
  tenantCard2Title?: string;
  tenantCard2Desc?: string;
  tenantCard2Image?: string;
  tenantCard3Title?: string;
  tenantCard3Desc?: string;
  tenantCard3Image?: string;
  communityManagerImage?: string;
  communityManagerTitle?: string;
  communityManagerDesc?: string;
  communityManagerContact?: string;
  facilityCard1Title?: string;
  facilityCard1Desc?: string;
  facilityCard1Image?: string;
  facilityCard2Title?: string;
  facilityCard2Desc?: string;
  facilityCard2Image?: string;
  facilityCard3Title?: string;
  facilityCard3Desc?: string;
  facilityCard3Image?: string;
  facilityCard4Title?: string;
  facilityCard4Desc?: string;
  facilityCard4Image?: string;
  facilityCard5Title?: string;
  facilityCard5Desc?: string;
  facilityCard5Image?: string;
  facilityCard6Title?: string;
  facilityCard6Desc?: string;
  facilityCard6Image?: string;
  facilityCard7Title?: string;
  facilityCard7Desc?: string;
  facilityCard7Image?: string;
  facilityCard8Title?: string;
  facilityCard8Desc?: string;
  facilityCard8Image?: string;
  facilityCard9Title?: string;
  facilityCard9Desc?: string;
  facilityCard9Image?: string;
  nearbyHotelTitle?: string;
  nearbyHotelDesc?: string;
  nearbyHotelUrl?: string;
  nearbyHotelImage1?: string;
  nearbyHotelImage2?: string;
  nearbyHotelImage3?: string;
  nearbyHotelImage4?: string;
  nearbyHotelImage5?: string;
  nearbyHotelImage6?: string;
  nearbyHotelImage7?: string;
  nearbyHotelImage8?: string;
  nearbyHotelImage9?: string;
  nearbyFood1Title?: string;
  nearbyFood1Desc?: string;
  nearbyFood1Image?: string;
  nearbyFood2Title?: string;
  nearbyFood2Desc?: string;
  nearbyFood2Image?: string;
  nearbyFood3Title?: string;
  nearbyFood3Desc?: string;
  nearbyFood3Image?: string;
  nearbySpot1Title?: string;
  nearbySpot1Desc?: string;
  nearbySpot1Image?: string;
  nearbySpot2Title?: string;
  nearbySpot2Desc?: string;
  nearbySpot2Image?: string;
  nearbySpot3Title?: string;
  nearbySpot3Desc?: string;
  nearbySpot3Image?: string;
  locationId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminWorkspacePage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [locations, setLocations] = useState<Array<{ id: string; slug: string; city: string; country: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<Workspace>>({});
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    country: '',
    city: '',
    address: '',
    officialLink: '',
    businessHours: '',
    hasDropin: false,
    hasNexana: false,
    hasMeetingRoom: false,
    hasPhoneBooth: false,
    hasWifi: false,
    hasParking: false,
    priceTable: '',
    rental: '',
    notes: '',
    operator: '',
    management: '',
    locationId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchWorkspaces();
    fetchLocations();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const response = await fetch(`/api/workspace?_t=${timestamp}&_r=${random}`, {
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
        const sortedData = data.sort((a: Workspace, b: Workspace) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setWorkspaces(sortedData);
      }
    } catch (error) {
      console.error('ワークスペース情報の取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/location');
      if (response.ok) {
        const data = await response.json();
        setLocations(data);
      }
    } catch (error) {
      console.error('ロケーション情報の取得に失敗しました:', error);
    }
  };

  const deleteWorkspace = async (id: string) => {
    if (!confirm('このワークスペース情報を削除しますか？')) return;

    try {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const response = await fetch(`/api/workspace/${id}?_t=${timestamp}&_r=${random}`, {
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
        await fetchWorkspaces();
      }
    } catch (error) {
      console.error('削除に失敗しました:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const startEditing = (workspace: Workspace) => {
    setEditingId(workspace.id);
    setEditingData({
      name: workspace.name,
      imageUrl: workspace.imageUrl,
      country: workspace.country,
      city: workspace.city,
      address: workspace.address,
      officialLink: workspace.officialLink,
      businessHours: workspace.businessHours,
      hasDropin: workspace.hasDropin,
      hasNexana: workspace.hasNexana,
      hasMeetingRoom: workspace.hasMeetingRoom,
      hasPhoneBooth: workspace.hasPhoneBooth,
      hasWifi: workspace.hasWifi,
      hasParking: workspace.hasParking,
      priceTable: workspace.priceTable,
      rental: workspace.rental,
      notes: workspace.notes,
      operator: workspace.operator,
      management: workspace.management,
      locationId: workspace.locationId,
      tenantCard1Title: workspace.tenantCard1Title,
      tenantCard1Desc: workspace.tenantCard1Desc,
      tenantCard1Image: workspace.tenantCard1Image,
      tenantCard2Title: workspace.tenantCard2Title,
      tenantCard2Desc: workspace.tenantCard2Desc,
      tenantCard2Image: workspace.tenantCard2Image,
      tenantCard3Title: workspace.tenantCard3Title,
      tenantCard3Desc: workspace.tenantCard3Desc,
      tenantCard3Image: workspace.tenantCard3Image,
      communityManagerImage: workspace.communityManagerImage,
      communityManagerTitle: workspace.communityManagerTitle,
      communityManagerDesc: workspace.communityManagerDesc,
      communityManagerContact: workspace.communityManagerContact,
      facilityCard1Title: workspace.facilityCard1Title,
      facilityCard1Desc: workspace.facilityCard1Desc,
      facilityCard1Image: workspace.facilityCard1Image,
      facilityCard2Title: workspace.facilityCard2Title,
      facilityCard2Desc: workspace.facilityCard2Desc,
      facilityCard2Image: workspace.facilityCard2Image,
      facilityCard3Title: workspace.facilityCard3Title,
      facilityCard3Desc: workspace.facilityCard3Desc,
      facilityCard3Image: workspace.facilityCard3Image,
      facilityCard4Title: workspace.facilityCard4Title,
      facilityCard4Desc: workspace.facilityCard4Desc,
      facilityCard4Image: workspace.facilityCard4Image,
      facilityCard5Title: workspace.facilityCard5Title,
      facilityCard5Desc: workspace.facilityCard5Desc,
      facilityCard5Image: workspace.facilityCard5Image,
      facilityCard6Title: workspace.facilityCard6Title,
      facilityCard6Desc: workspace.facilityCard6Desc,
      facilityCard6Image: workspace.facilityCard6Image,
      facilityCard7Title: workspace.facilityCard7Title,
      facilityCard7Desc: workspace.facilityCard7Desc,
      facilityCard7Image: workspace.facilityCard7Image,
      facilityCard8Title: workspace.facilityCard8Title,
      facilityCard8Desc: workspace.facilityCard8Desc,
      facilityCard8Image: workspace.facilityCard8Image,
      facilityCard9Title: workspace.facilityCard9Title,
      facilityCard9Desc: workspace.facilityCard9Desc,
      facilityCard9Image: workspace.facilityCard9Image,
      nearbyHotelTitle: workspace.nearbyHotelTitle,
      nearbyHotelDesc: workspace.nearbyHotelDesc,
      nearbyHotelUrl: workspace.nearbyHotelUrl,
      nearbyHotelImage1: workspace.nearbyHotelImage1,
      nearbyHotelImage2: workspace.nearbyHotelImage2,
      nearbyHotelImage3: workspace.nearbyHotelImage3,
      nearbyHotelImage4: workspace.nearbyHotelImage4,
      nearbyHotelImage5: workspace.nearbyHotelImage5,
      nearbyHotelImage6: workspace.nearbyHotelImage6,
      nearbyHotelImage7: workspace.nearbyHotelImage7,
      nearbyHotelImage8: workspace.nearbyHotelImage8,
      nearbyHotelImage9: workspace.nearbyHotelImage9,
      nearbyFood1Title: workspace.nearbyFood1Title,
      nearbyFood1Desc: workspace.nearbyFood1Desc,
      nearbyFood1Image: workspace.nearbyFood1Image,
      nearbyFood2Title: workspace.nearbyFood2Title,
      nearbyFood2Desc: workspace.nearbyFood2Desc,
      nearbyFood2Image: workspace.nearbyFood2Image,
      nearbyFood3Title: workspace.nearbyFood3Title,
      nearbyFood3Desc: workspace.nearbyFood3Desc,
      nearbyFood3Image: workspace.nearbyFood3Image,
      nearbySpot1Title: workspace.nearbySpot1Title,
      nearbySpot1Desc: workspace.nearbySpot1Desc,
      nearbySpot1Image: workspace.nearbySpot1Image,
      nearbySpot2Title: workspace.nearbySpot2Title,
      nearbySpot2Desc: workspace.nearbySpot2Desc,
      nearbySpot2Image: workspace.nearbySpot2Image,
      nearbySpot3Title: workspace.nearbySpot3Title,
      nearbySpot3Desc: workspace.nearbySpot3Desc,
      nearbySpot3Image: workspace.nearbySpot3Image,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingData({});
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setEditingData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const saveEdit = async (id: string) => {
    try {
      const dataToSend = { ...editingData };

      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const response = await fetch(`/api/workspace/${id}?_t=${timestamp}&_r=${random}`, {
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

      if (response.ok) {
        await fetchWorkspaces();
        setEditingId(null);
        setEditingData({});
        alert('ワークスペースが正常に更新されました');
      } else {
        const error = await response.json();
        alert(`エラー: ${error.error || 'ワークスペースの更新に失敗しました'}`);
      }
    } catch (error) {
      console.error('ワークスペースの更新に失敗しました:', error);
      alert('ワークスペースの更新に失敗しました');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const response = await fetch(`/api/workspace?_t=${timestamp}&_r=${random}`, {
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
        body: JSON.stringify({
          ...formData,
          locationId: formData.locationId || null,
        }),
      });

      if (response.ok) {
        await fetchWorkspaces();
        setFormData({
          name: '',
          imageUrl: '',
          country: '',
          city: '',
          address: '',
          officialLink: '',
          businessHours: '',
          hasDropin: false,
          hasNexana: false,
          hasMeetingRoom: false,
          hasPhoneBooth: false,
          hasWifi: false,
          hasParking: false,
          priceTable: '',
          rental: '',
          notes: '',
          operator: '',
          management: '',
          locationId: '',
        });
        setShowCreateForm(false);
        alert('ワークスペースが正常に追加されました');
      } else {
        const error = await response.json();
        alert(`エラー: ${error.error || 'ワークスペースの追加に失敗しました'}`);
      }
    } catch (error) {
      console.error('ワークスペースの追加に失敗しました:', error);
      alert('ワークスペースの追加に失敗しました');
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">ワークスペース管理</h1>
                <p className="text-gray-600">ワークスペース情報の管理と編集を行います</p>
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
              新しいワークスペースを追加
            </button>
          </div>

          {showCreateForm && (
            <div className="mb-8 bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">新しいワークスペースを追加</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      施設名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      国 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      都道府県 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      施設写真
                    </label>
                    <ImageUpload
                      value={formData.imageUrl}
                      onChange={(imageUrl) => setFormData({ ...formData, imageUrl })}
                      type="workspaces"
                      className="w-full"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      施設住所
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      施設公式リンク
                    </label>
                    <input
                      type="url"
                      name="officialLink"
                      value={formData.officialLink}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      営業時間
                    </label>
                    <textarea
                      name="businessHours"
                      value={formData.businessHours}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      施設設備
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="hasDropin"
                          checked={formData.hasDropin}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">ドロップイン</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="hasNexana"
                          checked={formData.hasNexana}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">nexana</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="hasMeetingRoom"
                          checked={formData.hasMeetingRoom}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">会議室</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="hasPhoneBooth"
                          checked={formData.hasPhoneBooth}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">フォンブース</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="hasWifi"
                          checked={formData.hasWifi}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">WiFi</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="hasParking"
                          checked={formData.hasParking}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">駐車場</span>
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      料金表
                    </label>
                    <textarea
                      name="priceTable"
                      value={formData.priceTable}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      貸し出し
                    </label>
                    <textarea
                      name="rental"
                      value={formData.rental}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      補足事項
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      主体
                    </label>
                    <input
                      type="text"
                      name="operator"
                      value={formData.operator}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      運営
                    </label>
                    <input
                      type="text"
                      name="management"
                      value={formData.management}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      関連ロケーション
                    </label>
                    <select
                      name="locationId"
                      value={formData.locationId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      <option value="">選択してください</option>
                      {locations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.city} ({location.country})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSubmitting ? '追加中...' : 'ワークスペースを追加'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ワークスペース一覧 */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">ワークスペース一覧</h2>
            </div>
            
            {workspaces.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                ワークスペース情報がありません
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {workspaces.map((workspace) => (
                  <div key={workspace.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        {workspace.imageUrl && (
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                            <SimpleImage
                              src={workspace.imageUrl}
                              alt={workspace.name}
                              width={80}
                              height={80}
                              className="w-20 h-20 object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          {editingId === workspace.id ? (
                            // 編集モード
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    施設名 <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    name="name"
                                    value={editingData.name || ''}
                                    onChange={handleEditInputChange}
                                    required
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    国 <span className="text-red-500">*</span>
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
                                    都道府県 <span className="text-red-500">*</span>
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
                                  <label className="block text-xs font-medium text-gray-700 mb-1">施設写真</label>
                                  <ImageUpload
                                    value={editingData.imageUrl || ''}
                                    onChange={(imageUrl) => setEditingData(prev => ({ ...prev, imageUrl }))}
                                    type="workspaces"
                                    className="w-full"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-xs font-medium text-gray-700 mb-1">施設住所</label>
                                  <input
                                    type="text"
                                    name="address"
                                    value={editingData.address || ''}
                                    onChange={handleEditInputChange}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-xs font-medium text-gray-700 mb-1">施設公式リンク</label>
                                  <input
                                    type="url"
                                    name="officialLink"
                                    value={editingData.officialLink || ''}
                                    onChange={handleEditInputChange}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-xs font-medium text-gray-700 mb-1">営業時間</label>
                                  <textarea
                                    name="businessHours"
                                    value={editingData.businessHours || ''}
                                    onChange={handleEditInputChange}
                                    rows={2}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-xs font-medium text-gray-700 mb-1">施設設備</label>
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    <label className="flex items-center">
                                      <input
                                        type="checkbox"
                                        name="hasDropin"
                                        checked={editingData.hasDropin || false}
                                        onChange={(e) => setEditingData(prev => ({ ...prev, hasDropin: e.target.checked }))}
                                        className="h-3 w-3 text-blue-600"
                                      />
                                      <span className="ml-2 text-xs text-gray-700">ドロップイン</span>
                                    </label>
                                    <label className="flex items-center">
                                      <input
                                        type="checkbox"
                                        name="hasNexana"
                                        checked={editingData.hasNexana || false}
                                        onChange={(e) => setEditingData(prev => ({ ...prev, hasNexana: e.target.checked }))}
                                        className="h-3 w-3 text-blue-600"
                                      />
                                      <span className="ml-2 text-xs text-gray-700">nexana</span>
                                    </label>
                                    <label className="flex items-center">
                                      <input
                                        type="checkbox"
                                        name="hasMeetingRoom"
                                        checked={editingData.hasMeetingRoom || false}
                                        onChange={(e) => setEditingData(prev => ({ ...prev, hasMeetingRoom: e.target.checked }))}
                                        className="h-3 w-3 text-blue-600"
                                      />
                                      <span className="ml-2 text-xs text-gray-700">会議室</span>
                                    </label>
                                    <label className="flex items-center">
                                      <input
                                        type="checkbox"
                                        name="hasPhoneBooth"
                                        checked={editingData.hasPhoneBooth || false}
                                        onChange={(e) => setEditingData(prev => ({ ...prev, hasPhoneBooth: e.target.checked }))}
                                        className="h-3 w-3 text-blue-600"
                                      />
                                      <span className="ml-2 text-xs text-gray-700">フォンブース</span>
                                    </label>
                                    <label className="flex items-center">
                                      <input
                                        type="checkbox"
                                        name="hasWifi"
                                        checked={editingData.hasWifi || false}
                                        onChange={(e) => setEditingData(prev => ({ ...prev, hasWifi: e.target.checked }))}
                                        className="h-3 w-3 text-blue-600"
                                      />
                                      <span className="ml-2 text-xs text-gray-700">WiFi</span>
                                    </label>
                                    <label className="flex items-center">
                                      <input
                                        type="checkbox"
                                        name="hasParking"
                                        checked={editingData.hasParking || false}
                                        onChange={(e) => setEditingData(prev => ({ ...prev, hasParking: e.target.checked }))}
                                        className="h-3 w-3 text-blue-600"
                                      />
                                      <span className="ml-2 text-xs text-gray-700">駐車場</span>
                                    </label>
                                  </div>
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-xs font-medium text-gray-700 mb-1">料金表</label>
                                  <textarea
                                    name="priceTable"
                                    value={editingData.priceTable || ''}
                                    onChange={handleEditInputChange}
                                    rows={3}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-xs font-medium text-gray-700 mb-1">貸し出し</label>
                                  <textarea
                                    name="rental"
                                    value={editingData.rental || ''}
                                    onChange={handleEditInputChange}
                                    rows={2}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-xs font-medium text-gray-700 mb-1">補足事項</label>
                                  <textarea
                                    name="notes"
                                    value={editingData.notes || ''}
                                    onChange={handleEditInputChange}
                                    rows={2}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">主体</label>
                                  <input
                                    type="text"
                                    name="operator"
                                    value={editingData.operator || ''}
                                    onChange={handleEditInputChange}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">運営</label>
                                  <input
                                    type="text"
                                    name="management"
                                    value={editingData.management || ''}
                                    onChange={handleEditInputChange}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-xs font-medium text-gray-700 mb-1">関連ロケーション</label>
                                  <select
                                    name="locationId"
                                    value={editingData.locationId || ''}
                                    onChange={handleEditInputChange}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                  >
                                    <option value="">選択してください</option>
                                    {locations.map((location) => (
                                      <option key={location.id} value={location.id}>
                                        {location.city} ({location.country})
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                
                                {/* 入居企業カード1 */}
                                <div className="md:col-span-2">
                                  <h4 className="text-sm font-semibold mb-2">入居企業カード1</h4>
                                  <div className="space-y-2">
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">タイトル</label>
                                      <input
                                        type="text"
                                        name="tenantCard1Title"
                                        value={editingData.tenantCard1Title || ''}
                                        onChange={handleEditInputChange}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">説明</label>
                                      <textarea
                                        name="tenantCard1Desc"
                                        value={editingData.tenantCard1Desc || ''}
                                        onChange={handleEditInputChange}
                                        rows={2}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">画像</label>
                                      <ImageUpload
                                        value={editingData.tenantCard1Image || ''}
                                        onChange={(imageUrl) => setEditingData(prev => ({ ...prev, tenantCard1Image: imageUrl }))}
                                        type="workspaces"
                                        className="w-full"
                                      />
                                    </div>
                                  </div>
                                </div>
                                
                                {/* 入居企業カード2 */}
                                <div className="md:col-span-2">
                                  <h4 className="text-sm font-semibold mb-2">入居企業カード2</h4>
                                  <div className="space-y-2">
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">タイトル</label>
                                      <input
                                        type="text"
                                        name="tenantCard2Title"
                                        value={editingData.tenantCard2Title || ''}
                                        onChange={handleEditInputChange}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">説明</label>
                                      <textarea
                                        name="tenantCard2Desc"
                                        value={editingData.tenantCard2Desc || ''}
                                        onChange={handleEditInputChange}
                                        rows={2}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">画像</label>
                                      <ImageUpload
                                        value={editingData.tenantCard2Image || ''}
                                        onChange={(imageUrl) => setEditingData(prev => ({ ...prev, tenantCard2Image: imageUrl }))}
                                        type="workspaces"
                                        className="w-full"
                                      />
                                    </div>
                                  </div>
                                </div>
                                
                                {/* 入居企業カード3 */}
                                <div className="md:col-span-2">
                                  <h4 className="text-sm font-semibold mb-2">入居企業カード3</h4>
                                  <div className="space-y-2">
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">タイトル</label>
                                      <input
                                        type="text"
                                        name="tenantCard3Title"
                                        value={editingData.tenantCard3Title || ''}
                                        onChange={handleEditInputChange}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">説明</label>
                                      <textarea
                                        name="tenantCard3Desc"
                                        value={editingData.tenantCard3Desc || ''}
                                        onChange={handleEditInputChange}
                                        rows={2}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">画像</label>
                                      <ImageUpload
                                        value={editingData.tenantCard3Image || ''}
                                        onChange={(imageUrl) => setEditingData(prev => ({ ...prev, tenantCard3Image: imageUrl }))}
                                        type="workspaces"
                                        className="w-full"
                                      />
                                    </div>
                                  </div>
                                </div>
                                
                                {/* コミュニティーマネージャー */}
                                <div className="md:col-span-2">
                                  <h4 className="text-sm font-semibold mb-2">コミュニティーマネージャー</h4>
                                  <div className="space-y-2">
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">画像</label>
                                      <ImageUpload
                                        value={editingData.communityManagerImage || ''}
                                        onChange={(imageUrl) => setEditingData(prev => ({ ...prev, communityManagerImage: imageUrl }))}
                                        type="workspaces"
                                        className="w-full"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">タイトル</label>
                                      <input
                                        type="text"
                                        name="communityManagerTitle"
                                        value={editingData.communityManagerTitle || ''}
                                        onChange={handleEditInputChange}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">説明</label>
                                      <textarea
                                        name="communityManagerDesc"
                                        value={editingData.communityManagerDesc || ''}
                                        onChange={handleEditInputChange}
                                        rows={2}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-700 mb-1">連絡先</label>
                                      <input
                                        type="text"
                                        name="communityManagerContact"
                                        value={editingData.communityManagerContact || ''}
                                        onChange={handleEditInputChange}
                                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* 施設紹介カードと周辺情報は折りたたみ可能にするか、別のセクションに */}
                              <details className="mt-4">
                                <summary className="text-sm font-semibold text-gray-700 cursor-pointer hover:text-gray-900">
                                  施設紹介カード・周辺情報（クリックで展開）
                                </summary>
                                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {/* 施設紹介カード1-9 */}
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                    <div key={num} className="md:col-span-2">
                                      <h4 className="text-xs font-semibold mb-2">施設紹介カード{num}</h4>
                                      <div className="space-y-2">
                                        <div>
                                          <label className="block text-xs font-medium text-gray-700 mb-1">タイトル</label>
                                          <input
                                            type="text"
                                            name={`facilityCard${num}Title`}
                                            value={editingData[`facilityCard${num}Title` as keyof typeof editingData] as string || ''}
                                            onChange={handleEditInputChange}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-xs font-medium text-gray-700 mb-1">説明</label>
                                          <textarea
                                            name={`facilityCard${num}Desc`}
                                            value={editingData[`facilityCard${num}Desc` as keyof typeof editingData] as string || ''}
                                            onChange={handleEditInputChange}
                                            rows={2}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-xs font-medium text-gray-700 mb-1">画像</label>
                                          <ImageUpload
                                            value={editingData[`facilityCard${num}Image` as keyof typeof editingData] as string || ''}
                                            onChange={(imageUrl) => setEditingData(prev => ({ ...prev, [`facilityCard${num}Image`]: imageUrl }))}
                                            type="workspaces"
                                            className="w-full"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  
                                  {/* 周辺ホテル情報 */}
                                  <div className="md:col-span-2">
                                    <h4 className="text-xs font-semibold mb-2">周辺ホテル情報</h4>
                                    <div className="space-y-2">
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">タイトル</label>
                                        <input
                                          type="text"
                                          name="nearbyHotelTitle"
                                          value={editingData.nearbyHotelTitle || ''}
                                          onChange={handleEditInputChange}
                                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">説明</label>
                                        <textarea
                                          name="nearbyHotelDesc"
                                          value={editingData.nearbyHotelDesc || ''}
                                          onChange={handleEditInputChange}
                                          rows={2}
                                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">URL</label>
                                        <input
                                          type="url"
                                          name="nearbyHotelUrl"
                                          value={editingData.nearbyHotelUrl || ''}
                                          onChange={handleEditInputChange}
                                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">画像（最大9枚）</label>
                                        <div className="grid grid-cols-3 gap-2">
                                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                            <ImageUpload
                                              key={num}
                                              value={editingData[`nearbyHotelImage${num}` as keyof typeof editingData] as string || ''}
                                              onChange={(imageUrl) => setEditingData(prev => ({ ...prev, [`nearbyHotelImage${num}`]: imageUrl }))}
                                              type="workspaces"
                                              className="w-full"
                                            />
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* 周辺Food情報 */}
                                  {[1, 2, 3].map((num) => (
                                    <div key={num} className="md:col-span-2">
                                      <h4 className="text-xs font-semibold mb-2">周辺Food情報{num}</h4>
                                      <div className="space-y-2">
                                        <div>
                                          <label className="block text-xs font-medium text-gray-700 mb-1">タイトル</label>
                                          <input
                                            type="text"
                                            name={`nearbyFood${num}Title`}
                                            value={editingData[`nearbyFood${num}Title` as keyof typeof editingData] as string || ''}
                                            onChange={handleEditInputChange}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-xs font-medium text-gray-700 mb-1">説明</label>
                                          <textarea
                                            name={`nearbyFood${num}Desc`}
                                            value={editingData[`nearbyFood${num}Desc` as keyof typeof editingData] as string || ''}
                                            onChange={handleEditInputChange}
                                            rows={2}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-xs font-medium text-gray-700 mb-1">画像</label>
                                          <ImageUpload
                                            value={editingData[`nearbyFood${num}Image` as keyof typeof editingData] as string || ''}
                                            onChange={(imageUrl) => setEditingData(prev => ({ ...prev, [`nearbyFood${num}Image`]: imageUrl }))}
                                            type="workspaces"
                                            className="w-full"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                  
                                  {/* 周辺スポット情報 */}
                                  {[1, 2, 3].map((num) => (
                                    <div key={num} className="md:col-span-2">
                                      <h4 className="text-xs font-semibold mb-2">周辺スポット情報{num}</h4>
                                      <div className="space-y-2">
                                        <div>
                                          <label className="block text-xs font-medium text-gray-700 mb-1">タイトル</label>
                                          <input
                                            type="text"
                                            name={`nearbySpot${num}Title`}
                                            value={editingData[`nearbySpot${num}Title` as keyof typeof editingData] as string || ''}
                                            onChange={handleEditInputChange}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-xs font-medium text-gray-700 mb-1">説明</label>
                                          <textarea
                                            name={`nearbySpot${num}Desc`}
                                            value={editingData[`nearbySpot${num}Desc` as keyof typeof editingData] as string || ''}
                                            onChange={handleEditInputChange}
                                            rows={2}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                          />
                                        </div>
                                        <div>
                                          <label className="block text-xs font-medium text-gray-700 mb-1">画像</label>
                                          <ImageUpload
                                            value={editingData[`nearbySpot${num}Image` as keyof typeof editingData] as string || ''}
                                            onChange={(imageUrl) => setEditingData(prev => ({ ...prev, [`nearbySpot${num}Image`]: imageUrl }))}
                                            type="workspaces"
                                            className="w-full"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </details>
                            </div>
                          ) : (
                            // 表示モード
                            <>
                              <div className="flex items-center gap-3">
                                <Briefcase className="h-5 w-5 text-gray-400" />
                                <h3 className="text-lg font-medium text-gray-900">
                                  {workspace.name}
                                </h3>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                {workspace.country} / {workspace.city}
                              </p>
                              {workspace.address && (
                                <p className="text-sm text-gray-600 mt-1">{workspace.address}</p>
                              )}
                              <p className="text-xs text-gray-400 mt-1">
                                更新日: {new Date(workspace.updatedAt).toLocaleDateString('ja-JP')}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {editingId === workspace.id ? (
                          // 編集モードのボタン
                          <>
                            <button
                              onClick={() => saveEdit(workspace.id)}
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
                              onClick={() => startEditing(workspace)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="編集"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteWorkspace(workspace.id)}
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

