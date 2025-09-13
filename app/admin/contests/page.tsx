"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import AdminGuard from "@/components/admin/admin-guard";
import AdminNav from "@/components/ui/admin-nav";
import { Trophy, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

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
  isChecked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminContestsPage() {
  const [contests, setContests] = useState<Contest[]>([]);
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
    incentive: '',
    operatingCompany: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const response = await fetch('/api/contests?admin=true');
        if (response.ok) {
          const data = await response.json();
          // 作成日時で降順ソート（新しいものが上に来る）
          const sortedData = data.sort((a: Contest, b: Contest) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          setContests(sortedData);
        }
    } catch (error) {
      console.error('コンテスト情報の取得に失敗しました:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/contests/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        setContests(contests.map(contest => 
          contest.id === id 
            ? { ...contest, isActive: !currentStatus }
            : contest
        ));
      }
    } catch (error) {
      console.error('ステータスの更新に失敗しました:', error);
    }
  };

  const toggleChecked = (id: string) => {
    setContests(contests.map(contest => 
      contest.id === id 
        ? { ...contest, isChecked: !contest.isChecked }
        : contest
    ));
  };

  const deleteContest = async (id: string) => {
    if (!confirm('このコンテストを削除しますか？')) return;

    try {
      const response = await fetch(`/api/contests/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setContests(contests.filter(contest => contest.id !== id));
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
      const response = await fetch('/api/contests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newContest = await response.json();
        setContests([newContest, ...contests]);
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
          incentive: '',
          operatingCompany: '',
        });
        setShowCreateForm(false);
        alert('コンテストが正常に追加されました');
      } else {
        const error = await response.json();
        alert(`エラー: ${error.error || 'コンテストの追加に失敗しました'}`);
      }
    } catch (error) {
      console.error('コンテストの追加に失敗しました:', error);
      alert('コンテストの追加に失敗しました');
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">コンテスト管理</h1>
                <p className="text-gray-600">スタートアップコンテスト、ハッカソン、ピッチコンテストなどのコンテスト情報の管理と編集を行います</p>
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
              新しいコンテストを追加
            </button>
          </div>

          {/* コンテスト追加フォーム */}
          {showCreateForm && (
            <div className="mb-8 bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">新しいコンテストを追加</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* コンテスト名 */}
                  <div className="md:col-span-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      コンテスト名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="コンテスト名を入力してください"
                    />
                  </div>

                  {/* 主催者 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      主催者 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.organizer}
                      onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="主催者名を入力してください"
                    />
                  </div>

                  {/* 主催者タイプ */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      主催者タイプ
                    </label>
                    <select
                      value={formData.organizerType}
                      onChange={(e) => setFormData({ ...formData, organizerType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">選択してください</option>
                      <option value="行政">行政</option>
                      <option value="VC">VC</option>
                      <option value="CVC">CVC</option>
                      <option value="銀行">銀行</option>
                      <option value="不動産">不動産</option>
                      <option value="企業">企業</option>
                      <option value="研究機関">研究機関</option>
                      <option value="その他">その他</option>
                    </select>
                  </div>

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
                    placeholder="コンテストの説明を入力してください"
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
                    placeholder="対象者を入力してください"
                  />
                </div>

                {/* インセンティブ */}
                <div>
                  <label htmlFor="incentive" className="block text-sm font-medium text-gray-700 mb-2">
                    インセンティブ
                  </label>
                  <input
                    type="text"
                    id="incentive"
                    name="incentive"
                    value={formData.incentive}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="インセンティブを入力してください"
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
                    placeholder="運営企業を入力してください"
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

                {/* 画像URL入力 */}
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
                  <p className="mt-1 text-xs text-gray-500">
                    画像のURLを入力してください
                  </p>
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
                      'コンテストを追加'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* コンテスト一覧 */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">コンテスト一覧</h2>
            </div>
            
            {contests.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                コンテスト情報がありません
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {contests.map((contest) => (
                  <div key={contest.id} className={`px-6 py-4 hover:bg-gray-50 ${contest.isChecked ? 'bg-blue-50 border-l-4 border-blue-400' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-4">
                          {/* チェックボックス */}
                          <div className="flex-shrink-0 pt-1">
                            <input
                              type="checkbox"
                              checked={contest.isChecked || false}
                              onChange={() => toggleChecked(contest.id)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              title="確認済み"
                            />
                          </div>
                          {/* 画像プレビュー */}
                          {contest.imageUrl ? (
                            <div className="flex-shrink-0">
                              <Image
                                src={contest.imageUrl}
                                alt={contest.title}
                                width={64}
                                height={64}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            </div>
                          ) : (
                            <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                              <Trophy className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-medium text-gray-900">
                                {contest.title}
                              </h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                contest.isActive 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {contest.isActive ? '公開中' : '非公開'}
                              </span>
                            </div>
                        
                            {contest.description && (
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {contest.description}
                              </p>
                            )}
                            
                            <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                              {contest.deadline && (
                                <span>締切: {new Date(contest.deadline).toLocaleDateString('ja-JP')}</span>
                              )}
                              {contest.startDate && (
                                <span>開始: {new Date(contest.startDate).toLocaleDateString('ja-JP')}</span>
                              )}
                              {contest.area && (
                                <span>エリア: {contest.area}</span>
                              )}
                              <span>主催者: {contest.organizer}</span>
                            </div>
                            
                            {(contest.targetArea || contest.targetAudience || contest.incentive || contest.operatingCompany) && (
                              <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
                                {contest.targetArea && (
                                  <span>対象領域: {contest.targetArea}</span>
                                )}
                                {contest.targetAudience && (
                                  <span>対象者: {contest.targetAudience}</span>
                                )}
                                {contest.incentive && (
                                  <span>インセンティブ: {contest.incentive}</span>
                                )}
                                {contest.operatingCompany && (
                                  <span>運営企業: {contest.operatingCompany}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => toggleActive(contest.id, contest.isActive)}
                          className={`p-2 rounded-lg transition-colors ${
                            contest.isActive
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={contest.isActive ? '非公開にする' : '公開する'}
                        >
                          {contest.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        
                        <Link
                          href={`/admin/contests/${contest.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="編集"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        
                        <button
                          onClick={() => deleteContest(contest.id)}
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

