"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import AdminGuard from "@/components/admin/admin-guard";
import AdminNav from "@/components/ui/admin-nav";
import { Calendar, Plus, Edit, Trash2, Eye, EyeOff, Save, X } from "lucide-react";
import SimpleImage from "@/components/ui/simple-image";

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
  isChecked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingData, setEditingData] = useState<Partial<Event>>({});
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    startDate: '',
    endDate: '',
    venue: '',
    area: '',
    organizer: '',
    organizerType: 'GOVERNMENT' as const,
    website: '',
    targetArea: '',
    targetAudience: '',
    operatingCompany: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
        if (response.ok) {
          const data = await response.json();
          // 作成日時で降順ソート（新しいものが上に来る）
          const sortedData = data.sort((a: Event, b: Event) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setEvents(sortedData);
        }
    } catch (error) {
      console.error('イベント情報の取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setEvents(events.map(event => 
          event.id === id 
            ? { ...event, isActive: !currentStatus }
            : event
        ));
      }
    } catch (error) {
      console.error('ステータスの更新に失敗しました:', error);
    }
  };

  // const toggleChecked = (id: string) => {
  //   setEvents(events.map(event => 
  //     event.id === id 
  //       ? { ...event, isChecked: !event.isChecked }
  //       : event
  //   ));
  // };

  const deleteEvent = async (id: string) => {
    if (!confirm('このイベントを削除しますか？')) return;

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEvents(events.filter(event => event.id !== id));
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

  const startEditing = (event: Event) => {
    setEditingId(event.id);
    setEditingData({
      title: event.title,
      description: event.description,
      imageUrl: event.imageUrl,
      startDate: event.startDate,
      endDate: event.endDate,
      venue: event.venue,
      area: event.area,
      organizer: event.organizer,
      organizerType: event.organizerType,
      website: event.website,
      targetArea: event.targetArea,
      targetAudience: event.targetAudience,
      operatingCompany: event.operatingCompany,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingData({});
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveEdit = async (id: string) => {
    try {
      // 日付フィールドを適切にフォーマット
      const dataToSend = {
        ...editingData,
        startDate: editingData.startDate ? new Date(editingData.startDate).toISOString() : null,
        endDate: editingData.endDate ? new Date(editingData.endDate).toISOString() : null,
      };

      console.log('Sending data to API:', dataToSend);

      const response = await fetch(`/api/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const updatedEvent = await response.json();
        setEvents(events.map(event => 
          event.id === id ? updatedEvent : event
        ));
        setEditingId(null);
        setEditingData({});
        alert('イベントが正常に更新されました');
      } else {
        const responseText = await response.text();
        console.error('Raw response text:', responseText);
        console.error('Response status:', response.status);
        console.error('Response headers:', response.headers);
        
        let errorData: { error?: string; details?: string } = {};
        try {
          errorData = JSON.parse(responseText);
          console.error('Parsed error data:', errorData);
        } catch (parseError) {
          console.error('Failed to parse error response as JSON:', parseError);
          console.error('Raw response text was:', responseText);
          errorData = { error: 'JSONパースエラー', details: responseText };
        }
        
        alert(`エラー: ${errorData.error || 'イベントの更新に失敗しました'}\n詳細: ${errorData.details || '詳細不明'}\nステータス: ${response.status}`);
      }
    } catch (error) {
      console.error('イベントの更新に失敗しました:', error);
      alert('イベントの更新に失敗しました');
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newEvent = await response.json();
        setEvents([newEvent, ...events]);
        setFormData({
          title: '',
          description: '',
          imageUrl: '',
          startDate: '',
          endDate: '',
          venue: '',
          area: '',
          organizer: '',
          organizerType: 'GOVERNMENT',
          website: '',
          targetArea: '',
          targetAudience: '',
          operatingCompany: '',
        });
        setShowCreateForm(false);
        alert('イベントが正常に追加されました');
      } else {
        const error = await response.json();
        alert(`エラー: ${error.error || 'イベントの追加に失敗しました'}`);
      }
    } catch (error) {
      console.error('イベントの追加に失敗しました:', error);
      alert('イベントの追加に失敗しました');
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">展示会・イベント管理</h1>
                <p className="text-gray-600">展示会やイベントの管理と編集を行います</p>
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
              新しいイベントを追加
            </button>
          </div>

          {/* イベント追加フォーム */}
          {showCreateForm && (
            <div className="mb-8 bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">新しいイベントを追加</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      rows={3}
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
                      'イベントを追加'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* イベント一覧 */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">イベント一覧</h2>
            </div>
            
            {events.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                イベント情報がありません
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {events.map((event) => (
                  <div key={event.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 flex gap-4">
                        {/* 画像プレビュー */}
                        <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                          {editingId === event.id ? (
                            // 編集モードでも画像を表示
                            editingData.imageUrl ? (
                              <SimpleImage
                                src={editingData.imageUrl}
                                alt={editingData.title || event.title}
                                width={80}
                                height={80}
                                className="w-20 h-20 object-cover"
                              />
                            ) : (
                              <div className="w-20 h-20 bg-gray-100 flex items-center justify-center">
                                <Calendar className="h-8 w-8 text-gray-400" />
                              </div>
                            )
                          ) : (
                            // 表示モード
                            event.imageUrl ? (
                              <SimpleImage
                                src={event.imageUrl.trim()}
                                alt={event.title}
                                width={80}
                                height={80}
                                className="w-20 h-20 object-cover"
                              />
                            ) : (
                              <div className="w-20 h-20 bg-gray-100 flex items-center justify-center">
                                <Calendar className="h-8 w-8 text-gray-400" />
                              </div>
                            )
                          )}
                        </div>
                        
                        {/* イベント情報 */}
                        <div className="flex-1 min-w-0">
                          {editingId === event.id ? (
                            <div className="space-y-3">
                              {/* 編集モード */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">イベント名</label>
                                  <input
                                    type="text"
                                    name="title"
                                    value={editingData.title || ''}
                                    onChange={handleEditInputChange}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">エリア</label>
                                  <input
                                    type="text"
                                    name="area"
                                    value={editingData.area || ''}
                                    onChange={handleEditInputChange}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">主催者</label>
                                  <input
                                    type="text"
                                    name="organizer"
                                    value={editingData.organizer || ''}
                                    onChange={handleEditInputChange}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">主催者タイプ</label>
                                  <select
                                    name="organizerType"
                                    value={editingData.organizerType || 'GOVERNMENT'}
                                    onChange={handleEditInputChange}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">会場</label>
                                  <input
                                    type="text"
                                    name="venue"
                                    value={editingData.venue || ''}
                                    onChange={handleEditInputChange}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">ウェブサイト</label>
                                  <input
                                    type="url"
                                    name="website"
                                    value={editingData.website || ''}
                                    onChange={handleEditInputChange}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">開始日</label>
                                  <input
                                    type="datetime-local"
                                    name="startDate"
                                    value={editingData.startDate ? new Date(editingData.startDate).toISOString().slice(0, 16) : ''}
                                    onChange={handleEditInputChange}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">終了日</label>
                                  <input
                                    type="datetime-local"
                                    name="endDate"
                                    value={editingData.endDate ? new Date(editingData.endDate).toISOString().slice(0, 16) : ''}
                                    onChange={handleEditInputChange}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-xs font-medium text-gray-700 mb-1">画像URL</label>
                                  <input
                                    type="url"
                                    name="imageUrl"
                                    value={editingData.imageUrl || ''}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      setEditingData(prev => ({
                                        ...prev,
                                        imageUrl: value
                                      }));
                                    }}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="https://example.com/image.jpg"
                                  />
                                  <p className="text-xs text-gray-500 mt-1">
                                    画像URLを入力すると、左側のプレビューが更新されます
                                  </p>
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-xs font-medium text-gray-700 mb-1">説明</label>
                                  <textarea
                                    name="description"
                                    value={editingData.description || ''}
                                    onChange={handleEditInputChange}
                                    rows={2}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">対象領域</label>
                                  <input
                                    type="text"
                                    name="targetArea"
                                    value={editingData.targetArea || ''}
                                    onChange={handleEditInputChange}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">対象者</label>
                                  <input
                                    type="text"
                                    name="targetAudience"
                                    value={editingData.targetAudience || ''}
                                    onChange={handleEditInputChange}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-xs font-medium text-gray-700 mb-1">運営企業</label>
                                  <input
                                    type="text"
                                    name="operatingCompany"
                                    value={editingData.operatingCompany || ''}
                                    onChange={handleEditInputChange}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center gap-3">
                                <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                <h3 className="text-lg font-medium text-gray-900 truncate">
                                  {event.title}
                                </h3>
                                <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ${
                                  event.isActive 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {event.isActive ? '公開中' : '非公開'}
                                </span>
                              </div>
                              
                              {event.description && (
                                <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                                  {event.description}
                                </p>
                              )}
                              
                              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                                <span>開催日: {formatDate(event.startDate)}</span>
                                {event.endDate && (
                                  <span>〜 {formatDate(event.endDate)}</span>
                                )}
                                {event.venue && (
                                  <span>会場: {event.venue}</span>
                                )}
                                {event.area && (
                                  <span>エリア: {event.area}</span>
                                )}
                                <span>主催者: {event.organizer}</span>
                              </div>
                              
                              {(event.targetArea || event.targetAudience || event.operatingCompany) && (
                                <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                                  {event.targetArea && (
                                    <span>対象領域: {event.targetArea}</span>
                                  )}
                                  {event.targetAudience && (
                                    <span>対象者: {event.targetAudience}</span>
                                  )}
                                  {event.operatingCompany && (
                                    <span>運営企業: {event.operatingCompany}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                        {editingId === event.id ? (
                          // 編集モードのボタン
                          <>
                            <button
                              onClick={() => saveEdit(event.id)}
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
                              onClick={() => startEditing(event)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="編集"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteEvent(event.id)}
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
