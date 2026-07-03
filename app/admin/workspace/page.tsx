"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import AdminGuard from "@/components/admin/admin-guard";
import { Briefcase, Plus, Edit, Trash2, Save, X, ArrowLeft, Sparkles, ImageIcon } from "lucide-react";
import SimpleImage from "@/components/ui/simple-image";
import ImageUpload from "@/components/ui/image-upload";
import WorkspaceInfoCardsEditor from "@/components/ui/workspace-info-cards-editor";
import { type InfoCard, normalizeInfoCards } from "@/lib/workspace-info-cards";
import { deriveCountryCity } from "@/lib/derive-location";

interface Workspace {
  id: string;
  name: string;
  description?: string;
  infoCards?: InfoCard[];
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
  facilityFeatureOneLine?: string;
  categoryWork: boolean;
  categoryConnect: boolean;
  categoryPrototype: boolean;
  categoryPilot: boolean;
  categoryTest: boolean;
  categorySupport: boolean;
  categoryShowcase: boolean;
  categoryLearn: boolean;
  categoryStay: boolean;
  hasMultipleLocations: boolean;
  requiresAdvanceNotice: boolean;
  canDoWebMeeting: boolean;
  hasEnglishSupport: boolean;
  meetsNexanaStandard: boolean;
  isNexanaRecommended: boolean;
  locationId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminWorkspacePage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<Workspace>>({});
  // 編集時のエリア上書き（住所から自動判定できない海外などの予備）
  const [editArea, setEditArea] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    address: '',
    area: '',
    officialLink: '',
    businessHours: '',
    hasDropin: false,
    hasMeetingRoom: false,
    hasPhoneBooth: false,
    hasWifi: false,
    hasParking: false,
    priceTable: '',
    operator: '',
    management: '',
    facilityFeatureOneLine: '',
    categoryWork: false,
    categoryConnect: false,
    categoryPrototype: false,
    categoryPilot: false,
    categoryTest: false,
    categorySupport: false,
    categoryShowcase: false,
    categoryLearn: false,
    categoryStay: false,
    hasMultipleLocations: false,
    requiresAdvanceNotice: false,
    canDoWebMeeting: false,
    hasEnglishSupport: false,
    meetsNexanaStandard: false,
    infoCards: [] as InfoCard[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchWorkspaces();
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
    setEditArea('');
    setEditingData({
      name: workspace.name,
      description: workspace.description,
      infoCards: normalizeInfoCards(workspace.infoCards),
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
      facilityFeatureOneLine: workspace.facilityFeatureOneLine,
      categoryWork: workspace.categoryWork,
      categoryConnect: workspace.categoryConnect,
      categoryPrototype: workspace.categoryPrototype,
      categoryPilot: workspace.categoryPilot,
      categoryTest: workspace.categoryTest,
      categorySupport: workspace.categorySupport,
      categoryShowcase: workspace.categoryShowcase,
      categoryLearn: workspace.categoryLearn,
      categoryStay: workspace.categoryStay,
      hasMultipleLocations: workspace.hasMultipleLocations,
      requiresAdvanceNotice: workspace.requiresAdvanceNotice,
      canDoWebMeeting: workspace.canDoWebMeeting,
      hasEnglishSupport: workspace.hasEnglishSupport,
      meetsNexanaStandard: workspace.meetsNexanaStandard,
      isNexanaRecommended: workspace.isNexanaRecommended,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingData({});
    setEditArea('');
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

      // 住所（＋任意の上書き）からフィルタ用の国・都道府県を自動判定。
      // 判定できず上書きも無い場合は既存の値を保持（海外データ等を壊さない）。
      const derived = deriveCountryCity(editingData.address || '', editArea);
      const isFallback = derived.country === 'その他' && !editArea.trim();
      dataToSend.country = isFallback ? editingData.country : derived.country;
      dataToSend.city = isFallback ? editingData.city : derived.city;

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
          // 住所（＋任意の上書き）からフィルタ用の国・都道府県を自動判定
          ...deriveCountryCity(formData.address, formData.area),
          locationId: null,
        }),
      });

      if (response.ok) {
        await fetchWorkspaces();
        setFormData({
          name: '',
          description: '',
          imageUrl: '',
          address: '',
          area: '',
          officialLink: '',
          businessHours: '',
          hasDropin: false,
          hasMeetingRoom: false,
          hasPhoneBooth: false,
          hasWifi: false,
          hasParking: false,
          priceTable: '',
          operator: '',
          management: '',
          facilityFeatureOneLine: '',
          categoryWork: false,
          categoryConnect: false,
          categoryPrototype: false,
          categoryPilot: false,
          categoryTest: false,
          categorySupport: false,
          categoryShowcase: false,
          categoryLearn: false,
          categoryStay: false,
          hasMultipleLocations: false,
          requiresAdvanceNotice: false,
          canDoWebMeeting: false,
          hasEnglishSupport: false,
          meetsNexanaStandard: false,
          infoCards: [],
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-600">読み込み中...</div>
            </div>
          </div>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            管理ダッシュボードに戻る
          </Link>

          <div className="mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">ワークスペース管理</h1>
              <p className="text-gray-600">ワークスペース情報の管理と編集を行います</p>
            </div>
          </div>

          <div className="mb-6 flex flex-wrap gap-3">
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              新しいワークスペースを追加
            </button>
            <Link
              href="/admin/ai-import-workspace"
              className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-blue-600 transition-colors flex items-center gap-2"
            >
              <Sparkles className="h-5 w-5" />
              AIでURL取込（複数可）
            </Link>
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

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      施設の説明 <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      placeholder="施設の概要・特徴を説明してください"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        施設写真
                      </label>
                      <a
                        href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(formData.name || '')}`}
                        target="_blank"
                        rel="noreferrer"
                        title="施設名でGoogle画像検索"
                        className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                      >
                        <ImageIcon className="w-3 h-3" />
                        画像検索
                      </a>
                    </div>
                    <ImageUpload
                      value={formData.imageUrl}
                      onChange={(imageUrl) => setFormData({ ...formData, imageUrl })}
                      type="workspaces"
                      className="w-full"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      施設住所 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      placeholder="例: 東京都渋谷区〇〇1-2-3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      住所の都道府県からエリア（国・都道府県）を自動判定します。
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      エリア（任意・上書き用）
                    </label>
                    <input
                      type="text"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      placeholder="住所から自動判定できない場合のみ（例: シンガポール）"
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

                  {/* 新しいフィールドセクション */}
                  <div className="md:col-span-2 border-t pt-6 mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">追加情報</h3>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      施設特徴ひとこと <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="facilityFeatureOneLine"
                      value={formData.facilityFeatureOneLine}
                      onChange={handleInputChange}
                      required
                      placeholder="例: 海が見える開放的な空間"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      カテゴリ
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="categoryWork"
                          checked={formData.categoryWork}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">執務 (Work)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="categoryConnect"
                          checked={formData.categoryConnect}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">交流 (Connect)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="categoryPrototype"
                          checked={formData.categoryPrototype}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">試作 (Prototype)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="categoryPilot"
                          checked={formData.categoryPilot}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">実証 (Pilot)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="categoryTest"
                          checked={formData.categoryTest}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">試験 (Test)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="categorySupport"
                          checked={formData.categorySupport}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">支援 (Support)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="categoryShowcase"
                          checked={formData.categoryShowcase}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">発表 (Showcase)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="categoryLearn"
                          checked={formData.categoryLearn}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">学ぶ (Learn)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="categoryStay"
                          checked={formData.categoryStay}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 text-sm text-gray-700">滞在 (Stay)</span>
                      </label>
                    </div>
                  </div>

                  <div className="md:col-span-2 border-t pt-6 mt-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      施設情報・周辺情報カード
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      カテゴリ（施設情報 / 周辺ホテル / 周辺Food / 周辺スポット）を選んで、写真・タイトル・概要を登録できます。いくつでも追加できます。
                    </p>
                    <WorkspaceInfoCardsEditor
                      value={formData.infoCards}
                      onChange={(infoCards) =>
                        setFormData({ ...formData, infoCards })
                      }
                    />
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
                                <div className="md:col-span-2">
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    施設の説明 <span className="text-red-500">*</span>
                                  </label>
                                  <textarea
                                    name="description"
                                    value={editingData.description || ''}
                                    onChange={handleEditInputChange}
                                    required
                                    rows={3}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <div className="flex items-center justify-between gap-2 mb-1">
                                    <label className="block text-xs font-medium text-gray-700">施設写真</label>
                                    <a
                                      href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(editingData.name || '')}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      title="施設名でGoogle画像検索"
                                      className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                                    >
                                      <ImageIcon className="w-3 h-3" />
                                      画像検索
                                    </a>
                                  </div>
                                  <ImageUpload
                                    value={editingData.imageUrl || ''}
                                    onChange={(imageUrl) => setEditingData(prev => ({ ...prev, imageUrl }))}
                                    type="workspaces"
                                    className="w-full"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    施設住所 <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    name="address"
                                    value={editingData.address || ''}
                                    onChange={handleEditInputChange}
                                    required
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                  />
                                  <p className="mt-1 text-xs text-gray-500">
                                    住所の都道府県からエリア（国・都道府県）を自動判定します。
                                  </p>
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    エリア（任意・上書き用）
                                  </label>
                                  <input
                                    type="text"
                                    value={editArea}
                                    onChange={(e) => setEditArea(e.target.value)}
                                    placeholder="住所から自動判定できない場合のみ（例: シンガポール）"
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
                                {/* 追加情報セクション */}
                                <div className="md:col-span-2 border-t pt-4 mt-4">
                                  <h4 className="text-sm font-semibold mb-3">追加情報</h4>
                                </div>

                                <div className="md:col-span-2">
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    施設特徴ひとこと <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    name="facilityFeatureOneLine"
                                    value={editingData.facilityFeatureOneLine || ''}
                                    onChange={handleEditInputChange}
                                    required
                                    placeholder="例: 海が見える開放的な空間"
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                  />
                                </div>

                                <div className="md:col-span-2">
                                  <label className="block text-xs font-medium text-gray-700 mb-2">カテゴリ</label>
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    <label className="flex items-center">
                                      <input
                                        type="checkbox"
                                        name="categoryWork"
                                        checked={editingData.categoryWork || false}
                                        onChange={(e) => setEditingData(prev => ({ ...prev, categoryWork: e.target.checked }))}
                                        className="h-3 w-3 text-blue-600"
                                      />
                                      <span className="ml-2 text-xs text-gray-700">執務 (Work)</span>
                                    </label>
                                    <label className="flex items-center">
                                      <input
                                        type="checkbox"
                                        name="categoryConnect"
                                        checked={editingData.categoryConnect || false}
                                        onChange={(e) => setEditingData(prev => ({ ...prev, categoryConnect: e.target.checked }))}
                                        className="h-3 w-3 text-blue-600"
                                      />
                                      <span className="ml-2 text-xs text-gray-700">交流 (Connect)</span>
                                    </label>
                                    <label className="flex items-center">
                                      <input
                                        type="checkbox"
                                        name="categoryPrototype"
                                        checked={editingData.categoryPrototype || false}
                                        onChange={(e) => setEditingData(prev => ({ ...prev, categoryPrototype: e.target.checked }))}
                                        className="h-3 w-3 text-blue-600"
                                      />
                                      <span className="ml-2 text-xs text-gray-700">試作 (Prototype)</span>
                                    </label>
                                    <label className="flex items-center">
                                      <input
                                        type="checkbox"
                                        name="categoryPilot"
                                        checked={editingData.categoryPilot || false}
                                        onChange={(e) => setEditingData(prev => ({ ...prev, categoryPilot: e.target.checked }))}
                                        className="h-3 w-3 text-blue-600"
                                      />
                                      <span className="ml-2 text-xs text-gray-700">実証 (Pilot)</span>
                                    </label>
                                    <label className="flex items-center">
                                      <input
                                        type="checkbox"
                                        name="categoryTest"
                                        checked={editingData.categoryTest || false}
                                        onChange={(e) => setEditingData(prev => ({ ...prev, categoryTest: e.target.checked }))}
                                        className="h-3 w-3 text-blue-600"
                                      />
                                      <span className="ml-2 text-xs text-gray-700">試験 (Test)</span>
                                    </label>
                                    <label className="flex items-center">
                                      <input
                                        type="checkbox"
                                        name="categorySupport"
                                        checked={editingData.categorySupport || false}
                                        onChange={(e) => setEditingData(prev => ({ ...prev, categorySupport: e.target.checked }))}
                                        className="h-3 w-3 text-blue-600"
                                      />
                                      <span className="ml-2 text-xs text-gray-700">支援 (Support)</span>
                                    </label>
                                    <label className="flex items-center">
                                      <input
                                        type="checkbox"
                                        name="categoryShowcase"
                                        checked={editingData.categoryShowcase || false}
                                        onChange={(e) => setEditingData(prev => ({ ...prev, categoryShowcase: e.target.checked }))}
                                        className="h-3 w-3 text-blue-600"
                                      />
                                      <span className="ml-2 text-xs text-gray-700">発表 (Showcase)</span>
                                    </label>
                                    <label className="flex items-center">
                                      <input
                                        type="checkbox"
                                        name="categoryLearn"
                                        checked={editingData.categoryLearn || false}
                                        onChange={(e) => setEditingData(prev => ({ ...prev, categoryLearn: e.target.checked }))}
                                        className="h-3 w-3 text-blue-600"
                                      />
                                      <span className="ml-2 text-xs text-gray-700">学ぶ (Learn)</span>
                                    </label>
                                    <label className="flex items-center">
                                      <input
                                        type="checkbox"
                                        name="categoryStay"
                                        checked={editingData.categoryStay || false}
                                        onChange={(e) => setEditingData(prev => ({ ...prev, categoryStay: e.target.checked }))}
                                        className="h-3 w-3 text-blue-600"
                                      />
                                      <span className="ml-2 text-xs text-gray-700">滞在 (Stay)</span>
                                    </label>
                                  </div>
                                </div>

                              </div>
                              
                              {/* 施設情報・周辺情報カード（新・可変リスト） */}
                              <div className="mt-6 border-t pt-4">
                                <h3 className="text-base font-semibold text-gray-900 mb-1">
                                  施設情報・周辺情報カード
                                </h3>
                                <p className="text-xs text-gray-500 mb-3">
                                  カテゴリ（施設情報 / 周辺ホテル / 周辺Food / 周辺スポット）を選んで、写真・タイトル・概要を登録。いくつでも追加できます。
                                </p>
                                <WorkspaceInfoCardsEditor
                                  value={normalizeInfoCards(editingData.infoCards)}
                                  onChange={(infoCards) =>
                                    setEditingData((prev) => ({ ...prev, infoCards }))
                                  }
                                />
                              </div>

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
      </div>
    </AdminGuard>
  );
}

