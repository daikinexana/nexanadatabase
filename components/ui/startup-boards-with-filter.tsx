"use client";

import { useState, useMemo, useEffect } from "react";
import { MapPin, Building2, Calendar, ExternalLink, TrendingUp, Users, Lightbulb, Handshake, Heart, Mail } from "lucide-react";
import Link from "next/link";
import { getClientIdentifier } from "@/lib/user-identifier";

interface StartupBoard {
  id: string;
  companyLogoUrl?: string;
  companyProductImageUrl?: string;
  companyName: string;
  companyDescriptionOneLine?: string;
  companyAndProduct?: string;
  companyOverview?: string;
  corporateNumber?: string;
  establishedDate?: string;
  employeeCount?: string;
  companyUrl?: string;
  country: string;
  city: string;
  address?: string;
  listingStatus?: string;
  fundingStatus?: string;
  fundingOverview?: string;
  hiringStatus?: string;
  hiringOverview?: string;
  proposalStatus?: string;
  proposalOverview?: string;
  collaborationStatus?: string;
  collaborationOverview?: string;
  createdAt: string;
  updatedAt: string;
}

interface StartupBoardsWithFilterProps {
  initialStartupBoards: StartupBoard[];
}

export default function StartupBoardsWithFilter({
  initialStartupBoards,
}: StartupBoardsWithFilterProps) {
  const [startupBoards] = useState<StartupBoard[]>(initialStartupBoards);
  const [selectedPurpose, setSelectedPurpose] = useState<string>(""); // 目的選択（最初のフィルタ）
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("updated"); // 表示順: updated, created, likes
  const [likes, setLikes] = useState<Record<string, { isLiked: boolean; likeCount: number }>>({});

  // フィルタリング（目的選択を最初に適用）
  const filteredBoards = useMemo(() => {
    let filtered = startupBoards;

    // 1. 目的から選択（最初のフィルタ）
    if (selectedPurpose) {
      filtered = filtered.filter((board) => {
        switch (selectedPurpose) {
          case "funding":
            return board.fundingStatus && board.fundingStatus !== "なし";
          case "hiring":
            return board.hiringStatus === "募集中";
          case "proposal":
            return board.proposalStatus === "募集中";
          case "collaboration":
            return board.collaborationStatus === "募集中";
          default:
            return true;
        }
      });
    }

    // 2. 国、Cityでフィルタリング
    filtered = filtered.filter((board) => {
      if (selectedCountry && board.country !== selectedCountry) return false;
      if (selectedCity && board.city !== selectedCity) return false;
      return true;
    });

    // 3. 表示順でソート
    filtered = [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case "updated":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case "created":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "likes":
          const likesA = likes[a.id]?.likeCount || 0;
          const likesB = likes[b.id]?.likeCount || 0;
          return likesB - likesA;
        default:
          return 0;
      }
    });

    return filtered;
  }, [startupBoards, selectedPurpose, selectedCountry, selectedCity, sortOrder, likes]);

  // ユニークな値の取得
  const countries = useMemo(() => {
    return Array.from(new Set(startupBoards.map(b => b.country))).sort();
  }, [startupBoards]);

  const cities = useMemo(() => {
    const filtered = selectedCountry 
      ? startupBoards.filter(b => b.country === selectedCountry)
      : startupBoards;
    return Array.from(new Set(filtered.map(b => b.city))).sort();
  }, [startupBoards, selectedCountry]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const formatDateShort = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric' });
  };

  // 気になるボタンのハンドラー
  const handleLike = async (boardId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // ユーザーIDを取得
      const userId = getClientIdentifier();
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'x-client-id': userId,
      };

      const response = await fetch(`/api/startup-boards/${boardId}/like`, {
        method: 'POST',
        headers,
      });

      if (response.ok) {
        const data = await response.json();
        setLikes(prev => ({
          ...prev,
          [boardId]: {
            isLiked: data.isLiked,
            likeCount: data.likeCount,
          },
        }));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  // 初期いいね状態を取得
  useEffect(() => {
    const fetchLikes = async () => {
      const likesData: Record<string, { isLiked: boolean; likeCount: number }> = {};
      
      // ユーザーIDを取得
      const userId = getClientIdentifier();
      
      const headers: HeadersInit = {
        'x-client-id': userId,
      };
      
      for (const board of startupBoards) {
        try {
          const response = await fetch(`/api/startup-boards/${board.id}/like`, {
            headers,
          });
          if (response.ok) {
            const data = await response.json();
            likesData[board.id] = {
              isLiked: data.isLiked,
              likeCount: data.likeCount,
            };
          }
        } catch (error) {
          console.error(`Error fetching like for ${board.id}:`, error);
        }
      }
      
      setLikes(likesData);
    };

    fetchLikes();
  }, [startupBoards]);

  return (
    <div className="space-y-6">
      {/* フィルター */}
      <div className="space-y-6">
        {/* 1. 目的から選択（最初のフィルタ） */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">
            目的から選択
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={() => setSelectedPurpose(selectedPurpose === "funding" ? "" : "funding")}
              className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                selectedPurpose === "funding"
                  ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-emerald-300 hover:bg-emerald-50"
              }`}
            >
              <TrendingUp className="w-4 h-4 inline-block mr-2" />
              調達/M&A募集中
            </button>
            <button
              onClick={() => setSelectedPurpose(selectedPurpose === "hiring" ? "" : "hiring")}
              className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                selectedPurpose === "hiring"
                  ? "bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              <Users className="w-4 h-4 inline-block mr-2" />
              採用募集中
            </button>
            <button
              onClick={() => setSelectedPurpose(selectedPurpose === "proposal" ? "" : "proposal")}
              className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                selectedPurpose === "proposal"
                  ? "bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/30"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:bg-purple-50"
              }`}
            >
              <Lightbulb className="w-4 h-4 inline-block mr-2" />
              提案募集中
            </button>
            <button
              onClick={() => setSelectedPurpose(selectedPurpose === "collaboration" ? "" : "collaboration")}
              className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                selectedPurpose === "collaboration"
                  ? "bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/30"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-pink-300 hover:bg-pink-50"
              }`}
            >
              <Handshake className="w-4 h-4 inline-block mr-2" />
              共創募集中
            </button>
          </div>
      </div>

        {/* 2. 国、Cityでフィルタリング */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">
            詳細フィルター
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <select
          value={selectedCountry}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            setSelectedCity(""); // 国を変更したら都市をリセット
          }}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white font-medium transition-all duration-200 hover:border-indigo-300"
        >
          <option value="">すべての国</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>

        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white font-medium transition-all duration-200 hover:border-indigo-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
          disabled={!selectedCountry}
        >
          <option value="">すべての都道府県</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
          </div>
        </div>

        {/* 3. 表示順の選択 */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-3">
            表示順
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSortOrder("updated")}
              className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                sortOrder === "updated"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50"
              }`}
            >
              <Calendar className="w-4 h-4 inline-block mr-2" />
              更新順
            </button>
            <button
              onClick={() => setSortOrder("created")}
              className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                sortOrder === "created"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50"
              }`}
            >
              <Calendar className="w-4 h-4 inline-block mr-2" />
              新着順
            </button>
            <button
              onClick={() => setSortOrder("likes")}
              className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                sortOrder === "likes"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                  : "bg-white border-2 border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50"
              }`}
            >
              <Heart className="w-4 h-4 inline-block mr-2" />
              いいね順
            </button>
          </div>
        </div>
      </div>

      {/* 結果数表示 */}
      <div className="text-sm text-gray-600">
        {filteredBoards.length}件のスタートアップが見つかりました
      </div>

      {/* スタートアップボード一覧 */}
      {filteredBoards.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">該当するスタートアップが見つかりませんでした</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {filteredBoards.map((board) => (
            <div
              key={board.id}
              className="group relative bg-white rounded-3xl overflow-hidden transition-all duration-700 hover:shadow-2xl border border-gray-100/80 hover:border-gray-200"
              style={{
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
              }}
            >
              {/* 微細なグラデーションアクセント */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="flex flex-col lg:flex-row">
                {/* 左側：画像 + 基本情報 */}
                <div className="w-full lg:w-80 xl:w-96 flex-shrink-0 border-r-2 border-indigo-100 bg-gradient-to-br from-indigo-50/30 via-purple-50/20 to-pink-50/20">
                  {/* 画像エリア */}
                  <div className="relative w-full h-64 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
                    {/* 微細なパターン */}
                    <div className="absolute inset-0 opacity-[0.03]">
                      <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(99, 102, 241) 1px, transparent 0)',
                        backgroundSize: '24px 24px'
                      }}></div>
                    </div>
                    
                    <div className="relative w-full h-full flex items-center justify-center p-8">
                      {/* グラデーションオーバーレイ */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent"></div>
                  {board.companyProductImageUrl ? (
                        <div className="relative z-10">
                          <div className="absolute inset-0 bg-white/20 rounded-2xl blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
                          <img
                            src={board.companyProductImageUrl}
                            alt={board.companyName}
                            className="relative max-w-full max-h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-700 filter brightness-110"
                          />
                        </div>
                      ) : (
                        <Building2 className="w-24 h-24 text-white/80 group-hover:text-white transition-colors duration-300 relative z-10" />
                      )}
                    </div>
                    
                    {/* 企業ロゴを右下に表示 */}
                    {board.companyLogoUrl && (
                      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg z-10 border border-white/80 group-hover:shadow-xl group-hover:scale-105 transition-all duration-300">
                        <img
                          src={board.companyLogoUrl}
                          alt={board.companyName}
                          className="w-16 h-16 object-contain"
                        />
                      </div>
                    )}
                  </div>

                  {/* 基本情報セクション */}
                  <div className="px-6 py-6 bg-white/60 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
                      <div className="text-xs font-bold text-indigo-700 uppercase tracking-widest">基本情報</div>
                    </div>
                    <div className="space-y-3 text-sm">
                      {/* 更新日 */}
                      {board.updatedAt && (
                        <div className="flex items-center gap-2 p-2 bg-white/80 rounded-lg">
                          <Calendar className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                          <span className="text-gray-700"><span className="font-semibold text-gray-900">{formatDateShort(board.updatedAt)}</span></span>
                        </div>
                      )}
                      {/* 企業名 */}
                      <div className="font-bold text-gray-900 text-lg mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {board.companyName}
                      </div>
                      {/* 所在地 */}
                      <div className="flex items-center gap-2 p-2 bg-white/80 rounded-lg">
                        <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                        <span className="text-gray-700 font-medium">{board.city}, {board.country}</span>
                      </div>
                      {/* 住所 */}
                      {board.address && (
                        <div className="flex items-start gap-2 p-2 bg-white/80 rounded-lg">
                          <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{board.address}</span>
                        </div>
                      )}
                      {/* 設立日 */}
                      {board.establishedDate && (
                        <div className="flex items-center gap-2 p-2 bg-white/80 rounded-lg">
                          <Calendar className="w-4 h-4 text-purple-500 flex-shrink-0" />
                          <span className="text-gray-700">設立: <span className="font-semibold text-gray-900">{formatDate(board.establishedDate)}</span></span>
                        </div>
                      )}
                      {/* 法人番号 */}
                      {board.corporateNumber && (
                        <div className="text-xs font-mono text-gray-600 p-2 bg-white/80 rounded-lg">
                          法人番号: {board.corporateNumber}
                        </div>
                      )}
                      {/* URL */}
                      {board.companyUrl && (
                        <div className="flex items-center gap-2 p-2 bg-white/80 rounded-lg">
                          <ExternalLink className="w-4 h-4 text-blue-500 flex-shrink-0" />
                          <a
                            href={board.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 font-semibold underline decoration-2 underline-offset-2 hover:decoration-blue-500 transition-all break-all"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {board.companyUrl}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 右側：コンテンツエリア */}
                <div className="flex-1 p-8 lg:p-10 flex flex-col bg-white">
                  <div className="flex-1">

                    {/* 説明文 */}
                    {board.companyDescriptionOneLine && (
                      <p className="text-lg lg:text-xl text-gray-700 mb-6 line-clamp-2 leading-relaxed font-medium">
                        {board.companyDescriptionOneLine}
                      </p>
                    )}

                    {/* 企業と製品サービス */}
                    {board.companyAndProduct && (
                      <div className="mb-5 p-5 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 rounded-2xl border-2 border-indigo-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-md">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-1 h-5 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
                          <div className="text-xs font-bold text-indigo-700 uppercase tracking-widest">企業と製品サービス</div>
                        </div>
                        <p className="text-sm text-gray-800 line-clamp-2 leading-relaxed font-medium">{board.companyAndProduct}</p>
                      </div>
                    )}

                    {/* 主な特徴など概要 */}
                    {board.companyOverview && (
                      <div className="mb-5 p-5 bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-2xl border-2 border-purple-100 hover:border-purple-200 transition-all duration-300 hover:shadow-md">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-1 h-5 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
                          <div className="text-xs font-bold text-purple-700 uppercase tracking-widest">主な特徴など概要</div>
                        </div>
                        <p className="text-sm text-gray-800 line-clamp-2 leading-relaxed font-medium">{board.companyOverview}</p>
                      </div>
                    )}

                    {/* タグ情報 */}
                    <div className="space-y-4 mb-6">
                      {/* スタ募中 */}
                      <div>
                        <div className="flex items-center gap-3 mb-5 p-3 bg-gradient-to-r from-indigo-100/50 via-purple-100/50 to-pink-100/50 rounded-xl border-2 border-indigo-200/50">
                          <div className="w-1.5 h-8 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-full"></div>
                          <div className="text-sm font-extrabold text-gray-900 uppercase tracking-widest">スタ募中</div>
                        </div>
                        <div className="space-y-3">
                          {/* 調達 */}
                          {board.fundingStatus && board.fundingStatus !== "なし" && (
                            <div className="group/status flex items-start gap-4 p-4 bg-emerald-50/30 border border-emerald-200/40 rounded-2xl hover:bg-emerald-50/50 hover:border-emerald-300/60 transition-all duration-300">
                              <span className="inline-flex items-center px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg whitespace-nowrap flex-shrink-0 shadow-sm group-hover/status:shadow-md transition-all duration-300">
                                <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
                              調達
                            </span>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-emerald-900 mb-1.5">{board.fundingStatus}</div>
                                {board.fundingOverview && (
                                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed font-light">{board.fundingOverview}</p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* 採用 */}
                          {board.hiringStatus === "募集中" && (
                            <div className="group/status flex items-start gap-4 p-4 bg-blue-50/30 border border-blue-200/40 rounded-2xl hover:bg-blue-50/50 hover:border-blue-300/60 transition-all duration-300">
                              <span className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg whitespace-nowrap flex-shrink-0 shadow-sm group-hover/status:shadow-md transition-all duration-300">
                                <Users className="w-3.5 h-3.5 mr-1.5" />
                              採用
                            </span>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-blue-900 mb-1.5">募集中</div>
                                {board.hiringOverview && (
                                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed font-light">{board.hiringOverview}</p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* 提案 */}
                          {board.proposalStatus === "募集中" && (
                            <div className="group/status flex items-start gap-4 p-4 bg-purple-50/30 border border-purple-200/40 rounded-2xl hover:bg-purple-50/50 hover:border-purple-300/60 transition-all duration-300">
                              <span className="inline-flex items-center px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-lg whitespace-nowrap flex-shrink-0 shadow-sm group-hover/status:shadow-md transition-all duration-300">
                                <Lightbulb className="w-3.5 h-3.5 mr-1.5" />
                              提案
                            </span>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-purple-900 mb-1.5">募集中</div>
                                {board.proposalOverview && (
                                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed font-light">{board.proposalOverview}</p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* 共創 */}
                          {board.collaborationStatus === "募集中" && (
                            <div className="group/status flex items-start gap-4 p-4 bg-pink-50/30 border border-pink-200/40 rounded-2xl hover:bg-pink-50/50 hover:border-pink-300/60 transition-all duration-300">
                              <span className="inline-flex items-center px-3 py-1.5 bg-pink-600 text-white text-xs font-bold rounded-lg whitespace-nowrap flex-shrink-0 shadow-sm group-hover/status:shadow-md transition-all duration-300">
                                <Handshake className="w-3.5 h-3.5 mr-1.5" />
                              共創
                            </span>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-pink-900 mb-1.5">募集中</div>
                                {board.collaborationOverview && (
                                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed font-light">{board.collaborationOverview}</p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* なしの場合 */}
                          {(!board.fundingStatus || board.fundingStatus === "なし") &&
                           board.hiringStatus !== "募集中" &&
                           board.proposalStatus !== "募集中" &&
                           board.collaborationStatus !== "募集中" && (
                            <div className="flex items-center gap-4 p-4 bg-slate-50/50 border border-slate-200/40 rounded-2xl">
                              <span className="inline-flex items-center px-3 py-1.5 bg-slate-400 text-white text-xs font-bold rounded-lg shadow-sm">
                              なし
                            </span>
                              <span className="text-xs text-gray-500 font-light">現在募集中のリソースはありません</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 上場ステータス */}
                      {board.listingStatus && board.listingStatus !== "未上場" && (
                        <div className="mt-4">
                          <div className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest flex items-center gap-3">
                            <span className="w-8 h-px bg-gradient-to-r from-amber-500 to-transparent"></span>
                            上場ステータス
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-lg shadow-sm">
                              <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                              {board.listingStatus}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* アクションボタン（下部） */}
                  <div className="mt-8 pt-6 border-t-2 border-gradient-to-r from-indigo-100 to-purple-100 bg-gradient-to-r from-indigo-50/30 via-purple-50/20 to-pink-50/20 -mx-8 lg:-mx-10 px-8 lg:px-10 pb-6">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                      {/* 気になるボタン */}
                      <button
                        onClick={(e) => handleLike(board.id, e)}
                        className={`group/btn flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                          likes[board.id]?.isLiked
                            ? 'bg-red-50 text-red-600 border-2 border-red-300 hover:bg-red-100 hover:border-red-400 shadow-md hover:shadow-lg'
                            : 'bg-white text-gray-600 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm hover:shadow-md'
                        }`}
                      >
                        <Heart 
                          className={`w-5 h-5 transition-all duration-300 ${likes[board.id]?.isLiked ? 'fill-red-600 text-red-600 animate-pulse' : 'group-hover/btn:scale-110'}`} 
                        />
                        <span className="font-bold">{likes[board.id]?.likeCount || 0}</span>
                      </button>

                      {/* 問い合わせるボタン - 目立つCTA */}
                      <Link
                        href={`/startup-boards/${board.id}`}
                        className="group/btn relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white text-base font-extrabold rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95 overflow-hidden"
                      >
                        {/* アニメーション背景 */}
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                        <Mail className="w-6 h-6 relative z-10 group-hover/btn:animate-bounce" />
                        <span className="relative z-10">問い合わせる</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/50 via-purple-400/50 to-pink-400/50 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 blur-xl"></div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


